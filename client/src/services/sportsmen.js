export const fetchSportsmen = () => fetch('/sportsmen').then(res => res.json());

export const fetchSportsmenBySchoolId = schoolId =>
    fetch(`/sportsmen/?schoolId=${schoolId}`).then(res => res.json());

export const fetchSportsmanById = id => fetch(`/sportsmen/${id}`).then(res => res.json());

export const fetchSportsmenByTrainerId = trainerId =>
    fetch(`/sportsmen/?nowTrainer=${trainerId}`).then(res => res.json());

export const saveSportsman = data =>
    fetch('/saveSportsman', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

export const editSportsman = data =>
    {
        console.log("onEdit", data);
        fetch('/editSportsman', {
            method: 'post',
            headers: {
            Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    export const deleteSportsman = data =>
    fetch('/deleteSportsman', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
