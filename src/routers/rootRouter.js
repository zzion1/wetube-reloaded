import express from "express";
import {getLogin, getJoin, postJoin, postLogin} from "../controllers/userController"
import {home, search} from "../controllers/videoController"
import {publicOnlyMiddleware} from "../middlewares"


const rootRouter = express.Router(); // home url

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
// default export 시 import 할 때 변수 이름 사용자 지정 가능