import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';

const InstructorDetailsMain = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('physical');
    const [appointments, setAppointments] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Load existing appointments to show on the calendar
        const fetchAppointments = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/appointments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAppointments(response.data);
        };

        fetchAppointments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('/api/appointments', {
                date,
                time,
                appointmentType
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Appointment booked successfully');
            setAppointments([...appointments, response.data]); // Update calendar with new appointment
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    };
        // Same state and logic as above...

        const tileContent = ({ date, view }) => {
            const dateString = date.toISOString().split('T')[0];
            const appointmentForDate = appointments.find(
                (app) => app.date === dateString
            );
            if (appointmentForDate) {
                return <p>{appointmentForDate.time} - {appointmentForDate.appointmentType}</p>;
            }
            return null;
        };


        const timeOptions = ['16:00', '17:00', '18:00', '19:00', '20:00']; // Times from 4pm to 9pm

        return (
            <>
                <h2>Book an Appointment</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Date: </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Time: </label>
                        <select value={time} onChange={(e) => setTime(e.target.value)} required>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Appointment Type: </label>
                        <select
                            value={appointmentType}
                            onChange={(e) => setAppointmentType(e.target.value)}
                        >
                            <option value="physical">Physical</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>
                    <button type="submit">Book Appointment</button>
                </form>

                {/* You can implement a calendar view here using a library like react-calendar or similar */}
                {/* Form code as before */}

                <Calendar
                    tileContent={tileContent}
                    onClickDay={(value) => console.log('Clicked date:', value)}
                />
            </>

        );
    };
export default InstructorDetailsMain;
