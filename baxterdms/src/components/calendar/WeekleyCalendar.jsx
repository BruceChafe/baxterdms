import React, { useState, useEffect } from "react";
import { Box, Divider, Typography, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const WeeklyCalendar = () => {
  const [dates, setDates] = useState([]); // State for dates of the week
  const [tasksByDay, setTasksByDay] = useState({}); // State for tasks grouped by day
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const getWeekDates = (date) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDayIndex = date.getDay(); // Index of the current day (0 for Sunday, 1 for Monday, etc.)
      const weekDates = [];

      // Calculate the start of the week
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - currentDayIndex); // Start from Sunday

      // Generate dates for the week
      for (let i = 0; i < 7; i++) {
        const newDate = new Date(startOfWeek);
        newDate.setDate(newDate.getDate() + i);
        weekDates.push(newDate);
      }

      return weekDates.map((date, index) => ({
        day: days[index],
        date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        isoDate: date.toISOString() // Added ISO string for API call
      }));
    };

    const groupTasksByDay = (tasks) => {
      const groupedTasks = {};
      tasks.forEach((task) => {
        const taskDate = new Date(task.followUpDate);
        const dayIndex = taskDate.getDay();
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
        if (!groupedTasks[dayName]) {
          groupedTasks[dayName] = [];
        }
        groupedTasks[dayName].push(task);
      });
      return groupedTasks;
    };

    const fetchTasksForWeek = async () => {
      try {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start from Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // End at Saturday

        // Assuming your API endpoint is correct and returns data in the correct format
        const response = await fetch(`http://localhost:8000/leads`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks data');
        }

        const responseData = await response.json();
        const leadsData = responseData.leads || []; // Ensure leads property exists

        // Flatten tasks array from leads data
        const tasks = leadsData.flatMap((lead) => lead.tasks || []);

        // Filter tasks for the current week
        const tasksForWeek = tasks.filter((task) => {
          const taskDate = new Date(task.followUpDate);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });

        setTasksByDay(groupTasksByDay(tasksForWeek));
      } catch (error) {
        console.error('Error fetching tasks for the week:', error);
        // Handle error
      }
    };

    setDates(getWeekDates(currentDate));
    fetchTasksForWeek();
  }, [currentDate]);

  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  return (
    <Box m={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton onClick={goToPreviousWeek}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ m: 2 }}>
          Weekly Tasks
        </Typography>
        <IconButton onClick={goToNextWeek}>
          <ArrowForward />
        </IconButton>
      </Box>
      <Divider />
      <Paper sx={{ mt: 2, mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {dates.map(({ day, date }) => (
                  <TableCell key={day}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {day}
                    </Typography>
                    <Typography variant="body1">{date}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {dates.map(({ day }) => (
                  <TableCell key={day}>
                    {tasksByDay[day] ? (
                      tasksByDay[day].map((task, index) => (
                        <Typography key={index} variant="body2">{task.subject}</Typography>
                      ))
                    ) : (
                      <Typography variant="body2">No tasks</Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default WeeklyCalendar;
