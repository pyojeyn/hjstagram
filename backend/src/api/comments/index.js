import Router from "koa-router";
import * as commentCtrl from './comment.ctrl';
import checkLoggedIn from "../../lib/chekLoggedIn";
import  * as postCtrl from '../posts/post.ctrl';

const comments = new Router();

// ※ /:id 에서 id의 값은 post의 ObjectId값임
// 댓글 달기 http://127.0.0.1:4000/api/comments POST
comments.post('/:id', checkLoggedIn, postCtrl.getPostById, commentCtrl.write);

// 댓글삭제 http://127.0.0.1:4000/api/comments DELETE
comments.delete('/:id',checkLoggedIn, commentCtrl.remove);

// 댓글 리스트 Post스키마의 _id 값 넘겨줌
// http://127.0.0.1:4000/api/comments/commentslist?id=619f1a432efc813fb1e43168
comments.get('/commentslist', commentCtrl.commentslist);

export default comments;