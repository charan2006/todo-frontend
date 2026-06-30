function TodoForm({ saveTodoList }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const task = event.target.toname.value;
    const dueDate = event.target.dueDate.value;
    const startDate = event.target.startDate.value;
    const priority = event.target.priority.value;
    const description = event.target.description.value.trim();

    saveTodoList({
      task,
      dueDate,
      startDate,
      subtasks: [],
      priority,
      description,
    });

    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <input type="text" name="toname" placeholder="Enter the task" />
        <input type="date" name="startDate" />
        <input type="date" name="dueDate" />
        <select name="priority" className="priority" defaultValue="Medium">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button>Save</button>
      </div>

      <textarea
        name="description"
        className="description-input"
        placeholder="Add a task description (optional)..."
        rows={2}
      />
    </form>
  );
}

export default TodoForm;