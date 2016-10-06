var mysqlModel = require('mysql-model');

var MyUserModel = mysqlModel.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'roadtripo',
});

var User = MyUserModel.extend({
    tableName: "users",
});

user = new User();

var findOrCreate = function(profile){
    console.log(profile);
    return null;
}


module.exports = {
    findOrCreate: findOrCreate
}
