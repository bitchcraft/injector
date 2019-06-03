// @flow
import uuid from 'uuid/v4';
import type { WrapperComponentType } from './typedef';


/**
 * Retrieves the explicitely set displayName of a React Component.
 * Sets a unique displayName if the component does not have a displayName.
 *
 * @private
 * @func   getDisplayName
 * @param  {ReactElement} Component
 * @return {string}                 - displayName
 */
const getDisplayName = (Component: WrapperComponentType): string => {
	if (Component.displayName) return String(Component.displayName);
	const displayName = `unnamed-component-${uuid()}`;
	return displayName;
};

export default getDisplayName;
