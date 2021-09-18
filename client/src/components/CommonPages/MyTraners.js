import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import useSocket from 'hooks/useSocket';

export default function MyTraners() {
    const { socket } = useSocket();
    const [traners, setTraners] = useState(null);
    useEffect(() => {
        socket.emit('getTraners', { idSchool: localStorage.getItem('user') });
        socket.on('traners', data => {
            data.forEach(el => (el['id'] = el['_id']));
            setTraners(data);
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
