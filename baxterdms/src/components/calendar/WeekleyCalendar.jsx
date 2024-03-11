import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const WeeklyCalendar = () => {
  const [dates, setDates] = useState([]);
  const [tasksByDay, setTasksByDay] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
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
      const currentDayIndex = date.getDay();
      const weekDates = [];
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - currentDayIndex);

      for (let i = 0; i < 7; i++) {
        const newDate = new Date(startOfWeek);
        newDate.setDate(newDate.getDate() + i);
        weekDates.push(newDate);
      }

      return weekDates.map((date, index) => ({
        day: days[index],
        date: date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        isoDate: date.toISOString().split("T")[0],
      }));
    };

    const groupTasksByDay = (tasks) => {
      const groupedTasks = {};
      tasks.forEach((task) => {
        const taskDate = new Date(task.followUpDate);
        const isoDate = taskDate.toISOString().split("T")[0];
        if (!groupedTasks[isoDate]) {
          groupedTasks[isoDate] = [];
        }
        groupedTasks[isoDate].push(task);
      });
      return groupedTasks;
    };

    const fetchTasksForWeek = async () => {
      try {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const response = await fetch(`http://localhost:8000/leads`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks data");
        }

        const responseData = await response.json();
        const leadsData = responseData || [];

        const tasks = leadsData.flatMap((lead) => lead.tasks || []);

        const tasksForWeek = tasks.filter((task) => {
          const taskDate = new Date(task.followUpDate);
          const isoDate = taskDate.toISOString().split("T")[0];
          return (
            isoDate >= startOfWeek.toISOString().split("T")[0] &&
            isoDate <= endOfWeek.toISOString().split("T")[0]
          );
        });        

        setTasksByDay(groupTasksByDay(tasksForWeek));
      } catch (error) {
        console.error("Error fetching tasks for the week:", error);
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
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {day}
                    </Typography>
                    <Typography variant="body1">{date}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {dates.map(({ isoDate }) => (
                  <TableCell key={isoDate}>
                    {tasksByDay[isoDate] ? (
                      <>
                        {tasksByDay[isoDate].map((task, index) => (
                          <Box key={index} mt={index > 0 ? 5 : 0}>
                            <Typography variant="body2">
                              {task.type}: {task.subject}
                            </Typography>
                          </Box>
                        ))}
                      </>
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
