import mongoose,{ Schema } from 'mongoose';

const PostSchema = new Schema({
    tags:[String], // 태그
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
        required: true,
    },
    like:{ // 좋아요 수 
        type:Number,
        default: 0,
    },
    img:{ // 아마도 파일경로
        type:String,
    //    required: true,
    },
    comments:{
        type:Number,
        default: 0,
    },
});

const Post = mongoose.model('Post',PostSchema);
export default Post;