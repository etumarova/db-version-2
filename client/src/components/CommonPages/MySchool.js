import React, { useContext, useState } from 'react';
import { Image } from 'cloudinary-react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchSchoolById } from 'services/school';
import { fetchSchoolByUserId } from 'services/school';
import { UserContext } from 'context/UserContext';
import TableSchoolInventory from '../TableSchoolInventory.js'

export default function MySchool() {
    const { id } = useParams();
    const { userSub, isAuthenticated } = useContext(UserContext);

    const userId = id || userSub;
    const { isSuccess, isError, data } = useQuery(['schools', userId], () =>
        id? fetchSchoolById(id) : fetchSchoolByUserId(userId)
    );

    const { school } = data || {};

    const showNoDataWarning = userSub && (isSuccess || isError) && !school;

    const title = id ? 'Школа' : 'Моя школа';
    return (
        <div>
            <Typography variant="h3" component="h4" gutterBottom>
                {title}
            </Typography>

            {isAuthenticated && (
                <div style={{ float: 'right' }}>
                    <Link to={`/createEditSchool/${userId}`}>
                        <Button variant="contained" color="primary">
                            {school ? 'Редактировать' : 'Создать'}
                        </Button>
                    </Link>
                </div>


            )}

            {showNoDataWarning && <p>Нет сохраненной школы</p>}
            {school && (
                <div className="main-body">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexWrap: 'nowrap',
                            maxWidth: '50em',
                        }}
                    >
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <Image
                                        cloud_name="dgeev9d6l"
                                        publicId={school.photo}
                                        width="250"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3 text-secondary">
                                        Название учреждения
                                    </div>

                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.name}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3 text-secondary">{school.director}</div>

                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.director}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3 text-secondary">Заместитель директора</div>

                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.deputeDirector}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3 text-secondary">Заместитель директора</div>

                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.deputeDirector1}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3 text-secondary">Заместитель директора</div>

                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.deputeDirector2}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3 text-secondary">Регион</div>

                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.region}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3  text-secondary">Адрес</div>
                                    <div className="col-sm-9">
                                        <h6 className="mb-0">
                                            {school.city + ', ' + school.address}
                                        </h6>
                                    </div>
                            
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3  text-secondary">Телефон директора</div>
                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.directorPhone}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3  text-secondary">Телефон</div>
                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.telephone}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3  text-secondary">Электронная почта</div>
                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.email}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3  text-secondary">Отделения по видам спорта</div>
                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.typeSport}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        display: 'flex',
                                        flexFlow: 'column',
                                        justifyContent: 'end',
                                        margin: '10px',
                                    }}
                                >
                                    <Typography variant="h5" component="h6" gutterBottom>
                                        Об учреждении
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {school.description}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <TableSchoolInventory inventories={school.listInventories}></TableSchoolInventory>
                </div>
            )}
        </div>
    );
}
