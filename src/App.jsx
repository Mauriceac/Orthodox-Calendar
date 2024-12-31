import "./App.css";
import { DAY_DATA_TRANSLATION } from "./dayDataTranslation";
import DayData from "./DayData";

import { MONTH, MONTH_NAME, YEAR } from './variables.js';


function App() {
  const weekdays = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  // Function to get the starting day of the month (0=Sunday, 1=Monday, ..., 6=Saturday)
  function getStartingWeekday(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const startingWeekday = firstDay.getDay();
    // Adjust to "+6" to make Monday the first day of the week & change weekdays array accordingly.
    return (startingWeekday + 7) % 7;
  }

  const startingWeekday = getStartingWeekday(YEAR, MONTH);

  return (
    <>
      <div className="App">
        <header className="App-header">
          {/* <h1>Calendario Ortodoxo</h1> */}
          <h2>{MONTH_NAME + " " + YEAR}</h2>
        </header>
        <main>
          <div className="calendar">
            {weekdays.map((weekday) => (
              <div key={weekday} className="weekdayNames">
                {weekday}
              </div>
            ))}
            {/* Render empty slots for days before the first day of the month */}
            {Array.from({ length: startingWeekday }).map((_, index) => (
              <div key={`empty-${index}`} className="emptyDay"></div>
            ))}
            {DAY_DATA_TRANSLATION.map((day) => (
              <DayData key={day.day} {...day} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
