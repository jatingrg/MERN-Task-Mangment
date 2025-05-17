"use client"

import { useState, useEffect } from "react"
import { TaskProvider, useTasks } from "../context/TaskContext"
import TaskList from "../components/TaskList"
import TaskForm from "../components/TaskForm"
import TaskFilter from "../components/TaskFilter"

const DashboardContent = () => {
  const { tasks, loading, error } = useTasks()
  const [filteredTasks, setFilteredTasks] = useState([])
  const [filter, setFilter] = useState({ status: "all", sortBy: "dueDate" })

  useEffect(() => {
    if (tasks) {
      let result = [...tasks]

      if (filter.status !== "all") {
        result = result.filter((task) => task.status === filter.status)
      }

      if (filter.sortBy === "dueDate") {
        result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      } else if (filter.sortBy === "title") {
        result.sort((a, b) => a.title.localeCompare(b.title))
      }

      setFilteredTasks(result)
    }
  }, [tasks, filter])

  const handleFilterChange = (newFilter) => {
    setFilter({ ...filter, ...newFilter })
  }

  if (loading) return <div className="loading">Loading tasks...</div>

  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="dashboard">
      <h1>Task Dashboard</h1>

      <div className="dashboard-content">
        <div className="task-form-container">
          <h2>Add New Task</h2>
          <TaskForm />
        </div>

        <div className="task-list-container">
          <div className="task-header">
            <h2>Your Tasks</h2>
            <TaskFilter filter={filter} onFilterChange={handleFilterChange} />
          </div>

          {filteredTasks.length === 0 ? (
            <p className="no-tasks">No tasks found. Add a new task to get started!</p>
          ) : (
            <TaskList tasks={filteredTasks} />
          )}
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => (
  <TaskProvider>
    <DashboardContent />
  </TaskProvider>
)

export default Dashboard
