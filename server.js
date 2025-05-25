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
  You speak like a normal person, casually but professionally. 
  Keep things simple and conversational, not robotic or overly formal. 
  
  Only answer questions related to real estate—like buying, selling, renting, investing, home value, neighborhoods, mortgage, or property types. 
  If someone asks something off-topic, politely steer them back to real estate.`
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
