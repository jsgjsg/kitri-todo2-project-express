import express from "express";
import Todo from "../models/Todo.js";
import passport from "passport";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todo = await Todo.find({ userId: req.user._id });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).send("GET /api/todos 서버오류");
  }
});

// router.get("/id/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await Todo.find({ _id: id, userId: req.user._id });
//     res.status(200).json(todo);
//   } catch (err) {
//     res.status(500).send("GET /api/todos 서버오류");
//   }
// });

router.get("/hasDate", async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    let dates = [];
    todos.forEach((todo) => {
      dates.push(todo.dueDate);
    });

    res.send([...new Set(dates)]);
  } catch (err) {
    res.status(500).send("GET /api/todos/hasDate 서버오류");
  }
});

router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const todo = await Todo.find({ userId: req.user._id, dueDate: date });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).send("GET /api/todos 서버오류");
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, completed, dueDate, fixOX, parentId } = req.body;

    console.log(req.body);
    const todo = new Todo({
      title: title,
      description: description,
      userId: req.user._id,
      dueDate: dueDate,
      fixOX: fixOX
    });
    console.log(todo);

    if (completed) todo.completed = completed;
    if (dueDate) todo.dueDate = dueDate;
    if (parentId) todo.deadlineId = parentId;

    const newTodo = await todo.save();

    res.status(200).send(newTodo);
  } catch (err) {
    res.status(500).send("POST /api/todos 서버오류");
  }
});

router.put("/:id", async (req, res) => {
  // title, description, completed, dueDate
  try {
    const { id } = req.params;
    const { title, description, completed, dueDate, fixOX, parentId } = req.body;

    console.log(req.body);
    
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, description, completed, dueDate, fixOX, deadlineId: parentId ? parentId : null},
      { new: true, runValidators: true }
    );

    // console.log(updatedTodo);

    if (!updatedTodo) return res.send("권한X");

    res.status(200).send(updatedTodo);
  } catch (err) {
    res.status(500).send("PUT /api/todos 서버오류");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deletedTodo) return res.status(403).send("권한X");

    res.status(200).send(deletedTodo);
  } catch (err) {
    res.status(500).send("DELETE /api/todos 서버오류");
  }
});

// CRUD 구현
// 로그인 한 유저의 todolist CRUD 구현
// 로그인 하지 않은 경우 접근 권한 x

// /api/todos => get, post
// /api/todos/:id => put, delete

export default router;
