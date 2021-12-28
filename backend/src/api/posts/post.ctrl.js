import Post from "../../models/post";
import mongoose from 'mongoose';
import Joi from "joi";
import sanitizeHtml from 'sanitize-html';
import File from "../../models/files";

const { ObjectId } = mongoose.Types;

const sanitizeOption = { //어떤 태그와 속성과 스키마만 허용할건지 객체로 만들어 놓음;
    allowedTags : ['h1', 'h2', 'b','i','u','s','p','ul','ol','li','blockquote','a','img'],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemes: ['data', 'http']
};


/*
POST /api/posts

{
    "contents": "후니사랑해",
    "tags": ["후니와","티슈"]
}
*/




export const write = async (ctx) => {
    const schema = Joi.object().keys({
        tags:Joi.array().items(Joi.string()),
        contents:Joi.string(),
    });

    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        console.log("????")
        return;
    }
 
    const { contents, tags } = ctx.request.body;
    const post = new Post({
        tags,
        contents:sanitizeHtml(contents,sanitizeOption),
        user: ctx.state.user,
        useremail: ctx.state.user.email,
    });

    try{
        await post.save();
        ctx.body = post;
    }catch(e){
        ctx.throw(500,e);
    }
};

/*
    GET /api/posts?username=blue&tag=['안녕','방가']&page=1
*/

export const list = async (ctx) => {
    const { tag, username } = ctx.query;
    const query = {
        ...(username ? {'user.username' : username}:{}),
        ...(tag ? {tags:tag}:{}),
    };

    try{
        const posts = await Post.find(query)
        .sort({_id:-1})
        .limit(10) //무한스크롤? 로 할거라서 필요없을거 같긴 한데 일단 씀;
        .lean()
        .exec();
        const postsCount = await Post.countDocuments(query).exec;
        ctx.body = posts.map((post)=>({
            ...post,
            body: removeHtmlAndShorten(post.body),
        }));
    }catch(e){
        ctx.throw(500,e);
    }
}

/*
    GET /api/post/:id
*/
export const read = async (ctx) => {
    ctx.body = ctx.state.post;
}

/*
    DELETE /api/post/:id
*/
export const remove = async (ctx) => {
    const { id } = ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
}


// 좋아요 + 1
export const addLike = async (ctx) => {
    const { id } = ctx.params;
    try{
        const post = await Post.findById(id);
        post.like += 1;
        console.log("좋아요 갯수 : " + post.like);
        post.save();
        ctx.body = post;
    }catch(e){
        ctx.throw(e, 500);
    }
}

//좋아요 -1
export const cancleLike = async (ctx) => {
    const { id } = ctx.params;
    try{
        const post = await Post.findById(id);
        // 여기서 좋아요 개수가 0 이면 실행되게 하면 안됨
        if(post.like > 0){
            post.like -= 1;
        }
        console.log("좋아요 갯수 : " + post.like);
        post.save();
        ctx.body = post;
    }catch(e){
        ctx.throw(e, 500);
    }
} 





const removeHtmlAndShorten = (body) =>{
    const filtered = sanitizeHtml(body,{
        allowedTags:[], //html 아무것도 허용 안함
    });
    return filtered.length < 200 ? filtered:`${filtered.slice(0,200)}...`;
};

export const getPostById = async (ctx, next) => {
    const { id } = ctx.params;
    console.log("post.ctrl.js - ObjectId : "+ id);
    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        return;
    }
    try{
        const post = await Post.findById(id);
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.state.post = post;
        return next();
    }catch(e){
        ctx.throw(500,e);
    }
}

// post.user._id : post 안에 잇는 글쓴이 정보 진짜 글쓴이 
// user.i_id checkOwnPost 의 매개변수로 넘어온 값! 둘이 비교
export const checkOwnPost = (ctx,next) => {
    const {user,post} = ctx.state;
    if(post.user._id.toString() !== user._id){
        ctx.status = 403;
        return;
    }
    return next();
};

/*
  PATCH /api/posts/:id
  {
    fileurl: ['태그1', '태그2']        
  }
*/
export const path = async (ctx) => {
    const { id } = ctx.params;
    const {fileurl} = ctx.request.body;
    console.log(fileurl);

    const post = await Post.findById(id);
    post.fileurls = fileurl;
    await post.save();
    console.log(post);
    ctx.body = post;
}


export const giveComment = async (ctx) => {
    const { id } = ctx.params;
    const { content } = ctx.request.body;

    const post = await Post.findById(id);
    const comment = post.comment;
    console.log(post.comment);
    post.comment = [{content:content, who:ctx.state.user.username}, ...comment]
    
    await post.save();
    console.log(post);
    ctx.body = post;
}

/*
    PATCH /api/posts/:id/likeby
*/
export const likeby = async (ctx) => {
    const { id } = ctx.params;

    const post = await Post.findById(id);

    const likebyarr = post.likeby;

    console.log(post.likeby);

    for(let i=0; i<likebyarr.length; i++){
        if(likebyarr[i] === ctx.state.user.username) {
            console.log("이미 좋아요 했음");
            return false;
        }
    }

    post.likeby = [...likebyarr, ctx.state.user.username];

    console.log("로그인한사람"+ctx.state.user.username)

    await post.save();
    console.log(post);
    ctx.body = post;
}

export const cancleLikeby = async (ctx) => {
    const { id } = ctx.params;
    const post = await Post.findById(id);
    const likebyarr = post.likeby;
    let index = likebyarr.indexOf(ctx.state.user.username);
    if(index > -1){
        likebyarr.splice(index,1);
        console.log("좋아요 리스트에서 삭제됨!")
    } 
    await post.save();
    console.log(post);
    ctx.body = post;
}



export const deleteComment = async (ctx) => {
    const { id, cid } = ctx.params;
    try{
        const post = await Post.findByIdAndUpdate(id, {$pull: {comment:{_id:cid}}},{ new:true,}).exec();
        console.log("삭제 된거 ?");
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
        console.log("근데 왜 응답 안해줌?");
    }catch(e){
        ctx.throw(e, 500);
    }
    
}


// 글쓴이가 자기 프로필 바꾸면 메인카드에 있는 작은 프로필도 바껴야함
export const editprofileurl = async (ctx) => {

    const {profilepicurl} = ctx.request.body;
    
    try{
        const post = await Post.findByUseremail(ctx.state.user.email);
        console.log("이거 포스트임??")
        console.log(post);
        for(let i=0; i<post.length; i++){
            post[i].user.profileurl = profilepicurl;
            await post[i].save();
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(e,500);
    }
    
}
// 글쓴이가 자기  바꾸면 메인카드에 있는 작은 프로필도 바껴야함
export const editusername = async (ctx) => {
    const { username } = ctx.request.body;

    try{
        const post = await Post.findByUseremail(ctx.state.user.email);
        console.log("이거 포스트임??")
        console.log(post);
        for(let i=0; i<post.length; i++){
            post[i].user.username = username;
            await post[i].save();
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(e,500);
    }

}