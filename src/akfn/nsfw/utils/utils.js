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

/Users/romain/Sites/nsfw/_temp/utils/utils.jsexport function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

/**
 * Return true 1 times out of {chances}
 *
 * @return boolean
 */
export function lucky(chances) {
    return !~~(Math.random() * chances);
}

/**
 * Generates random numbers
 *
 * @return float
 */
export function random(low, hight) {
    return Math.random() * (hight-low) + low;
}

/**
 * Get random value of an array
 *
 * @return array value
 */
export function randomFromArray(array) {
    return array[~~(Math.random() * array.length)];
}

/**
 * Returns a suffled version of the original array
 * 
 * @return Array
 */
export function shuffleArray(o) {
    for(let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/**
 * Return a clamped value between two bounds
 *
 * @return {number} clamped value
 */
export function clamp ( value, min, max ) {
    if ( value < min ) {
        return min; 
    }

    if ( value > max ) {
        return max; 
    }

    return value;
};

/**
 * TODO!
 * @param  {Array}  as [description]
 * @return {[type]}    [description]
 */
export function removeNil ( as = [] ) {
    return as.filter(a => a != null);
}

/**
 * TODO!
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
export function merge (...args) {
    const filtered = removeNil(args);
    
    if ( filtered.length < 1 ) {
        return {};
    }
    
    if ( filtered.length === 1 ) {
        return args[0];
    }

    return filtered.reduce( ( acc, cur ) => {
        Object.keys(cur).forEach((key) => {
            if ( typeof acc[key] === 'object' && typeof cur[key] === 'object' && cur[key].length === undefined) {
                acc[key] = merge(acc[key], cur[key]);
            } else {
                acc[key] = cur[key];
            }
        });
        
        return acc;
    }, {});
}

/**
 * Generate an unique ID
 * @return {String}
 */
export function getUniqueID () {
    return '_' + Math.random().toString(36).substr(2, 9);
}