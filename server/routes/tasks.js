const express = require("express")
const router = express.Router()
const Task = require("../models/Task")
const auth = require("../middleware/auth")


router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 })
    res.json(tasks)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
})


router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body

    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      status,
      dueDate,
    })

    const task = await newTask.save()

    res.status(201).json(task)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
})


router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    res.json(task)
  } catch (err) {
    console.error(err.message)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
})


router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    task.title = title || task.title
    task.description = description !== undefined ? description : task.description
    task.status = status || task.status
    task.dueDate = dueDate || task.dueDate

    await task.save()

    res.json(task)
  } catch (err) {
    console.error(err.message)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
})


router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await task.remove()

    res.json({ message: "Task removed" })
  } catch (err) {
    console.error(err.message)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
