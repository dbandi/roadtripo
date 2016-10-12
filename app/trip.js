module.exports = function(app, passport, path, express, mysql, Yelp, rp, request, Promise, _) {

    /* =========== MySql Connection ============ */
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'roadtripo'
    });
    connection.connect();

    app.get('/gettrips', function(req, res, next) {
        if (typeof req.user !== 'undefined') {
            // If User Logged In
            var user_id = req.user.id;

            connection.query('SELECT * FROM trip WHERE user_id = ?', [user_id], function(err, result) {
                if (!err){
                    return res.send(result);
                }
                else{
                    return res.sendStatus(400);
                }

            });
        }
        else{
            return res.send("unauthorized");
        }
    });

    app.post('/savetrip', function(req, res, next) {
        if (typeof req.user !== 'undefined') {
            console.log(req.body.trip_name);
            console.log(req.body.trip_start);
            console.log(req.body.trip_end);
            var trip = {
                user_id: req.user.id,
                trip_name: req.body.trip_name,
                trip_start: req.body.trip_start,
                trip_end: req.body.trip_end,
                trip_details: JSON.stringify (req.body.trip_details)
            };

            connection.query('INSERT INTO trip SET ?', trip, function(err, result) {
                if (!err){
                    return res.send(result.insertId.toString());
                }
                else{
                    return res.sendStatus(400);
                }

            });
        }
        else{
            return res.send("unauthorized");
        }
    });

    app.post('/updatetrip', function(req, res, next) {
        if (typeof req.user !== 'undefined') {
            var trip_id = req.body.trip_id;
            console.log(trip_id);
            var trip = {
                user_id: req.user.id,
                trip_name: req.body.trip_name,
                trip_start: req.body.trip_start,
                trip_end: req.body.trip_end,
                trip_details: JSON.stringify (req.body.trip_details)
            };

            connection.query('UPDATE trip SET user_id = ?, trip_name = ?, trip_start = ?, trip_end = ?, trip_details = ? WHERE trip_id = ?', [trip.user_id, trip.trip_name, trip.trip_start, trip.trip_end, trip.trip_details, trip_id], function(err, results) {
                if (!err){
                    return res.send(trip_id.toString());
                }
                else{
                    return res.sendStatus(400);
                }

            });
        }
        else{
            return res.send("unauthorized");
        }
    });
};
