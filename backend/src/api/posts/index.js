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
    // destination:(ctx,file,callback) => {
    //     callback(null,'uploads');
    // },
    filename:(ctx,file,callback) => {
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);
        callback(null,basename+"_"+Date.now()+extension);
    }
});

const upload = multer({ 
    storage:storage,
    dest:'uploads', // 이미지 업로드 경로
});


// const upload = multer({
//     storage: storage,
//     limit:{
//         files:20,
//         fileSize:1024 * 1024 * 100
//     }
// });



// 127.0.0.1:4000/api/posts    files : attachment name속성이랑 이름 같아야함
posts.post('/',checkLoggedIn,upload.array('attachment',20), async (ctx)=>{
    try{ // post 등록되기 전에 파일 있나없나 확인하고 파일있으면 파일 모델객체 저장해주는건가;
        console.log("ctx.req.files: "+ctx.req.file)
        const attachment = ctx.req.files ? await File.createNewInstance(ctx.req.files, ctx.req.postid._id):undefined; // ctx.req.files 가 존재하면 createNewInstance 함수를 이용해서 file 모델의 인스턴스 생성
        ctx.req.attachment = attachment; // 위에서 만들어진 file 모델을 ctx.body.attachment 에 담아서 post가 생성될 때 같이 저장!
        console.log('파일 저장 됬니');
        console.log("attachment : " + attachment);
        Post.create(ctx.req.attachment, (err,post)=>{
            if(err){
                console.log(err);
            }
            if(attachment){ //post 가 생성된 후 생성된 post의 _id를 file 모델의 postid에 담고 save()를 이용해 DB에 저장!
                attachment.postid = post._id;
                attachment.save();
                ctx.body = attachment;
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


