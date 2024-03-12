import React, { useState, useEffect, useMemo } from "react";
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
import { getWeekDates } from "./WeekDates";
import TaskDialog from "./TaskDialog";

const WeeklyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasksByDay, setTasksByDay] = useState({});
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const dates = getWeekDates(currentDate);

  useEffect(() => {
    const fetchTasksForWeek = async () => {
      const startOfWeek = dates[0].isoDate;
      const endOfWeek = dates[dates.length - 1].isoDate;

      try {
        const response = await fetch(`http://localhost:8000/leads`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks data");
        }
        const leadsData = (await response.json()) || [];
        const tasks = leadsData
          .flatMap((lead) => lead.tasks || [])
          .filter((task) => {
            if (!task.followUpDate) {
              return false;
            }
            const isoDate = task.followUpDate.split("T")[0];
            return isoDate >= startOfWeek && isoDate <= endOfWeek;
          });

        const groupedTasks = tasks.reduce((acc, task) => {
          const isoDate = task.followUpDate.split("T")[0];
          acc[isoDate] = acc[isoDate] || [];
          acc[isoDate].push(task);
          return acc;
        }, {});

        setTasksByDay(groupedTasks);
      } catch (error) {
        setError("Error fetching tasks for the week: " + error.message);
        console.error(error);
      }
    };

    fetchTasksForWeek();
  }, [dates]);

  const handleCellClick = (task) => {
    setSelectedTask(task);
    console.log(selectedTask);
    setDialogOpen(true);
  };

  const navigateWeek = (offset) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + offset);
      return newDate;
    });
  };

  return (
    <Box m={3}>
      {error && <Typography color="error">{error}</Typography>}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => navigateWeek(-7)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ m: 2 }}>
          Weekly Tasks
        </Typography>
        <IconButton onClick={() => navigateWeek(7)}>
          <ArrowForward />
        </IconButton>
      </Box>
      <Divider />
      <Paper sx={{ mt: 2, mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {dates.map(({ day, date }, index) => (
                  <TableCell
                    key={day}
                    align="center"
                    sx={{
                      width: `${100 / dates.length}%`,
                      borderRight: index !== dates.length - 1 ? 1 : 0,
                      borderColor: "divider",
                    }}
                  >
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
                {dates.map(({ isoDate }, index) => (
                  <TableCell key={isoDate} sx={{
                    width: `${100 / dates.length}%`,
                    borderRight: index !== dates.length - 1 ? 1 : 0,
                    borderColor: "divider",
                  }}>
                    {tasksByDay[isoDate] ? (
                      tasksByDay[isoDate].map((task, index) => (
                        <Box
                          key={task.id || index}
                          mt={index > 0 ? 2 : 0}
                          onClick={() => handleCellClick(task)}
                          sx={{
                            cursor: "pointer",
                            border: "1px solid",
                            borderColor: "primary.main",
                            borderRadius: 1,
                            p: 2,
                            transition: "background-color 0.5s",
                            "&:hover": {
                              backgroundColor: "primary.dark",
                            },
                          }}
                        >
                          <Typography variant="body2">
                            Task: {task.type}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2"></Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        taskDetails={selectedTask}
      />
    </Box>
  );
};

export default WeeklyCalendar;
