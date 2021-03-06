import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { fetchSportsmen } from 'services/sportsmen';
import { useQuery } from 'react-query';

const headers = [
    { field: 'id', headerName: 'id', width: 150 },
    { field: 'Sportler', headerName: 'ФИО спортсмена', width: 400 },
    { field: 'Klasse', headerName: 'Класс лодки', width: 180 },
    { field: 'Platz', headerName: 'Место', width: 180 },
];

export default function ImportResult() {
    const [competition, setCompetition] = useState(null);
    const [results, setResults] = useState(null);

    const { data: sportsmenData } = useQuery('sportsmen', fetchSportsmen);
    const { sportsmen } = sportsmenData || {};
    const formattedSportsmen = sportsmen?.map(sportsman => ({ ...sportsman, id: sportsman._id }));

    const dataGet = input => {
        const file = input.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
            const data = JSON.parse(reader.result);
            data.forEach((el, idx) => {
                el['id'] = idx + 1;
            });
            setResults(data);
        };
    };

    const saveResults = e => {
        // e.preventDefault();
        // const data = [];
        // sportsmens.forEach(el => {
        //     const findRes = results.filter(elem => elem.id_user == el._id);
        //     if (findRes.length > 0) {
        //         data.push({
        //             id: el._id,
        //             info: findRes,
        //         });
        //     }
        // });
        // data.forEach(el => {
        //     socket.emit('findSportsmen', { id: el.id });
        //     socket.on('resultSportsmen', data => {
        //         const comp = JSON.parse(data[0].listResults);
        //         el.info.forEach(elem => {
        //             comp.push({
        //                 competition: competition,
        //                 discipline: elem.Klasse,
        //                 place: elem.Platz,
        //             });
        //         });
        //         socket.emit('editResult', {
        //             _id: el.id,
        //             listResults: JSON.stringify(comp),
        //         });
        //     });
        // });
        // alert('Данные сохранены!');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" component="h5" gutterBottom>
                    Автоматическое добавление результатов
                </Typography>
                {results && competition && (
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        style={{ margin: '5px' }}
                        onClick={saveResults}
                    >
                        Сохранить результаты
                    </Button>
                )}
            </div>

            <div>
                <TextField
                    label="Название мероприятия"
                    style={{ margin: 8 }}
                    fullWidth
                    value={competition}
                    onChange={e => setCompetition(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                />
            </div>

            <div>
                Выберите сформированный файл: <input name="myFile" onChange={dataGet} type="file" />
            </div>

            {results && (
                <div style={{ height: 500, width: '100%', marginTop: '20px' }}>
                    <Typography variant="h5" component="h6" gutterBottom>
                        {competition}
                    </Typography>
                    <DataGrid rows={results} columns={headers} className="table-style" />
                </div>
            )}
        </div>
    );
}
