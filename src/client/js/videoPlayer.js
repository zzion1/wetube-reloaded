const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const timeline = document.querySelector("#timeline");

// ### 기본 작동 원리 : video 태그의 volume, play, pause 등의 속성들과
// 새로 만들어진 html 조절 태그들의 값을 연동시켜줌

// 볼륨 값 변수 설정
let volumeValue = 0.5 
video.volume = volumeValue; // 비디오 볼륨 값 디폴트 0.5 (html 태그와 동일하게 설정)

// 재생버튼 클릭 시 콜백함수
const handlePlayClick = (e) => {
  // 원래 paused 상태였을 경우 클릭 시 재생
  if (video.paused){ // 정지 여부 반환
    video.play(); // 시작 메서드
  }
  // 반대 경우 수행
  else{
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
}
// 뮤트버튼 클릭 시 콜백함수
const handleMute = (e) => {
  if (video.muted){
    // 메서드로 만들지 않고 아래와 같이 동작하게 함
    // mdn 문서에서 readOnly가 아니어야지 가능
    video.muted = false; 
  }
  else{
    video.muted = true;
  }
  // 버튼 안 글자를 삼항연산자로 변환
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  // mute시 volumeRange를 0으로
  // mute 해제시 원래 볼륨 값으로 돌아감
  volumeRange.value = video.muted ? 0 : volumeValue;
}
// 볼륨 조절 시 콜백함수
const handleVolumeInput = (event) => {
  // console.log(event.target); ==> imput안의 속성 요소에 접근할 수 있음
  // console.log(event.target.value); ==> imput안의 속성 요소의 값에 접근할 수 있음
  const {target: {value}} = event;
  if(video.muted){
    video.muted = false;
    muteBtn.innerText = 'Mute';
  }
  volumeValue = value; // 비디오 볼륨 값에 대입되는 volume 변수에 html range 값을 대입
  video.volume = volumeValue; // 실제 비디오 볼륨에 값 대입

}

// 비디오 총 시간
// event를 안받아도 loadedmetadata 이벤트가 발생해
// 아래 함수가 실행되어야지 video의 duration을 알 수 있다.
const handleLoadedmetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  // timeline 태그의 비디오 총길이 받기
  timeline.max = Math.floor(video.duration);
}

// 비디오 진행시간
const handleTimeUpdate = (event) => {
  // 시간 태그 안에 비디오 진행 시간을 넣어주되
  // timeupdate 발생 시마다 넣어줘서 실시간 업데이트됨
  currentTime.innerText = formatTime(Math.floor(video.currentTime)) + " ";
  // 비디오 진행시간 timeline 요소의 value 값으로 실시간 업데이트
  timeline.value = Math.floor(video.currentTime);
}

// 시간 형식 변경
// 중괄호 안에 return을 써주지 않으면 변수가 값을 받지 못한다!!!!!
const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substring(14,19);
}

// timeline 태그 range 변경 시 실제 video range도 변경
const handleTimeline = (event) => {
  const {target: {value}} = event;
  video.currentTime = value;
}

// 이벤트 리스너
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeInput); 
video.addEventListener("loadedmetadata", handleLoadedmetadata); // video 이외 정보(duration)
video.addEventListener("timeupdate", handleTimeUpdate); // video의 진행 위치(시간) update시 발생
timeline.addEventListener("input", handleTimeline);


// mdn 문서 event에 나왔있듯이 
// change : 마우스 놓을 때 이벤트 발생
// input : 실시간으로 이벤트 발생
//. ==> 콜백 함수의 event인자를 통해 확인 가능

/* HTMLMediaElement에 관한 MDN 문서를 살펴보면
     * 속성 : eventListener가 어떠한 행동을 할 때의 조건을 bool 값으로 반환
      ==> readOnly 요소는 속성 값 재지정 불가
     * 메서드 : eventListener가 이벤트를 들었을 때 어떠한 행동을 해야하는지 확인
     * 이벤트 : eventListener가 어떤 동작을 들어야 하는지 확인
     * 
     ==> video, audio 태그는 HTMLMediaElement 인터페이스를 상속함
     ==> 이때 video 태그의 속성과 메서드에 js가 접근할 수 있는 것
*/
