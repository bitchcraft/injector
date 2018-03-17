/* eslint-env jest */
import { rules, resolveLoader } from './webpack-config';

describe('webpack-config', () => {
	it('should export rules', () => {
		expect(rules).toBeInstanceOf(Array);
		expect(rules.length).toBe(2);
	});

	it('should export resolveLoader', () => {
		expect(typeof resolveLoader).toBe('object');
		expect(resolveLoader.modules).toBeDefined();
	});

	it('someFile.scsshbs should match rules[0].test', () => {
		expect(rules[0].test.test('someFile.scsshbs')).toBe(true);
	});

	it('someFile.sasshbs should match rules[0].test', () => {
		expect(rules[0].test.test('someFile.sasshbs')).toBe(true);
	});

	it('someFile.csshbs should match rules[1].test', () => {
		expect(rules[1].test.test('someFile.csshbs')).toBe(true);
	});

	it('someFile.lesshbs should match rules[1].test', () => {
		expect(rules[1].test.test('someFile.lesshbs')).toBe(true);
	});

	it('someFile.scss should match rules[0].test', () => {
		expect(rules[0].test.test('someFile.scss')).toBe(false);
	});

	it('someFile.sass should match rules[0].test', () => {
		expect(rules[0].test.test('someFile.sass')).toBe(false);
	});

	it('someFile.css should match rules[1].test', () => {
		expect(rules[1].test.test('someFile.css')).toBe(false);
	});

	it('someFile.less should match rules[1].test', () => {
		expect(rules[1].test.test('someFile.less')).toBe(false);
	});
});
