// 로그인한 상태인지 아닌지 체크
const checkLoggedIn = (ctx,next) => {
    if(!ctx.state.user){
        ctx.status = 401;
        return;
    }
    return next();
};

export default checkLoggedIn;