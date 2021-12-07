import CloseFriend from "../../models/closeFriend";
import User from '../../models/user';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export const addCloseFriend = async (ctx) => {
    try{
        const { id } = ctx.params;
        
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

        const closefriend = new CloseFriend({
            user:ctx.state.user,
            closefriend:{
                _id:user._id,
                username:user.username,
            }
        });

        await closefriend.save();
        ctx.body = closefriend;
    }catch(e){
        ctx.throw(500,e);
    }
};

export const removeCloseFriend = async (ctx) => {
    const { id } = ctx.params;
    try{
        await CloseFriend.findByIdAndDelete(id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
};

export const list = async (ctx) => {
    const { username } = ctx.query;
    const query = {
        ...(username ? {'user.username' : username} : {}),
    };

    try{
        const close = await CloseFriend.find(query)
        .sort({_id:-1})
        .limit(5)
        .lean()
        .exec();
        ctx.body = close.map((cfriends)=>({
            ...cfriends,
            body:cfriends.body,
        }));
    }catch(e){
        ctx.throw(500,e);
    }
}