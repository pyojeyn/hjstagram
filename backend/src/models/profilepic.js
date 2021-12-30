import mongoose,{ Schema } from 'mongoose';

//프로필 이미지

const ProfilePicSchema = new Schema({
	originalFileName : { type: String}, // 업로드된 파일명
    serverFileName : {type:String}, // 실제 서버에 저장될 파일명
    size:{type:String}, // 업로드된 파일 크기
    path:{type:String},
    userid : { type:mongoose.Types.ObjectId, ref:'users'},
});

ProfilePicSchema.statics.findByUserid = function(userid){
    return this.findOne({userid});
}

const ProfilePic = mongoose.model('Profilepic',ProfilePicSchema);

export default ProfilePic;