# Orthodox Calendar in Spanish

This script generates a Christian Orthodox monthly calendar in Spanish.

The data is fetched using the [Orthocal.info](https://orthocal.info/api/) API. The data is provided by the Orthodox Church in America (OCA).

The data is transalted with Google's Gemini API and placed within a JSON file. This app uses React to generate an HTML from the JSON data.

## Prerequisites
- Vite React
- Node.js
- Gemini API token

## How to Use

1. Update values in `/src/variables.js`.
2. Create JSON file with translated calendar by doing the following:
   1. From the app folder, go to the `/src` folder:
      ```shell
      cd src
      ``` 
   2. Run the following command:
      ```shell
      node calendarData.js
      ```
3. Run calendar app:
   1. Go to root of calendar app: 
      ```shell
      cd ..
      ```
   2. Run the following command:
       ```shell
       npm run dev
       ```