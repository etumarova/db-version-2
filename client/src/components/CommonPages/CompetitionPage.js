import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useAuth0 } from "@auth0/auth0-react";

export default function CompetitionPage() {
    const competition = JSON.parse(localStorage.getItem('competition'));
    const discepline = JSON.parse(competition.discepline);
    const { user, isAuthenticated } = useAuth0();
    return (
        <div>
            {(isAuthenticated)&&(<div style={{float: 'right'}}>
                {(JSON.parse(localStorage.getItem('admins')).filter(el=> el.user_id == localStorage.getItem('user')).length!=0)&&(
                <Button variant="contained" color="primary" href="/createCompetition">
                    Редактировать
                </Button>)}
            </div>)}
            {(competition)&&(
                <div style={{display: 'flex', flexFlow: 'column', margin: '10px'}}>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start', margin: '10px'}}>
                        <div style={{display: 'flex', flexFlow: 'column', justifyContent: 'end', marginTop: '10px'}}>
                            <div>
                                <Typography variant="h4" component="h5" gutterBottom>
                                {competition.name}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Место проведения: <b>{competition.place}</b>
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
                                <div style={{display: 'flex', flexFlow: 'column', justifyContent: 'start'}}>
                                    <Typography variant="body1" gutterBottom>
                                        Главный судья: <b>{competition.mainJudge}</b>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Cекретарь соревнований: <b>{competition.secretary}</b>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Телефон: <b>{competition.telephone}</b>
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{display: 'flex', flexFlow: 'column', justifyContent: 'end', margin: '10px'}}>
                        <Typography variant="body1" gutterBottom>
                            {competition.description}
                        </Typography>
                    </div>
                    {discepline.map((el)=>{
                            return(
                                <div style={{ marginLeft: '10px'}}>
                                    <Typography variant="body1" gutterBottom key={el}>
                                        {el}
                                    </Typography>
                                </div>
                            )
                        })}
                </div>
            )}
        </div>
    )
}
