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

import { scrollTo } from '../utils/scroll';

/**
 * 
 * BARBA 
 * CONTROLLER
 * 
 * Based on http://barbajs.org
 *
 * v1.0
 * 
 */

class BarbaController {

	static init( verbose = true ) {

		window.Barba = require('barba.js');

		// params
		BarbaController.context = null;
		BarbaController.verbose = verbose;
		BarbaController.pages = {};
		BarbaController.callbacks = {
			'before' : [],
			'after' : []
		};

		// Barba
		Barba.Pjax.getTransition = BarbaController.getTransition;
		Barba.Pjax.start();

		BarbaController.container = Barba.Pjax.Dom.getWrapper();

	}

	/**
	 * Start
	 * Inits and displays the current view loaded by CMS
	 */
	static start( delay = .15 ) {

		const container = document.querySelector('.barba-container');
        const first = BarbaController.pages[ container.getAttribute('data-namespace') ];

        first.onEnter();

        TweenMax.delayedCall( delay, ()=>{ 
        	BarbaController.loader.hide();
        	first.display( container, first.onEnterCompleted, 'start' );
        });
	}


	/**
	 * Get Transition
	 */
	static getTransition () {

		return Barba.BaseTransition.extend({

			start: function() {
		
				if(BarbaController.loader) BarbaController.loader.display();

				const before = BarbaController.callbacks.before; 
				if(before.length > 0) for(let i = 0; i < before.length; i++ ) before[i]();

				Promise
					.all([this.newContainerLoading, this.hideCurrent()])
					.then(this.display.bind(this));
			},

			hideCurrent: function() {
			 
				let deferred = Barba.Utils.deferred();

				if(BarbaController.verbose) console.log('%cHide current', 'color:#ccc;');

				const id 	= this.oldContainer.getAttribute('data-namespace');
				const page 	= BarbaController.pages[id];
				const ctx 	= BarbaController.context;

				page.hide( this.oldContainer, deferred.resolve, ctx );

				return deferred.promise;
			},

			display: function() {

				if(BarbaController.verbose) console.log('%cDisplay', 'color:#ccc;', this.newContainer.getAttribute('data-namespace'));

				const id 	= this.newContainer.getAttribute('data-namespace'); 
				const page 	= BarbaController.pages[id];
				const ctx 	= BarbaController.context;

				if(!page) console.error(`BarbaController :: View doesn't exist`);

				scrollTo(0,0);

				BarbaController.container.appendChild(this.newContainer);
				page.display( this.newContainer, this.deferred.resolve, ctx );

				const after = BarbaController.callbacks.after; 
				if(after.length > 0) for(let i = 0; i < after.length; i++ ) after[i]();

				// clean up
				TweenMax.delayedCall( .5, ()=>{
					
					/**
					 * We used to call «this.done();» 
					 * But what we really need here is to get rid of the old container
					 * and that's what we do.
					 * 
					 * You could of course set a more accurate delay.
					 */

					this.oldContainer.parentNode.removeChild(this.oldContainer);
				});

				if(BarbaController.loader) BarbaController.loader.hide();

				// reset
				BarbaController.context = null;
			}
		});
	}

	/**
	 * Add Loader
	 * Loader object needs to get a display/hide methods
	 */
	static addLoader( loader ) {

		BarbaController.loader = loader;

	}

	/**
	 * Register 
	 * Page must extends BarbaPageBase !
	 */
	static register( page ) {

		BarbaController.pages[page.id] = page;

		// TODO: auto-caching
	}

	/**
	 * Add CallBack
	 * Param must be function
	 */
	static addCallBack ( callback, timing ) {

		if( timing !== 'before' && timing !== 'after' ) {
			console.error('BarbaController :: addCallBack :: Timing is invalid', timing);
			return;
		}

		BarbaController.callbacks[timing].push(callback);

	}

	/**
	 * Go To
	 * - Add a specific context
	 * - Useful for multi-transitions website.
	 */
	static goto( url, context ) {

		BarbaController.context = context;
	
		Barba.Pjax.goTo(url);
	}

}

export default BarbaController;