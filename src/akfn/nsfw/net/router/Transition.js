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

/Users/romain/Sites/nsfw/_temp/net/router/Transition.jsimport NSFWEvents from 'akfn/nsfw/events/NSFWEvents';
import EventsManager from 'akfn/nsfw/events/EventsManager';
import View from './View';
import Promise from 'promise-polyfill';

/**
 * Router
 * Transition
 *
 * v1.01
 */

class Transition {

	constructor ( prevView, nextView, reverse = false ) {

		// bindings
		this.load = ::this.load;
		this.leavePrevView = ::this.leavePrevView;
		this.enterNextView = ::this.enterNextView;
		this.appendNextView = ::this.appendNextView;
		this.removePrevView = ::this.removePrevView;

		// related views
		this.prevView = prevView;
		this.nextView = nextView;

		// params
		this.reverse = reverse;
	}

	/**
	 * Load
	 */
	load () {
		EventsManager.emit(NSFWEvents.Router.VIEW_LOAD, { id: this.nextView.id });

		const id = this.prevView ? this.prevView.id : null;

		return this.nextView.load(id)
			.then( () => {
				EventsManager.emit(NSFWEvents.Router.VIEW_LOADED, { id: this.nextView.id });
			})
			.catch( error => {
				throw error;
			});
	}

	delay ( time = 500 ) {
		return function () {
			return new Promise( ( resolve, reject ) => {
				setTimeout( () => {
					resolve();
				}, time);
			});
		}
	}

	/**
	 * Append
	 */
	appendNextView () {
		if ( this.prevViewExists() ) {
			EventsManager.emit(NSFWEvents.Router.VIEW_ADD);
		}

		return Promise.resolve();
	}

	/**
	 * Enter
	 */
	enterNextView () {
		return new Promise( ( resolve, reject ) => {
			EventsManager.emit(NSFWEvents.Router.VIEW_ENTER, { id: this.nextView.id });

			this.nextView.enter(this.prevView.id, () => {
				EventsManager.emit(NSFWEvents.Router.VIEW_ENTERED, { id: this.nextView.id });
				resolve();
			});
		}).catch( error => {
			throw error;
		});
	}

	/**
	 * Leave
	 */
	leavePrevView () {
		if ( this.prevViewExists() ) {
			return new Promise( ( resolve, reject ) => {
				EventsManager.emit(NSFWEvents.Router.VIEW_LEAVE, { id: this.prevView.id });

				this.prevView.leave(this.nextView.id, () => {
					EventsManager.emit(NSFWEvents.Router.VIEW_LEFT, { id: this.prevView.id });
					resolve();
				});
			}).catch( error => {
				throw error;
			});
		}
		
		return Promise.resolve();
	}

	/**
	 * Remove
	 */
	removePrevView () {
		if ( this.prevViewExists() ) {
			EventsManager.emit(NSFWEvents.Router.VIEW_REMOVE, { id: this.prevView.id });
		};

		return Promise.resolve();
	}

	

	/**
	 * Transition Sequence
	 */
	play () {
		return this.leavePrevView()
			.then(this.load)
			.then(this.appendNextView)
			.then(this.removePrevView)
			.then(this.enterNextView)
			.catch(this.onError);
	}

	prevViewExists () {
		return this.prevView instanceof View;
	}

	onError ( error ) {
		if ( error ) {
			throw error;
		}

		throw new Error(`Router :: error happened during transition.`);
	}

}

export default Transition;