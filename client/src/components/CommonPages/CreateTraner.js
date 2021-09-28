import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDropzone } from 'react-dropzone';
import { Image } from 'cloudinary-react';
import Button from '@material-ui/core/Button';
import { fetchTrainerById, saveTrainer, editTrainer } from 'services/trainer';
import { useHistory } from 'react-router-dom';
import { queryClient } from 'features/queryClient';
import { useMutation, useQuery } from 'react-query';

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

export default function CreateTraner() {
    const history = useHistory();
    const [foto, setFoto] = useState(null);
    const [name, setName] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [telephone, setTelephone] = useState(null);
    const [school, setSchool] = useState(null);
    const classes = useStyles();
    const [traner, setTraner] = useState({});
    const saveTrainerMutation = useMutation(saveTrainer, {
        onSuccess: () => {
            queryClient.invalidateQueries('trainers');
            history.push('/myTraners');
        },
        onError: error => console.log(error),
    });
    const editTrainerMutation = useMutation(editTrainer, {
        onSuccess: () => {
            queryClient.invalidateQueries('trainers');
            history.push('/myTraners');
        },
        onError: error => console.log(error),
    });

    useEffect(() => {
        try {
            const editTraner = localStorage.getItem('traner');
            if (editTraner) {
                const data = JSON.parse(editTraner);
                setTraner(data);
                setFoto(data.foto);
                setName(data.name);
                setBirthday(data.birthday);
                setTelephone(data.telephone);
                setSchool(data.school);
                localStorage.clear();
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

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
            school: school,
            telephone: telephone,
        };
        saveTrainerMutation.mutate(data);
    };

    const editData = e => {
        e.preventDefault();
        const data = {
            _id: traner._id,
            idSchool: localStorage.getItem('user'),
            foto: foto,
            name: name,
            birthday: birthday,
            school: school,
            telephone: telephone,
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
                {foto != '' && (
                    <Image cloud_name="dgeev9d6l" publicId={foto} width="50" crop="scale" />
                )}
            </div>
            <div>
                <TextField
                    label="ФИО тренера"
                    style={{ margin: 8 }}
                    placeholder="Введите ФИО тренера"
                    fullWidth
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
                    onChange={e => setTelephone(e.target.value)}
                />
            </div>
            <div>
                <TextField
                    label="Принадлежность"
                    className={classes.textField}
                    placeholder="Введите спортивный клуб"
                    variant="outlined"
                    onChange={e => setSchool(e.target.value)}
                />
            </div>
            <div>
                {!traner.name && (
                    <Button variant="contained" color="primary" onClick={saveData}>
                        Сохранить
                    </Button>
                )}
                {traner.name && (
                    <Button variant="contained" color="primary" onClick={editData}>
                        Редактировать
                    </Button>
                )}
            </div>
        </div>
    );
}
