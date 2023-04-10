const express = require('express');
const fs = require('fs')
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import UUID package for generating unique IDs


const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

//get route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//get route for home page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


// GET Route for getting all saved notes
app.get('/api/notes', (req, res) => {
  // Read db.json file
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes from server' });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});