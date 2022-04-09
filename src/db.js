import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log("DB Error", error); 
db.on("error", handleError); // on : 여러번 발생 가능(이벤트) ==> db error 발생시 
db.once("open", handleOpen); // once : 오직 한번만 발생 ==> db connection시 


