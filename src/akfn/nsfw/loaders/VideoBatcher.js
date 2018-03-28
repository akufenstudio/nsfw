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

class VideoBatcher {

	constructor( callback = null, verbose = true ) {

		// bindings
		this.loaded = ::this.loaded;

		this.urls 	= [];
		this.videos	= [];
		
		this.verbose = verbose;

		if(callback) this.callback = callback;
	}

	/**
	 * Add
	 */
	add ( url ) {

		this.urls.push(url);
	}

	/**
	 * Start
	 */
	start () {

		if( this.urls.length < 1 ) {
			console.warn('VideoBatcher :: No Video to preload');
			this.callback();
			return;
		}


		if (!this.video) {
			this.video = document.createElement('video');
			this.video.addEventListener('canplay', this.loaded);
		}
		
		this.video.src = this.urls[this.urls.length - 1];
		this.video.load();
	}

	loaded () {

		if(this.verbose) console.log('%cVideoBatcher :: Video loaded : ', 'color:#ffbb6a;', this.urls[this.urls.length - 1]);

		this.videos.push(this.video);

		this.urls.pop();

		if (this.urls.length > 0 )
			this.start();
		else {

			this.videos.reverse();

			if(this.verbose) console.log('%cVideoBatcher :: Completed', 'color:#ffbb6a;');
			if(this.callback) this.callback( this.videos );
		}

	}

	/**
	 * Dispose
	 */
	dispose () {

		this.callback = null;

		this.urls = null;
		this.videos = null;

		this.video.removeEventListener('canplay', this.loaded);
		this.video = null;

		this.loaded;
	}
}

export default VideoBatcher;