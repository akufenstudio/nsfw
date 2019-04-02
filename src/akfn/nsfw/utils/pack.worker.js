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
 * Pack
 * 
 * 1.1
 */

self.addEventListener('message', onMessage);

// options
var verbose = false;
var result = {};
var options = {};

/**
 * Start
 */
function onMessage ( event ) {
	verbose = event.data.verbose;
	options = event.data.options ? event.data.options : {};

	var pathBuffer = event.data.items[0];
	var pathConfig = event.data.items[1];

	Promise.all([loadBuffer(pathBuffer), loadConfig(pathConfig)]).then( ([ buffer, config ]) => {
		result.buffer = buffer;
		result.config = config;
		result.blobs = {};

		for ( let i = 0; i < config.length; i++ ) {
			const id = config[i][0];

			result.blobs[id] = getURI(id);
		}

		post(event.data.id);
	});
}

function getData ( name ) {
	const file = findFile(name);
	return slice(file.begin, file.end);
}

function getType ( id ) {
	return findFile(id).type || "text/plain";
}

function slice (begin, end) {
	if ( result.buffer === null ) {
		return typeof Uint8Array == "function" ? new Uint8Array([]) : "";
	}
	if (typeof result.buffer.substr == "function") {
		return result.buffer.substr(begin, end - begin);
	}
	return result.buffer.slice(begin, end);
};

function findFile (name) {
	let i = result.config.length;
	while (i-- > 0) {
		if(result.config[i][0] === name)
		{
			const c = result.config[i];
			return {
				name: c[0],
				begin: c[1],
				end: c[2],
				type: c[3]
			};
		}
	}
}

function getURI ( id ) {
	const data = getData(id);
	const type = id.indexOf('.svg') > -1 ? 'image/svg+xml' : getType(id);

	return URL.createObjectURL(new Blob([data], { type: type }));
}

/**
 * Load Config
 */

function loadConfig( url ) {
	return fetch(url, { mode: options.mode ? options.mode : 'cors' })
		.then( ( response ) => {
			if ( !response.ok ) {
				throw Error(`${response.url} ${response.status} (${response.statusText})`);
			}

			return response.json();
		});
}

/**
 * Load Pack
 */
function loadBuffer( url ) {
	return fetch(url)
		.then( ( response ) => {
			if ( !response.ok ) {
				throw Error(`${response.url} ${response.status} (${response.statusText})`);
			}

			return response.arrayBuffer();
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
		result: result,
	});
}