import React, {useState, useEffect, useContext, useCallback} from 'react';
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
import { UserContext } from 'context/UserContext';
import { fetchTrainersBySchoolId } from 'services/trainer';
import {fetchSchools} from '../../services/school';

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

const headers = [
    { field: 'id', headerName: 'ID', width: 95 },
    { field: 'competition', headerName: 'Наименование соревнования', width: 400 },
    { field: 'date', headerName: 'Дата', width: 150 },
    { field: 'place', headerName: 'Место проведения', width: 200 },
    { field: 'competitionResult', headerName: 'Результат', width: 150 },
];

export default function CreateSportsmen() {
    const { id } = useParams();

    const history = useHistory();
    const [photo, setPhoto] = useState(null);
    const [name, setName] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [address, setAddress] = useState(null);
    const [telephone, setTelephone] = useState(null);
    const [nowTrainer, setNowTrainer] = useState(null);
    const [fTrainer, setFTrainer] = useState(null);
    const [placeStudy, setPlaceStudy] = useState(null);
    const [enrolmentDate, setEnrolmentDate] = useState(null);
    const [education, setEducation] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [selectedSchoolId, setSelectedSchoolId] = useState(null);
    const [result, setResult] = useState({ competition: '', date: '', place: '', competitionResult: '' });
    const [listResults, setListResults] = useState([]);
    const [resultRows, setResultRows] = useState([]);
    const [unenrolmentDate, setUnenrolmentDate] = useState(null);
    const [causeUnenrolment, setCauseUnenrolment] = useState(null);
    const [anthropometricData, setAnthropometricData] = useState(null);
    const [mum, setMum] = useState(null);
    const [mumPhone, setMumPhone] = useState(null);
    const [dad, setDad] = useState(null);
    const [dadPhone, setDadPhone] = useState(null);
    const [livingAddress, setLivingAddress] = useState(null);
    const classes = useStyles();

    const { userSub, isAdmin } = useContext(UserContext);

    const [isImageLoading, setIsImageLoading] = useState(false);

    const shouldFetch = !!id;
    const { data: sportsmanData } = useQuery(['sportsmen', id], () => fetchSportsmanById(id), {
        enabled: shouldFetch,
    });
    const { data: schoolsData } = useQuery('schools', fetchSchools);
    const { sportsman } = sportsmanData || {};
    const schoolId = !isAdmin && (sportsman?.schoolId || userSub);
    const { data: trainerData } = useQuery(
        ['trainers', userSub],
        () => fetchTrainersBySchoolId(userSub),
        {
            enabled: !!schoolId && selectedSchoolId === userSub,   // disabling useQuery when change sportman's school
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

    const onSchoolChange = useCallback((e) => {
        setSelectedSchoolId(e.target.value);
        if (userSub !== e.target.value) {
            setNowTrainer(null);
        }
    }, [setNowTrainer, setSelectedSchoolId, userSub]);

    useEffect(() => {
        if (sportsman) {
            setPhoto(sportsman.photo);
            setListResults(JSON.parse(sportsman.listResults));
            setName(sportsman.name);
            setBirthday(sportsman.birthday);
            setAddress(sportsman.address);
            setTelephone(sportsman.telephone);
            setFTrainer(sportsman.fTrainer);
            setEnrolmentDate(sportsman.enrolmentDate);
            setUnenrolmentDate(sportsman.unenrolmentDate);
            setCauseUnenrolment(sportsman.causeUnenrolment);
            setPlaceStudy(sportsman.placeStudy);
            setNowTrainer(sportsman.nowTrainer?._id || sportsman.nowTrainer);
            setAnthropometricData(sportsman.anthropometricData);
            setMum(sportsman.mum);
            setMumPhone(sportsman.mumPhone);
            setDad(sportsman.dad);
            setDadPhone(sportsman.dadPhone);
            setLivingAddress(sportsman.livingAddress);
            setSelectedSchoolId(sportsman.schoolId);
            setEducation(sportsman.education);
            setSchedule(sportsman.schedule);
        }
    }, [sportsman]);

    const onDrop = async acceptedFiles => {
        setIsImageLoading(true);
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
        setIsImageLoading(false);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accepts: 'image/*',
        multiple: false,
    });

    const saveData = e => {
        e.preventDefault();
        const schoolName = schoolsData.find((school) => school.userId === selectedSchoolId)?.name;
        const data = {
            schoolId: selectedSchoolId,
            photo,
            enrolmentDate,
            placeStudy,
            name,
            birthday,
            fTrainer,
            nowTrainer,
            school: schoolName,
            address,
            telephone: telephone,
            listResults: JSON.stringify(listResults),
            unenrolmentDate,
            causeUnenrolment,
            anthropometricData,
            mum,
            mumPhone,
            dad,
            dadPhone,
            livingAddress,
            education,
            schedule,
        };
        saveSportsmanMutation.mutate(data);
    };

    const editData = e => {
        const schoolName = schoolsData.find((school) => school.userId === selectedSchoolId)?.name;
        e.preventDefault();
        const data = {
            _id: sportsman._id,
            schoolId: selectedSchoolId, // I should not have to specify parameters i don't want to update
            photo,
            name,
            enrolmentDate,
            placeStudy,
            birthday,
            fTrainer,
            nowTrainer,
            school: schoolName,
            address,
            telephone,
            listResults: JSON.stringify(listResults),
            unenrolmentDate,
            causeUnenrolment,
            anthropometricData,
            mum,
            mumPhone,
            dad,
            dadPhone,
            livingAddress,
            education,
            schedule,
        };
        editSportsmanMutation.mutate(data);
    };

    const addResult = e => {
        e.preventDefault();
        if (result?.competition?.length !== 0) {
            setListResults([...listResults, result]);
            setResult({ competition: '', date: '', place: '', competitionResult: '' });
            // buildTableRows([...listResults, result]);
        }
    };

    const deleteCeill = rowData => {
        // eslint-disable-next-line no-restricted-globals
        const answer = confirm(
            `Удалить результат: ${rowData.competition}, Класс -${rowData.date}, Место - ${rowData.place}, Место - ${rowData.competitionResult} ?`
        );
        if (answer) {
            const newList = listResults.filter(result => result.id !== rowData.id);
            setListResults(newList);
        }
    };

    useEffect(() => {
        const arr = listResults;
        arr.forEach((el, idx) => (el['id'] = idx + 1));
        setResultRows(arr);
    }, [listResults]);

    return (
        <div className={classes.root} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : null}`}>
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Вот прямо сюда!</p> : <p>Бросьте фото спортсмена сюда</p>}
                </div>
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
                        shrink: !!name,
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
                    label="Антропометрические данные"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={anthropometricData}
                    placeholder="Введите антропометрические данные"
                    variant="outlined"
                    onChange={e => setAnthropometricData(e.target.value)}
                    InputLabelProps={{
                        shrink: !!anthropometricData,
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
                    InputLabelProps={{
                        shrink: !!telephone,
                    }}
                />
                
                <TextField
                    label="ФИО матери"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={mum}
                    placeholder="Введите ФИО матери"
                    variant="outlined"
                    onChange={e => setMum(e.target.value)}
                    InputLabelProps={{
                        shrink: !!mum,
                    }}
                />
                <TextField
                    label="Контактный номер телефона матери"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={mumPhone}
                    placeholder="Введите номер телефона матери"
                    variant="outlined"
                    onChange={e => setMumPhone(e.target.value)}
                    InputLabelProps={{
                        shrink: !!mumPhone,
                    }}
                />
                
                <TextField
                    label="ФИО отца"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={dad}
                    placeholder="Введите ФИО отца"
                    variant="outlined"
                    onChange={e => setDad(e.target.value)}
                    InputLabelProps={{
                        shrink: !!dad,
                    }}
                />
                <TextField
                    label="Контактный номер телефона отца"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={dadPhone}
                    placeholder="Введите номер телефона отца"
                    variant="outlined"
                    onChange={e => setDadPhone(e.target.value)}
                    InputLabelProps={{
                        shrink: !!dadPhone,
                    }}
                />
                <TextField
                    label="Адрес регистрации"
                    id="margin-none"
                    style={{ margin: 8 }}
                    placeholder="Введите адрес регистрации"
                    value={address}
                    fullWidth
                    onChange={e => setAddress(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: !!address,
                    }}
                />
                 <TextField
                    label="Адрес проживания"
                    id="margin-none"
                    style={{ margin: 8 }}
                    placeholder="Введите адрес проживания"
                    value={livingAddress}
                    fullWidth
                    onChange={e => setLivingAddress(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: !!livingAddress,
                    }}
                />
            </div>
            <div>
                <TextField
                    label="Первый тренер"
                    id="outlined-margin-none"
                    className={classes.textField}
                    placeholder="Введите ФИО первого тренера"
                    value={fTrainer}
                    variant="outlined"
                    onChange={e => setFTrainer(e.target.value)}
                    InputLabelProps={{
                        shrink: !!fTrainer,
                    }}
                />

                <FormControl className={classes.formControl}>
                    <InputLabel shrink={true}>Личный тренер</InputLabel>
                    <Select value={nowTrainer} onChange={e => setNowTrainer(e.target.value)}>
                        <MenuItem value="">None</MenuItem>
                        {trainers &&
                            trainers.map(trainer => (
                                <MenuItem value={trainer._id}>{trainer.name}</MenuItem>
                            ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Зачисление"
                    id="outlined-margin-none"
                    className={classes.textField}
                    placeholder="Введите дату приказа о зачислении"
                    value={enrolmentDate}
                    variant="outlined"
                    onChange={e => setEnrolmentDate(e.target.value)}
                    InputLabelProps={{
                        shrink: !!enrolmentDate,
                    }}
                />

                <TextField
                    label="Место проведения занятий"
                    id="outlined-margin-none"
                    className={classes.textField}
                    placeholder="Введите место проведения занятий"
                    value={placeStudy}
                    variant="outlined"
                    onChange={e => setPlaceStudy(e.target.value)}
                    InputLabelProps={{
                        shrink: !!placeStudy,
                    }}
                />

                <FormControl className={classes.formControl}>
                    <InputLabel shrink={true}>Ведомственная принадлежность</InputLabel>
                    <Select
                        value={selectedSchoolId}
                        onChange={ onSchoolChange }>
                        <MenuItem value="">Не выбрано</MenuItem>
                        {schoolsData &&
                            schoolsData.map((school) => (
                                <MenuItem value={school.userId}>{school.name}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Образование"
                    id="outlined-margin-none"
                    className={classes.textField}
                    placeholder="Введите образование"
                    value={education}
                    variant="outlined"
                    onChange={e => setEducation(e.target.value)}
                    InputLabelProps={{
                        shrink: !!education,
                    }}
                />
                <TextField
                    label="Расписание занятий"
                    id="outlined-margin-none"
                    className={classes.textField}
                    placeholder="Введите расписание занятий"
                    value={schedule}
                    variant="outlined"
                    onChange={e => setSchedule(e.target.value)}
                    InputLabelProps={{
                        shrink: !!schedule,
                    }}
                />
                <TextField
                    label="Отчисление"
                    id="outlined-margin-none"
                    className={classes.textField}
                    placeholder="Введите дату приказа об отчислении"
                    value={unenrolmentDate}
                    variant="outlined"
                    onChange={e => setUnenrolmentDate(e.target.value)}
                    InputLabelProps={{
                        shrink: !!unenrolmentDate,
                    }}
                />
                <TextField
                    label="Причина отчисления"
                    id="outlined-margin-none"
                    className={classes.textField}
                    placeholder="Введите причину отчисления"
                    value={causeUnenrolment}
                    variant="outlined"
                    onChange={e => setCauseUnenrolment(e.target.value)}
                    InputLabelProps={{
                        shrink: !!causeUnenrolment,
                    }}
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
                        value={result.competition}
                    />
                    <TextField
                        label="Дата"
                        className={classes.textField}
                        placeholder="Введите дату"
                        variant="outlined"
                        onChange={e => {
                            setResult({
                                ...result,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'date',
                        }}
                        value={result.date}
                    />
                    <TextField
                        label="Место проведения"
                        className={classes.textField}
                        placeholder="Введите место проведения"
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
                        value={result.place}
                    /><TextField
                        label="Результат"
                        className={classes.textField}
                        placeholder="Введите результат"
                        variant="outlined"
                        onChange={e => {
                            setResult({
                                ...result,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'competitionResult',
                        }}
                        value={result.competitionResult}
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
                        rows={resultRows}
                        columns={headers}
                        pageSize={15}
                        rowsPerPageOptions={[5, 10, 15]}
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
