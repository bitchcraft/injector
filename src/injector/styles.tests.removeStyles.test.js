/* eslint-env jest */
import { injectStyles, removeStyles } from './styles';
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

test('removeStyles()', () => {
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
	});

	components.forEach((test) => {
		const { sheetId, componentIdKey } = test;

		removeStyles(sheetId, componentIdKey);

		sheetComponentsMap[sheetId].splice(sheetComponentsMap[sheetId].indexOf(componentIdKey), 1);
		componentIdKeys.splice(componentIdKey, 1);

		const nodeCandidate = document.querySelector(`[data-injector-id=${sheetId}]`);

		if (sheetComponentsMap[sheetId].length) expect(nodeCandidate instanceof HTMLStyleElement).toBe(true);
		else expect(nodeCandidate).toBeNull();
	});
});
