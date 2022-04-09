const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js"
  },
  mode: "development", //production모드이면 output에 코드를 계속 압축한다.
  watch: true, // 계속 업데이트
  plugins: [new MiniCssExtractPlugin({
    filename: "css/styles.css"
  })],
  output: {
    filename: "js/[name].js", // 밑에서 assets 바로 밑에 저장 설정해도 js 폴더 안에 생성됨
    path: path.resolve(__dirname, "assets"), // css 파일을 assets 폴더 바로 하위에 생성되게
    clean: true // output 폴더 정리
  },
  module: {
    rules: [
      {
        test: /\.js$/, // js파일을 변환
        use: {
          loader: 'babel-loader', // 바벨 로더 사용
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      {
        test: /\.scss$/, // scss파일을 변환
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] // webpack은 역순으로 읽음
      }
    ]
  }
}

// path.resolve : 인자로 받은 값들을 url로 연결
// __dirname: js 기본제공 상수. 파일 전체 경로

