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

import Transition from './Transition';

/**
 * Router
 * TransitionManager
 *
 * v1.01
 */

class TransitionManager {

	constructor ( defaultTransition = Transition ) {

		// properties
		this.defaultTransition = defaultTransition;
		this.transitions = [];
	}

	/**
	 * Add Transition
	 */
	addTransition ( transition ) {

		// security check
		if ( transition instanceof Transition ) {
			this.transitions.push(transition);
		} else {
			throw new Error(`TransitionManager :: add :: not an instance of Transition`);
		}
	}

	/**
	 * Get Transition
	 */
	getTransition ( prevView = {}, nextView = {} ) {
		
		for ( let i = 0; i < this.transitions.length; i++ ) {
			const transition = this.transitions[i];
			const currentMatch = transition.prevView.id === prevView.id;
			const nextMatch = transition.nextView.id === nextView.id;

			if ( currentMatch && nextMatch ) {

				return transition;

			} else if( transition.reverse ) {

				const reverseCurrentMatch = transition.prevView.id === nextView.id;
				const reverseNextMatch = transition.nextView.id === prevView.id;

				if( reverseCurrentMatch && reverseNextMatch ) {

					const temp = transition.prevView;

					transition.prevView = transition.nextView;
					transition.nextView = temp;

					return transition;
				}
			}
		}

		const defaultTransition = new this.defaultTransition(prevView, nextView);
		this.addTransition(defaultTransition);

		return defaultTransition;
	}

}

export default TransitionManager;