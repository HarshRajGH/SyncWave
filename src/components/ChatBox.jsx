import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';

export default function ChatBox({ messages = [], onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;
    onSendMessage(text);
    setInputText('');
  };

  return (
    <section className="room-chat" aria-labelledby="chatHeading">
      <h2 id="chatHeading" className="section-label" style={{ margin: '0 0 1rem' }}>
        Group chat
      </h2>

      <ul className="chat-log" ref={logRef} aria-live="polite">
        {messages.map((m, idx) => (
          <li key={m.id || idx} className={m.me ? 'is-me' : ''}>
            <span className="chat-author">{m.author}</span>
            {m.text}
          </li>
        ))}
      </ul>

      <form className="chat-form" onSubmit={handleSubmit}>
        <label htmlFor="chatInput" className="visually-hidden">
          Type a message
        </label>
        <input
          id="chatInput"
          type="text"
          placeholder="Type message…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          autoComplete="off"
        />
        <Button variant="primary" type="submit">
          Send
        </Button>
      </form>
    </section>
  );
}
