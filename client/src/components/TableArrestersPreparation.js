import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import { useHistory } from 'react-router';
import {setIndexToObject} from '../services/utils';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'ФИО спортсмена', width: 300 },
    { field: 'sportTitul', headerName: 'Спортивное звание', width: 300 },
    { field: 'year', headerName: 'Год присвоения', width: 250 },
];

export default function TableArrestersPreparation({arresters}) {
    const history = useHistory();
    arresters = JSON.parse(arresters);
    const transformedArrestersData = arresters.map(
        (element, index) => setIndexToObject({...element, id: index}, index)
    )


    return (
        <div style={{ height: 500, width: '100%', marginTop: 14, }}>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={transformedArrestersData}
                columns={columns}
                pageSize={15}
                className="table-style"
                onRowClick={e => {
                    const userId = e.row.id;
                    history.push(`/trainer/${userId}`);
                }}
            />
        </div>
    );
}
