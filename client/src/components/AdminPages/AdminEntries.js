import React, { useState, useRef, useMemo } from 'react';
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
import ReactToPrint from 'react-to-print';
import PrintComponent from 'components/PrintComponent';
import { useQuery } from 'react-query';
import { fetchCompetitions } from 'services/competition';
import { fetchSchools } from 'services/school';
import { fetchEntriesByCompetitionId } from 'services/entry';
import { fetchSportsmen } from 'services/sportsmen';
import { useHistory } from 'react-router';
import {setIndexToObject} from '../../services/utils';

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
    { field: 'index', headerName: 'ID', width: 80 },
    { field: 'competitionName', headerName: 'Название мероприятия', width: 370 },
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
    const history = useHistory();
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [newDataCSV, setNewDataCSV] = useState(null);
    const [sportCSV, setSportCSV] = useState(null);
    const [boatClass, setBoatClass] = useState(null);
    const [akkr, setAkkr] = useState(null);
    const componentRef = useRef();
    const classes = useStyles();

    const { data: sportsmenData } = useQuery('sportsmen', fetchSportsmen);
    const { sportsmen } = sportsmenData || {};

    const { data: schoolsData } = useQuery('schools', fetchSchools);

    const { data: competitionsData } = useQuery('competitions', fetchCompetitions);
    const { competitions } = competitionsData || {};

    const { data: entriesData } = useQuery(
        ['entries', selectedCompetition],
        () => fetchEntriesByCompetitionId(selectedCompetition),
        {
            enabled: !!selectedCompetition,
        }
    );
    const { entries } = entriesData || {};
    const formattedEntries = useMemo(
        () => entries?.map(entry => ({ ...entry, id: entry._id} || [])),
        [entries]
    );

    const tableRows = useMemo(() => {
        const competition = competitions?.find(comp => comp._id === selectedCompetition) || {};

        return (
            formattedEntries?.map((entry, index) => {
                const transformedValue = {
                    id: entry._id,
                    competitionName: competition.name,
                    school: schoolsData?.find(school => school.userId === entry.schoolId)?.name || '-',
                    deadLine: competition.deadLine,
                    dateSend: entry.dateSend,
                }
                return setIndexToObject(transformedValue, index)
            }) || []
        );
    }, [formattedEntries, competitions, schoolsData]);

    // const formattedSportsmen = sportsmen?.map(sportsman => ({ ...sportsman, id: sportsman._id }));

    //  wtf is that
    // useEffect(() => {
    //     if (selectedCompetition && formattedEntries.length) {
    //         dataCSV();
    //         sportsmenCSV();
    //         classBoat();
    //         akkreditation();
    //     }
    // }, [selectedCompetition]);

    const dataCSV = () => {
        const arr = [];
        formattedEntries.forEach(obj => {
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

        formattedEntries.forEach(obj => {
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
        const comp = competitions.filter(el => el._id === selectedCompetition);
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
        const comp = competitions.filter(el => el._id === selectedCompetition);
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
                        value={selectedCompetition}
                        onChange={e => {
                            setSelectedCompetition(e.target.value);
                            // findEntries(e.target.value);
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

            {tableRows && (
                <div style={{ height: 500, width: '100%' }}>
                    {/* {!newDataCSV && dataCSV()}
                    {!newDataCSV && sportsmenCSV()}
                    {!newDataCSV && classBoat()}
                    {sportCSV && !akkr && akkreditation()} */}

                    <DataGrid
                        rows={tableRows}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => {
                            history.push(`/entry/${e.row.id}`);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
