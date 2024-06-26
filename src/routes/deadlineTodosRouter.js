import express from "express";
import DeadlineTodo from "../models/DeadlineTodo.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todo = await DeadlineTodo.find({ userId: req.user._id });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).send("GET /api/todos 서버오류");
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, completed, deadline } = req.body;

    const deadlineTodo = new DeadlineTodo({
      title: title,
      description: description,
      userId: req.user._id,
      deadline: deadline,
    });

    if (completed) deadlineTodo.completed = completed;

    const newTodo = await deadlineTodo.save();

    res.status(200).send(newTodo);
  } catch (err) {
    res.status(500).send("POST /api/todos 서버오류");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, deadline } = req.body;

    const updatedTodo = await DeadlineTodo.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, description, completed, deadline },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) return res.send("권한X");

    res.status(200).send(updatedTodo);
  } catch (err) {
    res.status(500).send("PUT /api/todos 서버오류");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await DeadlineTodo.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deletedTodo) return res.status(403).send("권한X");

    res.status(200).send(deletedTodo);
  } catch (err) {
    res.status(500).send("DELETE /api/todos 서버오류");
  }
});

export default router;