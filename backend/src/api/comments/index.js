import Router from "koa-router";
import * as commentCtrl from './comment.ctrl';
import checkLoggedIn from "../../lib/chekLoggedIn";
import  * as postCtrl from '../posts/post.ctrl';

const comments = new Router();

comments.post('/:id', checkLoggedIn, postCtrl.getPostById, commentCtrl.write);
comments.delete('/:id',checkLoggedIn, commentCtrl.remove);

export default comments;