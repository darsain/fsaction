const isError = require('is-error');

module.exports = fsa;
fsa.e = fsa.err = fsa.error = fsaError;

function fsa(type, payload, meta) {
	if (!type) {
		throw new Error('action type is required');
	}

	const action = {type};

	if (payload !== undefined) {
		action.payload = unwrap(payload, action);

		if (isError(action.payload)) {
			action.error = true;
		}
	}

	if (meta !== undefined) {
		action.meta = unwrap(meta, action);
	}

	return action;
}

function fsaError() {
	const action = fsa.apply(null, arguments);
	action.error = true;
	return action;
}

function unwrap(val, arg) {
	while (typeof val === 'function') {
		val = val(arg);
	}

	return val;
}
