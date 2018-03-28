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

class SoundBatcher {


	constructor ( callback, verbose = false ) {

		// binding
		this.loaded = ::this.loaded;

		// params
		this.verbose = verbose;
		this.items = [];

		if ( callback && typeof callback === 'function' ) {
			this.callback = callback;
		}

		this.loader = new Audio();
		this.loader.addEventListener('canplaythrough', this.loaded, true);
	}

	addItem ( url ) {

		this.items.push(url);
	}

	/**
	 * Start
	 */
	start () {

		if(this.verbose) console.log('SoundBatcher :: Start');

		if ( this.items.length < 1 ) {
			console.warn('SoundBatcher :: No sound to preload');
			return;
		}

		this.loader.src = this.items[this.items.length - 1];
	}

	loaded () {
		
		if(this.verbose) console.log('SoundBatcher :: Sound loaded : ', this.items[this.items.length - 1]);

		this.items.pop();

		if ( this.items.length > 0 ) {
			
			this.start();

		} else {

			if ( this.callback ) this.callback();  

			this.dispose();
		}
	}

	/**
	 * Dispose
	 */
	dispose () {

		this.loader.removeEventListener('canplaythrough', this.loaded, true);

		this.loaded = null;
		this.loader = null;
		this.items = null;
		this.callback = null;
	}

}

export default SoundBatcher;