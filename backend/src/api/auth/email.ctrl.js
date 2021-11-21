import Joi from 'joi';
import User from '../../models/user';
import nodemailer from 'nodemailer';

const mailPoster = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jeynpyo@gmail.com',
        pass: '1111'
    },
});

const mailOpt = (email,contents) => {
    const mailOption = {
        from: 'hjstagram',
        to: email,
        subject: '회원가입 인증번호입니다.',
        text: contents,
    };
    console.log(mailOption);
    return mailOption;
};

const sendMail = (mailOption) => {
    mailPoster.sendMail(mailOption, (err,info) => {
        if(err){
            console.log('에러' + err);
        }else{
            console.log('전송 완료' + info.response);
        }
    });
};

const getRandomNumber = () => {
    let number = '';
    let random = 0;
    for(let i = 0; i < 6; i++){
        random = Math.trunc(Math.random() * (9-0)+0);
        number += random;
    }
    return number;
}

const contents = (randomNumber) => {
    return `인증 칸 아래의 숫자를 입력해주세요. \n ${randomNumber}`;
};

export const sendEmailAuthenticationCode = async (ctx) => {
    const requestData = Joi.object().keys({
        email:Joi.string().email().min(3).max(100).required(),
    });
    const result = requestData.validate(ctx.request.body);
    if(result.error){
        console.log(result.error);

        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { email } = ctx.request.body;
    try{
        const exists = await User.findByEmail(email);
        if(exists){
            ctx.status = 409;
            return;
        }

        const randomNumber = getRandomNumber();

        const mailOption = mailOpt(result.value.email, contents(randomNumber));
        sendMail(mailOption);
        ctx.body = { sendEmailAuthenticationCode : random };

    }catch(e){
        ctx.throw(500,e);
    }

}