import express from "express";
import {remove, logout, see, startGithubLogin, finishGithubLogin, getEdit, postEdit, getChangePassword, postChangePassword} from "../controllers/userController";
import { avatarUpload, protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware , logout); // 로그인시에만 접근가능한 페이지
// 로그인시에만 접근가능한 페이지
// uploadFiles middleware가 input에서 avatar라는 name의 파일을 받아 upload 폴더에 저장 후 postEdit 실행
// upload.single => 하나의 파일만 업로드
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit); 
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin); // 비로그인시에만 접근가능한 페이지
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin); // 비로그인시에만 접근가능한 페이지
userRouter.get("/:id", see);

export default userRouter;