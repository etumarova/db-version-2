import { Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { DataGrid } from '@material-ui/data-grid';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchCompetitions } from 'services/competition';
import { useQuery } from 'react-query';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 400,
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

export default function CreateEntries() {
    const classes = useStyles();
    const [sportsmens, setSportsmens] = useState([]);
    // const [competitions, setCompetitions] = useState(null);
    const [traners, setTraners] = useState(null);
    const [selectCompetition, setSelectCompetition] = useState(null);
    const [selectTraner, setSelectTraner] = useState(null);
    const [selectSportsmens, setSelectSportsmens] = useState({});
    const [discepline, setDiscepline] = useState([]);
    const [selectDiscepline, setSelectDiscepline] = useState(null);
    const [choiseSportsmen, setChoiseSportsmen] = useState(null);
    const [entrie, setEntrie] = useState({});
    const [self, setSelf] = useState(false);
    const [headersTabel, setHeadersTabel] = useState([]);
    const [rowTabel, setRowTabel] = useState([]);
    const today = Date.now();
    const { user, isAuthenticated } = useAuth0();

    const { data: competitionsData } = useQuery('competitions', fetchCompetitions);
    const { competitions } = competitionsData || {};

    useEffect(() => {
        (async () => {
            if (user?.sub) {
                try {
                    // const competitionsResponse = fetch('/competitions');
                    // const { competitions } = await competitionsResponse.json();

                    const sportsmenResponse = fetch(`/sportsmen/${user.sub}`);
                    const { sportsmen } = await sportsmenResponse.json();

                    const trainersResponse = fetch(`/trainers/${user.sub}`);
                    const { trainers } = await trainersResponse.json();

                    // if (competitions) {
                    //     setCompetitions(competitions);
                    // }

                    if (sportsmen) {
                        setSportsmens(sportsmen);
                    }

                    if (trainers) {
                        setTraners(trainers);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })();

        // socket.emit('getCompetition');
        // socket.on('competition', (data)=>{
        //     setCompetitions(data);
        // })
        // socket.emit('getSportsmens', { idSchool : localStorage.getItem('user')});
        // socket.on('sportsmens', (data) => {
        //     setSportsmens(data);
        // })
        // socket.emit('getTraners', { idSchool : localStorage.getItem('user')});
        // socket.on('traners', (data) => {
        //     setTraners(data);
        // })
        // try {
        //     const editEntrie = localStorage.getItem('entrie');
        //     if(editEntrie) {
        //       const data = JSON.parse(editEntrie);
        //       setEntrie(data);
        //       setSelectCompetition(data.idCompetition);
        //       setDiscepline(JSON.parse(data.discepline));
        //       setSelectSportsmens(JSON.parse(data.sportsmensList));
        //       setSelectTraner(data.traner)
        //       headers();
        //       row();
        //     }
        //     localStorage.clear();
        // } catch(e) {
        //     console.log(e);
        // }
    }, [user?.sub]);

    const headers = () => {
        const arr = [{ field: 'id', headerName: 'ID', width: 80 }];
        discepline.forEach(el => {
            arr.push({
                field: el,
                headerName: el,
                width: 370,
            });
        });
        setHeadersTabel(arr);
    };

    const row = () => {
        let length = 0;
        const arr = [];
        const copy = selectSportsmens;
        Object.values(copy).forEach(el =>
            el.length > length ? (length = el.length) : (length = length)
        );
        for (let i = 0; i < length; i++) {
            const obj = { id: i + 1 };
            discepline.forEach(el => (obj[el] = ''));
            Object.keys(copy).forEach(keyName => {
                if (copy[keyName][i]) {
                    obj[keyName] = copy[keyName][i];
                }
            });
            arr.push(obj);
        }
        setRowTabel(arr);
    };

    const makeDiscepline = id => {
        const competition = competitions.filter(el => el._id == id);
        setDiscepline(JSON.parse(competition[0].discepline));
        JSON.parse(competition[0].discepline).forEach(e => {
            selectSportsmens[e] = [];
        });
        setSelectSportsmens(selectSportsmens);
    };

    const sendData = e => {
        e.preventDefault();
        const telephone = traners.filter(el => el.name == selectTraner);
        if (selectDiscepline && selectSportsmens && selectTraner && selectCompetition) {
            const today = new Date();
            const data = {
                idCompetition: selectCompetition,
                idSchool: localStorage.getItem('user'),
                traner: selectTraner,
                telephone: telephone[0].telephone,
                dateSend: today.toUTCString(),
                sportsmensList: JSON.stringify(selectSportsmens),
            };
            // socket.emit('addEntries', data);
        } else {
            alert('Не введены данные!');
        }
    };

    const editData = e => {
        e.preventDefault();
        const telephone = traners.filter(el => el.name == selectTraner);
        const today = new Date();
        const data = {
            _id: entrie._id,
            idCompetition: selectCompetition,
            idSchool: localStorage.getItem('user'),
            traner: selectTraner,
            telephone: telephone[0].telephone,
            dateSend: today.toUTCString(),
            sportsmensList: JSON.stringify(selectSportsmens),
        };
        // socket.emit('editEntries', data);
    };

    const deleteCeill = e => {
        // eslint-disable-next-line no-restricted-globals
        const answer = confirm(`Удалить пользователя ${e.value}  в классе ${e.field}?`);
        if (answer) {
            const data = selectSportsmens;
            const newList = data[e.field].filter(el => el != e.value);
            data[e.field] = newList;
            setSelectSportsmens(data);
            row();
        }
    };

    const validCompetitions = competitions?.filter(comp => new Date(comp.deadLine) < new Date());

    return (
        <div>
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
                        value={selectCompetition}
                        onChange={e => {
                            makeDiscepline(e.target.value);
                            setSelectCompetition(e.target.value);
                        }}
                    >
                        <MenuItem value="">None</MenuItem>
                        {validCompetitions &&
                            validCompetitions.map(el => (
                                <MenuItem value={el._id}>{el.name}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </div>
            {selectCompetition && (
                <div
                    style={{
                        display: 'flex',
                        flexFlow: 'column',
                        alignItems: 'center',
                        margin: '10px',
                    }}
                >
                    <Typography variant="h6" component="h7" gutterBottom>
                        Выберите руководителя делигации
                    </Typography>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Выберите руководителя делигации</InputLabel>
                        <Select
                            value={selectTraner}
                            onChange={e => {
                                setSelectTraner(e.target.value);
                                makeDiscepline(selectCompetition);
                                headers();
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {traners &&
                                traners.map(el => {
                                    return <MenuItem value={el.name}>{el.name}</MenuItem>;
                                })}
                        </Select>
                    </FormControl>
                </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'start' }}>
                {selectTraner && (
                    <div
                        style={{
                            display: 'flex',
                            flexFlow: 'column',
                            alignItems: 'center',
                            margin: '10px',
                        }}
                    >
                        <Typography variant="h6" component="h7" gutterBottom>
                            Выберите класс лодки
                        </Typography>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Выберите класс лодки</InputLabel>
                            <Select
                                value={selectDiscepline}
                                onChange={e => setSelectDiscepline(e.target.value)}
                            >
                                <MenuItem value="">None</MenuItem>
                                {discepline.map(el => {
                                    return <MenuItem value={el}>{el}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </div>
                )}
                {selectTraner && (
                    <div
                        style={{
                            display: 'flex',
                            flexFlow: 'column',
                            alignItems: 'center',
                            margin: '10px',
                        }}
                    >
                        <Typography variant="h6" component="h7" gutterBottom>
                            Выберите спортсмена
                        </Typography>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                            <FormControl className={classes.formControl}>
                                <InputLabel>Выберите спортсмена</InputLabel>
                                <Select onChange={e => setChoiseSportsmen(e.target.value)}>
                                    <MenuItem value="">None</MenuItem>
                                    {sportsmens.map(el => {
                                        return <MenuItem value={el.name}>{el.name}</MenuItem>;
                                    })}
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={self}
                                        onChange={e => setSelf(e.target.checked)}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="Лично"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={e => {
                                    e.preventDefault();
                                    if (selectDiscepline && choiseSportsmen) {
                                        let nameSportsmen;
                                        self
                                            ? (nameSportsmen = choiseSportsmen + ' (Л)')
                                            : (nameSportsmen = choiseSportsmen);
                                        selectSportsmens[selectDiscepline] = [
                                            ...selectSportsmens[selectDiscepline],
                                            nameSportsmen,
                                        ];
                                        setSelectSportsmens(prev => (prev = selectSportsmens));
                                        setChoiseSportsmen('');
                                        row();
                                    }
                                }}
                            >
                                Добавить
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={rowTabel}
                    columns={headersTabel}
                    pageSize={15}
                    className="table-style"
                    onCellClick={e => deleteCeill(e)}
                />
            </div>
            {selectDiscepline && !entrie.traner && (
                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <Button variant="contained" color="primary" onClick={sendData}>
                        Отправить заявку
                    </Button>
                </div>
            )}
            {entrie.traner && (
                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <Button variant="contained" color="primary" onClick={editData}>
                        Редактировать заявку
                    </Button>
                </div>
            )}
        </div>
    );
}
