import mongoose,{ Schema } from 'mongoose';

const FileSchema = new Schema({
	originalFileName : { type: String}, // 업로드된 파일명
    serverFileName : {type:String}, // 실제 서버에 저장될 파일명
    size:{type:String}, // 업로드된 파일 크기
    path:{type:String},
    postid : { type:mongoose.Types.ObjectId, ref:'posts'},
});

const File = mongoose.model('File',FileSchema);

File.createNewInstance = async function(file, postid){
    return await File.create({
        originalFileName: file.originalName,
        serverFileName:file.filename,
        size:file.size,
        path:file.path,
        postid:postid,
    });
};

/*
createNewInstance함수는 file, uploadedBy, postId를 받아 
file모델의 객체을 DB에 생성하고 생성한 객체(인스턴스)를 리턴합니다. 
함수에 전달되는 file 인자는 
multer로 생성된 file 정보가 들어있는 객체인데요, 

*/

export default File;