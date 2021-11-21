import Router from 'koa-router';
import * as followCtrl from './follow.ctrl';
import checkLoggedIn from '../../lib/chekLoggedIn';

const follow = new Router();

//팔로잉
/*
{
    "recieverid" : [ {"user" : {
        "_id": "61999af15f5665f64ae4f69a",
        "username":"minjung"
    }}],
    "senderid" :[{"user": {
        "_id":"6199a4858a4496e26a3e2bee",
        "username":"chokid"
    }}]
}
*/
follow.post('/addfollow', checkLoggedIn, followCtrl.following);

//팔로잉 취소
follow.delete('/canclefollow/:id', followCtrl.remove); // 로그인한사람id 를 보내야하는듯싶다.

//팔로잉 리스트
// follow.get('/followinglist/:id',followCtrl.inglist); 

//팔로워 리스트
// follow.get('/followerlist/:id',followCtrl.werlist); 


export default follow;