import { useEffect, useRef, useState } from 'react';
import { useDiscussion } from '../hooks/useDiscussion';

const NAME_STORAGE_KEY = 'artTalks.name';
const MAX_MESSAGE_LENGTH = 500;

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
});

function readStoredName() {
    try {
        return localStorage.getItem(NAME_STORAGE_KEY) || '';
    } catch {
        return '';
    }
}

function Chat({ pictureId }) {
    const { messages, connected, sendMessage } = useDiscussion(pictureId);
    const [name, setName] = useState(readStoredName);
    const [text, setText] = useState('');
    const listRef = useRef(null);

    useEffect(() => {
        try {
            localStorage.setItem(NAME_STORAGE_KEY, name);
        } catch {
            // Storage may be unavailable (private mode); the name just won't persist
        }
    }, [name]);

    useEffect(() => {
        const list = listRef.current;
        if (list) list.scrollTop = list.scrollHeight;
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed || !connected) return;
        sendMessage(trimmed, name.trim());
        setText('');
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <h3>Discussion</h3>
                <span className={`chat__status ${connected ? 'is-online' : ''}`}>
                    {connected ? 'Live' : 'Connecting…'}
                </span>
            </div>

            <ul className="chat__messages" ref={listRef} aria-live="polite">
                {messages.length === 0 && (
                    <li className="chat__empty">No messages yet. Start the conversation!</li>
                )}
                {messages.map(msg => (
                    <li key={msg.id} className="chat__message">
                        <div className="chat__meta">
                            <strong>{msg.author}</strong>
                            <time dateTime={msg.timestamp}>
                                {timeFormatter.format(new Date(msg.timestamp))}
                            </time>
                        </div>
                        <p>{msg.text}</p>
                    </li>
                ))}
            </ul>

            <form className="chat__form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="chat__name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    aria-label="Your name"
                    maxLength={40}
                />
                <div className="chat__compose">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        aria-label="Message"
                        maxLength={MAX_MESSAGE_LENGTH}
                    />
                    <button type="submit" disabled={!text.trim() || !connected}>Send</button>
                </div>
            </form>
        </div>
    );
}

export default Chat;
