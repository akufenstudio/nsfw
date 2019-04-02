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
 * SOUND
 * CHANNEL
 *
 * v1.1
 */

class SoundChannel {

	constructor () {

		// properties
		this.id = '';
		this.howl = {};

		// params
		this.isPlaying = false;
		this.isHowl = false;
		this.isMuted = false;
		this.verbose = true;

		this.audio = new Audio();
		this.audio.addEventListener('ended', ::this.onEnd);

		if(this.verbose) document.body.appendChild(this.audio);
	}

	/**
	 * Play Channel
	 * @param  {Sound}  sound 		Sound object
	 * @param  {Boolean} isMuted 	SoundManager mute status
	 */
	play ( sound, isMuted ) {
		const { id, src, loop, volume } = sound;

		if ( !src ) {
			throw new Error('SoundManager :: cannot play a sound without a source', sound);
		}

		if (this.verbose) {
			this.audio.classList.add('playing');
			this.audio.classList.add(id);
			console.log(`%cSoundChannel :: play :: ${id} - ${src}`, `color:#ddd;`);
		}

		this.id = id;
		this.sound = sound;

		if ( loop ) {
			const sameSource = this.howl._src === `${window.location.origin}${src}` || this.howl._src === src;

			if ( !sameSource ) {
				this.isHowl = true;
				this.isPlaying = true;
				this.howl = new Howl({
					src: src,
					autoplay: true,
					loop: true,
				});
			}

			this.howl._volume = isMuted ? 0 : volume;
			this.howl.play();

		} else {

			const sameSource = this.audio.src === `${window.location.origin}${src}` || this.audio.src === src;

			if ( !sameSource ) {
				this.isHowl = false;
				this.audio.src = src;
				this.audio.load();
			}

			this.isPlaying = true;
			this.audio.volume = isMuted ? 0 : volume;
			this.audio.play();
		}
	}

	/**
	 * Stop Channel
	 */
	stop ( id ) {

		if(this.verbose) console.log(`%cSoundChannel :: stop :: ${id}`, `color:#ddd;`);

		if ( this.isHowl ) {
			this.howl.pause();
		} else {
			this.audio.classList.remove('playing');
			this.audio.pause();
		}

		this.clear();
	}

	/**
	 * Fade Channel
	 * @param  {Number} volume   	Between 0 and 1
	 * @param  {Number} duration 	In seconds
	 */
	fade ( volume, duration ) {
		const track = this.getTrack();

		TweenMax.to(track, duration, { volume: volume });

		if(this.verbose) this.audio.setAttribute('data-volume', volume);
	}

	onEnd () {
		this.clear();
	}

	clear () {
		if(this.verbose) this.audio.classList.remove('playing');

		this.isPlaying = false;
	}

	getTrack () {
		if ( this.isHowl ) {
			return this.howl;
		}

		return this.audio;
	}

	/**
	 * Volume Channel
	 * @param  {Number} value 		Volume between 0 and 1
	 */
	volume ( value ) {
		this.sound.volume = value;

		if (!this.isMuted) {
			if ( this.isHowl ) {
				this.howl.volume(this.sound.volume);
			} else {
				this.audio.volume = this.sound.volume;
			}
		}

		if(this.verbose) this.audio.setAttribute('data-volume', value);
	}

	/**
	 * Mute Channel
	 */
	mute () {

		//security check
		if ( !this.isPlaying ) return;
		this.isMuted = true;

		if ( this.isHowl ) {
			this.howl.volume(0);
		} else {
			this.audio.volume = 0;
		}

		if(this.verbose) console.log(`%cSoundChannel :: Mute : ${this.id}`, 'color:#f4e0c8');
	}

	/**
	 * Unmute Channel
	 */
	unmute () {

		//security check
		if ( !this.isPlaying ) return;
		this.isMuted = false;

		if ( this.isHowl ) {
			this.howl.volume(this.sound.volume);
		} else {
			this.audio.volume = this.sound.volume;
		}

		if(this.verbose) console.log(`%cSoundChannel :: UnMute : ${this.id}`, 'color:#f4e0c8');
	}

}

export default SoundChannel;