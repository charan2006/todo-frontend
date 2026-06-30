const getBaseUrl = () => {
  return "https://todo-backend-vat7.onrender.com";
};

export const BASE_URL = getBaseUrl();

const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchTodos = async () => {
    const res = await fetch(`${BASE_URL}/todos`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch todos');
    return res.json();
};

export const fetchTrash = async () => {
    const res = await fetch(`${BASE_URL}/todos/trash`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch trash');
    return res.json();
};

export const createTodo = async (todo) => {
    const res = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
};

export const updateTodo = async (id, updates) => {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
};

export const deleteTodo = async (id) => {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete todo');
    return res.json();
};

export const restoreTodo = async (id) => {
    const res = await fetch(`${BASE_URL}/todos/${id}/restore`, {
        method: 'PUT',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to restore todo');
    return res.json();
};

export const sendChatMessage = async (message, history) => {
    const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('Chat request failed');
    return res.json();
};