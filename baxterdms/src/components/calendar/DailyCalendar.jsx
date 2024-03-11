import React, { useState, useEffect } from "react";
import { Box, Divider, Typography, Paper, IconButton, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const DailyCalendar = () => {
  const [tasks, setTasks] = useState([]); // State for tasks data
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchTasks = async (date) => {
    try {
      console.log("Date received:", date);

      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
      }

      // Calculate the start and end of the week
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start from Monday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6); // End at Sunday

      // Fetch tasks for the week
      const tasksResponse = await fetch(
        `http://localhost:8000/leads?tasks.timestamp_gte=${startOfWeek.toISOString()}&tasks.timestamp_lt=${new Date(endOfWeek.getTime() + 24 * 60 * 60 * 1000).toISOString()}`
      );

      if (!tasksResponse.ok) {
        throw new Error("Failed to fetch task data");
      }

      const leadsData = await tasksResponse.json();
      const tasks = leadsData.flatMap((lead) => lead.tasks || []);
      setTasks(tasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching task data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentDate);
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

  const getDayOfWeek = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
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
      <Paper sx={{ pt: 1, pl: 1, pr: 1, mt: 2, mb: 2 }}>
        <Box mb={1} mt={1} p={1}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell>{getDayOfWeek(new Date(task.timestamp))}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DailyCalendar;
