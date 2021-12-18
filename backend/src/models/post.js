import mongoose,{ Schema } from 'mongoose';

const PostSchema = new Schema({
    publishedDate:{ // 게시일
        type:Date,
        default:Date.now,
    },
    user:{ // 글쓴이
        _id:mongoose.Types.ObjectId,
        username: String,
    },
    contents : { // 내용
        type: String,
    },
    like:{ // 좋아요 수 
        type:Number,
        default: 0,
    },
    comments:{
        type:Number,
        default: 0,
    },
    fileurls:[String],
});

const Post = mongoose.model('Post',PostSchema);
export default Post;