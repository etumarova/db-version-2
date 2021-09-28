export const fetchEntriesBySchoolId = schoolId =>
    fetch(`/entries/${schoolId}`).then(res => res.json());
