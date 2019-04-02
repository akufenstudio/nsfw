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

import AssetsLoader from 'akfn/nsfw/loaders/AssetsLoader';
import PackWorker from './pack.worker.js';

class ToPack {

    constructor ( pathBuffer, pathConfig, config, buffer, blobs ) {
        this.pathBuffer = pathBuffer;
        this.pathConfig = pathConfig;
        this.config = config;
        this.buffer = buffer;

        if ( typeof blobs === 'undefined') {
            this.loaded = false;
            this.blobs = {};
        } else {
            this.blobs = blobs;
            this.loaded = true;
        }

        if ( !this.loaded ) {
            for ( let i = 0; i < this.config.length; i++ ) {
                const id = this.config[i][0];
                const file = this.findFile(id);
                const data = this.getData(file);
                const type = this.getType(file);

                this.blobs[id] = URL.createObjectURL(new Blob([data], { type: type }));
            }

            this.loaded = true;
        }
    }

    getData ( file ) {
        return this.slice(file.begin, file.end);
    }
    
    getType ( file ) {
        return file.type || 'text/plain';
    }
    
    slice ( begin, end ) {
        if ( this.buffer === null ) {
            return typeof Uint8Array == "function" ? new Uint8Array([]) : "";
        }

        if (typeof this.buffer.substr == "function") {
            return this.buffer.substr(begin, end - begin);
        }

        return this.buffer.slice(begin, end);
    }
    
    findFile ( name ) {
        let i = this.config.length;
        while ( i-- > 0 ) {
            if( this.config[i][0] === name) {
                const c = this.config[i];
                return {
                    name: c[0],
                    begin: c[1],
                    end: c[2],
                    type: c[3]
                };
            }
        }
    }

    getURI ( id ) {
        return this.blobs[id];
    }

    static async load ( pathPack, pathJSON ) {
        if ( AssetsLoader.isWorkerSupported() ) {
            const { config, buffer, blobs } = await AssetsLoader.loadOnWorker([pathPack, pathJSON], { worker: PackWorker });
            const pack = new ToPack(pathPack, pathJSON, config, buffer, blobs);
    
            return pack;
        } else {
            const loadPack = () => AssetsLoader.loadOnMainThread(pathPack, { buffer: true });
            const loadConfig = () => AssetsLoader.loadOnMainThread(pathJSON, { json: true });
    
            const [ config, buffer ] = await Promise.all([loadConfig(), loadPack()]);
            const pack = new ToPack(pathPack, pathJSON, config, buffer);
            
            return pack;
        }
    }

}

export default ToPack;