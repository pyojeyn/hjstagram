import Router from "koa-router";
import  * as postCtrl from './post.ctrl';
import checkLoggedIn from "../../lib/chekLoggedIn";
import multer from 'koa-multer';
import File from "../../models/files";
import fs from 'fs';
import Post from "../../models/post";


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
    limit:{
        files:20,
        fileSize:1024 * 1024 * 100
    }
});



// 127.0.0.1:4000/api/posts    files : input name속성이랑 이름 같아야함
posts.post('/',checkLoggedIn,upload.array('files',20),(ctx)=>{
    try{ // post 등록되기 전에 파일 있나없나 확인하고 파일있으면 파일 모델객체 저장해주는건가;
        const attachment = ctx.req.files ? await File.createNewInstance(ctx.req.files, ctx.req.postid._id):undefined;
        ctx.body.attachment = attachment;
        Post.create(ctx.body, (err,post)=>{
            if(err){
                console.log(err);
            }
            if(attachment){
                attachment.postid = post._id;
                attachment.save();
            }
        })

    }catch(e){
        console.log(e);
    }
},postCtrl.write);

// 127.0.0.1:4000/api/posts
posts.get('/',postCtrl.list);

const post = new Router();

// 127.0.0.1:4000/api/post/id
post.get('/', postCtrl.read);

// 127.0.0.1:4000/api/post/id
post.delete('/',checkLoggedIn, postCtrl.checkOwnPost, postCtrl.remove);

posts.use('/:id',postCtrl.getPostById, post.routes());
export default posts;


