/* eslint-env jest */
import getDisplayName from './getDisplayName';

describe('getDisplayName()', () => {
	const MyPureFunction = () => {};
	MyPureFunction.displayName = 'MyPureFunction123';

	const MyPureFunction2 = () => {};
	MyPureFunction2.displayName = 'MyPureFunction2222';

	const io = [[
		class MyComponent {
			static displayName = 'MySuperAwesomeComponent'
		},
		'MySuperAwesomeComponent',
	], [
		MyPureFunction,
		'MyPureFunction123',
	], [
		MyPureFunction2,
		'MyPureFunction2222',
	]];

	io.forEach((test) => {
		it(`getDisplayName()${test[0]} should return ${test[1]}`, () => expect(getDisplayName(test[0])).toBe(test[1]));
	});

	const io2 = [
		class MyNamelessClass { a = 0 },
		function MyNameLessfunction() { return 0; },
		() => 0,
	];

	io2.forEach((test) => {
		it(`getDisplayName()${test} should return a generated name`, () => expect(getDisplayName(test).startsWith('unnamed-component')).toBe(true));
	});
});
