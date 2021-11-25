import Router from 'koa-router';
import auth from './auth';
import follow from './following';
import posts from './posts';
import comments from './comments';

const api = new Router();


// 127.0.0.1:4000/api/auth
api.use('/auth', auth.routes());
// 127.0.0.1:4000/api/follow
api.use('/follow', follow.routes());
// 127.0.0.1:4000/api/posts
api.use('/posts',posts.routes());
// 127.0.0.1:4000/api/comments
api.use('/comments',comments.routes());

export default api;