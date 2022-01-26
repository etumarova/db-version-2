import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDropzone } from 'react-dropzone';
import { Image } from 'cloudinary-react';
import Button from '@material-ui/core/Button';
import { fetchTrainerById, saveTrainer, editTrainer } from 'services/trainer';
import { useHistory, useParams } from 'react-router-dom';
import { queryClient } from 'features/queryClient';
import { useMutation, useQuery } from 'react-query';
import { UserContext } from 'context/UserContext';
import {DataGrid, ruRU} from '@material-ui/data-grid';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
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

const columns = [
    { field: 'id', headerName: 'ID', width: 95 },
    { field: 'name', headerName: 'ФИО спортсмена', width: 300 },
    { field: 'school', headerName: 'Наименование организации', width: 265 },
    { field: 'year', headerName: 'Год передачи', width: 170 },
];

export default function CreateTrainer() {
    const { userSub } = useContext(UserContext);
    const { id } = useParams();
    const history = useHistory();
    const [photo, setPhoto] = useState(null);
    const [name, setName] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [education, setEducation] = useState(null);
    const [laborCategory, setLaborCategory] = useState(null);
    const [studentNumber, setStudentNumber] = useState(null);
    const [telephone, setTelephone] = useState(null);
    const [school, setSchool] = useState(null);
    const classes = useStyles();
    const [isLoading, setIsLoading] = React.useState(true);
    const [transfer, setTransfer] = useState({ name: '', school: '', year: '' });
    const [listTransfer, setListTransfer] = useState([]);
    const [isImageLoading, setIsImageLoading] = useState(false);

    const shouldFetchTrainer = !!id;
    const { data: trainerData } = useQuery(['trainers', id], () => fetchTrainerById(id), {
        enabled: shouldFetchTrainer,
        onSuccess : () => setIsLoading(false),
    });
    const { trainer } = trainerData || {};
    const schoolId = trainer?.schoolId || userSub;

    const saveTrainerMutation = useMutation(saveTrainer, {
        onSuccess: () => {
            queryClient.invalidateQueries('trainers');
            history.goBack();
        },
        onError: error => console.log(error),
    });
    const editTrainerMutation = useMutation(editTrainer, {
        onSuccess: () => {
            queryClient.invalidateQueries('trainers');
            history.goBack();
        },
        onError: error => console.log(error),
    });

    useEffect(() => {
        if (trainer) {
            setPhoto(trainer.photo);
            setName(trainer.name);
            setBirthday(trainer.birthday);
            setEducation(trainer.education);
            setLaborCategory(trainer.laborCategory);
            setStudentNumber(trainer.studentNumber);
            setTelephone(trainer.telephone);
            setSchool(trainer.school);
            setListTransfer(JSON.parse(trainer.listTransfer));
        }
    }, [trainer]);

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

    const [formattedTrainer, setFormattedTrainer] = useState([]);
    const defaultFormattedTrainer = listTransfer?.map(element => ({ ...element, id: element._id}
    )) || [];

    useEffect(() => {
        setFormattedTrainer(defaultFormattedTrainer)
    }, [isLoading])

    const addTransfer = e => {
        e.preventDefault();
        console.log(transfer);
        if (transfer) {
            setListTransfer([...listTransfer, transfer]);
            setTransfer({ name: '', school: '', year: '' });
        }
    };

    const deleteCeill = rowData => {
        // eslint-disable-next-line no-restricted-globals
        const answer = confirm(
            `           Удалить инвентарь: ${rowData.name},
           Наименование - ${rowData.school},
           Количество - ${rowData.year}.`
        );
        if (answer) {
            const newList = listTransfer.filter(result => result.id !== rowData.id);
            setListTransfer(newList);
        }
    };

    useEffect(() => {
        const arr = listTransfer;
        arr.forEach((el, idx) => (el['id'] = idx + 1));
        setFormattedTrainer(arr);
    }, [listTransfer]);

    const saveData = e => {
        e.preventDefault();
        const data = {
            schoolId,
            photo,
            name,
            birthday,
            education,
            laborCategory,
            studentNumber,
            school,
            telephone,
            listTransfer: JSON.stringify(listTransfer),
        };
        saveTrainerMutation.mutate(data);
    };

    const editData = e => {
        e.preventDefault();
        const data = {
            _id: trainer._id,
            schoolId,
            photo,
            name,
            birthday,
            education,
            laborCategory,
            studentNumber,
            school,
            telephone,
            listTransfer: JSON.stringify(listTransfer),
        };
        editTrainerMutation.mutate(data);
    };

    return (
        <div className={classes.root}>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : null}`}>
                <input {...getInputProps()} />
                {isDragActive ? <p>Вот прямо сюда!</p> : <p>Бросьте фото тренера сюда</p>}
            </div>
            <div>
                {photo != '' && (
                    <Image cloud_name="dgeev9d6l" publicId={photo} width="50" crop="scale" />
                )}

                
            </div>
            <div>
                <TextField
                    label="ФИО тренера"
                    style={{ margin: 8 }}
                    placeholder="Введите ФИО тренера"
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
                    value={birthday}
                    className={classes.textField}
                    onChange={e => setBirthday(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Контактный номер телефона"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    placeholder="Введите номер телефона"
                    variant="outlined"
                    value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                />
                 <TextField
                    label="Образование"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    placeholder="Образование"
                    variant="outlined"
                    value={education}
                    onChange={e => setEducation(e.target.value)}
                />
                 <TextField
                    label="Трудовая категория"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    placeholder="Трудовая категория"
                    variant="outlined"
                    value={laborCategory}
                    onChange={e => setLaborCategory(e.target.value)}
                />
                <TextField
                    label="Количество занимающихся"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    placeholder="Количество занимающихся"
                    variant="outlined"
                    value={studentNumber}
                    onChange={e => setStudentNumber(e.target.value)}
                />
            </div>
            <div>
                <TextField
                    label="Ведомственная принадлежность"
                    className={classes.textField}
                    placeholder="Введите спортивный клуб"
                    variant="outlined"
                    value={school}
                    onChange={e => setSchool(e.target.value)}
                />
            </div>
            <div></div>
            <div>
                <div>
                    <TextField
                        label="ФИО спортсмена"
                        className={classes.textField}
                        placeholder="Введите ФИО спортсмена"
                        variant="outlined"
                        onChange={e => {
                            setTransfer({
                                ...transfer,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'name',
                        }}
                        value={transfer.name}
                    />
                    <TextField
                        label="Наименование организации"
                        className={classes.textField}
                        placeholder="Введите наименование организации"
                        variant="outlined"
                        onChange={e => {
                            setTransfer({
                                ...transfer,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'school',
                        }}
                        value={transfer.school}
                    />
                    <TextField
                        label="Год передачи"
                        className={classes.textField}
                        placeholder="Введите год передачи"
                        variant="outlined"
                        onChange={e => {
                            setTransfer({
                                ...transfer,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'year',
                        }}
                        value={transfer.year}
                    />
                    <Button variant="contained" color="primary" onClick={addTransfer}>
                        Добавить результат
                    </Button>
                </div>
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        localeText={ruRU.props.MuiDataGrid.localeText}
                        rows={formattedTrainer}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => deleteCeill(e.row)}
                    />
                </div>
            </div>
            <div>
                {trainer ? (
                    <Button variant="contained" color="primary" onClick={editData}>
                        Редактировать
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={saveData}>
                        Сохранить
                    </Button>
                )}
            </div>
        </div>
    );
}
