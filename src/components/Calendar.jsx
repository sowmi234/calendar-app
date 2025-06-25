import React, { useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [customEvents, setCustomEvents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [color, setColor] = useState("bg-blue-300");

  const startOfMonth = currentDate.startOf("month").startOf("week");
  const endOfMonth = currentDate.endOf("month").endOf("week");

  const days = [];
  let day = startOfMonth;
  while (day.isBefore(endOfMonth, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  const handleAddOrEditEvent = (e) => {
    e.preventDefault();
    const form = e.target;
    const newEvent = {
      title: form.title.value,
      date: selectedDate.format("YYYY-MM-DD"),
      time: form.time.value,
      duration: form.duration.value,
      description: form.description.value,
      color: color,
    };

    const updatedEvents = [...customEvents];
    if (editIndex !== null) {
      updatedEvents[editIndex] = newEvent;
    } else {
      updatedEvents.push(newEvent);
    }

    setCustomEvents(updatedEvents);
    setSelectedDate(null);
    setEditIndex(null);
    form.reset();
  };

  const handleDelete = (index) => {
    const updated = [...customEvents];
    updated.splice(index, 1);
    setCustomEvents(updated);
    setSelectedDate(null);
    setEditIndex(null);
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 bg-white text-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 text-xl" />
        <h1 className="text-xl sm:text-2xl font-bold">Calendar</h1>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div className="lg:w-64 p-3 bg-gray-50 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h2 className="text-base font-medium">{currentDate.format("MMMM YYYY")}</h2>
            <button
              onClick={() => setCurrentDate(currentDate.add(1, "month"))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-600">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs text-center mt-1">
            {Array.from({ length: currentDate.daysInMonth() }, (_, i) => {
              const miniDay = currentDate.date(i + 1);
              const isToday = miniDay.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
              return (
                <div
                  key={i}
                  className={`border rounded-full h-6 w-6 flex items-center justify-center mx-auto cursor-pointer ${
                    isToday ? "bg-blue-300 text-white" : "hover:bg-blue-100"
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
            <button
              onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
              className="px-2 py-1 bg-gray-200 rounded text-xs"
            >
              Prev
            </button>
            <h1 className="text-lg font-bold text-center flex-1">
              {currentDate.format("MMMM YYYY")}
            </h1>
            <button
              onClick={() => setCurrentDate(currentDate.add(1, "month"))}
              className="px-2 py-1 bg-gray-200 rounded text-xs"
            >
              Next
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px text-center font-semibold text-xs bg-gray-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="bg-white py-1">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px text-xs">
            {days.map((day, idx) => {
              const isToday = day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
              const events = customEvents.filter(
                (event) => event.date === day.format("YYYY-MM-DD")
              );
              return (
                <div
                  key={idx}
                  className={`bg-white min-h-[80px] sm:min-h-[100px] p-1 relative border cursor-pointer hover:bg-blue-50 ${
                    isToday ? "bg-blue-100" : ""
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-xs font-bold mb-1">{day.format("D")}</div>
                  <div className="space-y-1 overflow-hidden max-h-16">
                    {events.map((event, i) => (
                      <div
                        key={i}
                        className={`text-[10px] px-1 rounded-full text-white truncate ${event.color}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const index = customEvents.findIndex(
                            (ev) => ev.date === event.date && ev.title === event.title
                          );
                          if (index > -1) {
                            setSelectedDate(dayjs(event.date));
                            setEditIndex(index);
                          }
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-md p-4 w-full max-w-sm shadow relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDate(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-base font-semibold mb-3">
              {editIndex !== null ? "Edit" : "Add"} Event –{" "}
              {selectedDate.format("DD MMM YYYY")}
            </h2>
            <form onSubmit={handleAddOrEditEvent}>
              <input
                name="title"
                placeholder="Title"
                className="w-full border p-2 mb-2 rounded text-sm"
                required
                defaultValue={
                  editIndex !== null ? customEvents[editIndex].title : ""
                }
              />
              <input
                name="time"
                type="time"
                className="w-full border p-2 mb-2 rounded text-sm"
                required
                defaultValue={
                  editIndex !== null ? customEvents[editIndex].time : ""
                }
              />
              <input
                name="duration"
                placeholder="Duration"
                className="w-full border p-2 mb-2 rounded text-sm"
                defaultValue={
                  editIndex !== null ? customEvents[editIndex].duration : ""
                }
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full border p-2 mb-2 rounded text-sm"
                rows="3"
                defaultValue={
                  editIndex !== null ? customEvents[editIndex].description : ""
                }
              />
              <div className="flex gap-2 mb-2">
                {["bg-blue-300", "bg-green-300", "bg-yellow-300", "bg-red-300", "bg-purple-300"].map(
                  (clr) => (
                    <div
                      key={clr}
                      className={`h-6 w-6 rounded-full cursor-pointer border-2 ${clr} ${
                        color === clr ? "border-black" : "border-transparent"
                      }`}
                      onClick={() => setColor(clr)}
                    />
                  )
                )}
              </div>
              <div className="flex justify-between items-center mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  Cancel
                </button>
                {editIndex !== null && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editIndex)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  {editIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
