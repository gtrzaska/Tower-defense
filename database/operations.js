module.exports = function () {

	var opers = {
		createUser: function(Model, user) {
			Model.find({ name: user.name }, function (err, data) {
				if (err) {
					return console.error("error: " + err);
				}
				
				if (data == "" || data == null) {
					user.save(function (error, user) {
						console.log("dodano uzytkownika " + user)
					})
				}
			})
		},

		updateWins: function (Model, name, newWins) {
			Model.update({ name: name }, { wins: newWins }, function (err, data) {
				if (err) {
					return console.error(err);
				}

				console.log(data);
			})
		},

		updateLoses: function (Model, name, newLoses) {
			Model.update({ name: name }, { loses: newLoses }, function (err, data) {
				if (err) {
					return console.error(err);
				}

				console.log(data);
			})
		},

		getStats: function (Model, name, callback) {
			var obj = {};
			Model.find({name: name}, function (err, data) {
				if (err) {
                    obj.data = err
                }
                else {
                    obj.data = data
                }
                callback( obj);
			})
		},

		deleteAll: function (Model) {
			Model.remove(function (err, data) {
				if (err) return console.error(err);
				console.log(data);
			})
		},
	}

	return opers;
}