import Router from "koa-router";
import  * as postCtrl from './post.ctrl';
import checkLoggedIn from "../../lib/chekLoggedIn";
import multer from '@koa/multer';
import File from "../../models/files";
import fs from 'fs';
import Post from "../../models/post";
//import static from 'koa-static';  //이거 왜 에러나니..?
import path from 'path';

const posts = new Router();

const storage = multer.diskStorage({
    destination:(ctx,file,callback) => {
        callback(null,'uploads');
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


// 127.0.0.1:4000/api/posts    files : attachment name속성이랑 이름 같아야함
posts.post('/',checkLoggedIn, upload.array('attachment',20), postCtrl.write);
// 127.0.0.1:4000/api/posts
posts.get('/',postCtrl.list);

const post = new Router();

// 127.0.0.1:4000/api/post/id
post.get('/', postCtrl.read);

// 127.0.0.1:4000/api/post/id
post.delete('/',checkLoggedIn, postCtrl.checkOwnPost, postCtrl.remove);

posts.use('/:id',postCtrl.getPostById, post.routes());



export default posts;


