"use client"

const TaskFilter = ({ filter, onFilterChange }) => {
  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value })
  }

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value })
  }

  return (
    <div className="task-filter">
      <div className="filter-group">
        <label htmlFor="status-filter">Status:</label>
        <select id="status-filter" value={filter.status} onChange={handleStatusChange}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-by">Sort by:</label>
        <select id="sort-by" value={filter.sortBy} onChange={handleSortChange}>
          <option value="dueDate">Due Date</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
  )
}

export default TaskFilter
