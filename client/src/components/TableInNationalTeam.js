import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import {setIndexToObject} from '../services/utils';
import Typography from '@material-ui/core/Typography';

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
        <div style={{ height: 500, width: '100%', marginTop: 50, }}>
            <Typography variant="h5" component="h6" gutterBottom>
                Спортсмены, включенные в списочный состав НК (сборных) команд Республики Беларусь
            </Typography>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={transformedInNationalTeamData}
                columns={columns}
                pageSize={15}
                rowsPerPageOptions={[5, 10, 15]}
                className="table-style"
            />
        </div>
    );
}
