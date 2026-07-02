import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api';

const ChatBot = ({ onTodosChanged, floating = true }) => {
    const [open, setOpen] = useState(!floating);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I can create, edit, delete, or list your tasks. Try saying \"add a task to buy groceries tomorrow\"." },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const handleSend = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        const newMessages = [...messages, { role: 'user', content: text }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const history = newMessages
                .slice(-10)
                .map((m) => ({ role: m.role, content: m.content }));

            const res = await sendChatMessage(text, history.slice(0, -1));
            setMessages((prev) => [...prev, { role: 'assistant', content: res.reply || 'Done!' }]);

            // ✅ Test 4 fix — refresh after every response
            if (onTodosChanged) {
                await onTodosChanged();
            }
        } catch (err) {
            console.error(err);
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    if (floating && !open) {
        return (
            <button className="chatbot-fab" onClick={() => setOpen(true)} aria-label="Open chat assistant">
                💬
            </button>
        );
    }

    return (
        <div className={floating ? 'chatbot-window' : 'chatbot-page'}>
            <div className="chatbot-header">
                <span>🤖 Task Assistant</span>
                {floating && (
                    <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
                )}
            </div>

            <div className="chatbot-messages">
                {messages.map((m, i) => (
                    <div key={i} className={`chatbot-msg chatbot-msg-${m.role}`}>
                        {m.content}
                    </div>
                ))}
                {loading && (
                    <div className="chatbot-msg chatbot-msg-assistant chatbot-typing">
                        Thinking...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <form className="chatbot-input-row" onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. add task to call mom on friday"
                    className="chatbot-input"
                    disabled={loading}
                />
                <button type="submit" className="chatbot-send-btn" disabled={loading}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBot;