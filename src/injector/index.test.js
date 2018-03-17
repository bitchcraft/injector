/* eslint-env jest */
/* eslint-disable no-unused-vars */
import React from 'react';
import withInjector from './index';
import renderer from 'react-test-renderer';

const MyComponent = ({ children }) => React.createElement('span', { children });
MyComponent.displayName = 'MyComponent';
const stylesheet = values => ({});
const style = theme => ({});
const MyWrappedComponent = withInjector(stylesheet, style)(MyComponent);

test('inject()', () => {
	const component = renderer.create(
		<MyWrappedComponent>I am legion.</MyWrappedComponent>
	);
	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
