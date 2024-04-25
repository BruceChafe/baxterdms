import React, { useState, useMemo } from "react";
import {
  Box,
  IconButton,
  Paper,
  Switch,
  FormControlLabel,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import LaunchIcon from "@mui/icons-material/Launch";
import { Link } from "react-router-dom";
import CenteredTitleLayout from "../layouts/CenteredTitleLayout";
import { getWeekDates } from "./WeekDates";
import TaskDialog from "./TaskDialog";
import { useFetchTasksForWeek } from "../../../hooks/FetchTasksForWeek";

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

  const leftActions = (
    <IconButton onClick={() => navigateWeek(-7)}>
      <ArrowBack />
    </IconButton>
  );

  const rightActions = (
    <IconButton onClick={() => navigateWeek(7)}>
      <ArrowForward />
    </IconButton>
  );

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <CenteredTitleLayout
        title="Weekly Tasks"
        leftActions={leftActions}
        rightActions={rightActions}
      />
      <TabContext value="1">
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ pl: 1, pr: 1 }}>
            <Box mb={1} mt={1} p={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showCompletedTasks}
                    onChange={toggleCompletedTasks}
                  />
                }
                label={<Typography>Show Completed, Cancelled Tasks</Typography>}
                labelPlacement="end"
                sx={{ margin: "auto" }}
              />
            </Box>
          </Paper>
        </Box>
        <TabPanel value="1">
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
                      }}
                    >
                      <Typography variant="subtitle1">{day}</Typography>
                      <Typography variant="body1">{date}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    {dates.map(({ start, end }) => {
                      const taskDate = new Date(task.followUpDate.seconds * 1000);
                      const startDate = new Date(start.seconds * 1000);
                      const endDate = new Date(end.seconds * 1000);

                      if (taskDate >= startDate && taskDate <= endDate) {
                        return (
                          <TableCell
                            key={task.id}
                            align="center"
                            sx={{ minHeight: "150px" }}
                          >
                            <Box
                              onClick={() => handleCellClick(task)}
                              sx={{
                                cursor: "pointer",
                                border: "1px solid",
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
                                <strong>{task.leadTaskType}</strong> ({task.leadTaskPriority})
                              </Typography>
                              <Typography variant="caption">
                                {task.leadTaskSubject}
                              </Typography>
                              <Typography variant="caption">{task.status}</Typography>
                              <Tooltip title="Open Lead">
                                <IconButton
                                  component={Link}
                                  to={`/leads/${task.id}`}
                                  color="primary"
                                >
                                  <LaunchIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        );
                      } else {
                        return <TableCell key={task.id} />;
                      }
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </TabContext>
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        taskDetails={selectedTask}
      />
    </Box>
  );
};

export default WeeklyCalendar;
