import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://backend:3001/api')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>Next.js Frontend</h1>
      <p>Message from backend: {message}</p>
    </div>
  );
}

