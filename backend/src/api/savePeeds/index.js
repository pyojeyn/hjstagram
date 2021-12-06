import Router from "koa-router";
import  * as SavePeedCtrl from './savePeed.ctrl';
import checkLoggedIn from "../../lib/chekLoggedIn";
import * as postCtrl from '../posts/post.ctrl';

const savePeeds = new Router();

savePeeds.post('/:id', checkLoggedIn, postCtrl.getPostById, SavePeedCtrl.savepost);

savePeeds.delete('/:id',checkLoggedIn, SavePeedCtrl.removeSavepost);

// 저장됨 리스트 User스키마의 _id 값 넘겨줌
// http://127.0.0.1:4000/api/savePeeds/list?id=619f1a432efc813fb1e43168
savePeeds.get('/list', SavePeedCtrl.savePeedList);
export default savePeeds;