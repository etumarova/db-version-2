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

const server = app.listen(PORT, () => {
    console.log('listening on *:3001');
});

mongoose
    .connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDb connected'))
    .catch(e => console.log(e));

mongoose.set('useCreateIndex', true);

const buildMongoQuery = (possibleQueryParams, reqQuery) => {
    const queryEntries = possibleQueryParams
        .map(param => [param, reqQuery[param]])
        .filter(entry => entry[1]);

    // const query = Object.fromEntries(queryEntries); add polyfills/core-js?
    const query = {};
    queryEntries.forEach(([param, value]) => {
        query[param] = value;
    });

    return query;
};

// todo: code splitting, service routers

// USER

app.get('/users', (req, res) => {
    // fetch additional info from auth0
    users
        .find()
        .then(users => res.json({ users }))
        .catch(e => res.status(500).json(error.toString()));
});

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

// SCHOOLS
app.get('/schools', (req, res) => {
    schools
        .find()
        .then(schools => res.json({ schools }))
        .catch(e => e.sen);
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
        .catch(error => {
            res.status(500).json(error.toString());
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

// ENTRIES / COMPETITIONS

app.get('entries', (req, res) => {});

app.get('/entries', async (req, res) => {
    try {
        const query = buildMongoQuery(['idSchool'], req.query);

        const entryResult = await entries.find(query);
        res.json({ entries: entryResult });
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

app.get('/entries/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const entry = await entries.findById(id);
        res.json({ entry });
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

app.post('/entries/save', (req, res) => {
    const { idCompetition, idSchool, traner, telephone, dateSend, sportsmensList } = req.body;

    entries
        .create({
            idCompetition,
            idSchool,
            traner,
            telephone,
            dateSend,
            sportsmensList,
        })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/entries/edit', (req, res) => {
    const { _id, idCompetition, idSchool, traner, telephone, dateSend, sportsmensList } = req.body;

    entries.updateOne(
        {
            _id: _id,
        },
        {
            $set: {
                idCompetition,
                idSchool,
                traner,
                telephone,
                dateSend,
                sportsmensList,
            },
        },
        (err, result) => {
            if (err) {
                res.status(500).json(err.toString());
            }

            res.sendStatus(200);
        }
    );
});

app.get('/competitions', (req, res) => {
    competitions
        .find()
        .then(competitions => res.json({ competitions }))
        .catch(e => res.status(500).json(e.toString()));
});

app.get('/competitions/:id', (req, res) => {
    const { id } = req.params;

    competitions
        .findById(id)
        .then(competition => res.json({ competition }))
        .catch(e => res.status(500).json(e.toString()));
});

app.post('/competitions/save', (req, res) => {
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
    } = req.body;

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
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/competitions/edit', (req, res) => {
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
    } = req.body;

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
            if (err) {
                res.status(500).json(err.toString());
            }

            res.sendStatus(200);
        }
    );
});

// SPORTSMEN

app.get('/sportsmen', (req, res) => {
    const query = buildMongoQuery(['idSchool', 'nowTrainer'], req.query);
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

// TRAINERS

app.get('/trainers', (req, res) => {
    const query = buildMongoQuery(['idSchool'], req.query);

    traners
        .find(query)
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
