import TodoItem from './TodoItem';

function TodoList({ todolist, deleteTask, updateTaskInState, sortOrder, setSortOrder, lastSavedId, newTaskRef }) {

  const sorted = [...todolist].sort((a, b) => {
    const tA = new Date(a.createdAt).getTime();
    const tB = new Date(b.createdAt).getTime();
    return sortOrder === 'new' ? tB - tA : tA - tB;
  });

  return (
    <div>
      <div className="list-header">
        <span className="task-count">{todolist.length} task{todolist.length !== 1 ? 's' : ''}</span>
        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
        </select>
      </div>

      <ul>
        {sorted.map((value, sortedIndex) => (
          <TodoItem
            key={value._id}
            value={value}
            indexNum={todolist.indexOf(value)}
            displayNum={sortedIndex + 1}
            deleteTask={deleteTask}
            updateTaskInState={updateTaskInState}
            ref={value._id === lastSavedId ? newTaskRef : null}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;