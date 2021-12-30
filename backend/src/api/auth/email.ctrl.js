import jwt from 'jsonwebtoken';
import User from '../../models/user';
import {
    transporter,
    getPasswordResetURL,
    resetPasswordTemplate
} from '../../lib/email';

// 이메일 발송 API 
export const sendPasswordResetEmail = async (ctx) => {
    
    try{
        const { email } = ctx.request.body; 
        const user = await User.findByEmail(email).exec();
        const token = user.generateToken();
        const url = getPasswordResetURL(user,token);
        const emailTemplate = resetPasswordTemplate(user,url);
        const sendEmail = () => {
            transporter.sendMail(emailTemplate, (err,info) => {
                if(err){
                    ctx.throw(500,err);
                }
                console.log(`** 이메일 발송 성공 **`, info.response);
            });
        }
        sendEmail();   
        ctx.body = user;
    }catch (err) {
        ctx.status = 404;
    }
}

// 비밀번호 변경 API
export const receiveNewPassword = async (ctx) => {
    const { token, userId } =ctx.params;
    const { password } = ctx.request.body;
    const user = await User.findById({_id:userId});

    if(user){
        const secret = '!@#$%^&*()';
        const payload = jwt.decode(token,secret);
        
        if(payload._id === user.id){
            user.hashedpassword = password;
            user.save();
        }

    }else{
        ctx.status = 401;
    }
}