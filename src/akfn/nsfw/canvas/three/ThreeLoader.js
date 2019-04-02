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
 * Custom THREEJS Loader
 *
 * Load textures and geometries
 */

const defaults = { useTexture:true, useGeometry:true };

class ThreeLoader {

    constructor({ useTexture = defaults.useTexture, useGeometry = defaults.useGeometry } = defaults) {
        // Props
        this.useTexture = useTexture;
        this.useGeometry = useGeometry;

        this.onLoad = function() { console.warn("'onLoad' : function undefined"); }
        this.loaded = false;

        if (this.useTexture) {
            this.textureLoader = new THREE.TextureLoader();
            this.texturesToLoad = {};
            this.textures = {};
            this.texturesLoaded = 0;
            this.texturesExpected = 0;
        } else {
            this.addTexture = 
            this.loadTexture = 
            this.getTexture = function() { console.warn("'useTexture' : option is disabled"); }
        }

        if (this.useGeometry) {
            this.geometryLoader = new THREE.BufferGeometryLoader();
            this.geometriesToLoad = {};
            this.geometries = {};
            this.geometriesLoaded = 0;
            this.geometriesExpected = 0;
        } else {
            this.addGeometry =
            this.loadGeometry = 
            this.getGeometry = function() { console.warn("'useGeometry' : option is disabled"); }
        }
    }

    addTexture(id, path) {
        this.texturesExpected++;
        this.texturesToLoad[id] = path;
    }

    addGeometry(id, path) {
        this.geometriesExpected++;
        this.geometriesToLoad[id] = path;
    }

    load(onLoad) {
        this.onLoad = onLoad;

        if (this.useTexture && this.texturesExpected > 0) {
            const keys = Object.keys(this.texturesToLoad);
            for (let i=0, l=keys.length; i<l; i++) {
                this.loadTexture(keys[i], this.texturesToLoad[keys[i]]);
            }
        }

        if (this.useGeometry && this.geometriesExpected > 0) {
            const keys = Object.keys(this.geometriesToLoad);
            for (let i=0, l=keys.length; i<l; i++) {
                this.loadGeometry(keys[i], this.geometriesToLoad[keys[i]]);
            }
        }
    }

    loadTexture (id, path) {
        this.textureLoader.load(path, (texture) => {
            this.textures[id] = texture;
            this.texturesLoaded++;

            if (this.isLoaded()) {
                const ressources = {};
                if (this.useTexture) ressources.textures = this.textures;
                if (this.useGeometry) ressources.geometries = this.geometries;
                this.onLoad(ressources);
            }
        });
    }

    loadGeometry(id, path) {
        this.geometryLoader.load(path, (geometry) => {
            this.geometries[id] = geometry;
            this.geometriesLoaded++;

            if (this.isLoaded()) {
                const ressources = {};
                if (this.useTexture) ressources.textures = this.textures;
                if (this.useGeometry) ressources.geometries = this.geometries;
                this.onLoad(ressources);
            }
        }, (xhr) => {
            // console.log(`Loader3D :: load geometry ${id} : ${xhr.loaded / xhr.total * 100}% loaded`);
        });
    }

    get(id, type) {
        return this[type][id];
    }

    getGeometries() {
        return this.geometries;
    }

    getGeometry(id) {
        return this.get(id, 'geometries');
    }

    getTextures() {
        return this.textures;
    }

    getTexture(id) {
        return this.get(id, 'textures');
    }

    isLoaded () {
        const geometriesAllLoaded = this.useGeometry ? this.geometriesLoaded === this.geometriesExpected : true;
        const texturesAllLoaded = this.useTexture ? this.texturesLoaded === this.texturesExpected : true;
            
        if (!this.loaded && geometriesAllLoaded && texturesAllLoaded) {
            if (this.useGeometry) console.warn(`Loader3D :: geometries ${this.geometriesLoaded} / ${this.geometriesExpected}`, geometriesAllLoaded)
            if (this.useTexture) console.warn(`Loader3D :: textures ${this.texturesLoaded} / ${this.texturesExpected}`, texturesAllLoaded);
            
            this.loaded = true;

            return true;
        }

        return false;
    }

}

export default ThreeLoader;