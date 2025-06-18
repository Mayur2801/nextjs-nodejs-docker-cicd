const express = require('express');
const app = express();
const PORT = 3001;

// Sample API route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Bind to 0.0.0.0 to allow external access (important for Docker)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running at http://0.0.0.0:${PORT}`);
  console.log(`🔗 Try accessing it via: http://<EC2_PUBLIC_IP>:8081/api`);
});
