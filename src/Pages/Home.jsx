import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../Components/Navbar';
import { useUser } from '@clerk/clerk-react';  // Clerk se user status lena

const Home = () => {
  const { user } = useUser(); // Clerk user
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState(''); // For showing login message

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!user) {
      setMessage('Please sign in to add tasks.');  // If not logged in, show message
      return;
    }

    if (input.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
      setInput('');
      setMessage(''); // Clear any previous message
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearAll = () => {
    setTasks([]);
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim() === '') return;
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editText } : task
    ));
    setEditId(null);
    setEditText('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="todo-container">
        <h1 className="todo-title">Welcome To My ToDo App 🚀</h1>

        <div className="input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
          />
          <button onClick={addTask}>Add</button>
        </div>

        {/* Show Message if not logged in */}
        {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}

        <div className="filter-buttons">
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('active')}>Active</button>
          <button onClick={() => setFilter('completed')}>Completed</button>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="empty-text">No tasks yet! 📝</p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map(task => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                {editId === task.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
                )}

                <div className="task-buttons">
                  <button onClick={() => toggleComplete(task.id)}>
                    {task.completed ? 'Undo' : 'Done'}
                  </button>
                  <button onClick={() => startEdit(task.id, task.text)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {tasks.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>Clear All</button>
        )}
      </div>
    </>
  );
};

export default Home;
