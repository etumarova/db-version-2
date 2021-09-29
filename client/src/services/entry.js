export const fetchEntries = () => fetch('/entries').then(res => res.json());

export const fetchEntriesBySchoolId = schoolId =>
    fetch(`/entries/${schoolId}`).then(res => res.json());
