export const fetchSchools = () => fetch('/schools').then(res => res.json());

export const fetchSchoolByUserId = userId =>
    fetch(`/school/?userId=${userId}`).then(res => res.json());

export const fetchSchoolById = id =>
    fetch(`/schoolById/${id}`).then(res => res.json());

export const saveSchool = data => {
    if(!data.photo) data.photo = "vdsamwwv2pdsgiowvluh";
    fetch('/schools/save', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export const editSchool = data => {
    if(!data.photo) data.photo = "vdsamwwv2pdsgiowvluh";
    console.log("onEditData", data);
    fetch('/schools/edit', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export const deleteSchool = data =>
    fetch('/deleteSchool', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
