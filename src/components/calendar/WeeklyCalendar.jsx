import React, { useState, useMemo } from "react";
import {
  Box,
  CircularProgress,
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
import { TabContext, TabList, TabPanel } from "@mui/lab";

import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import LaunchIcon from "@mui/icons-material/Launch";
import { Link } from "react-router-dom";
import CenteredTitleLayout from "../layouts/CenteredTitleLayout";
import { getWeekDates } from "./WeekDates";
import TaskDialog from "./TaskDialog";
import { useFetchTasksForWeek } from "../../../hooks/FetchTasksForWeek";

const WeeklyCalendar = () => {
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const dates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const { tasks, loading, error } = useFetchTasksForWeek(dates, refetchTrigger);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showCancelledTasks, setShowCancelledTasks] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const refetchTasks = () => {
    setRefetchTrigger((prev) => !prev);
  };

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
    <>
      <IconButton onClick={() => navigateWeek(-7)}>
        <ArrowBack />
      </IconButton>
    </>
  );

  const rightActions = (
    <>
      <IconButton onClick={() => navigateWeek(7)}>
        <ArrowForward />
      </IconButton>
    </>
  );

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <CenteredTitleLayout
        title="Weekly Tasks"
        leftActions={leftActions}
        rightActions={rightActions}
      />
      <TabContext>
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ pl: 1, pr: 1 }}>
            <Box mb={1} mt={1} p={1}>
              <TabList textColor="secondary" indicatorColor="secondary">
                <FormControlLabel
                  control={
                    <Switch
                      checked={showCompletedTasks}
                      onChange={toggleCompletedTasks}
                    />
                  }
                  label="Show Completed, Cancelled Tasks"
                />
                {/* {tabs.map((tab, index) => (
                <Tab label={tab.label} value={String(index + 1)} key={index} />
              ))} */}
              </TabList>
            </Box>
          </Paper>
        </Box>
        <TabPanel>
          <Paper sx={{ mb: 2 }}>
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
                          .filter((task) =>
                            task.followUpDate.startsWith(isoDate)
                          )
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
                                <Tooltip title="Open Lead">
                                  <IconButton
                                    component={Link}
                                    to={`/leads/${task.leadNumber}`}
                                    color="primary"
                                  >
                                    <LaunchIcon />
                                  </IconButton>
                                </Tooltip>
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
        </TabPanel>
      </TabContext>
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        taskDetails={selectedTask}
        refetchTasks={refetchTasks}
      />
    </Box>
  );
};

export default WeeklyCalendar;
