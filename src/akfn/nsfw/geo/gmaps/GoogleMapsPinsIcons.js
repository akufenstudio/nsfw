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

import NSFWEvents from 'akfn/nsfw/events/NSFWEvents';
import EventsManager from 'akfn/nsfw/events/EventsManager';

import { merge } from 'akfn/nsfw/utils/utils';

/**
 * 
 * Google Maps Pins
 *
 * v 1.0
 * 
 */

class GoogleMapsPinsIcons {
	
	constructor(map,pin,options) {
		// Binding 
		this.openInfobox = ::this.openInfobox;
		this.closeInfobox = ::this.closeInfobox;

		// Vars
		this.options = options;
		this.map = map;
		this.location = { lat:pin.lat, lng:pin.lng };
		
		// Init marker
		this.marker = new google.maps.Marker({
			position:this.location,
			map: this.map,
			clickable:this.options.pinsHasInfobox,
			icon: {
		 		url: pin.iconUrl
		 	}
		});

		// Create infobox
		if(this.options.pinsHasInfobox === true){
			this.createInfoBox(pin);
		}

		return this.marker
	}

	createInfoBox(pin){
		// Add content to options
		this.options.globalInfoboxOptions.content = pin.infoboxDom;
		
		// Init infobox
		this.ib = new InfoBox(this.options.globalInfoboxOptions);	

		// Add listener to close infobox
		EventsManager.on(NSFWEvents.GoogleMap.CLOSE_ALL_INFOBOX, this.closeInfobox);

		// Add listener to open infobox
		google.maps.event.addListener(this.marker, "click", this.openInfobox);
	}

	closeInfobox(){
		this.ib.close();
	}

	openInfobox(){
		// Close all infobox
		EventsManager.emit(NSFWEvents.GoogleMap.CLOSE_ALL_INFOBOX);
		
		// Open infobox
		this.ib.open(this.map, this.marker);
	}

	destroy(){
		google.maps.event.addListener(this.marker, "click", this.openInfobox);
	}
}

export default GoogleMapsPinsIcons;
