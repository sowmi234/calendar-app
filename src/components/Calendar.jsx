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

  const allEvents = customEvents;

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
    <div className="w-full p-4 bg-white">
      {/* Header with Calendar Icon */}
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 text-xl" />
        <h1 className="text-2xl font-bold">Calendar</h1>
      </div>

      <div className="flex">
        {/* Mini Calendar Sidebar */}
        <div className="w-64 p-4 bg-white shadow rounded mr-4">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
              className="px-2 py-1 rounded hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h2 className="text-lg font-semibold">
              {currentDate.format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => setCurrentDate(currentDate.add(1, "month"))}
              className="px-2 py-1 rounded hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-medium text-sm">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mt-1 text-xs">
            {Array.from({ length: currentDate.daysInMonth() }, (_, i) => {
              const miniDay = currentDate.date(i + 1);
              const isToday =
                miniDay.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
              return (
                <div
                  key={i}
                  className={`border rounded-full h-6 w-6 flex items-center justify-center cursor-pointer ${
                    isToday ? "bg-blue-300 text-white" : "hover:bg-blue-200"
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Calendar */}
        <div className="flex-1">
          <div className="flex justify-between mb-4 items-center">
            <button
              onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              Prev
            </button>
            <h1 className="text-2xl font-bold">
              {currentDate.format("MMMM YYYY")}
            </h1>
            <button
              onClick={() => setCurrentDate(currentDate.add(1, "month"))}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-medium">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const isToday =
                day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
              return (
                <div
                  key={idx}
                  className={`border h-28 p-1 hover:bg-blue-100 cursor-pointer relative ${
                    isToday ? "bg-blue-200" : ""
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-xs font-bold">{day.format("D")}</div>
                  {allEvents
                    .filter((event) => event.date === day.format("YYYY-MM-DD"))
                    .map((event, i) => (
                      <div
                        key={i}
                        className={`text-xs mt-1 px-1 rounded-full text-white truncate ${event.color}`}
                        title={event.description || ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          const customIdx = customEvents.findIndex(
                            (ev) =>
                              ev.date === event.date &&
                              ev.title === event.title
                          );
                          if (customIdx > -1) {
                            setSelectedDate(dayjs(event.date));
                            setEditIndex(customIdx);
                          }
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Popup Form */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative">
            <button
              onClick={() => setSelectedDate(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-lg font-semibold mb-2">
              {editIndex !== null ? "Edit Event" : "Add Event"} on{" "}
              {selectedDate.format("DD MMM YYYY")}
            </h2>
            <form onSubmit={handleAddOrEditEvent}>
              <input
                name="title"
                placeholder="Title"
                className="w-full border p-1 mb-2"
                required
                defaultValue={
                  editIndex !== null ? customEvents[editIndex].title : ""
                }
              />
              <input
                name="time"
                type="time"
                placeholder="Time"
                className="w-full border p-1 mb-2"
                required
                defaultValue={
                  editIndex !== null ? customEvents[editIndex].time : ""
                }
              />
              <input
                name="duration"
                placeholder="Duration (e.g. 1h)"
                className="w-full border p-1 mb-2"
                defaultValue={
                  editIndex !== null ? customEvents[editIndex].duration : ""
                }
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full border p-1 mb-2"
                rows="3"
                defaultValue={
                  editIndex !== null ? customEvents[editIndex].description : ""
                }
              />
              <div className="flex gap-2 mb-2">
                {[
                  "bg-blue-300",
                  "bg-green-300",
                  "bg-yellow-300",
                  "bg-red-300",
                  "bg-purple-300",
                ].map((clr) => (
                  <div
                    key={clr}
                    className={`h-6 w-6 rounded-full cursor-pointer border-2 ${clr} ${
                      color === clr ? "border-black" : "border-transparent"
                    }`}
                    onClick={() => setColor(clr)}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-sm px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                {editIndex !== null && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editIndex)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
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
