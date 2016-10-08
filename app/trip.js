module.exports = function(app, passport, path, express, mysql, Yelp, rp, request, Promise, _) {

    /* =========== MySql Connection ============ */
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'roadtripo'
    });
    connection.connect();

    app.post('/savetrip', function(req, res, next) {
        var trip = {
            user_id: req.body.user_id,
            trip_name: req.body.trip_name,
            trip_start: req.body.trip_start,
            trip_end: req.body.trip_end,
            trip_details: JSON.stringify (req.body.trip_details)
        };

        connection.query('INSERT INTO trip SET ?', trip, function(err, result) {
            if (!err){
                return res.sendStatus(200);
            }
            else{
                return res.sendStatus(400);
            }

        });
    });
};
