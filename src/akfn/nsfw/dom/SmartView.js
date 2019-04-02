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

import ViewportManager from 'akfn/nsfw/managers/ViewportManager';

/**
 * 
 * Smart View
 *
 * v2.11
 */

class SmartView {

	constructor ( id, view, options = {} ) {
		if(!id || id === '') {
			console.error('SmartView :: Invalid ID');
			return;
		}

		if(!view) {
			console.error('SmartView :: View is undefined');
			return;
		}

		const defaults = {
			root: null,
			intersectionRatio: 0,
			rootMargin: '0px',
			threshold: 0
		};

		// properties
		this.id = id;
		this.view = view;
		this.options = {...defaults, ...options};

		// security check
		if( !this.options.intersectionRatio || typeof this.options.intersectionRatio !== 'number' ) this.options.intersectionRatio = 0;

		// settings
		this.visibility = false;
		this.visible = false;

		this.view.dataset.intersectionId = id;

		ViewportManager.bind(id, this);
	}

	/**
	 * Updating status by ViewportManager
	 */
	update ( status ) {
		
		this.visibility = status.intersectionRatio > this.options.intersectionRatio;
	}

	/**
	 *  Save the offset top position
	 *  (should be called on «resize» if needed)
	 */
	locate () {

		this.offsetTop 		= NSFW.currentScrollTop + this.view.getBoundingClientRect().top;
		this.offsetBottom 	= this.offsetTop + this.view.offsetHeight;
	}

	/**
	 * Dispose
	 */
	dispose() {

		ViewportManager.unbind(this.id, this);

		this.view = null;

		this.visibility = false;
	}

}

export default SmartView;