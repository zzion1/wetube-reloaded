import multer from "multer";


// res 객체 안의 local 객체 존재
// pug에서 자동으로 import 되어 사용 가능
// local객체 값 변경 가능
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = req.session.loggedIn; // local에 loggedIn정보 저장
  res.locals.loggedInUser = req.session.user || {}; // local에 user정보 저장, 비로그인 접속시 빈 객체
  res.locals.siteName = 'Wetube';
  console.log(req.session.user);
  next(); // 반드시 호출
}

export const protectorMiddleware = (req, res, next) => {
  // 로그인시 그냥 진행
  if (req.session.loggedIn){
    next()
  }
  // 비로그인시 로그인페이지로 이동
  else{
    return res.redirect("/login");
  }
}

export const publicOnlyMiddleware = (req, res, next) => {
  // 비로그인시 그냥 진행
  if (!req.session.loggedIn){
    return next();
  }
  // 로그인 시 홈페이지로 이동
  else{
    return res.redirect("/");
  }
}

export const avatarUpload = multer({
   dest: 'uploads/avatars/',
   limits: {
     fileSize: 3000000
   }
}); 

export const videoUpload = multer({
   dest: 'uploads/videos/',
   limits: {
     fileSize: 10000000
   }
}); 