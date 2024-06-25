import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  //dueDate: { type: Date, default: Date.now },
  dueDate: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Todo = mongoose.model("Todo", TodoSchema);

export default Todo;
