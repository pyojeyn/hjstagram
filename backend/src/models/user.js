import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
    email : {
        type:String,
        required: true,    
    },
    name : {
        type:String,
        required: true,  
    },
    username : {
        type:String,
        required: true,
    },		
    hashedpassword: {
        type:String,
    },
    postsNum : {
        type:Number,
        default:0,
    },  //  피드   이건 잘 모르겠음

    introment: {
        type:String,
    },
    followingNum:{ //팔로잉 수 
        type:Number,
        default: 0,
    },
    followerNum:{ //팔로워 수 
        type:Number,
        default:0,
    },
    followingPeople :[String], // 팔로잉 리스트
    followerPeople : [String], // 팔로워 리스트 
});


// 비밀번호 암호화 하기
UserSchema.methods.setPassword = async function(password){
    const hash = await bcrypt.hash(password,10);
    this.hashedpassword = hash;
}




// 입력한 비밀번호와 암호화되서 저장된 비밀번호 비교
UserSchema.methods.checkPassword = async function(password){
    const result = await bcrypt.compare(password, this.hashedpassword); // 각각 찍어보기
    console.log("입력할때비번 : "+password);
    console.log("기존에 암호화되서 저장되어있는 비번 : "+this.hashedpassword);
    console.log(result);
    return result; //result 값 찍어보기 
};



    
//여기만 고쳐야될거 같은데..
UserSchema.pre('save', async function (next){
    if(this.isModified('email')){ // 회원가입할 때 암호화 반복되는거 방어
        console.log('pre : 비밀번호 수정 안됨(회원가입 잘 됨)')   
        return next();
    }else if(this.isModified('hashedpassword')){
        this.hashedpassword = await bcrypt.hash(this.hashedpassword,10);
        console.log('pre : 비밀번호바뀜(ChangePassword()잘 먹힘)')
        return next();
    }
  });

// 사용자쪽으로 data를 json으로 전달 회원정보수정,보기 
// password까지 돌려주긴 좀 그러니까 data에서 password를 지워줄거임.
UserSchema.methods.serialize = function(){
    const data = this.toJSON();
    delete data.hashedpassword;
    return data;
};

UserSchema.methods.generateToken = function(){
    const token = jwt.sign(
        {// 토큰 서명 할때 스키마에 있는 필드 다 써줘야 하는건가..? 여기에 다 써줘야 response로 써먹을 수 있음!
            _id: this.id,
            email:this.email,
            name:this.name,
            username:this.username,
            introment:this.introment,
            followingPeople: this.followingPeople,
            followerPeople: this.followerPeople,
            followerNum:this.followerNum,
            followingNum:this.followingNum,
            postsNum:this.postsNum,
        },
        '!@#$%^&*()',
        { expiresIn: '7d' },
    );
    return token;
};

// findeByUsername 은 내가 만든거
UserSchema.statics.findByUsername = function(username){
    return this.findOne({username}); //지정되어잇는 함수 findOne
};

UserSchema.statics.findByEmail = function(email){
    return this.findOne({email});
}


const User = mongoose.model('User',UserSchema); // User 모델 정의
export default User;