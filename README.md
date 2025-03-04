# Orthodox Calendar in Spanish

This script generates a Christian Orthodox monthly calendar in Spanish.

The data is fetched using the [Orthocal.info](https://orthocal.info/api/) API. The data is provided by the Orthodox Church in America (OCA).

The data is transalted with Google's Gemini API and placed within a JSON file. This app uses React to generate an HTML from the JSON data.

## Prerequisites

- Vite React
- Node.js
- Gemini API token

## How to get and translate month data

1. Download repository and nstall dependencies:

   ```shell
   npm install
   ```

2. Update values in `/src/variables.js`.
3. Create JSON file with translated calendar by doing the following:
   1. Go to the `/src` folder:

      ```shell
      cd src
      ```

   2. Run the following command to get calendar data:

      ```shell
      node getDayInMonth.js
      ```
   
   3. Run the following command to translate the calendar data:
      
      ```shell
      node translatePerDay.js
      ```
   
   4. Optional: If there are errors during the translation, edit log created in tthe `./src/days/errorLogs` folder. Then run the following command:

      ```shell
      node translateErrors.js
      ```

4. Run calendar app:
   1. Go to root of calendar app:

      ```shell
      cd ..
      ```

   2. Run the following command:

       ```shell
       npm run dev
       ```
