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
 * DisplayObject
 *
 * v1.1
 */

class DisplayObject {
	
	constructor( view ) {

		// security check
		if(!view) console.error('DisplayObject :: view is not valid.');

		// bindings
		this.click 	= ::this.click;
		this.over 	= ::this.over;
		this.out 	= ::this.out;

		// view
		this.view = view;

		// settings
		this.position = { x: 0, y: 0, z: 0 };
		this.rotation = { x: 0, y: 0, z: 0 };
		this.scale = { x: 1, y: 1 };

		this.alpha = 1;
	}

	/**
	 * Render
	 */
	render() {

		this.view.style.transform = 
		this.view.style.webkitTransform = `translate3d(${this.position.x}px,${this.position.y}px,${this.position.z}px) scale(${this.scale.x},${this.scale.y}) rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg) rotateZ(${this.rotation.z}deg)`;

		this.view.style.opacity = this.alpha;
	}

	/**
	 * Click
	 */
	click ( event ) {

	}

	/**
	 * Over
	 */
	over ( event ) {

	}

	/**
	 * Out
	 */
	out ( event ) {

	}

	/**
	 * Interactive
	 * status : Boolean
	 */
	interactive ( status = true ) {

		if( status ) {

			this.view.addEventListener('click', 	this.click);
			this.view.addEventListener('mouseover', this.over);
			this.view.addEventListener('mouseout', 	this.out);

		} else {

			this.view.removeEventListener('click', 		this.click);
			this.view.removeEventListener('mouseover', 	this.over);
			this.view.removeEventListener('mouseout', 	this.out);
		}
	}

	/**
	 * Button Mode
	 * status: Boolean
	 */
	buttonMode ( status = true ) {

		this.view.style.cursor = status ? 'pointer' : null;
	}


	/**
	 * Pivot 
	 * value: Object {x,y}
	 */
	pivot({ x = 0, y = 0 }) {

		this.view.style.transformOrigin = `${x}% ${y}%`;
	}

	/**
	 * Move
	 * value: Object {x,y}
	 */
	move({ x = 0, y = 0 }) {
		this.view.style.left 	= `${x}px`;
		this.view.style.top 	= `${y}px`;
	}

	/**
	 * Dispose
	 */
	dispose () {

		this.interactive(false);

		this.click 	= 
		this.over 	= 
		this.out 	= null;

	}
}

export default DisplayObject;