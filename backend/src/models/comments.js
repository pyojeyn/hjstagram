import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
    user:{ // 댓글 단 사람
        _id:mongoose.Types.ObjectId,
        username: String,
    },
    post:{ // 해당 댓글이 달려있는 피드
		_id:mongoose.Types.ObjectId,
        contents:String,
	},
    publishedDate:{ // 댓글 단 날짜
        type:Date,
        default:Date.now,
    },
    content:{
        type:String,
        required:true
    }
});

const Comment = mongoose.model('Comment',CommentSchema);
export default Comment;