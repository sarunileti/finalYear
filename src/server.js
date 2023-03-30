const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/accounts', (req, res) => {
  // handle GET request for accounts
});

app.post('/api/accounts', (req, res) => {
  // handle POST request for accounts
});

app.get('/api/transactions', (req, res) => {
  // handle GET request for transactions
});

app.post('/api/transactions', (req, res) => {
  // handle POST request for transactions
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

