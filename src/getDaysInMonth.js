import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { month, year } from './variables.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const urlPath = `https://orthocal.info/api/gregorian/${year}/${month}/`;

const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

const outputDir = join(__dirname, 'days');
const outputFile = join(outputDir, `/english/${year}-${month}.json`);

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

let daysData = [];

async function fetchDayData(dayUrl) {
  const response = await fetch(dayUrl, requestOptions);
  const dayResult = await response.json();
  return {
    day: dayResult.day,
    month: dayResult.month,
    year: dayResult.year,
    weekday: dayResult.weekday,
    titles: dayResult.titles,
    fast_level_desc: dayResult.fast_level_desc,
    fast_exception_desc: dayResult.fast_exception_desc,
    feasts: dayResult.feasts,
    summary_title: dayResult.summary_title,
    saints: dayResult.saints,
    readings: dayResult.readings,
    stories: dayResult.stories.map(story => ({
      title: story.title,
      story: story.story
    }))
  };
}

// Get month data
fetch(`${urlPath}`, requestOptions)
  .then((response) => response.json())
  .then(async (result) => {
    let count = Object.keys(result).length;
    console.log(`Number of objects: ${count}`);
    
    for (const dayData of result) {
      const day = dayData.day;
      const dayUrl = `https://orthocal.info/api/gregorian/${year}/${month}/${day}/`;
      
      try {
        const dayInfo = await fetchDayData(dayUrl);
        daysData.push(dayInfo);

        // Write to file after processing all days
        if (daysData.length === count) {
          writeFileSync(outputFile, JSON.stringify(daysData, null, 2));
          console.log(`Data written to ${outputFile}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  })
  .catch((error) => console.error(error));