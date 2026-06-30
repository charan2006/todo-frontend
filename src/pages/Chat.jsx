import React from 'react';
import ChatBot from '../components/ChatBot';

const Chat = ({ onTodosChanged }) => {
    return (
        <div style={{ background: '#f3f4f6', minHeight: 'calc(100vh - 64px)', padding: '2rem 1rem' }}>
            <h1 style={{ textAlign: 'center', color: '#1f2937', marginBottom: '0.5rem' }}>
                Task Assistant
            </h1>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem' }}>
                Chat naturally to manage your tasks
            </p>
            <ChatBot floating={false} onTodosChanged={onTodosChanged} />
        </div>
    );
};

export default Chat;