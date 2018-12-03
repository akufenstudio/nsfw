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

/Users/romain/Sites/nsfw/_temp/dom/TilingSprite.jsimport { merge } from 'akfn/nsfw/utils/utils';

/**
 * Tiling Sprite
 *
 * v1.0
 */


class TilingSprite {

    constructor ( sprite = '', frames, view, options = {} ) {
        const defaults = {
            fps: 1,
            autoPlay: false,
            loop: true
        };

        this.options = merge(defaults, options);
        this.sprite = sprite;
        this.frames = frames;
        this.$view = view;

        this.onSpriteLoad = ::this.onSpriteLoad;

        this.currentFrame = 0;
        this.playing = false;
        this.now = Date.now();
        this.lastTime = this.now;

        this.$image = document.createElement('img');
        this.$image.onload = this.onSpriteLoad;
        this.$image.src = this.sprite;
    }

    onSpriteLoad () {
        if ( this.$image.naturalHeight / this.frames !== Math.floor(this.$image.naturalHeight / this.frames) ) {
            console.warn(`TilingSprite :: can't split equally an image of ${this.$image.naturalHeight}px by ${this.frames}`);
        }

        this.$view.style.overflow = 'hidden';
        this.$view.appendChild(this.$image);

        this.resize();
        
        if ( this.options.autoPlay ) {
            this.play();
        }
    }

    play () {
        this.playing = true;
    }

    stop () {
        this.playing = false;
    }

    reset () {
        this.currentFrame = 0;
    }

    restart () {
        this.reset();
        this.play();
    }

    update () {
        if ( this.playing ) {
            this.now = Date.now();
            this.delta = this.now - this.lastTime;

            if ( this.delta > ( 1 / this.options.fps ) * 1000 ) {
                this.lastTime = this.now;
                this.currentFrame += 1;
            }

            if ( this.currentFrame > this.frames ) {
                if ( this.options.loop ) {
                    this.currentFrame = 0;
                } else {
                    this.stop();
                }
            }

            const transform = `translate3d(0, ${-this.currentFrame * this.height}px, 0)`;

            this.$image.style.transform = this.$image.style.WebkitTransform = transform;
        }
    }

    resize () {
        this.width = this.$view.offsetWidth;
        this.height = ( this.width * this.$image.naturalHeight / this.$image.naturalWidth ) / this.frames;
        this.$view.style.height = `${this.height}px`;

        this.currentFrame = 0;
    }

}

export default TilingSprite;