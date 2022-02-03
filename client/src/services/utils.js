const setIndexToObject = (obj, index) => {
    return {...obj, index: index + 1}
}

const searchByName = (data, value, setFormattedUsers) => {
    const searchedUsers = data.filter((person) => {
        return person.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    })

    setFormattedUsers(searchedUsers)
}

const readFileAsBase64 = (file, callback) => {
    const reader = new FileReader();

    reader.onload = (e) => {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

const downloadFileByUrl = (fileName, urlOrBase64) => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = urlOrBase64;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

export {
    setIndexToObject,
    searchByName,
    readFileAsBase64,
    downloadFileByUrl,
}


