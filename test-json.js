import mongoose, { Schema } from "mongoose";
class ApiRes {
  constructor(statusCode, message = "success", data, res) {
    this.res = res;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}
const userSchema = new Schema({ username: String });
const User = mongoose.model("TestUser", userSchema);

async function run() {
  await mongoose.connect("mongodb://localhost:27017/test");
  const user = await User.create({ username: "test" });
  const checkCreatedUser = await User.findById(user._id);
  
  const response = new ApiRes(200, checkCreatedUser, "user registered successfully");
  try {
    console.log(JSON.stringify(response));
    console.log("Success!");
  } catch(e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
run();
