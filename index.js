const express = require('express');
const { spawn } = require('child_process');
const multer = require('multer');
const path = require('path');

// Create an instance of Express
const app = express();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Endpoint for voice prediction
app.post('/predict', (req, res) => {
    const {path} = req.body;
    console.log(path);
    const audioPath = path; // Path to the uploaded audio file
    const maxLength = 1000; // Adjust max_length based on your model's requirements

    // Spawn a Python process to run the prediction
    const pythonProcess = spawn('python', ['predict_voice.py', audioPath, maxLength]);

    let pythonOutput = '';

    // Collect data from the Python script
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    // Handle Python script errors
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data.toString()}`);
    });

    // Handle Python script completion
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            // Send prediction result back to the client
            res.json({ prediction: pythonOutput.trim() });
        } else {
            res.status(500).json({ error: 'Python script failed to execute.' });
        }
    });
});

// Start the server on port 4000
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
