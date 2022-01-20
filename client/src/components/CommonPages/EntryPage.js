import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { fetchEntryById } from 'services/entry';
import { fetchCompetitionById } from 'services/competition';
import { fetchTrainerById } from 'services/trainer';

export default function EntryPage() {
    const { id } = useParams();
    const { data: entryData } = useQuery(['entries', id], () => fetchEntryById(id));
    const { entry } = entryData || {};

    const { data: competitionData } = useQuery(
        ['competition', entry?.competitionId],
        () => fetchCompetitionById(entry?.competitionId),
        { enabled: !!entry?.competitionId }
    );

    const  competition = competitionData?.competition || {};

    const { data: trainerData } = useQuery(
        ['trainer', entry?.trainer],
        () => fetchTrainerById(entry?.trainer),
        { enabled: !!entry?.trainer }
    );
    const { trainer } = trainerData || {};

    const sportsmenList = entry?.sportsmenList ? JSON.parse(entry?.sportsmenList) : [];
    const today = Date.now();
    return (
        <div>
            {/* {new Date(entry?.deadLine) >= new Date(today) && (
                <div style={{ float: 'right' }}>
                    <Link to={`createEntries/${id}`}>
                        <Button variant="contained" color="primary">
                            Редактировать
                        </Button>
                    </Link>
                </div>
            )} */}

            <Link to={`/createEntries/${id}`}>
                <Button variant="contained" color="primary">
                    Редактировать
                </Button>
            </Link>
            {entry && (
                <div style={{ display: 'flex', flexFlow: 'column', margin: '10px' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'start',
                            margin: '10px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexFlow: 'column',
                                justifyContent: 'end',
                                margin: '10px',
                            }}
                        >
                            <div>
                                <Typography variant="h3" component="h4" gutterBottom>
                                    {competition.name}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Начало соревнований: <b>{competition.startDate}</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Окончание соревнований: <b>{competition.endDate}</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Последний день принятия заявок: <b>{competition.endDate}</b>
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h5" component="h6" gutterBottom>
                                    Контактные данные
                                </Typography>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'start',
                                    }}
                                >
                                    <Typography variant="body1" gutterBottom>
                                        Телефон представителя команды:{' '}
                                        <b>{competition.telephone}</b>
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexFlow: 'column',
                            justifyContent: 'end',
                            margin: '10px',
                        }}
                    >
                        <Typography variant="body1" gutterBottom>
                            Представитель команды: <b>{trainer?.name || '-'}</b>
                        </Typography>
                    </div>
                    <div style={{ display: 'flex' }}>
                        {sportsmenList?.map(sportsman => {
                            return (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexFlow: 'column',
                                        marginRight: '20px',
                                        marginTop: '3px',
                                    }}
                                >
                                    <Card>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography
                                                    gutterBottom
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    <b>{sportsman.name}</b>
                                                    <hr />
                                                </Typography>

                                                <Typography variant="body2" gutterBottom>
                                                    {sportsman.discipline}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
