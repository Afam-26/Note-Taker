// Dependencies
// =============================================================
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const dbJSON = require("./Develop/db/db.json");
const path = require("path");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Develop/public"));


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page

app.get("/", function(req, res) { 
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
    
});

app.get("/api/notes", function(req, res) {  
  res.json(dbJSON);  
});

app.post("/api/notes", function(req, res) {
  // Validate request body
  if(!req.body.title) {
    return res.json({error: "Missing required title"});
  }

  // Copy request body and generate ID
  const note = {...req.body, id: uuidv4()}

  // Push note to dbJSON array - saves data in memory
  dbJSON.push(note);
  

  // Saves data to file by persisting in memory variable dbJSON to db.json file.
  // This is needed because when we turn off server we loose all memory data like pbJSON variable.
  // Saving to file allows us to read previous notes (before server was shutdown) from file.
  fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(dbJSON), (err) => {
    if (err) {
      return res.json({error: "Error writing to file"});
    }

    return res.json(note);
  });
});


// Delete function

app.delete('/api/notes/:id', function (req, res){
  console.log(req.params.id)
  // console.log(dbJSON);
  const myId = dbJSON.findIndex(item => item.id === req.params.id);

  // console.log(myId);
  dbJSON.splice(myId,1);
  // console.log(dbJSON)
  res.json(true)
});


// Returns to homepage
app.get("*", function(req, res) {
  //
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
