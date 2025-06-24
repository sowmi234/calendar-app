const CalendarHeader = ({ currentMonth, onPrev, onNext }) => (
  <div className="flex justify-between items-center mb-4">
    <button onClick={onPrev} className="px-3 py-1 bg-gray-200 rounded">Previous</button>
    <h2 className="text-xl font-bold">
      {currentMonth.format("MMMM YYYY")}
    </h2>
    <button onClick={onNext} className="px-3 py-1 bg-gray-200 rounded">Next</button>
  </div>
);
export default CalendarHeader;
