import mongoose ,{schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber :{
        type : Schema.Types.ObjectId,//one who is subscribing
        ref :"User"
    },
    channel :{
        type : Schema.types.ObjectId, //the owner of subscriber
        ref :"user"
    }
},{timestamps:true})

export const subscription = mongoose.model("subscription", subscriptionSchema);