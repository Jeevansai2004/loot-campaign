const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const submissionsFile = path.join(__dirname, 'submissions.csv');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.post('/submit-upi', (req, res) => {
  const { upi } = req.body;
  const time = new Date().toISOString().replace('T', ' ').split('.')[0];
  const entry = `${upi},${time}\n`;
  fs.appendFileSync(submissionsFile, entry);
  res.sendStatus(200);
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin/data', (req, res) => {
  if (!fs.existsSync(submissionsFile)) return res.json([]);
  const rows = fs.readFileSync(submissionsFile, 'utf-8').trim().split('\n');
  const result = rows.map(row => {
    const [upi, time] = row.split(',');
    return { upi, time };
  });
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
