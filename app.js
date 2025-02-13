const express = require('express');
const cors = require('cors');
const app = express();
const { Ollama } = require('ollama');
const PORT = 3000;

const ollama = new Ollama({
    host: 'http://localhost:11434'
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat-stream', async (req, res) =>{
  try {
    const { prompt } = req.body;

    const stream = await ollama.chat({
        model: 'deepseek-r1:7b',
        messages : [{role: 'user', content: prompt}],
        stream: true
    });

    res.setHeader('Content-type', 'text/plain');

    for await (const chunk of stream){
            //console.log(chunk.message)
        try {
            if(chunk.message?.content){
                res.write(chunk.message.content)
            }
        } catch (streamError) {
            console.error('Error:', streamError);
            break;
        }
    }
    res.end();
    
  } catch (error) {
    res.status(500).send(error);
  }
});


app.listen(PORT, () =>{
    console.log(`Running on port ${PORT}`);
});