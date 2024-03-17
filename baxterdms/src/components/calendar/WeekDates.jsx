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
    current.setDate(current.getDate() - current.getDay());
  
    const weekDates = Array.from({ length: 7 }).map((_, i) => {
      const newDate = new Date(current);
      newDate.setDate(newDate.getDate() + i);
      return {
        day: days[newDate.getDay()],
        date: newDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        isoDate: newDate.toISOString().split("T")[0],
      };
    });
  
    console.log("Week Dates:", weekDates); // Debug log
    return weekDates;
  };

export { getWeekDates };
