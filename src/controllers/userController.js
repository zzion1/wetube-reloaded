import User from "../models/User"
import Video from "../models/Video"
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { redirect } from "express/lib/response";




// 회원가입
export const getJoin = (req, res) => {
  res.render("users/join", {pageTitle: "Join"}); 
}

export const postJoin = async (req, res) => {
  const {name, email, username, password, password2, location} = req.body;
  // 회원가입 시 비밀번호 중복 확인
  if (password !== password2){
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage : "Password not matched"
    });
  }
  // $or:[{조건1}, {조건2}...] => 조건 중 하나라도 만족하면 반환
  const exists = await User.exists({$or:[{username:username}, {email}]});
  // 회원가입시 유저네임, 이메일 중복확인
  if (exists){
    // validation 미통과 시 브라우저가 저장 메세지 띄우지 못하게 상태코드 변경
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage : "This userName or Email is already taken"
    });
  }
  try{
    await User.create({
      name,
      username,
      email, 
      password,
      location
    });
    return res.redirect("/login");
  } catch(error) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: error._message
    });
  }
}




// 로그인
export const getLogin = (req, res) => {
  res.render("users/login", {pageTitle: 'Login'});
}

export const postLogin = async (req, res) => {
  const {username, password} = req.body;
  // 사용자 입력한 username, 기본 로그인(github 로그인x) 해당하는 데이터 db에서 가져오기
  const user = await User.findOne({username, socialOnly: false});

  // check if account exists
  if (!user){
    return res.status(400).render("users/login", {
      pageTitle: "Login", 
      errorMessage: "Account Username not found."
    });
  }

  // check if password exists
  const ok = await bcrypt.compare(password, user.password);
  if (!ok){
    return res.status(400).render("users/login", {
      pageTitle: "Login", 
      errorMessage: "Wrong password"
    });
  }

  // !!!해당 브라우저 세션에!!! loggedIn, user라는 새로운 정보 저장
  req.session.loggedIn = true;
  req.session.user = user;

  //로그인 시 home
  res.redirect("/");
}




// 깃허브 로그인
// 1) Users are redirected to request their GitHub identity
export const startGithubLogin = (req, res) => {
  // 기본 github 인증 url
  const baseUrl = `https://github.com/login/oauth/authorize`;
  // url에 추가할 params 정보가 담긴 객체
  const config = {
    client_id: process.env.GH_CLIENT, // 이경우 비밀이 아니라 자주사용되어서 env에 넣어둠
    allow_signup: false,
    scope: "read:user user:email"
  }
  // 객체를 url화
  const params = new URLSearchParams(config).toString(); 
  //사용자를 redirect할 최종 url
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
}

// 2) Users are redirected back to your site by GitHub (with code in callbackURL)
// 3) Your app accesses the API with the user's access token
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code //redirect url에 명시되어있는 code
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  // access_token을 가져오는 api 주소로 code와 기타 정보를 담아 fetch(post)
  const data = await fetch(finalUrl, {
    method:"POST",
    headers: {
      Accept: "application/json" // 이 설정을 안하면 text로 return
    }
  });
  // access_token이 담겨있는 data를 json화 
  const tokenRequest = await data.json();
  // data에 access_token이 있다면
  if ("access_token" in tokenRequest){
    const {access_token} = tokenRequest;
    const apiUrl = "https://api.github.com";
    // 유저 정보 가져오기 api
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`
        }
      })
    ).json();
    console.log(userData);
    // email 정보 가져오기 api (위에서 email이 private이어서 null 값이라면)
    const emailData = await(
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`
        }
      })
    ).json();
    console.log(emailData);
    // 여러 email 중 primary와 verified가 true인 값만 찾아냄
    // callback 함수 중괄호 감싸면 안됨?
    const emailObj = emailData.find((email) => 
      email.primary === true && email.verified === true
    );
    // email이 없을 경우 로그인페이지로 redirect
    if (!emailObj){
      return res.redirect("/login");
    }
    let user = await User.findOne({email: emailObj.email});
    if (!user){
      // github와 동일한 email을 가진 user객체가 db에 없다면
      // github data 바탕으로 계정 생성
      user = await User.create({
      avatarUrl : userData.avatar_url,
      name : userData.name,
      username : userData.login,
      email : emailObj.email, 
      password : "",
      socialOnly: true, // github email 로그인이어서 password가 필요없음
      location : userData.location 
      });
    }
    // 1) github와 동일한 email을 가진 user객체가 db에 있다면 바로 로그인 진행
    // 2) 없다면 위에서 생성한 계정으로 로그인 진행
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } 
  // access_token이 없다면
  else{
    return res.redirect("/login");
  }
}



// 로그아웃
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
}



// 프로필 수정
export const getEdit = (req, res) => {
  res.render("users/edit-profile", {pageTitle: "Edit Profile"});
} 
export const postEdit = async (req, res) => {
  // form data와 user 객체의 id를 한번에 받기
  // req.file은 postEdit 이전에 multer가 동작해서 가능
  const {session: {user: {_id, avatarUrl}}, body: {name,email,username,location}, file} = req;
  // form data update
  const updatedUser = await User.findByIdAndUpdate(_id, {
    // file O : 업로드한 파일의 path || file X : 기존 user의 avatarUrl
    avatarUrl: file ? file.path : avatarUrl,
    name,
    email,
    username,
    location
  }, {new: true}); // update한 이후의 값 return 하는 option
  // update된 db가 view에는 적용되지 않기에 session을 따로 update
  req.session.user = updatedUser;

  return res.redirect("/users/edit");
}



// 비밀번호 변경
export const getChangePassword = (req, res) => {
  return res.render("users/change-password", {pageTitle: "Change Password"});
}

export const postChangePassword = async (req, res) => {
  const {session: {user: {_id, password}}, body: {oldPassword, newPassword, newPasswordConfirmation}} = req;

  // 기존 비밀번호 db와의 일치여부 확인
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok){
    return res.status(400).render("users/change-password", {pageTitle: "Change Password", errorMessage: "incorrect pw"})
  }

  // 새로 입력한 비밀번호 일치 여부 확인
  if (newPassword !== newPasswordConfirmation){
    return res.status(400).render("users/change-password", {pageTitle: "Change Password", errorMessage: "pw not matched"})
  }

  // 로그인된 user 찾기
  const user = await User.findById(_id);
  // 새로운 비밀번호로 업데이트
  user.password = newPassword;
  // user 객체 db에 저장 (비밀번호 hash화 middleware 동작)
  user.save();
  // 비밀번호 변경 시 로그아웃
  return res.redirect("/users/logout");
}


// 프로필 보기
export const see = async (req, res) => {
  const {id} = req.params;
  // 항상 videos를 video 객체로 바꿔주는 것이 아닌 이 url 접속 시에만 populate
  const user = await User.findById(id).populate("videos");
  if(!user){
    return res.status(404).render("404", {pageTitle: "User not found"});
  }

  return res.render("users/profile", {pageTitle: user.username, user});
}

