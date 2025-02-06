const express = require("express");
const cors = require("cors");
const app = express();
const { Ollama } = require("ollama");
const PORT = 3000;

const ollama = new Ollama({
    host: 'http://localhost:11434'
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});
