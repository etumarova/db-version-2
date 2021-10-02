export const fetchSchools = () => fetch('/schools').then(res => res.json());

export const fetchSchoolByUserId = userId =>
    fetch(`/school/?userId=${userId}`).then(res => res.json());

export const saveSchool = data =>
    fetch('/schools/save', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

export const editSchool = data =>
    fetch('/schools/edit', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
