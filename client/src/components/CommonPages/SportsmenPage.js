import React from 'react';
import { Image } from 'cloudinary-react';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchSportsmanById } from 'services/sportsmen';
import {setIndexToObject} from '../../services/utils';

const columns = [
    { field: 'index', headerName: 'ID', width: 95 },
    { field: 'competition', headerName: 'Наименование соревнования', width: 400 },
    { field: 'date', headerName: 'Дата', width: 175 },
    { field: 'place', headerName: 'Место проведения', width: 200 },
    { field: 'competitionResult', headerName: 'Результат', width: 150 },
];

export default function SportsmenPage() {
    const { id } = useParams();
    const { data } = useQuery(['sportsmen', id], () => fetchSportsmanById(id));
    const { sportsman } = data || {};

    // const sportsmen = JSON.parse(localStorage.getItem('sportsmen'));
    // const result = JSON.parse(sportsmen.listResults);
    // result.forEach((el, idx) => (el['id'] = idx + 1));

    const serializedResults = sportsman?.listResults;
    const results = serializedResults ? JSON.parse(serializedResults).map((result, index) => {
            const transformedObject = { ...result, id: result.id}
            return setIndexToObject(transformedObject, index)
        })
        : [];

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
                                            publicId={sportsman.photo}
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
                                            <h6 className="mb-0">Антропометрические данные</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.anthropometricData}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Мать</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.mum}
                                        </div>
                                    </div>
                                    
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Телефон матери</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.mumPhone}
                                        </div>
                                    </div>
                                    
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Отец</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.dad}
                                        </div>
                                    </div>
                                    
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Телефон отца</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.dadPhone}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Образование</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.education}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Ведомственная принадлежность</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.school}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Первый тренер</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">                                        
                                            {sportsman.fTrainer}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Личный тренер</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.nowTrainer?.name}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Дата приказа о зачислении</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.enrolmentDate}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Место проведения занятий</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.placeStudy}
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
                                            <h6 className="mb-0">Адрес регистрации</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.address}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Адрес проживания</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.livingAddress}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Расписание занятий</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.schedule}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Группа</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.group}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Спортивное звание</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.rank}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Приказ о присвоении</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.assignment}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Дата приказа отчисления</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.unenrolmentDate}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Причина отчисления</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {sportsman.causeUnenrolment}
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
