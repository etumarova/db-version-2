import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { fetchSportsmen } from 'services/sportsmen';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { deleteSportsman } from 'services/sportsmen';
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
    { field: 'name', headerName: 'ФИО тренера', width: 300 },
    { field: 'birthday', headerName: 'Дата рождения', width: 170 },
    { field: 'nowTrainer', headerName: 'Личный тренер', width: 200 },
    { field: 'school', headerName: 'Школа', width: 200 },
    { field: 'telephone', headerName: 'Телефон2', width: 150 },
    { field: 'delete', headerName: '', width: 80 },
];

export default function AdminSportsmen() {
    const history = useHistory();
    const classes = useStyles();

    const [isLoading, setIsLoading] = React.useState(true);
    const [value, setValue] = useState("");
    const { data: sportsmenData } = useQuery('sportsmen', fetchSportsmen, {onSuccess : () => setIsLoading(false)});
    const { sportsmen } = sportsmenData || {};

    const [formattedSportsmen, setFormattedSportsmen] = useState([]);

    const defaultFormattedSportsmen = sportsmen?.map((sportsman, index) => {
        const transformedObject = { ...sportsman, nowTrainer: sportsman.nowTrainer.name, id: sportsman._id, delete: "Удалить"}
        return setIndexToObject(transformedObject, index)
    }) || [];

    useEffect(() => {
        setFormattedSportsmen(defaultFormattedSportsmen)
    }, [isLoading])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h3" component="h4" gutterBottom>
                    Спортсмены
                </Typography>

                <Paper className={classes.root}>
                    <InputBase
                        onChange={(e) => {
                            setValue(e.target.value)
                            searchByName(defaultFormattedSportsmen, e.target.value, setFormattedSportsmen)
                        }}
                        value={value}
                        className={classes.input}
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <SearchIcon />
                </Paper>
            </div>
            {sportsmen && (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={formattedSportsmen}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onCellClick={e => {
                            if(e.field === "delete"){
                                console.log(e)
                                setFormattedSportsmen(formattedSportsmen.filter(sportsmen => sportsmen._id != e.row.id));
                                deleteSportsman({_id: e.row.id});
                            } else{
                                history.push(`/sportsmen/${e.row.id}`);
                            }
                        }}
                    />
                </div>
            )}
            <Button variant="contained" color="primary" onClick = {() => history.push(`/createSportsmen`)}>Добавить</Button>
        </div>
    );
}
