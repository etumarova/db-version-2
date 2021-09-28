export const fetchSchoolByUserId = userId =>
    fetch(`/school/?userId=${userId}`).then(res => res.json());

export const saveSchool = data =>
    fetch('/saveSchool', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

export const editSchool = data =>
    fetch('/editSchool', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
