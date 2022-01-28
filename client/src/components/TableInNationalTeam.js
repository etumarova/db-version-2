import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import {setIndexToObject} from '../services/utils';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'ФИО спортсмена', width: 300 },
    { field: 'category', headerName: 'Категория списочного состава', width: 300 },
    { field: 'year', headerName: 'Год', width: 150 },
];

export default function TableInNationalTeam({inNationalTeam}) {
    inNationalTeam = JSON.parse(inNationalTeam);
    const transformedInNationalTeamData = inNationalTeam.map(
        (element, index) => setIndexToObject({...element, id: index}, index)
    )


    return (
        <div style={{ height: 500, width: '100%', marginTop: 14, }}>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={transformedInNationalTeamData}
                columns={columns}
                pageSize={15}
                className="table-style"
            />
        </div>
    );
}
