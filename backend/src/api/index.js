import Router from 'koa-router';
import auth from './auth';
import follow from './following';
import posts from './posts';
import comments from './comments';
import likes from './likes';
import tag from './taggedUsers';
import files from './files';

const api = new Router();


// 127.0.0.1:4000/api/auth
api.use('/auth', auth.routes());
// 127.0.0.1:4000/api/follow
api.use('/follow', follow.routes());
// 127.0.0.1:4000/api/posts
api.use('/posts',posts.routes());
// 127.0.0.1:4000/api/comments
api.use('/comments',comments.routes());
// 127.0.0.1:4000/api/likes
api.use('/likes', likes.routes());
// 127.0.0.1:4000/api/tag
api.use('/tag',tag.routes());
// 127.0.0.1:4000/api/files
api.use('/files',files.routes());
export default api;