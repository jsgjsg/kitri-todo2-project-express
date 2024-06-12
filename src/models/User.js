import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username : { type: String, required: true, unique:true},
  password : { type: String, requierd: true},
  age : { type: Number, require: true}
});

const User = mongoose.model("User", UserSchema);

export default User;