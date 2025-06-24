import React, { useState } from 'react';
import Calendar from './components/Calendar';
import dayjs from 'dayjs';
import events from './data/events.json'
function App() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Calendar events={events} />
    </div>
  );
}

export default App;
