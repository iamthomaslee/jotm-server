const promise = require('bluebird');

const options = {
    // Initialization Options
    promiseLib: promise
};

const pgp = require('pg-promise')(options);
const db = pgp(
    {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
        // connectionString: 'postgres://postgres:postgres@localhost:5432/jotm',
    }
);

// add query functions

module.exports = {
    getLocation: getLocation,
    addLocation: addLocation,
};

function getLocation(req, res) {
    const queryStr = `select * from locations where name = '${req.body.name}' limit 1;`;
    db.oneOrNone(queryStr)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                });
        })
        .catch(function (err) {
            return err;
        });
}

function addLocation(req, res) {
    const queryStr = `select count(*) from locations where name = '${req.body.name}';`;
    db.one(queryStr, [], c => +c.count)
        .then(count => {
            if (count === 0) {
                _insertLocation(req, res);
            } else {
                res.status(200)
                    .json({
                        status: 'The location already exist'
                    });
            }
        });
}

function _insertLocation(req, res) {
    const queryStr = `insert into locations(name, lat, lng) values('${req.body.name}', '${req.body.lat}', '${req.body.lng}');`;
    db.none(queryStr)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Added a location'
                });
        })
}