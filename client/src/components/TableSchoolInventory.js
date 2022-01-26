import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import { useHistory } from 'react-router';
import {setIndexToObject} from '../services/utils';

const columns = [
    { field: 'index', headerName: 'ID', width: 70 },
    { field: 'inventories_name', headerName: 'Инвентарь', width: 260 },
    { field: 'inventories_nomination', headerName: 'Наименование', width: 300 },
    { field: 'inventories_count', headerName: 'Количество', width: 200 },
    { field: 'inventories_date', headerName: 'Дата выпуска', width: 200 },
];

export default function TableSchoolInventory({inventories}) {
    const history = useHistory();
    inventories = JSON.parse(inventories);
    console.log(inventories);
    const transformedInventoriesData = inventories?.map(
        (element, index) => setIndexToObject({...element, id: index}, index)
    )
    console.log(transformedInventoriesData);


    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={transformedInventoriesData}
                columns={columns}
                pageSize={15}
                className="table-style"
                onRowClick={e => {
                    //const schoolId = e.row.id;
                    history.push(`/mySchool/${e.row.id}`);
                }}
            />
        </div>
    );
}
