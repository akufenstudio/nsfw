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

/**
 * Resize Manager
 *
 * v1.01
 */

class ResizeManager {

	constructor( debounceTime ) {

		this.views = [];

		this.timer = -1;
		this.debounceTime = debounceTime;
	}

	static start( debounce = true, debounceTime = 400 ) {

		if(!ResizeManager.instance) ResizeManager.instance = new ResizeManager( debounceTime );

		window.addEventListener('resize', debounce ? ResizeManager.debounceResize : ResizeManager.resize );

		ResizeManager.resize();
	}

	/**
	 * bind - add a callback
	 * 
	 * @param  id {String} - must be unique 
	 * @param  fn {Function} - callback function called on «resize»
	 */
	static bind(id, fn) {

		ResizeManager.instance.views.push({id:id,fn:fn});
	}

	/**
	 * unbind - remove an existing callback
	 * 
	 * @param  id {String}
	 */
	static unbind(id) {

		const instance = ResizeManager.instance;

		for(let i=0; i < instance.views.length; i++)
		{
			if(instance.views[i].id === id)
			{
				instance.views.splice(i, 1);
				break;
			}
		}
	}

	/**
	 * Debounced Resize
	 */
	static debounceResize () {

		window.clearTimeout( ResizeManager.instance.timer );

		ResizeManager.instance.timer = window.setTimeout( ResizeManager.resize, ResizeManager.instance.debounceTime );
	}

	/**
	 * Resize
	 */
	static resize() {

		const views = ResizeManager.instance.views;

		NSFW.w = document.documentElement.clientWidth;
		NSFW.h = document.documentElement.clientHeight;

		for(let i=0; i < views.length; i++) views[i].fn(NSFW.w,NSFW.h);
	}

}

export default ResizeManager;