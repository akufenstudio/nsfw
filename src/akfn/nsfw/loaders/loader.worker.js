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
 * Worker
 * Preloader
 * 
 * 1.1
 */

self.addEventListener('message', onMessage);

// options
var verbose = false;
var results = [];
var blob = false;
var base64 = false;
var options = {};

function onMessage ( event ) {
    verbose = event.data.verbose;
    blob = event.data.blob ? event.data.blob : false;
    options = event.data.options ? event.data.options : {};
    base64 = event.data.base64 ? event.data.base64 : '';
    
    var items = event.data.items;

    var promises = [];
    
    if ( items.length > 0 ) {
        
        for ( var i = 0; i < items.length; i++ ) {
            promises[i] = load(i, items[i]);
        }
        
        Promise.all(promises).then( ( responses ) => {
            results = responses;
    
            post(event.data.id);
        }); 
    } else {
        post(event.data.id);
    }
}

/**
 * Load
 * @param  {String} id  [description]
 * @param  {String} url [description]
 */
function load( index, url ) {
    if ( verbose ) {
        console.log(`Worker :: load`, url);
    }

    return fetch(url, {
        mode: options.mode ? options.mode : 'cors',
        headers: options.headers ? options.headers : {}
     }).then( ( response ) => {
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

            if (url.indexOf('.svg') > -1) {
                return response.text().then( ( blob ) => {
                    const svgBlob = new Blob([blob], { type: 'image/svg+xml' });
                    const blobURL = URL.createObjectURL(svgBlob);
                    return blobURL;
                });
            } else {
                return response.blob().then( ( blob ) => {
                    const blobURL = URL.createObjectURL(blob);
                    return blobURL;
                });
            }
        });
}

/**
 * Post
 * @param  {String} id [description]
 */
function post( id ) {
	self.postMessage({
		post: true,
		id: id,
		result: results
	});
}