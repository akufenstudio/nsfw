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
 * Copyright (c) 2016-present Akufen - AKFN - <https://akufen.ca>
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

import ResizeManager from '../managers/ResizeManager';
import BarbaController from './BarbaController';


/**
 * BARBA
 * PAGEBASE
 *
 * v1.0
 */

class BarbaPageBase {

	constructor( id, slugs ) {

		// page id
		this.id = id;
		this.verbose = true;

		this.slugs = slugs;

		// bindings
		this.onEnter 			= ::this.onEnter;
		this.onEnterCompleted 	= ::this.onEnterCompleted;
		this.onLeave 			= ::this.onLeave;
		this.onLeaveCompleted 	= ::this.onLeaveCompleted;
		this.resize 			= ::this.resize;

		this.barbaView = Barba.BaseView.extend({
			namespace: this.id,
			onEnter: this.onEnter,
			onEnterCompleted: this.onEnterCompleted,
			onLeave: this.onLeave,
			onLeaveCompleted: this.onLeaveCompleted
		});

		this.barbaView.init();

		BarbaController.register(this);
	}

	/**
	 * The new Container is readyand attached to the DOM.
	 */
	onEnter() {
		
		if(this.verbose) console.log(`%cBarbaPageBase :: Enter :: ${this.id}`, 'color:#cdc5f0');

		ResizeManager.bind( this.id, this.resize );

		// get the view
		for (let container of Array.from(document.querySelectorAll('.barba-container'))) {

			if (container.getAttribute('data-namespace') === this.id) {

				this.view = container;
				document.title = this.view.getAttribute('data-title');
			}
		}

		// Custom code should be added after super.
		
	}

	/**
	 * The Transition has just finished.
	 */
	onEnterCompleted() {

		// Custom code should be added before super.

		this.resize();
	}

	/**
	 * A new Transition toward a new page has just started.
	 */
	onLeave() {

		ResizeManager.unbind( this.id );

	}

	/**
	 * The Container has just been removed from the DOM.
	 */
	onLeaveCompleted() {

		this.dispose();
	}


	/**
	 * Display Transition
	 */
	display( container, promise, context ) {

		if(this.verbose) console.log(`%cBarbaPageBase :: Display :: ${this.id} (${context})`, 'color:#cdc5f0');

		// Default animation needs to be overriden !
		TweenMax.to( container, .5, {css:{autoAlpha:1}});
		TweenMax.delayedCall( .5, promise);

	}

	/**
	 * Hide Transition
	 */
	hide ( container, promise, context ) {

		if(this.verbose) console.log(`%cBarbaPageBase :: Hide :: ${this.id} (${context})`, 'color:#cdc5f0');

		if(!promise) console.warn('BarbaPageBase ::', this.id,':: Hide :: Promise is missing !');

		// Default animation needs to be overriden !
		// Do not forget the Promise !
		TweenMax.to( container, .5, {css:{autoAlpha:0} });
		TweenMax.delayedCall( .5, promise);

	}

	/**
	 * Resize
	 */
	resize () {

		
	}

	/**
	 * Dispose
	 */
	dispose () {


	}
}

export default BarbaPageBase;