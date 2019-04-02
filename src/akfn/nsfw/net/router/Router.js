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

import createHistory from 'history/createBrowserHistory';
import Transition from './Transition';
import TransitionManager from './TransitionManager';
import DomManager from './DomManager';
import ViewManager from './ViewManager';
import PatternManager from './PatternManager';
import Cache from './Cache';

import NSFWEvents from 'akfn/nsfw/events/NSFWEvents';
import EventsManager from 'akfn/nsfw/events/EventsManager';
import { merge } from 'akfn/nsfw/utils/utils';

import AssetsLoader from 'akfn/nsfw/loaders/AssetsLoader';

/**
 * Router
 *
 * v1.1
 */

class Router {

    /**
     * 
     * Core methods
     * 
     */

    constructor ({ wrapperClass, containerClass, ignoreClass, defaultTransition, defaultView, enableCache, lang, verbose }) {

        // properties
        this.transitionManager = new TransitionManager(defaultTransition);
        this.domManager = new DomManager(wrapperClass, containerClass, ignoreClass);
        this.viewManager = new ViewManager( verbose, defaultView );
        this.patternManager = new PatternManager();
        this.cache = new Cache();

        // options
        this.cacheEnabled = enableCache;

        // params
        this.lang = lang;
        this.verbose = verbose;
        this.isTransitioning = false;
        this.router = createHistory();
        this.nextLocation = '';

        // listeners
        this.bindListeners();
    }

    /**
     * Listeners
     */
    bindListeners () {

        EventsManager.on(NSFWEvents.Router.VIEW_ADD, this.domManager.appendContainer);
        EventsManager.on(NSFWEvents.Router.VIEW_REMOVE, this.domManager.removeContainer);

        this.router.listen( ( location, action ) => {
            Router.apply(location);
        });

        document.addEventListener('click', ::this.onDocumentClick);
    }

    /**
     * Click
     */
    onDocumentClick ( event ) {
        let { target } = event;

        while ( target && !this.retrieveHref(target) ) {
            target = target.parentNode;
        }

        if ( target && this.preventClick(event, target) ) {
            event.preventDefault();
            event.stopPropagation();

            const href = this.retrieveHref(target);

            Router.push(href);
        }
    }

    /**
     * [retrieveHref description]
     */
    retrieveHref ( element ) {
        if ( element ) {
            const xlink = element.getAttribute && element.getAttribute('xlink:href');

            if ( typeof xlink === 'string' ) {
                return xlink;
            }

            const { href } = element;

            if ( href ) {
                return href;
            }
        }
        
        return false;
    }

    /**
     * [preventClick description]
     */
    preventClick ( event, element ) {
        const href = this.retrieveHref(element);
        const withKey = event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        const blankTarget = element.target && element.target === '_blank';
        const differentDomain = window.location.protocol !== element.protocol || window.location.hostname !== element.hostname;
        const isDownload = element.getAttribute('download') === 'string';
        const shouldIgnore = element.classList.contains(this.domManager.ignoreClass);
        const isMailto = href && href.includes('mailto:');

        const shouldPrevent = !withKey && !blankTarget && !differentDomain && !isDownload && !shouldIgnore && !isMailto;

        return shouldPrevent;
    }

    /**
     * 
     * Static methods
     * 
     */

    static create ( opts = {} ) {
        const defaults = {
            wrapperClass: '.wrapper',
            containerClass: '.view',
            ignoreClass: 'no-router',
            defaultTransition: Transition,
            enableCache: true,
            verbose: true,
            lang: document.querySelector('html').getAttribute('lang'),
            defaultView: null
        };
        const options = merge(defaults, opts);

        if ( !Router.instance ) Router.instance = new Router(options);
    }

    /**
     * 
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    static start ( url ) {

        if(url) {

            const { pathname } = window.location;
            const { viewManager, transitionManager, patternManager } = Router.instance;
            
            const currentView = viewManager.getViewByUrl(pathname, Router.getLang());
            viewManager.setCurrentView(currentView);

            Router.push( url );

        } else {

            Router.apply(location);
        }

    }

    /**
     * [push description]
     * @param  {String} url [description]
     */
    static push ( url ) {
        const { router, isTransitioning } = Router.instance;

        if ( isTransitioning ) return;

        const strippedUrl = url.replace(window.location.origin, '');
        const currentUrl = window.location.pathname;

        if ( strippedUrl !== currentUrl ) {
             router.push(strippedUrl);
        }

    }

    /**
     * Apply 
     * @param  {String} location | destination URL
     */
    static apply ( location ) {
        const { viewManager, transitionManager, patternManager, verbose, defaultRoute } = Router.instance;
        const pathname = location.pathname.replace(/\/$/, "");

        // save next location
        Router.setNextLocation( pathname );

        const currentView = viewManager.getCurrentView();
        const { match, callback, params } = patternManager.match(pathname);

        const nextViewExists = viewManager.viewExists(pathname);

        if( match && !nextViewExists ) {

            if(verbose) console.log(`Router :: pattern matches.`);
            
            callback(params);
        }


        const nextView = viewManager.getViewByUrl(pathname, Router.getLang());

        // nextview ?
        if ( nextView ) {
            const transition = transitionManager.getTransition(currentView, nextView);

            Router.instance.isTransitioning = true;

            transition.play()
                .then( () => {
                    Router.instance.isTransitioning = false;
                    viewManager.setCurrentView(nextView);
                })
                .catch( ( error ) => {
                    throw error;
                });

       } else {

            throw new Error("Router :: No view found");
        }    
    }

    static addTransition ( transition ) {
        Router.instance.transitionManager.addTransition(transition);
    }

    static match ( pattern, callback ) {
        Router.instance.patternManager.addPattern(pattern, callback);
    }

    

    static load () {
        const { cache, cacheEnabled, lang } = Router.instance;
        const url = Router.getNextLocation(); 
        const cachedResponse = cacheEnabled ? cache.get(url) : false;

        if ( cacheEnabled && cachedResponse ) {
            return Promise.resolve( Router.handleHTML(cachedResponse) );
        } else {
            return Router.fetch(url)
                .then( html => {
                    // console.log("Router fetch");
                    // console.log(html);

                    if ( cacheEnabled ) {
                        cache.set(url, html);
                    }

                    return Router.handleHTML(html);
                })
                .catch( error => {
                    throw new Error(error);
                });
        }
    }

    static fetch ( url ) {

        return AssetsLoader.loadFile( url, { headers:{'X-Requested-With':'XMLHttpRequest'} } );
    }

    static handleHTML ( html ) {
        const { domManager } = Router.instance;

        domManager.handleHTML(html);

        return domManager.$nextContainer;
    }


    static getContainer () {
        const { domManager } = Router.instance;

        return domManager.getContainer();
    }

    /**
     * Get url(s) by view ID
     * @param  {String} id view ID
     */
    static getURLByID ( id ) {

        const { viewManager, verbose, lang } = Router.instance;

        if(verbose) console.log('Router :: getURLByID ::', id);

        const view = viewManager.getView(id);
        const urls = view.urls[lang];

        return urls.length > 1 ? urls : urls[0];
        
    }

    /**
     * Get View By ID
     * @param {String} id 
     */
    static getViewByID( id ) {

        const { viewManager } = Router.instance;

        return viewManager.getView( id );
    }

    /**
     * Next Location
     */
    static getNextLocation () {

        return Router.instance.nextLocation;
    }

    static setNextLocation ( nextLocation ) {

        Router.instance.nextLocation = window.location.origin + nextLocation;
    }
    
    /**
     * Get current Lang
     * @return {String} current lang used by user
     */
    static getLang () {
        return Router.instance.lang;
    }

    /**
     * Views 
     */

    static addView ( view ) {
        Router.instance.viewManager.addView(view);
    }

    static getView ( location = window.location ) {

        const pathname = location.pathname.replace(/\/$/, "");
        const { viewManager } = Router.instance;
        
        return viewManager.getViewByUrl(pathname, Router.getLang());
    }

}

export default Router;