import mongoose, { Schema } from 'mongoose';

const TaggedUserSchema = new Schema({
    taggedUser :{
        _id: mongoose.Types.ObjectId,
        username:String
    },
    post:{
        _id:mongoose.Types.ObjectId,
        contents:String,
        username:String,
    }
});

const TaggedUser = mongoose.model('TaggedUser',TaggedUserSchema);
export default TaggedUser;