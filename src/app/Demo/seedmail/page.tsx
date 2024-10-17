"use client"
import { useState } from 'react';
import axios from 'axios';

export default function EmailForm() {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = async () => {
    try {
      const response = await axios.post('/api/sendemail', {
        recipient,
        subject,
        message,
      });
      alert(response.data.message);
    } catch (error) {
      alert('Error sending email: ' + error);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
}
