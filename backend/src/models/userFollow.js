// 부모 참조!

import mongoose, { Schema } from 'mongoose';

// 619a2ba8dfea48455dbed157
// const UserFollowSchema = new Schema({
//     recieverid : [{ user : {
//         _id:mongoose.Types.ObjectId, // 61999af15f5665f64ae4f69a 민정이
//         username: String,
//     }}],
//     senderid : [{ user :{
//         _id:mongoose.Types.ObjectId, // 6199a4858a4496e26a3e2bee 명준님
//         username: String,
//     }}]
// });

const UserFollowSchema = new Schema({
    userid : { // 팔로우 하는 사람
        _id:mongoose.Types.ObjectId,
        username:String,
    },
    followingid : { // 팔로우 되는 주체
        _id:mongoose.Types.ObjectId,
        followingid:String
    }
})

// {
//     "followingid" : {
//         "_id": "619d15cf49ba12dc8008cfca",
//         "username":"latte"
//     }
// }
const UserFollow = mongoose.model('Following',UserFollowSchema);

export default UserFollow;
