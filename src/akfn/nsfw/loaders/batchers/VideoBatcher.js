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
 * 
 * Video
 * Batcher
 *
 * v1.15
 */

class VideoBatcher {


	constructor( options = { verbose: true } ) {

		// bindings
		this.loaded = ::this.loaded;
		this.fail 	= ::this.fail;

		// params
		this.verbose = options.verbose;

		// properties
		this.items 	= [];
		this.videos	= [];
	}

	/**
	 * Add Item url {String}
	 */
	add ( url ) {

		this.items.push(url);
	}

	/**
	 * Start Batcher
	 */
	start ( callback ) {

		// empty batcher check
		if( this.items.length < 1 ) {
			console.warn('VideoBatcher :: No Video to preload');
			if(callback) callback();
			return;
		}

		this.items.reverse();

		this.load();

		// mode: callback
		if(callback && typeof callback === 'function') {

			this.callback = callback;
			
		// mode: promise	
		} else {
			return new Promise( (resolve, reject) => {

				this.resolve = resolve;

			});
		}
	}

	/**
	 * Loading
	 */
	load() {

		this.video = document.createElement('video');
		this.video.addEventListener('canplay', this.loaded);
		this.video.addEventListener('error', this.fail);
		
		this.video.src = this.items[this.items.length - 1];
		this.video.load();
	}

	/**
	 * Loaded
	 */
	loaded () {

		if(this.verbose) console.log(`%cVideoBatcher :: Video loaded : ${this.items[this.items.length - 1]}`, 'color:#D1BA93;');

		this.video.removeEventListener('canplay', this.loaded);
		this.video.removeEventListener('error', this.fail);

		this.videos.push(this.video);

		this.items.pop();

		if (this.items.length > 0 )
			this.load();
		else {

			if(this.verbose) console.log('%cVideoBatcher :: Completed', 'color:#D1BA93;');

			if(this.callback)
				this.callback( this.videos );
			else 
				this.resolve( this.videos );
		}

	}

	/**
	 * Error
	 */
	fail ( error ) {

		if(this.verbose) console.log(`%cVideoBatcher :: Video error : ${this.items[this.items.length - 1]}`, 'color:#D19694;');

		this.items.pop();
		this.load();
	}

	/**
	 * Dispose
	 */
	dispose () {

		this.callback = null;

		this.items = null;
		this.videos = null;

		this.video.removeEventListener('canplay', this.loaded);
		this.video = null;

		this.loaded;
	}
}

export default VideoBatcher;