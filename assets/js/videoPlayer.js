/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/videoPlayer.js":
/*!**************************************!*\
  !*** ./src/client/js/videoPlayer.js ***!
  \**************************************/
/***/ (() => {

eval("var video = document.querySelector(\"video\");\nvar playBtn = document.querySelector(\"#play\");\nvar muteBtn = document.querySelector(\"#mute\");\nvar volumeRange = document.querySelector(\"#volume\");\nvar currentTime = document.querySelector(\"#currentTime\");\nvar totalTime = document.querySelector(\"#totalTime\");\nvar timeline = document.querySelector(\"#timeline\"); // ### 기본 작동 원리 : video 태그의 volume, play, pause 등의 속성들과\n// 새로 만들어진 html 조절 태그들의 값을 연동시켜줌\n// 볼륨 값 변수 설정\n\nvar volumeValue = 0.5;\nvideo.volume = volumeValue; // 비디오 볼륨 값 디폴트 0.5 (html 태그와 동일하게 설정)\n// 재생버튼 클릭 시 콜백함수\n\nvar handlePlayClick = function handlePlayClick(e) {\n  // 원래 paused 상태였을 경우 클릭 시 재생\n  if (video.paused) {\n    // 정지 여부 반환\n    video.play(); // 시작 메서드\n  } // 반대 경우 수행\n  else {\n    video.pause();\n  }\n\n  playBtn.innerText = video.paused ? \"Play\" : \"Pause\";\n}; // 뮤트버튼 클릭 시 콜백함수\n\n\nvar handleMute = function handleMute(e) {\n  if (video.muted) {\n    // 메서드로 만들지 않고 아래와 같이 동작하게 함\n    // mdn 문서에서 readOnly가 아니어야지 가능\n    video.muted = false;\n  } else {\n    video.muted = true;\n  } // 버튼 안 글자를 삼항연산자로 변환\n\n\n  muteBtn.innerText = video.muted ? \"Unmute\" : \"Mute\"; // mute시 volumeRange를 0으로\n  // mute 해제시 원래 볼륨 값으로 돌아감\n\n  volumeRange.value = video.muted ? 0 : volumeValue;\n}; // 볼륨 조절 시 콜백함수\n\n\nvar handleVolumeInput = function handleVolumeInput(event) {\n  // console.log(event.target); ==> imput안의 속성 요소에 접근할 수 있음\n  // console.log(event.target.value); ==> imput안의 속성 요소의 값에 접근할 수 있음\n  var value = event.target.value;\n\n  if (video.muted) {\n    video.muted = false;\n    muteBtn.innerText = 'Mute';\n  }\n\n  volumeValue = value; // 비디오 볼륨 값에 대입되는 volume 변수에 html range 값을 대입\n\n  video.volume = volumeValue; // 실제 비디오 볼륨에 값 대입\n}; // 비디오 총 시간\n// event를 안받아도 loadedmetadata 이벤트가 발생해\n// 아래 함수가 실행되어야지 video의 duration을 알 수 있다.\n\n\nvar handleLoadedmetadata = function handleLoadedmetadata() {\n  totalTime.innerText = formatTime(Math.floor(video.duration)); // timeline 태그의 비디오 총길이 받기\n\n  timeline.max = Math.floor(video.duration);\n}; // 비디오 진행시간\n\n\nvar handleTimeUpdate = function handleTimeUpdate(event) {\n  // 시간 태그 안에 비디오 진행 시간을 넣어주되\n  // timeupdate 발생 시마다 넣어줘서 실시간 업데이트됨\n  currentTime.innerText = formatTime(Math.floor(video.currentTime)) + \" \"; // 비디오 진행시간 timeline 요소의 value 값으로 실시간 업데이트\n\n  timeline.value = Math.floor(video.currentTime);\n}; // 시간 형식 변경\n// 중괄호 안에 return을 써주지 않으면 변수가 값을 받지 못한다!!!!!\n\n\nvar formatTime = function formatTime(seconds) {\n  return new Date(seconds * 1000).toISOString().substring(14, 19);\n}; // timeline 태그 range 변경 시 실제 video range도 변경\n\n\nvar handleTimeline = function handleTimeline(event) {\n  var value = event.target.value;\n  video.currentTime = value;\n}; // 이벤트 리스너\n\n\nplayBtn.addEventListener(\"click\", handlePlayClick);\nmuteBtn.addEventListener(\"click\", handleMute);\nvolumeRange.addEventListener(\"input\", handleVolumeInput);\nvideo.addEventListener(\"loadedmetadata\", handleLoadedmetadata); // video 이외 정보(duration)\n\nvideo.addEventListener(\"timeupdate\", handleTimeUpdate); // video의 진행 위치(시간) update시 발생\n\ntimeline.addEventListener(\"input\", handleTimeline); // mdn 문서 event에 나왔있듯이 \n// change : 마우스 놓을 때 이벤트 발생\n// input : 실시간으로 이벤트 발생\n//. ==> 콜백 함수의 event인자를 통해 확인 가능\n\n/* HTMLMediaElement에 관한 MDN 문서를 살펴보면\n     * 속성 : eventListener가 어떠한 행동을 할 때의 조건을 bool 값으로 반환\n      ==> readOnly 요소는 속성 값 재지정 불가\n     * 메서드 : eventListener가 이벤트를 들었을 때 어떠한 행동을 해야하는지 확인\n     * 이벤트 : eventListener가 어떤 동작을 들어야 하는지 확인\n     * \n     ==> video, audio 태그는 HTMLMediaElement 인터페이스를 상속함\n     ==> 이때 video 태그의 속성과 메서드에 js가 접근할 수 있는 것\n*/\n\n//# sourceURL=webpack://wetube/./src/client/js/videoPlayer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/videoPlayer.js"]();
/******/ 	
/******/ })()
;