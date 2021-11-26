import Post from "../models/post";
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export const getPostById = async (ctx, next) => {
    const { id } = ctx.params;//이거 있으나 없으나 일단 똑같음;;;
    console.log("getPostById - post의 ObjectId : "+ id);
    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        console.log('Post에러니;')
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

export default getPostById;