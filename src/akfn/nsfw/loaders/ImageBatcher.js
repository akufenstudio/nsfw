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

class ImageBatcher {


	constructor( cb = null, verbose = true ) {

		this.items = [];
		this.pics = [];
		
		this.verbose = verbose;

		if(cb) this.callback = cb;

	}

	add ( url ) {

		this.items.push(url);

	}

	start () {

		if( this.items.length < 1 ) {
			console.warn('ImageBatcher :: No Image to preload');
			this.callback();
			return;
		}

		this.pic = new Image();
		this.pic.crossOrigin = 'Anonymous';
		this.pic.onload = this.loaded.bind(this);
		this.pic.onerror = (err)=>{
			if(this.verbose) console.log('%cImageBatcher :: Image Error : ', 'color:#ff0000;', this.items[this.items.length - 1]);
			this.items.pop();
			this.start();
		};

		this.pic.src = this.items[this.items.length - 1];
	}

	loaded () {

		if(this.verbose) console.log('%cImageBatcher :: Image loaded : ', 'color:#ffbb6a;', this.items[this.items.length - 1]);

		this.pics.push(this.pic);

		this.items.pop();

		if (this.items.length > 0 )
			this.start();
		else {

			this.pics.reverse();

			if(this.verbose) console.log('%cImageBatcher :: Completed', 'color:#ffbb6a;');
			if(this.callback) this.callback( this.pics );
		}

	}

	dispose () {

		this.callback = null;

		this.items = null;
		this.pics = null;

		this.pic = null;
	}

}

export default ImageBatcher;