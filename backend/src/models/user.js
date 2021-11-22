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
    posts : [String],  //  피드   이건 잘 모르겠음
    followers : [{
                    user:{
        		    _id:mongoose.Types.ObjectId,
        		    username: String,
    	}
    }], 
    following : [{
                user:{
                    _id:mongoose.Types.ObjectId,
                    username: String,
                }        
    	}], 
    closefriend : [{
        user:{
            _id:mongoose.Types.ObjectId,
            username: String,
        }        
    }],
    savePeed: [String], // 저장됨   이것도 잘 모르겟음
    introment: {
        type:String,
    }
});

// followers, following, closefriend 는 여러명이기 때문에 배열 처리 []
// 일단 댓글하고 좋아요는 필요없을거 같아서 뺌


// 비밀번호 암호화 하기
UserSchema.methods.setPassword = async function(password){
    const hash = await bcrypt.hash(password,10);
    this.hashedpassword = hash;
}




// 입력한 비밀번호와 암호화되서 저장된 비밀번호 비교
UserSchema.methods.checkPassword = async function(password){
    const result = await bcrypt.compare(password, this.hashedpassword);
    return result;
};



    
//여기만 고쳐야될거 같은데..
UserSchema.pre('save', async function (next){
    console.log('왜 안되니? ㅎㅎ');
    if(!this.isModified('hashedpassword')){ // 3-1
      console.log('비밀번호 수정 안됨')   
      return next();
    }else {
        this.hashedpassword = await bcrypt.hash(this.hashedpassword,10);
        console.log('비밀번호바뀜')
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
        {// 토큰 서명 할때 스키마에 있는 필드 다 써줘야 하는건가..?
            _id: this.id,
            email:this.email,
            name:this.name,
            username:this.username,
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

UserSchema.statics.findByEmail = async function(email){
    return this.findOne({email});
}


const User = mongoose.model('User',UserSchema); // User 모델 정의
export default User;