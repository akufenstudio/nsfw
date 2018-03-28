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

import RafManager from 'akfn/nsfw/managers/RafManager';

import DisplayObject from 'akfn/nsfw/dom/DisplayObject';
import SmartView from 'akfn/nsfw/dom//SmartView';

import Vector2 from 'akfn/nsfw/math/Vector2';

/**
 * N * S * F * W
 * 
 * Parallax View
 *
 * v1.0
 */

class ParallaxView extends SmartView {
	
	constructor(id, view, options = {}) {

		const displayObject = new DisplayObject( view );

		super(id, displayObject.view);

		// view
		this.displayObject = displayObject;

		// params
		this.interpolation = new Vector2(0,0);
		this.distance = 0;
		this.ratio = 0;

		// options
		const { amplitude, smooth, depth } = options;
		this.options = { amplitude: amplitude || 100, smooth: smooth || .2, depth: depth || 1 };

		// bindings
		RafManager.bind( this.id, ::this.render);
	}

	/**
	 * Parallax
	 * Could be overwritten depends on what parallax style you need
	 */
	 parallax() {
	 	
	 	if( this.visibility ) {

			this.distance = ( window.currentScrollTop + window.innerHeight) - this.offsetTop;
			this.ratio = (Math.min(this.distance / window.innerHeight, 1) - .5 ) * this.options.depth;

			this.interpolation.y = this.ratio * -this.options.amplitude;
		}

		this.displayObject.position.y += ( this.interpolation.y - this.displayObject.position.y ) * this.options.smooth;
	 }


	/** 
	 * Render
	 */
	render() {

		super.check(); // (see SmartView)

		this.parallax();

		this.displayObject.render();
	}


	/** 
	 * Resize
	 */
	resize() {

		this.locate();
	}

	/**
	 * Dispose
	 */
	dispose(){

		RafManager.unbind( this.id);

		super.dispose();
	}

}

export default ParallaxView;