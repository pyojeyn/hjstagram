import mongoose, { Schema } from 'mongoose';

const LikeSchema = new Schema({
    user:{ // 좋아요 누른 사람
        _id:mongoose.Types.ObjectId,
        username: String,
    },
    post:{ // 좋아요 누른 피드
		_id:mongoose.Types.ObjectId,
        contents:String,
	},
    publishedDate:{ // 좋아요 누른 날짜
        type:Date,
        default:Date.now,
    },
});

const Like = mongoose.model('Like',LikeSchema);
export default Like;