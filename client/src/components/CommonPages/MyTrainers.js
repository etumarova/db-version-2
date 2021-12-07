import React, { useContext, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { fetchTrainersBySchoolId } from 'services/trainer';
import { useQuery } from 'react-query';
import { UserContext } from 'context/UserContext';

const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'ФИО', width: 260 },
    { field: 'birthday', headerName: 'Год рождения', width: 150 },
    { field: 'school', headerName: 'Ведомственная принадлежность', width: 180 },
    { field: 'education', headerName: 'Образование', width: 180 },
    { field: 'laborCategory', headerName: 'Трудовая категория', width: 120 },
    { field: 'studentNumber', headerName: 'Кол-во занимающихся', width: 100 },
    { field: 'telephone', headerName: 'Телефон', width: 140 },
];

export default function MyTrainers() {
    const history = useHistory();

    const { userSub } = useContext(UserContext);
    const { data } = useQuery(['trainers', userSub], () => fetchTrainersBySchoolId(userSub));
    const { trainers } = data || {};

    const formattedTrainers = useMemo(
        () => trainers?.map(trainer => ({ ...trainer, id: trainer._id })) || [],
        [trainers]
    );

    return (
        <div>
            <div style={{ float: 'right' }}>
                <Link to="createTrainer">
                    <Button variant="contained" color="primary">
                        Добавить тренера
                    </Button>
                </Link>
            </div>
            <Typography variant="h3" component="h4" gutterBottom>
                Тренерский состав
            </Typography>
            {trainers && (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={formattedTrainers}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => {
                            const trainerId = e.row.id;
                            history.push(`/trainer/${trainerId}`);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
