export const fetchCompetitions = () => fetch('/competitions').then(res => res.json());
