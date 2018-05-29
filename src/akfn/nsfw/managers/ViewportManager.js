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

class ViewportManager {


	constructor() {

		// bindings
		this.update = ::this.update;

		// properties
		this.views = {};
		this.watchers = {};

		// polyfill for IE & Safari (._.)
		require('intersection-observer');
	}

	static start () {

		if(!ViewportManager.instance) ViewportManager.instance = new ViewportManager();

	}

	/**
	 * Update
	 */
	update( entries ) {

		for( let i = 0, view; i < entries.length; i++) {

			view = this.views[ entries[i].target.dataset['intersectionId'] ];

			if( view ) view.update( entries[i] );
		}
	}

	/**
	 * Bind
	 * @param  {String} 			id      
	 * @param  {IntersectionView} 	element 
	 */
	static bind ( id, element ) {

		const instance = ViewportManager.instance;
		const watchers = instance.watchers;

		instance.views[id] = element;
		
		if(element) {

			const ratio = String(element.options.ratio);

			// check if existing watcher fits wanted ratio
			if(!watchers[ratio]) {
				watchers[ratio] = new IntersectionObserver( instance.update, { threshold:[0,element.options.ratio] } );
			} 

			watchers[ratio].observe(element.view);
		}

	}

	/**
	 * Unbind
	 * @param  {String} 			id      
	 * @param  {IntersectionView} 	element 
	 */
	static unbind ( id, element ) {

		const instance 	= ViewportManager.instance;
		const watcher 	= instance.watchers[String(element.options.ratio)];

		delete instance.views[id];

		if(element) watcher.unobserve(element.view);
	}

}

export default ViewportManager;