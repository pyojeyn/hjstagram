import TaggedUser from "../../models/taggedUser";


// 태그 하기 
export const tag = async (ctx) => {
    try{ // post는 URL로 .. 넘겨주고... taggedUser 은 body에 담아서 보내줬다 일단..(팔로잉이랑 같은 방식..)
        const {taggedUser} = ctx.request.body;
        const tag = new TaggedUser({
            post:{
                _id: ctx.state.post._id,
                contents: ctx.state.post.contents,
                username: ctx.state.post.user.username,
            },
            taggedUser, // 이게 맞는건가;;
        });
        console.log(tag);
        await tag.save();
        ctx.body = tag;
    }catch(e){
        ctx.throw(500,e);
    }
}

// 내가 태그된 게시물 리스트
// GET /api/tag/taggedname?
export const taggedpostlist = async (ctx) => {
    const { taggedname } = ctx.query;
    const query = {
        ...(taggedname ? {'taggedUser.taggedname' : taggedname} : {}),
    };
    try{
        const tag = await TaggedUser.find(query)
        .sort({_id:-1})
        .limit(5)
        .lean()
        .exec();
        
        ctx.body = tag.map((tagpost) =>({
            ...tagpost,
            body:tagpost.body,
        }));
    }catch(e){
        ctx.throw(500,e);
    }
};
