// @flow
import uuid from 'uuid/v4';
import UnicornLogger from '@bitchcraft/unicorn-logger';
import getDisplayName from './getDisplayName';
import type {
	HandlebarsTemplate,
	Styles,
	Theme,
	WrapperComponentType,
} from './typedef';

const logger = new UnicornLogger('injector');


/**
 * Stylesheet / Component instance registry
 *
 * @private
 * @type {Map}
 */
const stylesheets = new Map();


/**
 * injects styles into head of dom at runtime
 * @private
 * @func   injectStyles
 * @param  {ReactComponent}     WrappedComponent      - the component that injects the styles
 * @param  {HandlebarsFunction} template              - the styles template
 * @param  {Function}           styles                - returns the variable replacments for the template
 * @param  {Object}             theme                 - the theme variables for the styles function
 * @param  {Object}             options               - overrides
 * @param  {string}             [options.displayName] - override displayName
 * @param  {Object}             [options.theme]       - override theme
 * @return {Object}             - id (stylesheetId), componentIdKey (instance uuid), noop (true when window === undefined)
 */
export const injectStyles = (
	WrappedComponent: WrapperComponentType,
	template: HandlebarsTemplate,
	styles: Styles,
	theme: Theme,
	options: {
		displayName?: string,
		theme?: Theme,
		[string]: *, },
) => {

	const stylesheetComponentIdKey = uuid();
	const displayName: string = options.displayName || getDisplayName(WrappedComponent);
	WrappedComponent.displayName = displayName;
	const stylesheetId = `stylesheet-${displayName}`;

	if (typeof window !== 'undefined') {
		const currentStylesheetKeyList = stylesheets.get(stylesheetId);

		if (!Array.isArray(currentStylesheetKeyList) || !currentStylesheetKeyList.length) {
			const injectedStylesheet = document.querySelector(`[data-cssorid=${stylesheetId}]`);
			if (injectedStylesheet && injectedStylesheet.parentNode) {
				injectedStylesheet.parentNode.removeChild(injectedStylesheet);
			}

			logger.groupCollapsed(`injecting new styles for ${displayName}`)
				.log(stylesheetId, { theme: styles(theme), stylesheets });

			const stylesheet = document.createTextNode(template(styles(theme)));
			const sheet = document.createElement('style');
			sheet.setAttribute('type', 'text/css');
			sheet.setAttribute('data-injector-id', stylesheetId);
			sheet.appendChild(stylesheet);

			const head = document.getElementsByTagName('head')[0];

			if (options.prepend && head.firstChild) head.insertBefore(sheet, head.firstChild);
			else head.appendChild(sheet);

			stylesheets.set(stylesheetId, [ stylesheetComponentIdKey ]);
			logger.log(`stylesheet ${stylesheetId} added`).groupEnd();

		} else {
			currentStylesheetKeyList.push(stylesheetComponentIdKey);
			stylesheets.set(stylesheetId, currentStylesheetKeyList);
		}

	}

	return {
		id: stylesheetId,
		componentIdKey: stylesheetComponentIdKey,
		noop: typeof window === 'undefined',
	};
};


/**
 * unmounts styles from DOM
 *
 * @private
 * @func   removeStyles
 * @param  {string} id             - stylesheet ID
 * @param  {string} componentIdKey - instance ID
 * @return {void}
 */
export const removeStyles = (id: string, componentIdKey: string) => {
	if (typeof window === 'undefined') return;

	// remove instance from registry
	const currentStylesheetKeyList = stylesheets.get(id);
	if (Array.isArray(currentStylesheetKeyList)) {
		const currentIndexOf = currentStylesheetKeyList.indexOf(componentIdKey);
		currentStylesheetKeyList.splice(currentIndexOf, 1);
		stylesheets.set(id, currentStylesheetKeyList);
	}

	// do not remove stylesheet, if there are still registered instances
	const stylesheet = stylesheets.get(id);
	if (Array.isArray(stylesheet) && stylesheet.length > 0) return;

	// attempt to remove stylesheet
	logger.log(`removing stylesheet ${id}`);
	const injectedSheets = document.querySelectorAll(`[data-injector-id=${id}]`);
	if (injectedSheets.length) {
		injectedSheets.forEach((injectedSheet) => {
			if (injectedSheet && injectedSheet.parentNode) {
				injectedSheet.parentNode.removeChild(injectedSheet);
			}
		});
	}
};
