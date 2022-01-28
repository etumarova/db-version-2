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
import { CircularProgress } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { editSchool, saveSchool, fetchSchoolById } from 'services/school';
import { queryClient } from 'features/queryClient';
import { fetchSchoolByUserId } from 'services/school';
import {DataGrid, ruRU} from '@material-ui/data-grid';

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

    selectedLabel: {
        backgroundColor: 'var(--bg-color)',
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

const columns = [
    { field: 'id', headerName: 'ID', width: 95 },
    { field: 'inventories_name', headerName: 'Инвентарь', width: 260 },
    { field: 'inventories_nomination', headerName: 'Наименование', width: 300 },
    { field: 'inventories_count', headerName: 'Количество', width: 200 },
    { field: 'inventories_date', headerName: 'Дата выпуска', width: 200 },
];

export default function CreateEditSchool() {
    const { id } = useParams();
    const classes = useStyles();
    const history = useHistory();
    const { user } = useAuth0();

    let userId = id || user?.sub;

    const [name, setName] = useState('');
    const [director, setDirector] = useState('');
    const [deputeDirector, setDeputeDirector] = useState('');
    const [photo, setPhoto] = useState(null);
    const [directorPhone, setDirectorPhone] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [telephone, setTelephone] = useState('');
    const [typeSport, setTypeSport] = useState('');
    const [isLoading, setIsLoading] = React.useState(true);
    const [inventories, setInventories] = useState({ inventories_name: '', inventories_nomination: '', inventories_count: '', inventories_date: '' });
    const [listInventories, setListInventories] = useState([]);

    const [isImageLoading, setIsImageLoading] = useState(false);

    const { data } = useQuery(['schools', userId], () =>
        id? fetchSchoolById(id) : fetchSchoolByUserId(userId)
    );
    const { school } = data || {};
    userId = school.userId;
    const saveSchoolMutation = useMutation(saveSchool, {
        onSuccess: () => {
            queryClient.invalidateQueries('schools');
            // history.push('/mySchool');
            history.goBack();
        },
        onError: error => console.log(error),
    });
    const editSchoolMutation = useMutation(editSchool, {
        onSuccess: () => {
            queryClient.invalidateQueries('schools');
            // history.push('/mySchool');
            history.goBack();
        },
        onError: error => console.log(error),
    });
    const [formattedSportsmen, setFormattedSportsmen] = useState([]);
    const defaultFormattedSportsmen = listInventories?.map(element => ({ ...element, id: element._id}
    )) || [];

    useEffect(() => {
        setFormattedSportsmen(defaultFormattedSportsmen)
    }, [isLoading])

    const addInventories = e => {
        e.preventDefault();
        console.log(inventories);
        if (inventories) {
            setListInventories([...listInventories, inventories]);
            setInventories({ inventories_name: '', inventories_nomination: '', inventories_count: '', inventories_date: '' });
        }
    };

    const deleteCeill = rowData => {
        // eslint-disable-next-line no-restricted-globals
        const answer = confirm(
            `           Удалить инвентарь: ${rowData.inventories_name},
           Наименование - ${rowData.inventories_nomination},
           Количество - ${rowData.inventories_count},
           Дата выпуска - ${rowData.inventories_date}.`
        );
        if (answer) {
            const newList = listInventories.filter(result => result.id !== rowData.id);
            setListInventories(newList);
        }
    };

    useEffect(() => {
        const arr = listInventories;
        arr.forEach((el, idx) => (el['id'] = idx + 1));
        setFormattedSportsmen(arr);
    }, [listInventories]);

    const setSchoolData = data => {
        setRegion(data.region);
        setPhoto(data.photo);
        setName(data.name);
        setDirector(data.director);
        setDeputeDirector(data.deputeDirector);
        setDirectorPhone(data.directorPhone);
        setEmail(data.email);
        setDescription(data.description);
        setCity(data.city);
        setAddress(data.address);
        setTelephone(data.telephone);
        setTypeSport(data.typeSport);
        setListInventories(JSON.parse(data.listInventories));
    };

    useEffect(() => {
        if (school) setSchoolData(school);
    }, [school]);

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
        const data = {
            userId,
            photo,
            name,
            director,
            deputeDirector,
            directorPhone,
            email,
            description,
            region,
            city,
            address,
            telephone,
            typeSport,
            listInventories: JSON.stringify(listInventories),
        };

        saveSchoolMutation.mutate(data);
    };

    const editData = e => {
        e.preventDefault();
        const data = {
            _id: school._id,
            userId,
            photo,
            name,
            director,
            deputeDirector,
            directorPhone,
            email,
            description,
            region,
            city,
            address,
            telephone,
            typeSport,
            listInventories: JSON.stringify(listInventories),
        };

        editSchoolMutation.mutate(data);
    };

    return (
        <div className={classes.root}>
            <Typography variant="h5" component="h6" gutterBottom>
                Основная информация
            </Typography>

            <div className={classes.row}>
                {isImageLoading? <CircularProgress style={{margin: "100px"}}></CircularProgress> : photo && (
                    <Image
                        className={classes.image}
                        cloud_name="dgeev9d6l"
                        publicId={photo}
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
                <TextField
                    label="Заместитель директора"
                    style={{ margin: 8 }}
                    value={deputeDirector}
                    onChange={e => setDeputeDirector(e.target.value)}
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
                        shrink: !!description,
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
                    value={address}
                    variant="outlined"
                    onChange={e => setAddress(e.target.value)}
                />
            </div>

            <div className={classes.row}>
                <TextField
                    label="Телефон директора"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={directorPhone}
                    variant="outlined"
                    onChange={e => setDirectorPhone(e.target.value)}
                />
                <TextField
                    label="Контактный номер телефона"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={telephone}
                    variant="outlined"
                    onChange={e => setTelephone(e.target.value)}
                />
                <TextField
                    label="Электронная почта"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={email}
                    variant="outlined"
                    onChange={e => setEmail(e.target.value)}
                />
                <TextField
                    label="Отделения по видам спорта"
                    id="outlined-margin-normal"
                    className={classes.textField}
                    value={typeSport}
                    variant="outlined"
                    onChange={e => setTypeSport(e.target.value)}
                />
            </div>

            <div>
                <div>
                    <TextField
                        label="Инвентарь"
                        className={classes.textField}
                        placeholder="Введите инвентарь"
                        variant="outlined"
                        onChange={e => {
                            setInventories({
                                ...inventories,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'inventories_name',
                        }}
                        value={inventories.inventories_name}
                    />
                    <TextField
                        label="Наименование"
                        className={classes.textField}
                        placeholder="Введите наименование"
                        variant="outlined"
                        onChange={e => {
                            setInventories({
                                ...inventories,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'inventories_nomination',
                        }}
                        value={inventories.inventories_nomination}
                    />
                    <TextField
                        label="Количество"
                        className={classes.textField}
                        placeholder="Введите количество"
                        variant="outlined"
                        onChange={e => {
                            setInventories({
                                ...inventories,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'inventories_count',
                        }}
                        value={inventories.inventories_count}
                    />
                    <TextField
                        label="Дата выпуска"
                        className={classes.textField}
                        placeholder="Введите дату выпуска"
                        variant="outlined"
                        onChange={e => {
                            setInventories({
                                ...inventories,
                                [e.target.name]: e.target.value,
                            });
                        }}
                        inputProps={{
                            name: 'inventories_date',
                        }}
                        value={inventories.inventories_date}
                    />
                    <Button variant="contained" color="primary" onClick={addInventories}>
                        Добавить результат
                    </Button>
                </div>
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        localeText={ruRU.props.MuiDataGrid.localeText}
                        rows={formattedSportsmen}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => deleteCeill(e.row)}
                    />
                </div>
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
