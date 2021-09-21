import React, { useEffect, useState } from 'react';
import { Image } from 'cloudinary-react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';
import useSocket from 'hooks/useSocket';
import { Link } from 'react-router-dom';

export default function MySchool() {
    const { socket } = useSocket();
    const [school, setSchool] = useState(null);
    const { isAuthenticated, user } = useAuth0();

    useEffect(() => {
        if (user?.sub) {
            socket.emit('getSchool', { idUser: user.sub });
        }
    }, [socket, user?.sub]);

    useEffect(() => {
        socket.on('school', data => {
            if (data.length !== 0) setSchool(data);
        });
    }, [socket]);

    return (
        <div>
            {isAuthenticated && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {school ? (
                        <Link to="createEditSchool">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={e => {
                                    localStorage.setItem('editSchool', JSON.stringify(school[0]));
                                }}
                            >
                                Редактировать
                            </Button>
                        </Link>
                    ) : (
                        <Link to="createEditSchool">
                            <Button variant="contained" color="primary" href="/createEditSchool">
                                Создать
                            </Button>
                        </Link>
                    )}
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
                                        publicId={school[0].foto}
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
                                        <h6 className="mb-0">{school[0].name}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3 text-secondary">
                                        {school[0].director}
                                    </div>

                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school[0].director}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3 text-secondary">Регион</div>

                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school[0].region}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3  text-secondary">Адрес</div>
                                    <div className="col-sm-9">
                                        <h6 className="mb-0">
                                            {school[0].city + ', ' + school[0].adress}
                                        </h6>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3  text-secondary">Телефон</div>
                                    <div className="col-sm-9">
                                        <h6 className="mb-0">{school[0].telephone}</h6>
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
                                        {school[0].description}
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
