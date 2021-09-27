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
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'stretch',
    },
    textField: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: '25ch',
    },
    formControl: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: '25ch',
    },

    regionSelectLabel: {
        padding: '0 5px',
        backgroundColor: 'var(--bg-color)',
    },

    selectEmpty: {
        marginTop: theme.spacing(2),
    },

    image: {
        marginRight: '1em',
    },

    dropzone: {
        padding: '1rem',
        border: '1px dashed salmon',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },

    row: {
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: '1em',
    },
}));

export default function CreateEditSchool() {
    const history = useHistory();
    const { user } = useAuth0();
    const [name, setName] = useState('');
    const [director, setDirector] = useState('');
    const [foto, setFoto] = useState(null);
    const [description, setDescription] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const [adress, setAdress] = useState('');
    const [telephone, setTelephone] = useState('');
    const classes = useStyles();
    const [school, setSchool] = useState({});

    const setSchoolData = data => {
        setSchool(data);
        setRegion(data.region);
        setFoto(data.foto);
        setName(data.name);
        setDirector(data.director);
        setDescription(data.description);
        setCity(data.city);
        setAdress(data.adress);
        setTelephone(data.telephone);
    };

    useEffect(() => {
        (async () => {
            if (user?.sub) {
                try {
                    const res = await fetch(`/school/?userId=${user.sub}`);
                    const { school } = await res.json();

                    if (school) {
                        setSchoolData(school);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })();
    }, [user?.sub]);

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

    const saveData = async e => {
        e.preventDefault();
        const data = {
            idUser: user.sub,
            foto: foto,
            name: name,
            director: director,
            description: description,
            region: region,
            city: city,
            adress: adress,
            telephone: telephone,
        };

        try {
            await fetch('/saveSchool', {
                method: 'post',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: data,
            });

            history.push('/mySchool');
        } catch (error) {
            console.log(error);
        }
    };

    const editData = async e => {
        e.preventDefault();
        const data = {
            _id: school._id,
            idUser: user.sub,
            foto: foto,
            name: name,
            director: director,
            description: description,
            region: region,
            city: city,
            adress: adress,
            telephone: telephone,
        };

        try {
            await fetch('/editSchool', {
                method: 'post',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            history.push('/mySchool');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={classes.root}>
            <Typography variant="h5" component="h6" gutterBottom>
                Основная информация
            </Typography>

            <div className={classes.row}>
                {foto && (
                    <Image
                        className={classes.image}
                        cloud_name="dgeev9d6l"
                        publicId={foto}
                        width="350"
                        crop="scale"
                    />
                )}

                <div {...getRootProps()} className={classes.dropzone}>
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Вот прямо сюда!</p> : <p>Бросьте фото учреждения сюда</p>}
                </div>
            </div>

            <div className={classes.row}>
                <TextField
                    label="Название учреждения"
                    style={{ margin: 8 }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Директор"
                    style={{ margin: 8 }}
                    value={director}
                    onChange={e => setDirector(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>

            <div classeName={classes.row}>
                <TextField
                    label="Краткое описание"
                    style={{ margin: 8 }}
                    placeholder="Введите краткое описание"
                    multiline
                    rows={4}
                    fullWidth
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                />
            </div>

            <Typography variant="h5" component="h6" gutterBottom>
                Контакты учреждения
            </Typography>

            <div className={classes.row}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel
                        className={classes.regionSelectLabel}
                        id="demo-simple-select-outlined-label"
                    >
                        Область
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={region}
                        onChange={e => setRegion(e.target.value)}
                    >
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
                    value={city}
                    variant="outlined"
                    onChange={e => setCity(e.target.value)}
                />
                <TextField
                    label="Адрес"
                    id="outlined-margin-dense"
                    className={classes.textField}
                    value={adress}
                    variant="outlined"
                    onChange={e => setAdress(e.target.value)}
                />
            </div>

            <div className={classes.row}>
                <TextField
                    label="Контактный номер телефона"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={telephone}
                    variant="outlined"
                    onChange={e => setTelephone(e.target.value)}
                />
            </div>

            <div className={classes.row}>
                {school?.name ? (
                    <Button variant="contained" color="primary" onClick={editData}>
                        Сохранить изменения
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
