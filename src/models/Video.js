import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {type: String, required: true, trim: true, maxlength: 80}, 
  fileUrl: {type: String, required: true},
  description:{type: String, required: true, trim: true, minlength: 20},
  createdAt: {type: Date, required: true, default: Date.now}, 
  // 데이터 입력 안되면 오류 & 안써줘도 기본값을 넣어줌(둘의 기능이 겹치긴 함)
  hashtags: [{type: String, trim: true}], //t trim : 양쪽 공백삭제, 자동 array 형태로 저장
  meta: {
    views: {type: Number, default: 0, required: true} ,
    rating: {type: Number, default: 0, required: true} 
  },
  owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
});

// save query 작동 전 middleware 설정
// 아래 방법은 save 쿼리에서만 작동. findOneAndUpdate는 this doc에 접근이 불가해 다른 방법 권장
/* videoSchema.pre('save', async function(){
  this.hashtags = this.hashtags[0].split(",").map((word) => word.startsWith("#") ? word: `#${word}`);
}); */

videoSchema.static("formatHashtags", function(hashtags){
  return hashtags.split(",").map((word) => word.startsWith("#") ? word: `#${word}`);
});

// videoSchema형식의 모델 생성
const Video = mongoose.model("Video", videoSchema); 

// 다른 곳에서 import 할 수 있게 export
export default Video; 