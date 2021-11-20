require = require('esm')(module);  
module.exports = require('./main.js');

// require로 esm 모듈을 불러오고
// 모듈을 불러온 상태에서 main.js를 불러와서 여기에서 실행 !
// 노드js는 파일이 같은 위치에 있어도 앞에다 ./를 붙여줘야 한다.