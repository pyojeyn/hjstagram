import Router from 'koa-router';
import * as profilePicCtrl from './profilePic.ctrl';
import multer from '@koa/multer';
import path from 'path';
import { getUserById } from '../../lib/getUserById';
//프로필 사진
const profilePic = new Router();

const storage = multer.diskStorage({
    destination:(ctx,file,callback) => {
        callback(null,'../frontend/public/profile');
    },
    filename:(ctx,file,callback) => {
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);
        callback(null,basename+"_"+Date.now()+extension);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        files: 1,
        fileSize: 1024 * 1024 * 1024
    }
});

profilePic.post('/:id', getUserById, upload.single('profile'), profilePicCtrl.saveProfile);
profilePic.delete('/:id', profilePicCtrl.removeProPic);
export default profilePic;