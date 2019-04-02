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

import View from './View';

/**
 * Router
 * ViewManager
 *
 * v1.1
 */

class ViewManager {

	constructor ( verbose, defaultView ) {

		// properties
		this.views = [];
		this.currentView = {};
		this.urls = [];

		// options
		this.verbose = verbose;

		if ( defaultView  ) {
			this.defaultView = new defaultView();
			this.addView(this.defaultView);
		} else {
			console.warn("ViewManager :: you need to provide a default view.");
		}
	}

	/**
	 * Add View
	 * @param {View} view [description]
	 */
	addView ( view ) {
		
		if ( view instanceof View ) {
			view.verbose = this.verbose;
			
			// remove potential slashes at the end of urls
			view.urls = Object.keys(view.urls).reduce( ( u, key ) => {
			    u[key] = view.urls[key].map( url => url.replace(/\/$/, ""));
			    return u;
			}, {});

			// keep track of all registered urls to speed up checking of existing view
			const urls = Object.keys(view.urls).reduce( ( u, key ) => {
			    return [...u, ...view.urls[key]]
			}, []);
			this.urls.push(...urls);
			
			this.views.push(view);
		} else {
			throw new Error(`ViewManager :: add :: not an instance of View`);
		}
	}

	/**
	 * Get View
	 * @param  {String} id [description]
	 * @return {View}    [description]
	 */
	getView ( id ) {
		for ( let i = 0; i < this.views.length; i++ ) {
			if ( this.views[i].id === id ) {
				return this.views[i];
			}
		}

		return false;
	}

	/**
	 * View Exists
	 * @param  {String} url  [description]
	 */
	viewExists(url) {
		return this.urls.includes(url);
	}

	/**
	 * Get View by URL
	 * @param  {String} url  [description]
	 * @param  {String} lang [description]
	 * @return {View}      [description]
	 */
	getViewByUrl ( url, lang ) {

		if(this.verbose) console.log(`ViewManager :: getViewByUrl`, url, this.views);

		for ( let i = 0; i < this.views.length; i++ ) {

			const view  = this.views[i];
			const langs = view.urls[lang];

			if( langs && langs.length > 0 ) {

				for ( let j = 0; j < langs.length; j++ ) {

					if ( langs[j] === url ) {
						return  view;
					} 
				}

			} else {

				console.error(`ViewManager : getViewByUrl :: No url matching lang (${lang}) for view ${view.id}`, view);
			}

		}

		return this.defaultView;
	}

	/**
	 * Set current View
	 * @param {[View} view [description]
	 */
	setCurrentView ( view ) {
		this.currentView = view;
	}

	/**
	 * Get current View
	 * @return {View} [description]
	 */
	getCurrentView () {
		return this.currentView;
	} 

}

export default ViewManager;