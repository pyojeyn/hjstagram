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
// 팔로우 하기
follow.post('/addfollow', checkLoggedIn, followCtrl.following);

//팔로잉 취소
follow.delete('/canclefollow/:id', checkLoggedIn, followCtrl.remove); // 로그인한사람id 를 보내야하는듯싶다.

//팔로잉 리스트     GET /api/follow/followinglist?username=kkyu
follow.get('/followinglist',followCtrl.followinglist); 

//팔로워 리스트     GET /api/follow/followerlist?username=lemon
follow.get('/followerlist',followCtrl.followerlist); 


export default follow;