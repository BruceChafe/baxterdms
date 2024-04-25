import { Timestamp } from "firebase/firestore";

const getWeekDates = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let current = new Date(date);
  current.setHours(0, 0, 0, 0);
  current.setDate(current.getDate() - current.getDay());

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const newDate = new Date(current);
    newDate.setDate(newDate.getDate() + i);
    newDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date(newDate);
    endOfDay.setHours(23, 59, 59, 999);

    return {
      day: days[newDate.getDay()],
      date: newDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      start: Timestamp.fromDate(newDate),
      end: Timestamp.fromDate(endOfDay),
    };
  });

  return weekDates;
};

export { getWeekDates };
