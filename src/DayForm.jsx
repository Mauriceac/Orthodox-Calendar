import "./index.css";

export default function DayForm({
  day,
  titles,
  feasts,
  fast_level_desc,
  fast_exception_desc,
  readings,
}) {
  return (
    <div className="day">
      <div className="dayNumber">{day}</div>

      <div className="dayTitle">{titles}</div>
      <div className="feasts">
        {/* {feasts && feasts.map((feast) => <div key={feast}>{feast}</div>)} */}
        {feasts && feasts[0]}
      </div>
      <br />
      <div className="fastLevel">{fast_level_desc}</div>
      <div className="fastException">{fast_exception_desc}</div>
      {/* <div className="readings">
        {readings.map((reading) => (reading.source === "Epistle" &&
          <div key={reading.short_display}>
            <div><b>Primera lectura:</b> {reading.translation.description !== "" && `(${reading.translation.description})`}</div>
            <div>{reading.translation.display}</div>
          </div>
        ))}
        {readings.map((reading) => (reading.source === "Gospel" &&
          <div key={reading.short_display}>
            <div><b>Evangelio:</b> {reading.translation.description !== "" && `(${reading.translation.description})`}</div>
            <div>{reading.translation.display}</div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
