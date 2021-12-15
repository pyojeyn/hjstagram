import mongoose,{ Schema } from 'mongoose';

const FileSchema = new Schema({
	originalFileName : { type: String}, // 업로드된 파일명
    serverFileName : {type:String}, // 실제 서버에 저장될 파일명
    size:{type:String}, // 업로드된 파일 크기
    path:{type:String},
    postid : { type:mongoose.Types.ObjectId, ref:'posts'},
    postcontents: {type:String, ref:'posts'},
});

const File = mongoose.model('File',FileSchema);

export default File;