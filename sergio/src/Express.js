const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generateResponse', async (req, res) => {
    const { message } = req.body;
    const API_KEY = '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';
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    };
    const data = {
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: message}],
    };

    try {
        const response = await axios.post(API_URL, data, { headers });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
