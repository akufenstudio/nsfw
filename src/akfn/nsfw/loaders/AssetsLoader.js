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

import Pool from 'akfn/nsfw/utils/Pool';
import LoaderWorker from './loader.worker.js';
import { getUniqueID } from 'akfn/nsfw/utils/utils';
import Polyfill from 'akfn/nsfw/utils/Polyfill';

/**
 * Assets Loader
 * v1.1
 */

const isWorkerSupported = () => {
   return typeof Worker !== 'undefined' && !Polyfill.Promise && !Polyfill.fetch;
};

const workers = new Pool( () => {
    return new LoaderWorker();
});

const createMedia = ( element, event, url ) => {
    if ( !url ) return null;

    return new Promise( ( resolve, reject ) => {
        const $el = document.createElement(element);
        // $el.crossOrigin = 'Anonymous';

        const onLoad = () => {
            $el.removeEventListener(event, onLoad);

            resolve($el);
        };

        $el.addEventListener(event, onLoad);
        $el.addEventListener('error', ( error ) => reject(error));

        $el.src = url;
    });
};

export const createImage = ( url ) => {
    if ( Array.isArray(url) ) {
        return Promise.all(url.map( u => createMedia('img', 'load', u)));
    }

    return createMedia('img', 'load', url);
};

export const createVideo = ( url, event = 'canplay' ) => {
    if ( Array.isArray(url) ) {
        return Promise.all(url.map( u => createMedia('video', event, u)));
    }

    return createMedia('video', event, url);
};

export const createAudio = ( url, event = 'canplaythrough' ) => {
    if ( Array.isArray(url) ) {
        return Promise.all(url.map( u => createMedia('audio', event, u)));
    }

    return createMedia('audio', event, url);
};

export const loadOnWorker = async ( paths, options = {} ) => {
    const isMultiple = Array.isArray(paths);

    return new Promise( ( resolve, reject ) => {
        const worker = options.worker ? new options.worker() : workers.get();

        const onError = ( error ) => {
            reject(error);
        };

        const id = getUniqueID();
        const cleanOptions = {...options};
        
        // if a worker exists in the options, remove it before sending options to worker (cannot send a function to a worker)
        if ( cleanOptions.worker ) {
            delete cleanOptions['worker'];
        }

        const onComplete = ( event ) => {
            worker.removeEventListener('message', onComplete);
            worker.removeEventListener('error', onError);

            if ( !options.worker ) {
                workers.release(worker);
            }

            if ( id === event.data.id ) {
                const result = isMultiple ? event.data.result : event.data.result[0];
    
                resolve(result);
            } else {
                console.error('AssetsLoader :: not matching ids on worker.'); // INFO: CUSTOM CODE
                reject(`AssetsLoader :: not matching ids on worker.`);
            }
        };
        
        worker.addEventListener('message', onComplete);
        worker.addEventListener('error', onError);
        
        worker.postMessage({
            id: id,
            items: isMultiple ? paths : [ paths ],
            verbose: false,
            options: cleanOptions,
        });
    });
};

const loadOnMainThread = async ( path, options ) => {

    const response = await fetch(path, {
        mode: options.mode ? options.mode : 'cors',
        headers: options.headers ? options.headers : {}
    });

    if ( !response.ok ) {
        console.error(`${response.url} ${response.status} (${response.statusText})`);
        return null;
    }

    if ( options.json ) {
        return response.json();
    }

    if ( options.text ) {
        return response.text();
    }

    if ( options.buffer ) {
        return response.arrayBuffer();
    }

    let blob;

    if (response.url.indexOf('.svg') > -1) {
        const data = await response.text();
        blob = new Blob([data], {type: 'image/svg+xml'});
    } else {
        blob = await response.blob()
    }
    
    const blobURL = URL.createObjectURL(blob);
    return blobURL;
};

const load = async ( paths, options, loader ) => {


    /**
     * Security check:
     * Avoiding empty arrays
     */
    if( paths === null || paths === undefined || ( paths && paths.length < 1 )) {
        return Promise.resolve( paths );
    }

    const shouldReturn = options.blob || options.json || options.text || options.buffer;

    if ( isWorkerSupported()  ) {
        const result = await loadOnWorker(paths, options);

        if ( shouldReturn ) {
            return result;
        }

        if ( typeof loader !== 'function' ) {
            throw new Error(`AssetsLoader :: you need to provide a loader function.`);
        }

        return loader(result);
    } else {
        const result = await ( Array.isArray(paths) ? Promise.all(paths.map( path => loadOnMainThread(path, options))) : loadOnMainThread(paths, options) );

        if ( shouldReturn ) {
            return result;
        }

        if ( typeof loader !== 'function' ) {
            throw new Error(`AssetsLoader :: you need to provide a loader function.`);
        }

        return loader(result);
    }
};

const loadImage = async ( paths, options = {} ) => {
    return load(paths, options, createImage);
};

const loadVideo = async ( paths, options = {} ) => {
    return load(paths, options, createVideo);
};

const loadAudio = async ( paths, options = {} ) => {
    return load(paths, options, createAudio);
};

const loadFile = async ( paths, options = {} ) => {
    return load(paths, {...options, text: true });
};

const loadJSON = async ( paths, options = {} ) => {
    return load(paths, {...options, json: true });
};

const AssetsLoader = {
    loadImage,
    createImage,
    loadVideo,
    createVideo,
    loadAudio,
    createAudio,
    loadFile,
    loadJSON,
    load,
    loadOnMainThread,
    loadOnWorker,
    isWorkerSupported
};

export default AssetsLoader;