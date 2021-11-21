import UserFollow from "../../models/userFollow";

// 팔로우
export const following = async (ctx) => {
    try{
        const {recieverid, senderid} = ctx.request.body;

        const following = new UserFollow({
            recieverid,
            senderid
        });

        await following.save();
        
    }catch(e){
        throw(500,e);
    }
}

// 팔로우취소
export const remove = async (ctx) => {
    const { id } = ctx.params;
    try{
        await UserFollow.findByIdAndDelete(id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
}

//팔로우 리스트
// GET /api/posts?id=
export const list = async (ctx) => {
    const { id } = ctx.query;
}