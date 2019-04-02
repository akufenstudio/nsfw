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
 * WHEEL
 * MANAGER
 *
 * v1.0 
 * 
 * /!\ Install Virtual Scroll
 * https://github.com/ayamflow/virtual-scroll
 * 
 * npm i virtual-scroll -S
 * 
 */

class WheelManager {


	static start ( debounced = true, debounceTime = 300 ) {

		// params
		WheelManager.views = [];
		WheelManager.debouncer = -1;
		WheelManager.locked = false;
		WheelManager.time = debounceTime;

		const VirtualScroll = require('virtual-scroll');
		const listener = new VirtualScroll( { limitInertia:debounced } );

		listener.on( debounced ? WheelManager.wheel : WheelManager.freeWheel );

	}

	static wheel( event ) {

		if(WheelManager.locked) return;

		WheelManager.locked = true;

		WheelManager.freeWheel(event);

		WheelManager.debouncer = window.setTimeout( ()=>{ WheelManager.locked = false; }, WheelManager.time);

	}

	static freeWheel( event ) {

		for( let i = 0; i < WheelManager.views.length; i ++ ) {
			WheelManager.views[i].fn(event);
		}
	}


	static bind( id, fn) {

		WheelManager.views.push({id:id,fn:fn});
	}

	static unbind(id) {

		for(let i=0; i < WheelManager.views.length; i++)
		{
			if(WheelManager.views[i].id === id)
			{
				WheelManager.views.splice(i, 1);
				break;
			}
		}
	}


}

export default WheelManager;