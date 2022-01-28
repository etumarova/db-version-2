import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import {setIndexToObject} from '../services/utils';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'ФИО спортсмена', width: 300 },
    { field: 'school', headerName: 'Наименование организации', width: 300 },
    { field: 'year', headerName: 'Год передачи', width: 170 },
];

export default function TableTransfer({transfer}) {
    transfer = JSON.parse(transfer);
    const transformedTransferData = transfer?.map(
        (element, index) => setIndexToObject({...element, id: index}, index)
    )

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={transformedTransferData}
                columns={columns}
                pageSize={15}
                className="table-style"
            />
        </div>
    );
}

