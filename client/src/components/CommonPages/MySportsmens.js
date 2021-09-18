import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TableSportsmens from 'components/TableSportsmens';
import Button from '@material-ui/core/Button';
import useSocket from 'hooks/useSocket';
import { Link } from 'react-router-dom';

export default function MySportsmens() {
    const { socket } = useSocket();
    const [sportsmens, setSportsmens] = useState(null);
    useEffect(() => {
        socket.emit('getSportsmens', { idSchool: localStorage.getItem('user') });
        socket.on('sportsmens', data => {
            data.forEach(el => (el['id'] = el['_id']));
            setSportsmens(data);
        });
    }, [socket]);

    return (
        <div>
            <div style={{ float: 'right' }}>
                <Link to="createSportsmen">
                    <Button variant="contained" color="primary">
                        Добавить спортсмена
                    </Button>
                </Link>
            </div>
            <Typography variant="h3" component="h4" gutterBottom>
                Мои спортсмены
            </Typography>
            {sportsmens && <TableSportsmens sportsmens={sportsmens} />}
        </div>
    );
}
