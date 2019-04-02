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
 * SIMPLE NOISE
 * 
 * http://www.michaelbromley.co.uk/blog/90/simple-1d-noise-in-javascript
 *
 * v1.0
 */

class Simple1DNoise {

	constructor ( max = 256 ) {

		// params
		this.MAX_VERTICES = max;
		this.MAX_VERTICES_MASK = this.MAX_VERTICES -1;
		this.amplitude = 1;
		this.scale = 1;

		this.min = 0;
		this.max = 0;

		this.scaledValue = 0;
		this.floorValue = 0;

		this.t = 0;
		this.tRemapSmoothstep = 0;

		// build
		this.r = [];

		for ( let i = 0; i < this.MAX_VERTICES; ++i ) {
			this.r[i] = Math.random();
		}

	}

	getVal ( value ) {
		
		this.scaledValue = value * this.scale;
		this.floorValue = Math.floor(this.scaledValue);
		this.t = this.scaledValue - this.floorValue;
		this.tRemapSmoothstep = this.t * this.t * ( 3 - 2 * this.t );

		/// Modulo using &
		this.min = this.floorValue & this.MAX_VERTICES_MASK;
		this.max = ( this.min + 1 ) & this.MAX_VERTICES_MASK;

		const noise = this.lerp( this.r[ this.min ], this.r[ this.max ], this.tRemapSmoothstep );

		return noise * this.amplitude;
	}

	lerp (a, b, t ) {
		return a * ( 1 - t ) + b * t;
	}

	dispose(){
		this.r = null;
	}

}

export default Simple1DNoise;