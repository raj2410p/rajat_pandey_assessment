import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';

export default function CreateTask() {
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [operation, setOperation] = useState('uppercase');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await taskAPI.createTask({ title, inputText, operation });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>New Task</h1>
      <div className="card" style={{ marginTop: '24px' }}>
        <form onSubmit={handleSubmit}>
          <label>Task Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            placeholder="Process document X" 
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
            placeholder="Enter text to process..."
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Start Processing'}
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
