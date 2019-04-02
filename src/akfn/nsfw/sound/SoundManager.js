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

import NSFWEvents from '../events/NSFWEvents';
import EventsManager from '../events/EventsManager';

import VisibilityManager from '../managers/VisibilityManager';

import Sound from './Sound';
import SoundChannel from './SoundChannel';
import SoundBatcher from '../loaders/SoundBatcher';

 /**
  * N * S * F * W
  * 
  * SOUND
  * MANAGER
  *
  * v1.02
  */


class SoundManager {

	static start(options) {
		if(!SoundManager.instance) SoundManager.instance = new SoundManager(options);
	}

	constructor({ path = '', preload = false, crossfadeTime = 0.5, sounds = [], verbose = false }) {

		// options
		this.path = path;
		this.preload = preload;
		this.crossfadeTime = crossfadeTime;
		this.verbose = verbose;

		// properties
		this.channels = [];
		this.sounds = {};

		// params
		const key = 'AKFNSMisMuted';
		const status = window.localStorage ? JSON.parse(window.localStorage.getItem(key)) : false;

		Object.defineProperty(this, 'isMuted', {
			get: () => { 
				return NSFW.isMuted;
			},
			set: ( isMuted ) => {
				NSFW.isMuted = isMuted;

				if ( window.localStorage ) {
					window.localStorage.setItem(key, isMuted);
				}
			},
			enumerable: true,
			configurable: true
		});

		this.isMuted = typeof status === 'boolean' ? status : false;

		if ( this.verbose ) console.log(`%cSoundManager :: isMuted : ${this.isMuted}`, `color:#CCC;`);


		// Howler
		const { Howl, Howler } = require('howler');

		window.Howl = Howl;
		window.Howler = Howler;

		// create sounds
		for ( let i = 0; i < sounds.length; i++ ) {
			this.add( sounds[i] );
		}

		

		/**
		 * Preload sounds lib
		 * - preloads all urls set in sounds
		 */

		if ( preload ) {
			const batcher = new SoundBatcher({verbose:verbose});
			const keys = Object.keys(this.sounds);

			for ( let i = 0; i < keys.length; i++ ) {
				const key = keys[i];
				const sound = this.sounds[key];

				batcher.add(sound.src);
			}

			batcher.start();
		}

		/**
		 * Events
		 */
		
		EventsManager.on(NSFWEvents.Sound.ADD, ::this.add);

		EventsManager.on(NSFWEvents.Sound.MUTE, ::this.handleMute);
		EventsManager.on(NSFWEvents.Sound.UNMUTE, ::this.handleUnMute);
		EventsManager.on(NSFWEvents.Sound.TOGGLE_MUTE, ::this.toggleMute);
		EventsManager.on(NSFWEvents.Sound.PLAY, ::this.handlePlay);
		EventsManager.on(NSFWEvents.Sound.STOP, ::this.handleStop);
		EventsManager.on(NSFWEvents.Sound.CROSSFADE, ::this.handleCrossfade);

		/**
		 * VisibilityManager
		 * - helps to shut down loops when user leaves current browser tab
		 */
		VisibilityManager.start();
		VisibilityManager.bind('SoundManager', ::this.handleVisibility);
	}

	handleMute () {
		this.isMuted = true;

		for ( let i = 0; i < this.channels.length; i++ ) {
			this.channels[i].mute();
		}
			
		if ( this.verbose ) console.log(`%cSoundManager :: mute`, `color:#CCC;`); 
	}

	handleUnMute () {
		this.isMuted = false;

		for ( let i = 0; i < this.channels.length; i++ ) {
			this.channels[i].unmute();
		}

		if ( this.verbose ) console.log(`%cSoundManager :: unmute`, `color:#CCC;`);
	}

	toggleMute () {
		if ( this.isMuted ) {
			this.handleUnMute();
		} else {
			this.handleMute();
		}
	}

	handlePlay ( id ) {
		const sound = this.sounds[id];

		if ( !sound ) {
			console.warn(`SoundManager :: Available sounds`, this.sounds);
			throw new Error(`SoundManager :: Sound ${id} not found.`);
		}

		if ( sound ) {
			const channel = this.findAvailableChannel();
			channel.play(sound, this.isMuted);

			return channel;
		}
	}

	handleStop ( id ) {
		if ( !id || id === '' ) return;

		if ( this.verbose ) console.log(`%cSoundManager :: stop ${id}`, `color:#CCC;`);

		for ( let i = 0; i < this.channels.length; i++ ) {
			if ( this.channels[i].id === id ) {
				this.channels[i].stop( id );
			}
		}
	}

	handleCrossfade ( ids ) {
		const [ id1, id2 ] = ids;

		this.update(id2, { volume: 0 });
		
		const channelOut = this.findChannel(id1);
		const channelIn = this.handlePlay(id2);

		if ( channelOut ) {
			channelOut.fade(0, this.crossfadeTime);
		}

		if ( channelIn ) {
			channelIn.fade(this.sounds[id2].volume, this.crossfadeTime);
		}
	}

	findAvailableChannel () {
		// get an existing and available player
		for ( let i = 0; i < this.channels.length; i++ ) {
			const channel = this.channels[i];

			if ( !channel.isPlaying ) {
				return channel;
			}
		}

		// no available channel, create a new one
		const channel = new SoundChannel();
		this.channels.push(channel);

		return channel;
	}

	findChannel ( id ) {
		for ( let i = 0; i < this.channels.length; i++ ) {
			if ( this.channels[i].id === id ) {
				return this.channels[i];
			}
		}

		return false;
	}

	add ( sound = {} ) {
		if ( this.sounds[sound.id] ) {
			console.warn(`SoundManager :: sound ${sound.id} already exists and is going to be overwritten.`);
		}

		this.sounds[sound.id] = new Sound({
			...sound,
			src: this.path === '' ? sound.src : `${this.path}/${sound.src}`,
		});
	}

	update ( id = '', options = {} ) {
		if ( this.sounds[id] ) {
			const { src, volume, loop } = options;

			if ( src ) this.sounds[id].src = src;
			if ( volume ) this.sounds[id].volume = volume;
			if ( loop ) this.sounds[id].loop = loop;
		} else {
			this.add({ id, ...options});
		}
	}

	/**
	 * Visibility
	 */
	handleVisibility ( isVisible ) {
		
		if(this.verbose) console.log('Visibility :: ', document.hidden);

		// document.hidden is true on load, so it tries to mute on start 樂
		if ( this.isMuted ) {
			return;
		}

		// if ( isVisible ) {
		//     this.handleUnMute();
		// } else {
		//     this.handleMute();
		// }
	}


}

export default SoundManager;