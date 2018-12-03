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

/Users/romain/Sites/nsfw/_temp/sound/SoundMapper.jsimport EventsManager from 'akfn/nsfw/events/EventsManager';
import NSFWEvents from 'akfn/nsfw/events/NSFWEvents';


/**
 * N * S * F * W
 * 
 * SoundMapper
 *
 * v1.0
 * 
 */

class SoundMapper {
	
	/**
	 * Bind sound and event on specific DOM elements 
	 * @param  {String} contextID 	Must be unique or at least not used at this time
	 * @param  {NodeCollection} elements | Targeted DOM elements
	 * @param  {String} event     	Native event that would be triggered
	 * @param  {String} soundID   	Sound ID, must be already registered in SoundManager !
	 * @param  {Object} opts      	Options (check defaults below)
	 */
	static bind ( contextID, elements, event, soundID ) {

		// security checks
		if(SoundMapper.fnByContext[contextID]) {
			console.warn('SoundMapper :: Context already used :', contextID);
			return;
		}

		if(!elements || elements.length < 1) {
			console.warn('SoundMapper :: Invalid target :', contextID);
			return;
		}

		if( SoundMapper._verbose ) console.log(`%cSoundMapper :: Bind : ${contextID} ${event} ${soundID} ${elements.length}`, 'color:#bbb');

		// bndings
		const fn = ()=>{
			EventsManager.emit( NSFWEvents.Sound.PLAY, soundID);
		};

		SoundMapper.fnByContext[contextID] = {fn:fn, event:event, elements:elements};

		for( let i = 0; i < elements.length; i++) {
			elements[i].addEventListener( event, fn );
		}

	}

	/**
	 * Unbind existing connection between sound and DOM elements
	 * @param  {String} contextID
	 */
	static unbind ( contextID ) {

		const context = SoundMapper.fnByContext[contextID];

		if(!context) {
			console.warn('SoundMapper :: Context undefined :', contextID);
			return;
		}

		if( SoundMapper._verbose ) console.log(`%cSoundMapper :: Unbind : ${contextID}`, 'color:#bbb');

		for( let i = 0; i < context.elements.length; i++) {
			context.elements[i].removeEventListener( context.event, context.fn );
		}

		delete SoundMapper.fnByContext[contextID];
	}

	/**
	 * Debug
	 * @return {Object} Current bindings
	 */
	static debug() {

		console.table(SoundMapper.fnByContext);
	}

	/**
	 * Verbose
	 * @param  {Boolean} status 
	 */
	static verbose ( flag = true ) {

		SoundMapper._verbose = flag;
	}
}

/**
 * Properties
 * @type {Object}
 */
SoundMapper.fnByContext = {};
SoundMapper._verbose = false;

export default SoundMapper;