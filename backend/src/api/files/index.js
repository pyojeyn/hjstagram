import Router from "koa-router";
import * as filesCtrl from './files.ctrl';
import { getPostById } from "../posts/post.ctrl";
import multer from '@koa/multer';
import path from 'path';

const files = new Router();

const storage = multer.diskStorage({
    destination:(ctx,file,callback) => {
        callback(null,'../frontend/public/files');
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
        files: 20,
        fileSize: 1024 * 1024 * 1024
    }
});

files.post('/:id',getPostById,upload.array('attachment',20),filesCtrl.saveFile);
files.get('/', filesCtrl.filelist);
files.delete('/:id',filesCtrl.removeFile);
export default files;