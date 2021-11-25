import TaggedUser from "../../models/taggedUser";


// 태그 하기 
export const tag = async (ctx) => {
    const tag = new TaggedUser({
        post:{
            _id: ctx.state.post._id,
            contents: ctx.state.post.contents,
            username: ctx.state.post.user.username,
        },
        taggedUser:{
            _id:ctx.state.user._id,
            username:ctx.state.user.username,
        },
    });
    console.log(tag);

    try{
        await tag.save();
        ctx.body = tag;
    }catch(e){
        ctx.throw(500,e);
    }
}