import UserFollow from "../../models/userFollow";
import User from '../../models/user';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

// 팔로우
export const following = async (ctx) => {
    try{
        const {id} = ctx.params;

        if(!ObjectId.isValid(id)){
            ctx.status = 400;
            console.log('User에러니?')
            return;
        }

        const user = await User.findById(id);
        if(!user){
            ctx.status = 404;
            return;
        }

        const following = new UserFollow({
            userid : ctx.state.user,
            followingid:{
                _id:user._id,
                followingid:user.username, 
            }
        });

        await following.save();
        ctx.body = following;  // 이거 안해주면 postman 에서 Not Found 뜸;
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
// GET /api/follow/followinglist?username=
export const followinglist = async (ctx) => {
    const { username } = ctx.query;
    const query = {   // 아 만약 follower리스트 뽑아올려면 반대로 followingid.followingid 하면 될듯? url에다가 followingid= 이렇게 하고
        ...(username ? {'userid.username' : username} : {}),
    };

    try{
        const following = await UserFollow.find(query)
        .sort({_id:-1})
        .limit(5)
        .lean()
        .exec();
        const followingCount = await UserFollow.countDocuments(query).exec;
        ctx.set('Last-Page',Math.ceil(followingCount/5));
        ctx.body = following.map((follow) => ({
            ...follow,
            body:follow.body,
        }));
    }catch(e){
        ctx.throw(500,e);
    }
};

//팔로워 리스트
// GET /api/follow/followerlist?followingid=lemon
export const followerlist = async (ctx) => {
    const { followingid } = ctx.query;
    const query = {
        ...(followingid ? {'followingid.followingid' : followingid} : {}),
    };

    try{
        const follower = await UserFollow.find(query)
        .sort({_id:-1})
        .limit(5)
        .lean()
        .exec();
        const followerCount = await UserFollow.countDocuments(query).exec;
        ctx.set('Last-Page',Math.ceil(followerCount/5));
        ctx.body = follower.map((follower) => ({
            ...follower,
            body:follower.body,
        }));
    }catch(e){
        ctx.throw(500,e);
    }
}


