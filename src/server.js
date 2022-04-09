import express from "express";
import { get } from "express/lib/response";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

// 서버 : client의 request를 listening함
const app = express(); // 1) express 앱 생성
const logger = morgan("dev"); //logger기능을 하는 middleware 패키지 common, short 등 다양한 옵션

// view engine(pug)
app.set("views", process.cwd() + "/src/views"); // view 폴더위치를 현재 작업폴더가 아닌, src안에 있다고 명시
app.set("view engine", "pug"); // 뷰엔진을 퍼그로 설정

//middelware (모든 request 실행 '전에' 거치는 middleware. 그래서 아래 라우터보다 먼저 써줌)
app.use(express.urlencoded({extended:true})); // form의 data들을 사용가능한 js 형태로 변경
app.use(logger);  
app.use(session({
  secret: process.env.COOKIE_SECRET, // 브라우저에 보내주는 쿠키에 sign
  resave: false,
  saveUninitialized: false, // 세션 수정시에만 db에 저장 및 쿠키로 넘겨줌
  /* cookie: {maxAge: 10000}, 만료일 설정 */
  store: MongoStore.create({mongoUrl: process.env.DB_URL})
}));
// session 설정 다음에 위치 시켜야 req.session을 middleware에서 사용가능
app.use(localsMiddleware); // local에 data 저장 및 pug 활용 가능

// router
app.use("/uploads", express.static("uploads")); // 해당 url 접근시 static("~") 폴더를 브라우저에 노출
app.use("/assets", express.static("assets")); 
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;















