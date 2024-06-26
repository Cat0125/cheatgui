/**
 * CheatGUI
 * 
 * @module
 * @author Cat-125
 * @license MIT
 * @see https://github.com/Cat-125/CheatGUI
 */

import '../css/cheatgui.scss';

import { config, getConfig, updateConfig } from './config';
import * as utils from './utils';
import { activeWindow } from './widgets/Window';
export { utils, getConfig, updateConfig };

export {
	GUIElement,
	View,
	Window,
	Widget,
	ValueWidget,
	Text,
	Button,
	Input,
	NumberInput,
	Slider,
	Switch,
	Dropdown,
	Tree,
	Box,
	Row
} from './widgets';

export { activeWindow } from './widgets/Window';


const { createElem } = utils;


/**
 * This function opens a pop-up modal window where the user can select one item from the data.
 * @param {object} options - Options
 * @param {string} [options.title] - The title displayed in the selection window.
 * @param {string[]} [options.items] - The items that will be available for the user to select.
 * @param {boolean} [options.closable=true] - Adds one item to the end to close the menu, returning an index of -1.
 * @returns {Promise} A promise that will resolve with the index of the selected item.
 * @async
 * @public
 */
export function openPopupMenu({
	title,
	items,
	closable = true
}: {
	title: string,
	items: string[],
	closable: boolean
}): Promise<any> {
	return new Promise(resolve => {
		let divWrapper = createElem('div');
		let divPopup = createElem('div');
		let divTitle = createElem('div');
		let divMenu = createElem('div');

		divWrapper.className = 'cgui-popup-menu-wrapper cgui-fadein';
		divPopup.className = 'cgui cgui-popup-menu';
		divTitle.className = 'cgui-popup-menu-title';
		divMenu.className = 'cgui-popup-menu-content';

		divPopup.appendChild(divTitle);
		divPopup.appendChild(divMenu);
		divWrapper.appendChild(divPopup);

		divTitle.innerHTML = title;

		let first = true;

		for (const item in items) {
			const btn = createElem('button');
			btn.className = 'cgui-popup-menu-btn';
			btn.innerHTML = items[item];
			divMenu.appendChild(btn);
			if (first) {
				first = false;
				setTimeout(() => btn.focus(), 0);
			}
			btn.onclick = () => {
				divWrapper.classList.add('cgui-fadeout');
				setTimeout(() => {
					divWrapper.remove();
					resolve(item);
				}, 150);
			};
		}

		if (closable) {
			const btn = createElem('button');
			btn.className = 'cgui-popup-menu-btn';
			btn.innerHTML = config.language.close;
			divMenu.appendChild(btn);
			btn.onclick = () => {
				divWrapper.classList.add('cgui-fadeout');
				setTimeout(() => {
					divWrapper.remove();
					resolve(-1);
				}, 150);
			};
		}

		document.body.appendChild(divWrapper);
	});
}
