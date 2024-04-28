import React, { useState, useMemo } from "react";
import {
  Box,
  IconButton,
  Paper,
  Switch,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Button,
  Chip,
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
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { tasks, loading, error } = useFetchTasksForWeek(dates, refetchTrigger);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showCancelledTasks, setShowCancelledTasks] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const taskStatusColors = [
    { status: "Completed", color: "darkgreen", description: "Completed tasks" },
    { status: "Cancelled", color: "darkgrey", description: "Cancelled tasks" },
    { status: "Active", color: "darkblue", description: "Active tasks" },
  ];

  const handleCellClick = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const refetchTasks = () => {
    setRefetchTrigger((prev) => prev + 1);
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

  const visibleTasks = tasks.filter((task) => {
    const showCompleted =
      showCompletedTasks || task.leadTaskStatus !== "Completed";
    const showCancelled =
      showCancelledTasks || task.leadTaskStatus !== "Cancelled";
    return showCompleted && showCancelled;
  });

  const minimumRows = 4;
  const emptyRows = minimumRows - visibleTasks.length;

  return (
    <Box sx={{ display: "flex", mt: 3, mr: 8 }}>
      <Box flex={1}>
        <CenteredTitleLayout
          title="Weekly Tasks"
          leftActions={
            <IconButton onClick={() => navigateWeek(-7)}>
              <ArrowBack />
            </IconButton>
          }
          rightActions={
            <IconButton onClick={() => navigateWeek(7)}>
              <ArrowForward />
            </IconButton>
          }
        />
        <TabContext value="1">
          <Box sx={{ mt: 3 }}>
            <Paper
              sx={{
                border: "solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Switch
                  checked={showCompletedTasks}
                  onChange={toggleCompletedTasks}
                  name="showCompletedCancelled"
                  color="primary"
                />
                <Typography>Show Completed/Cancelled Tasks</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                {taskStatusColors.map((status) => (
                  <Box
                    key={status.status}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 20,
                        bgcolor: status.color,
                        mr: 1,
                        borderRadius: "25%",
                      }}
                    />
                    <Typography variant="body2">
                      {status.description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
          <TabPanel value="1">
            <TableContainer
              component={Paper}
              sx={{
                border: "solid",
                borderColor: "divider",
                minHeight: "70vh",
              }}
            >
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
                  {visibleTasks.map((task) => (
                    <TableRow key={task.id} sx={{ minHeight: "150px" }}>
                      {dates.map(({ start, end }) => {
                        const taskDate = new Date(
                          task.leadTaskFollowUpDate.seconds * 1000
                        );
                        const startDate = new Date(start.seconds * 1000);
                        const endDate = new Date(end.seconds * 1000);

                        if (taskDate >= startDate && taskDate <= endDate) {
                          return (
                            <TableCell
                              key={task.id}
                              align="center"
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                
                              }}
                            >
                              <Box
                                onClick={() => handleCellClick(task)}
                                sx={{
                                  cursor: "pointer",
                                  border: "1px solid",
                                  borderRadius: 1,
                                  p: 1,
                                  backgroundColor:
                                    task.leadTaskStatus === "Completed"
                                      ? "darkgreen"
                                      : task.leadTaskStatus === "Cancelled"
                                      ? "darkgrey"
                                      : task.leadTaskStatus === "Active"
                                      ? "darkblue"
                                      : "",
                                }}
                              >
                                <Stack spacing={1}>
                                  <Typography>
                                    <strong>{task.leadTaskType}</strong>
                                  </Typography>
                                  <Typography variant="caption">
                                    {task.leadTaskStatus}
                                  </Typography>
                                </Stack>
                                <Tooltip title="Open Lead">
                                  <IconButton
                                    component={Link}
                                    to={`/leads/${task.leadId}`}
                                    color="primary"
                                  >
                                    <LaunchIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell
                              key={task.id}
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                              }}
                            />
                          );
                        }
                      })}
                    </TableRow>
                  ))}
                  {emptyRows > 0 &&
                    [...Array(emptyRows)].map((_, index) => (
                      <TableRow
                        key={`empty-${index}`}
                        sx={{ minHeight: "150px" }}
                      >
                        {dates.map((_, dateIndex) => (
                          <TableCell
                            key={`empty-cell-${dateIndex}`}
                            sx={{
                              borderRight: 1,
                              borderColor: "divider",
                            }}
                          />
                        ))}
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
          refetchTasks={refetchTasks}
        />
      </Box>
    </Box>
  );
};

export default WeeklyCalendar;
