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

eval("var video = document.querySelector(\"video\");\nvar play = document.querySelector(\"#play\");\nvar mute = document.querySelector(\"#mute\");\nvar time = document.querySelector(\"#time\");\nvar volume = document.querySelector(\"#volume\");\n\nvar handlePlay = function handlePlay(e) {};\n\nvar handleMute = function handleMute(e) {\n  // 원래 paused 상태였을 경우 클릭 시 재생\n  if (video.paused) {\n    video.play();\n  } // 반대 경우 수행\n  else {\n    video.paused();\n  }\n};\n\nplay.addEventListener(\"click\", handlePlay);\nmute.addEventListener(\"click\", handleMute);\n\n//# sourceURL=webpack://wetube/./src/client/js/videoPlayer.js?");

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