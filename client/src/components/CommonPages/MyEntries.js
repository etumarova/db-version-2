import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { fetchEntriesBySchoolId } from 'services/entry';
import { fetchCompetitions } from 'services/competition';
import {setIndexToObject} from '../../services/utils';

const columns = [
    { field: 'index', headerName: 'ID', width: 95},
    { field: 'startDate', headerName: 'Начало', width: 130 },
    { field: 'endDate', headerName: 'Конец', width: 130 },
    { field: 'name', headerName: 'Название мероприятия', width: 380 },
    { field: 'deadLine', headerName: 'Заявки до', width: 130 },
    { field: 'dateSend', headerName: 'Дата отправки', width: 180 },
    { field: 'telephone', headerName: 'Телефон Представителя', width: 245 },
];

export default function MyEntries() {
    const history = useHistory();
    const { user, isAuthenticated } = useAuth0();

    const { data: entryData } = useQuery(['entries', user?.sub], () =>
        fetchEntriesBySchoolId(user?.sub)
    );
    const { entries } = entryData || {};

    const { data: competitionData } = useQuery('competitions', fetchCompetitions);
    const { competitions } = competitionData || {};

    const entriesData = entries?.map((entry, index) => {
        const competition = competitions?.find(comp => comp._id === entry.competitionId) || {};
        const transformedEntry = { id: entry._id, ...entry, ...competition };
        return setIndexToObject(transformedEntry, index);
    });

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
                Мои заявки
            </Typography>

            {entriesData && (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={entriesData}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => {
                            history.push(`/entry/${e.row.id}`);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
