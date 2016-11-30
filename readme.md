# fsaction [![Build Status](https://travis-ci.org/darsain/fsaction.svg?branch=master)](https://travis-ci.org/darsain/fsaction) [![NPM version](https://img.shields.io/npm/v/fsaction.svg)](https://www.npmjs.com/package/fsaction)

[Flux Standard Action](https://github.com/acdlite/flux-standard-action) object creator.

A little *shorthand* to help creating [flux standard action](https://github.com/acdlite/flux-standard-action) objects.


## Installation

```
npm install fsaction
```


## Usage

```js
import fsaction from 'fsaction';

expect(fsaction('INCREMENT')).to.deep.equal({
	type: 'INCREMENT'
});
expect(fsaction('INCREMENT', 42)).to.deep.equal({
	type: 'INCREMENT',
	payload: 42
});
expect(fsaction('INCREMENT', 42, 'foo')).to.deep.equal({
	type: 'INCREMENT',
	payload: 42,
	meta: 'foo'
});
expect(fsaction('INCREMENT', new Error('foo'))).to.deep.equal({
	type: 'INCREMENT',
	payload: Error<'foo'>,
	error: true
});
expect(fsaction('INCREMENT', (action) => 42, (action) => 'foo'))).to.deep.equal({
	type: 'INCREMENT',
	payload: 42,
	meta: 'foo'
});
```


## API

### fsaction(type: string, payload?: any, meta?: any) : object

When `payload` or `meta` are functions, they - and any functions they return - will be called until something else than a function is returned.

```js
expect(fsaction('INCREMENT', () => () => () => 42))).to.deep.equal({
	type: 'INCREMENT',
	payload: 42
});
```

`payload` or `meta` functions receive action object as their 1st argument.

**payloadCreator(action: object) : payload | payloadCreator**

In `payload()`, this object only has a `type` property.

In `meta()`, this object has `type`, maybe `payload`, and maybe `error` properties.

You should treat this object as read only, as that *is* the resulting FSA object, and modifying it in non-standard way will break FSA compliance.


## Why not [redux-actions](https://github.com/acdlite/redux-actions)?

My actions are usually complex and async, and I prefer them returning a promise instead of an object with promise on its `payload` property, so combined with `redux-thunk` and `redux-promise` I can do stuff like this:

```js
const deleteUser = id => async dispatch => {
	await dispatch(deleteUserData(id));
	return fsaction(DELETE_USER, id);
};
```

If `deleteUserData()` was created with redux-actions' `createAction()`, I'd have to do:

```js
	await dispatch(deleteUserData(id)).payload
```

which just feels weird to me, and doesn't *seem right* ™.

In other words, fsaction provides more control over how your actions look like, and how they work. And you can easily use an arrow to replace the redux-actions' `createAction()`:

```js
const payloadCreator = amount => amount;

// redux-actions' `createAction()`
const increment = createAction('INCREMENT', payloadCreator);

// fsaction
const increment = amount => fsaction('INCREMENT', payloadCreator(amount));
```


## License

ISC License (ISC)