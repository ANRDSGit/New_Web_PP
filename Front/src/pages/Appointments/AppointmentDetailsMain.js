import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
 // Add this line to import the CSS styles

const InstructorDetailsMain = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('physical');
    const [appointments, setAppointments] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Load existing appointments to show on the calendar
        const fetchAppointments = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/appointments/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAppointments(response.data);
        };

        fetchAppointments();
    }, []);

    // Generate time slots from 4 PM to 9 PM (in one-hour intervals)
    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let i = 16; i <= 20; i++) {
            timeSlots.push(`${i}:00`, `${i}:30`);
        }
        return timeSlots;
    };

    // Fetch available times for the selected date
    useEffect(() => {
        const fetchAvailableTimes = async () => {
            if (!selectedDate) return;

            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/appointments/available-times/${selectedDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Filter available times to show only slots with fewer than 4 appointments
            const timeSlots = generateTimeSlots();
            const availableSlots = timeSlots.filter((timeSlot) => {
                const appointmentsForTimeSlot = response.data.filter((app) => app.time === timeSlot);
                return appointmentsForTimeSlot.length < 4;
            });

            setAvailableTimes(availableSlots); // Update available times
        };

        fetchAvailableTimes();
    }, [selectedDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                '/api/appointments',
                {
                    date,
                    time,
                    appointmentType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert('Appointment booked successfully');
            setAppointments([...appointments, response.data]); // Update calendar with new appointment
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Error booking appointment');
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            const appointmentForDate = appointments.filter((app) => app.date === dateString);

            if (appointmentForDate.length > 0) {
                return (
                    <ul>
                        {appointmentForDate.map((app, idx) => (
                            <li key={idx}>
                                {app.time} - {app.appointmentType}
                            </li>
                        ))}
                    </ul>
                );
            }
        }
        return null;
    };

    const handleDateChange = (date) => {
        const dateString = date.toISOString().split('T')[0];
        setDate(dateString);
        setSelectedDate(dateString); // Ensure selectedDate is updated
    };

    return (
        <div className="instructor-details">
            <h2>Book an Appointment</h2>
            <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-field">
                    <label>Date:</label>
                    <input
                        type="date"
                        className="input-box"
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            setSelectedDate(e.target.value); // Set selected date on change
                        }}
                        required
                    />
                </div>
                <div className="form-field">
                    <label>Time:</label>
                    <select className="input-box" value={time} onChange={(e) => setTime(e.target.value)} required>
                        <option value="">Select a time</option>
                        {availableTimes.length > 0 ? (
                            availableTimes.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))
                        ) : (
                            <option disabled>No times available</option>
                        )}
                    </select>
                </div>
                <div className="form-field">
                    <label>Appointment Type:</label>
                    <select className="input-box" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
                        <option value="physical">Physical</option>
                        <option value="remote">Remote</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">Book Appointment</button>
            </form>

            <h3>Appointments Calendar</h3>
            <Calendar tileContent={tileContent} onClickDay={handleDateChange} className="custom-calendar" />
        </div>
    );
};

export default InstructorDetailsMain;
