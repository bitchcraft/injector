/* eslint-env jest */
import { withInjector, InjectorWebpackConfig } from './index';

describe('default module', () => {
	it('should export withInjector', () => expect(typeof withInjector).toBe('function'));
	it('InjectorWebpackConfig', () => expect(typeof InjectorWebpackConfig).toBe('object'));
	it('InjectorWebpackConfig.rules', () => expect(Array.isArray(InjectorWebpackConfig.rules)).toBe(true));
	it('InjectorWebpackConfig.resolveLoader', () => expect(typeof InjectorWebpackConfig.resolveLoader).toBe('object'));
});
