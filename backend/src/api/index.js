import Router from 'koa-router';
import auth from './auth';
import posts from './posts';
import files from './files';
import profilePic from './profilePics';

const api = new Router();

// 127.0.0.1:4000/api/auth
api.use('/auth', auth.routes());

// 127.0.0.1:4000/api/posts
api.use('/posts',posts.routes());

// 127.0.0.1:4000/api/files
api.use('/files',files.routes());

// 127.0.0.1:4000/api/profilePic
api.use('/profilePic', profilePic.routes());
export default api;