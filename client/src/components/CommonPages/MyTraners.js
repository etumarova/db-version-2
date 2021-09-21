import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import useSocket from 'hooks/useSocket';
import { useAuth0 } from '@auth0/auth0-react';

export default function MyTraners() {
    const { user } = useAuth0();
    const { socket } = useSocket();
    const [traners, setTraners] = useState(null);
    useEffect(() => {
        if (user?.sub) {
            socket.emit('getTraners', { idSchool: user.sub });
        }
    }, [socket, user?.sub]);

    useEffect(() => {
        socket.on('traners', data => {
            data.forEach(el => (el['id'] = el['_id']));
            const trainerData = [...data.map(trainer => ({ ...trainer, id: trainer._id }))];
            setTraners(trainerData);
        });
    }, [socket]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        { field: 'name', headerName: 'ФИО', width: 260 },
        { field: 'birthday', headerName: 'Год рождения', width: 150 },
        { field: 'school', headerName: 'Принадлежность', width: 180 },
        { field: 'telephone', headerName: 'Телефон', width: 140 },
    ];

    return (
        <div>
            <div style={{ float: 'right' }}>
                <Link to="createTraner">
                    <Button variant="contained" color="primary">
                        Добавить тренера
                    </Button>
                </Link>
            </div>
            <Typography variant="h3" component="h4" gutterBottom>
                Тренерский состав
            </Typography>
            {traners && (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={traners}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => {
                            window.location.assign('/traner');
                            localStorage.setItem('traner', JSON.stringify(e.row));
                        }}
                    />
                </div>
            )}
        </div>
    );
}
