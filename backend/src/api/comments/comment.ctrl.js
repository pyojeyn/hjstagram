import Comment from "../../models/comments";
import mongoose from 'mongoose';
import Joi from "joi";
import Post from "../../models/post";


const { ObjectId } = mongoose.Types;

/*
    {
        "content": "댓글테스트"
    }
*/
export const write = async (ctx) => {
    const schema = Joi.object().keys({
        content: Joi.string().required(),
    });

    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { content } = ctx.request.body;
    const comment = new Comment({
        content,
        user:ctx.state.user,
        post:{ //정답은 여기 있었다..
            _id: ctx.state.post._id, 
            contents: ctx.state.post.contents,
        },
    });
    console.log(comment);

    try{
        await comment.save();
        ctx.body = comment;
    }catch(e){
        ctx.throw(500,e);
    }
}

// 댓글 삭제
export const remove = async (ctx) => {
    const { id } = ctx.params;
    try{
        await Comment.findByIdAndRemove(id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
}

// 댓글 리스트 
// GET /api/comments?postid=를 넘겨야 하나

export const commentslist = async (ctx) => {
    const { id } = ctx.query; //postid 넘겨야할듯...?
    const query = {
        ...(id ? {'post._id':id}:{}),
    };

    try{
        const comments = await Comment.find(query)
        .sort({_id:1})
        .limit(10)
        .lean()
        .exec();

        ctx.body = comments.map((comment) => ({
            ...comment,
            body:comment.body,
        }));
    }catch(e){
        ctx.throw(500,e);
    }
};