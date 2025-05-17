"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"

const TaskContext = createContext()

export const useTasks = () => useContext(TaskContext)

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks()
    } else {
      setTasks([])
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/tasks")
      setTasks(res.data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch tasks")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (taskData) => {
    try {
      const res = await axios.post("/api/tasks", taskData)
      setTasks([...tasks, res.data])
      return { success: true, task: res.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to add task",
      }
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, taskData)
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)))
      return { success: true, task: res.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update task",
      }
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`)
      setTasks(tasks.filter((task) => task._id !== id))
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete task",
      }
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
