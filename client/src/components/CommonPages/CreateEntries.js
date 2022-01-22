import { Typography } from '@material-ui/core';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { DataGrid } from '@material-ui/data-grid';
import { fetchCompetitions } from 'services/competition';
import { useQuery, useMutation } from 'react-query';
import { UserContext } from 'context/UserContext';
import { fetchTrainersBySchoolId } from 'services/trainer';
import { fetchSportsmenBySchoolId } from 'services/sportsmen';
import { fetchEntryById, saveEntry, editEntry } from 'services/entry';
import { useParams, useHistory } from 'react-router';
import { queryClient } from 'features/queryClient';

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
    const history = useHistory();
    const { id } = useParams();
    const classes = useStyles();
    const [selectedSportsmen, setSelectedSportsmen] = useState([]);

    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [selectTrainer, setSelectTrainer] = useState(null);
    const [selectSportsmen, setSelectSportsmen] = useState({});
    const [discipline, setDiscipline] = useState([]);
    const [selectDiscepline, setSelectDiscepline] = useState(null);
    const [choiseSportsmen, setChoiseSportsmen] = useState(null);
    const [self, setSelf] = useState(false);
    const [rowTabel, setRowTabel] = useState([]);
    const { userSub } = useContext(UserContext);

    const { data: competitionsData } = useQuery('competitions', fetchCompetitions);
    const { competitions } = competitionsData || {};

    const shouldFetchEntry = !!id;
    const { data: entryData } = useQuery(['entries', id], () => fetchEntryById(id), {
        enabled: shouldFetchEntry,
    });
    const { entry } = entryData || {};
    const saveEntryMutation = useMutation(saveEntry, {
        onSuccess: () => {
            queryClient.invalidateQueries('entries');
            history.goBack();
        },
        onError: error => console.log(error),
    });
    const editEntryMutation = useMutation(editEntry, {
        onSuccess: () => {
            queryClient.invalidateQueries('entries');
            history.goBack();
        },
        onError: error => console.log(error),
    });

    const schoolId = id ? entry?.schoolId : userSub;
    const { data: sportsmenData } = useQuery(
        ['sportsmen', schoolId],
        () => fetchSportsmenBySchoolId(schoolId),
        { enabled: !!schoolId }
    );
    const { sportsmen } = sportsmenData || {};

    const { data: trainersData } = useQuery(
        ['trainers', schoolId],
        () => fetchTrainersBySchoolId(schoolId),
        { enabled: !!schoolId }
    );
    const { trainers } = trainersData || {};

    const headersTabel = useMemo(() => {
        const arr = [{ field: 'id', headerName: 'ID', width: 95 }];
        discipline.forEach(el => {
            arr.push({
                field: el,
                headerName: el,
                width: 370,
            });
        });

        return arr;
        // setHeadersTabel(arr);
    }, [discipline]);

    useEffect(() => {
        if (entry) {
            setSelectedCompetition(entry.competitionId);
            setSelectTrainer(entry.trainer);
            if (entry.sportsmenList) setSelectedSportsmen(JSON.parse(entry.sportsmenList));
        }
    }, [entry]);

    // build headers with discipline ?
    // const headers = () => {

    // };

    const createRows = () => {
        const arr = [];

        for (let i = 0; i < selectedSportsmen.length; i++) {
            const sportsman = selectedSportsmen[i];
            const obj = { id: i + 1 };
            discipline.forEach(el => (obj[el] = ''));

            obj[sportsman.discipline] = sportsman.name;

            obj.userId = sportsman.id;
            arr.push(obj);
        }
        setRowTabel(arr);
    };

    useEffect(() => {
        if (selectedSportsmen.length) createRows();
    }, [selectedSportsmen]);

    useEffect(() => {
        const competition = competitions?.find(comp => comp._id === selectedCompetition);
        const getDisceplines = () => {
            const disciplines = JSON.parse(competition.discipline);
            setDiscipline(disciplines);

            if (Array.isArray(selectSportsmen)) {
                const newSportsmen = [...selectSportsmen];

                disciplines.forEach(e => {
                    newSportsmen[e] = [];
                });
                setSelectSportsmen(newSportsmen);
            }
        };

        if (competition?.discipline) getDisceplines();
    }, [selectedCompetition, selectSportsmen, competitions, selectTrainer]);

    const sendData = e => {
        e.preventDefault();
        const telephone = trainers.find(el => el.name === selectTrainer)?.telephone || '-';
        if (selectDiscepline && selectSportsmen && selectTrainer && selectedCompetition) {
            const today = new Date();
            const data = {
                competitionId: selectedCompetition,
                schoolId: userSub,
                trainer: selectTrainer,
                telephone: telephone,
                dateSend: today.toUTCString(),
                sportsmenList: JSON.stringify(selectedSportsmen),
            };
            // socket.emit('addEntries', data);
            saveEntryMutation.mutate(data);
        } else {
            alert('Не введены данные!');
        }
    };

    const editData = e => {
        e.preventDefault();
        const telephone = trainers.find(el => el.name === selectTrainer)?.telephone;
        const today = new Date();
        const data = {
            _id: entry._id,
            competitionId: selectedCompetition,
            schoolId: entry.schoolId,
            trainer: selectTrainer,
            telephone: telephone || entry.telephone,
            dateSend: today.toUTCString(),
            sportsmenList: JSON.stringify(selectedSportsmen),
        };
        editEntryMutation.mutate(data);
    };

    const deleteCeill = e => {
        // eslint-disable-next-line no-restricted-globals
        const answer = confirm(`Удалить пользователя ${e.value}  в классе ${e.field}?`);
        if (answer) {
            const userId = e.row.userId;

            setSelectedSportsmen(selectedSportsmen =>
                selectedSportsmen.filter(sportsman => sportsman.id !== userId)
            );
        }
    };

    const validCompetitions = competitions?.filter(
        comp => !comp.deadLine || new Date(comp.deadLine) > new Date()
    );

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
                    <InputLabel shrink={!!selectedCompetition}>Выберите мероприятие</InputLabel>
                    <Select
                        value={selectedCompetition}
                        onChange={e => {
                            setSelectedCompetition(e.target.value);
                            // makeDiscepline(e.target.value);
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
            {selectedCompetition && (
                <div
                    style={{
                        display: 'flex',
                        flexFlow: 'column',
                        alignItems: 'center',
                        margin: '10px',
                    }}
                >
                    <Typography variant="h6" component="h7" gutterBottom>
                        Выберите руководителя делегации
                    </Typography>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Руководитель организации</InputLabel>
                        <Select
                            value={selectTrainer}
                            onChange={e => {
                                setSelectTrainer(e.target.value);
                                // makeDiscepline(selectCompetition);
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {trainers?.map(trainer => {
                                return <MenuItem value={trainer._id}>{trainer.name}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'start' }}>
                {selectTrainer && (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                flexFlow: 'column',
                                alignItems: 'center',
                                margin: '10px',
                            }}
                        >
                            <Typography variant="h6" component="h7" gutterBottom>
                                Выберите дисциплину
                            </Typography>
                            <FormControl className={classes.formControl}>
                                <InputLabel>Дисциплина</InputLabel>
                                <Select
                                    value={selectDiscepline}
                                    onChange={e => setSelectDiscepline(e.target.value)}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {discipline.map(el => {
                                        return <MenuItem value={el}>{el}</MenuItem>;
                                    })}
                                </Select>
                            </FormControl>
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
                                Выберите спортсмена
                            </Typography>
                            <div
                                style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
                            >
                                <FormControl className={classes.formControl}>
                                    <InputLabel>Выберите спортсмена</InputLabel>
                                    <Select
                                        value={choiseSportsmen}
                                        onChange={e => setChoiseSportsmen(e.target.value)}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        {sportsmen?.map(sportsman => {
                                            return (
                                                <MenuItem value={sportsman._id}>
                                                    {sportsman.name}
                                                </MenuItem>
                                            );
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
                                            setSelectedSportsmen(selectedSportsmen => {
                                                const restOfSportsmen = [
                                                    ...selectedSportsmen.filter(
                                                        sportsman =>
                                                            sportsman._id !== choiseSportsmen
                                                    ),
                                                ];

                                                return [
                                                    ...restOfSportsmen,
                                                    {
                                                        id: choiseSportsmen,
                                                        discipline: selectDiscepline,
                                                        name:
                                                            sportsmen.find(
                                                                sportsman =>
                                                                    sportsman._id ===
                                                                    choiseSportsmen
                                                            )?.name || '',
                                                    },
                                                ];
                                            });
                                        }
                                    }}
                                >
                                    Добавить
                                </Button>
                            </div>
                        </div>
                    </>
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

            {id ? (
                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <Button variant="contained" color="primary" onClick={editData}>
                        Редактировать заявку
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <Button variant="contained" color="primary" onClick={sendData}>
                        Отправить заявку
                    </Button>
                </div>
            )}
        </div>
    );
}
