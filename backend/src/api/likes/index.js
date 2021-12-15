import Router from "koa-router";
import * as likesCtrl from './likes.ctrl';
import * as postCtrl from '../posts/post.ctrl';
import checkLoggedIn from '../../lib/chekLoggedIn';

const likes = new Router();
// ※ /:id 에서 id의 값은 post의 ObjectId값임
// 좋아요 누르기  http://127.0.0.1:4000/api/likes POST
likes.post('/:id', checkLoggedIn, postCtrl.getPostById, likesCtrl.addlike);

// 좋아요 취소 http://127.0.0.1:4000/api/likes DELETE 여기에 있는 id 아마도 좋아요 누른 user모델꺼 가져와야 할듯; 
likes.delete('/:id',checkLoggedIn, likesCtrl.cancelLike);

// 좋아요 리스트 Post스키마의 _id 값 넘겨줌
// http://127.0.0.1:4000/api/likes/likelist?id=619f1a432efc813fb1e43168
likes.get('/likelist',likesCtrl.likePeopleList);
export default likes;
