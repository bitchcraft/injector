/* eslint-env jest */
import injectorLoader from './index';

describe('injectorLoader()', () => {
	const tests = [{
		in: 'some: \'{{{placeholder}}}\'',
		out: 'some: {{{placeholder}}}',
	}, {
		in: 'some: \'{{placeholder}}\';',
		out: 'some: {{placeholder}};',
	}, {
		in: 'some: \'{{{placeholder}}}\' stuff;',
		out: 'some: {{{placeholder}}} stuff;',
	}, {
		in: 'some: calc(\'{{{placeholder}}}\' - 15px);',
		out: 'some: calc({{{placeholder}}} - 15px);',
	}];

	tests.forEach((test) => {
		it(`('${test.in}') should return '${test.out}'`, () => expect(injectorLoader(test.in)).toBe(test.out));
	});
});
