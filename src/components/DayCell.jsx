const DayCell = ({ date, isCurrentMonth, isToday, events }) => {
  return (
    <div className={`p-2 border rounded h-28 overflow-hidden 
      ${isToday ? "bg-blue-100" : ""}
      ${!isCurrentMonth ? "text-gray-400" : ""}
    `}>
      <div className="text-sm font-bold">{date.date()}</div>
      <div className="space-y-1 mt-1 overflow-y-auto max-h-20">
        {events.map((ev, i) => (
          <div key={i} className="text-xs bg-blue-200 px-1 rounded">
            {ev.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayCell;
