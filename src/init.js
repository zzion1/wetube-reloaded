import "dotenv/config"; // 환경변수파일 읽어주는 패키지 연결
import "./db"; // db(mongoose) 파일 연결
import "./models/Video" // Video data model 파일 연결
import "./models/User"// User data model 파일 연결
import app from "./server"

const PORT = 4000;

const handleListening = (req, res) => console.log(`Server Listening On Port http://localhost:${PORT}`);
// 콜백함수에는 response와 request라는 기본 객체를 express로부터 받음
// =>> 해당 url로 request가 들어오면 express는 콜백함수에 request와 response object를 넣어줌
// 그리고 response와 request 객체는 다양한 속성과 메서드를 가지고 있음. 

app.listen(PORT, handleListening); // 포트번호/콜백함수(서버실행시 실행) // 2) 외부 접속을 listen

// 브라우저는 웹사이트를 request하고 페이지를 가져다줌
// get방식(request) : http method. 특정 url의 페이지를 '가져옴' 
// "/" : 서버의 root page를 의미