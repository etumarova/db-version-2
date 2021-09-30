import React, { useMemo, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import TableSportsmens from 'components/TableSportsmens';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchSportsmenBySchoolId } from 'services/sportsmen';
import { UserContext } from 'context/UserContext';

export default function MySportsmens() {
    const { userSub } = useContext(UserContext);
    const { data } = useQuery(['sportsmen', userSub], () => fetchSportsmenBySchoolId(userSub));
    const { sportsmen } = data || {};

    const formattedSportsmen = useMemo(
        () => sportsmen?.map(sportsman => ({ ...sportsman, id: sportsman._id })) || [],
        [sportsmen]
    );

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
            {sportsmen && <TableSportsmens sportsmens={formattedSportsmen} />}
        </div>
    );
}
