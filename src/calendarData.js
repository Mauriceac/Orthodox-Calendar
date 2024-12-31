import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
import process from "process";
dotenv.config();

import { MONTH, YEAR } from './variables.js';

let tempCalendar;
const tempDayData = [];
let dayDataTranslation;

// main function
function translatedCalendarData() {
  
  // pushes data to be translated from fetched calendar JSON data to tempDayData array
  function getDayTitles() {
    tempCalendar.map((day) => {
      // Extract both "display" and "description" in a single array
      const readings = day.readings.map((reading) => ({
        display: reading.display,
        description: reading.description
      }));

      tempDayData.push({
        day: day.day,
        weekday: day.weekday,
        titles: day.titles,
        feasts: day.feasts,
        fast_level_desc: day.fast_level_desc,
        fast_exception_desc: day.fast_exception_desc,
        readings: readings // Add linked "display" and "description" here
      });
    });
  }
  
  // translates, with Gemini API, data in the tempDayData array obtained and pushed by the getDayTitle function
  async function translateDayTitles() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("API key is not defined in environment variables.");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const generationConfig = {
      temperature: 1.0,
      topP: 0.95,
      topK: 16,
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig,
    });
    const prompt = `Translate the following JSON object of an Orthodox Calendar to Spanish. Do not translate keys, only translate values to Spanish. Maintain JSON format and do not add Markdown syntax indicating code block at the beginning and end of the text. This is the JSON object: ${JSON.stringify(
      tempDayData
    )}`;
    
    // Check prompt
    console.log(prompt);

    const geminiResponse = await model.generateContent(prompt);
    
    console.log(
      "\n=================\n" +
        geminiResponse.response.candidates[0].content.parts[0].text
    );

    dayDataTranslation = JSON.parse(
      geminiResponse.response.candidates[0].content.parts[0].text
    );
  }

  // adds translations to temp variable
  function addTranslationToCalendar() {
    tempCalendar.forEach((day, index) => {
      if (dayDataTranslation[index].day === day.day) {
        day.titles = dayDataTranslation[index].titles;
        day.feasts = dayDataTranslation[index].feasts;
        day.fast_level_desc = dayDataTranslation[index].fast_level_desc;
        day.fast_exception_desc = dayDataTranslation[index].fast_exception_desc;
  
        // Check if readings are available in dayDataTranslation
        if (dayDataTranslation[index].readings && day.readings) {
          // Add each translation back into the corresponding day.readings objects
          day.readings.forEach((reading, readingIndex) => {
            if (dayDataTranslation[index].readings[readingIndex]) {
              reading.translation = dayDataTranslation[index].readings[readingIndex];
            } else {
              console.warn(`No translation for reading at index ${readingIndex}`);
            }
          });
        } else {
          console.warn(`No readings or translations for day ${day.day}`);
        }
      } else {
        console.error("Day mismatch");
      }
    });
  }

  //API call to get the calendar data
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };


  fetch(`https://orthocal.info/api/gregorian/${YEAR}/${MONTH}/`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
    console.log(result);  // Log the result to inspect it
    tempCalendar = JSON.parse(result); //places calendar data in temporary variable
    })
    .then(() => getDayTitles()) // pushes fields to be translated from tempCalendar to tempDayData array
    .then(() => translateDayTitles()) // uses Gemini API to translate data from tempDayData array
    .then(() => addTranslationToCalendar()) // adds translated data to JSON
    .then(() =>
      fs.writeFile(
        "dayDataTranslation.js",
        "export const DAY_DATA_TRANSLATION = " +
          JSON.stringify(tempCalendar),
        (err) => {
          if (err) throw err;
          console.log("Data written to file");
        }
      )
    )
    .then(() => console.log(dayDataTranslation))
    .catch((error) => console.error(error));
}

translatedCalendarData();
