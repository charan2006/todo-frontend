import { useState, forwardRef } from 'react';
import { Icon } from '@iconify/react';
import { updateTodo as updateTodoApi } from '../api';

const TodoItem = forwardRef(function TodoItem({ value, indexNum, displayNum, deleteTask, updateTaskInState }, ref) {
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [subTask, setSubTask] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editingSubtaskText, setEditingSubtaskText] = useState('');

  const pushUpdate = async (updates) => {
    try {
      const updated = await updateTodoApi(value._id, updates);
      updateTaskInState(updated);
    } catch (err) {
      console.error('Failed to update todo:', err);
      alert('Could not save change to the server');
    }
  };

  const addSubTask = () => {
    const newSubTask = subTask.trim();
    if (!newSubTask) { alert('Please enter a subtask'); return; }
    const currentSubtasks = value.subtasks || [];
    if (currentSubtasks.some((sub) => sub.title.toLowerCase() === newSubTask.toLowerCase())) {
      alert('Subtask already exists');
      return;
    }
    pushUpdate({ subtasks: [...currentSubtasks, { title: newSubTask, completed: false }] });
    setSubTask('');
  };

  const toggleSubtask = (subtaskId) => {
    const newSubtasks = value.subtasks.map((sub) =>
      sub._id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    pushUpdate({ subtasks: newSubtasks });
  };

  const startEditSubtask = (subtask) => {
    setEditingSubtaskId(subtask._id);
    setEditingSubtaskText(subtask.title);
  };

  const saveSubtaskEdit = () => {
    if (!editingSubtaskText.trim()) { alert('Please enter a subtask'); return; }
    const newSubtasks = value.subtasks.map((sub) =>
      sub._id === editingSubtaskId ? { ...sub, title: editingSubtaskText.trim() } : sub
    );
    pushUpdate({ subtasks: newSubtasks });
    setEditingSubtaskId(null);
    setEditingSubtaskText('');
  };

  const deleteSubtask = (subtaskId) => {
    pushUpdate({ subtasks: value.subtasks.filter((sub) => sub._id !== subtaskId) });
  };

  const deleteRow = () => deleteTask(indexNum);
  const checkStatus = () => pushUpdate({ status: !value.status });
  const startEdit = (index, task) => { setEditIndex(index); setEditText(task); };

  const updateTodo = () => {
    if (!editText.trim()) { alert('Please enter a task'); return; }
    pushUpdate({ task: editText.trim() });
    setEditIndex(null);
    setEditText('');
  };

  const getEstimatedTime = () => {
    if (!value.startDate || !value.dueDate) return null;
    const start = new Date(value.startDate);
    const due = new Date(value.dueDate);
    const diffMs = due - start;
    if (diffMs < 0) return '⚠ Due before start';
    if (diffMs === 0) return 'Same day';
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (diffDays === 0) return `${diffHours}h`;
    if (diffHours === 0) return `${diffDays}d`;
    return `${diffDays}d ${diffHours}h`;
  };

  return (
    <li ref={ref} className={value.status ? 'completed' : ''}>
      {editIndex === indexNum ? (
        <>
          <input type="text" className="edit-input" value={editText}
            onChange={(e) => setEditText(e.target.value)} />
          <button className="edit-button"
            onClick={(e) => { e.stopPropagation(); updateTodo(); }}>Save</button>
        </>
      ) : (
        <>
          <div className="task-header">
            <div className="task-info">

              <div className="task-title-row">
                <Icon
                  icon={value.status ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'}
                  className={`task-checkbox${value.status ? ' action-checked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); checkStatus(); }}
                />
                <div className="task-title">{displayNum}. {value.task}</div>
              </div>

              {value.description && (
                <div className="task-description">{value.description}</div>
              )}

              <div className="task-dates">
                <small>Start: {value.startDate || 'Not set'}</small>
                <br />
                <small>Due: {value.dueDate || 'No deadline'}</small>
              </div>

              {getEstimatedTime() && (
                <div className={`est-time ${getEstimatedTime().startsWith('⚠') ? 'est-invalid' : ''}`}>
                  ⏱ Estimated: {getEstimatedTime()}
                </div>
              )}

              <div className={`priority-badge priority-${value.priority?.toLowerCase()}`}>
                Priority: {value.priority}
              </div>
            </div>

            <div className="task-actions">
              <Icon icon="mdi:pencil" className="action-icon"
                onClick={(e) => { e.stopPropagation(); startEdit(indexNum, value.task); }} />
              <Icon icon="mdi:close" className="action-icon action-delete"
                onClick={(e) => { e.stopPropagation(); deleteRow(); }} />
            </div>
          </div>

          <div className="subtask-list">
            {(value.subtasks || []).map((subtask) => (
              <div key={subtask._id} className="subtask-item">
                {editingSubtaskId === subtask._id ? (
                  <div className="subtask-edit-wrapper">
                    <input className="subtasks" type="text" value={editingSubtaskText}
                      onChange={(e) => setEditingSubtaskText(e.target.value)} />
                    <button className="submitsubtasks" onClick={saveSubtaskEdit}>Save</button>
                    <button className="submitsubtasks" onClick={() => setEditingSubtaskId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="subtask-row">
                    <Icon
                      icon={subtask.completed ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'}
                      className={`subtask-check${subtask.completed ? ' checked' : ''}`}
                      onClick={() => toggleSubtask(subtask._id)}
                    />
                    <span className={`subtask-title${subtask.completed ? ' done' : ''}`}>{subtask.title}</span>
                    <Icon icon="mdi:pencil" className="subtask-action" onClick={() => startEditSubtask(subtask)} />
                    <Icon icon="mdi:close" className="subtask-action subtask-delete" onClick={() => deleteSubtask(subtask._id)} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="subtask-input-wrapper">
            <input className="subtasks" type="text" placeholder="Add sub task"
              value={subTask} onChange={(e) => setSubTask(e.target.value)} />
            <button className="submitsubtasks" onClick={addSubTask}>Save</button>
          </div>
        </>
      )}
    </li>
  );
});

export default TodoItem;