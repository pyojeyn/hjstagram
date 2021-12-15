import mongoose, { Schema } from 'mongoose';

const LikeSchema = new Schema({
    user:{ // 좋아요 누른 사람
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
    userid : { type:mongoose.Types.ObjectId, ref:'users'},
});

LikeSchema.statics.findByUserid = function(userid){
    return this.findOne({userid});
}

const Like = mongoose.model('Like',LikeSchema);
export default Like;