const TodoList = require("../models/todo");
const User = require("../models/user");

const create_todo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "user is not found" });
    }
    const { content } = req.body;
    const todo = await TodoList.create({
      createdBy: userId,
      content,
    });
    res
      .status(201)
      .json({ success: true, msg: "todo created successfully", data: todo });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const total_todo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "user not found" });
    }
    const todoList = await TodoList.find({});
    res.status(200).json({ success: true, data: todoList });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const delete_todo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "user not found" });
    }
    const todo = await TodoList.findById(todoId);
    if (!todo) {
      return res.status(404).json({ success: false, msg: "todo not found" });
    }
    await TodoList.findByIdAndDelete(todoId);
    res.status(200).json({ success: true, msg: "todo deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const single_todo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "user not found" });
    }
    const todo = await TodoList.findById(todoId);
    if (!todo) {
      return res.status(404).json({ success: false, msg: "todo not found" });
    }
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const update_todo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user._id;
    const { content, completed } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "user not found" });
    }
    const todo = await TodoList.findById(todoId);
    if (!todo) {
      return res.status(404).json({ success: false, msg: "todo not found" });
    }
    const updatedTodo = await TodoList.findByIdAndUpdate(
      todoId,
      {
        content,
        completed,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      msg: "list updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

module.exports = {
  create_todo,
  total_todo,
  delete_todo,
  single_todo,
  update_todo,
};
