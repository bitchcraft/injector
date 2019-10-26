# @bitchcraft/injector

```
  ,   |
  |———|———————=——\
  |———|———————|)  ]%%===———,
  |———|———————=——/        · °
  '   |                  · °
```

[![CircleCI](https://circleci.com/gh/bitchcraft/injector.svg?style=svg&circle-token=316326df0acd10be73ddb1cf55cb7e9d93b63736)](https://circleci.com/gh/bitchcraft/injector)

Inject CSS styles on demand for ReactJS Components. Keeps your DOM lean.

* Exclusively build for ReactJS and Webpack
* Supports themes, including local theme overrides
* Pick your poison: Supports CSS, LESS, SCSS and SASS


## What’s in the bento?

* **withInjector** HoC (higher order component) — conveniently wraps your component and takes care of adding and removing HTMLStyleElements
* **injector-loader** for Webpack (tested w/ `1.14.0`, `3.11.0`) — prepares your valid CSS to be converted into a template
* **Webpack config** fragment (for Webpack 2+) — Webpack 1 user? Update pl0x 😹. Don’t worry, we got you covered. You will find installation instructions for Webpack 1 further down.


### So what does it do?

Inline styles in ReactJS are great for simple tasks. But having to move from a pure function to a stateful Component simply because you need a visual hover effect on that button sucks ass.

Monolithic stylesheets are awesome in terms of features (think break points and less/sass mixins etc.), but as they grow larger they are increasingly harder to maintain and affect browser performance.

Mixing both approaches works reasonably well with smaller applications or cases where visual fidelity is not that important or the tools provided by a style library such as material-ui or react-bootstrap are sufficient to achieve the desired outcome. As soon as you venture into custom looks and even multiple themes monolithic stylesheets become either bloated or you have to add proper tooling. Also synchronizing variables across stylesheets and inline styles is a pain in the ass, that can only be solved by means of redundant variable declarations or again: tooling.

That’s where Injector comes in and tries to give you the best out of all worlds. It follows ReactJS’ fully modular approach. Injector allows you to write modular stylesheets for your components and reuse LESS/SASS mixins and partials. It takes care of adding those styles when and only when the first instance of your component are mounted and remove them when the last instance of your component will be unmounted.

With Injector you will have the ability to use themes and custom overrides, by extending your CSS/LESS/SASS syntax with handlebars variables.

```css
.my-class {
	color: '{{{Colors.primaryHighlightText}}}';
}
```


### Are their alternatives to injector?

Have a look at

- [Radium](https://github.com/FormidableLabs/radium), which is basically React Inline Styles on ’roids!
- [Material UI styles](https://material-ui.com/styles/api/), which supports different ways to inject stylesheets (via classNames and styled components)


### Limitations

* Currently it will probably not work with the awesome [RTLCSS](http://rtlcss.com)
* Because of the way ReactJS context works, on-the-fly theme switching currently still requires you to remount all components


## Installation


### 1) Install injector

Commands provided for Yarn and NPM, please use either (but not both).

```sh
$ yarn add @bitchcraft/injector
$ npm install -P @bitchcraft/injector
```

#### Install peer devDependencies

Technically you only have to install sass-loader if you are using scss/sass. In that case Yarn/NPM will print a unmet peer dependencies warning tho.

```sh
$ yarn add --dev handlebars-loader sass-loader less-loader postcss-loader
$ npm install -D handlebars-loader sass-loader less-loader postcss-loader
```


### 2) Add injector to your `webpack.config.js`


#### Webpack 2+

```js
// webpack.config.js
const { InjectorWebpackConfig } = require('@bitchcraft/injector');

module.exports = {
	// …
	module: {
		rules: [
			// your other module rules config
		].concat(InjectorWebpackConfig.rules),
	},
	resolveLoader: {
		modules: [
			'node_modules',
		].concat(InjectorWebpackConfig.resolveLoader.modules),
	},
	// …
};
```

Create a postcss config:

```js
// postcss.config.js
module.exports = {
	plugins: [ require('autoprefixer') ]
}
```


#### Webpack 1

```js
// webpack.config.js
const { InjectorWebpackConfig } = require('@bitchcraft/injector');
const autoprefixer = require('autoprefixer');

module.exports = {
	// …
	module: {
		loaders: [
			// …
			{
				// SASS (*.sasshbs) and SCSS (*.scsshbs) files
				test: /\.s[ac]sshbs$/,
				loader: 'handlebars-loader!injector-loader!postcss-loader!sass-loader'
			}, {
				// CSS (*.csshbs) and LESS (*.lesshbs) files
				test: /\.(?:c|le)sshbs$/,
				loader: 'handlebars-loader!injector-loader!postcss-loader!less-loader'
			}
		],
	},
	postcss: function () {
        return [autoprefixer];
    },
	resolveLoader: {
		modulesDirectories: [
			'node_modules',
			InjectorWebpackConfig.resolveLoader.modules[0],
		],
	},
	// …
};
```


## Usage


### Components

Write your stylesheet for your component, using CSS, LESS or SASS/SCSS. You can use imports, mixins, partials and all other language features. The only limitation is, that for LESS/SASS your value is a string. So color tools are out of the picture.

```css
/* myComponent.scsshbs */
.my-component {
	color: '{{{color}}}';
	font-size: '{{{fontSize}}}';

	a:visited, a:link {
		text-decoration: underline;
		color: '{{{link.color}}}';
	}

	&.important {
		color: '{{{importantColor}}}';
	}
}
```

You can name your file whatever you like, but the file extension has to be one of these:

| File extension | CSS | LESS | SASS | SCSS |
|:-------------- |:---:|:----:|:----:|:----:|
| `.csshbs`      |  ×  |      |      |      |
| `.lesshbs`     |  ×  |  ×   |      |      |
| `.scsshbs`     |  ×  |      |  ×   |  ×   |
| `.sasshbs`     |  ×  |      |  ×   |  ×   |

Then write your component

```js
import React from 'react';
import { withInjector } from '@bitchcraft/injector';
import stylesheet from 'myComponent.scsshbs';

const MyComponent = ({ children, important }) => (
	// your selectors should match your stylesheet
	<div className={`my-component ${!important ? '' : 'important'}`}>
		<span>This is my link: </span>
		<a href="#">{children}</a>
	</div>
);

// only needed if you use minification in your build pipeline
MyComponent.displayName = 'MyComponent';

// this is your style function, which returns an object with your replacement key/values
const style = () => ({
	color: 'rgba(0, 0, 0, 0.75)',
	fontSize: '35px',
	importantColor: '#f00',
	link: {
		color: 'rgb(0, 20, 80)',
	},
});

// Injector takes care of everything else
export default withInjector(stylesheet, style)(MyComponent);
```


#### Uglify/Minify and other compression/mangle tools

The way most code compression and minification tools work is by replacing long strings in function, class and variable names with shorter ones, and stripping implicit features. That is why you explicitely have to set displayName for your components and pure functions when using Injector.

```js
class MyComponent extends Component {
	static displayName = 'MyComponent'

	render() { … }
}

const MyPureFunction = ({ children }) => …
MyPureFunction.displayName = 'MyPureFunction'
```


### Themes

In order to use themes with Injector, you have to declare them upstream of your components. Your theme is simply an object with key/value pairs.

```js
import React, { PureComponent } from 'react';
import MyComponent from './MyComponent';

class ThemeContainer extends PureComponent {
	static childContextTypes = {
		theme: PropTypes.objectOf(PropTypes.any),
	}

	getChildContext() {
		return {
			theme: {
				Colors: {
					important: '#ff0000',
					defaultText: '#ff42a0',
					defaultLink: 'rgb(0, 20, 80)',
				},
				Sizes: {
					large: '35px',
				},
			},
		};
	}

	render() {
		return <MyComponent/>;
	}
}
```

Now you can use that theme in the style function of your component.

```js
// …

const style = (Theme) => ({
	color: Theme.Colors.defaultText,
	fontSize: Theme.Sizes.Text.large,
	importantColor: Theme.Colors.important,
	link: {
		color: Theme.Colors.defaultLink,
	},
});

export default withInjector(stylesheet, style)(MyComponent);
```


#### Overriding themes

You can override themes on a per Injector (= per Component) basis. If you have a light and a dark theme and want to specifically always use the dark theme in your component you could do this:

```js
import DarkTheme from './DarkTheme.json';
/*
	rest of your imports, component declaration, style function, etc.
 */

const options = {
	theme: DarkTheme,
};

export default withInjector(stylesheet, style, options)(MyComponent);
```

## API

### withInjector

Higher order component that wraps a ReactJS Component, PureComponent or Pure Function.

Composable (tested with recompose).

```js
withInjector(stylesheet, styles, options)(ReactComponent)
```

| Name                | Type                                |            | Description                                        |
| ------------------- | ----------------------------------- | ---------- | -------------------------------------------------- |
| stylesheet          | HandlebarsTemplate                  | *Required* | the styles template                                |
| styles              | `function(theme: Object) => Object` | *Required* | returns the variable replacements for the template |
| options             | Object                              |            | overrides                                          |
| options.theme       | Object                              |            | override theme                                     |
| options.displayName | string                              |            | override (or set) Component displayName            |


# Help and feedback

Please file issues in [Github](https://github.com/bitchcraft/timestamp/issues)


# Contribute

We are open for PRs. Please respect to the linting rules.

* Can you write Webpack Plugins? We want to migrate the current loader template based approach to a plugin


# License

Injector is free software und the BSD-3-Clause (see [LICENSE.md](./LICENSE.md)).


# Contributors

* [Josh Li](https://github.com/maddrag0n) (Maintainer)
