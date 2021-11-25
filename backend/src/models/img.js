import mongoose,{ Schema } from 'mongoose';

const FileSchema = new Schema({
	url:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
	post:{
		_id:mongoose.Types.ObjectId,
		content:String,
	}
})