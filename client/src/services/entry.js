export const fetchEntries = () => fetch('/entries').then(res => res.json());
export const fetchEntryById = id => fetch(`/entries/${id}`).then(res => res.json());

export const fetchEntriesByCompetitionId = competitionId =>
    fetch(`/entries/?competitionId=${competitionId}`).then(res => res.json());

export const fetchEntriesBySchoolId = schoolId =>
    fetch(`/entries/?schoolId=${schoolId}`).then(res => res.json());

export const saveEntry = data =>
    fetch('/entries/save', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

export const editEntry = data =>
    fetch('/entries/edit', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
