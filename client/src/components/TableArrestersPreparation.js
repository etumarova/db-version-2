import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import {setIndexToObject} from '../services/utils';
import Typography from '@material-ui/core/Typography';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'ФИО спортсмена', width: 300 },
    { field: 'sportTitul', headerName: 'Спортивное звание', width: 300 },
    { field: 'year', headerName: 'Год присвоения', width: 250 },
];

export default function TableArrestersPreparation({arresters}) {
    arresters = JSON.parse(arresters);
    const transformedArrestersData = arresters.map(
        (element, index) => setIndexToObject({...element, id: index}, index)
    )


    return (
        <div style={{ height: 500, width: '100%', marginTop: 50, }}>
            <Typography variant="h5" component="h6" gutterBottom>
                Подготовка разрядников
            </Typography>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={transformedArrestersData}
                columns={columns}
                pageSize={15}
                rowsPerPageOptions={[5, 10, 15]}
                className="table-style"
            />
        </div>
    );
}
