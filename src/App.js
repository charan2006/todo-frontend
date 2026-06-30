import './App.css';
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import { fetchTodos, fetchTrash, createTodo, deleteTodo, restoreTodo } from './api';

function App() {
    const [user, setUser] = useState(null);
    const [todolist, settodolist] = useState([]);
    const [deletedTasks, setDeletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('new');
    const [lastSavedId, setLastSavedId] = useState(null);
    const newTaskRef = useRef(null);

useEffect(() => {
    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const hostname = window.location.hostname;
                const baseUrl = (hostname === 'localhost' || hostname === '127.0.0.1')
                    ? 'http://localhost:5000/api'
                    : `http://${hostname}:5000/api`;
                
                const res = await axios.get(`${baseUrl}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };
    checkUser();
}, []);

    const reloadTodos = async () => {
        try {
            const [active, trash] = await Promise.all([fetchTodos(), fetchTrash()]);
            settodolist(active);
            setDeletedTasks(trash);
        } catch (err) {
            console.error('Failed to reload todos:', err);
        }
    };

    useEffect(() => {
        if (!user) return;
        reloadTodos();
    }, [user]);

    useEffect(() => {
        if (lastSavedId && newTaskRef.current) {
            newTaskRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newTaskRef.current.classList.add('task-highlight');
            const timer = setTimeout(() => {
                newTaskRef.current?.classList.remove('task-highlight');
                setLastSavedId(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [lastSavedId]);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        settodolist([]);
        setDeletedTasks([]);
    };

    const saveTodoList = async (todo) => {
        if (!todo.task || todo.task.trim() === '') { alert('Please enter a task'); return; }
        if (todolist.some((item) => item.task === todo.task)) { alert('Todo already exists!'); return; }
        try {
            const saved = await createTodo(todo);
            settodolist((prev) => [...prev, saved]);
            setLastSavedId(saved._id);
        } catch (err) {
            console.error('Failed to save todo:', err);
        }
    };

    const deleteTask = async (index) => {
        const taskToDelete = todolist[index];
        try {
            await deleteTodo(taskToDelete._id);
            setDeletedTasks((prev) => [...prev, taskToDelete]);
            settodolist((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error('Failed to delete todo:', err);
        }
    };

    const restoreTask = async () => {
        if (deletedTasks.length === 0) return;
        const lastDeleted = deletedTasks[deletedTasks.length - 1];
        try {
            const restored = await restoreTodo(lastDeleted._id);
            settodolist((prev) => [...prev, restored]);
            setDeletedTasks((prev) => prev.slice(0, -1));
        } catch (err) {
            console.error('Failed to restore todo:', err);
        }
    };

    const updateTaskInState = (updatedTodo) => {
        settodolist((prev) =>
            prev.map((item) => (item._id === updatedTodo._id ? updatedTodo : item))
        );
    };

    if (loading) return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '700'
        }}>
            Loading...
        </div>
    );

    return (
        <Router>
            <Navbar user={user} logout={logout} />

            <Routes>

                <Route path="/"
                    element={<Home user={user} todolist={todolist} />}
                />

                <Route path="/login"
                    element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
                />

                <Route path="/register"
                    element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />}
                />

                <Route path="/chat"
                    element={!user ? <Navigate to="/login" /> : <Chat onTodosChanged={reloadTodos} />}
                />

                <Route path="/todos"
                    element={!user ? <Navigate to="/login" /> : (
                        <div className="todo">
                            <TodoForm saveTodoList={saveTodoList} />

                            {deletedTasks.length > 0 && (
                                <div className="restore-wrapper">
                                    <button className="restore-btn" onClick={restoreTask}>
                                        ↩ Restore Last Deleted &nbsp;
                                        <span className="restore-count">{deletedTasks.length}</span>
                                    </button>
                                </div>
                            )}

                            <div className="outterdiv">
                                <TodoList
                                    todolist={todolist}
                                    deleteTask={deleteTask}
                                    updateTaskInState={updateTaskInState}
                                    sortOrder={sortOrder}
                                    setSortOrder={setSortOrder}
                                    lastSavedId={lastSavedId}
                                    newTaskRef={newTaskRef}
                                />
                            </div>

                            <ChatBot onTodosChanged={reloadTodos} />
                        </div>
                    )}
                />

            </Routes>
        </Router>
    );
}

export default App;