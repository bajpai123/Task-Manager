const express = require("express");
const router = express.Router();

//get all functions from controllers
const _controller = require("../controller/tasks");

//routes starting with /api/v1/tasks

router.route("/").get(_controller.getAllTasks).post(_controller.createTasks);
router
  .route("/:id")
  .get(_controller.getTasks)
  .patch(_controller.patchTasks)
  .delete(_controller.deleteTasks);

module.exports = router;
