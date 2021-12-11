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

// 127.0.0.1:4000/api/auth/delete/:id     삭제
auth.delete('/delete/:id', checkLoggedIn, authCtrl.remove);

// 127.0.0.1:4000/api/auth/logout   로그아웃
auth.post('/logout',authCtrl.logout);

// 127.0.0.1:4000/api/auth/sendemail  비밀번호 재설정 이메일 발송
auth.post('/sendemail',emailCtrl.sendPasswordResetEmail);
// 127.0.0.1:4000/api/auth/receive_new_password/:userId/:token
auth.post('/receive_new_password/:userId/:token', emailCtrl.receiveNewPassword);

// 127.0.0.1:4000/api/auth/changepw  비밀번호 변경
auth.patch('/changePassword/:id',checkLoggedIn, authCtrl.changePassword);
export default auth;