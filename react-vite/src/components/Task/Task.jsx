import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  createTask,
  completeTask,
  removeTask,
  editTask,
} from "../../redux/tasks";
import "./Task.css";

function Task({ tarantulaId }) {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => Object.values(state.tasks || {}));
  const tasks = allTasks.filter((task) => task.tarantula_id === tarantulaId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      name,
      description,
      due_date: dueDate,
      tarantula_id: tarantulaId,
    };
    await dispatch(createTask(newTask));
    setName("");
    setDescription("");
    setDueDate("");
  };

  const handleComplete = (taskId) => {
    dispatch(completeTask(taskId));
  };

  const handleDelete = (taskId) => {
    dispatch(removeTask(taskId));
  };

  const handleReset = (task) => {
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + task.interval_days);
    dispatch(
      editTask(task.id, {
        due_date: newDueDate.toISOString(),
        completed: false,
      })
    );
  };

  const calculateRemainingDays = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  };

  return (
    <div className="task-container">
      <h3>Task Reminders</h3>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      {tasks.length === 0 ? (
        <p>No task reminder for this tarantula.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
              <div className="task-info">
                <div className="task-header">
                  <h4>{task.name}</h4>
                  <span className="task-created">
                    📅Date: {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p>{task.description}</p>
                <p className="task-status">
                  Status: {task.completed ? "✅ Done" : "🕒 Incomplete"}
                </p>
                <p className="task-timer">
                  ⏳ {calculateRemainingDays(task.due_date)} days remaining
                </p>
              </div>
              <div className="task-actions">
                {!task.completed && (
                  <button className="task-complete-btn" onClick={() => handleComplete(task.id)}>
                    Mark as Complete
                  </button>
                )}
                <button className="task-delete-btn" onClick={() => handleDelete(task.id)}>
                  Delete
                </button>
                <button
                  className="task-reset-btn"
                  onClick={() => handleReset(task)}
                  disabled={task.completed}
                >
                  Reset Timer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Task;
