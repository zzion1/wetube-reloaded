const video = document.querySelector("video");
const play = document.querySelector("#play");
const mute = document.querySelector("#mute");
const time = document.querySelector("#time");
const volume = document.querySelector("#volume");

const handlePlay = (e) => {

}

const handleMute = (e) => {
  // 원래 paused 상태였을 경우 클릭 시 재생
  if (video.paused){
    video.play();
  }
  // 반대 경우 수행
  else{
    video.paused();
  }
}

play.addEventListener("click", handlePlay);
mute.addEventListener("click", handleMute);
