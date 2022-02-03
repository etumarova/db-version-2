import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fetchSchools } from 'services/school';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { deleteSchool } from "services/school";
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
    { field: 'name', headerName: 'Название школы', width: 370 },
    { field: 'director', headerName: 'Директор', width: 270 },
    { field: 'directorPhone', headerName: 'Телефон директора', width: 220 },
    { field: 'deputeDirector', headerName: 'Заместитель директора', width: 270 },
    { field: 'region', headerName: 'Регион', width: 180 },
    { field: 'city', headerName: 'Город', width: 170 },
    { field: 'telephone', headerName: 'Телефон', width: 150 },
    { field: 'email', headerName: 'Электронная почта', width: 250 },
    { field: 'delete', headerName: ' ', width: 80 },
];

export default function AdminSchools() {
    const history = useHistory();
    const classes = useStyles();
    const [isLoading, setIsLoading] = React.useState(true);
    const { data: schoolsData } = useQuery('schools', fetchSchools, {onSuccess : () => setIsLoading(false)});
    const [formattedSchools, setFormattedSchools] = React.useState([]);
    const [value, setValue] = useState("");

    const defaultFormattedSchools = schoolsData?.map((school, index) => {
        const transformedObject = { ...school, id: school._id, delete: "Удалить"}
        return setIndexToObject(transformedObject, index)
    }) || [];

    useEffect(() => {
        setFormattedSchools(defaultFormattedSchools)
    }, [isLoading])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h3" component="h4" gutterBottom>
                    Спортивные Школы
                </Typography>

                <Paper className={classes.root}>
                    <InputBase
                        onChange={(e) => {
                            setValue(e.target.value)
                            searchByName(defaultFormattedSchools, e.target.value, setFormattedSchools)
                        }}
                        value={value}
                        className={classes.input}
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <SearchIcon />
                </Paper>
            </div>
            {formattedSchools && (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={formattedSchools}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onCellClick={e => {
                            if(e.field === "delete"){
                                setFormattedSchools(formattedSchools.filter(school => school._id != e.row.id));
                                deleteSchool({_id: e.row.id});
                            } else{
                                history.push(`/mySchool/${e.row.id}`);
                            }
                        }}
                    />
                </div>
            )}
           {/*<Button variant="contained" color="primary" onClick = {() => history.push(`/createEditSchool`)}>Добавить</Button>*/}
        </div>
    );
}
