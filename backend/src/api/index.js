import Router from 'koa-router';
import auth from './auth';
import follow from './following';

const api = new Router();


// 127.0.0.1:3000/api/auth
api.use('/auth', auth.routes());
api.use('/follow', follow.routes());

export default api;