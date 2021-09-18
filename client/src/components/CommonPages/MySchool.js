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
    const { isAuthenticated } = useAuth0();

    useEffect(() => {
        socket.emit('getSchool', { idUser: localStorage.getItem('user') });
        socket.on('school', data => {
            if (data.length !== 0) setSchool(data);
        });
    }, [socket]);

    return (
        <div>
            {isAuthenticated && (
                <div style={{ float: 'right' }}>
                    {!school && (
                        <Link to="createEditSchool">
                            <Button variant="contained" color="primary" href="/createEditSchool">
                                Создать
                            </Button>
                        </Link>
                    )}
                    {school && (
                        <Link to="createEditSchool">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={e => {
                                    // window.location.assign('/createEditSchool');
                                    localStorage.setItem('editSchool', JSON.stringify(school[0]));
                                }}
                            >
                                Редактировать
                            </Button>
                        </Link>
                    )}
                </div>
            )}
            {school && (
                <div className="main-body">
                    <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                        <div className="row gutters-sm">
                            <div className="col-md-4 mb-3">
                                <div className="card">
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
                                <div className="col-md-8" style={{ marginLeft: '-15px' }}>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Название учреждения</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {school[0].name}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Директор</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {school[0].director}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Регион</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {school[0].region}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Адрес</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {school[0].city + ',' + school[0].adress}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Телефон</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {school[0].telephone}
                                                </div>
                                            </div>
                                        </div>
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
                            <Typography variant="h5" component="h6" gutterBottom>
                                Об учреждении
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {school[0].description}
                            </Typography>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
