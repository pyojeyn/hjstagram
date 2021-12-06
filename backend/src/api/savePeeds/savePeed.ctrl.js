import SavePeed from "../../models/savePeed";

// 저장됨
export const savepost = async (ctx) => {
    const savePeed = new SavePeed({
        user: ctx.state.user,
        post:{
            _id: ctx.state.post._id,
            contents:ctx.state.post.contents,
        },
    });

    console.log(savePeed);

    try{
        await savePeed.save();
        ctx.body = savePeed;
    }catch(e){
        ctx.throw(500,e);
    }
}

// 저장됨 취소
export const removeSavepost = async (ctx) => {
    const { id } = ctx.params;
    try{
        await SavePeed.findByIdAndRemove(id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
}

// 저장됨 리스트
export const savePeedList = async (ctx) => {
    const {id} = ctx.query; // user의 ObjectId 넘겨야됨
    const query = {
        ...(id? {'user._id':id}:{}),
    };

    try{
        const savepeeds = await SavePeed.find(query)
        .sort({_id:-1})
        .lean()
        .exec();

        ctx.body = savepeeds.map((savepeed) => ({
            ...savepeed,
            body:savepeed.body,
        }));
    }catch(e){
        ctx.throw(500,e);
    }
}