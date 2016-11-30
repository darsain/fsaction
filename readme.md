# fsaction [![Build Status](https://travis-ci.org/darsain/fsaction.svg?branch=master)](https://travis-ci.org/darsain/fsaction) [![NPM version](https://img.shields.io/npm/v/fsaction.svg)](https://www.npmjs.com/package/fsaction)

Flux Standard Action object creator.

# Installation

```
npm install fsaction
```

# Usage

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

# API

### fsaction(type: string, payload?: any, meta?: any) : object

When `payload` or `meta` are functions, they - and any functions they return - will be called until something else than a function is returned.

```js
expect(fsaction('INCREMENT', () => () => () => 42))).to.deep.equal({
	type: 'INCREMENT',
	payload: 42
});
```

`payload` or `meta` functions receive action object as their 1st argument.

In `payload()`, this object only has a `type` property.

In `meta()`, this object has `type`, maybe `payload`, and maybe `error` properties.

# License

ISC License (ISC)