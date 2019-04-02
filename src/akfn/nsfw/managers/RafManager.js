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

import NSFW from "..";

/**
 * Request Animation Frame
 * Manager
 *
 * v1.01
 */

class RafManager {
	
	constructor() {

		// binding
		this.update = ::this.update;

		// params
		this.binders = [];
		this.raf = null;

		this.now = Date.now();
		this.time = this.now;
		this.deltaTime = 0;

		// debugging shortcut
		NSFW.RafDebug = RafManager.debug;
	}

	/* Start */
	static start() {

		if(!RafManager.INSTANCE) RafManager.INSTANCE = new RafManager();

		RafManager.INSTANCE.update();
	}

	/* Stop */
	static stop() {

		window.cancelAnimationFrame( RafManager.INSTANCE.raf );
	}

	/* Update */
	update() {

		// time stuff
		this.now = Date.now();
		this.deltaTime = this.now - this.time;
		this.time = this.now;	

		for(let i=0; i < this.binders.length; i++) this.binders[i].fn( this.deltaTime );

		this.raf = window.requestAnimationFrame( this.update );
	}

	/**
	 * Bind
	 * @param  {String}   id [description]
	 * @param  {Function} fn [description]
	 */
	static bind(id, fn) {

		const _this = RafManager.INSTANCE;

		// id type check
		if( typeof id !== 'string' ) {
			console.error('RafManager :: Bind :: Invalid ID', id);
			return;
		}

		// fn type check
		if( typeof fn !== 'function' ) {
			console.error('RafManager :: Bind :: Invalid Function', fn);
			return;
		}

		// use id check
		for( let i = 0; i < _this.binders.length; i++ ) {

			const b = _this.binders[i];

			if(b.id === id) {
				console.warn('RafManager :: Bind :: ID already used !', id);
				return;
			}
		}

		RafManager.INSTANCE.binders.push({id:id,fn:fn});
	}

	/**
	 * Unbind
	 * @param  {String}   id [description]
	 */
	static unbind(id) {

		const _this = RafManager.INSTANCE;

		for(let i=0; i < _this.binders.length; i++)
		{
			if(_this.binders[i].id === id)
			{
				_this.binders.splice(i, 1);
				break;
			}
		}
	}

	/**
	 * Debug
	 */
	static debug () {

		console.table( RafManager.INSTANCE.binders );
	}

}

export default RafManager;