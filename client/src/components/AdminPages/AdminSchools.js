import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
      height: 40
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

export default function AdminSchools() {
    const socket = io();
    const [schools, setSchools] = useState(null);
    const classes = useStyles();
    const { user } = useAuth0();

    useEffect(()=>{
        socket.emit('getAdminSchools');
        socket.on('adminSchools', (data) => {
            data.forEach((el) => el['id'] = el['_id'])
            setSchools(data);
        })
    }, [])

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Название школы', width: 370 },
        { field: 'director', headerName: 'Директор', width: 270 },
        { field: 'region', headerName: 'Регион', width: 180 },
        { field: 'city', headerName: 'Город', width: 170 },
        { field: 'telephone', headerName: 'Телефон', width: 150 },
      ];

    return (
        (JSON.parse(localStorage.getItem('admins')).filter(el=> el.user_id == localStorage.getItem('user')).length!=0)&&(<div>
            <div style={{display: 'flex',justifyContent: 'space-between'}}>
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
            {(schools)&&(
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid 
                        rows={schools} 
                        columns={columns} 
                        pageSize={15}
                        className='table-style'
                        onRowClick={(e)=>{
                            window.location.assign('/mySchool');
                            localStorage.setItem('user', e.row.idUser)
                        }}/>
                </div>
            )}
        </div>)
    )
}