// @flow
import type { Element as ReactElement } from 'react';

export type Theme = { [string]: *, };
export type Styles = Theme => { [string]: *, };
export type WrapperComponentType = * => ReactElement<*>;
export type HandlebarsTemplate = { [string]: *, } => string;
