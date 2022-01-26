export const fetchUsers = () => fetch('/users').then(res => res.json());

export const deleteuser = data =>
    fetch('/deleteUser', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
