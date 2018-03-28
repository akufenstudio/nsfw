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

import { merge } from 'akfn/nsfw/utils/utils';

const defaults = {
    width: window.innerWidth,
    height: window.innerHeight,
    renderer: {
        antialias: true,
        alpha: false,
        bgColor: 0x000000,
        pixelRatio: window.devicePixelRatio
    },
    verbose: false,
};

class PIXIApp {

    constructor ( opts = {} ) {
        const options = merge(defaults, opts);

        this.verbose = options.verbose;

        if ( this.verbose ) console.log(`PIXIApp options ::`, options);

        this.width = options.width;
        this.height = options.height;

        const optionsRenderer = {
            antialias: options.renderer.antialias,
            transparent: options.renderer.alpha,
            resolution: options.renderer.pixelRatio,
            backgroundColor: options.renderer.bgColor,
        };

        if ( options.canvas ) {
            optionsRenderer.view = options.canvas;
        }

        // renderer
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, optionsRenderer);

        if ( options.container ) {
            options.container.appendChild(this.renderer.view);
        }

        // stage
        this.stage = new PIXI.Container();
    }

    render () {
        this.renderer.render(this.stage);
    }

    resize ( w, h ) {
        this.renderer.resize(w,h);
    }

    dispose () {
        this.stage.destroy(true);
        this.renderer.destroy(true);

        this.stage = null;
        this.renderer = null;
    }

}

export default PIXIApp;