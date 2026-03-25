require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

async function listModels() {
  const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
  try {
    const models = await genAI.models.list();
    console.log("Available Models:");
    models.forEach(m => console.log(m.name));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
