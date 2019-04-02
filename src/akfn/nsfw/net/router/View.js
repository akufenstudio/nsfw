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

import Router from './Router';

/**
 * Router
 * View
 *
 * v1.01
 */

class View {


	constructor ( id, urls ) {

		// properties
		this.urls = urls;
		this.id = id;
		
		this.verbose = false; // verbose is herited by ViewManager
	}

	/**
	 * Init
	 */
	load ( prevViewId ) {
		if ( prevViewId ) {
			//return Router.load(this.urls);
			return Router.load();
	   } else {
			return Promise.resolve( Router.getContainer() );
		}
	}

	setView () {
		if(this.verbose) console.log(`View ${this.id} :: setView`);
		this.$view = document.querySelector(`.view__${this.id}`);
	}

	/**
	 * IN
	 */
	enter ( prevViewId, resolve ) {
		this.setView();
		this.beforeDisplay(prevViewId);
		this.display(prevViewId, resolve);
	}

	beforeDisplay ( prevViewId ) {
		if(this.verbose) console.log(`View ${this.id} :: beforeDisplay`);
	}

	display( prevViewId, resolve ) {
		resolve();
	}

	/**
	 * OUT
	 */
	leave ( nextViewId, resolve ) {
		this.hide(nextViewId, resolve);
	}

	hide( nextViewId, resolve) {
		resolve();
		this.afterHide(nextViewId);
	}

	afterHide ( nextViewId )  {
		if(this.verbose) console.log(`View ${this.id} :: afterHide`);
		this.dispose(nextViewId);
	}

	/**
	 * Dispose
	 */
	dispose ( nextViewId ) {
		if(this.verbose) console.log(`View ${this.id} :: dispose`);
	}

	/**
	 * [destroy description]
	 * @return {[type]} [description]
	 */
	destroy () {
		this.id = null;
		this.urls = null;
	}

}

export default View;