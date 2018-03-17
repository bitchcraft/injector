// @flow
import { Component, createElement } from 'react';
import shallowEqual from 'recompose/shallowEqual';

import { injectStyles, removeStyles } from './styles';
import getDisplayName from './getDisplayName';

import type { HandlebarsTemplate, Styles, WrapperComponentType } from './typedef';


/**
 * Higher order component that wraps a ReactJS Component, PureComponent or
 * Pure Function
 *
 * @public
 * @func     withInjector
 * @memberof module:Injector
 * @param    {HandlebarsFunction} template              - the styles template
 * @param    {Function}           styles                - returns the variable replacements for the template
 * @param    {Object}             options               - overrides
 * @param    {string}             [options.displayName] - override displayName
 * @param    {Object}             [options.theme]       - override theme
 * @return   {Function}                                 - returns a function
 */
export default function inject(
	template: HandlebarsTemplate = () => '',
	styles?: Styles = t => ({}),
	options?: { [string]: *, }) {
	return function wrapWithInjector(WrappedComponent: WrapperComponentType) {
		class StyleInjector extends Component<{}, {}> {
			static displayName = `StyleInjector(${getDisplayName(WrappedComponent)})`

			componentWillMount() {
				if (!options) options = { theme: {} };
				const result = injectStyles(WrappedComponent, template, styles, this.context.theme || options.theme, options);
				this.stylesheetID = result.id;
				this.stylesheetComponentIdKey = result.componentIdKey;
			}

			shouldComponentUpdate(nextProps: {}, nextState: {}) {
				return !shallowEqual(nextProps, this.props)
					|| !shallowEqual(nextState, this.state);
			}

			componentWillUnmount() {
				removeStyles(this.stylesheetID, this.stylesheetComponentIdKey);
			}

			render() {
				const { props } = this;
				return createElement(WrappedComponent, {
					...props,
				});
			}

			stylesheetID = ''
			stylesheetComponentIdKey = ''
		}

		return StyleInjector;
	};
}
