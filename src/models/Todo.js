import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title : { type: String, required: true },
  description : { type: String, required: true },
  completed : { type: Boolean, default: false },
  dueDate : { type: Date, default: Date.now },
  userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Todo = mongoose.model("Todo", TodoSchema);

export default Todo;

// title, description : 필수!
// completed : false default
// dueDate : 현재 시간 default