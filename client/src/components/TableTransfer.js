import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import { useHistory } from 'react-router';
import {setIndexToObject} from '../services/utils';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'ФИО спортсмена', width: 300 },
    { field: 'school', headerName: 'Наименование организации', width: 265 },
    { field: 'year', headerName: 'Год передачи', width: 170 },
];

export default function TableTransfer({transfer}) {
    const history = useHistory();
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
                onRowClick={e => {
                    history.push(`/trainer/${e.row.id}`);
                }}
            />
        </div>
    );
}

