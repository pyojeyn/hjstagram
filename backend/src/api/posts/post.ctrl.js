import Post from "../../models/post";
import mongoose from 'mongoose';
import Joi from "joi";
import sanitizeHtml from 'sanitize-html';

const { ObjectId } = mongoose.Types;

const sanitizeOption = { 
    allowedTags : ['h1', 'h2', 'b','i','u','s','p','ul','ol','li','blockquote','a','img'],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemes: ['data', 'http']
};

const removeHtmlAndShorten = (body) =>{
    const filtered = sanitizeHtml(body,{
        allowedTags:[], 
    });
    return filtered.length < 200 ? filtered:`${filtered.slice(0,200)}...`;
};

export const getPostById = async (ctx, next) => {
    const { id } = ctx.params;
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

// 피드 올리기
export const write = async (ctx) => {
    const schema = Joi.object().keys({
        tags:Joi.array().items(Joi.string()),
        contents:Joi.string(),
    });

    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
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


export const list = async (ctx) => {
    const { tag, username } = ctx.query;
    const query = {
        ...(username ? {'user.username' : username}:{}),
        ...(tag ? {tags:tag}:{}),
    };

    try{
        const posts = await Post.find(query)
        .sort({_id:-1})
        .lean()
        .exec();
        ctx.body = posts.map((post)=>({
            ...post,
            body: removeHtmlAndShorten(post.body),
        }));
    }catch(e){
        ctx.throw(500,e);
    }
}


export const read = async (ctx) => {
    ctx.body = ctx.state.post;
}

// 피드 삭제 
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
        if(post.like > 0){
            post.like -= 1;
        }
        post.save();
        ctx.body = post;
    }catch(e){
        ctx.throw(e, 500);
    }
} 



// fileurl 에 File의 path 넣어주기
export const path = async (ctx) => {
    const { id } = ctx.params;
    const {fileurl} = ctx.request.body;
    console.log(fileurl);

    const post = await Post.findById(id);
    post.fileurls = fileurl;
    await post.save();
    ctx.body = post;
}

// 댓글 달기
export const giveComment = async (ctx) => {
    const { id } = ctx.params;
    const { content } = ctx.request.body;

    const post = await Post.findById(id);
    const comment = post.comment;
    
    post.comment = [{content:content, who:ctx.state.user.username ,whoid:ctx.state.user._id}, ...comment]
    
    await post.save();
    
    ctx.body = post;
}

// 댓글 삭제
export const deleteComment = async (ctx) => {
    const { id, cid } = ctx.params;
    try{
        const post = await Post.findByIdAndUpdate(id, {$pull: {comment:{_id:cid}}},{ new:true,}).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(e, 500);
    }
    
}

// 좋아요 누른사람 리스트 추가
export const likeby = async (ctx) => {
    const { id } = ctx.params;
    const post = await Post.findById(id);
    const likebyarr = post.likeby;

    for(let i=0; i<likebyarr.length; i++){
        if(likebyarr[i] === ctx.state.user.username) {
            return false;
        }
    }

    post.likeby = [...likebyarr, ctx.state.user.username];
    await post.save();
    ctx.body = post;
}

// 좋아요 누른사람 리스트 삭제 
export const cancleLikeby = async (ctx) => {
    const { id } = ctx.params;
    const post = await Post.findById(id);
    const likebyarr = post.likeby;
    let index = likebyarr.indexOf(ctx.state.user.username);
    if(index > -1){
        likebyarr.splice(index,1);
    } 
    await post.save();
    ctx.body = post;
}

// 피드 글쓴이의 프로필 사진 변경
export const editprofileurl = async (ctx) => {

    const {profilepicurl} = ctx.request.body;
    
    try{
        const post = await Post.findByUseremail(ctx.state.user.email);
        for(let i=0; i<post.length; i++){
            post[i].user.profileurl = profilepicurl;
            await post[i].save();
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(e,500);
    }
    
}
// 피드 글쓴이의 username 변경
export const editusername = async (ctx) => {
    const { username } = ctx.request.body;

    try{
        const post = await Post.findByUseremail(ctx.state.user.email);
        for(let i=0; i<post.length; i++){
            post[i].user.username = username;
            await post[i].save();
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(e,500);
    }

}