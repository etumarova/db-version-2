import React, { useEffect, useState, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { CSVLink } from 'react-csv';
import { useAuth0 } from '@auth0/auth0-react';
import ReactToPrint from 'react-to-print';
import PrintComponent from 'components/PrintComponent';
import { useQuery } from 'react-query';
import { fetchCompetitions } from 'services/competition';
import { fetchSchools } from 'services/school';
import { fetchEntries } from 'services/entry';
import { fetchSportsmen } from 'services/sportsmen';

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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 500,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nameCompetition', headerName: 'Название мероприятия', width: 370 },
    { field: 'school', headerName: 'Школа', width: 350 },
    { field: 'deadLine', headerName: 'Прием заявок до', width: 180 },
    { field: 'dateSend', headerName: 'Дата получения', width: 220 },
];

const headersCSV = [
    { label: 'id', key: 'id' },
    { label: 'Team', key: 'school' },
    { label: 'Class', key: 'classBoat' },
    { label: 'Sportsmen', key: 'sportsmen' },
];

const headersSport = [
    { label: 'Команда', key: 'school' },
    { label: 'Спортсмен', key: 'sportsmen' },
];

const headersClass = [{ label: 'Класс лодки', key: 'classBoat' }];

export default function AdminEntries() {
    // const [competitions, setCompetitions] = useState(null);
    const [select, setSelect] = useState(null);
    // const [entries, setEntries] = useState(null);
    const [choiseEntries, setChoiseEntries] = useState(null);
    // const [schools, setSchools] = useState(null);
    const [newDataCSV, setNewDataCSV] = useState(null);
    const [sportCSV, setSportCSV] = useState(null);
    const [boatClass, setBoatClass] = useState(null);
    // const [sportsmen, setSportsmen] = useState(null);
    const [akkr, setAkkr] = useState(null);
    const componentRef = useRef();
    const classes = useStyles();
    const { user } = useAuth0();

    const { data: sportsmenData } = useQuery('sportsmen', fetchSportsmen);
    const { sportsmen } = sportsmenData || {};
    const formattedSportsmen = sportsmen?.map(sportsman => ({ ...sportsman, id: sportsman._id }));

    const { data: entriesData } = useQuery('entries', fetchEntries);
    const { entries } = entriesData || {};
    // const formattedSportsmen = sportsmen?.map(sportsman => ({ ...sportsman, id: sportsman._id }));

    const { data: schoolsData } = useQuery('schools', fetchSchools);
    const { schools } = schoolsData || {};
    const formattedSchools = schools?.map(school => ({ ...school, id: school._id }));

    const { data: competitionsData } = useQuery('competitions', fetchCompetitions);
    const { competitions } = competitionsData || {};
    const formattedCompetitions = competitions?.map(competitions => ({
        ...competitions,
        id: competitions._id,
    }));
    //  wtf is that
    useEffect(() => {
        if (choiseEntries) {
            dataCSV();
            sportsmenCSV();
            classBoat();
            akkreditation();
        }
    }, [choiseEntries]);

    // useEffect(() => {
    //     // shouldn't be this many requests
    //     socket.emit('getCompetition');
    //     socket.on('competition', data => {
    //         setCompetitions(data);
    //     });
    //     socket.emit('getAdminEntries');
    //     socket.on('adminEntries', data => {
    //         data.forEach(el => (el['id'] = el['_id']));
    //         setEntries(data);
    //     });
    //     socket.emit('getAdminSchools');
    //     socket.on('adminSchools', data => {
    //         setSchools(data);
    //     });
    //     socket.emit('getAdminSportsmens');
    //     socket.on('adminSportsmens', data => {
    //         setSportsmens(data);
    //     });
    //     if (choiseEntries) {
    //         dataCSV();
    //         sportsmenCSV();
    //         classBoat();
    //         akkreditation();
    //     }
    // }, []);

    const findEntries = id => {
        competitions.forEach(el => {
            if (el._id == id) {
                const obj = el;
                const data = entries.filter(elem => elem.competitionId == id);
                data.forEach(element => {
                    const schoolId = schools.filter(elem => {
                        if (element.schoolId == elem.userId) {
                            return elem.name;
                        }
                    });
                    element['school'] = schoolId[0].name;
                    element['nameCompetition'] = obj.name;
                    element['startDate'] = obj.startDate;
                    element['endDate'] = obj.endDate;
                    element['deadLine'] = obj.deadLine;
                });
                setChoiseEntries(data);
            }
        });
    };

    const dataCSV = () => {
        const arr = [];
        choiseEntries.forEach(obj => {
            const entry = JSON.parse(obj.sportsmenList);
            Object.keys(entry).forEach(keyName => {
                entry[keyName].forEach(el => {
                    const id = sportsmen.filter(
                        elem => elem.name == el && elem.schoolId == obj.schoolId
                    );
                    if (id.length != 0) {
                        const inner = {
                            id: id[0]._id,
                            school: obj.school,
                            classBoat: keyName,
                            sportsmen: el,
                        };
                        arr.push(inner);
                    }
                });
            });
        });
        setNewDataCSV(arr);
    };

    const sportsmenCSV = () => {
        const arr = [];

        choiseEntries.forEach(obj => {
            const entry = JSON.parse(obj.sportsmenList);
            const uniq = [...new Set(Object.values(entry).flat())];
            uniq.forEach(el => {
                const inner = {
                    school: obj.school,
                    sportsmen: el,
                };
                arr.push(inner);
            });
        });
        setSportCSV(arr);
    };

    const classBoat = () => {
        const arr = [];
        const comp = competitions.filter(el => el._id == select);
        const obj = JSON.parse(comp[0].discipline);
        obj.forEach(el => {
            const inner = {
                classBoat: el,
            };
            arr.push(inner);
        });
        setBoatClass(arr);
    };

    const akkreditation = () => {
        const comp = competitions.filter(el => el._id == select);
        const newData = sportCSV;
        newData.forEach(el => (el['comp'] = comp[0].name));
        const sportsmen = newData.map(el => {
            let arr;
            sportsmen.forEach(elem => {
                if (elem.name == el.sportsmen) {
                    arr = {
                        sportsmen: el.sportsmen,
                        photo: elem.photo,
                        comp: el.comp,
                        school: el.school,
                    };
                }
            });
            return arr;
        });
        setAkkr(sportsmen);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h3" component="h4" gutterBottom>
                    Заявки
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
            <div
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                    margin: '10px',
                }}
            >
                <Typography variant="h6" component="h7" gutterBottom>
                    Выберите мероприятие
                </Typography>
                <FormControl className={classes.formControl}>
                    <InputLabel>Выберите мероприятие</InputLabel>
                    <Select
                        value={select}
                        onChange={e => {
                            setSelect(e.target.value);
                            findEntries(e.target.value);
                        }}
                    >
                        <MenuItem value="">None</MenuItem>
                        {competitions &&
                            competitions.map(el => {
                                return <MenuItem value={el._id}>{el.name}</MenuItem>;
                            })}
                    </Select>
                </FormControl>
                {newDataCSV && (
                    <CSVLink
                        data={newDataCSV}
                        headers={headersCSV}
                        className="csv-link"
                        filename="TeamClassSport.csv"
                        separator={';'}
                    >
                        Скачать Команда+Класс+Спортсмен
                    </CSVLink>
                )}
                {sportCSV && (
                    <CSVLink
                        data={sportCSV}
                        headers={headersSport}
                        className="csv-link"
                        filename="TeamSport.csv"
                        separator={';'}
                    >
                        Скачать Команда+Спортсмен
                    </CSVLink>
                )}
                {sportCSV && (
                    <CSVLink
                        data={boatClass}
                        headers={headersClass}
                        className="csv-link"
                        filename="Class.csv"
                        separator={';'}
                    >
                        Скачать Класс лодок
                    </CSVLink>
                )}
            </div>

            {akkr && (
                <div
                    style={{
                        display: 'flex',
                        flexFlow: 'column',
                        alignItems: 'center',
                        margin: '10px',
                    }}
                >
                    <ReactToPrint
                        trigger={() => (
                            <Button variant="contained" size="small" color="primary">
                                Печать аккредитаций
                            </Button>
                        )}
                        content={() => componentRef.current}
                    />
                    <div style={{ display: 'none' }}>
                        <PrintComponent data={akkr} ref={componentRef} />
                    </div>
                </div>
            )}

            {choiseEntries && (
                <div style={{ height: 500, width: '100%' }}>
                    {!newDataCSV && dataCSV()}
                    {!newDataCSV && sportsmenCSV()}
                    {!newDataCSV && classBoat()}
                    {sportCSV && !akkr && akkreditation()}
                    <DataGrid
                        rows={choiseEntries}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => {
                            window.location.assign('/entrie');
                            localStorage.setItem('entrie', JSON.stringify(e.row));
                        }}
                    />
                </div>
            )}
        </div>
    );
}
