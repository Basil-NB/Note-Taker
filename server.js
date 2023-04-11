const express = require('express');
const fs = require('fs')
const path = require('path');
const shortid = require('shortid');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));


// GET Route for getting all saved notes
app.get('/api/notes', (req, res) => {
  // Read db.json file
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes from server' });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

app.post('/api/notes', (req, res) => {
  // Read db.json file
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes from server' });
    } else {
      const notes = JSON.parse(data);
      const newNote = {
        id: shortid.generate(), // Use shortid.generate() to generate unique ID
        title: req.body.title,
        text: req.body.text
      };
      notes.push(newNote);
      // Write updated notes array to db.json file
      fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to save note to server' });
        } else {
          res.json(newNote);
        }
      });
    }
  });
});


// DELETE Route for deleting a note
app.delete('/api/notes/:id', (req, res) => {
  // Read db.json file
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes from server' });
    } else {
      const notes = JSON.parse(data);
      const noteId = req.params.id;
      const updatedNotes = notes.filter(note => note.id !== noteId); // Filter out the note with the given ID
      // Write updated notes array to db.json file
      fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(updatedNotes), 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to delete note from server' });
        } else {
          res.json({ message: 'Note deleted successfully' });
        }
      });
    }
  });
});


//get route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//get route for home page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});