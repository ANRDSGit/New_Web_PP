import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Modal,
  Grid,
  MenuItem,
  Fade,
  Backdrop,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const generateTimeSlots = () => {
    const startTime = 16; // 4:00 PM in 24-hour format
    const endTime = 21; // 9:00 PM in 24-hour format
    const slots = [];
  
    for (let hour = startTime; hour < endTime; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const timeString = `${hour < 10 ? '0' : ''}${hour}:${
          minutes === 0 ? '00' : minutes
        }`;
        slots.push(timeString);
      }
    }
    return slots;
  };

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    appointmentType: 'physical',
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  // Fetch appointments on component mount
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:7000/api/auth/appointments/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        setError('Error fetching appointments');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (newAppointment.date) {
      const slots = generateTimeSlots();
      const bookedSlots = appointments
        .filter((apt) => apt.date === newAppointment.date)
        .map((apt) => apt.time);

      const available = slots.filter((slot) => !bookedSlots.includes(slot));
      setAvailableSlots(available);
    }
  }, [newAppointment.date, appointments]);

  // Handle creation of a new appointment
  const handleCreate = () => {
    setLoading(true);
    axios
      .post('http://localhost:7000/api/auth/appointments', newAppointment, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAppointments([...appointments, res.data]);
        setNewAppointment({ date: '', time: '', appointmentType: 'physical' });
      })
      .catch((err) => {
        setError('Error creating appointment');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle selection of an appointment from the calendar
  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  // Handle updating the selected appointment
  const handleUpdate = () => {
    if (!selectedAppointment || !selectedAppointment._id) {
      setError('Selected appointment is invalid');
      return;
    }

    setLoading(true);
    axios
      .put(
        `http://localhost:7000/api/auth/appointments/${selectedAppointment._id}`,
        selectedAppointment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setAppointments(
          appointments.map((apt) =>
            apt._id === res.data._id ? res.data : apt
          )
        );
        setOpenModal(false);
      })
      .catch((err) => {
        setError('Error updating appointment');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle deletion of an appointment
  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`http://localhost:7000/api/auth/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAppointments(appointments.filter((apt) => apt._id !== id));
        setOpenModal(false);
      })
      .catch((err) => {
        setError('Error deleting appointment');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Opening hours data
  const openingHours = [
    { day: 'Monday', hours: '4:00 PM - 9:00 PM' },
    { day: 'Tuesday', hours: '4:00 PM - 9:00 PM' },
    { day: 'Wednesday', hours: '4:00 PM - 9:00 PM' },
    { day: 'Thursday', hours: '4:00 PM - 9:00 PM' },
    { day: 'Friday', hours: '4:00 PM - 9:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: '1200px', margin: 'auto' }}>
      
      

      {/* Modal for Creating Appointment */}
      <Fade in={true} timeout={2000}>
        <Card sx={{ mt: 4, p: 2, boxShadow: 4, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6">Create New Appointment</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      date: e.target.value,
                    })
                  }
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Time"
                  value={newAppointment.time}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      time: e.target.value,
                    })
                  }
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={!newAppointment.date} // Disable if no date is selected
                >
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <MenuItem key={index} value={slot}>
                        {slot}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No slots available</MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Appointment Type"
                  value={newAppointment.appointmentType}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      appointmentType: e.target.value,
                    })
                  }
                  fullWidth
                >
                  <MenuItem value="physical">Physical</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Create Appointment
            </Button>
          </CardContent>
        </Card>
      </Fade>

      {selectedAppointment && (
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
          }}
        >
          <Fade in={openModal}>
            <Paper
              elevation={5}
              sx={{
                padding: 4,
                margin: 'auto',
                maxWidth: 500,
                mt: 10,
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Edit Appointment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Date"
                    type="date"
                    value={selectedAppointment.date || ''}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        date: e.target.value,
                      })
                    }
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Time"
                    type="time"
                    value={selectedAppointment.time || ''}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        time: e.target.value,
                      })
                    }
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Appointment Type"
                    value={selectedAppointment.appointmentType || ''}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        appointmentType: e.target.value,
                      })
                    }
                    fullWidth
                  >
                    <MenuItem value="physical">Physical</MenuItem>
                    <MenuItem value="remote">Remote</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                onClick={handleUpdate}
                sx={{ mt: 2 }}
              >
                Update Appointment
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(selectedAppointment._id)}
                sx={{ mt: 2, ml: 2 }}
              >
                Delete Appointment
              </Button>
            </Paper>
          </Fade>
        </Modal>
      )}

{loading ? (
        <CircularProgress />
      ) : (
        <Fade in={true} timeout={1500}>
          <Box sx={{ boxShadow: 3, borderRadius: 3, overflow: 'hidden', padding: 2 }}>
            <Calendar
              localizer={localizer}
              events={appointments.map((appointment) => ({
                title: `${appointment.patientName} - ${appointment.appointmentType}`,
                start: new Date(appointment.date),
                end: new Date(appointment.date),
                _id: appointment._id,
              }))}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, margin: '50px 0' }}
              onSelectEvent={handleSelectAppointment}
            />
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default Appointments;
