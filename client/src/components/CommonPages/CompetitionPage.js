import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from 'context/UserContext';
import { useParams } from 'react-router';
import { useQuery } from 'react-query';
import { fetchCompetitionById } from 'services/competition';
import { Image } from 'cloudinary-react';

export default function CompetitionPage() {
    const { id } = useParams();
    const { data } = useQuery(['competitions', id], () => fetchCompetitionById(id));
    const { competition } = data || {};

    const { isAdmin } = useContext(UserContext);

    const discipline = competition?.discipline ? JSON.parse(competition.discipline) : [];

    return (
        <div>
            {isAdmin && (
                <div style={{ float: 'right' }}>
                    <Link to={`/createCompetition/${id}`}>
                        <Button variant="contained" color="primary">
                            Редактировать
                        </Button>
                    </Link>
                </div>
            )}
            {competition && (
                <div style={{ display: 'flex', flexFlow: 'column', margin: '10px' }}>
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex flex-column align-items-center text-center">
                                <Image
                                    cloud_name="dgeev9d6l"
                                    publicId={competition.logo}
                                    width="250"
                                />
                            </div>
                        </div>
                    </div>

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
                                marginTop: '10px',
                            }}
                        >
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
                                <div
                                    style={{
                                        display: 'flex',
                                        flexFlow: 'column',
                                        justifyContent: 'start',
                                    }}
                                >
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
                    <div
                        style={{
                            display: 'flex',
                            flexFlow: 'column',
                            justifyContent: 'end',
                            margin: '10px',
                        }}
                    >
                        <Typography variant="body1" gutterBottom>
                            {competition.description}
                        </Typography>
                    </div>

                    {discipline.map(el => {
                        return (
                            <div style={{ marginLeft: '10px' }}>
                                <Typography variant="body1" gutterBottom key={el}>
                                    {el}
                                </Typography>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
