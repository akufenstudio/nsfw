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

import EventsManager from 'akfn/nsfw/events/EventsManager';
import NSFWEvents from 'akfn/nsfw/events/NSFWEvents';

/**
 *  YOUTUBE
 *  PLAYER
 *  
 *  v1.0
 */

class Youtube {

	constructor ( el, id, autoplay = false, loop = false, mute = false ) {

		this.autoplay = autoplay;
		this.loop = loop;
		this.mute = mute;
		this.done = false;

		// bindings
		this.onPlayerReady = ::this.onPlayerReady;
		this.onPlayerStateChange = ::this.onPlayerStateChange;

		this.player = new YT.Player(el, {
			playerVars: {
				rel:0,
				controls:2,
				disablekb:0,
				modestbranding:1
			},
			height: '390',
			width: '640',
			autoplay: this.autoplay ? 1 : 0,
			videoId: id,
			events: {
				'onReady': this.onPlayerReady,
				'onStateChange': this.onPlayerStateChange
			}
		});

	}

	onPlayerReady ( event ) {

		event.target.playVideo();
		
	}

	onPlayerStateChange ( event ) {

		// 1st play
		if (event.data == YT.PlayerState.PLAYING && !this.done) {
			if (!this.autoplay) this.stop();
			if (this.mute) this.player.mute();
			this.done = true;
			
		// pause
		} else if (event.data === YT.PlayerState.PAUSED ) {

			EventsManager.emit( NSFWEvents.Video.PAUSE );

		// end
		} else if (event.data == YT.PlayerState.ENDED) {
			this.stop();
			EventsManager.emit( NSFWEvents.Video.PAUSE );
			EventsManager.emit( NSFWEvents.Video.END );
			if (this.loop) {
				this.play();
			}
		}

	}

	play () {

		if(this.player) this.player.playVideo();

	}

	pause () {

		this.player.pauseVideo();

	}

	stop () {

		this.player.seekTo(0);
		this.player.stopVideo();

	}

	dispose () {

		this.player.destroy();
		this.player = null;

		this.onPlayerReady = 
		this.onPlayerStateChange = null;
		
	}

}

export default Youtube;