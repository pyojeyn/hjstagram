import mongoose, { Schema } from 'mongoose';

const CloseFriendSchema = new Schema({
    user:{
        _id:mongoose.Types.ObjectId,
        username:String,
    },
    closefriend:{
        _id:mongoose.Types.ObjectId,
        username:String,
    }
});

const CloseFriend = mongoose.model('closeFriend', CloseFriendSchema);

export default CloseFriend;