import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskAPI } from '../services/api';

export default function UpdateTask() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [operation, setOperation] = useState('uppercase');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await taskAPI.getTask(id);
        setTitle(data.task.title);
        setInputText(data.task.inputText);
        setOperation(data.task.operation);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setFetching(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await taskAPI.updateTask(id, { title, inputText, operation });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p>Loading task details...</p>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Update Task</h1>
      <div className="card" style={{ marginTop: '24px' }}>
        <form onSubmit={handleSubmit}>
          <label>Task Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          
          <label>Operation</label>
          <select value={operation} onChange={(e) => setOperation(e.target.value)}>
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="reverse">Reverse String</option>
            <option value="word_count">Word Count</option>
          </select>

          <label>Input Text</label>
          <textarea 
            rows="5" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            required 
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/')} style={{ background: 'var(--border)' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
