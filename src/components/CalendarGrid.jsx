import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import DayCell from "./DayCell";

dayjs.extend(isToday);

const CalendarGrid = ({ currentMonth, events }) => {
  const startOfMonth = currentMonth.startOf("month").startOf("week");
  const endOfMonth = currentMonth.endOf("month").endOf("week");

  const days = [];
  let day = startOfMonth;

  while (day.isBefore(endOfMonth)) {
    days.push(day);
    day = day.add(1, "day");
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((date, idx) => (
        <DayCell
          key={idx}
          date={date}
          isCurrentMonth={date.month() === currentMonth.month()}
          isToday={date.isToday()}
          events={events.filter(ev => dayjs(ev.date).isSame(date, "day"))}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;
