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

import Vector2 from '../math/Vector2';

/**
 * 
 * Mouse Manager
 *
 * v1.01
 */

class MouseManager {

	static start(checkMouseDirection = false, checkMouseSpeed = false) {
		MouseManager.checkMouseDirection = checkMouseDirection;

		// speed
		NSFW.mouseSpeed = new Vector2();
		NSFW.mouseLast = new Vector2();

		// direction
		NSFW.mouseDirection = new Vector2();

		// position
		NSFW.mouse = new Vector2();

		if (checkMouseSpeed) window.setInterval( MouseManager.getSpeed, 30 );

		window.addEventListener('mousemove', MouseManager.move );
	}

	static move(e) {
		if (MouseManager.checkMouseDirection) MouseManager.getDirection(e);

		NSFW.mouse.set(e.clientX, e.clientY);
	}

	static getDirection(e) {
		// get mouse direction x
		if (NSFW.mouse.x < e.pageX) {
			NSFW.mouseDirection.x = 1;
		} else if (NSFW.mouse.x > e.pageX) {
			NSFW.mouseDirection.x = -1;
		} else {
			NSFW.mouseDirection.x = 0;
		}

		// get mouse direction y
		if (NSFW.mouse.y < e.pageY) {
			NSFW.mouseDirection.y = 1;
		} else if (NSFW.mouse.y > e.pageY) {
			NSFW.mouseDirection.y = -1;
		} else {
			NSFW.mouseDirection.y = 0;
		}
	}

	static getSpeed() {
		NSFW.mouseSpeed.x = NSFW.mouse.x - NSFW.mouseLast.x;
		NSFW.mouseSpeed.y = NSFW.mouse.y - NSFW.mouseLast.y;

		NSFW.mouseLast.copy(NSFW.mouse);
	}
	
}

export default MouseManager;