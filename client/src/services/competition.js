export const fetchCompetitions = () => fetch('/competitions').then(res => res.json());

export const fetchCompetitionById = id => fetch(`/competitions/${id}`).then(res => res.json());

export const saveCompetition = data =>
    fetch('/competitions/save', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

export const editCompetition = data =>
    fetch('/competitions/edit', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

export const deleteCompetition = data =>
    fetch('/deleteCompetitions', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
