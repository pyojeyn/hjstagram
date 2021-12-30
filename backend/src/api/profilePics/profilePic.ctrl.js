import ProfilePic from "../../models/profilepic";

//프로필 사진 업로드!
export const saveProfile = async (ctx) => {
    try{
        const profilepic = ctx.request.file;

        if(profilepic){

            const profilepics = new ProfilePic({
                originalFileName: profilepic.originalname, 
                serverFileName: profilepic.filename,
                size: profilepic.size,
                path: profilepic.path,
                userid: ctx.state.user._id,
            });

            await profilepics.save();
            ctx.body = profilepics;
        }
    }catch(e){
        ctx.throw(500,e);
    }
}

// 프로필 사진 삭제 
export const removeProPic = async (ctx) => {
    const { id } = ctx.params;  
    console.log("userid : "+ id);
    try{
        const profile = await ProfilePic.findByUserid(id); 
        const removeid = profile._id;
        await ProfilePic.findByIdAndRemove(removeid).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
}
