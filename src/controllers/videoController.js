import Video from "../models/Video";
import User from "../models/User";


/*
  # 콜백함수 사용시 #
   Video.find({}, (error, videos) => {
    if(error){
      return res.render("videos/server-error"); 
    }
    return res.render("videos/home", {pageTitle: "Home", videos: []}); 
  }); 
  // 콜백함수의 형태로 find query문 작성. {} : 모든 형태의 search
  // render는 무조건 db search보다 먼저 실행되기에 콜백함수로 쿼리문 안에 넣어줘야
  // db가 search된 이후에 그 데이터를 가지고 페이지를 rendering
*/



// 홈페이지 : 모든 영상 정보 출력
export const home = async (req, res) => {
  // promise 사용시
  try{
    const videos = await Video.find({}).sort({createdAt: "asc"}).populate("owner"); // find한 db를 videos 변수에 대입. 보여주기 방식 설정 가능
    return res.render("videos/home", {pageTitle: "Home", videos})
  } catch{
    return res.render("videos/server-error"); // 에러 발생 시 try, catch 구문 사용
  }
}




// 홈페이지에서 영상 특정 영상 보기
export const watch = async (req, res) => {
  const {id} = req.params; // es6. 
  const video = await Video.findById(id).populate("owner"); // video 객체의 owner 필드를 user객체로 채우기
  if (!video){ // 보통 에러가 있을 경우를 if문으로 감싸줌
    return res.render("404", {pageTitle: "Video not found."}); // 잘못된 주소 이동시 에러handle
  }
  // 그리고 정상동작 구문을 바깥으로 빼줌
  return res.render("videos/watch", {pageTitle: video.title, video}); 
}




// 영상 수정
export const getEdit = async (req, res) => {
  const {id} = req.params; 
  const {user: {_id}} = req.session;
  const video = await Video.findById(id);
  if (!video){
    return res.status(404).render("404", {pageTitle: "Video not found."}); 
    // 잘못된 주소 이동시 에러handle
    // 반드시 return으로 에러발생시 끝내주는 것이 중요
  }
  // 영상 owner가 아니면 홈으로 redirect
  // 자료형이 같지 않으면 false
  if (String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
  }
  res.render("videos/edit", {pageTitle: `Editing ${video.title}`, video}); 
}
export const postEdit = async (req, res) => {
  const {user: {_id}} = req.session;
  const {id} = req.params; // url로 부터 받는 변수
  const {title, description, hashtags} = req.body; // edit form data
  const video = await Video.exists({_id: id}); // 데이터 존재 유무를 조건으로 검색해 bool값으로 반환
  if (!video){
    return res.status(404).render("404", {pageTitle: "Video not found."}); 
  }
  // 영상 owner가 아니면 홈으로 redirect
  // 자료형이 같지 않으면 false
  if (String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
  }
  // 방법 1) edit form에서 받아온 업데이트 정보들을 video.title = title 이런식으로 대입한후 save() 가능
  // 방법 2) findByIdAndUpdate 쿼리문 사용
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags)
  });
  return res.redirect(`/videos/${id}`);
}




// 영상 업로드
export const getUpload = (req, res) => {
  return res.render("videos/upload", {pageTitle:"upload video"});
}

export const postUpload = async (req, res) => {
  const {user: {_id}} = req.session;
  const {body: {title, description, hashtags}, file: {path}} = req;
  // js 객체 생성 및 저장을 자동으로 해주는 형태
  // 객체를 만들고 .save()로 해줄 수는 방법도 있음
  try {
    const newVideo = await Video.create({ 
      fileUrl: path, // video file url
      title,
      description,
      owner: _id, // user 객체 id
      hashtags: Video.formatHashtags(hashtags)
    });
    // 비디오 객체 생성시 'user 객체의 videos 필드'에 video id 추가
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    // 성공시 홈페이지로 이동
    return res.redirect("/"); 
  } catch(error) {
    return res.status(400).render("videos/upload", {pageTitle:"upload video", errorMessage: error._message}); 
    //업로드 페이지 re-rendering
    // 에러 메세지 중 _message 부분만 변수로 render페이지에 보냄
  }
}




// 영상 삭제
export const deleteVideo = async (req, res) => {
  const {id} = req.params;
  const {user: {_id}} = req.session;
  const video = await Video.findById(id);
  if (!video){
    return res.status(404).render("404", {pageTitle: "Video not found."}); 
  }
  // 영상 owner가 아니면 홈으로 redirect
  // 자료형이 같지 않으면 false
  if (String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
}




// 영상 검색
export const search = async (req, res) => {
  const {keyword} = req.query;
  let videos = []; // 처음 search page 접속 시 empty
  if (keyword){
    videos = await Video.find({ // 이후 keyword로 검색 시 array가 update됨 
      title: {
        $regex: new RegExp(keyword, "i") // title에 keyword를 '포함'하는 결과값. i : 대소문자 구분x 옵션
        // ^${keyword} : keyword로 시작하는 단어
        // ${keyword}$ : keyword로 끝나는 단어
        // $gt : ~보다 큰 값
      }
    }).populate("owner");
  }
  return res.render("videos/search", {pageTitle: "Search", videos});
}
