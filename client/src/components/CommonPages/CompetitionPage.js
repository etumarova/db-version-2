import React, {useCallback, useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Link, useHistory} from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from 'context/UserContext';
import { useParams } from 'react-router';
import {useMutation, useQuery} from 'react-query';
import {fetchCompetitionById, saveCompetition} from 'services/competition';
import { Image } from 'cloudinary-react';
import { deleteCompetition } from "services/competition";
import {queryClient} from '../../features/queryClient';
import {downloadFileByUrl} from '../../services/utils';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        marginRight: '20px',
    },

}));

export default function CompetitionPage() {
    const history = useHistory();
    const classes = useStyles();
    const [competition, setCompetition] = useState({});
    const { id } = useParams();
    const { data: competitionData } = useQuery(['competitions', id], () => fetchCompetitionById(id));
    const { isAdmin } = useContext(UserContext);

    useEffect(() => {
        if (competitionData?.competition) {
            setCompetition({
                ...competitionData.competition,
                file: JSON.parse(competitionData.competition.file || null),
            })
        }
    }, [competitionData]);

    const deleteCompetitionMutation = useMutation(deleteCompetition, {
        onSuccess: () => {
            queryClient.invalidateQueries('competitions');
            history.goBack();
        },
        onError: error => console.log(error),
    });

    const handleDelete = useCallback(() => {
        deleteCompetitionMutation.mutate({_id: id})
    },[deleteCompetitionMutation]);

    const handleDownloadClick = useCallback(() => {
        if (competition?.file?.fileContent) {
            // expect fileContent already as Base64
            downloadFileByUrl(competition.file.fileName, competition.file.fileContent);
        }
    }, [competition]);

    const discipline = competition?.discipline ? JSON.parse(competition?.discipline) : [];
    return (
        <div>
            {isAdmin && (
                <div>
                    <div style={{ float: 'right', marginTop: '10px', marginLeft: '10px' }}>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={ handleDelete }>
                            Удалить
                        </Button>
                    </div>
                    <div> </div>
                    <div style={{ float: 'right', marginTop: '10px', marginLeft: '10px' }}>
                        <Link to={`/createCompetition/${id}`}>
                            <Button variant="contained" color="primary">
                                Редактировать
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
            {competition && (
                <div style={{ display: 'flex', flexFlow: 'column', margin: '10px' }}>
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex flex-column align-items-center text-center">
                                <Image
                                    cloud_name="dgeev9d6l"
                                    publicId={competition.logo}
                                    width="250"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'start',
                            margin: '10px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexFlow: 'column',
                                justifyContent: 'end',
                                marginTop: '10px',
                            }}
                        >
                            <div>
                                <Typography variant="h4" component="h5" gutterBottom>
                                    {competition.name}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Место проведения: <b>{competition.place}</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Начало соревнований: <b>{competition.startDate}</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Окончание соревнований: <b>{competition.endDate}</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Последний день принятия заявок: <b>{competition.endDate}</b>
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h5" component="h6" gutterBottom>
                                    Контактные данные
                                </Typography>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexFlow: 'column',
                                        justifyContent: 'start',
                                    }}
                                >
                                    <Typography variant="body1" gutterBottom>
                                        Главный судья: <b>{competition.mainJudge}</b>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Cекретарь соревнований: <b>{competition.secretary}</b>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Телефон: <b>{competition.telephone}</b>
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexFlow: 'column',
                            justifyContent: 'end',
                            marginLeft: '10px',
                        }}
                    >
                        <Typography variant="h5" component="h6" gutterBottom>
                            Описание мероприятия
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {competition.description}
                        </Typography>
                    </div>
                    <div className='discipline-header'>
                        <Typography variant="h5" component="h6" gutterBottom>
                            Дисциплины
                        </Typography>
                    </div>
                    {discipline.map(el => {
                        return (
                            <div style={{ marginLeft: '10px' }}>
                                <Typography variant="body1" gutterBottom key={el}>
                                    {el}
                                </Typography>
                            </div>
                        );
                    })}
                    {competition.file && (
                        <div className='file-download'>
                            <Typography variant="h5" component="h6" gutterBottom>
                                Прикреплённый файл
                            </Typography>
                            <div className='abc'>
                                <Typography className={classes.root} variant="body1" gutterBottom>
                                    {competition.file.fileName}
                                </Typography>
                                <Button className={classes.root} variant="contained" color="primary" onClick={handleDownloadClick}>Скачать</Button>
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
