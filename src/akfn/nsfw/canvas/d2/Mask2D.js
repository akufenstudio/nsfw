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

import CanvasFromImage from './CanvasFromImage';

/**
 * 
 * Mask 2D
 *
 * v 1.0
 * 
 */

class Mask2D extends CanvasFromImage {

	constructor( target, options = {} ) {

		super( target, false );

		// mode
		this.mode = options.mode || 'square'; // square or circle
		this.blending = options.blending || 'source-in'; // check Global Composite Operation
		this.PI2 = Math.PI * 2;

		if(this.mode === 'square') {

			this.draw = ::this.drawRect;
			this.mask = {x:0, y:0, w:0, h:0};

		} else {
			
			this.draw = ::this.drawCircle;
			this.mask = {x:0,y:0,r:0};
		}
	}

	/**
	 * Render
	 */
	render() {

		// clear
		this.ctx.clearRect(0,0, this.view.width, this.view.height );

		// draw Mask
		this.ctx.globalCompositeOperation = 'source-over';

		this.ctx.beginPath();
		this.draw(); // depends on mode
		this.ctx.fill();
		this.closePath();

		// draw Pic
		this.ctx.globalCompositeOperation = this.blending;

		super.render();
	}

	drawRect() {
		this.ctx.rect(this.mask.x,this.mask.y,this.mask.w,this.mask.h);
	}

	drawCircle() {
		this.ctx.arc(this.mask.x, this.mask.y, this.mask.r, 0, this.PI2);
	}

	/**
	 * Display
	 */
	display() {

		const tl = new TimelineMax({onUpdate:this.render});

		// square animation (left->right)
		this.mask.w = 0;
		this.mask.h = this.view.height;

		tl.to(this.mask, 2, {w:this.view.width, ease:Power2.easeInOut});

		/**
		 * Sample code for circle mode
		 *
		 *	this.mask.x = this.view.width >> 1;
		 *	this.mask.y = this.view.height >> 1;
		 * 	tl.to( this.mask, 2, {r:this.view.width*2, ease:Power2.easeInOut});
		 * 
		 */
		
	}

	/**
	 * Hide
	 */
	hide() {

		const tl = new TimelineMax({onUpdate:this.render});

		// square
		tl.to(this.mask, 2, {w:0, ease:Power2.easeInOut});

		/**
		 * Sample code for circle mode
		 *
		 * 	tl.to( this.mask, 2, {r:0, ease:Power2.easeOut});
		 * 
		 */
	}


	/**
	 * Dispose
	 */
	dispose() {

		TweenMax.killTweensOf(this.mask);

		this.mask = null;

		super.dipose();
	}


}


export default Mask2D;