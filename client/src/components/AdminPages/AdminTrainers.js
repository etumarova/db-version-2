import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { fetchTrainers } from 'services/trainer';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { deleteTrainer } from 'services/trainer';
import {searchByName, setIndexToObject} from '../../services/utils';


const useStyles = makeStyles(theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        height: 40,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'ФИО тренера', width: 370 },
    { field: 'birthday', headerName: 'Дата рождения', width: 270 },
    { field: 'school', headerName: 'Школа', width: 180 },
    { field: 'telephone', headerName: 'Телефон', width: 150 },
    {field: 'delete', headerName: " ", width: 80},
];




export default function AdminTrainers() {
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(true);
    const { data: trainersData } = useQuery('trainer', fetchTrainers, {onSuccess : () => setIsLoading(false)});
    const [formattedTrainer, setFormattedTrainer] = React.useState([]);
    const [value, setValue] = useState("");

    const defaultFormattedTrainer = trainersData?.trainers.map((trainer, index) => {
        const transformedObject = { ...trainer, id: trainer._id, delete: "Удалить"}
        return setIndexToObject(transformedObject, index)
    }) || [];

    useEffect(() => {
        setFormattedTrainer(defaultFormattedTrainer)
    }, [isLoading])

    //const classes = useStyles();

    //const { data: trainersData } = useQuery('trainers', fetchTrainers);
    //const { trainers } = trainersData || {};
    //const formattedTrainers = trainers?.map(trainer => ({ ...trainer, id: trainer._id }));

    const classes = useStyles();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h3" component="h4" gutterBottom>
                    Тренеры
                </Typography>

                <Paper className={classes.root}>
                    <InputBase
                        onChange={(e) => {
                            setValue(e.target.value)
                            searchByName(defaultFormattedTrainer, e.target.value, setFormattedTrainer)
                        }}
                        value={value}
                        className={classes.input}
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <SearchIcon />
                </Paper>
            </div>
            {formattedTrainer && (
                <div style={{ height: 500, width: '100%' }}>

                    <DataGrid

                        rows={formattedTrainer}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onCellClick={e => {
                            if(e.field === "delete"){
                                setFormattedTrainer(formattedTrainer.filter(trainer => trainer._id != e.row.id));
                                deleteTrainer({_id: e.row.id});
                            } else{
                                history.push(`/trainer/${e.row.id}`);
                            }
                        }}


                     //   rows={formattedTrainers}
                     //   columns={columns}
                     //   pageSize={15}
                     //   className="table-style"
                     //   onRowClick={e => {
                     //       history.push(`/trainer/${e.row.id}`);
                     //   }}
                    />

                    
                </div>
            )}

                  <Button variant="contained" color="primary" onClick = {() => history.push(`/createTrainer`)}>Добавить</Button>
        </div>
    );
}
