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
 * Events Manager
 * based on https://github.com/scottcorgan/tiny-emitter/blob/master/index.js
 *
 * v1.02
 */

class EventsManager {

	/**
	 * Emit event
	 * @param  {String} event name
	 * @param  {Object} data
	 */
	static emit ( event, data = null ) {

		const listeners = EventsManager.eventsList[event];

		if(!listeners) {
			console.warn('EventsManager :: Emit :: Currently no listeners for this event : ', event);
			return;
		}

		for( let i = 0, len = listeners.length; i < len; i++ ) listeners[i].fn( data );

	}

	/**
	 * On 
	 * @param  {String}   event name
	 * @param  {Function} callback function
	 */
	static on ( event, fn ) {

		if(!event || event === '')
			console.warn('EventsManager :: EMPTY EVENT ::', event);
		else if ( EventsManager.debug )
			console.log(`%cEventsManager :: ON :: ${event}`,'color:#BBB;');

		if(!EventsManager.eventsList[event]) EventsManager.eventsList[event] = []; // improve (._.)

		EventsManager.eventsList[event].push({fn:fn});

	}

	/**
	 * Once
	 * @param  {String}   event name
	 * @param  {Function} callback function
	 */
	static once( event, fn ) {

		const listener = ( data ) =>{

			EventsManager.off(event, listener);
			fn(data);
		};

		listener._ = fn;
		EventsManager.on( event, listener);
	}


	/**
	 * Off 
	 * @param  {String}   event name
	 * @param  {Function} callback function
	 */
	static off ( event, fn ) {
		
		const listeners = EventsManager.eventsList[event];

		if(!listeners) {
			console.warn('EventsManager :: Off :: Currently no listeners for this event : ', event);
			return;
		}

		if(!fn) {
			console.warn('EventsManager :: Off :: Callback is undefined', event);
			return;
		}

		if( EventsManager.debug ) console.log(`%cEventsManager :: OFF :: ${event}`,'color:#BBB;');

		const targetEvents = [];

		for( let i = 0, len = listeners.length; i < len; i++ ) {

			const target = listeners[i];

			if(target.fn !== fn && target.fn._ !== fn ) { // (.__.)
				targetEvents.push(target);
			}
		}


		if( targetEvents.length > 0 )
			EventsManager.eventsList[event] = targetEvents;
		else 
			delete EventsManager.eventsList[event];

	}

	/**
	 * Verbose
	 * @param  {Boolean}   debug status
	 */
	static verbose ( status ) {

		EventsManager.debug = status;
	}

}

/**
 * Properties (HBD Raph!)
 */
EventsManager.eventsList = {};
EventsManager.debug = false;

export default EventsManager;