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

import { merge } from 'akfn/nsfw/utils/utils';

/**
 * GPU Test
 * WebGL 1
 * 
 * http://webglreport.com/
 *
 * v1.01
 */

class GPUTest {

	constructor( opts ) {

		const defaultOptions = {
			verbose:true
		};

		const options = merge(defaultOptions, opts);

		const webglVersion = 1;

		// testing canvas
		this.canvas = document.createElement('canvas');
		this.canvas.width = 1;
		this.canvas.height = 1;
		document.body.appendChild(this.canvas);	

		let gl = this.canvas.getContext('webgl', { stencil: true });
		if(!gl) gl = this.canvas.getContext('experimental-webgl', { stencil: true });

		const contextName = !!gl;
		
		this.gl = gl;

		this.report = {
		    contextName: contextName,
		    glVersion: gl.getParameter(gl.VERSION),
		    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
		    vendor: gl.getParameter(gl.VENDOR),
		    renderer: gl.getParameter(gl.RENDERER),
		    unMaskedVendor: this.getUnmaskedInfo(gl).vendor,
		    unMaskedRenderer: this.getUnmaskedInfo(gl).renderer,
		    antialias:  gl.getContextAttributes().antialias ? 'Available' : 'Not available',
		    angle: this.getAngle(gl),
		    majorPerformanceCaveat: this.getMajorPerformanceCaveat(contextName),
		    maxColorBuffers: this.getMaxColorBuffers(gl),
		    redBits: gl.getParameter(gl.RED_BITS),
		    greenBits: gl.getParameter(gl.GREEN_BITS),
		    blueBits: gl.getParameter(gl.BLUE_BITS),
		    alphaBits: gl.getParameter(gl.ALPHA_BITS),
		    depthBits: gl.getParameter(gl.DEPTH_BITS),
		    stencilBits: gl.getParameter(gl.STENCIL_BITS),
		    maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
		    maxCombinedTextureImageUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
		    maxCubeMapTextureSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
		    maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
		    maxTextureImageUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
		    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
		    maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
		    maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
		    maxVertexTextureImageUnits: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
		    maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
		    aliasedLineWidthRange: gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE),
		    aliasedPointSizeRange: gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE),
		    maxViewportDimensions: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
		    maxAnisotropy: this.getMaxAnisotropy(),
		    vertexShaderBestPrecision: this.getBestFloatPrecision(gl.VERTEX_SHADER),
		    fragmentShaderBestPrecision: this.getBestFloatPrecision(gl.FRAGMENT_SHADER),
		    fragmentShaderFloatIntPrecision: this.getFloatIntPrecision(gl),

		    extensions: gl.getSupportedExtensions(),
		    draftExtensionsInstructions: this.getDraftExtensionsInstructions(),
		};

		this.report.platform 	= navigator.platform;
		this.report.userAgent 	= navigator.userAgent;
		this.report.webglVersion = webglVersion;

		// clean up
		this.canvas.parentNode.removeChild(this.canvas);
		this.canvas = null;

		// Global status
		let status = true;

		// specific tests (samples)
		const points = this.report.aliasedPointSizeRange[1] > 300;

		if(!points) status = false;

		NSFW.goodGPU = status;

		// Logs
		if(options.verbose) this.logReport();

	}

	/**
	 * Log Report
	 */
	logReport() {

		console.log('%cWebGL report','background-color:#888; padding:0px 10px; color:#fff;');
		console.log(this.report);
		console.log(`%cGPU status: ${NSFW.goodGPU ? 'good' : 'not good'}`,'color:#888;');

	}

	/**
	 *
	 * All
	 * GPU Tests
	 * 
	 */

	describeRange(value) {
	    return '[' + value[0] + ', ' + value[1] + ']';
	}

	getMaxAnisotropy() {
	    const e = this.gl.getExtension('EXT_texture_filter_anisotropic')
	            || this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
	            || this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic');

	    if (e) {
	        let max = this.gl.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
	        // See Canary bug: https://code.google.com/p/chromium/issues/detail?id=117450
	        if (max === 0) {
	            max = 2;
	        }
	        return max;
	    }
	    return 'n/a';
	}

	formatPower(exponent, verbose) {
	    if (verbose) {
	        return '' + Math.pow(2, exponent);
	    } else {
	        return '2<sup>' + exponent + '</sup>';
	    }
	}

	getPrecisionDescription(precision, verbose) {
	    const verbosePart = verbose ? ' bit mantissa' : '';
	    return '[-' + this.formatPower(precision.rangeMin, verbose) + ', ' + this.formatPower(precision.rangeMax, verbose) + '] (' + precision.precision + verbosePart + ')'
	}

	getBestFloatPrecision(shaderType) {
	    const high = this.gl.getShaderPrecisionFormat(shaderType, this.gl.HIGH_FLOAT);
	    const medium = this.gl.getShaderPrecisionFormat(shaderType, this.gl.MEDIUM_FLOAT);
	    const low = this.gl.getShaderPrecisionFormat(shaderType, this.gl.LOW_FLOAT);

	    let best = high;
	    if (high.precision === 0) {
	        best = medium;
	    }

	    return 'High: ' + this.getPrecisionDescription(high, true) + ' | Medium: ' + this.getPrecisionDescription(medium, true) + ' | Low: ' + this.getPrecisionDescription(low, true) + '">' +
	        this.getPrecisionDescription(best, false);
	}

	getFloatIntPrecision(gl) {
	    let high = this.gl.getShaderPrecisionFormat(this.gl.FRAGMENT_SHADER, this.gl.HIGH_FLOAT);
	    let s = (high.precision !== 0) ? 'highp/' : 'mediump/';

	    high = this.gl.getShaderPrecisionFormat(this.gl.FRAGMENT_SHADER, this.gl.HIGH_INT);
	    s += (high.rangeMax !== 0) ? 'highp' : 'lowp';

	    return s;
	}

	isPowerOfTwo(n) {
	    return (n !== 0) && ((n & (n - 1)) === 0);
	}

	getAngle(gl) {
	    const lineWidthRange = this.describeRange(this.gl.getParameter(this.gl.ALIASED_LINE_WIDTH_RANGE));

	    // Heuristic: ANGLE is only on Windows, not in IE, and not in Edge, and does not implement line width greater than one.
	    const angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
	        (this.gl.getParameter(this.gl.RENDERER) !== 'Internet Explorer') &&
	        (this.gl.getParameter(this.gl.RENDERER) !== 'Microsoft Edge') &&
	        (lineWidthRange === this.describeRange([1,1]));

	    if (angle) {
	        // Heuristic: D3D11 backend does not appear to reserve uniforms like the D3D9 backend, e.g.,
	        // D3D11 may have 1024 uniforms per stage, but D3D9 has 254 and 221.
	        //
	        // We could also test for WEBGL_draw_buffers, but many systems do not have it yet
	        // due to driver bugs, etc.
	        if (this.isPowerOfTwo(this.gl.getParameter(this.gl.MAX_VERTEX_UNIFORM_VECTORS)) && this.isPowerOfTwo(this.gl.getParameter(this.gl.MAX_FRAGMENT_UNIFORM_VECTORS))) {
	            return 'Yes, D3D11';
	        } else {
	            return 'Yes, D3D9';
	        }
	    }

	    return 'No';
	}

	getMajorPerformanceCaveat(contextName) {
	    // Does context creation fail to do a major performance caveat?

	    if(!this.canvas.parentNode) document.body.append(this.canavas);
	    const gl = this.canvas.getContext(contextName, { failIfMajorPerformanceCaveat : true });
	    
	    if (!gl) {
	        // Our original context creation passed.  This did not.
	        return 'Yes';
		}

	    if (typeof this.gl.getContextAttributes().failIfMajorPerformanceCaveat === 'undefined') {
	        // If getContextAttributes() doesn't include the failIfMajorPerformanceCaveat
	        // property, assume the browser doesn't implement it yet.
	        return 'Not implemented';
	    }

		return 'No';
	}

	getDraftExtensionsInstructions() {
	    if (navigator.userAgent.indexOf('Chrome') !== -1) {
	        return 'To see draft extensions in Chrome, browse to about:flags, enable the "Enable WebGL Draft Extensions" option, and relaunch.';
	    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
	        return 'To see draft extensions in Firefox, browse to about:config and set web.gl.enable-draft-extensions to true.';
	    }

	    return '';
	}

	getMaxColorBuffers(gl) {
	    let maxColorBuffers = 1;
	    const ext = this.gl.getExtension("WEBGL_draw_buffers");
	    if (ext != null) 
	        maxColorBuffers = this.gl.getParameter(ext.MAX_DRAW_BUFFERS_WEBGL);
	    
	    return maxColorBuffers;
	}

	getUnmaskedInfo(gl) {
	    const unMaskedInfo = {
	        renderer: '',
	        vendor: ''
	    };
	    
	    const dbgRenderInfo = this.gl.getExtension("WEBGL_debug_renderer_info");
	    if (dbgRenderInfo != null) {
	        unMaskedInfo.renderer = this.gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
	        unMaskedInfo.vendor   = this.gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
	    }
	    
	    return unMaskedInfo;
	}

	showNull(v) {
	    return (v === null) ? 'n/a' : v;
	}

}

export default GPUTest;

