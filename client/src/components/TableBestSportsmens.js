import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import {setIndexToObject} from '../services/utils';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'ФИО спортсмена', width: 300 },
    { field: 'rankCompetition', headerName: 'Ранг соревнований', width: 300 },
    { field: 'date', headerName: 'Дата', width: 150 },
    { field: 'location', headerName: 'Место проведения', width: 300 },
];

export default function TableBestSportsmen({best}) {
    best = JSON.parse(best);
    const transformedBestSportsmenData = best.map(
        (element, index) => setIndexToObject({...element, id: index}, index)
    )

    return (
        <div style={{ height: 500, width: '100%', marginTop: 14, }}>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={transformedBestSportsmenData}
                columns={columns}
                pageSize={15}
                className="table-style"
            />
        </div>
    );
}
