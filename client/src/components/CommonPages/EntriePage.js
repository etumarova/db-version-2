import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

export default function EntriePage() {
    const entrie = JSON.parse(localStorage.getItem('entrie'));
    const discepline = JSON.parse(entrie.sportsmensList);
    const today = Date.now();
    return (
        <div>
            {new Date(entrie.deadLine) >= new Date(today) && (
                <div style={{ float: 'right' }}>
                    <Button variant="contained" color="primary" href="/createEntries">
                        Редактировать
                    </Button>
                </div>
            )}
            {entrie && (
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
                                    {entrie.name}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Начало соревнований: <b>{entrie.startDate}</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Окончание соревнований: <b>{entrie.endDate}</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Последний день принятия заявок: <b>{entrie.endDate}</b>
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
                                        Телефон представителя команды: <b>{entrie.telephone}</b>
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
                            Представитель команды: <b>{entrie.traner}</b>
                        </Typography>
                    </div>
                    <div style={{ display: 'flex' }}>
                        {Object.keys(discepline).map(keyName => {
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
                                                    <b>{keyName}</b>
                                                    <hr />
                                                </Typography>
                                                {discepline[keyName].map(el => {
                                                    return (
                                                        <Typography variant="body2" gutterBottom>
                                                            {el}
                                                        </Typography>
                                                    );
                                                })}
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
