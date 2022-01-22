import React from 'react';
import { DataGrid, ruRU } from '@material-ui/data-grid';
import { useHistory } from 'react-router';
import {useQuery} from "react-query";
import {fetchSportsmen} from "../services/sportsmen";
import {setIndexToObject} from '../services/utils';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'ФИО', width: 260 },
    { field: 'birthday', headerName: 'Год рождения', width: 150 },
    { field: 'nowTrainer', headerName: 'Личный тренер', width: 260 },
    { field: 'school', headerName: 'Ведомственная принадлежность', width: 180 },
    { field: 'telephone', headerName: 'Телефон', width: 140 },
];

export default function TableSportsmen({sportsmen}) {
    const history = useHistory();
    const { sportsmen } = props;


    const [formattedSportsmen, setFormattedSportsmen] =
        React.useState(null);

    React.useEffect(()=> {
        setFormattedSportsmen(sportsmen?.map((sportsman, index) => {
            const transformedObject = {...sportsman, id: sportsman._id, nowTrainer: sportsman.nowTrainer.name}
            return setIndexToObject(transformedObject, index)
        }));
    },    []);


    return (<>
        {formattedSportsmen && (
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    localeText={ruRU.props.MuiDataGrid.localeText}
                    rows={formattedSportsmen}
                    columns={columns}
                    pageSize={15}
                    className="table-style"
                     onRowClick={e => {
                        const userId = e.row.id;
                        history.push(`/sportsmen/${userId}`);
                     }}
                />
            </div>
        )}
    </>)
}
