import File from "../../models/files";
import mongoose from 'mongoose';


// 파일 저장
export const saveFile = async (ctx) => {
    try{
        const files = ctx.request.files;
        
        if(Array.isArray(files)){
            
            for(let i=0; i<files.length; i++){
                
                const file = new File({
                    originalFileName:files[i].originalname, 
                    serverFileName: files[i].filename,
                    size: files[i].size,
                    path: files[i].path,
                    postid:ctx.state.post._id,
                    postcontents:ctx.state.post.contents,
                })

                await file.save();
                ctx.body = file;
            }
        }
    }catch(e){
        ctx.throw(500,e);
    }
}

// 파일 리스트
export const filelist = async (ctx) =>{
    const { id } = ctx.query;
    const query = {
        ...(id ? {'postid':id}:{}),
    };

    try{
        const files = await File.find(query)
        .sort({_id:-1})
        .limit(20)
        .lean()
        .exec();

        ctx.body = files.map((file)=>({
            ...file,
            body:file.body,
        }));
    }catch(e){
        ctx.throw(500,e);
    }
}

//파일 삭제
export const removeFile = async (ctx) => {
    const { id } = ctx.params;
    try{
        await File.findByIdAndRemove(id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
}