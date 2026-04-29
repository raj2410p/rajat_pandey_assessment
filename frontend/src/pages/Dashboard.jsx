import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { Plus, RefreshCcw, Trash2, Edit2 } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data } = await taskAPI.getTasks();
      setTasks(data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await taskAPI.deleteTask(id);
      fetchTasks();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'var(--success)';
      case 'failed': return 'var(--error)';
      case 'running': return 'var(--running)';
      default: return 'var(--pending)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Tasks</h1>
        <Link to="/create-task">
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Create Task
          </button>
        </Link>
      </div>

      {loading && tasks.length === 0 ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {tasks.map(task => (
            <div key={task._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ marginBottom: '4px' }}>{task.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{task.operation} • {task.inputText.substring(0, 30)}...</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  background: `${getStatusColor(task.status)}22`,
                  color: getStatusColor(task.status),
                  border: `1px solid ${getStatusColor(task.status)}44`
                }}>
                  {task.status.toUpperCase()}
                </span>
                {task.result !== null && (
                  <div style={{ fontSize: '14px' }}>
                    Result: <strong>{task.result}</strong>
                  </div>
                )}
                <Link to={`/update-task/${task._id}`} style={{ color: 'var(--primary)', padding: '8px' }}>
                  <Edit2 size={18} />
                </Link>
                <button onClick={() => handleDelete(task._id)} style={{ background: 'transparent', color: 'var(--error)', padding: '8px' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
