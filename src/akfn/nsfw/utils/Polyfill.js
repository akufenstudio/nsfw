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

const polyfillTests = [
    { file: `${PUBLIC_PATH_JS}/fetch.polyfill.js`, supported: 'fetch' in window, name: 'fetch' },
    { file: `${PUBLIC_PATH_JS}/promise.polyfill.js`, supported: 'Promise' in window, name: 'Promise' },
    { file: `${PUBLIC_PATH_JS}/intersectionObserver.polyfill.js`, supported: 'IntersectionObserver' in window, name: 'IntersectionObserver' },
    { file: `${PUBLIC_PATH_JS}/array.polyfill.js`, supported: Array.from, name: 'Array' },
    { file: `${PUBLIC_PATH_JS}/string.polyfill.js`, supported: String.prototype.includes, name: 'String' },
];

class Polyfill {

    static add ( supported, file, name ) {
        polyfillTests.push({ file, supported, name });
    }

    static check ( onLoad ) {
        if ( typeof onLoad !== 'function' ) {
            console.error(`Polyfill :: you need to provide a callback function parameter to check()`);
            return;
        }

        const scriptsToLoad = polyfillTests.reduce( ( scripts, { supported, file, name } ) => {
            if ( !supported ) {
                scripts.push({ file, name });
            }

            return scripts;
        }, []);

        if ( scriptsToLoad.length <= 0 ) {
            onLoad();
        }

        let scriptsLoaded = 0;

        const onScriptLoaded = () => {
            scriptsLoaded++;

            if ( scriptsLoaded === scriptsToLoad.length ) {
                onLoad();
            }
        };

        for ( let i = 0; i < scriptsToLoad.length; i++ ) {
            Polyfill.load(scriptsToLoad[i].file, onScriptLoaded, scriptsToLoad[i].name);
        }
    }

    static load ( path, callback, name ) {
        const script = document.createElement('script');
        script.onload = function () {
            if ( name ) {
                Polyfill[`${name}`] = true;
            }

            callback();
        };
        script.onerror = function ( error ) {
            console.error(error);

            // console.error(new Error(`Failed to load script ${path}`));
        };
        script.src = path;
        document.body.appendChild(script);
    }

}

export default Polyfill;