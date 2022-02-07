import React, { useMemo, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import TableSportsmen from 'components/TableSportsmen';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchSportsmenBySchoolId } from 'services/sportsmen';
import { UserContext } from 'context/UserContext';

export default function MySportsmen() {
    const { userSub } = useContext(UserContext);
    const { data } = useQuery(['sportsmen', userSub], () => fetchSportsmenBySchoolId(userSub));
    const { sportsmen } = data || {};

    return (
        <div>
            <div style={{ float: 'right' }}>
                <Link to="createSportsmen">
                    <Button variant="contained" color="primary">
                        Добавить спортсмена
                    </Button>
                </Link>
            </div>
            <Typography variant="h3" component="h4" gutterBottom>
                Мои спортсмены
            </Typography>
            {sportsmen && <TableSportsmen sportsmen={sportsmen} />}
        </div>
    );
}
