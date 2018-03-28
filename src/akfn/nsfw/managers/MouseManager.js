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

import Vector2 from '../math/Vector2';

/**
 * N * S * F * W
 * 
 * Mouse Manager
 *
 * v1.0
 */

class MouseManager {

	static start(checkMouseDirection = false, checkMouseSpeed = false) {
		MouseManager.checkMouseDirection = checkMouseDirection;

		// speed
		window.mouseSpeed = new Vector2();
		window.mouseLast = new Vector2();

		// direction
		window.mouseDirection = new Vector2();

		// position
		window.mouse = new Vector2();

		if (checkMouseSpeed) window.setInterval( MouseManager.getSpeed, 30 );

		window.addEventListener('mousemove', MouseManager.move );
	}

	static move(e) {
		if (MouseManager.checkMouseDirection) MouseManager.getDirection(e);

		window.mouse.set(e.clientX, e.clientY);
	}

	static getDirection(e) {
		// get mouse direction x
		if (window.mouse.x < e.pageX) {
			window.mouseDirection.x = 1;
		} else if (window.mouse.x > e.pageX) {
			window.mouseDirection.x = -1;
		} else {
			window.mouseDirection.x = 0;
		}

		// get mouse direction y
		if (window.mouse.y < e.pageY) {
			window.mouseDirection.y = 1;
		} else if (window.mouse.y > e.pageY) {
			window.mouseDirection.y = -1;
		} else {
			window.mouseDirection.y = 0;
		}
	}

	static getSpeed() {
		window.mouseSpeed.x = window.mouse.x - window.mouseLast.x;
		window.mouseSpeed.y = window.mouse.y - window.mouseLast.y;

		window.mouseLast.copy(window.mouse);
	}
	
}

export default MouseManager;