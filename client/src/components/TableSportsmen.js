import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import { useHistory } from 'react-router';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'ФИО', width: 260 },
    { field: 'birthday', headerName: 'Год рождения', width: 150 },
    { field: 'nowTrainer', headerName: 'Личный тренер', width: 260 },
    { field: 'school', headerName: 'Ведомственная принадлежность', width: 180 },
    { field: 'telephone', headerName: 'Телефон', width: 140 },
];

export default function TableSportsmen(props) {
    const history = useHistory();
    const { sportsmen } = props;
    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid
                localeText={ruRU.props.MuiDataGrid.localeText}
                rows={sportsmen}
                columns={columns}
                pageSize={15}
                className="table-style"
                onRowClick={e => {
                    const userId = e.row.id;
                    history.push(`/sportsmen/${userId}`);
                }}
            />
        </div>
    );
}
