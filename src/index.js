import * as webpackConfig from './webpack-config';

export withInjector from './injector';
export const InjectorWebpackConfig = webpackConfig;

// WEBPACK: COPY STATIC FILE ASSETS
/* eslint-disable no-unused-vars */
(() => { require('./injector-loader'); })();
