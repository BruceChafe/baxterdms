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

  const minimumRows = 5;
  const emptyRows = minimumRows - tasks.length;

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
            </Paper>
          </Box>
          <TabPanel value="1">
            <TableContainer
              component={Paper}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                height: "72vh",
              }}
            >
              <Table>
                <TableHead>
                  {dates.map(({ day, date }, index) => (
                    <TableCell
                      key={day}
                      align="center"
                      sx={{
                        width: `${100 / dates.length}%`,
                        borderBottom: index === 0 ? 0 : "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="subtitle1">{day}</Typography>
                      <Typography variant="body1">{date}</Typography>
                    </TableCell>
                  ))}
                </TableHead>
                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow key={index} sx={{ height: "17.5vh" }}>
                      {dates.map((date) => (
                        <TableCell
                          key={date.day}
                          align="center"
                          sx={{
                            borderRight: "1px solid",
                            borderColor: "divider",
                            borderBottom: 0,  // Remove the bottom border
                          }}
                        >
                          {/* Task details */}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {emptyRows > 0 &&
                    [...Array(emptyRows)].map((_, index) => (
                      <TableRow key={index} sx={{ height: "17.5vh" }}>
                        {dates.map((date) => (
                          <TableCell
                            key={date.day}
                            sx={{
                              borderRight: "1px solid",
                              borderColor: "divider",
                              borderBottom: 0,  // Remove the bottom border
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
