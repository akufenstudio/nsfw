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

class SmartView {

	constructor ( id, view ) {

		// security checks
		if(window.currentScrollTop !== 0 && !window.currentScrollTop) {
			console.error('SmartView :: ScrollManager should be already started.');
		}

		if(!view) {
			console.error('SmartView :: View is undefined');
		}

		this.id = id;
		this.view = view;

		this.visible 	= false;
		this.visibility = false;

		this.offsetTop 		= 0;
		this.offsetBottom 	= 0;
		this.scrollTop 		= 0;
		this.triggerRatio 	= 1;
		
		this.locate();
	}

	/**
	 * Check if visible in viewport
	 */
	check () {

		this.visibility = this.offsetBottom > window.currentScrollTop && this.offsetTop < window.currentScrollTop + window.innerHeight * this.triggerRatio;
	}

	/**
	 *  Save the offset top position
	 *  (should be called on «resize»)
	 */
	locate () {

		this.offsetTop 		= window.currentScrollTop + this.view.getBoundingClientRect().top;
		this.offsetBottom 	= this.offsetTop + this.view.offsetHeight;
	
	}

	/**
	 * Dispose
	 */
	dispose() {

		this.view = null;

		this.visible = false;
		this.visibility = false;

		this.offsetTop = 0;
		this.offsetBottom = 0;
	}

}

export default SmartView;