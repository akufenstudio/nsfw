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
 * TwitterShare
 * v1.0
 * 
 * @param  element       {Element} - Share button - REQUIRED
 * @param  text          {String} - Shared along with the link
 * @param  hashtags      {String} - Comma-seperated list of hashtags (without #)
 * @param  via           {String} - A Twitter username to associate to the Tweet
 */

class TwitterShare {
	constructor(element, text, hashtags, via) {
		
		// Bindings
		this.share = ::this.share;

		// Elements
		this.element = element;

		// Params
		this.params = "?url=" + window.location.origin + window.location.pathname.replace(/\/$/, "") + encodeURIComponent(window.location.hash);
		if(text) this.params += `&text=${text}`;
		if(hashtags) this.params += `&hashtags=${hashtags}`;
		if(via) this.params += `&via=${via}`;

		// Events
		this.element.addEventListener('click', this.share);
	}

	/*
	 * SHARE
	 */
	share(event) {
		event.preventDefault();

		const shareurl = 'https://twitter.com/intent/tweet';

        const top = Math.round(window.h / 2 - 210);
        const left = Math.round(window.w / 2 - 275);

        window.open(
            shareurl + this.params,
            '_blank',
            'width=550,height=420,toolbar=no,scrollbars=no,resizable=no,top=' + top + ',left=' + left
        );
	}

	
	/*
	 * DISPOSE
	 */
	dispose() {
		this.element.removeEventListener('click', this.share);

		this.element = null;
		this.params = null;
	}
}

export default TwitterShare;