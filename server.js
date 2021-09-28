require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');
const PORT = process.env.PORT || 3001;
const axios = require('axios').default;

const competitions = require('./config/competitionSchema');
const schools = require('./config/schoolSchema');
const sportsmens = require('./config/sportsmenSchema');
const traners = require('./config/tranerSchema');
const entries = require('./config/entriesSchema');
const users = require('./config/userSchema');

app.use(express.json());

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.post('/checkUserRole', async (req, res) => {
    try {
        const userData = req.body;
        const userId = userData.sub;

        const user = await users.findOne({ userId });
        const isUserAdmin = user && user.isAdmin;

        if (!user) {
            await users.create({ userId, name: `${userData.firstName} ${userData.lastName}` });
        }

        res.json({ isAdmin: isUserAdmin });
    } catch (error) {
        res.status(500).json({ message: `Something went wrong while registering: ${error}` });
    }
});

app.get('/school', (req, res) => {
    const { userId } = req.query;

    schools
        .findOne({ idUser: userId })
        .then(school => res.json({ school }))
        .catch(e => console.log(e));
});

app.post('/saveSchool', (req, res) => {
    const { idUser, foto, name, director, description, region, city, adress, telephone } = req.body;

    schools
        .find({ idUser: idUser })
        .then(data => {
            if (data.length == 0) {
                schools.create({
                    idUser: idUser,
                    foto: foto,
                    name: name,
                    director: director,
                    description: description,
                    region: region,
                    city: city,
                    adress: adress,
                    telephone: telephone,
                });
            }
        })
        .then(() => res.sendStatus(200))
        .catch(err => {
            socket.emit('saveSchoolFail');
            console.log(err);
        });
});

app.post('/editSchool', (req, res) => {
    const {
        _id,
        idUser,
        foto,
        name,
        director,
        description,
        region,
        city,
        adress,
        telephone,
    } = req.body;

    schools.updateOne(
        {
            _id: _id,
        },
        {
            $set: {
                idUser: idUser,
                foto: foto,
                name: name,
                director: director,
                description: description,
                region: region,
                city: city,
                adress: adress,
                telephone: telephone,
            },
        },
        (err, result) => {
            if (err) {
                res.sendStatus(403);
                console.log(err);
            }

            res.sendStatus(200);
        }
    );
});

app.get('/competitions', async (req, res) => {
    try {
        const competitions = await competitions.find();

        res.json({ competitions });
    } catch (error) {
        res.status(500).json({ message: `Something went wrong while registering: ${error}` });
    }
});

app.get('/entries/:idSchool', async (req, res) => {
    try {
        const idSchool = req.params.idSchool;
        const myEntries = await entries.find({ idSchool });
        const competitionEntries = await competitions.find();

        res.json({ myEntries, competitionEntries });
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

app.get('/sportsmen', (req, res) => {
    const possibleQueryParams = ['idSchool', 'nowTrainer'];
    const queryEntries = possibleQueryParams
        .map(param => [param, req.query[param]])
        .filter(entry => entry[1]);

    // const query = Object.fromEntries(queryEntries); add polyfills/core-js?

    const query = {};
    queryEntries.forEach(([param, value]) => {
        query[param] = value;
    });

    sportsmens
        .find(query)
        .then(sportsmen => res.json({ sportsmen }))
        .catch(e => res.status(500).json(e.toString()));
});

app.get('/sportsmen/:id', (req, res) => {
    const { id } = req.params;
    sportsmens
        .findById(id)
        .then(sportsman => res.json({ sportsman }))
        .catch(e => res.status(500).json(e.toString()));
});

app.post('/saveSportsman', (req, res) => {
    const {
        idSchool,
        foto,
        name,
        birthday,
        fTraner,
        nowTraner,
        school,
        adress,
        telephone,
        listResults,
    } = req.body;

    sportsmens
        .create({
            idSchool: idSchool,
            foto: foto,
            name: name,
            birthday: birthday,
            fTraner: fTraner,
            nowTraner: nowTraner,
            school: school,
            adress: adress,
            telephone: telephone,
            listResults: listResults,
        })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/editSportsman', (req, res) => {
    const {
        _id,
        idSchool,
        foto,
        name,
        birthday,
        fTraner,
        nowTraner,
        school,
        adress,
        telephone,
        listResults,
    } = req.body;

    sportsmens.updateOne(
        {
            _id: _id,
        },
        {
            $set: {
                idSchool: idSchool,
                foto: foto,
                name: name,
                birthday: birthday,
                fTraner: fTraner,
                nowTraner: nowTraner,
                school: school,
                adress: adress,
                telephone: telephone,
                listResults: listResults,
            },
        },
        (err, result) => {
            if (err) {
                res.status(500).json(err.toString());
                return;
            }

            res.sendStatus(200);
        }
    );
});

app.get('/trainers', (req, res) => {
    const { idSchool } = req.query;
    traners
        .find({ idSchool })
        .then(trainers => res.json({ trainers }))
        .catch(e => res.status(500).json(e.toString()));
});

app.get('/trainers/:id', (req, res) => {
    const { id } = req.params;
    traners
        .findById(id)
        .then(trainer => res.json({ trainer }))
        .catch(e => res.status(500).json(e.toString()));
});

app.post('/saveTrainer', (req, res) => {
    const { idSchool, foto, name, birthday, school, telephone } = req.body;

    traners
        .create({
            idSchool,
            foto,
            name,
            birthday,
            school,
            telephone,
        })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/editTrainer', (req, res) => {
    const { _id, idSchool, foto, name, birthday, school, telephone } = req.body;
    traners.updateOne(
        {
            _id: _id,
        },
        {
            $set: {
                idSchool: idSchool,
                foto: foto,
                name: name,
                birthday: birthday,
                school: school,
                telephone: telephone,
            },
        },
        (err, result) => {
            if (err) {
                res.status(500).json(err.toString());
                return;
            }

            res.sendStatus(200);
        }
    );
});

const server = app.listen(PORT, () => {
    console.log('listening on *:3001');
});

const io = socket(server, {
    cors: {
        origin: ['http://localhost:3000'],
        // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        // credentials: true,
    },
    // reconnect: true,
    // transports: ['websocket', 'polling', 'flashsocket'],
});

mongoose
    .connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDb connected'))
    .catch(e => console.log(e));

mongoose.set('useCreateIndex', true);

io.on('connection', function(socket) {
    socket.on('addCompetition', data => {
        const {
            logo,
            name,
            startDate,
            endDate,
            deadLine,
            mainJudge,
            secretary,
            telephone,
            place,
            description,
            discepline,
        } = data;
        competitions
            .create({
                logo: logo,
                name: name,
                startDate: startDate,
                endDate: endDate,
                deadLine: deadLine,
                mainJudge: mainJudge,
                secretary: secretary,
                telephone: telephone,
                place: place,
                description: description,
                discepline: discepline,
            })
            .catch(err => console.log(err));
    });
    socket.on('getCompetition', data => {
        competitions
            .find()
            .then(data => socket.emit('competition', data))
            .catch(err => console.log(err));
    });

    socket.on('getAdminSchools', data => {
        schools
            .find()
            .then(data => socket.emit('adminSchools', data))
            .catch(e => console.log(e));
    });

    socket.on('addSportsmen', data => {
        const {
            idSchool,
            foto,
            name,
            birthday,
            fTraner,
            nowTraner,
            school,
            adress,
            telephone,
            listResults,
        } = data;
        sportsmens
            .find({ name: name })
            .then(data => {
                if (data.length == 0) {
                    sportsmens
                        .create({
                            idSchool: idSchool,
                            foto: foto,
                            name: name,
                            birthday: birthday,
                            fTraner: fTraner,
                            nowTraner: nowTraner,
                            school: school,
                            adress: adress,
                            telephone: telephone,
                            listResults: listResults,
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    });

    socket.on('getAdminSportsmens', data => {
        sportsmens
            .find()
            .then(data => socket.emit('adminSportsmens', data))
            .catch(e => console.log(e));
    });

    socket.on('addTraner', data => {
        const { idSchool, foto, name, birthday, school, telephone } = data;
        traners
            .find({ name: name })
            .then(data => {
                if (data.length == 0) {
                    traners
                        .create({
                            idSchool: idSchool,
                            foto: foto,
                            name: name,
                            birthday: birthday,
                            school: school,
                            telephone: telephone,
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    });

    socket.on('getTraners', data => {
        const { idSchool } = data;
        traners
            .find({ idSchool: idSchool })
            .then(data => socket.emit('traners', data))
            .catch(e => console.log(e));
    });

    socket.on('getAdminTraners', data => {
        traners
            .find()
            .then(data => socket.emit('adminTraners', data))
            .catch(e => console.log(e));
    });

    socket.on('getTranerSportsmens', data => {
        const { name } = data;
        sportsmens
            .find({ nowTraner: name })
            .then(data => socket.emit('tranerSportsmens', data))
            .catch(e => console.log(e));
    });

    socket.on('addEntries', data => {
        const { idCompetition, idSchool, telephone, traner, dateSend, sportsmensList } = data;
        entries
            .create({
                idCompetition: idCompetition,
                idSchool: idSchool,
                traner: traner,
                telephone: telephone,
                dateSend: dateSend,
                sportsmensList: sportsmensList,
            })
            .catch(err => console.log(err));
    });

    socket.on('getEntries', data => {
        entries
            .find()
            .then(data => socket.emit('entries', data))
            .catch(e => console.log(e));
        competitions
            .find()
            .then(data => socket.emit('competitionsEntries', data))
            .catch(e => console.log(e));
    });

    socket.on('getMyEntries', data => {
        const { idSchool } = data;
        entries
            .find({ idSchool: idSchool })
            .then(data => socket.emit('myEntries', data))
            .catch(e => console.log(e));
        competitions
            .find()
            .then(data => socket.emit('myCompetitionsEntries', data))
            .catch(e => console.log(e));
    });

    socket.on('getAdminEntries', data => {
        entries
            .find()
            .then(data => socket.emit('adminEntries', data))
            .catch(e => console.log(e));
    });

    socket.on('getUsers', data => {
        const { message } = data;
        const options = {
            method: 'GET',
            params: { q: 'logins_count:{0 TO *]', search_engine: 'v3' },
            url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
            headers: {
                Authorization: `Bearer ${message}`,
            },
            scope: 'read:user_idp_tokens',
        };

        axios
            .request(options)
            .then(res => res.data)
            .then(data => socket.emit('getUsersData', data))
            .catch(function(error) {
                console.error(error);
            });
    });

    socket.on('deleteUser', data => {
        const { message, idUser } = data;
        const options = {
            method: 'DELETE',
            url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${idUser}`,
            headers: {
                'content-type': 'application/json',
                authorization: 'Bearer ' + message,
                'cache-control': 'no-cache',
            },
            scope: 'delete:users',
        };

        axios
            .request(options)
            .then(function(response) {})
            .catch(function(error) {
                console.error(error);
            });
    });

    socket.on('getAdmins', data => {
        const { token } = data;
        const options = {
            method: 'GET',
            url: `https://${process.env.AUTH0_DOMAIN}.com/api/v2/roles/rol_bEmrSh0gQV4jWfVd/users`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            scope: 'read:users',
        };

        axios
            .request(options)
            .then(res => res.data)
            .then(data => socket.emit('getAdminsData', data))
            .catch(function(error) {
                console.error(error);
            });
    });

    socket.on('editSchool', data => {
        const {
            _id,
            idUser,
            foto,
            name,
            director,
            description,
            region,
            city,
            adress,
            telephone,
        } = data;
        schools.updateOne(
            {
                _id: _id,
            },
            {
                $set: {
                    idUser: idUser,
                    foto: foto,
                    name: name,
                    director: director,
                    description: description,
                    region: region,
                    city: city,
                    adress: adress,
                    telephone: telephone,
                },
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                    socket.emit('editSchoolFail');
                }

                socket.emit('editSchoolSuccess', result);
            }
        );
    });

    socket.on('editTraner', data => {
        const { _id, idSchool, foto, name, birthday, school, telephone } = data;
        traners.updateOne(
            {
                _id: _id,
            },
            {
                $set: {
                    idSchool: idSchool,
                    foto: foto,
                    name: name,
                    birthday: birthday,
                    school: school,
                    telephone: telephone,
                },
            },
            (err, result) => {
                if (err) console.log(err);
            }
        );
    });

    socket.on('editEntries', data => {
        const { _id, idCompetition, idSchool, telephone, traner, dateSend, sportsmensList } = data;
        entries.updateOne(
            {
                _id: _id,
            },
            {
                $set: {
                    idCompetition: idCompetition,
                    idSchool: idSchool,
                    traner: traner,
                    telephone: telephone,
                    dateSend: dateSend,
                    sportsmensList: sportsmensList,
                },
            },
            (err, result) => {
                if (err) console.log(err);
            }
        );
    });

    socket.on('editCompetition', data => {
        const {
            _id,
            logo,
            name,
            startDate,
            endDate,
            deadLine,
            mainJudge,
            secretary,
            telephone,
            place,
            description,
            discepline,
        } = data;
        competitions.updateOne(
            {
                _id: _id,
            },
            {
                $set: {
                    logo: logo,
                    name: name,
                    startDate: startDate,
                    endDate: endDate,
                    deadLine: deadLine,
                    mainJudge: mainJudge,
                    secretary: secretary,
                    telephone: telephone,
                    place: place,
                    description: description,
                    discepline: discepline,
                },
            },
            (err, result) => {
                if (err) console.log(err);
            }
        );
    });

    socket.on('findSportsmen', data => {
        const { id } = data;
        sportsmens
            .find({ _id: id })
            .then(data => socket.emit('resultSportsmen', data))
            .catch(e => console.log(e));
    });
    socket.on('editResult', data => {
        const { _id, listResults } = data;
        sportsmens.updateOne(
            {
                _id: _id,
            },
            {
                $set: {
                    listResults: listResults,
                },
            },
            (err, result) => {
                if (err) console.log(err);
            }
        );
    });
});
