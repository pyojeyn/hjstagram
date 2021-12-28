import Router from "koa-router";
import  * as postCtrl from './post.ctrl';
import checkLoggedIn from "../../lib/chekLoggedIn";
import getUserById from "../../lib/getUserById";
const posts = new Router();


// 127.0.0.1:4000/api/posts    files : attachment name속성이랑 이름 같아야함
posts.post('/',checkLoggedIn, postCtrl.write);
// 127.0.0.1:4000/api/posts
posts.get('/',postCtrl.list);

posts.patch('/editprofileurl', postCtrl.editprofileurl);

posts.patch('/editusername',postCtrl.editusername);



const post = new Router();


// 127.0.0.1:4000/api/posts/id
post.get('/', postCtrl.read);

// 127.0.0.1:4000/api/posts/id
post.delete('/',checkLoggedIn, postCtrl.checkOwnPost, postCtrl.remove);

// 좋아요 +1 post id 넘겨줌
// 127.0.0.1:4000/api/posts/${}/addlike
post.patch('/addlike', postCtrl.addLike);

// 좋아요 -1 post id 넘겨줌
// 127.0.0.1:4000/api/posts/61b80dac1e24c192d5503fb6/canclelike
post.patch('/canclelike', postCtrl.cancleLike);

// 좋아요 눌렸을때 좋아요 누른 사람 배열에 추가
//api/posts/${}/likeby
post.patch('/likeby', postCtrl.likeby);

// 좋아요 취소했을 때 좋아요 누른 사람 배열에서 삭제
// api/posts/${}/cancleLikeby
post.patch('/cancleLikeby', postCtrl.cancleLikeby);

// 파일 첨부할때 url 넘겨줌
post.patch('/', postCtrl.path);

// 댓글 달렸을 때
//  api/posts/${ID}/givecomment
post.patch('/givecomment',postCtrl.giveComment)

// 댓글 삭제했을 때
// api/posts/${ID}/${comment객체_id}/deleteComment
post.patch('/:cid/deleteComment', postCtrl.deleteComment);

posts.use('/:id',postCtrl.getPostById, post.routes());






export default posts;


