import mongoose from 'mongoose';
import User from '../models/user';

const { ObjectId } = mongoose.Types;

export const getUserById = async (ctx, next) => {
    const { id } = ctx.params.userid;
    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        console.log('User에러니?')
        return;
    }
    try{
        const user = await User.findById(id);
        if(!user){
            ctx.status = 404;
            return;
        }
        ctx.state.user = user;
        return next();
    }catch(e){
        ctx.throw(500,e);
    }
}

export default getUserById;