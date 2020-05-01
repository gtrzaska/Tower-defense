module.exports = function (mongoose) {
	var Schema = mongoose.Schema;

	var userSchema = new Schema({
		name: { type: String, required: true },
		wins: {type: Number, default: 0},
		loses: {type: Number, default: 0}
	})

	var models = {  
		User: mongoose.model("User", userSchema)
	}

	return models;
}