"use client"

import { useState } from "react"
import { useTasks } from "../context/TaskContext"

const TaskForm = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: new Date().toISOString().split("T")[0],
  })
  const [error, setError] = useState("")
  const { addTask } = useTasks()

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!task.title) {
      setError("Title is required")
      return
    }

    if (!task.dueDate) {
      setError("Due date is required")
      return
    }

    try {
      setError("")
      const result = await addTask(task)

      if (result.success) {
        // Reset form
        setTask({
          title: "",
          description: "",
          status: "pending",
          dueDate: new Date().toISOString().split("T")[0],
        })
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to add task")
      console.error(err)
    }
  }

  return (
    <div className="task-form">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Task description"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={task.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input type="date" id="dueDate" name="dueDate" value={task.dueDate} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Add Task
        </button>
      </form>
    </div>
  )
}

export default TaskForm
