import User from '../../models/user';
import Joi from 'joi';


// 회원가입
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

// 로그인
export const login = async(ctx) => {
    const {username,password} = ctx.request.body;
    
    // 아이디 비번 둘중에 하나 안쳤을때 ?
    if(!username || !password) {
        ctx.status = 401;
        return;
    }

    try{
        const user = await User.findByUsername(username);
        if(!user){ // username의 아이디 사용자가 없을 때 
            ctx.status = 401;
            return;
        }
        // 사용자 잇으면 비번 체크하기
        const valid = await user.checkPassword(password);
        if(!valid){ // 비번 틀렷을 때
            ctx.status = 401;
            return;
        }

        // 비번 맞으면 직렬화 시켜줌
        ctx.body = user.serialize();
        // 토큰 만들어줌
        const token = user.generateToken();
        //쿠키 생성
        ctx.cookies.set('hjsta_token',token,{
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly:true, // 자바스크립트 해킹 방지!
        });
    }catch(e){
        ctx.throw(500,e);
    }

}

/*
    Get  /api/auth/check 
*/
// 로그인 중인지 아닌지를 판단하는 메소드
export const check = async (ctx) => {
    const {user} = ctx.state; //user 객체를 뽑아내서 그안에 user객체가 있는지 없는지 판단.
    if(!user){
        ctx.status = 401;
        return;
    }
    ctx.body = user;
};

// export const findbyEmail = async (ctx) => {
//     const {email} = ctx.request.body;
//     const user = await User.findByEmail(email);
//     if(!user){ // username의 아이디 사용자가 없을 때 
//         ctx.status = 401;
//         return;
//     }
//     ctx.body = user;
// }




/*
    PATCH  /api/auth/edit 전혀 안바뀌는거 key!
*/
// 수정
export const edit = async (ctx) => {
    const { id } = ctx.params;
    const schema = Joi.object().keys({
        name:Joi.string(),
        username: Joi.string(),
        introment: Joi.string(),
    });

    const result = schema.validate(ctx.request.body);
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const nextData = {...ctx.request.body};
    
    try{
        const user = await User.findByIdAndUpdate(id, nextData,{
            new:true,
        }).exec();
        if(!user){
            ctx.status = 404;
            return;
        }
        ctx.body = user;
    }catch(e){
        ctx.throw(500,e);
    }
}

/*
    DELETE  /api/auth/delete 
*/
// 삭제
export const remove = async (ctx) => {
    const { id } = ctx.params;
    try{
        await User.findByIdAndDelete(id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
}

/*
    POST /api/auth/logout
*/

export const logout = async (ctx) => {
    ctx.cookies.set('hjsta_token');
    ctx.status = 204;
}


/*  
    PATCH /api/auth/changepw

    {
        "password" :
    }
*/

export const changePassword = async (ctx) => {
    const { Oldpassword, newPassword } = ctx.request.body;
    const { id } = ctx.params;

    try{
       const user = await User.findById({ _id: id })
        if(!user){ // username의 아이디 사용자가 없을 때 
            console.log('user 있나없나확인');
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(Oldpassword);
        if(!valid) {
            console.log('비밀번호 맞는지 확인');
            ctx.status = 401;
            return;
        }
        if (valid) {
            // change to new password
            user.hashedpassword = newPassword;
            console.log('비밀번호 바꿈');
            user.save();
            console.log('저장')
            ctx.body = user.serialize();

            const token = user.generateToken();
            
            ctx.cookies.set('hjsta_token',token,{
                maxAge: 1000 * 60 * 60 * 24 *7,
                httpOnly:true,
            });
              
          } else {
            ctx.status = 401;
          }
    }catch(e){
        ctx.throw(500,e)
    }
}

// 아이디 비번 체크
export const idAndPassWordCheck = async (ctx) => {
    const {username, password} = ctx.request.body;
    console.log(username);
    console.log(password);
    const exists = await User.findByUsername(username);

        if(exists){
            ctx.body = exists;  
            const valid = await exists.checkPassword(password);

            if(!valid){ // 비번 틀렷을 때
                ctx.body = { pw : "틀림"}
            }  
        }

        if(!exists){
            ctx.body = { person : "없다고"}
        }
}

// 회원가입, 프로필 편집 아이디 중복확인
export const idCheck = async (ctx) => {
    const {username} = ctx.request.body;
    const exists = await User.findByUsername(username);
        if(exists){
            ctx.body = exists;
        }
        if(!exists){
            ctx.body = { person : "없다고"}
        }
}

// 이메일 중복확인
export const emailCheck = async (ctx) => {
    const {email} = ctx.request.body;
    const exists = await User.findByEmail(email);
        if(exists){
            ctx.body = exists;
        }
}

// 비밀번호 변경 이전 비밀번호 확인
export const expwCheck = async (ctx) => {
    const {id} = ctx.params;
    const {password} = ctx.request.body;

    const user = await User.findById(id);
    const valid = await user.checkPassword(password);
    if(!valid){ // 비번 틀렷을 때
        ctx.body = { expw : "틀림"}
    }
    if(valid){
        ctx.body = {expw : "맞음"}
    }
}

// 팔로잉 했을때 1.팔로잉한 사람 팔로잉 수 +1, 팔로잉배열에 추가
/*
    PATCH 
    {
        "whofollowing" : "",
        "whofollower" : "",
    }
*/ 
export const following = async (ctx) => {
    const { ingid, werid } = ctx.params; 
    const {whofollowing, whofollower} = ctx.request.body; 
    // 팔로잉 객체 수정
    const user1 = await User.findById(ingid);
    user1.followingNum += 1;
    const followingarr = user1.followingPeople;
    for(let i=0; i<followingarr.length; i++){
        if(followingarr[i] === whofollowing){
            console.log("followingarr : 이미 ※팔로우※ 했음!!");
            return false;
        }
    }
    user1.followingPeople = [whofollowing, ...followingarr];
    await user1.save();
    console.log("팔로잉 한명 추가!");
    // 팔로워 객체 수정
    const user2 = await User.findById(werid);
    user2.followerNum += 1;
    const followerarr = user2.followerPeople;
    for(let i=0; i<followerarr.length; i++){
        if(followerarr[i] === ctx.state.user.username){
            console.log("followerarr: 이미 ※팔로우※ 했음!!");
            return false;
        }
    }
    user2.followerPeople = [whofollower, ...followerarr];
    await user2.save();
    console.log("팔로워 한명 추가됨!");
    ctx.body = user1, user2;
}
/*
PATCH 
    {
        "whounfollowing" : "",
        "whofollower" : "",
    }
*/ 
export const unfollowing = async (ctx) => {
    const { ingid, werid } = ctx.params;
    const {whounfollowing, whounfollower} = ctx.request.body;
    // 팔로잉 객체 수정
    const user1 = await User.findById(ingid);
    if(user1.followingNum > 0){
        user1.followingNum -= 1;
    }
    const followingarr = user1.followingPeople;
    let index = followingarr.indexOf(whounfollowing);
    if(index > -1){
        followingarr.splice(index,1);
        console.log("팔로잉취소!");
    }
    await user1.save();
    // 언팔당한 사람 수정
    const user2 = await User.findById(werid);
    if(user2.followerNum > 0){
        user2.followerNum -=1;
    }
    const followerarr = user2.followerPeople;
    let index2 = followerarr.indexOf(whounfollower);
    if(index2 > -1){
        followerarr.splice(index, 1);
        console.log("팔로워한명사라짐!");
    }
    await user2.save();
    ctx.body = user1, user2;
}