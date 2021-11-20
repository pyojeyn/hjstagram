import User from '../../models/user';
import Joi from 'joi';

export const register = async (ctx) => {
    const schema = Joi.object().keys({
        email:Joi.string().required(),
        password: Joi.string().required(),
        name:Joi.string().required(),
        username:Joi.string().required()
    });

    const result = schema.validate(ctx.request.body);
    if(result.error){
        console.log(result.error);
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const {email,password,name,username} = ctx.request.body;

    try{
        const exists = await User.findByUsername(username);
        if(exists){
            ctx.status = 409;
            return;
        }

        const user = new User({
            email,
            password,
            name,
            username,
        });

        await user.setPassword(password);
        await user.save();

        ctx.body = user.serialize();

        const token = user.generateToken();
        ctx.cookies.set('hjsta_token',token,{
            maxAge: 1000 * 60 * 60 * 24 *7,
            httpOnly:true,
        });
    }catch(e){
        throw(500,e);
    }
}

export const login = async(ctx) => {
    const {username,password} = ctx.request.body;
    // 아이디나 비번 입력 안했을 때
    if(!username || !password){
        ctx.status = 401;
        return;
    }

    try{
        const user = await User.findByUsername(username);
        if(!user){ // 입력한 아이디가 DB에 없을때
            ctx.status = 401;
            return;
        }

        
        //사용자 있으면 비번 체크하기
        const valid = await user.checkPassword(password);
        if(!valid){
            ctx.status = 401;
            return;
        }
        
        // 아이디, 비번 다 통과하면 직렬화
        ctx.body = user.serialize();
        //토큰 부여
        const token = user.generateToken();
        //쿠키 생성
        ctx.cookies.set('hjsta_token', token,{
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true, 
        });
    }catch(e){
        ctx.throw(500,e);
    }
}