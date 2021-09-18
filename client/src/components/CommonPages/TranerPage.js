import React, { useEffect, useState } from 'react';
import { Image } from 'cloudinary-react';
import TableSportsmens from 'components/TableSportsmens';
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';

export default function TranerPage() {
    const traner = JSON.parse(localStorage.getItem('traner'));
    const socket = io();
    const [sportsmens, setSportsmens] = useState(null);
    useEffect(() => {
        socket.emit('getTranerSportsmens', { name: traner.name });
        socket.on('tranerSportsmens', data => {
            data.forEach(el => (el['id'] = el['_id']));
            setSportsmens(data);
        });
    }, []);
    return (
        <div>
            {traner && (
                <div className="main-body">
                    <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                        <div className="row gutters-sm">
                            <div className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex flex-column align-items-center text-center">
                                            <Image
                                                cloud_name="dgeev9d6l"
                                                publicId={traner.foto}
                                                width="250"
                                            />
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                style={{ margin: '5px' }}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    window.location.assign('/createTraner');
                                                }}
                                            >
                                                Редактировать
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8" style={{ marginLeft: '-15px' }}>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">ФИО</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {traner.name}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Год рождения</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {traner.birthday}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Принадлежность</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {traner.school}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Телефон</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {traner.telephone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {sportsmens && <TableSportsmens sportsmens={sportsmens} />}
                    </div>
                </div>
            )}
        </div>
    );
}
