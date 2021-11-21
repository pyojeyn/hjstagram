import Router from 'koa-router';
import  * as authCtrl from './auth.ctrl';
import * as emailCtrl from './email.ctrl';
import checkLoggedIn from '../../lib/chekLoggedIn';

const auth = new Router();
// 127.0.0.1:4000/api/auth/register  회원가입
auth.post('/register', authCtrl.register);

// 127.0.0.1:4000/api/auth/login   로그인
auth.post('/login',authCtrl.login);

// 127.0.0.1:4000/api/auth/check   로그인체크
auth.get('/check',authCtrl.check);

// 127.0.0.1:4000/api/auth/edit/:id     수정
auth.patch('/edit/:id',checkLoggedIn,authCtrl.edit);

// 127.0.0.1:4000/api/auth/edit/:id     삭제
auth.delete('/delete/:id', checkLoggedIn, authCtrl.remove);

// 127.0.0.1:4000/api/auth/logout   로그인
auth.post('/logout',authCtrl.logout);

// 127.0.0.1:4000/api/auth/sendemail  이메일 인증코드 발송
auth.post('/sendemail',emailCtrl.sendEmailAuthenticationCode);

// 127.0.0.1:4000/api/auth/changepw  비밀번호 변경
auth.patch('/changepw/:id',checkLoggedIn, authCtrl.changepw);
export default auth;