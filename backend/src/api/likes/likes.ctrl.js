import Like from "../../models/likes";

export const addlike = async (ctx) => {
    const like = new Like({
        user:ctx.state.user,
        post:{
            _id:ctx.state.post._id,
            contents:ctx.state.post.contents,
        },
    });
    console.log(like);
    
    try{
        await like.save();
        ctx.body = like;
    }catch(e){
        ctx.throw(500,e);
    }
}

// 좋아요 취소 
export const cancelLike = async (ctx) => {
    const { id } = ctx.params;
    try{
        await Like.findByIdAndRemove(id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
}

// 좋아요 누른 사람 리스트
export const likePeopleList = async (ctx) => {
    const { id } = ctx.query; // post ObjectId 넘겨야됨
    const query = {
        ...(id ? {'post._id':id}:{}),
    };

    try{
        const likes = await Like.find(query)
        .sort({_id:1})
        .limit(10)
        .lean()
        .exec();

        ctx.body = likes.map((like) => ({
            ...like,
            body:like.body,
        }));
    }catch(e){
        ctx.throw(500,e);
    }
}