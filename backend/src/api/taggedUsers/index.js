import Router from "koa-router";
import * as taggedUsersCtrl from './taggedUsers.ctrl';
import * as postCtrl from '../posts/post.ctrl';
import getUserById  from "../../lib/getUserById";
import getPostById from "../../lib/getPostById";

const tag = new Router();

// ※ /:id 에서 id의 값은 post의 ObjectId값임
// 댓글 달기 http://127.0.0.1:4000/api/tag POST
//두개 이상의 값을 전달하려면 app.get('/topic/:id/:mode' 이런식으로 /:변수명/:변수명 이어서 작성한다.
tag.post('/:id', postCtrl.getPostById ,taggedUsersCtrl.tag);


export default tag;