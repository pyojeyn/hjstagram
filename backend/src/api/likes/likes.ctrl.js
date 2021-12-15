import Like from "../../models/likes";

export const addlike = async (ctx) => {
    const like = new Like({
        user:ctx.state.user,
        post:{
            _id:ctx.state.post._id,
            contents:ctx.state.post.contents,
        },
        userid: ctx.state.user._id,
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
    const { id } = ctx.params; //userid 값? postid 값... 둘중에 고민.. 일단 userid로 넘겨주긴함;
    console.log("userid : "+ id);
    try{
        const like = await Like.findByUserid(id);
        console.log(like);

        const removeid = like._id;

        await Like.findByIdAndRemove(removeid).exec();
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