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

import { merge } from 'akfn/nsfw/utils/utils';

/**
 * Smooth ScrollManager
 *
 * Wrap of 
 * https://github.com/idiotWu/smooth-scrollbar (7.4.1)
 *
 * Library must be included in vendors.
 *
 * v1.06
 */

class SmoothScrollManager {

	constructor ( options ) {

		// binding
		this.scroll = ::this.scroll;

		if(!Scrollbar) {
			console.error('SmoothScrollManager :: Scrollbar plugin needed.');
			return;
		}

		// elements
		this.root = options.container;

		if(!this.root) {
			console.error('SmoothScrollManager :: #root element needed.');
			return;
		}

		this.views = [];
	}

	static init( options ) {

		const instance = SmoothScrollManager.instance;

		NSFW.currentScrollTop = 0;

		NSFW.scrollBar = Scrollbar.init(instance.root, options);
		NSFW.scrollBar.addListener(instance.scroll);		
	}

	static debug() {

		console.table( SmoothScrollManager.instance.views );
	}
	

	static start( opts ) {

		NSFW.currentScrollTop = 0;

		// options
		const defaultOptions = {
			container: document.querySelector('#root'),
			alwaysShowTracks: true,
			syncCallbacks: true
		};

		const options = merge(defaultOptions, opts);

		SmoothScrollManager.instance = new SmoothScrollManager(options);	

		SmoothScrollManager.init( options );	
	}

	/**
	 * Smooth scroll
	 */
	scroll ( status ) {

		NSFW.currentScrollTop = status.offset.y;
		NSFW.currentScrollDirection = status.direction.y;

		for(let i=0; i < this.views.length; i++) this.views[i].fn(status);
	}

	/**
	 * Bind
	 * Add view
	 */
	static bind(id, fn) {

		SmoothScrollManager.instance.views.push({id:id,fn:fn});
	}

	/**
	 * Unbind
	 * Remove view
	 */
	static unbind(id) {

		const instance = SmoothScrollManager.instance;

		for(let i=0; i < instance.views.length; i++)
		{
			if(instance.views[i].id === id)
			{
				instance.views.splice(i, 1);
				break;
			}
		}
	}
}

export default SmoothScrollManager;