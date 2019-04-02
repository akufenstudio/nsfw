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
 * Cover Sprite
 *
 * v1.0
 */

class CoverSprite extends PIXI.Sprite {

    constructor ( texture, frameWidth, frameHeight, hAlign = 0.5, vAlign = 0.5 ) {
        super(texture);

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.hAlign = hAlign;
        this.vAlign = vAlign;

        this.resize = ::this.resize;

        this.width = this.frameWidth;
        this.height = this.frameHeight;
    }

    resize ( frameWidth, frameHeight ) {
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        const textureWidth = this.texture.baseTexture.width;
        const textureHeight = this.texture.baseTexture.height;

        const widthFrame = Math.min(textureWidth, textureHeight * this.frameWidth / this.frameHeight);
        const heightFrame = Math.min(textureHeight, widthFrame * this.frameHeight / this.frameWidth);

        const x = Math.max(0, Math.min(textureWidth, textureWidth * 0.5 - widthFrame * 0.5 - 1));
        const y = Math.max(0, Math.min(textureHeight, textureHeight * 0.5 - heightFrame * 0.5 - 1));

        this.texture.frame = new PIXI.Rectangle(x, y, widthFrame, heightFrame);

        this.width = Math.round(this.frameWidth);
        this.height = Math.round(this.frameHeight);
    }

}

export default CoverSprite;