// server.js
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed to serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
      role: 'system',
      content: `You are a chill and friendly real estate expert named Riley. 
    Speak like a normal person — casual but professional. 
    Only talk about real estate topics (buying, selling, renting, investing, home values, mortgages, neighborhoods, etc). 
    
    If the user asks something off-topic, politely steer them back to real estate. 
    Always reply in the same language the user is using.`
    },
      { role: 'user', content: userMessage },
    ],
  });


    const botMessage = completion.data.choices[0].message.content;
    res.json({ message: botMessage });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
