import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';
import useSocket from 'hooks/useSocket';

const Calendary = () => {
    const { socket } = useSocket();
    const [events, setEvents] = useState([]);
    const { user, isAuthenticated } = useAuth0();

    useEffect(() => {
        socket.emit('getCompetition');
        socket.on('competition', data => {
            data.forEach(el => {
                el['title'] = el.name;
                el['start'] = el.startDate;
                el['end'] = el.endDate;
                el['id'] = el._id;
            });
            setEvents(data);
        });
    }, [socket]);

    const openCompetition = e => {
        localStorage.setItem('competition', JSON.stringify(e.event._def.extendedProps));
        window.location.assign('/competition');
    };

    return (
        <div>
            {isAuthenticated &&
                JSON.parse(localStorage.getItem('admins')).filter(
                    el => el.user_id == localStorage.getItem('user')
                ).length != 0 && (
                    <div style={{ float: 'right' }}>
                        <Button variant="contained" color="primary" href="/createCompetition">
                            Добавить мероприятие
                        </Button>
                    </div>
                )}
            <Typography variant="h3" component="h4" gutterBottom>
                Календарь соревнований
            </Typography>
            <FullCalendar
                plugins={[interactionPlugin, dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                className="table-style"
                locale={ruLocale}
                eventClick={openCompetition}
            />
        </div>
    );
};

export default Calendary;
