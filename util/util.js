exports.makeError = (message, status) => {
	const error = new Error(message);
	if(status){
		error.status = status;
	} else {
		error.status = 500;
	}
	return error;
};