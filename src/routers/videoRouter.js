import express from "express";
import {watch, getEdit, postEdit, getUpload, postUpload, deleteVideo} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

// :id 위에 두어야만 :4000/upload url로 이동했을 때 upload를 id param으로 안받는다.
// ==> but 정규표현식 사용으로 상관 없어짐
videoRouter.route("/:id([0-9a-f]{24})").get(watch); // ([0-9a-f]{24}) : 16진수, 24자리
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.single("video"), postUpload);

export default videoRouter; 
// 모든 파일은 독립 모듈이어서 외부 공유를 위해선 export 필요