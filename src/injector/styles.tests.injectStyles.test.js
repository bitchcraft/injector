/* eslint-env jest */
import { injectStyles } from './styles';
import { JSDOM as Jsdom } from 'jsdom';

// mock browser
const dom = new Jsdom('<!DOCTYPE html><html><head></head><body></body></html>');
global.window = dom.window;
global.document = dom.document;

const template = ({ color }) => `\n.body {\ncolor: ${color};\n}\n`;
class SomeComponent { static displayName = 'SomeComponent' }
class SomeOtherComponent { static displayName = 'SomeOtherComponent' }

const components = [{
	component: SomeComponent,
	styles: theme => ({
		color: 'red',
	}),
	theme: {},
	options: {},
},
{
	component: SomeOtherComponent,
	styles: theme => ({
		color: 'blue',
	}),
	theme: {},
	options: {},
},
{
	component: SomeComponent,
	styles: theme => ({
		color: 'white',
	}),
	theme: {},
	options: {},
}];

const componentIdKeys = [];
const sheetComponentsMap = {};

describe('injectStyles()', () => {
	components.forEach((test) => {
		const {
			component,
			styles,
			theme,
			options,
		} = test;
		const { id, componentIdKey } = injectStyles(component, template, styles, theme, options);

		test.sheetId = id;
		test.componentIdKey = componentIdKey;

		sheetComponentsMap[id] = (sheetComponentsMap[id] || []).concat([ componentIdKey ]);

		it(`should create sheetId 'stylesheet-${test.component.displayName}' for component ${test.component.displayName}`, () => {
			expect(id).toBe(`stylesheet-${test.component.displayName}`);
		});

		it(`should create a unique componentIdKey for component ${test.component.displayName}`, () => {
			expect(componentIdKeys.includes(componentIdKey)).toBe(false);
			componentIdKeys.push(componentIdKey);
		});

		const nodeCandidate = document.querySelector(`[data-injector-id=${id}]`);

		it(`should have a DOM Node with id ${id}`, () => {
			expect(nodeCandidate instanceof HTMLStyleElement).toBe(true);
		});

		it(`DOM Node with id ${id} should have attribute 'data-injector-id' with value '${id}'`, () => {
			expect(nodeCandidate.getAttribute('data-injector-id')).toBe(id);
		});

		it(`DOM Node with id ${id} should have attribute 'type' with value 'text/css'`, () => {
			expect(nodeCandidate.getAttribute('type')).toBe('text/css');
		});

		const expectedStyles = template(components.find(c => c.componentIdKey === sheetComponentsMap[id][0]).styles());

		it(`DOM Node with id ${id} should have textContent '${expectedStyles.replace(/(\n|\r)/gi, ' ')}'`, () => {
			expect(nodeCandidate.textContent.trim()).toBe(expectedStyles.trim());
		});

		it(`should only have a single HTMLStyleElement for ${id}`, () => {
			expect(document.querySelectorAll(`[data-injector-id=${id}]`).length).toBe(1);
		});
	});
});
