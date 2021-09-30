import React from 'react';
import { Image } from 'cloudinary-react';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchSportsmanById } from 'services/sportsmen';

const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'competition', headerName: 'Спортивное мероприятие', width: 300 },
    { field: 'discipline', headerName: 'Класс лодки', width: 150 },
    { field: 'place', headerName: 'Место', width: 150 },
];

export default function SportsmenPage() {
    const { id } = useParams();
    const { data } = useQuery(['sportsmen', id], () => fetchSportsmanById(id));
    const { sportsman } = data || {};

    // const sportsmen = JSON.parse(localStorage.getItem('sportsmen'));
    // const result = JSON.parse(sportsmen.listResults);
    // result.forEach((el, idx) => (el['id'] = idx + 1));

    const serializedResults = sportsman?.listResults;
    const results = serializedResults
        ? JSON.parse(serializedResults).map((result, index) => ({ ...result, id: index + 1 }))
        : [];

    console.log(results);

    return (
        <>
            {sportsman && (
                <div className="main-body" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div className="row gutters-sm" style={{ flexGrow: 1 }}>
                        <div className="col-lg-6 col-md-12 mb-md-3">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <Image
                                            cloud_name="dgeev9d6l"
                                            publicId={sportsman.foto}
                                            width="250"
                                        />

                                        <Link to={`/createSportsmen/${id}`}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                style={{ margin: '5px' }}
                                            >
                                                Редактировать
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">ФИО</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.name}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Год рождения</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.birthday}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Принадлежность</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.school}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Личный тренер</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.nowTraner}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Первый тренер</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.fTraner}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Телефон</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.telephone}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Адрес прописки</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.adress}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {results?.length > 0 && (
                            <div className="col" style={{ height: 500 }}>
                                <DataGrid
                                    rows={results}
                                    columns={columns}
                                    className="table-style"
                                    pageSize={15}
                                    disableColumnSelector
                                    disableColumnFilter
                                    disableColumnMenu
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
