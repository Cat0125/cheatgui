const cheatgui = (function () {
	/**
	 * The function $ is a shorthand for document.querySelector that allows for specifying a parent
	 * element.
	 * 
	 * @param {String} selector - The selector parameter is a string that represents a CSS selector. It is used to
	 * select elements from the DOM.
	 * @param {String} [parent] - The parent parameter is an optional parameter that specifies the parent element
	 * within which the selector should be searched. If no parent element is provided, the default value
	 * is the document object, which represents the entire HTML document.
	 * @returns the result of calling `querySelector` on the `parent` element with the given `selector`.
	 */
	function $(selector, parent = document) {
		if (typeof selector !== 'string') return selector;
		return $(parent).querySelector(selector);
	}

	/**
	 * The function "createElem" creates a new HTML element with the specified name.
	 * 
	 * @param {String} name - The name parameter is a string that represents the name of the HTML element you want
	 * to create.
	 * @returns a newly created HTML element with the specified name.
	 */
	function createElem(name) {
		return document.createElement(name);
	}

	/**
	 * The function calculates the distance between two points in a two-dimensional plane.
	 * 
	 * @param {Number} x1 - The x-coordinate of the first point.
	 * @param {Number} y1 - The y-coordinate of the first point.
	 * @param {Number} x2 - The x-coordinate of the second point.
	 * @param {Number} y2 - The y-coordinate of the second point.
	 * @returns the distance between two points in a two-dimensional plane.
	 */
	function distance(x1, y1, x2, y2) {
		const a = x1 - x2;
		const b = y1 - y2;
		return Math.sqrt(a * a + b * b);
	}

	/**
	 * The function generates a random string of a specified length using a given set of characters.
	 * 
	 * @public
	 * 
	 * @param {Number} length - The length parameter specifies the length of the generated ID.
	 * @param {String} [_chars] - The `_chars` parameter is an optional parameter that allows you to specify a
	 * custom set of characters to use for generating the ID. If you don't provide a value for `_chars`,
	 * the function will use the default set of characters which includes lowercase letters, uppercase
	 * letters, and digits.
	 * @returns a randomly generated string of characters with the specified length.
	 */
	function generateId(length, _chars = '') {
		const chars = _chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars[Math.floor(Math.random() * chars.length)];
		}
		return result;
	}

	/**
	 * Some useful utilites.
	 * 
	 * Includes:
	 * - `$(selector, parent)` - simplest jQuery analog
	 * - `createElem(type)` - shortcut for `document.createElement()`
	 * - `generateId(length, [_chars])` for generating random strings
	 * - `distance(x1, y1, x2, y2)` for finding distance between two points
	 * - `appendToBody(widget)`
	 * - `includeCSS(css)`, `includeCSSLink(url)` for dynamically loading CSS
	 * - `includeJS(url)`  for dynamically loading JS scripts
	 * - `loadTheme(url)` for loading CheatGUI themes.
	 * 
	 * @public
	 */
	const utils = {
		$,
		createElem,
		generateId,
		distance,

		/**
		 * The function appends a widget to the body of a web page.
		 * 
		 * @param {GUIElement} widget - The "widget" parameter is an object that represents
		 * an UI element or component.
		 */
		appendToBody(widget) {
			document.body.appendChild(widget.getRef());
		},

		/**
		 * The function `includeCSS` is used to dynamically add CSS styles to a web page.
		 * 
		 * @param {String} css - The `css` parameter is a string that represents the CSS code
		 * that you want to include.
		 */
		includeCSS(css) {
			const head = document.head;
			const style = createElem('style');
			style.setAttribute('type', 'text/css');
			style.innerHTML = css;
			head.appendChild(style);
		},

		/**
		 * The function `includeCSSLink` is used to dynamically add a CSS stylesheet
		 * to the HTML document.
		 * 
		 * @param {String} url - The `url` parameter is a string that represents the URL of the
		 * CSS file that you want to include.
		 */
		includeCSSLink(url) {
			const link = createElem('link');
			link.rel = 'stylesheet';
			link.href = url;
			document.head.appendChild(link);
		},

		/**
		 * The function `includeJS` is used to dynamically include an external JavaScript file in a web page.
		 * 
		 * @param {String} url - The URL of the JavaScript file that you want to include in your HTML document.
		 */
		includeJS(url) {
			const script = createElem('script');
			script.src = url;
			document.body.appendChild(script);
		},

		/**
		 * The function `loadTheme` is used to dynamically load a CheatGUI theme by creating a link element and
		 * appending it to the document head, or replacing if already exists.
		 * 
		 * @param {String} url - The `url` parameter is a string that represents the URL of the theme stylesheet that
		 * you want to load.
		 */
		loadTheme(url) {
			const link = $(`link#cgui-theme`, document.head) || createElem('link');
			link.id = 'cgui-theme'
			link.rel = 'stylesheet';
			link.href = url;
			document.head.appendChild(link);
		}
	};

	/**
	 * Base class for everything in CheatGUI.
	 * 
	 * @public
	 */
	class GUIElement {
		constructor() {
			this.ref = null;
		}

		/**
		 * Initialize GUI element.
		 */
		_init() {
			this.addClass('cgui');
		}

		/**
		 * The addClass function adds a specified class name to the element's class list.
		 * 
		 * @param {String} className - The className parameter is a string that represents the class name you want to
		 * add to the element.
		 * @returns The "this" keyword is being returned.
		 */
		addClass(className) {
			this.ref.classList.add(className);
			return this;
		}

		/**
		 * Same to the addClass, but returns itself.
		 * 
		 * Must be used like this:
		 * ```
		 * el.addClasses('class1')('class2')('class3');
		 * ```
		 * 
		 * @param className - The className parameter is a string that represents the name of the class you
		 * want to add to the element's class list.
		 * @returns The method is returning itself.
		 */
		addClasses(className) {
			this.ref.classList.add(className);
			return this.addClasses;
		}

		/**
		 * The function sets the class name of an element.
		 * 
		 * @param {String} className - The className parameter is a string that represents the name of the class you
		 * want to set the element's class list.
		 * @returns the instance of the object on which the method is called.
		 */
		setClass(className) {
			this.ref.className = 'cgui-widget ' + className.trim();
			return this;
		}

		/**
		 * @returns The widget HTML reference
		 */
		getRef() {
			return this.ref;
		}
	}

	/**
	 * Transparent class that allows to manage HTML container.
	 * 
	 * You must call one of `init()` or `mount(target)` before doing something.
	 * 
	 * @public
	 */
	class View {
		constructor() {
			this.ref = null;
		}

		/**
		 * Initialize View as a new HTML element.
		 * 
		 * Must be called before appending sub-elements.
		 */
		init() {
			this.ref = createElem('div');
			return this;
		}

		/**
		 * Mount View to an HTML element that already exists.
		 * 
		 * Must be called before appending sub-elements.
		 * 
		 * @param target - an HTML element to mount view into.
		 */
		mount(target) {
			this.ref = $(target);
			return this;
		}

		/**
		 * Set the View content.
		 * 
		 * @param {String} html - a new content.
		 */
		setContent(html) {
			this.ref.innerHTML = html;
			return this;
		}

		/**
		 * Append sub-element to View.
		 * 
		 * @param {GUIElement} widget - sub-element.
		 */
		append(widget) {
			this.ref.appendChild(widget.getRef());
			return this;
		}
	}

	/**
	 * Class for creating windows.
	 * 
	 * Example:
	 * ```
	 * const window = new cheatgui.Window(100, 200, "My Window", false);
	 * ```
	 * 
	 * @public
	 * 
	 * @param {Number} x - The initial x-coordinate of the window.
	 * @param {Number} y - The initial y-coordinate of the window.
	 * @param {String} name - Initial window title.
	 * @param {Boolean} collapsed - should be window initially collapsed.
	 */
	class Window extends GUIElement {
		constructor(x, y, name = '', collapsed = false) {
			super();
			// Create window element and set its properties
			this.ref = createElem('div');
			this._init();
			this.addClass('cgui-window');
			this.ref.style.position = 'absolute';
			this.ref.role = 'dialog';

			// Create header element and set its properties
			this.headerRef = createElem('div');
			this.headerRef.classList.add('cgui-window-header');

			// Create title element and set its properties
			const titleId = generateId(16);
			this.titleRef = createElem('span');
			this.titleRef.innerHTML = name;
			this.titleRef.id = titleId;
			this.titleRef.className = 'cgui-window-title';
			this.headerRef.appendChild(this.titleRef);
			this.setTitle(name);
			this.ref.setAttribute('aria-labeledby', titleId);

			// Add space after title
			this.headerRef.innerHTML += '&nbsp;';

			// Create arrow element and set its properties
			this.arrowRef = createElem('span');
			this.arrowRef.className = 'cgui-window-arrow';
			this.arrowRef.innerHTML = '▼';
			this.headerRef.appendChild(this.arrowRef);

			// Create content element and set its properties
			const contentId = generateId(16);
			this.contentRef = createElem('div');
			this.contentRef.id = contentId;
			this.contentRef.classList.add('cgui-window-content');
			this.ref.setAttribute('aria-describedby', contentId);

			// Create new View and mount it
			this.view = new View().mount(this.contentRef);

			// Append header and content to the window element
			this.ref.appendChild(this.headerRef);
			this.ref.appendChild(this.contentRef);

			// Set window position
			this.ref.style.left = `${x}px`;
			this.ref.style.top = `${y}px`;

			// Set initial collapsed state
			if (collapsed) this.collapse();

			// Add window to the document body
			document.body.appendChild(this.ref);

			// Initialize draggable, toggle, and activation functionality
			this.initDraggable();
			this.initToggleOnClick();
			this.initActivationOnClick();
		}

		/**
		 * Set the window title.
		 * 
		 * @param {String} html - HTML-formatted title.
		 */
		setTitle(html) {
			this.titleRef.innerHTML = html;
			return this;
		}

		/**
		 * Set the window content.
		 * 
		 * Shortcut for `window.view.setContent(html)`.
		 * 
		 * @param {String} html - HTML-formatted content.
		 */
		setContent(html) {
			this.view.setContent(html);
			return this;
		}

		/**
		 * Append the new element to the window.
		 * 
		 * Shortcut for `window.view.append(widget)`.
		 * 
		 * @param {GUIElement} widget - element to be added.
		 */
		append(widget) {
			this.view.append(widget);
			return this;
		}

		/**
		 * Move the window to new position.
		 * 
		 * @param {Number} x - The x-coordinate to move the window to.
		 * @param {Number} y - The y-coordinate to move the window to.
		 */
		move(x, y) {
			this.ref.style.left = `${x}px`;
			this.ref.style.top = `${y}px`;
			return this;
		}

		/**
		 * Collapse the window.
		 * 
		 * @deprecated
		 */
		close() {
			return this.collapse();
		}

		/**
		 * Expand the window.
		 * 
		 * @deprecated
		 */
		open() {
			return this.expand();
		}

		/**
		 * Collapse the window.
		 */
		collapse() {
			this.ref.classList.add('collapsed');
			this.arrowRef.innerHTML = '◀';
			return this;
		}

		/**
		 * Expand the window.
		 */
		expand() {
			this.ref.classList.remove('collapsed');
			this.arrowRef.innerHTML = '▼';
			return this;
		}

		/**
		 * Toggle the window's collapsed state.
		 */
		toggle() {
			this.ref.classList.toggle('collapsed');
			if (this.ref.classList.contains('collapsed')) {
				this.arrowRef.innerHTML = '◀';
			} else {
				this.arrowRef.innerHTML = '▼';
			}
			return this;
		}

		/** Hide the window. */
		hide() {
			this.ref.style.display = 'none';
			return this;
		}

		/** Show the window. */
		show() {
			this.ref.style.display = 'block';
			return this;
		}

		/**
		 * Init draggable functionality for window.
		 */
		initDraggable(threshold = 10) {
			let startX, startY, offsetX, offsetY, isDragging = false, isMouseDown = false;

			const startDragging = (e) => {
				isDragging = true;
				this.ref.classList.add('cgui-dragging');
			}

			const onMouseDown = (e) => {
				e.preventDefault();
				e = e.touches ? e.touches[0] : e;
				isMouseDown = true;
				startX = e.clientX;
				startY = e.clientY;
				offsetX = e.clientX - this.ref.offsetLeft;
				offsetY = e.clientY - this.ref.offsetTop;
			};

			const onMouseMove = (e) => {
				e = e.touches ? e.touches[0] : e;
				if (!isDragging) {
					if (isMouseDown && distance(startX, startY, e.clientX, e.clientY) > threshold) {
						startDragging();
					}
					else return;
				}
				this.move(e.clientX - offsetX, e.clientY - offsetY);
			};

			const onMouseUp = () => {
				isDragging = isMouseDown = false;
				if (this.ref.classList.contains('cgui-dragging'))
					this.ref.classList.remove('cgui-dragging');
			};

			this.headerRef.addEventListener('mousedown', onMouseDown);
			this.headerRef.addEventListener('touchstart', onMouseDown, {
				passive: true
			});

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('touchmove', onMouseMove);

			document.addEventListener('mouseup', onMouseUp);
			document.addEventListener('touchend', onMouseUp);
		}

		/**
		 * Init toggle on click for window.
		 */
		initToggleOnClick(threshold = 10) {
			let isClick = false,
				startX, startY;
			this.headerRef.addEventListener('pointerdown', e => {
				isClick = true;
				startX = e.clientX;
				startY = e.clientY;
			});
			document.addEventListener('pointermove', e => {
				if (distance(startX, startY, e.clientX, e.clientY) > threshold)
					isClick = false;
			});
			this.headerRef.addEventListener('pointerup', () => {
				if (isClick) this.toggle();
			});
		}

		/**
		 * Init activation on click for window.
		 */
		initActivationOnClick() {
			this.ref.addEventListener('pointerdown', () => {
				[...document.getElementsByClassName('cgui-window')].forEach(win => win.classList.remove('active'));
				this.ref.classList.add('active');
			});
		}

		/** Get window HTML reference. */
		getRef() {
			return this.ref;
		}
	}

	/**
	 * Base class for elements.
	 * 
	 * @public
	 */
	class Element extends GUIElement {
		constructor(elementName = 'div') {
			super();
			this.ref = createElem(elementName);
			this._init();
			this.addClass('cgui-widget');
		}

		/**
		 * Set the element text
		 * 
		 * @param {String} text - HTML-formatted text to be set
		 */
		setText(text) {
			this.ref.innerHTML = text;
			return this;
		}

		/**
		 * Add click event listener.
		 * 
		 * @param f - event listener.
		 */
		onClick(f) {
			this.ref.addEventListener('click', f);
			return this;
		}
	}

	/**
	 * The Text class is a subclass of the Element class that represents a text element
	 * with a default value of an empty string.
	 * 
	 * @public
	 */
	class Text extends Element {
		constructor(text = '') {
			super('div');
			this.addClass('cgui-text');
			this.setText(text);
		}
	}

	/**
	 * Button that can be clicked.
	 * 
	 * @public
	 */
	class Button extends Element {
		constructor(text = '') {
			super('button');
			this.addClass('cgui-btn');
			this.setText(text);
		}
	}

	/**
	 * Input where you can enter text.
	 * 
	 * @public
	 */
	class Input extends Element {
		constructor(text = '') {
			super('input');
			this.addClass('cgui-input');
			this.setText(text);
		}

		/**
		 * Add input event listener.
		 * 
		 * @param f - event listener.
		 */
		onInput(f) {
			this.ref.addEventListener('input', e => f(e, this.getText()));
			return this;
		}

		/**
		 * Set the input text
		 * 
		 * @param {String} text - text to be set
		 */
		setText(text) {
			this.ref.value = text;
			return this;
		}

		/**
		 * Get the input text
		 * 
		 * @returns {String} input's text
		 */
		getText() {
			return this.ref.value;
		}
	}

	/**
	 * Switch that can be toggled.
	 * 
	 * @public
	 */
	class Switch extends Element {
		constructor(text = '') {
			super('label');
			const id = this.id = generateId(16);
			this.ref.for = id;
			this.addClass('cgui-switch');
			this.inputRef = createElem('input');
			this.inputRef.type = 'checkbox';
			this.inputRef.id = id;
			this.ref.appendChild(this.inputRef);
			this.sliderRef = createElem('span');
			this.sliderRef.className = 'cgui-switch-slider';
			this.ref.appendChild(this.sliderRef);
			this.textRef = createElem('span');
			this.textRef.className = 'cgui-switch-text';
			this.textRef.for = id;
			this.ref.appendChild(this.textRef);
			this.setText(text);
		}

		/**
		 * Add change event listener
		 * 
		 * @param {Function} func - event listener
		 */
		onChange(func) {
			this.inputRef.addEventListener('change', e => func(e, this.inputRef.checked));
			return this;
		}

		/**
		 * @return {boolean} Whether the switch is currently on
		 */
		isChecked() {
			return this.inputRef.checked;
		}

		/**
		 * Set new text for the switch
		 * 
		 * @param {String} text - text to be set
		 */
		setText(text) {
			this.textRef.innerHTML = text;
			return this;
		}
	}

	class Tree extends Element {
		constructor(name = '', collapsed = false) {
			super('div');
			this.addClass('cgui-tree');

			// Create header element and set its properties
			this.headerRef = createElem('div');
			this.headerRef.classList.add('cgui-tree-header');

			// Create title element and set its properties
			const titleId = generateId(16);
			this.titleRef = createElem('span');
			this.titleRef.innerHTML = name;
			this.titleRef.id = titleId;
			this.titleRef.className = 'cgui-tree-title';
			this.headerRef.appendChild(this.titleRef);
			this.setTitle(name);

			// Add space after title
			this.headerRef.innerHTML += '&nbsp;';

			// Create arrow element and set its properties
			this.arrowRef = createElem('span');
			this.arrowRef.className = 'cgui-tree-arrow';
			this.arrowRef.innerHTML = '▼';
			this.headerRef.appendChild(this.arrowRef);

			// Create content element and set its properties
			const contentId = generateId(16);
			this.contentRef = createElem('div');
			this.contentRef.id = contentId;
			this.contentRef.classList.add('cgui-tree-content');

			// Create new View and mount it
			this.view = new View().mount(this.contentRef);

			// Append header and content to the tree element
			this.ref.appendChild(this.headerRef);
			this.ref.appendChild(this.contentRef);

			// Set initial collapsed state
			if (collapsed) this.collapse();

			// Initialize toggle functionality
			this.initToggleOnClick();
		}

		/**
		 * Set the tree title.
		 * 
		 * @param {String} html - HTML-formatted title.
		 */
		setTitle(html) {
			this.titleRef.innerHTML = html;
			return this;
		}

		/**
		 * Set the tree content.
		 * 
		 * Shortcut for `tree.view.setContent(html)`.
		 * 
		 * @param {String} html - HTML-formatted content.
		 */
		setContent(html) {
			this.view.setContent(html);
			return this;
		}

		/**
		 * Collapse the tree.
		 */
		collapse() {
			this.ref.classList.add('collapsed');
			this.arrowRef.innerHTML = '◀';
			return this;
		}

		/**
		 * Expand the tree.
		 */
		expand() {
			this.ref.classList.remove('collapsed');
			this.arrowRef.innerHTML = '▼';
			return this;
		}

		/**
		 * Toggle the tree's collapsed state.
		 */
		toggle() {
			this.ref.classList.toggle('collapsed');
			if (this.ref.classList.contains('collapsed')) {
				this.arrowRef.innerHTML = '◀';
			} else {
				this.arrowRef.innerHTML = '▼';
			}
			return this;
		}

		/**
		 * Append the new element to the tree.
		 * 
		 * Shortcut for `tree.view.append(widget)`.
		 * 
		 * @param {GUIElement} widget - element to be added.
		 */
		append(widget) {
			this.view.append(widget);
			return this;
		}

		/**
		 * Init toggle on click for tree.
		 */
		initToggleOnClick(threshold = 10) {
			this.headerRef.addEventListener('click', e => {
				this.toggle();
			});
		}
	}

	return { GUIElement, View, Window, Element, Text, Button, Input, Switch, Tree, utils };
})();

if (typeof module !== 'undefined' && typeof module.exports == 'object') module.exports = cheatgui;
if (typeof globalThis !== 'undefined') globalThis.cheatgui = cheatgui;