import mongoose,{ Schema } from 'mongoose';

const SavePeedSchema = new Schema({
    user:{ // 글쓴이(로그인한상태)
        _id:mongoose.Types.ObjectId,
        username: String,
    },
    post:{ // 저장됨 피드
		_id:mongoose.Types.ObjectId,
        contents:String,
	},
});

const SavePeed = mongoose.model('SavePeed',SavePeedSchema);

export default SavePeed;