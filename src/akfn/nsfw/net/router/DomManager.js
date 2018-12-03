/**	
 * 
 *  $$\   $$\   $$$$$$\   $$$$$$$$\  $$\      $$\             $$\        $$$$$$\   $$\   $$\  $$$$$$$$\  $$\   $$\ 
 *  $$$\  $$ | $$  __$$\  $$  _____| $$ | $\  $$ |           $$  |      $$  __$$\  $$ | $$  | $$  _____| $$$\  $$ |
 *  $$$$\ $$ | $$ /  \__| $$ |       $$ |$$$\ $$ |          $$  /       $$ /  $$ | $$ |$$  /  $$ |       $$$$\ $$ |
 *  $$ $$\$$ | \$$$$$$\   $$$$$\     $$ $$ $$\$$ |         $$  /        $$$$$$$$ | $$$$$  /   $$$$$\     $$ $$\$$ |
 *  $$ \$$$$ |  \____$$\  $$  __|    $$$$  _$$$$ |        $$  /         $$  __$$ | $$  $$<    $$  __|    $$ \$$$$ |
 *  $$ |\$$$ | $$\   $$ | $$ |       $$$  / \$$$ |       $$  /          $$ |  $$ | $$ |\$$\   $$ |       $$ |\$$$ |
 *  $$ | \$$ | \$$$$$$  | $$ |       $$  /   \$$ |      $$  /           $$ |  $$ | $$ | \$$\  $$ |       $$ | \$$ |
 *  \__|  \__|  \______/  \__|       \__/     \__|      \__/            \__|  \__| \__|  \__| \__|       \__|  \__|
 * 
 *
 * Copyright (c) 2016-present Akufen - AKFN - <http://akufen.ca>
 *
 * Released under the MIT License.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/Users/romain/Sites/nsfw/_temp/net/router/DomManager.jsimport NSFWEvents from 'akfn/nsfw/events/NSFWEvents';
import EventsManager from 'akfn/nsfw/events/EventsManager';

/**
 * Rooter
 * DOM Manager
 *
 * v1.0
 */


class DomManager {

	constructor ( wrapperClass, containerClass, ignoreClass ) {

		// classes
		this.wrapperClass = wrapperClass;
		this.containerClass = containerClass;
		this.ignoreClass = ignoreClass;

		// properties
		this.$wrapper = document.body.querySelector(this.wrapperClass);

		if ( !this.$wrapper ) {
			throw new Error(`Router :: cannot find a wrapper with class: ${this.wrapperClass}`);
		}

		this.$prevContainer = this.$wrapper.querySelector(this.containerClass);
		this.$nextContainer = null;

		// bindings
		this.appendContainer = ::this.appendContainer;
		this.removeContainer = ::this.removeContainer;
	}

	/**
	 * Handle Container
	 */
	appendContainer () {
		if ( this.$nextContainer ) {
			this.$wrapper.appendChild(this.$nextContainer);
			EventsManager.emit(NSFWEvents.Router.VIEW_ADDED);
		}
	}

	removeContainer () {
		if ( this.$prevContainer && this.$prevContainer.parentNode ) {
			this.$prevContainer.parentNode.removeChild(this.$prevContainer);
			EventsManager.emit(NSFWEvents.Router.VIEW_REMOVED);
		}
	}

	
	/**
	 * Get Wrapper
	 * @return {HTMLElement}
	 */
	getWrapper () {
		return this.$wrapper;
	}

	/**
	 * Get current Container
	 * @return {HTMLElement}
	 */
	getContainer () {
		return document.querySelector(this.containerClass);
	}


	handleHTML ( html ) {
		const temp = document.createElement('div');
		temp.innerHTML = html;

		const title = temp.querySelector('title');

		if ( title ) {
			document.title = title.textContent;
		}

		if ( this.$nextContainer ) {
			this.$prevContainer = this.$nextContainer;
		}

		const $nextContainer = temp.querySelector(this.containerClass);

		if ( $nextContainer ) {
			this.$nextContainer = $nextContainer;        
		} else {
			throw new Error(`Router :: Cannot find a container with class: ${this.containerClass}`);
		}
	}

}

export default DomManager;