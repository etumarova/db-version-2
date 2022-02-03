import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import {setIndexToObject} from '../services/utils';
import Typography from '@material-ui/core/Typography';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'inventories_name', headerName: 'Инвентарь', width: 260 },
    { field: 'inventories_nomination', headerName: 'Наименование', width: 300 },
    { field: 'inventories_count', headerName: 'Количество', width: 200 },
    { field: 'inventories_date', headerName: 'Дата выпуска', width: 200 },
];

export default function TableSchoolInventory({inventories}) {
    inventories = JSON.parse(inventories);
    const transformedInventoriesData = inventories?.map(
        (element, index) => setIndexToObject({...element, id: index}, index)
    )

    return (
        <div style={{ height: 500, width: '100%' }}>
            <Typography variant="h5" component="h6" gutterBottom>
                Материально-техническое обеспечение
            </Typography>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={transformedInventoriesData}
                columns={columns}
                pageSize={15}
                rowsPerPageOptions={[5, 10, 15]}
                className="table-style"
            />
        </div>
    );
}
