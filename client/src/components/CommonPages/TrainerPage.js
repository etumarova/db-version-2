import React from 'react';
import { Image } from 'cloudinary-react';
import TableSportsmen from 'components/TableSportsmen';
import Button from '@material-ui/core/Button';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTrainerById } from 'services/trainer';
import { fetchSportsmenByTrainerId } from 'services/sportsmen';

export default function TrainerPage() {
    const { id } = useParams();
    const { data: trainerData } = useQuery(['trainers', id], () => fetchTrainerById(id));
    const { trainer } = trainerData || {};

    const { data: sportsmenData } = useQuery(['sportsmen', trainer?._id], () =>
        fetchSportsmenByTrainerId(trainer?._id)
    );
    const { sportsmen } = sportsmenData || {};

    return (
        <div>
            {trainer && (
                <div className="main-body" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div className="row gutters-sm" style={{ flexGrow: 1 }}>
                        <div className="col-lg-6 col-md-12 mb-md-3">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <Image
                                            cloud_name="dgeev9d6l"
                                            publicId={trainer.photo}
                                            width="250"
                                        />
                                        <Link to={`/createTrainer/${id}`}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                style={{ margin: '5px' }}
                                            >
                                                Редактировать
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">ФИО</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {trainer.name}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Год рождения</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {trainer.birthday}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Образование</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {trainer.education}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Трудовая категория</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {trainer.laborCategory}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Ведомственная принадлежность</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {trainer.school}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Количество занимающихся</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {trainer.studentNumber}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Телефон</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {trainer.telephone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {sportsmen && (
                            <div className="col" style={{ height: 500 }}>
                                <TableSportsmen sportsmen={sportsmen} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
