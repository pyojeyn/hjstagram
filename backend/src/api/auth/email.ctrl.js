import jwt from 'jsonwebtoken';
import User from '../../models/user';
import {
    transporter,
    getPasswordResetURL,
    resetPasswordTemplate
} from '../../lib/email';

// 객체를 매개변수로 보내는 함수
// export const usePasswordHashToMakeToken = ({
//     password:hashedpassword,
//     _id:userId,
//     createdAt
// }) => {
//     const secret = hashedpassword + "-" + createdAt;
//     const token = jwt.sign({userId}, secret, {
//         expiresIn: 3600 // 1시간
//     })
//     return token;
// };


// 이메일 발송해주는 api
export const sendPasswordResetEmail = async (ctx) => {
    
    try{
        const { email } = ctx.request.body; //왜 email 이 params임?
        console.log("email : " + email);
        const user = await User.findByEmail(email).exec();
        console.log("user : "+user);

        const token = user.generateToken();
        const url = getPasswordResetURL(user,token);
        const emailTemplate = resetPasswordTemplate(user,url);
        const sendEmail = () => {
            transporter.sendMail(emailTemplate, (err,info) => {
                if(err){
                    ctx.throw(500,err);
                }
                console.log(`** Email sent **`, info.response);
            });
        }
        sendEmail();   
        ctx.body = user;
    }catch (err) {
        ctx.status = 404;
    }
}

// 비밀번호 변경하는 api
export const receiveNewPassword = async (ctx) => {
    const { token, userId } =ctx.params;
    const { password } = ctx.request.body;

    console.log('userId : ' + userId);
    console.log('token : ' + token);
    console.log('password : ' + password);

    const user = await User.findById({_id:userId});

    if(user){
        const secret = '!@#$%^&*()';
        const payload = jwt.decode(token,secret);
        console.log("payload");
        console.log(payload);
        console.log("user");
        console.log(user);

        if(payload._id === user.id){
            user.hashedpassword = password;
            user.save();
        }

    }else{
        ctx.status = 401;
    }
    //user.hashedpassword = password
    // User.findOne({_id:userId})
    // .then(user => {
    //     const secret = user.password + "-" + user.createdAt
    //     const payload = jwt.decode(token, secret)
    //     if (payload.userId === user.id) {
    //       bcrypt.genSalt(10, function(err, salt) {
    //         if (err) return
    //         bcrypt.hash(password, salt, function(err, hash) {
    //           if (err) return
    //           User.findOneAndUpdate({ _id: userId }, { password: hash })
    //             .then(() => res.status(202).json("Password changed accepted"))
    //             .catch(err => res.status(500).json(err))
    //         })
    //       })
    //     }
    //   })
}