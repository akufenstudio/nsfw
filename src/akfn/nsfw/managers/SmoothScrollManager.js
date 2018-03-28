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

class SmoothScrollManager {

	constructor ( options ) {

		this.scroll = ::this.scroll;

		if(!Scrollbar) {
			console.error('SmoothScrollManager :: Scrollbar plugin needed.');
			return;
		}

		// elements
		this.root = document.querySelector('#root');

		this.views = [];
	}

	static init( options ) {

		const instance = SmoothScrollManager.instance;

		window.currentScrollTop = 0;

		window.scrollBar = Scrollbar.init(instance.root, options);
		window.scrollBar.addListener(instance.scroll);		
	}

	static debug() {

		console.table( SmoothScrollManager.instance.views );
	}
	

	static start( options = {} ) {

		window.currentScrollTop = 0;

		SmoothScrollManager.instance = new SmoothScrollManager();	

		options.syncCallbacks = true;
		options.alwaysShowTracks = false;
		SmoothScrollManager.init( options );	
	}

	/**
	 * Smooth scroll
	 */
	scroll ( status ) {

		//console.log(status);

		window.currentScrollTop = status.offset.y;
		window.currentScrollDirection = status.direction.y;

		for(let i=0; i < this.views.length; i++) this.views[i].fn(status);
	}

	/**
	 * Bind
	 * Add view
	 */
	static bind( id, fn) {

		SmoothScrollManager.instance.views.push({id:id,fn:fn});
	}

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