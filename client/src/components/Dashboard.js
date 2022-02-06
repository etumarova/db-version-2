import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Calendary from 'components/CommonPages/Calendary';
import MySchool from 'components/CommonPages/MySchool';
import CreateEditSchool from 'components/CommonPages/CreateEditSchool';
import MySportsmen from 'components/CommonPages/MySportsmen';
import CreateSportsmen from 'components/CommonPages/CreateSportsmen';
import SportsmenPage from 'components/CommonPages/SportsmenPage';
import MyTrainers from 'components/CommonPages/MyTrainers';
import CreateTrainer from 'components/CommonPages/CreateTrainer';
import TrainerPage from 'components/CommonPages/TrainerPage';
import CreateCompetition from 'components/CommonPages/CreateCompetition';
import CompetitionPage from 'components/CommonPages/CompetitionPage';
import CreateEntries from 'components/CommonPages/CreateEntries';
import MyEntries from 'components/CommonPages/MyEntries';
import EntryPage from 'components/CommonPages/EntryPage';

import AdminSchools from 'components/AdminPages/AdminSchools';
import AdminTrainers from 'components/AdminPages/AdminTrainers';
import AdminSportsmen from 'components/AdminPages/AdminSportsmen';
import AdminEntries from 'components/AdminPages/AdminEntries';
import AdminPage from 'components/AdminPages/AdminPage';
import ImportResult from 'components/AdminPages/ImportResults';

import PrivateRoute from 'components/PrivateRoute';

import { UserContext } from 'context/UserContext';
import { UserRole } from 'srcConstants';
import { ruRU } from '@material-ui/data-grid';
import { createTheme, ThemeProvider } from '@material-ui/core';

const adminPanelItems = [
    { text: 'Школы', path: '/adminSchools' },
    { text: 'Тренеры', path: '/adminTrainers' },
    { text: 'Спортсмены', path: '/adminSportsmen' },
    { text: 'Календарь соревнований', path: '/calendary' },
    { text: 'Заявки', path: '/adminEntries' },
    { text: 'Админка', path: '/adminPage' },
    // { text: 'Загрузка результатов', path: '/adminImportFile' },
];
const userPanelItems = [
    { text: 'Моя Школа', path: '/mySchool' },
    { text: 'Мои Спортсмены', path: '/mySportsmen' },
    { text: 'Тренерский состав', path: '/myTrainers' },
    { text: 'Календарь соревнований', path: '/calendary' },
    { text: 'Сформировать заявку', path: '/myEntries' },
];

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        minHeight: '100vh',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
    },
}));

const theme = createTheme({}, ruRU);
function Dashboard() {
    const classes = useStyles();
    const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkUserRole = async () => {
            const res = await fetch(`/checkUserRole/`, {
                method: 'post',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const { isAdmin } = await res.json();

            if (isAdmin) setIsAdmin(true);
        };

        if (isAuthenticated) checkUserRole();
    }, [isAuthenticated, user]);

    const shouldRenderDrawer = isAuthenticated;
    const drawerItems = isAdmin ? adminPanelItems : userPanelItems;

    const userContextValues = useMemo(
        () => ({
            userRole: isAdmin ? UserRole.Admin : UserRole.User,
            userSub: user?.sub,
            isAuthenticated,
            isAdmin,
        }),
        [isAdmin, user?.sub, isAuthenticated]
    );

    return (
        <ThemeProvider theme={theme}>
            <UserContext.Provider value={userContextValues}>
                <Router>
                    <div className={classes.root}>
                        <CssBaseline />
                        <AppBar position="fixed" className={classes.appBar}>
                            <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" noWrap>
                                    Belarus Wrestling DB
                                </Typography>
                                <div style={{ display: 'flex' }}>
                                    {!isAuthenticated && (
                                        <Button
                                            variant="contained"
                                            onClick={() => loginWithRedirect()}
                                        >
                                            Войти или Зарегистрироваться
                                        </Button>
                                    )}

                                    {isAuthenticated && (
                                        <>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginRight: '2em',
                                                }}
                                            >
                                                <img
                                                    src={user.picture}
                                                    alt={user.name}
                                                    style={{ width: '45px', marginRight: '1em' }}
                                                />
                                                <p style={{ margin: 0 }}>{user.name}</p>
                                            </div>

                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    logout({ returnTo: window.location.origin });
                                                    localStorage.clear();
                                                }}
                                            >
                                                Выйти
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Toolbar>
                        </AppBar>

                        <Drawer
                            className={classes.drawer}
                            variant="permanent"
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            <Toolbar />
                            <div className={classes.drawerContainer}>
                                {isAuthenticated && localStorage.setItem('user', user.sub)}

                                {shouldRenderDrawer && (
                                    <List>
                                        {drawerItems.map(({ text, path }, index) => (
                                            <Link to={path} key={path}>
                                                <ListItem button key={text}>
                                                    {text}
                                                </ListItem>
                                            </Link>
                                        ))}
                                    </List>
                                )}
                            </div>
                        </Drawer>

                        <main className={classes.content}>
                            <Toolbar />

                            <Switch>
                                <PrivateRoute
                                    exact
                                    path="/calendary"
                                    isAdmin={isAdmin}
                                    component={Calendary}
                                />
                                <PrivateRoute path="/competition/:id" component={CompetitionPage} />
                                <PrivateRoute
                                    path="/createCompetition/:id?"
                                    component={CreateCompetition}
                                />
                                <PrivateRoute path="/mySchool/:id?" component={MySchool} />
                                <PrivateRoute
                                    path="/createEditSchool/:id"
                                    component={CreateEditSchool}
                                />
                                <PrivateRoute exact path="/mySportsmen" component={MySportsmen} />
                                <PrivateRoute
                                    path="/createSportsmen/:id?"
                                    component={CreateSportsmen}
                                />
                                <PrivateRoute path="/sportsmen/:id" component={SportsmenPage} />
                                <PrivateRoute exact path="/myTrainers" component={MyTrainers} />
                                <PrivateRoute
                                    path="/createTrainer/:id?"
                                    component={CreateTrainer}
                                />
                                <PrivateRoute path="/trainer/:id" component={TrainerPage} />
                                <PrivateRoute exact path="/myEntries" component={MyEntries} />
                                <PrivateRoute
                                    path="/createEntries/:id?"
                                    component={CreateEntries}
                                />
                                <PrivateRoute path="/entry/:id" component={EntryPage} />
                                <PrivateRoute exact path="/adminSchools" component={AdminSchools} />
                                <PrivateRoute
                                    exact
                                    path="/adminTrainers"
                                    component={AdminTrainers}
                                />
                                <PrivateRoute
                                    exact
                                    path="/adminSportsmen"
                                    component={AdminSportsmen}
                                />
                                <PrivateRoute exact path="/adminEntries" component={AdminEntries} />
                                <PrivateRoute exact path="/adminPage" component={AdminPage} />
                                <PrivateRoute
                                    exact
                                    path="/adminImportFile"
                                    component={ImportResult}
                                />
                            </Switch>
                        </main>
                    </div>
                </Router>
            </UserContext.Provider>
        </ThemeProvider>
    );
}

export default Dashboard;
