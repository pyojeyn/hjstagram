import Router from "koa-router";
import  * as postCtrl from './post.ctrl';
import checkLoggedIn from "../../lib/chekLoggedIn";

const posts = new Router();


// 127.0.0.1:4000/api/posts    files : attachment name속성이랑 이름 같아야함
posts.post('/',checkLoggedIn, postCtrl.write);
// 127.0.0.1:4000/api/posts
posts.get('/',postCtrl.list);

const post = new Router();

// 127.0.0.1:4000/api/posts/id
post.get('/', postCtrl.read);

// 127.0.0.1:4000/api/posts/id
post.delete('/',checkLoggedIn, postCtrl.checkOwnPost, postCtrl.remove);

// 좋아요 +1 post id 넘겨줌
// 127.0.0.1:4000/api/posts/61b80dac1e24c192d5503fb6/addlike
post.patch('/addlike', postCtrl.addLike);

// 좋아요 -1 post id 넘겨줌
// 127.0.0.1:4000/api/posts/61b80dac1e24c192d5503fb6/canclelike
post.patch('/canclelike', postCtrl.cancleLike);

posts.use('/:id',postCtrl.getPostById, post.routes());






export default posts;


