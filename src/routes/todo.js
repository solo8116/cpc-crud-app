const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const todo_controllers = require("../controllers/todo");

router.post("/create", auth, todo_controllers.create_todo);
router.get("/todo-list", auth, todo_controllers.total_todo);
router.patch("/:id", auth, todo_controllers.update_todo);
router.delete("/:id", auth, todo_controllers.delete_todo);
router.get("/:id", auth, todo_controllers.single_todo);

module.exports = router;
