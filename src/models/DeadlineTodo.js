import mongoose from "mongoose";

const DeadlineTodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  deadline: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const DeadlineTodo = mongoose.model("DeadlineTodo", DeadlineTodoSchema);

export default DeadlineTodo;