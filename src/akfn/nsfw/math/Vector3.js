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

class Vector3 {

    constructor ( x = 0, y = 0, z = 0 ) {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    set ( x, y, z ) {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    clone () {
        return new Vector3(this.x, this.y, this.z);
    }

    copy ( v ) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;

        return this;
    }

    add ( v ) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;
    }

    addScalar ( s ) {
        this.x += s;
        this.y += s;
        this.z += s;

        return this;
    }

    sub ( v ) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;

        return this;
    }

    subScalar ( s ) {
        this.x -= s;
        this.y -= s;
        this.z -= s;

        return this;
    }

    subVectors ( a, b ) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;
    }

    multiply ( v ) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;

        return this;
    }

    multiplyScalar ( s ) {
        if ( isFinite(s) ) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }

        return this;
    }

    divide ( v ) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;

        return this;
    }

    divideScalar ( s ) {
        return this.multiplyScalar(1 / s);
    }

    dot ( v ) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    lengthSq () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length () {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    }

    setLength ( length ) {
        return this.multiplyScalar(length / this.length());
    }

    normalize () {
        return this.divideScalar(this.length());
    }

    distanceTo ( v ) {
        return Math.sqrt(this.distanceToSquared(v));
    }

    distanceToSquared ( v ) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;
    }

    lerp ( v, alpha ) {
        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;
        this.z += ( v.z - this.z ) * alpha;

        return this;
    }

    lerpVectors ( v1, v2, alpha ) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
    }

    equals ( v ) {
        return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );
    }

}

export default Vector3;