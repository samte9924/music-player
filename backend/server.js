const os = require("os");
const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const server = express();
const PORT = 3000;

server.use(express.json());
server.use(cors());

server.use("/songs", express.static(path.join(__dirname, "data", "songs")));

server.get("/api/os-version", (req, res) => {
  res.status(200).json({ version: os.version() });
});

server.get("/api/songs", (req, res) => {
  const songsPath = path.join(__dirname, "data", "songs");
  console.log(songsPath);

  // If songs folder not found, create it
  if (!fs.existsSync(songsPath)) {
    fs.mkdirSync(songsPath, { recursive: true });
    console.log(`Folder created: ${songsPath}`);
  }

  // Read songs inside folder
  fs.readdir(songsPath, (err, files) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error while reading songs" });
    }

    console.log(files);
    // To-do: return song names without extension
    res.json({ songs: files });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
