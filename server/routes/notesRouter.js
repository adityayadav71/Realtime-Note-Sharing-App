const express = require("express");
const authController = require("../controllers/authController");
const noteController = require("../controllers/noteController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(noteController.getNotes).post(noteController.createNote).patch(noteController.updateNote).delete(noteController.deleteNote);

router.get("/:id", noteController.getNoteById);
module.exports = router;
