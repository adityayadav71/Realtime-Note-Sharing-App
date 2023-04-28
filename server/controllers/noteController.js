const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Note = require("../models/notesModel");
const AppError = require("../utils/appError");

exports.getNotes = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("notes");
  res.status(200).json({
    status: "success",
    notes: user.notes,
  });
});

exports.getNoteById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const note = await Note.findById(id);
  if (!note) new AppError("Could not load the note", 404);

  res.status(200).json({
    status: "success",
    note,
  });
});

exports.createNote = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const userId = req.user._id;
  const note = await Note.create({ user: userId, title });

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $push: { notes: note },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    note,
  });
});

exports.updateNote = catchAsync(async (req, res, next) => {
  const { note } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(note._id, { title: note.title, content: note.content, authors: note.authors, labels: note.labels }, { new: true });

  res.status(200).json({
    status: "success",
    note: updatedNote,
  });
});

exports.deleteNote = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const userId = req.user._id;

  const note = await Note.findByIdAndDelete(id).exec();

  await User.findByIdAndUpdate(
    userId,
    {
      $pull: { notes: id },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    note,
  });
});
