import Router from 'koa-router';
import  * as authCtrl from './auth.ctrl';

const auth = new Router();
// 127.0.0.1:3000/api/auth/register
auth.post('/register', authCtrl.register);

// 127.0.0.1:3000/api/auth/login
auth.post('/login',authCtrl.login);

export default auth;