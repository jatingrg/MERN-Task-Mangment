"use client"

import { useState } from "react"
import { useTasks } from "../context/TaskContext"
import { formatDate } from "../utils/dateUtils"

const TaskItem = ({ task }) => {
  const { updateTask, deleteTask } = useTasks()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate.split("T")[0], 
  })

  const handleChange = (e) => {
    setEditedTask({
      ...editedTask,
      [e.target.name]: e.target.value,
    })
  }

  const handleStatusToggle = async () => {
    const newStatus = task.status === "pending" ? "completed" : "pending"
    await updateTask(task._id, { ...task, status: newStatus })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedTask({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate.split("T")[0],
    })
  }

  const handleSave = async () => {
    const result = await updateTask(task._id, editedTask)
    if (result.success) {
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task._id)
    }
  }

  return (
    <div className={`task-item ${task.status === "completed" ? "completed" : ""}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={editedTask.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={editedTask.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={editedTask.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="task-edit-actions">
            <button onClick={handleSave} className="btn btn-success btn-sm">
              Save
            </button>
            <button onClick={handleCancel} className="btn btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-status">
                <span className={`status-badge ${task.status}`} onClick={handleStatusToggle}>
                  {task.status}
                </span>
              </div>
            </div>

            <p className="task-description">{task.description}</p>

            <div className="task-footer">
              <span className="task-due-date">Due: {formatDate(task.dueDate)}</span>
            </div>
          </div>

          <div className="task-actions">
            <button onClick={handleEdit} className="btn btn-primary btn-sm">
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger btn-sm">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TaskItem
