require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const axios = require('axios').default;

const CompetitionModel = require('./config/competition.model');
const SchoolModel = require('./config/school.model');
const SportsmanModel = require('./config/sportsman.model');
const TrainerModel = require('./config/trainer.model');
const EntryModel = require('./config/entry.model');
const UserModel = require('./config/user.model');

app.use(express.json());

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
    UserModel.find()
        .then(users => res.json({ users }))
        .catch(error => res.status(500).json(error.toString()));
});

app.post('/deleteUser', (req, res) => {
    const {_id} = req.body;

    UserModel.deleteOne({_id: _id})
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
    window.alert("123");
});

app.post('/checkUserRole', async (req, res) => {
    try {
        const userData = req.body;
        const userId = userData.sub;

        const existingUser = await UserModel.findOne({ userId });
        const isUserAdmin = existingUser && existingUser.isAdmin;

        if (!existingUser) {
            await UserModel.create({ userId, name: userData.name, email: userData.email });
        }

        res.json({ isAdmin: isUserAdmin, existingUser });
    } catch (error) {
        res.status(500).json({ message: `Something went wrong while registering: ${error}` });
    }
});

// 
app.get('/schools', (req, res) => {
    SchoolModel.find()
        .then(school => res.json(school))
        .catch(e => e.sen);
});

app.get('/school', (req, res) => {
    const { userId } = req.query;
    SchoolModel.findOne({ userId })
        .then(school => res.json({ school }))
        .catch(e => console.log(e));
});

app.get('/schoolById/:id', (req, res) => {
    const { id } = req.params;
    SchoolModel.findById(id)
        .then(school => res.json({ school }))
        .catch(e => res.status(500).json(e.toString()));
});

app.post('/deleteSchool', (req, res) => {
    const {_id} = req.body;

    SchoolModel.deleteOne({_id: _id})
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
        window.alert("123");
});

app.post('/schools/save', (req, res) => {
    const {
        userId,
        photo,
        name,
        director,
        deputeDirector,
        directorPhone,
        email,
        typeSport,
        description,
        region,
        city,
        address,
        telephone,
        listInventories,
    } = req.body;

    SchoolModel.find({ userId })
        .then(data => {
            if (data.length == 0) {
                SchoolModel.create({
                    userId,
                    photo,
                    name,
                    director,
                    deputeDirector,
                    directorPhone,
                    email,
                    typeSport,
                    description,
                    region,
                    city,
                    address,
                    telephone,
                    listInventories,
                });
            }
        })
        .then(() => res.sendStatus(200))
        .catch(error => {
            res.status(500).json(error.toString());
        });
});

app.post('/schools/edit', (req, res) => {
    const {
        _id,
        userId,
        photo,
        name,
        director,
        deputeDirector,
        directorPhone,
        email,
        typeSport,
        description,
        region,
        city,
        address,
        telephone,
        listInventories
    } = req.body;


    SchoolModel.updateOne(
        {
            _id: _id,
        },
        {
            $set: {
                userId,
                photo,
                name,
                director,
                deputeDirector,
                directorPhone,
                email,
                typeSport,
                description,
                region,
                city,
                address,
                telephone,
                listInventories,
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

app.get('/entries', async (req, res) => {
    try {
        const query = buildMongoQuery(['schoolId', 'competitionId'], req.query);

        const entries = await EntryModel.find(query);
        res.json({ entries });
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

app.get('/entries/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const entry = await EntryModel.findById(id);
        res.json({ entry });
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

app.post('/entries/save', (req, res) => {
    const { competitionId, schoolId, trainer, telephone, dateSend, sportsmenList } = req.body;

    EntryModel.create({
        competitionId,
        schoolId,
        trainer,
        telephone,
        dateSend,
        sportsmenList,
    })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/entries/edit', (req, res) => {
    const { _id, competitionId, schoolId, trainer, telephone, dateSend, sportsmenList } = req.body;

    EntryModel.updateOne(
        {
            _id: _id,
        },
        {
            $set: {
                competitionId,
                schoolId,
                trainer,
                telephone,
                dateSend,
                sportsmenList,
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
    CompetitionModel.find()
        .then(competitions => res.json({ competitions }))
        .catch(e => res.status(500).json(e.toString()));
});

app.get('/competitions/:id', (req, res) => {
    const { id } = req.params;

    CompetitionModel.findById(id)
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
        email,
        discipline,
    } = req.body;

    CompetitionModel.create({
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
        email,
        discipline,
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
        email,
        discipline,
    } = req.body;

    CompetitionModel.updateOne(
        {
            _id: _id,
        },
        {
            $set: {
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
                email,
                discipline,
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
    const query = buildMongoQuery(['schoolId', 'nowTrainer'], req.query);
    SportsmanModel.find(query)
        .populate('nowTrainer', 'name')
        .then(sportsmen => res.json({ sportsmen }))
        .catch(e => res.status(500).json(e.toString()));
});

app.get('/sportsmen/:id', (req, res) => {
    const { id } = req.params;
    SportsmanModel.findById(id)
        .populate('nowTrainer', 'name')
        .then(sportsman => res.json({ sportsman }))
        .catch(e => res.status(500).json(e.toString()));
});

app.post('/saveSportsman', (req, res) => {
    const {
        schoolId,
        photo,
        enrolmentDate,
        placeStudy,
        name,
        birthday,
        fTrainer,
        nowTrainer,
        school,
        address,
        telephone,
        listResults,
        unenrolmentDate,
        causeUnenrolment,
        anthropometricData,
        mum,
        mumPhone,
        dad,
        dadPhone,
        livingAddress, 
    } = req.body;

    SportsmanModel.create({
        schoolId,
        photo,
        enrolmentDate,
        placeStudy,
        name,
        birthday,
        fTrainer,
        nowTrainer,
        school,
        address,
        telephone,
        listResults,
        unenrolmentDate,
        causeUnenrolment,
        anthropometricData,
        mum,
        mumPhone,
        dad,
        dadPhone,
        livingAddress, 
    })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/deleteSportsman', (req, res) => {
    const {_id} = req.body;

    SportsmanModel.deleteOne({_id: _id})
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/deleteCompetitions', (req, res) => {
    const {_id} = req.body;

    CompetitionModel.deleteOne({_id: _id})
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/deleteTrainer', (req, res) => {
    const {_id} = req.body;

    TrainerModel.deleteOne({_id: _id})
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/editSportsman', (req, res) => {
    const {
        _id,
        schoolId,
        photo,
        name,
        enrolmentDate,
        placeStudy,
        birthday,
        fTrainer,
        nowTrainer,
        school,
        address,
        telephone,
        listResults,
        unenrolmentDate,
        causeUnenrolment,
        anthropometricData,
        mum,
        mumPhone,
        dad,
        dadPhone,
        livingAddress, 
    } = req.body;

    SportsmanModel.updateOne(
        {
            _id: _id,
        },
        {
            $set: {
                schoolId,
                photo,
                enrolmentDate,
                placeStudy,
                name,
                birthday,
                fTrainer,
                nowTrainer,
                school,
                address,
                telephone,
                listResults,
                unenrolmentDate,
                causeUnenrolment,
                anthropometricData,
                mum,
                mumPhone,
                dad,
                dadPhone,
                livingAddress, 
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
    const query = buildMongoQuery(['schoolId'], req.query);

    TrainerModel.find(query)
        .then(trainers => res.json({ trainers }))
        .catch(e => res.status(500).json(e.toString()));
});

app.get('/trainers/:id', (req, res) => {
    const { id } = req.params;
    TrainerModel.findById(id)
        .then(trainer => res.json({ trainer }))
        .catch(e => res.status(500).json(e.toString()));
});

app.post('/saveTrainer', (req, res) => {
    const {
        schoolId,
        photo,
        name,
        birthday,
        school,
        telephone,
        education,
        laborCategory,
        studentNumber,
    } = req.body;

    TrainerModel.create({
        schoolId,
        photo,
        name,
        birthday,
        education,
        laborCategory,
        studentNumber,
        school,
        telephone,
    })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err.toString()));
});

app.post('/editTrainer', (req, res) => {
    const {
        _id,
        schoolId,
        photo,
        name,
        birthday,
        school,
        telephone,
        education,
        laborCategory,
        studentNumber,
    } = req.body;
    TrainerModel.updateOne(
        {
            _id: _id,
        },
        {
            $set: {
                schoolId,
                photo,
                name,
                birthday,
                education,
                laborCategory,
                studentNumber,
                school,
                telephone,
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

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use('/', express.static(path.join(__dirname, 'client/build')));
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log('MongoDb connected');

        app.listen(PORT, () => {
            console.log(`listening on *:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
})();
