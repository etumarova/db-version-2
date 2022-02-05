import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import {setIndexToObject} from '../services/utils';
import Typography from '@material-ui/core/Typography';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'groupName', headerName: 'Группа', width: 300 },
    { field: 'amount', headerName: 'Количество занимающихся', width: 275 },
];

export default function TableTrainersGroups({groups}) {
    groups = JSON.parse(groups);
    const transformedTrainersGroupsData = groups.map(
        (element, index) => setIndexToObject({...element, id: index}, index)
    )


    return (
        <div style={{ height: 500, width: '100%', marginTop: 50, }}>
            <Typography variant="h5" component="h6" gutterBottom>
                Группы
            </Typography>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={transformedTrainersGroupsData}
                columns={columns}
                pageSize={15}
                rowsPerPageOptions={[5, 10, 15]}
                className="table-style"
            />
        </div>
    );
}
