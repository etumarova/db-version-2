import React from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { fetchSchools } from 'services/school';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { deleteSportsman } from 'services/sportsmen';
import { deleteSchool } from "services/school";
import TableSchoolInventory from 'components/TableSchoolInventory';
import {fetchTrainers} from "../../services/trainer";
import {Button} from "@material-ui/core";


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
    { field: 'id', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'Название школы', width: 370 },
    { field: 'director', headerName: 'Директор', width: 270 },
    { field: 'directorPhone', headerName: 'Телефон директора', width: 220 },
    { field: 'deputeDirector', headerName: 'Заместитель директора', width: 270 },
    { field: 'region', headerName: 'Регион', width: 180 },
    { field: 'city', headerName: 'Город', width: 170 },
    { field: 'telephone', headerName: 'Телефон', width: 150 },
    { field: 'email', headerName: 'Электронная почта', width: 250 },
    {field: 'delete', headerName: " ", width: 80},
];

export default function AdminSchools() {
    const history = useHistory();
    const classes = useStyles();

    console.log("ssdasdsad")

    const [isLoading, setIsLoading] = React.useState(true);
    const { data: schoolsData } = useQuery('schools', fetchSchools, {onSuccess : () => setIsLoading(false)});
    const [formattedSchools, setFormattedSchools] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    React.useEffect(()=> {
        setFormattedSchools(schoolsData?.map(school => ({ ...school, id: school._id, delete: "Удалить"})));
    }, [isLoading])
    React.useEffect(()=> {
        if(formattedSchools) setRows(formattedSchools)
    }, [formattedSchools]);


    /*const { data: schoolsData, isLoading } = useQuery('schools', fetchSchools);
    const [schools, setSchools] = React.useState([]);

    React.useEffect(()=>
        {
            setSchools(schoolsData?.map(school => ({ ...school, id: school._id, delete: "Удалить" })));
            console.log(schools);
        }, [isLoading])*/

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h3" component="h4" gutterBottom>
                    Спортивные Школы
                </Typography>

                <Paper component="form" className={classes.root}>
                    <InputBase
                        className={classes.input}
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>
            {formattedSchools && (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onCellClick={e => {
                            console.log("123");
                            if(e.field === "delete"){
                                console.log("111");
                                setFormattedSchools(formattedSchools.filter(school => school._id != e.row.id));
                                deleteSchool({_id: e.row.id});
                            } else{
                                console.log("1114");
                                history.push(`/mySchool/${e.row.userId}`);
                            }
                        }}
                    />
                </div>
            )}
           {/*<Button variant="contained" color="primary" onClick = {() => history.push(`/createEditSchool`)}>Добавить</Button>*/}
        </div>
    );
}
