import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDropzone } from 'react-dropzone';
import { Image } from 'cloudinary-react';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import useSocket from 'hooks/useSocket';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function CreateEditSchool() {
    const { socket } = useSocket();
    const [name, setName] = useState(null);
    const [director, setDirector] = useState(null);
    const [foto, setFoto] = useState(null);
    const [description, setDescription] = useState(null);
    const [region, setRegion] = useState(null);
    const [city, setCity] = useState(null);
    const [adress, setAdress] = useState(null);
    const [telephone, setTelephone] = useState(null);
    const classes = useStyles();
    const [school, setSchool] = useState({});

    useEffect(() => {
        socket.emit('getSchool', { test: 'test' });
        try {
            const editSchool = localStorage.getItem('editSchool');
            if (editSchool) {
                const data = JSON.parse(editSchool);
                setSchool(data);
                setRegion(data.region);
                setFoto(data.foto);
                setName(data.name);
                setDirector(data.director);
                setDescription(data.description);
                setCity(data.city);
                setAdress(data.adress);
                setTelephone(data.telephone);
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

    const handleChange = event => {
        const name = event.target.value;
        setRegion(name);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accepts: 'image/*',
        multiple: false,
    });

    const saveData = e => {
        e.preventDefault();
        const data = {
            idUser: localStorage.getItem('user'),
            foto: foto,
            name: name,
            director: director,
            description: description,
            region: region,
            city: city,
            adress: adress,
            telephone: telephone,
        };
        socket.emit('saveSchool', data);
    };
    const editData = e => {
        e.preventDefault();
        const data = {
            _id: school._id,
            idUser: localStorage.getItem('user'),
            foto: foto,
            name: name,
            director: director,
            description: description,
            region: region,
            city: city,
            adress: adress,
            telephone: telephone,
        };
        socket.emit('editSchool', data);
    };

    return (
        <div className={classes.root}>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : null}`}>
                <input {...getInputProps()} />
                {isDragActive ? <p>Вот прямо сюда!</p> : <p>Бросьте фото учреждения сюда</p>}
            </div>
            <div>
                {foto != '' && (
                    <Image cloud_name="dgeev9d6l" publicId={foto} width="50" crop="scale" />
                )}
            </div>
            <div>
                <TextField
                    id="standard-full-width"
                    label="Название учреждения"
                    style={{ margin: 8 }}
                    fullWidth
                    defaultValue={school.name}
                    onChange={e => setName(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Директор"
                    id="margin-none"
                    style={{ margin: 8 }}
                    fullWidth
                    defaultValue={school.director}
                    onChange={e => setDirector(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            <div>
                <TextField
                    id="outlined-full-width"
                    label="Краткое описание"
                    style={{ margin: 8 }}
                    placeholder="Введите краткое описание"
                    multiline
                    rows={4}
                    fullWidth
                    defaultValue={school.description || ''}
                    onChange={e => setDescription(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                />

                <Typography variant="h5" component="h6" gutterBottom>
                    Контакты учреждения
                </Typography>

                <div>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">
                            Выберите регион
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={region}
                            onChange={handleChange}
                        >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Брестская область">Брестская область</MenuItem>
                            <MenuItem value="Витебская область">Витебская область</MenuItem>
                            <MenuItem value="Гомельская область">Гомельская область</MenuItem>
                            <MenuItem value="Гродненская область">Гродненская область</MenuItem>
                            <MenuItem value="Минская область">Минская область</MenuItem>
                            <MenuItem value="Могилевская область">Могилевская область</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Город"
                        id="outlined-margin-none"
                        className={classes.textField}
                        defaultValue={school.city}
                        variant="outlined"
                        onChange={e => setCity(e.target.value)}
                    />
                    <TextField
                        label="Адрес"
                        id="outlined-margin-dense"
                        className={classes.textField}
                        defaultValue={school.adress}
                        variant="outlined"
                        onChange={e => setAdress(e.target.value)}
                    />
                    <TextField
                        label="Контактный номер телефона"
                        id="outlined-margin-normal"
                        className={classes.textField}
                        defaultValue={school.telephone}
                        variant="outlined"
                        onChange={e => setTelephone(e.target.value)}
                    />
                </div>
                {!school.name && (
                    <Button variant="contained" color="primary" onClick={saveData}>
                        Сохранить
                    </Button>
                )}
                {school.name && (
                    <Button variant="contained" color="primary" onClick={editData}>
                        Редактировать
                    </Button>
                )}
            </div>
        </div>
    );
}
