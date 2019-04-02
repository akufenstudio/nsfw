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

import { merge } from 'akfn/nsfw/utils/utils';

/**
 * CPU Test
 *
 * v1.1
 * 
 */

class CPUTest {

	constructor ( opts ) {

		const defaultOptions = {
			limit: 10,
			workerPath: 'js/worker.js',
			verbose: true,
			callback: null
		}

		const options = merge( defaultOptions, opts);

		// properties
		NSFW.goodCPU = false;
		this.time = 10000;
		
		// browser capacity check
		if (!window.Worker || typeof window.Worker === "undefined") {
		 	console.warn('CPUTest: Web workers are not available.');

		 	if(options.callback) options.callback();

		 	return;
		}

		// options
		this.callback 	= options.callback;
		this.verbose 	= options.verbose;
		this.limit 		= options.limit;

		// binding
		this.onMessage 	= ::this.onMessage;	
		this.onError 	= ::this.onError;	

		// worker
		this.worker = new Worker(options.workerPath);
		this.worker.addEventListener("message", this.onMessage);
		this.worker.addEventListener("error", this.onError);
	}

	/**
	 * Test run
	 */
	run() {

		// security check
		if(!this.worker) return;

		this.worker.postMessage({
			id: Date.now(),
			message: { fn: 'calculate' }
		});
	}

	/**
	 * Error handling
	 */
	onError( error ) {
		console.error('CPUTest :: Error:', error);

		if(this.callback) this.callback();
	}

	/**
	 * Test done
	 */
	onMessage(e) {

		if(e) this.time = e.data.message.time;

		NSFW.goodCPU = this.time < this.limit;

		if(this.verbose) this.logReport();

		if(this.callback) this.callback(this.time);
		
		this.dispose();
	}

	/**
	 * Report
	 */
	logReport() {

		console.log(`%cCPU status: ${NSFW.goodCPU ? 'good' : 'not good'} (${this.time}ms)`, 'color:#888');
	}


	/**
	 * Dispose
	 */
	dispose() {	

		this.worker.removeEventListener("message", this.onMessage);
		this.worker.removeEventListener("error", this.onError);
  		this.worker.terminate();

		this.worker = null;
		this.callback = null;
		this.onMessage = null;
		this.onError = null;
  	}
}

export default CPUTest;