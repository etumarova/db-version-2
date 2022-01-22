const setIndexToObject = (obj, index) => {
    return {...obj, index: index + 1}
}

const searchByName = (data, value, setFormattedUsers) => {
    const searchedUsers = data.filter((person) => {
        return person.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    })

    setFormattedUsers(searchedUsers)
}

export {
    setIndexToObject,
    searchByName,
}


