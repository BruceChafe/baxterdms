import React, { useState, useMemo } from "react";
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
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { getWeekDates } from "./WeekDates";
import TaskDialog from "./TaskDialog";
import { useFetchTasksForWeek } from "../../hooks/FetchTasksForWeek";

const WeeklyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const { tasks, loading, error } = useFetchTasksForWeek(dates);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showCancelledTasks, setShowCancelledTasks] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleCellClick = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const navigateWeek = (offset) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + offset);
      return newDate;
    });
  };

  const toggleCompletedTasks = () => {
    setShowCompletedTasks(!showCompletedTasks);
    setShowCancelledTasks(!showCancelledTasks);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ m: 3 }}>
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
        <FormControlLabel
          control={
            <Switch
              checked={showCompletedTasks}
              onChange={toggleCompletedTasks}
            />
          }
          label="Show Completed, Cancelled Tasks"
          sx={{ m: 2 }}
        />
      </Paper>

      <Paper sx={{ mt: 2, mb: 2 }}>
        <TableContainer component={Paper}>
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
                    <Typography variant="subtitle1">{day}</Typography>
                    <Typography variant="body1">{date}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {dates.map(({ isoDate }, index) => (
                  <TableCell
                    key={isoDate}
                    align="center"
                    sx={{
                      width: `${100 / dates.length}%`,
                      borderRight: index !== dates.length - 1 ? 1 : 0,
                      borderColor: "divider",
                    }}
                  >
                    {tasks
                      .filter((task) => task.followUpDate.startsWith(isoDate))
                      .filter(
                        (task) =>
                          showCompletedTasks || task.status !== "Completed"
                      )
                      .filter(
                        (task) =>
                          showCancelledTasks || task.status !== "Cancelled"
                      )
                      .map((task, idx) => (
                        <Box
                          key={task.id || idx}
                          onClick={() => handleCellClick(task)}
                          sx={{
                            cursor: "pointer",
                            border: "1px solid",
                            borderColor: "primary.main",
                            borderRadius: 1,
                            p: 2,
                            backgroundColor:
                              task.status === "Completed"
                                ? "darkgreen"
                                : task.status === "Cancelled"
                                ? "darkgrey"
                                : task.status === "Active"
                                ? "darkblue"
                                : "",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>{task.type}</strong> ({task.priority})
                          </Typography>
                          <Box>
                            <Typography variant="caption">
                              {task.subject}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption">
                              {task.status}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
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
