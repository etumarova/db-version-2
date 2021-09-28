import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDropzone } from 'react-dropzone';
import { Image } from 'cloudinary-react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { DataGrid } from '@material-ui/data-grid';
import { useMutation, useQuery } from 'react-query';
import { fetchSportsmenBySchoolId, saveSportsman, editSportsman } from 'services/sportsmen';
import { useHistory } from 'react-router-dom';
import { queryClient } from 'features/queryClient';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '35ch',
        marginBottom: '20px',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function CreateSportsmen() {
    const history = useHistory();
    const [foto, setFoto] = useState(null);
    const [name, setName] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [adress, setAdress] = useState(null);
    const [telephone, setTelephone] = useState(null);
    const [fTraner, setFTraner] = useState(null);
    const [nowTraner, setNowTraner] = useState(null);
    const [school, setSchool] = useState(null);
    const [result, setResult] = useState({});
    const [listResults, setListResults] = useState([]);
    const [traners, setTraners] = useState(null);
    const [rowTable, setRowTabel] = useState([]);
    const classes = useStyles();
    const [sportsmen, setSportsmen] = useState({});

    const saveSportsmanMutation = useMutation(saveSportsman, {
        onSuccess: () => {
            queryClient.invalidateQueries('sportsmen');
            history.push('/mySportsmens');
        },
        onError: error => console.log(error),
    });
    const editSportsmanMutation = useMutation(editSportsman, {
        onSuccess: () => {
            queryClient.invalidateQueries('sportsmen');
            history.push('/mySportsmens');
        },
        onError: error => console.log(error),
    });

    const setSportsmanData = data => {
        setSportsmen(data);
        setFoto(data.foto);
        setListResults(JSON.parse(data.listResults));
        setName(data.name);
        setBirthday(data.birthday);
        setAdress(data.adress);
        setTelephone(data.telephone);
        setFTraner(data.fTraner);
        setNowTraner(data.nowTraner);
        setSchool(data.school);
    };

    // const { data } = useQuery(['sportsmen', user?.sub], () => fetchSportsmenBySchoolId(user?.sub));
    // const { sportsmen } = data || {};

    // useEffect(() => {
    //     // setSportsmanData();
    // }, [sportsmen])

    // useEffect(() => {
    //     socket.emit('getAdminTraners');
    //     socket.on('adminTraners', data => {
    //         data.forEach(el => (el['id'] = el['_id']));
    //         setTraners(data);
    //     });
    //     try {
    //         const editSportsmen = localStorage.getItem('sportsmen');
    //         if (editSportsmen) {
    //             const data = JSON.parse(editSportsmen);
    //             setSportsmen(data);
    //             setFoto(data.foto);
    //             setListResults(JSON.parse(data.listResults));
    //             setName(data.name);
    //             setBirthday(data.birthday);
    //             setAdress(data.adress);
    //             setTelephone(data.telephone);
    //             setFTraner(data.fTraner);
    //             setNowTraner(data.nowTraner);
    //             setSchool(data.school);
    //             localStorage.clear();
    //             row(JSON.parse(data.listResults));
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }, []);

    const onDrop = async acceptedFiles => {
        const url = `https://api.cloudinary.com/v1_1/dgeev9d6l/image/upload`;
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        formData.append('upload_preset', 'nllbt9qq');
        const response = await fetch(url, {
            method: 'post',
            body: formData,
        });
        const data = await response.json();
        setFoto(data.public_id);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accepts: 'image/*',
        multiple: false,
    });

    const saveData = e => {
        e.preventDefault();
        const data = {
            idSchool: localStorage.getItem('user'),
            foto: foto,
            name: name,
            birthday: birthday,
            fTraner: fTraner,
            nowTraner: nowTraner,
            school: school,
            adress: adress,
            telephone: telephone,
            listResults: JSON.stringify(listResults),
        };
        // socket.emit('addSportsmen', data);
        saveSportsmanMutation.mutate(data);
    };

    const editData = e => {
        e.preventDefault();
        const data = {
            _id: sportsmen._id,
            idSchool: localStorage.getItem('user'),
            foto: foto,
            name: name,
            birthday: birthday,
            fTraner: fTraner,
            nowTraner: nowTraner,
            school: school,
            adress: adress,
            telephone: telephone,
            listResults: JSON.stringify(listResults),
        };
        editSportsmanMutation.mutate(data);
        // socket.emit('editSportsmen', data);
    };

    const addResult = e => {
        e.preventDefault();
        if (result?.competition?.length !== 0) {
            setListResults([...listResults, result]);
            setResult({});
            row([...listResults, result]);
        }
    };

    const headers = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'competition', headerName: 'Наименование соревнования', width: 400 },
        { field: 'discipline', headerName: 'Класс лодки', width: 150 },
        { field: 'place', headerName: 'Место', width: 150 },
    ];

    const row = (list = listResults) => {
        const arr = list;
        arr.forEach((el, idx) => (el['id'] = idx + 1));
        setRowTabel(arr);
    };

    const deleteCeill = rowData => {
        // eslint-disable-next-line no-restricted-globals
        const answer = confirm(
            `Удалить результат: ${rowData.competition}, Класс -${rowData.discepline}, Место - ${rowData.place} ?`
        );
        if (answer) {
            const newList = listResults;
            newList.splice(rowData.id - 1, 1);
            setListResults(newList);
            row(newList);
        }
    };

    return (
        <div className={classes.root}>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : null}`}>
                <input {...getInputProps()} />
                {isDragActive ? <p>Вот прямо сюда!</p> : <p>Бросьте фото спортсмена сюда</p>}
            </div>
            <div>
                {foto != '' && (
                    <Image cloud_name="dgeev9d6l" publicId={foto} width="50" crop="scale" />
                )}
            </div>
            <div>
                <TextField
                    id="standard-full-width"
                    label="ФИО спортсмена"
                    style={{ margin: 8 }}
                    placeholder="Введите ФИО спортсмена"
                    fullWidth
                    defaultValue={sportsmen.name}
                    onChange={e => setName(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="date"
                    label="Дата рождения"
                    type="date"
                    className={classes.textField}
                    defaultValue={sportsmen.birthday}
                    onChange={e => setBirthday(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Контактный номер телефона"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    defaultValue={sportsmen.telephone}
                    placeholder="Введите номер телефона"
                    variant="outlined"
                    onChange={e => setTelephone(e.target.value)}
                />
                <TextField
                    label="Адрес прописки"
                    id="margin-none"
                    style={{ margin: 8 }}
                    placeholder="Введите адрес прописки"
                    defaultValue={sportsmen.adress}
                    fullWidth
                    onChange={e => setAdress(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            <div>
                <TextField
                    label="Первый тренер"
                    id="outlined-margin-none"
                    className={classes.textField}
                    placeholder="Введите ФИО первого тренера"
                    defaultValue={sportsmen.fTraner}
                    variant="outlined"
                    onChange={e => setFTraner(e.target.value)}
                />

                <FormControl className={classes.formControl}>
                    <InputLabel>Личный тренер</InputLabel>
                    <Select value={nowTraner} onChange={e => setNowTraner(e.target.value)}>
                        <MenuItem value="">None</MenuItem>
                        {traners &&
                            traners.map(el => {
                                return <MenuItem value={el.name}>{el.name}</MenuItem>;
                            })}
                    </Select>
                </FormControl>

                <TextField
                    label="Принадлежность"
                    className={classes.textField}
                    defaultValue={sportsmen.school}
                    placeholder="Введите спортивный клуб"
                    variant="outlined"
                    onChange={e => setSchool(e.target.value)}
                />
            </div>
            <div>
                <div>
                    <TextField
                        label="Наименование соревнования"
                        className={classes.textField}
                        placeholder="Введите наименование соревнования"
                        variant="outlined"
                        onChange={e => {
                            setResult({
                                ...result,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'competition',
                        }}
                    />
                    <TextField
                        label="Дисциплина"
                        className={classes.textField}
                        placeholder="Введите дисциплину"
                        variant="outlined"
                        onChange={e => {
                            setResult({
                                ...result,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'discipline',
                        }}
                    />
                    <TextField
                        label="Место"
                        className={classes.textField}
                        placeholder="Введите место"
                        variant="outlined"
                        onChange={e => {
                            setResult({
                                ...result,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'place',
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={addResult}>
                        Добавить результат
                    </Button>
                </div>

                <Typography variant="h5" component="h6" gutterBottom>
                    Результаты выступления на соревнованиях
                </Typography>

                <div style={{ height: 450, width: '100%' }}>
                    <DataGrid
                        rows={rowTable}
                        columns={headers}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => deleteCeill(e.row)}
                    />
                </div>

                {!sportsmen.name && (
                    <Button variant="contained" color="primary" onClick={saveData}>
                        Сохранить
                    </Button>
                )}

                {sportsmen.name && (
                    <Button variant="contained" color="primary" onClick={editData}>
                        Редактировать
                    </Button>
                )}
            </div>
        </div>
    );
}
