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

/**
 * DEVICEINFO
 *
 * v1.0
 */

class DeviceInfo {


	static check() {

		const MobileDetect = require('mobile-detect');
    	const md = new MobileDetect(window.navigator.userAgent);

		// Device detection
		window.isMobile = md.phone() !== null;
		window.isTablet = md.tablet() !== null;
		window.isDesktop = !window.isTablet && !window.isMobile;

		document.body.classList.add( window.isMobile ? 'mobile' : window.isTablet ? 'tablet' : 'desktop' );

		// Fastlick
		if(!window.isDesktop){
			const attachFastClick = require('fastclick');
			attachFastClick.attach(document.body);
		}

		// Browsers
		const nua = window.navigator.userAgent.toLowerCase();

		window.isIE       = DeviceInfo.getInternetExplorerVersion() !== -1;
      	window.isOpera    = ( nua.indexOf("opr/") > -1 );
      	window.isChrome   = !window.isOpera && ( nua.indexOf("chrome") > -1 );
      	window.isSafari   = !window.isOpera && !window.isChrome && ( nua.indexOf("safari") > -1 );
      	window.isFirefox  = ( nua.indexOf("firefox") > -1 );
      	window.isEdge  	  = nua.indexOf("edge") > -1;

      	// webGL
      	window.isWebGL = DeviceInfo.webGLAvailability();

      	// Retards
      	if (window.isIE)
      		document.body.classList.add('ie');
      	else if (window.isSafari)
      		document.body.classList.add('safari');

	}

    static getInternetExplorerVersion () {

		let rv = -1;
		let re = null;
		let ua = window.navigator.userAgent;

		if (window.navigator.appName === 'Microsoft Internet Explorer') {

			re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) !== null) rv = parseFloat( RegExp.$1 );

		} else if (window.navigator.appName === 'Netscape') {

			re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) !== null) rv = parseFloat( RegExp.$1 );
		}

		return rv;
	}

	static webGLAvailability() {

		try { const canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); } catch ( e ) { return false; };
	}
}

export default DeviceInfo;