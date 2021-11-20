import Router from 'koa-router';
import auth from './auth';

const api = new Router();


// 127.0.0.1:3000/api/auth
api.use('/auth', auth.routes());

export default api;