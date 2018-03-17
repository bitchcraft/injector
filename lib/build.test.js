/* eslint-env jest */
import injectorLoader from './webpack-loaders/injector-loader';
import { withInjector, InjectorWebpackConfig } from './injector.es5';

describe('default module', () => {
	it('should export withInjector', () => expect(typeof withInjector).toBe('function'));
	it('InjectorWebpackConfig', () => expect(typeof InjectorWebpackConfig).toBe('object'));
	it('InjectorWebpackConfig.rules', () => expect(Array.isArray(InjectorWebpackConfig.rules)).toBe(true));
	it('InjectorWebpackConfig.resolveLoader', () => expect(typeof InjectorWebpackConfig.resolveLoader).toBe('object'));
});

describe('injectorLoader', () => {
	it('should export injectorLoader', () => expect(typeof injectorLoader).toBe('function'));
});
