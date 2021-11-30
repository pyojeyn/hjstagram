import Post from "../../models/post";
import mongoose from 'mongoose';
import Joi from "joi";
import sanitizeHtml from 'sanitize-html';

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
    contents: '내용',
    tags: ['태그1','태그2']
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
        return;
    }

    const { contents, tags } = ctx.request.body;
    const post = new Post({
        tags,
        contents:sanitizeHtml(contents,sanitizeOption),
        user: ctx.state.user,
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