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

/Users/romain/Sites/nsfw/_temp/video/vimeo/VimeoPlayer.jsimport EventsManager from 'akfn/nsfw/events/EventsManager';
import NSFWEvents from 'akfn/nsfw/events/NSFWEvents';
import { merge } from 'akfn/nsfw/utils/utils';

/**
 * VIMEO
 * PLAYER
 *
 * v2.0
 */

class VimeoPlayer {
	constructor(options = {}) {
		// Binding
		this.onVideoLoaded 	= ::this.onVideoLoaded;
		this.emitPlay 		= ::this.emitPlay;
		this.emitPause 		= ::this.emitPause;
		this.emitEnded 		= ::this.emitEnded;
		this.emitSeeked 	= ::this.emitSeeked;
		this.emitLoaded 	= ::this.emitLoaded;

		// Default Options
		const defaultOptions = {
			el : '',
			src : '',
			callback : '',
			vimeoOptions: {
				id: '',
				width: 640,
				loop: false,
				color:'ffffff',
				autoplay : false
			}
		};

		// Merge options
		this.mergedOptions = merge(defaultOptions, options);

		// Init video
	    this.initVideo();
	}

	initVideo(){
		// Create iframe
        this.$iframe = document.createElement('iframe');
        this.$iframe.setAttribute('src', this.mergedOptions.src);
        this.$iframe.setAttribute('frameborder', 0);
        this.$iframe.setAttribute('webkitallowfullscreen', true);
        this.$iframe.setAttribute('mozallowfullscreen', true);
        this.$iframe.setAttribute('allowfullscreen', true);
        this.$iframe.setAttribute('allow', 'autoplay; encrypted-media');
        this.mergedOptions.el.appendChild(this.$iframe);

        // Create player
		this.player = new Vimeo.Player(this.$iframe, this.mergedOptions.vimeoOptions);
		this.emitEvents();
	}

	onVideoLoaded(){
		if ( this.mergedOptions.callback && typeof this.mergedOptions.callback === 'function' ) {
			this.mergedOptions.callback();
		}
	}

	play(){
		this.player.play();
	}

	pause(){
		this.player.pause();
	}

	stop(){
		this.player.pause();
		this.player.setCurrentTime(0);
	}

	setVolume(value){
		this.player.setVolume(value);
	}

	setCurrentTime(value){
		this.player.setCurrentTime(value)
	}

	emitEvents(){
		this.player.on('play', this.emitPlay);
		this.player.on('pause', this.emitPause);
		this.player.on('ended', this.emitEnded);
		this.player.on('seeked', this.emitSeeked);
		this.player.on('loaded', this.emitLoaded);
	}

	emitPlay(){ 
		EventsManager.emit(NSFWEvents.VimeoPlayer.PLAY, this.player); 
	}

	emitPause(){ 
		EventsManager.emit(NSFWEvents.VimeoPlayer.PAUSE, this.player); 
	}

	emitEnded(){ 
		EventsManager.emit(NSFWEvents.VimeoPlayer.END, this.player); 
	}

	emitSeeked(){ 
		EventsManager.emit(NSFWEvents.VimeoPlayer.SEEK, this.player); 
	}

	emitLoaded(){ 
		this.onVideoLoaded();
		
		EventsManager.emit(NSFWEvents.VimeoPlayer.LOADED, this.player); 
	}

	destroy(){
		this.player.off('play', this.emitPlay);
		this.player.off('pause', this.emitPause);
		this.player.off('ended', this.emitEnded);
		this.player.off('seeked', this.emitSeeked);
		this.player.off('loaded', this.emitLoaded);
		this.player.destroy();
	}
}
export default VimeoPlayer;