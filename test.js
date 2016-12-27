import test from 'ava';
import fsa from '.';

test('no type throws', t => {
	t.throws(() => fsa());
});

test('type', t => {
	t.deepEqual(fsa('FOO'), {type: 'FOO'});
});

test('type + payload', t => {
	t.deepEqual(fsa('FOO', 42), {type: 'FOO', payload: 42});
});

test('type + meta', t => {
	t.deepEqual(fsa('FOO', undefined, 'bar'), {type: 'FOO', meta: 'bar'});
});

test('type + payload + meta', t => {
	t.deepEqual(fsa('FOO', 42, 'bar'), {type: 'FOO', payload: 42, meta: 'bar'});
});

test('type + payload fn + meta fn', t => {
	const p = () => 42;
	const m = () => 'bar';
	t.deepEqual(fsa('FOO', p, m), {type: 'FOO', payload: 42, meta: 'bar'});
});

test('type + payload factory fn + meta factory fn', t => {
	const p = () => () => () => () => 42;
	const m = () => () => () => () => 'bar';
	t.deepEqual(fsa('FOO', p, m), {type: 'FOO', payload: 42, meta: 'bar'});
});

test('type + payload error', t => {
	const p = new Error('bar');
	t.deepEqual(fsa('FOO', p), {type: 'FOO', payload: p, error: true});
});

test('type + payload error + meta', t => {
	const p = new Error('bar');
	t.deepEqual(fsa('FOO', p, 'baz'), {type: 'FOO', payload: p, error: true, meta: 'baz'});
});

test('type + payload fn<error>', t => {
	const p = new Error('bar');
	t.deepEqual(fsa('FOO', p, 'baz'), {type: 'FOO', payload: p, error: true, meta: 'baz'});
});

test('type + payload factory fn<error>', t => {
	const e = new Error('bar');
	const p = () => () => () => () => e;
	t.deepEqual(fsa('FOO', p), {type: 'FOO', payload: e, error: true});
});

test('payload fn receives action object', t => {
	t.plan(2);
	const p = action => {
		t.deepEqual(action, {type: 'FOO'});
		return 'bar';
	};
	t.deepEqual(fsa('FOO', p, 'baz'), {type: 'FOO', payload: 'bar', meta: 'baz'});
});

test('meta fn receives action object', t => {
	t.plan(2);
	const m = action => {
		t.deepEqual(action, {type: 'FOO', payload: 'bar'});
		return 'baz';
	};
	t.deepEqual(fsa('FOO', 'bar', m), {type: 'FOO', payload: 'bar', meta: 'baz'});
});

test('#error() forces error flag', t => {
	t.true(fsa.error('FOO').error);
	t.true(fsa.error('FOO', 'bar').error);
	t.true(fsa.error('FOO', 'bar', 'baz').error);
});

test('#e() & #err() are aliases of #error()', t => {
	t.true(fsa.error === fsa.err);
	t.true(fsa.error === fsa.e);
});
