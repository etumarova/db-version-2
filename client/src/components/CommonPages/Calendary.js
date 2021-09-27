import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';

const Calendary = ({ isAdmin }) => {
    const [events, setEvents] = useState([]);
    const { user, isAuthenticated } = useAuth0();

    // useEffect(() => {
    //     socket.emit('getCompetition');
    //     socket.on('competition', data => {
    //         data.forEach(el => {
    //             el['title'] = el.name;
    //             el['start'] = el.startDate;
    //             el['end'] = el.endDate;
    //             el['id'] = el._id;
    //         });
    //         setEvents(data);
    //     });
    // }, [socket]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/competitions`);
                const { competitions } = await res.json();

                if (competitions) {
                    setEvents(competitions);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    // rewrite using useHistory
    const openCompetition = e => {
        localStorage.setItem('competition', JSON.stringify(e.event._def.extendedProps));
        window.location.assign('/competition');
    };

    return (
        <div>
            {isAuthenticated && isAdmin && (
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
