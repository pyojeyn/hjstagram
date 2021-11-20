import jwt from 'jsonwebtoken';
import User from '../models/user';

const jwtMiddleware = async (ctx,next) => {
    const token = ctx.cookies.get('hjsta_token');

    if(!token) return next();

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        ctx.state.user = {
            _id:decoded._id,
            email:decoded.email,
            name:decoded.name,
            username:decoded.username,
        };

        const now = Math.floor(Date.now() / 1000);
        if(decoded.exp - now < 60 * 60 * 24 * 3.5){
            const user = await User.findById(decoded._id);
            const token = user.generatedToken();
            ctx.cookies.set('hjsta_token', token,{
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
            });
        }
    }catch(e){
        return next();
    }
}

export default jwtMiddleware;