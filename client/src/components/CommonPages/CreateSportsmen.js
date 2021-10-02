import React, { useState, useEffect, useContext } from 'react';
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
import { fetchSportsmanById, saveSportsman, editSportsman } from 'services/sportsmen';
import { useHistory, useParams } from 'react-router-dom';
import { queryClient } from 'features/queryClient';
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext } from 'context/UserContext';
import { fetchTrainersBySchoolId } from 'services/trainer';

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
    const { id } = useParams();

    const history = useHistory();
    const [photo, setPhoto] = useState(null);
    const [name, setName] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [address, setAddress] = useState(null);
    const [telephone, setTelephone] = useState(null);
    const [fTraner, setFTraner] = useState(null);
    const [nowTraner, setNowTraner] = useState(null);
    const [school, setSchool] = useState(null);
    const [result, setResult] = useState({});
    const [listResults, setListResults] = useState([]);
    const [nowTrainer, setNowTrainer] = useState(null);
    const [rowTable, setRowTabel] = useState([]);
    const classes = useStyles();

    const { userSub } = useContext(UserContext);

    const shouldFetch = !!id;
    const { data: sportsmanData } = useQuery(['sportsmen', id], () => fetchSportsmanById(id), {
        enabled: shouldFetch,
    });
    const { sportsman } = sportsmanData || {};
    const { data: trainerData } = useQuery(
        ['trainers', ''],
        () => fetchTrainersBySchoolId(sportsman.schoolId),
        {
            enabled: !!sportsman.schoolId,
        }
    );
    const { trainers } = trainerData || {};
    const saveSportsmanMutation = useMutation(saveSportsman, {
        onSuccess: () => {
            queryClient.invalidateQueries('sportsmen');
            history.goBack();
        },
        onError: error => console.log(error),
    });
    const editSportsmanMutation = useMutation(editSportsman, {
        onSuccess: () => {
            queryClient.invalidateQueries('sportsmen');
            history.goBack();
        },
        onError: error => console.log(error),
    });

    useEffect(() => {
        if (sportsman) {
            // setSportsmen(data);
            setPhoto(sportsman.photo);
            setListResults(JSON.parse(sportsman.listResults));
            setName(sportsman.name);
            setBirthday(sportsman.birthday);
            setAddress(sportsman.address);
            setTelephone(sportsman.telephone);
            setFTraner(sportsman.fTraner);
            setNowTraner(sportsman.nowTraner);
            setSchool(sportsman.school);
            setNowTrainer(sportsman.nowTrainer);
        }
    }, [sportsman]);

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
        setPhoto(data.public_id);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accepts: 'image/*',
        multiple: false,
    });

    const saveData = e => {
        e.preventDefault();
        const data = {
            schoolId: userSub,
            photo: photo,
            name: name,
            birthday: birthday,
            fTraner: fTraner,
            nowTraner: nowTraner,
            school: school,
            address,
            telephone: telephone,
            listResults: JSON.stringify(listResults),
        };
        saveSportsmanMutation.mutate(data);
    };

    const editData = e => {
        e.preventDefault();
        const data = {
            _id: sportsman._id,
            schoolId: sportsman.schoolId, // I should not have to specify parameters i don't want to update
            photo,
            name,
            birthday,
            fTraner,
            nowTraner,
            school,
            address,
            telephone,
            listResults: JSON.stringify(listResults),
        };
        editSportsmanMutation.mutate(data);
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
            `Удалить результат: ${rowData.competition}, Класс -${rowData.discipline}, Место - ${rowData.place} ?`
        );
        if (answer) {
            const newList = listResults;
            newList.splice(rowData.id - 1, 1);
            setListResults(newList);
            row(newList);
        }
    };

    return (
        <div className={classes.root} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : null}`}>
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Вот прямо сюда!</p> : <p>Бросьте фото спортсмена сюда</p>}
                </div>
                <div>
                    {photo && (
                        <Image
                            style={{ maxHeight: '8rem' }}
                            cloud_name="dgeev9d6l"
                            publicId={photo}
                            crop="scale"
                        />
                    )}
                </div>
            </div>

            <div>
                <TextField
                    id="standard-full-width"
                    label="ФИО спортсмена"
                    style={{ margin: 8 }}
                    placeholder="Введите ФИО спортсмена"
                    fullWidth
                    value={name}
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
                    value={birthday}
                    onChange={e => setBirthday(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Контактный номер телефона"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={telephone}
                    placeholder="Введите номер телефона"
                    variant="outlined"
                    onChange={e => setTelephone(e.target.value)}
                />
                <TextField
                    label="Адрес прописки"
                    id="margin-none"
                    style={{ margin: 8 }}
                    placeholder="Введите адрес прописки"
                    value={address}
                    fullWidth
                    onChange={e => setAddress(e.target.value)}
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
                    value={fTraner}
                    variant="outlined"
                    onChange={e => setFTraner(e.target.value)}
                />

                <FormControl className={classes.formControl}>
                    <InputLabel>Личный тренер</InputLabel>
                    <Select value={nowTraner} onChange={e => setNowTraner(e.target.value)}>
                        <MenuItem value="">None</MenuItem>
                        {trainers &&
                            trainers.map(trainer => {
                                return <MenuItem value={trainer.name}>{trainer.name}</MenuItem>;
                            })}
                    </Select>
                </FormControl>

                <TextField
                    label="Принадлежность"
                    className={classes.textField}
                    value={school}
                    placeholder="Введите спортивный клуб"
                    variant="outlined"
                    onChange={e => setSchool(e.target.value)}
                />
            </div>

            <hr />
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

                {!sportsman && (
                    <Button variant="contained" color="primary" onClick={saveData}>
                        Сохранить
                    </Button>
                )}

                {sportsman && (
                    <Button variant="contained" color="primary" onClick={editData}>
                        Редактировать
                    </Button>
                )}
            </div>
        </div>
    );
}
