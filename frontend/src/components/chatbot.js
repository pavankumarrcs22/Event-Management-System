import { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';  // Import the CSS file

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const startChat = () => {
    const userMessage = { sender: 'user', text: 'Hi' };
    const botMessage = { sender: 'bot', text: 'Hi! How can I help you?' };
    setMessages([userMessage, botMessage]);
    setChatStarted(true);
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsWaiting(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/chat', { message: messageText });
      const botMessage = { sender: 'bot', text: data.response, buttons: data.buttons || null };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error connecting to chatbot.' }]);
    }

    setIsWaiting(false);
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
            {msg.text}
          </div>
        ))}
      </div>
      {!chatStarted ? (
        <button onClick={startChat} className="hi-btn">Hi</button>
      ) : (
        <>
          <input
            value={messages[messages.length - 1]?.text || ''}
            onChange={(e) => setMessages((prev) => [...prev.slice(0, -1), { sender: 'user', text: e.target.value }])}
            placeholder="Ask me about events..."
            disabled={isWaiting}
          />
          <button onClick={sendMessage} disabled={isWaiting}>Send</button>
        </>
      )}
    </div>
  );
};

export default Chatbot;
