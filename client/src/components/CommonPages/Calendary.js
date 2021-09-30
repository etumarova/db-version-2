import React, { useMemo, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useContext } from 'react';
import { UserContext } from 'context/UserContext';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { fetchCompetitions } from 'services/competition';

const Calendary = () => {
    const { isAdmin } = useContext(UserContext);
    const history = useHistory();
    const { data } = useQuery('competitions', fetchCompetitions);
    const { competitions } = data || {};

    const calendarEvents = useMemo(() => {
        if (competitions) {
            const formattedCompetition = competitions
                .map(event => {
                    const calendaryEvents = [];

                    if (event.deadLine) {
                        calendaryEvents.push({
                            title: `Последний день регистрации: ${event.name}`,
                            date: event.deadLine,
                            color: 'red',

                            extendedProps: {
                                id: event._id,
                            },
                        });
                    }

                    calendaryEvents.push({
                        title: event.name,
                        start: event.startDate,
                        end: event.endDate,

                        extendedProps: {
                            id: event._id,
                        },
                    });

                    return calendaryEvents;
                })
                .flat();

            return formattedCompetition;
        }
    }, [competitions]);

    return (
        <div>
            {isAdmin && (
                <div style={{ float: 'right' }}>
                    <Link to="createCompetition">
                        <Button variant="contained" color="primary">
                            Добавить мероприятие
                        </Button>
                    </Link>
                </div>
            )}
            <Typography variant="h3" component="h4" gutterBottom>
                Календарь соревнований
            </Typography>
            <FullCalendar
                plugins={[interactionPlugin, dayGridPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                className="table-style"
                locale={ruLocale}
                eventClick={e => {
                    const id = e.event._def.extendedProps.id;

                    history.push(`/competition/${id}`);
                }}
            />
        </div>
    );
};

export default Calendary;
