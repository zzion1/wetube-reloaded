import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  avatarUrl : String,
  socialOnly: {type: Boolean, default: false}, // true일경우 github 로그인만 가능(password 로그인x), 기본값은 false로
  username: {type: String, required: true, unique: true},
  password: {type: String, required: false}, // github 로그인 때문에 required: false
  name: {type: String, required: false}, // github에 name 설정 안해서 null 값 return 될 수 있기에
  location: String,
  videos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Video'}] // 배열처리
});

userSchema.pre('save', async function(){
  if (this.isModified("password")){
    // this.password : 유저가 입력한 비밀번호
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model('User', userSchema);

export default User;