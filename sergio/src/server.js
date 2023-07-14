const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post('/runPython', (req, res) => {
    let dataToSend;
    let largeDataSet = [];
    // spawn new child process to call the python script
    const python = spawn('python', ['../../semantic-kernel/python/samples/kernel-syntax-examples/skills_Chatbot.py', '--input_str', req.body.message]);
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        largeDataSet.push(data);
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        dataToSend = largeDataSet.join("");
        console.log(dataToSend);
        res.send(dataToSend);
    });
});

app.listen(3001, () => console.log('Server is running on port 3001'));
