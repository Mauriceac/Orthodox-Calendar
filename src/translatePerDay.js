import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
import process from "process";
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import schema from "./schema.js";
import { month, year } from './variables.js';


dotenv.config();

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
if (!apiKey) {
  throw new Error("API key is not defined in environment variables.");
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const daysDataPath = join(__dirname, `days/english/${year}-${month}.json`);


const daysData = JSON.parse(fs.readFileSync(daysDataPath, 'utf8'));

const daysDataTranslation = [];
const errorLog = [];

async function translateDay(day) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const generationConfig = {
    // temperature: 0,
    responseMimeType: "application/json",
    responseSchema: schema
  };
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig,
  });
  const prompt = `
    Translate the following JSON object representing a day of an Orthodox Calendar to Spanish. 
    Do not translate keys, only translate values to Spanish. 
    For biblical verses in readings.passage[x].content, use the Reina-Valera 1960 version.
    ========================================
    This is the day object: ${JSON.stringify(day)}`;
  
  const geminiResponse = await model.generateContent(prompt);
  
  if (!geminiResponse.response || !geminiResponse.response.candidates || !geminiResponse.response.candidates[0] || !geminiResponse.response.candidates[0].content || !geminiResponse.response.candidates[0].content.parts || !geminiResponse.response.candidates[0].content.parts[0]) {
    console.log(JSON.stringify(geminiResponse.response.candidates));
    errorLog.push(day);
    throw new Error("Invalid response structure");
  }

  let llmResponse = geminiResponse.response.candidates[0].content.parts[0].text;

  console.log(geminiResponse.response.usageMetadata);

  return JSON.parse(llmResponse);
}

// Loop through the daysData array and translate each day
(async () => {
  for (const day of daysData) {
    console.log(day.day);
    try {
      const translatedDay = await translateDay(day);
      daysDataTranslation.push(translatedDay);
    } catch (error) {
      errorLog.push(day);
      console.error(error);
    }
  }

  // Write translated data to file
  const outputDir = `days`;
  const outputFile = `${outputDir}/spanish/${year}-${month}.json`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(daysDataTranslation, null, 2));
  fs.writeFileSync(`${outputDir}/errorLogs/${year}-${month}_errorLog.json`, JSON.stringify(errorLog, null, 2));
  console.log(`Translated data written to ${outputFile}`);
  if (errorLog.length) {
    console.log(`Errors logged to ${outputDir}/errorLogs/${year}-${month}_errorLog.json`);
  }
})();