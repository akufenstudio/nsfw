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
 * GoogleAnalyticsTracking
 * v1.0
 * 
 * Add class '.ga-event' to the link you want to track
 * Add data attribute "data-category", "data-action", "data-label", "data-value"
 * @param  UA    {String} - Google Analytics UA
 * @param  Debug {Bool} - Run Analytics in debug mode
 * @param  PageviewOnInit {Bool} - Send page view on init
*/
class GoogleAnalyticsTracking {
	constructor(UA, debug = false, pageviewOnInit = false) {
		// Binding
		this.initAnalytics = ::this.initAnalytics;
		this.setTracking = ::this.setTracking;

		// Vars
		this.debug = debug ? '_debug' : '';
		
		// Init GA
		window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
		ga('create', UA, 'auto');
		
		// Lazyload Script
		if(!window.isGATrackingLoaded){
			const script = document.createElement('script');
			script.type = 'text/javascript';

			script.onload = ()=>{

	        	window.isGATrackingLoaded = true;
	        	this.initAnalytics();

	        	if(pageviewOnInit){
	        		this.sendPageview();
	        	}
	        }

	        script.src = `https://www.google-analytics.com/analytics${this.debug}.js`;
	        document.body.appendChild(script);
	       
        } else {
        	this.initAnalytics();
        }
	}

	initAnalytics(){
        this.trackingElements = document.querySelectorAll('.ga-event');
        
        for (let i = 0; i < this.trackingElements.length; i++) {
    		this.trackingElements[i].addEventListener('click',this.setTracking);
        }
	}

	sendPageview(){
		ga('send', 'pageview');
	}

	sendTracking(event, category = "", action = "", label = "", value = ""){
        ga('send', event, category, action, label, value);
    }

	setTracking(e){
        const category = e.currentTarget.getAttribute('data-category');
        const action = e.currentTarget.getAttribute('data-action');
        const label = e.currentTarget.getAttribute('data-label');
        const value = e.currentTarget.getAttribute('data-value');
        this.sendTracking('event', category, action, label, value);
    }

	destroy(){
		for (var i = 0; i < this.trackingElements.length; i++) {
			this.trackingElements[i].removeEventListener('click',this.setTracking);
		}
	}
}

export default GoogleAnalyticsTracking;