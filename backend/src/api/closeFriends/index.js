import Router from "koa-router";
import * as CloseFriendCtrl from './closeFriends.ctrl';

const closefriends = new Router;
// 127.0.0.1:4000/api/closeFriends/
closefriends.post('/:id', CloseFriendCtrl.addCloseFriend);

// 127.0.0.1:4000/api/closeFriends/
closefriends.delete('/:id', CloseFriendCtrl.removeCloseFriend);

// 127.0.0.1:4000/api/closeFriends?username=kkyu
closefriends.get('/',CloseFriendCtrl.list);
export default closefriends;