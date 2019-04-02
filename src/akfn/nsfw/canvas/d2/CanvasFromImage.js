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
 * Canvas
 * From
 * Image
 *
 * v 1.0
 */

class CanvasFromImage {


	constructor( target, autoRender = true ) {

		// bindings
		this.render = ::this.render;

		// params
		this.autoRender = autoRender;

		// Image url
		if( typeof target === 'string' ) {

			this.pic = new Image();
			this.pic.onload = ::this.build;
			this.pic.src = target;

		// Existing IMG DOM
		} else {
			
			this.pic = target;
			this.ref = target.parentNode;

			if(this.ref) this.ref.removeChild(this.pic);

			if( this.pic.complete )
				this.build();
			else 
				this.pic.onload = ::this.build;

		}

	}

	/**
	 * Build
	 */
	build() {

		this.view = document.createElement('canvas');
		this.view.width 	= this.pic.width;
		this.view.height 	= this.pic.height;

		// responsive helper
		this.view.style.maxWidth = '100%';

		this.ctx = this.view.getContext('2d');
		
		// rendering
		if(this.autoRender) this.render();

		// handle appending
		if(this.ref) this.ref.appendChild(this.view);
	}


	render() {

		this.ctx.drawImage(this.pic, 0, 0, this.pic.width, this.pic.height);
	}

	dispose() {

		this.render = null;

		this.view = null;
		this.pic = null;
	}

}


export default CanvasFromImage;