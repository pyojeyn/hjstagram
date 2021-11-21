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
    recieverid : mongoose.Types.ObjectId,
    senderid : [{
        _id:mongoose.Types.ObjectId,
        username:String
    }]
})

/*
    "recieverid" : "61999af15f5665f64ae4f69a"
    "senderid" : [{
        "_id" : "6199a4858a4496e26a3e2bee",
        "username" : "chokid"
    }]
*/



//user 객체에 대한 _id가 또 생김


/*
{"recieverid" : [ {"user" : {
        "_id": "",
        "username":""
    }}],
    "senderid" :[{"user": {
        "_id":"",
        "username":""
    }}]}
*/ 

const UserFollow = mongoose.model('Following',UserFollowSchema);

export default UserFollow;


// ctx.request.body.user._id 이런식으로 값 가져오는건가용?