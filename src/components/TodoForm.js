import { useState } from 'react';
import { categorizeTask, suggestTaskDetails } from '../api';

const categoryColors = {
    work: '#3b82f6',
    personal: '#10b981',
    urgent: '#ef4444',
};

function TodoForm({ saveTodoList }) {
    const [task, setTask] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [suggestion, setSuggestion] = useState(null);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);
    const [saving, setSaving] = useState(false);

    // Track whether the user has manually touched these fields.
    // If they haven't, we know it's safe to auto-apply an AI suggestion.
    const [priorityTouched, setPriorityTouched] = useState(false);
    const [dueDateTouched, setDueDateTouched] = useState(false);

    const fetchAiData = async () => {
        const [cat, sug] = await Promise.all([
            categorizeTask(task, description),
            suggestTaskDetails(task, description),
        ]);
        return { cat, sug };
    };

    const handleGetSuggestions = async () => {
        if (!task.trim()) {
            alert('Please enter a task title first');
            return;
        }
        setLoadingSuggestion(true);
        setSuggestion(null);
        setShowSuggestion(false);
        try {
            const { cat, sug } = await fetchAiData();
            setCategory(cat.category || 'personal');
            setSuggestion(sug);
            setShowSuggestion(true);
        } catch (err) {
            console.error('AI suggestion failed:', err);
            alert('Could not get AI suggestions. Try again.');
        } finally {
            setLoadingSuggestion(false);
        }
    };

    const handleAcceptSuggestion = () => {
        if (suggestion) {
            setPriority(suggestion.priority || 'Medium');
            setPriorityTouched(true);
            if (suggestion.dueDate) {
                setDueDate(suggestion.dueDate);
                setDueDateTouched(true);
            }
        }
        setShowSuggestion(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!task.trim() || saving) return;

        setSaving(true);
        try {
            // Always resolve a category and an AI suggestion before saving,
            // if we haven't already fetched one via the "Get AI Suggestions" button.
            let finalCategory = category;
            let finalPriority = priority;
            let finalDueDate = dueDate;

            if (!finalCategory || !suggestion) {
                try {
                    const { cat, sug } = await fetchAiData();
                    finalCategory = finalCategory || cat.category || 'personal';

                    // Only auto-apply priority/deadline if the user never touched them —
                    // otherwise we respect what they explicitly chose.
                    if (!priorityTouched && sug?.priority) {
                        finalPriority = sug.priority;
                    }
                    if (!dueDateTouched && sug?.dueDate) {
                        finalDueDate = sug.dueDate;
                    }
                } catch (aiErr) {
                    console.error('AI auto-categorization failed, falling back:', aiErr);
                    finalCategory = finalCategory || 'personal';
                }
            }

            saveTodoList({
                task: task.trim(),
                dueDate: finalDueDate,
                startDate,
                subtasks: [],
                priority: finalPriority,
                description: description.trim(),
                category: finalCategory,
            });

            setTask('');
            setStartDate('');
            setDueDate('');
            setPriority('Medium');
            setDescription('');
            setCategory('');
            setSuggestion(null);
            setShowSuggestion(false);
            setPriorityTouched(false);
            setDueDateTouched(false);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="todo-form-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Enter the task"
                    />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => {
                            setDueDate(e.target.value);
                            setDueDateTouched(true);
                        }}
                    />
                    <select
                        value={priority}
                        onChange={(e) => {
                            setPriority(e.target.value);
                            setPriorityTouched(true);
                        }}
                        className="priority"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="description-input"
                    placeholder="Add a task description (optional)..."
                    rows={2}
                />

                <div className="ai-row">
                    <button
                        type="button"
                        className="ai-suggest-btn"
                        onClick={handleGetSuggestions}
                        disabled={loadingSuggestion || !task.trim()}
                    >
                        {loadingSuggestion ? '✨ Thinking...' : '✨ Preview AI Suggestions'}
                    </button>

                    {category && (
                        <span
                            className="category-badge"
                            style={{ background: categoryColors[category] }}
                        >
                            {category}
                        </span>
                    )}
                </div>
                <p className="ai-hint" style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>
                    Category is auto-assigned on save. Priority/deadline are auto-suggested if you leave them unset — use the button above to preview and override before saving.
                </p>
            </form>

            {showSuggestion && suggestion && (
                <div className="suggestion-panel">
                    <div className="suggestion-header">
                        <span>✨ AI Suggestions</span>
                        <button
                            className="suggestion-close"
                            onClick={() => setShowSuggestion(false)}
                        >✕</button>
                    </div>
                    <div className="suggestion-body">
                        <div className="suggestion-item">
                            <span className="suggestion-label">Category</span>
                            <span
                                className="category-badge"
                                style={{ background: categoryColors[category] }}
                            >
                                {category}
                            </span>
                        </div>
                        <div className="suggestion-item">
                            <span className="suggestion-label">Suggested Priority</span>
                            <span className={`sug-priority sug-priority-${suggestion.priority?.toLowerCase()}`}>
                                {suggestion.priority}
                            </span>
                        </div>
                        {suggestion.dueDate && (
                            <div className="suggestion-item">
                                <span className="suggestion-label">Suggested Deadline</span>
                                <span className="suggestion-value">{suggestion.dueDate}</span>
                            </div>
                        )}
                        {suggestion.reasoning && (
                            <div className="suggestion-reasoning">
                                💡 {suggestion.reasoning}
                            </div>
                        )}
                        <div className="suggestion-actions">
                            <button
                                className="suggestion-accept-btn"
                                onClick={handleAcceptSuggestion}
                            >
                                ✅ Accept
                            </button>
                            <button
                                className="suggestion-ignore-btn"
                                onClick={() => setShowSuggestion(false)}
                            >
                                Ignore
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodoForm;