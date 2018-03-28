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

import GoogleMapsPinsIcons from './GoogleMapsPinsIcons';
import { merge } from 'akfn/nsfw/utils/utils';
	
const defaultOptions = {
	el: '',
    apiKey: '',
    pins: '',
    centerMapPins: false,
    pinsHasInfobox: false,
    infoboxPath : 'js/infobox.js',
    markerCluster: false,
    markerClusterPath : 'js/markerCluster.js',
    markerClusterOptions:{
    	imagePath: '/img/'
    },
	mapOptions : {
		scrollwheel: false,
		draggable: true,
		zoom: 2,
		center: {lat: 45.5579564, lng: -73.8703842}
	},
	globalInfoboxOptions: {
		alignBottom: true,
		disableAutoPan: false,
		pixelOffset: 0,
		maxWidth: 0,
		isHidden: false,
		pane: "floatPane",
		enableEventPropagation: false,
		arrowPosition: 50
	}
}	

/**
 *
 * N * S * F * W
 * 
 * Google Maps
 *
 * v 1.0
 * 
 */

// Add path to options js
class GoogleMaps {
	
	constructor(opts) {
		// Bindings
		this.initMap = ::this.initMap;

		// Merge options
		this.mergedOptions = merge(defaultOptions, opts);

		// Vars
		this.pins = this.mergedOptions.pins;

		// Element verification
		if(opts.el){
			this.el = this.mergedOptions.el;		
		}else{
			console.warn('GoogleMaps :: No element provided.');
			return
		}

		// Api key verification
		if(opts.apiKey){
			this.apiKey = this.mergedOptions.apiKey;	
		}else{
			console.warn('GoogleMaps :: No API key provided.');
			return
		}

		// Callback verification
		if ( this.mergedOptions.callback && typeof this.mergedOptions.callback === 'function' ){
			this.callback = this.mergedOptions.callback;
		}

		// Lazy load google maps lib
		this.loadGoogleMaps();
	}

	loadScript(src,callback){
		const script = document.createElement('script');
		script.type = 'text/javascript';
		document.body.appendChild(script);
		script.onload = callback;
		script.src = src;
	}

	loadMarkerClusterAndInfoboxScript(){
		this.markerArray = [];
		this.loadScript(this.mergedOptions.markerClusterPath,()=>{
			this.loadScript(this.mergedOptions.infoboxPath,()=>{
				this.initMap();
			})
		})
	}

	loadMarkerClusterScript(){
		this.markerArray = [];
		this.loadScript(this.mergedOptions.markerClusterPath,()=>{
			this.initMap();
		})
	}

	loadInfoboxScript(){
		this.loadScript(this.mergedOptions.infoboxPath,()=>{
			this.initMap();
		})
	}

	loadGoogleMaps(){
		this.loadScript(`https://maps.google.com/maps/api/js?key=${this.apiKey}`, ()=>{
			if(this.mergedOptions.pinsHasInfobox && this.mergedOptions.markerCluster){
				this.loadMarkerClusterAndInfoboxScript();
			}else if(this.mergedOptions.pinsHasInfobox){
				this.loadInfoboxScript();
			}else if(this.mergedOptions.markerCluster){
				this.loadMarkerClusterScript();
			}else{
				this.initMap();
			}
		})
	}

	initMap(){
		// Init map
		this.map = new google.maps.Map(this.el,this.mergedOptions.mapOptions);
		for (let i = 0; i < this.pins.length; i++) {
			const marker = new GoogleMapsPinsIcons(this.map,this.pins[i],this.mergedOptions);
			if(this.mergedOptions.markerCluster){
				this.markerArray.push(marker);
			}
		}

		// Center map around pins
		if(this.mergedOptions.centerMapPins){
			this.centerMapsAroundPins();
		}

		// Init marker cluster
		if(this.mergedOptions.markerCluster){
			this.initMarkerCluster();
		}		

		// Map init callback
		if(this.callback){
			this.callback();
		}
	}

	initMarkerCluster(){
		var markerCluster = new MarkerClusterer(this.map, this.markerArray, this.mergedOptions.markerClusterOptions);	
	}

	centerMapsAroundPins(){
		if(this.pins.length < 1){
			console.warn('GoogleMaps :: You need pins to center maps along pins.');
			return
		}

		const bounds = new google.maps.LatLngBounds();
		for (let i = 0, LtLgLen = this.pins.length; i < LtLgLen; i++) {
			bounds.extend (this.pins[i]);
		}
		this.map.fitBounds(bounds);		
	}

	destroy(){
		this.map = null;
	}
}

export default GoogleMaps;