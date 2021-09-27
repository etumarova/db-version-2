import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function MyEntries() {
    const [entries, setEntries] = useState(null);
    const [competitions, setCompetitions] = useState(null);
    const [newData, setNewData] = useState(null);
    const { user, isAuthenticated } = useAuth0();

    useEffect(() => {
        (async () => {
            try {
                if (user?.sub) {
                    const entriesResponse = await fetch(`/entries/${user.sub}`);
                    const { myEntries, competitionEntries } = await entriesResponse.json();
                    if (myEntries?.length > 0) {
                        setEntries(myEntries);
                    }

                    if (competitionEntries?.length > 0) {
                        setCompetitions(competitionEntries);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [user?.sub]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'startDate', headerName: 'Начало', width: 130 },
        { field: 'endDate', headerName: 'Конец', width: 130 },
        { field: 'name', headerName: 'Название мероприятия', width: 380 },
        { field: 'deadLine', headerName: 'Заявки до', width: 130 },
        { field: 'dateSend', headerName: 'Дата отправки', width: 170 },
        { field: 'telephone', headerName: 'Телефон Представителя', width: 200 },
    ];

    const row = () => {
        entries.forEach(el => {
            competitions.forEach(elem => {
                if (elem._id == el.idCompetition) {
                    el['startDate'] = elem.startDate;
                    el['endDate'] = elem.endDate;
                    el['name'] = elem.name;
                    el['deadLine'] = elem.deadLine;
                    el['discepline'] = elem.discepline;
                }
            });
        });
        setNewData(entries);
    };

    return (
        <div>
            <div style={{ float: 'right' }}>
                <Link to="createEntries">
                    <Button variant="contained" color="primary">
                        Создать заявку
                    </Button>
                </Link>
            </div>
            <Typography variant="h3" component="h4" gutterBottom>
                Наши заявки
            </Typography>

            {competitions && entries && !newData && row()}

            {newData && (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={newData}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => {
                            window.location.assign('/entrie');
                            localStorage.setItem('entrie', JSON.stringify(e.row));
                        }}
                    />
                </div>
            )}
        </div>
    );
}
