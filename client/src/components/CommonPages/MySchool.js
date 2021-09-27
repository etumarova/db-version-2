import React, { useEffect, useState } from 'react';
import { Image } from 'cloudinary-react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function MySchool() {
    const [school, setSchool] = useState(null);
    const { isAuthenticated, user } = useAuth0();

    useEffect(() => {
        (async () => {
            if (user?.sub) {
                try {
                    const res = await fetch(`/school/?userId=${user.sub}`);
                    const { school } = await res.json();

                    setSchool(school);
                } catch (error) {
                    console.log(error);
                }
            }
        })();
    }, [user?.sub]);

    return (
        <div>
            <Typography variant="h3" component="h4" gutterBottom>
                Моя школа
            </Typography>

            {isAuthenticated && (
                <div style={{ float: 'right' }}>
                    <Link to="createEditSchool">
                        <Button variant="contained" color="primary">
                            {school ? 'Редактировать' : 'Создать'}
                        </Button>
                    </Link>
                </div>
            )}

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
                                        publicId={school.foto}
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
                                            {school.city + ', ' + school.adress}
                                        </h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3  text-secondary">Телефон</div>
                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school.telephone}</h6>
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
                </div>
            )}
        </div>
    );
}
