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

import GPUTest from 'akfn/nsfw/performances/GPUTest';
import CPUTest from 'akfn/nsfw/performances/CPUTest';

import { merge } from 'akfn/nsfw/utils/utils';

/**
 * Device Info
 *
 * v1.2
 */

class DeviceInfo {



	static check( opts ) {

		if(!DeviceInfo.instance) DeviceInfo.instance = new DeviceInfo( opts );

	}

	constructor( opts ) {

		// options
		const defaultOptions = {
			verbose: true,
			cpu:false,
			gpu:false,
			callback:null
		};

		this.options = merge(defaultOptions,opts);

		// Device detection
		const md = new MobileDetect(window.navigator.userAgent);
		
		NSFW.isMobile = md.phone() !== null;
		NSFW.isTablet = md.tablet() !== null;
		NSFW.isDesktop = !NSFW.isTablet && !NSFW.isMobile;

		this.device = NSFW.isMobile ? 'mobile' : NSFW.isTablet ? 'tablet' : 'desktop';
		document.body.classList.add( this.device );

		// Browsers
		const nua = window.navigator.userAgent.toLowerCase();

		NSFW.isIE       = this.getInternetExplorerVersion() !== -1;
		NSFW.isEdge  	  = nua.indexOf("edge") > -1;
		NSFW.isOpera    = ( nua.indexOf("opr/") > -1 );
		NSFW.isChrome   = !NSFW.isEdge && !NSFW.isOpera && ( nua.indexOf("chrome") > -1 || nua.indexOf("crios") > -1 );
		NSFW.isSafari   = !NSFW.isEdge && !NSFW.isOpera && !NSFW.isChrome && ( nua.indexOf("safari") > -1 );
		NSFW.isFirefox  = ( nua.indexOf("firefox") > -1 );
		
		this.browser = this.getBrowser();
		document.body.classList.add(this.browser);

		// webGL
		NSFW.isWebGL = this.webGLAvailability();

		// GPU
		if(NSFW.isWebGL && this.options.gpu) this.gpu = new GPUTest({verbose:false});	

		// CPU
		if(this.options.cpu) {
			this.cpu = new CPUTest({verbose:false, callback: ::this.report});	
			this.cpu.run();
		}

		// Report
		if(!this.options.cpu && this.options.verbose) this.report();

	}


	/**
	 * Report
	 */
	report() {

		if(!this.options.verbose) return;

		console.groupCollapsed('Device Info');

		console.log('Device: ', this.device);
		console.log('Browser: ', this.browser);
		console.log('WebGL: ', NSFW.isWebGL);

		if(this.gpu) this.gpu.logReport();
		if(this.cpu) this.cpu.logReport();

		console.groupEnd();

		if(this.options.callback) this.options.callback();
	}

	/**
	 * Get Internet Explorer Version
	 * @return {Number}
	 */
	getInternetExplorerVersion () {

		let rv = -1;
		let re = null;

		const ua = window.navigator.userAgent;
		const appName = window.navigator.appName;

		if (appName === 'Microsoft Internet Explorer') {

			re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) !== null) rv = parseFloat( RegExp.$1 );

		} else if (appName === 'Netscape') {

			re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) !== null) rv = parseFloat( RegExp.$1 );
		}

		return rv;
	}

	/**
	 * Get Browser
	 * @return {String}
	 */
	getBrowser() {

		const browsers = {'ie':NSFW.isIE, 'opera':NSFW.isOpera, 'chrome':NSFW.isChrome, 'safari':NSFW.isSafari, 'firefox':NSFW.isFirefox, 'edge':NSFW.isEdge};

		for( let browser in browsers ) {
			if(Boolean(browsers[browser])) return browser;
		}

		return 'unknown';
	}

	/**
	 * WebGL
	 * @return {Boolean}
	 */
	webGLAvailability() {

		try { const canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); } catch ( e ) { return false; };
	}
}


export default DeviceInfo;