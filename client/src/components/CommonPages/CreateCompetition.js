import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDropzone } from 'react-dropzone';
import { Image } from 'cloudinary-react';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useAuth0 } from '@auth0/auth0-react';
import { useContext } from 'react';
import { UserContext } from 'context/UserContext';
import { fetchCompetitionById, saveCompetition, editCompetition } from 'services/competition';
import { useHistory, useParams } from 'react-router-dom';
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
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

export default function CreateCompetition() {
    const { id } = useParams();
    const history = useHistory();

    const [logo, setLogo] = useState(null);
    const [name, setName] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [deadLine, setDeadLine] = useState(null);
    const [mainJudge, setMainJudge] = useState(null);
    const [secretary, setSecretary] = useState(null);
    const [telephone, setTelephone] = useState(null);
    const [place, setPlace] = useState(null);
    const [description, setDescription] = useState(null);
    const [discipline, setDiscipline] = useState([]);
    const [term, setTerm] = useState(null);
    const classes = useStyles();

    const shouldFetchExisting = !!id;
    const { data } = useQuery(['competitions', id], () => fetchCompetitionById(id), {
        enabled: shouldFetchExisting,
    });
    const { competition } = data || {};

    const saveCompetitionMutation = useMutation(saveCompetition, {
        onSuccess: () => {
            queryClient.invalidateQueries('competitions');
            history.goBack();
        },
        onError: error => console.log(error),
    });
    const editCompetitionMutation = useMutation(editCompetition, {
        onSuccess: () => {
            queryClient.invalidateQueries('competitions');
            history.goBack();
        },
        onError: error => console.log(error),
    });

    useEffect(() => {
        if (competition) {
            setLogo(competition.logo);
            setName(competition.name);
            setStartDate(competition.startDate);
            setEndDate(competition.endDate);
            setDeadLine(competition.deadLine);
            setTelephone(competition.telephone);
            setMainJudge(competition.mainJudge);
            setSecretary(competition.secretary);
            setPlace(competition.place);
            setDescription(competition.description);
            setDiscipline(JSON.parse(competition.discipline));
        }
    }, [competition]);

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
        setLogo(data.public_id);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accepts: 'image/*',
        multiple: false,
    });

    const saveData = e => {
        e.preventDefault();
        const data = {
            logo: logo,
            name: name,
            startDate: startDate,
            endDate: endDate,
            deadLine: deadLine,
            mainJudge: mainJudge,
            secretary: secretary,
            telephone: telephone,
            place: place,
            description: description,
            discipline: JSON.stringify(discipline),
        };
        saveCompetitionMutation.mutate(data);

        // socket.emit('addCompetition', data);
    };

    const editData = e => {
        e.preventDefault();
        const data = {
            _id: competition._id,
            logo: logo,
            name: name,
            startDate: startDate,
            endDate: endDate,
            deadLine: deadLine,
            mainJudge: mainJudge,
            secretary: secretary,
            telephone: telephone,
            place: place,
            description: description,
            discipline: JSON.stringify(discipline),
        };
        editCompetitionMutation.mutate(data);
    };

    const handleSubmit = e => {
        e.preventDefault();
        setDiscipline([...discipline, term]);
        setTerm(null);
    };

    const handleDelete = index => {
        const newArr = [...discipline];
        newArr.splice(index, 1);
        setDiscipline(newArr);
    };

    return (
        <div className={classes.root}>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : null}`}>
                <input {...getInputProps()} />
                {isDragActive ? <p>Вот прямо сюда!</p> : <p>Бросьте логотип сюда</p>}
            </div>
            <div>
                <Image cloud_name="dgeev9d6l" publicId={logo} width="50" crop="scale" />
            </div>

            <div>
                <TextField
                    label="Наименование мероприятия"
                    style={{ margin: 8 }}
                    placeholder="Введите название"
                    fullWidth
                    value={name}
                    onChange={e => setName(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Место проведения мероприятия"
                    style={{ margin: 8 }}
                    placeholder="Введите место проведения"
                    fullWidth
                    value={place}
                    onChange={e => setPlace(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Начало соревнований"
                    type="date"
                    value={startDate}
                    className={classes.textField}
                    onChange={e => setStartDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Окончание соревнований"
                    type="date"
                    className={classes.textField}
                    onChange={e => setEndDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Последний день приема заявок"
                    type="date"
                    className={classes.textField}
                    onChange={e => setDeadLine(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            <div>
                <TextField
                    label="Главный судья"
                    className={classes.textField}
                    placeholder="Введите ФИО главного судьи"
                    variant="outlined"
                    onChange={e => setMainJudge(e.target.value)}
                />
                <TextField
                    label="Секретарь соревнований"
                    className={classes.textField}
                    placeholder="Введите ФИО секретаря соревнований"
                    variant="outlined"
                    onChange={e => setSecretary(e.target.value)}
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
            <TextField
                label="Краткое описание мероприятия"
                style={{ margin: 8 }}
                placeholder="Введите описание"
                multiline
                fullWidth
                rows={5}
                onChange={e => setDescription(e.target.value)}
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <div style={{ width: '100%', marginBottom: '2em' }}>
                {discipline.map((todo, index) => {
                    return (
                        <div style={{ margin: '0' }}>
                            {todo}
                            <IconButton
                                aria-label="delete"
                                className={classes.margin}
                                name={index}
                                onClick={e => {
                                    handleDelete(e.target.name);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </div>
                    );
                })}
                <form style={{ marginTop: '2em' }}>
                    <TextField
                        id="standard-basic"
                        placeholder="Добавить дисциплину"
                        value={term}
                        onChange={e => setTerm(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        className={classes.margin}
                        onClick={handleSubmit}
                    >
                        Добавить
                    </Button>
                </form>
            </div>

            <div>
                {competition ? (
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
