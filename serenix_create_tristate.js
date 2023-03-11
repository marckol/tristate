/* 
 * The MIT License
 *
 * Copyright 2022 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

if (typeof SereniX === 'undefined') {
    SereniX = { ui  : {} };
} else if (typeof SereniX.ui === 'undefined') {
    if (typeof SereniX.Namespace === 'function' && typeof SereniX.Namespace.ns === 'function') {
        SereniX.Namespace.ns('SereniX.ui');
    } else {
        SereniX.ui = {};
    }
}


//requires serenix_keyboard_events.js

var createTristate;

var createTriState = (function() {
    var ui =  SereniX.ui;
    
    function isNextStateKey(ev) {
        var target = ev.target||ev.srcElement;
        var tristateEl = target.tristateEl||target;
        return acceptKeypressed(ev, tristateEl.nextStateKeys||[
            13, //enter
            32, //space
            39, //right arrow
            40, //down arrow
            'Enter',
            'Space'
        ]);
    }
    
    function isPrevStateKey(ev) {
        var target = ev.target||ev.srcElement;
        var tristateEl = target.tristateEl||target;
        return acceptKeypressed(ev, tristateEl.prevStateKeys||[
            37, //left arrow
            38, //up arrow,
            'Shift+Enter',
            'Shift+Space'
        ]);
    }
    
    function acceptKeypressed(ev, keys) {
        if (isArray(keys)) {
            for (var i = 0, n = keys.length; i < n; i++) {
                if (SereniX.KeyboardEvents.is(ev, keys[i])) {
                    return true;
                }
            }
        } else {
            for (var k in keys) {
                if (SereniX.KeyboardEvents.is(ev, keys[k])) {
                    return true;
                }
            }
        }
    }
    /**
     * 
     * @private
     * @param {HTMLElement} el
     * @param {Function} action
     */
    function bindAction(el, action) {
        addEvt('click', el, action);
        
        addEvt('keydown', el, function(ev) {            
            //get the tristate HTML element
            var el = this.tristateEl||this;
            ev = ev||window.event;
            if (isNextStateKey(ev)) {
                el.handleNextState.call(this, ev);
                //SereniX.KeyboardEvents.clear();
            } else if (isPrevStateKey(ev)) {
                el.handlePrevState.call(this, ev);
                //SereniX.KeyboardEvents.clear();
            }
        });
        addEvt('keyup', document, function(ev) {
            SereniX.KeyboardEvents.clear();
        });
    }
    
    function newEl(tag) {
        return document.createElement(tag);
    }
    
    function isUndef(v) {
        return v === undefined || v === null;
    }
    
    function createImg(icon, w, h) {
        var src, a = arguments, len = a.length, img;
        var wrapTag;
        if (typeof icon === 'string') {
            src = icon;
        } else {
            src = icon.src||icon.url||icon.path;
            wrapTag = icon.wrapTag||icon.wrappedTag||icon.tag;
            if (len === 1) {
                w = icon.width;
                h = icon.height;
            }
        }
        if (/<svg\s+/.test(src)) {
            img = newEl(wrapTag||'div');
            img.innerHTML = src;
        } else if (/^(?:&|<b>|<i>|<strike>|<u>)/.test(src)) {
            img = newEl(wrapTag||'span');
            img.innerHTML = src;
        } else {
            img = newEl('img');
            img.src = src;
        }
        var re = /[a-z][a-z]*$/;
        if (typeof w === 'number') {
            img.style.width = w + 'px';
        } else if (typeof w === 'string' && w) {
            img.style.width = w + (re.test(w) ? '' : 'px');
        }
        if (typeof h === 'number') {
            img.style.height = h + 'px';
        } else if (typeof h === 'string' && h) {
            img.style.height = h + (re.test(w) ? '' : 'px');
        }
        return img;
    }
    
    function coalesce(o, $) {
        var args = Array.prototype.slice.call(arguments), i = 1, n = args.length, defVal, v;
        if (isArray($)) {
            if (args.length > 2)
                defVal = args[2];
            for (i = 0, n = $.length; i < n; i++) {
                if (!(typeof (x = $[i]) === 'string' || x instanceof String))
                    throw new Error("Incorrect arguments");
                v = o[x];
                if (v != undefined) //v !== undefined && v !== null
                    return v;
            }
        } else if (args.length > 1) {
            for (; i < n; i++) {
                if (!(typeof (x = args[i]) === 'string' || x instanceof String))
                    return x;
                v = o[x];
                if (v != undefined) //v !== undefined && v !== null
                    return v;
            }
        } else
            throw new Error("Incorrect arguments");

        return defVal;
    }
    
    function getSVG(svg, $1, $2, $3) {
        var color, w, h, len = arguments.length;
        if (len === 2) {
            if (isPlainObj($1)) {
                color = $1.strokeColor||$1.color;
                w = $1.width;
                h = $1.height||w;
            } else if (typeof $1 === 'string') {
                if (/^\d/.test($1)) {
                    w = h = $1;
                } else {
                    color = $1;
                }
            } else if (typeof $1 === 'number') {
                w = h = $1 + 'px';
            }
        } else if (isPlainObj($2)) {
            color = $1;
            w = $2.width;
            h = $2.height||w;
        } else {
            color = $1;
            w = $2;
            h = $3||$2;
        }
        
        if (typeof w === 'number' || (typeof w === 'string' && /\d+(?:\.\d+)/.test(w))) {
            w = w + 'px';
        }
        
        if (typeof h === 'number' || (typeof h === 'string' && /\d+(?:\.\d+)/.test(h))) {
            h = h + 'px';
        }
        
        if (color) {
            setAttrib(svg, 'fill', color);
        }
        
        
        if (w) {
            svg = setAttrib(setAttrib(svg, 'width', h), 'height', h);
        }
        
        return svg;
    }
    
    function setAttrib(svg, name, v) {
        var re = new RegExp('([ \\t|\\n]*|"|\b)' + name + '[ \\t]*=[ \\t]*"[^"]"', 'g'), match;
        var a = ' ' + name + '="' + v + '"';
        if ((match=re.exec(svg))) {
            svg = svg.substring(0, re.lastIndex - match[0].length) 
                + (match[1] === '"' ? '"' : '') + a
               + svg.substring(re.lastIndex);
        } else {
            var i = svg.indexOf('>');
            svg = svg.substring(0, i) 
                + a
               + svg.substring(i);
        }
        return svg;
    }
    
    function unsetAttrib(svg, name) {
        var re = new RegExp('([ \\t|\\n]*|"|\b)' + name + '[ \\t]*=[ \\t]*"[^"]"', 'g'), match;
        if ((match=re.exec(svg))) {
            svg = svg.substring(0, re.lastIndex - match[0].length) 
               + (match[1] === '"' ? '" ' : '') + svg.substring(re.lastIndex);
        }
        return svg;
    }
    
    var recordFillIcon = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" fill="currentColor" class="bi bi-record-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10z"/></svg>';
    
    var xIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve" fill="currentColor"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"/></svg>';
    
    var checkbox = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve" fill="currentColor"><path d="M7 5c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2H7zm0 12V7h10l.002 10H7z"/></svg>';
    
    var unchecked = checkbox;
    
    var checked = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"/></svg>';
    
    var ynnCheckboxes = {
        yes: getSVG(checked, 'white'),
        no: getSVG(xIcon, 'white'),
        neutral: getSVG(recordFillIcon, 'white')
    };
    
    ynnCheckboxes.maybe = ynnCheckboxes.neutral;
    ynnCheckboxes.mayBe = ynnCheckboxes.neutral;
    ynnCheckboxes.perhaps = ynnCheckboxes.neutral;
    
    ynnCheckboxes.Yes = ynnCheckboxes.YES = ynnCheckboxes.y = ynnCheckboxes.Y = ynnCheckboxes.yes;
    
    ynnCheckboxes.No = ynnCheckboxes.NO = ynnCheckboxes.n = ynnCheckboxes.N = ynnCheckboxes.no;
    
    ynnCheckboxes.Neutral = ynnCheckboxes.NEUTRAL = ynnCheckboxes.neutral;
    
    ynnCheckboxes.maybe = ynnCheckboxes.m = ynnCheckboxes.M = ynnCheckboxes.neutral;
    
    ynnCheckboxes.Maybe = ynnCheckboxes.neutral;
    
    ynnCheckboxes.perhaps = ynnCheckboxes.neutral;
    
    ynnCheckboxes.Perhaps = ynnCheckboxes.p = ynnCheckboxes.P = ynnCheckboxes.neutral;
    
    ynnCheckboxes.Quizas = ynnCheckboxes.quizas = ynnCheckboxes.q = ynnCheckboxes.Q = ynnCheckboxes.neutral;
    
    
    var ynnValues = ['yes', 'no', 'neutral'];
    
    var ynnLabels = ['Yes', 'No', 'Neutral'];
    
    var ynnColors = ['rgb(0,206,57)', 'rgb(255,0,0)' , 'rgb(222,222,222)' ];
    
    var defaultToggleBg = 'rgb(153,153,153)';
    
    var ynnColorsMap = {
        yes: 'rgb(0,206,57)',
        no: 'rgb(255,0,0)',
        neutral: 'rgb(222,222,222)'
    };
    
    
    ynnColorsMap.Yes = ynnColorsMap.YES = ynnColorsMap.y = ynnColorsMap.Y = ynnColorsMap.yes;
    
    ynnColorsMap.No = ynnColorsMap.NO = ynnColorsMap.n = ynnColorsMap.N = ynnColorsMap.no;
    
    ynnColorsMap.Neutral = ynnColorsMap.NEUTRAL = ynnColorsMap.neutral;
    
    ynnColorsMap.maybe = ynnColorsMap.m = ynnColorsMap.M = ynnColorsMap.neutral;
    
    ynnColorsMap.Maybe = ynnColorsMap.neutral;
    
    ynnColorsMap.perhaps = ynnColorsMap.neutral;
    
    ynnColorsMap.Perhaps = ynnColorsMap.p = ynnColorsMap.P = ynnColorsMap.neutral;
    
    ynnColorsMap.Quizas = ynnColorsMap.quizas = ynnColorsMap.q = ynnColorsMap.Q = ynnColorsMap.neutral;
    
    var yesNeutralNoValues = ['yes', 'neutral', 'no'];
    
    
    var yesNoNeutralValues = ynnValues;
    
    var yesNoMaybeValues = ['yes', 'no', 'maybe'];
    
    var yesNoMaybeLabels = ['Yes', 'No', 'May be'];
    
    var yesMaybeNoLabels = ['Yes', 'May be', 'No'];
    
    var yesMaybeNoValues = ['yes', 'maybe', 'no'];
    
    var yesNoNeutralColors = ynnColors;
    
    var yesNeutralNoColors = [ynnColorsMap.yes, ynnColorsMap.neutral, ynnColorsMap.no];
    
    var yesNoMaybeColors = [ynnColorsMap.yes, ynnColorsMap.no, ynnColorsMap.maybe]; 
    
    var yesMaybeNoColors = [ynnColorsMap.yes, ynnColorsMap.maybe, ynnColorsMap.no];
    
    var maybeYesNoColors = [ynnColorsMap.maybe, ynnColorsMap.yes, ynnColorsMap.no];
    
    var neutralYesNoColors = [ynnColorsMap.neutral, ynnColorsMap.yes, ynnColorsMap.no];
    
    var tristatesCheckboxes = {
        indeterminate : '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="checkbox-indeterminate" d="M28.444,0L3.556,0C1.6,0 0,1.6 0,3.556L0,28.444C0,30.4 1.6,32 3.556,32L28.444,32C30.4,32 32,30.4 32,28.444L32,3.556C32,1.6 30.4,0 28.444,0ZM24.89,17.777L7.113,17.777L7.113,14.221L24.89,14.221L24.89,17.777Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        checked : '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="checkbox-checked" d="M28.444,0L3.556,0C1.583,0 0,1.6 0,3.556L0,28.444C0,30.4 1.583,32 3.556,32L28.444,32C30.417,32 32,30.4 32,28.444L32,3.556C32,1.6 30.417,0 28.444,0ZM12.445,24.888L3.556,15.999L6.062,13.493L12.445,19.857L25.938,6.364L28.444,8.888L12.445,24.887L12.445,24.888Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        unchecked : '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="checkbox-unchecked" d="M28.444,3.556L28.444,28.444L3.556,28.444L3.556,3.556L28.444,3.556ZM28.444,0L3.556,0C1.6,0 0,1.6 0,3.556L0,28.444C0,30.4 1.6,32 3.556,32L28.444,32C30.4,32 32,30.4 32,28.444L32,3.556C32,1.6 30.4,0 28.444,0Z" style="fill-rule:nonzero;"/>'
            + '</svg>'
    };
    
    var defaultCompletedValues = ['notstarted', 'uncompleted', 'completed'];
    
    var defaultCompletedLabels = ['Not started', 'Uncompleted', 'Completed'];
    
    var defaultCheckboxValues = ['indeterminate', 'unchecked', 'checked'];
    
    var defaultValues = defaultCheckboxValues;
    
    var defaultCheckboxLabels = ['Indeterminate', 'Unchecked', 'Checked'];
    
    var defaultLabels = defaultCheckboxLabels;

    var defaultCheckboxIcons = [
        tristatesCheckboxes['indeterminate'], 
        tristatesCheckboxes['unchecked'], 
        tristatesCheckboxes['checked']
    ];
    
    var defaultIcons = defaultCheckboxIcons;
    
    var defaultCheckboxValues = ['indeterminate', 'unchecked', 'checked'];

    var defaultCheckboxLabels = ['Indeterminate', 'Unchecked', 'Checked'];
    
    var maybeYesNoValues = ['maybe', 'yes', 'no'];
    
    var maybeYesNoLabels = ['May be', 'Yes', 'No'];
    
    var maybeYesNoIcons = [ynnCheckboxes['maybe'], ynnCheckboxes['yes'], ynnCheckboxes['no']];
    
    var yesMaybeNoValues = ['yes', 'maybe', 'no'];
    
    var yesMaybeNoLabels = ['Yes', 'May be', 'No'];
    
    var yesMaybeNoIcons = [ynnCheckboxes['yes'], ynnCheckboxes['maybe'], ynnCheckboxes['no']];
    
    var neutralYesNoValues = ['neutral', 'yes', 'no'];
    
    var neutralYesNoLabels = ['May be', 'Yes', 'No'];
    
    var neutralYesNoIcons = [ynnCheckboxes['neutral'], ynnCheckboxes['yes'], ynnCheckboxes['no']];
    
    var yesNeutralNoValues = ['yes', 'neutral', 'no'];
    
    var yesNeutralNoLabels = ['Yes', 'May be', 'No'];
    
    var yesNeutralNoIcons = [ynnCheckboxes['yes'], ynnCheckboxes['neutral'], ynnCheckboxes['no']];
    
    var pendingValues = ['pending', 'valid', 'invalid'];
    
    var pendingLabels = ['Pending', 'Valid', 'Invalid'];
    
    var defaultPendingIcon = '<svg viewBox="0 0 50 50" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m25 18c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1s1 .4 1 1v8c0 .6-.4 1-1 1z"/><path d="m25 42c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1s1 .4 1 1v8c0 .6-.4 1-1 1z" opacity=".3"/><path d="m29 19c-.2 0-.3 0-.5-.1-.4-.3-.6-.8-.3-1.3l4-6.9c.3-.4.8-.6 1.3-.3.4.3.6.8.3 1.3l-4 6.9c-.2.2-.5.4-.8.4z" opacity=".3"/><path d="m17 39.8c-.2 0-.3 0-.5-.1-.4-.3-.6-.8-.3-1.3l4-6.9c.3-.4.8-.6 1.3-.3.4.3.6.8.3 1.3l-4 6.9c-.2.2-.5.4-.8.4z" opacity=".3"/><path d="m21 19c-.3 0-.6-.2-.8-.5l-4-6.9c-.3-.4-.1-1 .3-1.3s1-.1 1.3.3l4 6.9c.3.4.1 1-.3 1.3-.2.2-.3.2-.5.2z" opacity=".93"/><path d="m33 39.8c-.3 0-.6-.2-.8-.5l-4-6.9c-.3-.4-.1-1 .3-1.3s1-.1 1.3.3l4 6.9c.3.4.1 1-.3 1.3-.2.1-.3.2-.5.2z" opacity=".3"/><path d="m17 26h-8c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1z" opacity=".65"/><path d="m41 26h-8c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1z" opacity=".3"/><path d="m18.1 21.9c-.2 0-.3 0-.5-.1l-6.9-4c-.4-.3-.6-.8-.3-1.3.3-.4.8-.6 1.3-.3l6.9 4c.4.3.6.8.3 1.3-.2.3-.5.4-.8.4z" opacity=".86"/><path d="m38.9 33.9c-.2 0-.3 0-.5-.1l-6.9-4c-.4-.3-.6-.8-.3-1.3.3-.4.8-.6 1.3-.3l6.9 4c.4.3.6.8.3 1.3-.2.3-.5.4-.8.4z" opacity=".3"/><path d="m11.1 33.9c-.3 0-.6-.2-.8-.5-.3-.4-.1-1 .3-1.3l6.9-4c.4-.3 1-.1 1.3.3s.1 1-.3 1.3l-6.9 4c-.1.2-.3.2-.5.2z" opacity=".44"/><path d="m31.9 21.9c-.3 0-.6-.2-.8-.5-.3-.4-.1-1 .3-1.3l6.9-4c.4-.3 1-.1 1.3.3s.1 1-.3 1.3l-6.9 4c-.2.2-.3.2-.5.2z" opacity=".3"/></svg>';
    
    //var spinner = '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M315.076923 541.538462v-59.076924c0-15.753846-13.784615-29.538462-29.538461-29.538461h-216.615385c-15.753846 0-29.538462 13.784615-29.538462 29.538461v59.076924c0 15.753846 13.784615 29.538462 29.538462 29.538461h216.615385c15.753846 0 29.538462-13.784615 29.538461-29.538461z m37.415385 88.615384c-11.815385-11.815385-29.538462-11.815385-41.353846 0L157.538462 783.753846c-11.815385 11.815385-11.815385 29.538462 0 41.353846l41.353846 41.353846c11.815385 11.815385 29.538462 11.815385 41.353846 0l153.6-153.6c11.815385-11.815385 11.815385-29.538462 0-41.353846L352.492308 630.153846z m319.015384-236.307692c11.815385 11.815385 29.538462 11.815385 41.353846 0l153.6-153.6c11.815385-11.815385 11.815385-29.538462 0-41.353846L825.107692 157.538462c-11.815385-11.815385-29.538462-11.815385-41.353846 0L630.153846 309.169231c-11.815385 11.815385-11.815385 29.538462 0 41.353846l41.353846 43.323077zM240.246154 157.538462c-11.815385-11.815385-29.538462-11.815385-41.353846 0L157.538462 198.892308c-11.815385 11.815385-11.815385 29.538462 0 41.353846l153.6 153.6c11.815385 11.815385 29.538462 11.815385 41.353846 0l41.353846-41.353846c11.815385-11.815385 11.815385-29.538462 0-41.353846L240.246154 157.538462z m474.584615 472.615384c-11.815385-11.815385-29.538462-11.815385-41.353846 0L630.153846 671.507692c-11.815385 11.815385-11.815385 29.538462 0 41.353846l153.6 153.6c11.815385 11.815385 29.538462 11.815385 41.353846 0l41.353846-41.353846c11.815385-11.815385 11.815385-29.538462 0-41.353846L714.830769 630.153846z m-173.292307 78.769231h-59.076924c-15.753846 0-29.538462 13.784615-29.538461 29.538461v216.615385c0 15.753846 13.784615 29.538462 29.538461 29.538462h59.076924c15.753846 0 29.538462-13.784615 29.538461-29.538462v-216.615385c0-15.753846-13.784615-29.538462-29.538461-29.538461z m413.538461-256h-216.615385c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076924c0 15.753846 13.784615 29.538462 29.538461 29.538461h216.615385c15.753846 0 29.538462-13.784615 29.538462-29.538461v-59.076924c0-15.753846-13.784615-29.538462-29.538462-29.538461z m-413.538461-413.538462h-59.076924c-15.753846 0-29.538462 13.784615-29.538461 29.538462v216.615385c0 15.753846 13.784615 29.538462 29.538461 29.538461h59.076924c15.753846 0 29.538462-13.784615 29.538461-29.538461v-216.615385c0-15.753846-13.784615-29.538462-29.538461-29.538462z"  /></svg>'
    
    var pendingSpinnerIcon = '<svg class="svg-icon" xml:space="preserve" style="vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M315.076923 541.538462v-59.076924c0-15.753846-13.784615-29.538462-29.538461-29.538461h-216.615385c-15.753846 0-29.538462 13.784615-29.538462 29.538461v59.076924c0 15.753846 13.784615 29.538462 29.538462 29.538461h216.615385c15.753846 0 29.538462-13.784615 29.538461-29.538461z m37.415385 88.615384c-11.815385-11.815385-29.538462-11.815385-41.353846 0L157.538462 783.753846c-11.815385 11.815385-11.815385 29.538462 0 41.353846l41.353846 41.353846c11.815385 11.815385 29.538462 11.815385 41.353846 0l153.6-153.6c11.815385-11.815385 11.815385-29.538462 0-41.353846L352.492308 630.153846z m319.015384-236.307692c11.815385 11.815385 29.538462 11.815385 41.353846 0l153.6-153.6c11.815385-11.815385 11.815385-29.538462 0-41.353846L825.107692 157.538462c-11.815385-11.815385-29.538462-11.815385-41.353846 0L630.153846 309.169231c-11.815385 11.815385-11.815385 29.538462 0 41.353846l41.353846 43.323077zM240.246154 157.538462c-11.815385-11.815385-29.538462-11.815385-41.353846 0L157.538462 198.892308c-11.815385 11.815385-11.815385 29.538462 0 41.353846l153.6 153.6c11.815385 11.815385 29.538462 11.815385 41.353846 0l41.353846-41.353846c11.815385-11.815385 11.815385-29.538462 0-41.353846L240.246154 157.538462z m474.584615 472.615384c-11.815385-11.815385-29.538462-11.815385-41.353846 0L630.153846 671.507692c-11.815385 11.815385-11.815385 29.538462 0 41.353846l153.6 153.6c11.815385 11.815385 29.538462 11.815385 41.353846 0l41.353846-41.353846c11.815385-11.815385 11.815385-29.538462 0-41.353846L714.830769 630.153846z m-173.292307 78.769231h-59.076924c-15.753846 0-29.538462 13.784615-29.538461 29.538461v216.615385c0 15.753846 13.784615 29.538462 29.538461 29.538462h59.076924c15.753846 0 29.538462-13.784615 29.538461-29.538462v-216.615385c0-15.753846-13.784615-29.538462-29.538461-29.538461z m413.538461-256h-216.615385c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076924c0 15.753846 13.784615 29.538462 29.538461 29.538461h216.615385c15.753846 0 29.538462-13.784615 29.538462-29.538461v-59.076924c0-15.753846-13.784615-29.538462-29.538462-29.538461z m-413.538461-413.538462h-59.076924c-15.753846 0-29.538462 13.784615-29.538461 29.538462v216.615385c0 15.753846 13.784615 29.538462 29.538461 29.538461h59.076924c15.753846 0 29.538462-13.784615 29.538461-29.538461v-216.615385c0-15.753846-13.784615-29.538462-29.538461-29.538462z"  /></svg>'
    
    var circleFilledExclamationIcon = '<?xml version="1.0" encoding="iso-8859-1"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="45.311px" height="45.311px" viewBox="0 0 45.311 45.311" style="enable-background:new 0 0 45.311 45.311;" xml:space="preserve"><g><path d="M22.675,0.02c-0.006,0-0.014,0.001-0.02,0.001c-0.007,0-0.013-0.001-0.02-0.001C10.135,0.02,0,10.154,0,22.656c0,12.5,10.135,22.635,22.635,22.635c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c12.5,0,22.635-10.135,22.635-22.635C45.311,10.154,35.176,0.02,22.675,0.02z M22.675,38.811c-0.006,0-0.014-0.001-0.02-0.001c-0.007,0-0.013,0.001-0.02,0.001c-2.046,0-3.705-1.658-3.705-3.705c0-2.045,1.659-3.703,3.705-3.703c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c2.045,0,3.706,1.658,3.706,3.703C26.381,37.152,24.723,38.811,22.675,38.811z M27.988,10.578c-0.242,3.697-1.932,14.692-1.932,14.692c0,1.854-1.519,3.356-3.373,3.356c-0.01,0-0.02,0-0.029,0c-0.009,0-0.02,0-0.029,0c-1.853,0-3.372-1.504-3.372-3.356c0,0-1.689-10.995-1.931-14.692C17.202,8.727,18.62,5.29,22.626,5.29c0.01,0,0.02,0.001,0.029,0.001c0.009,0,0.019-0.001,0.029-0.001C26.689,5.29,28.109,8.727,27.988,10.578z"/></g></svg>';
    
    var defaultInvalidIcon = circleFilledExclamationIcon;
    
    var defaultValidIcon = checked;
    
    var pendingIcons = [defaultPendingIcon, defaultValidIcon, defaultInvalidIcon];
    
    var pendingValidInvalidValues = pendingValues;
    
    var pendingValidInvalidNames = pendingValues;
    
    var pendingValidInvalidLabels = pendingLabels;
    
    var pendingValidInvalidIcons = pendingIcons;
    
    var defaultPriorityColors = {
        urgent: 'red', high: 'red',
        important: 'green', medium: 'green', middle: 'green' , mid: 'green',
        normal: 'green',
        notimportant: 'blue', 'not-important': 'blue', low: 'blue'
    };
    
    var defaultPriorityColorsList = ['red', 'green', 'blue'];
    
    var statusColors = {
        initiate: 'green',
        halfway: 'purple',
        completed: 'black',
        half: 'purple',
        halfwaydone: 'purple',
        'half-way': 'purple',
        'half-way-done' : 'purple'
    };
    
    var statusColorsList = [
        'green',
        'purple',
        'black'
    ];
    
    var statusValues = [
        'initiate',
        'halfwaydone',
        'completed'
    ];
    
    var statusLabels = [
        'Initiate',
        'Halfway done',
        'Completed'
    ];
    
    var timeColors= {
        morning: 'pink',
        afternoon: 'yellow',
        evening: 'darkblue',
        Morning: 'pink',
        Afternoon: 'yellow',
        Evening: 'darkblue'
    };
    
    var deadlineColors = timeColors;
    
    var times= [
        'morning',
        'afternoon',
        'evening'
    ];
    
    var deadlines = times;
    
    var timeColorsList= [
        'pink',
        'yellow',
        'darkblue'
    ];
    
    var deadlineColorsList = timeColorsList;
    
    function getColoredStates(o) {
        var states, values, keys, x;
        if (isArray(states = o.states)) {
            states.forEach(function(s, i) {
                s = unboxVal(s);
            });
        } else if (typeof states === 'string' && states) {
            states = states.split(/\|/).map(function(s) {
                
            });
        } else if (isArray(o.colors)) {
            o.colors.forEach(function(s, i) {
                s = unboxVal(s);
            });
        } else if (typeof o.colors === 'string' && o.colors) {
            states = o.values.split(/\|/).map(function(s) {
                
            });
        } else if (isPlainObj(o.colors)) {
            states = [];
            if (isArray(values = o.values)) {
                values.forEach(function(v) {
                    
                });
            } else {
                
            }
        } else if (isArray(values = o.values)) {

        } else if (typeof o.values === 'string' && o.values) {
            values = o.values.split(/\|/);
            if (/morning|afternoon|evening/i.test(o.values)) {
                states = values.map(function(s, i) {
                    return {
                        value: s,
                        name: s,
                        color: timeColors[s]
                    };
                });
            } else {
                states = values.map(function(s, i) {
                    var x;
                    var c = defaultPriorityColors[x = s.toLowerCase()];
                    if (!c) {
                        if (/^(?:(?:rgb|hsl)a?\(|#)/.test(x.replace(/[ \t]/, ''))) {
                            c = x;
                        } else {
                            c= defaultPriorityColorsList[i];
                        }
                    }
                    return {
                        value: s,
                        name: s,
                        color: c
                    };
                });
            }
        } else if (isArray(o.priorities)) {
            states = [];
            o.priorities.forEach(function(p, i) {
                var s;
                if (typeof (p = unboxVal(p)) === 'string') {
                    states[i] = {
                        value: p,
                        name: p,
                        color: defaultPriorityColors[p.toLowerCase()]
                    };
                } else if (isPlainObj(p)) {
                    s = {
                        value: p.value||p.name,
                        name: p.name||('' + p.value),
                        color: p.color ? p.color : defaultPriorityColors[p.name.toLowerCase()]||defaultPriorityColors[('' + p.value).toLowerCase()]
                    };
                    if (p.label) {
                        s.label = p.label;
                    }
                    states[i] = s;
                } else if (isArray(p)) {
                    
                } else if (typeof p === 'number') {
                    
                }
            });
        } else if (typeof o.priorities === 'string' && o.priorities) {
            states = [];
            o.priorities.split(/\|/).forEach(function(p, i) {
                states[i] = {
                    value: p,
                    name: p,
                    color: defaultPriorityColors[p.toLowerCase()]
                };
            });
        } else if ((keys = Object.keys(o)) && 
                (keys.indexOf('priority') >= 0 
                || keys.indexOf('priorities') >= 0)) {
            return [
                { value: 'high', name: 'high', label: 'High', color: 'green' },
                { value: 'medium', name: 'medium', label: 'Medium', color:  'orange'},
                { value: 'low', name: 'low',  label: 'Low', color: 'gray' }
            ];
        } else if (o.times === true || o.moments === true || o.time === true || o.moment === true
                || ((typeof o.times === 'string' || o.times instanceof String) &&/^true$/i.test(o.times))) {
            return [
                { value: 'morning', name: 'morning', label: 'Morning', color: timeColors.morning },
                { value: 'afternoon', name: 'afternoon', label: 'Afternoon', color:  timeColors.afternoon},
                { value: 'evening', name: 'evening', label: 'Evening', color: timeColors.evening }
            ];
        } else if (o.status === true || o.statuses === true
                || ((typeof (x = o.status||o.statuses) || x instanceof String) &&/^true$/i.test(x))) {
            return [
                { value: 'initiate', name: 'initiate', label: 'Initiate', color: statusColors.initiate },
                { value: 'halfwaydone', name: 'halfwaydone', label: 'Half way done', color:  statusColors.halfway},
                { value: 'completd', name: 'completd', label: 'Completd', color: statusColors.completd }
            ];
        } else {
            return [
                { value: 'red', label: 'Red', color: 'red' },
                { value: 'green', label: 'Green', color:  'green'},
                { value: 'orange', label: 'Orange', color: 'orange' }
            ];
        }
        return states;
    }
    
    function _getState(s, names, i) {
        if (names) {
            s.name = names[i];
        }
        return s;
    }

    function getStates(o) {
        var x, t, keys, values, icons, classes, states;
        var args = Array.prototype.slice.call(arguments);
        var colors = o.colors;
        var names;
        if (isPlainObj(o)) {
            if (o.colored || o.color || (colors && !o.stateButtons) || (o.uiType||o.inputType) === 'color') {
                
            } else if (o.borderSelection || o.borderedState) {
                return getColoredStates(o);
            } else {
                if (o.maybeYesNo||o.maybeyesno) {
                    names = ['maybe', 'yes', 'no'];
                    values = o.values||maybeYesNoValues;
                    icons = o.icons||o.images||o.imgs||maybeYesNoIcons;
                    if (o.stateButtons) {
                        colors = colors||maybeYesNoColors;
                    }
                } else if (o.yesMaybeNo||o.yesmaybeno) {
                    names = ['yes', 'maybe', 'no'];
                    values = o.values||yesMaybeNoValues;
                    icons = o.icons||o.images||o.imgs||yesMaybeNoIcons;
                    if (o.stateButtons) {
                        colors = colors||yesMaybeNoColors;
                    }
                } else if (o.neutralYesNo||o.neutralyesno) {
                    names = ['neutral', 'yes', 'no'];
                    values = o.values||neutralYesNoValues;
                    icons = o.icons||o.images||o.imgs||neutralYesNoIcons;
                    if (o.stateButtons) {
                        colors = colors||neutralYesNoColors;
                    }
                } else if (o.yesNeutralNo||o.yesneutralno) {
                    names = ['yes', 'neutral', 'no'];
                    values = o.values||yesNeutralNoValues;
                    icons = o.icons||o.images||o.imgs||yesNeutralNoIcons;
                    if (o.stateButtons) {
                        colors = colors||yesNeutralNoColors;
                    }
                } else if (o.yesNoNeutral||o.yesnoneutral) {
                    names = ['yes', 'no', 'neutral'];
                    values = o.values||ts.yesNoNeutralValues;
                    icons = o.icons||o.images||o.imgs||ts.yesNoNeutralIcons;
                    if (o.stateButtons) {
                        colors = colors||yesNoNeutralColors;
                    }
                } else if (o.yesNoMaybe||o.yesnomaybe) {
                    names = ['yes', 'no', 'maybe'];
                    values = o.values||ts.yesNoMaybeValues;
                    icons = o.icons||o.images||o.imgs||ts.yesNoMaybeIcons;
                    if (o.stateButtons) {
                        colors = colors||yesNoMaybeColors;
                    }
                } else if (o.pendingValidInvalid||o.pendingvalidinvalid) {
                    names = pendingValidInvalidNames;
                    values = pendingValidInvalidValues;
                    icons = o.icons||o.images||o.imgs||pendingValidInvalidIcons;
                    if (o.stateButtons) {
                        colors = colors||yesNoMaybeColors;
                    }
                } else if (o.stateButtons) {
                    names = ['yes', 'maybe', 'no'];
                    values = o.values||yesMaybeNoValues;
                    icons = o.icons||o.images||o.imgs||yesMaybeNoIcons;
                    if (o.stateButtons) {
                        colors = colors||yesMaybeNoColors;
                    }
                } else {
                    values = o.values||defaultCheckboxValues||maybeYesNoValues;
                    icons = o.icons||o.images||o.imgs||defaultCheckboxIcons||maybeYesNoIcons;
                }
            }

            classes = o.classes;

            if (isArray(states = o.states)) {
                if ((t = typeof (x = unboxVal(states[0]))) === 'string') {
                    states = states.map(function(s, i) {
                        return {
                            value: s,
                            icon: defaultIcons[i],
                            label: s[0].toUpperCase() + s.substring(1)
                        };
                    });
                } else if (t === 'number') {
                    states = states.map(function(s, i) {
                        return _getState({
                            value: s,
                            icon: defaultIcons[i],
                            label: defaultLabels[i]
                        }, names, i);
                    });
                } else {
                    if (!states[0].color) {
                        states = states.map(function(s, i) {
                            return _getState({
                                value: coalesce(s, ['value', 'val']),
                                icon: coalesce(s, ['icon', 'img', 'image'])||defaultIcons[i]
                            }, names, i);
                        });
                    }
                }
            } else if (isArray(values)) {
                states = [];
                if (isArray(icons)) {
                    if (isArray(classes)) {
                        throw new Error('Not yet supported');
                    } else if (isArray(colors)) {
                        values.forEach(function(v, i) {
                            states.push(_getState({
                                value: v,
                                icon: icons[i],
                                color: colors[i]
                            }, names, i));
                        });
                    } else {
                        values.forEach(function(v, i) {
                            states.push(_getState({
                                value: v,
                                icon: icons[i]
                            }, names, i));
                        });
                    }               
                } else if (isArray(classes)) {
                    throw new Error('Not yet supported');
                } else {
                    throw new Error('Not yet supported');
                }
                
            } else if (isArray(o.colors)) {
                var states = [];
                o.colors.forEach(function(c, i) {
                    if (typeof c === 'string') {
                        states.push({
                            value: c,
                            color: c
                        });
                    } else if (isPlainObj(c)) {
                        c.value = c.value||c.color||c.hex||c.hexaColor||c.rgb||c.rgba||c.hsl||c.hsla||c.name;
                        c.color = c.color||c.hex||c.hexaColor||c.rgb||c.rgba||c.hsl||c.hsla||c.value||c.name;
                        states.push(_getState(c, names, i));
                    }
                });
            } else if (o.colored || o.color  || (o.uiType||o.inputType) === 'color') {
                return [
                    { value: 'red', label: 'Red', color: 'red' },
                    { value: 'green', label: 'Green', color:  'green'},
                    { value: 'orange', label: 'Orange', color: 'orange' }
                ];
            } else if (isPlainObj(icons)) {
                throw new Error('Not yet supported');
            } else if ((keys = Object.keys(o)) && 
                    (keys.indexOf('halign') >= 0 
                    || keys.indexOf('hAlign') >= 0
                    || keys.indexOf('textalign') >= 0 
                    || keys.indexOf('textAlign') >= 0)) {

            } else if (keys.indexOf('completed') >= 0) {

            } else {
                throw new Error('Not yet supported');
            }      

        } else if (isArray(o)) {
            if (args.length > 2) {

            } else if (args.length === 2) {

            } else if (['string', 'number'].indexOf(typeof (x = unboxVal(o[0]))) >= 0) {
                values = o;
                states = o.map(function(v, i) {
                    return {
                        value: v,
                        icon: defaultIcons[i]
                    };
                });
            } else if (isPlainObj(x)) {
                states = o.map(function(v, i) {
                    return {
                        value: coalesce(v, ['value', 'val'], defaultValues[i]),
                        icon: coalesce(v, ['value', 'val'], defaultIcons[i]),
                        label: v.label||v.caption||v.title
                    };
                });
            } else if (isArray(x)) {

            }
        }
        return states;
    }
    
    function isUrl(img) {
        return !img.startsWith('<') && !/<svg /.test(img);
    }
    
    function switchColor(ev) {
        if (this.readonly || this.disabled)
            return;
        var i = (this.__$$values$$__.indexOf(this._val) + 1 ) % 3;
        var state = this.states[i];
        this._val = this.__$$values$$__[i];
        var handle = this.onswitch||this.onSwitch||this.onchange||this.onChange;
        this.style.backgroundColor = state.color;        
        
        preventDefault(ev=ev||window.event);
        if (isArray(handle)) {
            handle.forEach(function(fn) {
                fn.call(this, ev);
            });
        } else if (typeof handle === 'function' || handle instanceof Function) {
            handle.call(this, ev);
        }
    }
    function childIndex(el, child) {
        var children = el.children, i, n = children.length;
        for (i = 0; i < n; i++) {
            if (child === children[i])
                return i;
        }
        return -1;
    }
    function optionColor(ev) {
        var el = this.parentElement;
        if (el.readonly || el.disabled)
            return;
        preventDefault(ev=ev||window.event);
        var i = childIndex(el, this);
        var v = el.__$$values$$__[i];
        if (el._val !== v) {
            el._val = v;
            var state = el.states[i];
            var handle = el.onswitch||el.onSwitch||el.onchange||el.onChange;
            el.style.backgroundColor = state.color;    
            if (isArray(handle)) {
                handle.forEach(function(fn) {
                    fn.call(this, ev);
                });
            } else if (typeof handle === 'function' || handle instanceof Function) {
                handle.call(this, ev);
            }
        }        
        
    }
    function  onColorKey(ev) {
        var which;
        ev=ev||window.event;
        which = ev.which||ev.keyCode;
        if (which === 13) {
            switchColor.call(this, ev);
        }
    }
    
    function  onOptionColorKey(ev) {
        var which;
        ev=ev||window.event;
        which = ev.which||ev.keyCode;
        if (which === 13) {
            switchColor.call(this, ev);
        }
    }
    
    function onswitch(ev) {
        if (this.readonly || this.disabled)
            return;
        var i = (this.__$$values$$__.indexOf(this._val) + 1 ) % 3;
        var state = this.states[i];
        this._val = this.__$$values$$__[i];
        var handle = this.onswitch||this.onSwitch||this.onchange||this.onChange;
        var img = this.__$$img$$__;
        if (img.src) {
            if (isUrl(state.icon)) {
                img.src = state.icon;
            } else {
                this.removeChild(img);
                this.appendChild(this.__$$img$$__ = createImg(state.icon));
            }
        } else {
            if (isUrl(state.icon)) {
                this.removeChild(img);
                this.appendChild(this.__$$img$$__ = createImg(state.icon));
            } else {
                img.innerHTML = state.icon;
            }
        }
        
        
        preventDefault(ev=ev||window.event);
        if (isArray(handle)) {
            handle.forEach(function(fn) {
                fn.call(this, ev);
            });
        } else if (typeof handle === 'function' || handle instanceof Function) {
            handle.call(this, ev);
        }
    };
    function  onKey(ev) {
        var which;
        ev=ev||window.event;
        which = ev.which||ev.keyCode;
        if (which === 13) {
            onswitch.call(this, ev);
        }
    }
    
    function length(x) {
        var t, m;
        if ((t = typeof x) === 'number')
            return x + 'px';
        if (t === 'string') {
            if ((m = /^(?:\d+(?:\.\d+))([a-z]+|%)/.exec(x))) {
                return m[1] ? x + 'px' : x;
            } else {
                throw new Error('Incorrect length');
            }
        }
    }
    
    

    function createTriState(o) {
        /**
         * 
         * @private
         * @param {type} sEl
         * @param {type} inner
         */
        function styleState(sEl, inner) {
            var w;
            inner.style.position = 'relative';
            inner.style.borderWidth = inner.style.padding =  inner.style.margin = '0px';
            if (styleClass !== true && styleClass !== 1 
                    && (typeof styleClass !== 'string' || !styleClass)) {
                sEl.style.borderWidth = stateBorderWidth||'2px';
                sEl.style.borderRadius = borderRadius||(borderRadius = '50%');
                CSSBoxModel.fullSize(sEl, stateWidth||(stateWidth = 16), stateWidth);
                sEl.style.margin = '0px';
                sEl.style.padding = statePadding||(statePadding='2px');
                stateWidth = toPx(stateWidth);
                w = stateWidth - 2*(toPx(stateBorderWidth||'2px') + toPx(statePadding));
                CSSBoxModel.fullSize(inner, w, w);
                if (/%$/.test(borderRadius)) {
                    inner.style.borderRadius = borderRadius;
                } else {
                    borderRadius = toPx(borderRadius);
                    inner.style.borderRadius = (borderRadius*w/stateWidth) + 'px';
                }
            }
        }
        function addBorderSelectionEl(s, i) {
            var sEl = newEl(sTag);     
            var inner = newEl(sTag); 
            addCssClass(inner, 'inner');
            inner.style.backgroundColor = s.color;
            sEl.style.border = (stateBorderWidth||(stateBorderWidth = '2px')) + ' solid ' + s.color;
            sEl.appendChild(inner);
            el.appendChild(sEl);
            sEl.style.borderStyle = 'solid';
            sEl.style.borderWidth = stateBorderWidth||'2px';
            if (initialIndex === i) {
                sEl.style.borderColor = el.selectionColor||s.color;
                el._val = el.__$$values$$__[initialIndex];
                addCssClass(sEl, 'state ' + stateType + ' selected');
            } else {
                sEl.style.borderColor = 'transparent';
                addCssClass(sEl, 'state ' + stateType);
            }
            sEl.style.display = display;
            sEl.style.verticalAlign = 'middle';
            sEl.style.textAlign = 'center';
            styleState(sEl, inner);
            CSSBoxModel.fullSize(sEl, stateWidth||(stateWidth = 21), stateWidth);
            sEl.style.padding = '2px';
            return sEl;
        }
        
        function fireBorderSelectionChange(el, ev, lastSelectedIndex,  v, i) {            
            
            var lastSelected = el.children[lastSelectedIndex];
            lastSelected.style.borderColor = 'transparent';
            removeClass(lastSelected, 'selected'); 

            el.children[i].style.borderColor = 
                    el.selectionColor||el.states[i].color;
            addCssClass(el.children[i], 'selected');
            el._val = v;
            
            preventDefault(ev||window.event);
        }
        
        function addStateButtonEl(s, i, indeterminate) {
            var sEl = newEl(sTag);     
            var img = createImg({
                    src: s.icon||s.image||s.img
                            ||s.imgUrl||s.imgPath||s.imageUrl||s.imagePath
                            ||s.url||s.path,
                    wrappedTag: sTag
                }); 
            addCssClass(img, 'state-image');
            img.style.display = 'inline-block';
            img.style.position = 'relative';
            img.style.verticalAlign = 'middle';
            img.style.textAlign = 'center';
            sEl.style.color = 'white';
            //sEl.style.border = (stateBorderWidth||(stateBorderWidth = '2px')) + ' solid ' + s.borderColor||s.color;
            sEl.appendChild(img);
            el.appendChild(sEl);
            if (initialIndex === i) {
                sEl.style.backgroundColor = s.color;
                el._val = el.__$$values$$__[initialIndex];
                addCssClass(sEl, 'state ' + stateType + ' selected');
            } else {
                sEl.style.backgroundColor = 'transparent';
                addCssClass(sEl, 'state ' + stateType);
            }
            sEl.style.display = display;
            sEl.style.verticalAlign = 'middle';
            sEl.style.textAlign = 'center';
            sEl.style.borderRadius = '50%';
            CSSBoxModel.fullSize(sEl, stateWidth||(stateWidth = 21), stateWidth);
            var w = CSSBoxModel.width(sEl);
            if (!w) {
                w = stateWidth;
            }
            CSSBoxModel.fullSize(img, w, w);
            sEl.style.padding = '2px';
            return sEl;
        }
        
        function _setStateButtonValue(el, lastSelectedIndex,  v, i) {
            var lastSelected = el.children[lastSelectedIndex];
            lastSelected.style.backgroundColor = 'transparent';
            removeClass(lastSelected, 'selected'); 

            el.children[i].style.backgroundColor = el.states[i].color;
            addCssClass(el.children[i], 'selected');
            el._val = v;
            
            
            
            if (el.__isOptions__) {
                if (document.activeElement === lastSelected) {
                    el.children[i].focus();
                }
            } else {
                //TODO
            }
        }
        
        function setStateButtonValue(el,  v) {
            _setStateButtonValue(el, el.__$$values$$__.indexOf(el._val),  v, el.__$$values$$__.indexOf(v));
            return el;
        }
        
        function fireStateButtonChange(el, ev, lastSelectedIndex,  v, i) {          
            _setStateButtonValue(el, lastSelectedIndex,  v, i);            
            preventDefault(ev||window.event);
        }
        

        
        function setCheck(o) {
            if (o.maybeYesNo || o.maybeyesno
                    || /^maybe-?yes-?no$/i.test(uiType||'')
                    || /^maybe-?yes-?no$/i.test(o.stateType||'')) {
                o.maybeYesNo = true;
            } else if (o.yesMaybeNo || o.yesmaybeno 
                    || /^yes-?maybe-?no$/i.test(uiType||'')
                    || /^yes-?maybe-?no$/i.test(o.stateType||'')) {
                o.yesMaybeNo = true;
            } else if (o.yesNoMaybe || o.yesnomaybe
                    || /^yes-?no-?maybe$/i.test(uiType||'')
                    || /^yes-?no-?maybe$/i.test(o.stateType||'')) {
                o.yesNoMaybe = true;
            } else if (o.neutralYesNo || o.neutralyesno
                    || /^neutral-?yes-?no$/i.test(uiType||'')
                    || /^neutral-?yes-?no$/i.test(o.stateType||'')) {
                o.neutralYesNo = true;
            } else if (o.yesNeutralNo || o.yesneutralno 
                    || /^yes-?neutral-?no$/i.test(uiType||'')
                    || /^yes-?neutral-?no$/i.test(o.stateType||'')) {
                o.yesNeutralNo = true;
            } else if (o.yesNoNeutral || o.yesnoneutral
                    || /^yes-?no-?neutral$/i.test(uiType||'')
                    || /^yes-?no-?neutral$/i.test(o.stateType||'')) {
                o.yesNoNeutral = true;
            } else if (o.checkbox
                    || /^checkbox$/i.test(uiType||'')
                    || /^checkbox$/i.test(o.stateType||'')) {
                o.checkbox = true;
            } else if (o.stateButtons||o.stateButton) {
                o.yesMaybeNo = true;
                toggle = true;
            } else {
                return false;
            }
            o.stateButtons = true;
            return true;
        }
        
        var addBorderedState;
        
        function addBorderedStateEl(s, i) {
            //the state element
            var sEl = newEl(sTag);
            //the state inner element
            var inner = newEl(sTag); 
            addCssClass(inner, 'inner');
            inner.style.backgroundColor = s.color;
            sEl.style.border = (stateBorderWidth||(stateBorderWidth = '2px')) + ' solid ' + s.color;
            sEl.appendChild(inner);
            el.appendChild(sEl);
            sEl.style.borderStyle = 'solid';
            sEl.style.borderWidth = stateBorderWidth||'2px';
            if (initialIndex === i) {
                inner.style.backgroundColor = s.color;
                el._val = el.__$$values$$__[initialIndex];
                addCssClass(sEl, 'state ' + (stateType||'bordered-state') + ' selected');
            } else {
                inner.style.backgroundColor = 'transparent';
                addCssClass(sEl, 'state ' + (stateType||'bordered-state'));
            }
            sEl.style.display = display;
            sEl.style.verticalAlign = 'middle';
            sEl.style.textAlign = 'center';
            styleState(sEl, inner);
            CSSBoxModel.fullSize(sEl, stateWidth||(stateWidth = 21), stateWidth);
            sEl.bgEl = inner;
            return sEl;
        }
        /**
         * 
         * @private
         * @param {type} el
         * @param {type} ev
         * @param {Number} lastSelectedIndex
         * @param {type} v The new state value
         * @param {type} i The new state index
         * @returns {undefined}
         */
        function changeBg(el, ev, lastSelectedIndex,  v, i) {
            //remove the background of last selected background element
            el.children[lastSelectedIndex].bgEl.style.backgroundColor = 'transparent';
            el.children[i].bgEl.style.backgroundColor = el.states[i].color;
            el._val = v;
            preventDefault(ev||window.event);
        }
        
        function setChangeBg() {
            if (o.borderedState) {
                addState = getAddState(addBorderedStateEl, changeBg);
            } else if (!o.stateButtons && stateType === 'full-background') {                    
                addState = function(s, i) {
                    var sEl = newEl(sTag);
                    sEl.style.border = (stateBorderWidth||'2px') + ' solid ' + s.color;
                    sEl.style.display = display;
                    addCssClass(sEl, 'state ' + stateType);
                    if (initialIndex === i) {
                        sEl.style.backgroundColor = s.color;
                        el._val = el.__$$values$$__[initialIndex];
                    }
                    sEl.bgEl = sEl;
                    sEl.style.borderRadius = borderRadius||(borderRadius = '50%');
                    el.appendChild(sEl);
                    CSSBoxModel.fullSize(sEl, stateWidth||21, stateWidth||21);
                };                  
            } else {
                return false;
            }
            el.handleNextState = switchHandle = getSwitchHandle(changeBg);
            el.handlePrevState = getHandlePrevSate(changeBg);
            return true;
        }
        /**
         * 
         * @private
         * @param {Function} action
         * @returns {Function}
         */
        function getStateChangeHandle(action) {
            function handle(ev) {

                var v, j;

                //this represents the clicked option

                //get the tristate element
                el = this.parentElement;

                if (el.readonly || el.disabled)
                    return;
                v = el.__$$values$$__[j = childIndex(el, this)];

                if (el._val === v) {
                    preventDefault(ev||window.event);
                    return;
                }
                handle.action.call(this, el, ev, 
                    /* last selected index*/el.__$$values$$__.indexOf(el._val), 
                    v, j);

            };
            handle.action = action;
            return handle;
        }
        
        function getHandlePrevSate(action) {            
            
            function handlePrevSate(ev) {
                //this represents the tristate element (switch target element) if not options
                
                var el = this.tristateEl||this;
                
                var lastSelectedIndex, selectedIndex, values;
                if (el.readonly || el.disabled)
                    return;
                values = el.__$$values$$__;
                lastSelectedIndex = values.indexOf(el._val);
                selectedIndex = lastSelectedIndex ? lastSelectedIndex - 1 : values.length - 1;
                //set the background of the background element of 
                //the new selected/clicked
                handlePrevSate.action.call(
                    this, //the target element
                    el, //the tristate element. In case tristate not options,
                          //the target element is the tristate element (this.tristateEl)
                    ev, 
                    lastSelectedIndex, 
                    values[selectedIndex], //the new current/selected state value
                    selectedIndex //the new current/selected state/option index
                );
                updateFocus(el, lastSelectedIndex, selectedIndex);
            }
            handlePrevSate.action = action;
            return handlePrevSate;
        }
        
        function updateFocus(el, lastSelectedIndex, selectedIndex) {
            if (el.__isOptions__) {
                el.children[lastSelectedIndex].setAttribute('tabindex', '-1');
                el.children[selectedIndex].setAttribute('tabindex', '0');
                el.children[selectedIndex].focus();
            }
        }
        
        function getSwitchHandle(action) {            
            
            function handleSwitch(ev) {
                //this represents the tristate element (switch target element) when not options
                
                var el = this.tristateEl||this;
                
                var lastSelectedIndex, selectedIndex, values;
                if (el.readonly || el.disabled)
                    return;
                values = el.__$$values$$__;
                lastSelectedIndex = values.indexOf(el._val);
                selectedIndex = (lastSelectedIndex + 1) % values.length;
                //set the background of the background element of 
                //the new selected/clicked
                handleSwitch.action.call(
                    this, //the target element
                    el, //the tristate element. In case tristate not options,
                          //the target element is the tristate element (this.tristateEl)
                    ev, 
                    lastSelectedIndex, 
                    values[selectedIndex], //the new current/selected state value
                    selectedIndex //the new current/selected state/option index
                );
                updateFocus(el, lastSelectedIndex, selectedIndex);
            }
            handleSwitch.action = action;
            return handleSwitch;
        }
        
        function getAddState(addEl, action){
            function addState(s, i) {
                var sEl = addState.addEl(s, i);
                sEl.setAttribute('tabindex', i ? '-1' : '0');
                sEl.tristateEl = el;
                bindAction(sEl, addState.action);
            }
            addState.addEl = addEl;
            addState.action = getStateChangeHandle(action);
            return  o.options ? addState : addEl;
        }
        
        var addState;
        var switchHandle;
        
        function setToggleColoredStates() {
            if (o.borderselection || o.borderSelection 
                    || /^border-?selection$/i.test(stateType||uiType||'')) {
                addState = getAddState(addBorderSelectionEl,
                        fireBorderSelectionChange);
                el.handleNextState = switchHandle = getSwitchHandle(fireBorderSelectionChange);
                el.handlePrevState = getHandlePrevSate(fireBorderSelectionChange);
                
            } else if (!setChangeBg()) {
                addState = getAddState(addStateButtonEl, fireStateButtonChange);
                el.handleNextState = switchHandle = getSwitchHandle(fireStateButtonChange);
                el.handlePrevState = getHandlePrevSate(fireStateButtonChange);
            }
            states.forEach(function(s, i) {
                addState(s, i);
            });
            el.style.padding = '5px';
            if (!styleClass) {
                if (o.stateButtons) {
                    el.style.backgroundColor = o.backgroundColor||defaultToggleBg;
                    el.style.borderRadius = '12.5px';
                }
            }
            if (!o.options) {
                bindAction(el, switchHandle);
            }
        }
        
        function appendTo(el, container) {
            if (isDOMElt(container = unboxVal(o.container))) {
                container.appendChild(el);
            } else if (typeof container === 'string' && container) {
                var c = document.getElementById(container);
                if (c) {
                    c.appendChild(el);
                } else {
                    c = newEl('div');
                    c.id = container;
                    c.appendChild(el);
                    document.getElementsByTagName('body')[0].appendChild(c);
                }
            } else {
                document.getElementsByTagName('body')[0].appendChild(el);
            }
        }
        
        
        var singleStateElt;
        var colored, toggle;
        var args = Array.prototype.slice.call(arguments);
        var states;
        var id, el, withLabel, labelBefore, e, x;
        var initialValue;
        var inputTag;
        var uiType, stateType, dropdown, comboBox;
        var orientation, match, checkbox, container;
        
        if (isPlainObj(o)) {
            if (toBool(o.options||o.option)) {
                o.options = true;
            }
            uiType = o.uiType||o.inputType||o.layoutType||o.layout||o.fieldType||'';
            stateType = o.stateType||'';
            if (o.options || /^options?$/.test(uiType||'') || /^options?$/.test(stateType)) {
                toggle = true;
                if ((match = /^(border|frame|circle)-?selection$/i.exec(uiType))
                        || o.borderselection || o.borderSelection
                        || (match = /^(border|frame|circle)-?selection$/i.exec(stateType))) {
                    o.borderSelection = true;
                    o.selectionType =!match || match[1] === 'border' ? 'frame' : match[1];
                } else if (o.stateButtons || o.stateButton 
                        || /^((?:colou?red-?|state-?)?icon|buttons?)$/.test(uiType)
                        || /^((?:colou?red-?|state-?)?icon|buttons?)$/.test(stateType)) {
                    o.stateButtons = true; 
                    o.yesMaybeNo = true;
                    o.borderedState = o.borderSelection = o.checkbox = false;
                } else if (!setCheck(o)) {
                    o.borderedState = true;
                    o.selectionType = 'frame';
                }
            } else if ((match = /^(border|frame|circle)-?selection$/i.exec(uiType))
                    || o.borderselection || o.borderSelection
                    || (match = /^(border|frame|circle)-?selection$/i.exec(stateType))) {
                toggle = true;
                o.borderSelection = true;
                o.selectionType =!match || match[1] === 'border' ? 'frame' : match[1];
            } else if (o.borderedState
                    || /^bordered(?:-?state)?$/i.test(uiType||'')
                    || /^bordered(?:-?state)?$/i.test(stateType)) {
                toggle = true;
                o.borderedState = true;
            } else if (o.colored||o.color || uiType === 'color' || uiType === 'colored' || isArray(o.colors)) {
                colored = o.colored = true;
            } else if (/traff?ic(?:[-]?light)?$/i.test(uiType)  || o.trafficLight  || o.traficLight) {
                toggle = true;
                if (!o.orientation) {
                    o.orientation = 'vertical';
                }
                if (!o.states) {
                    o.states = [
                        { value: 'red', label: 'Red', color: 'red' },
                        { value: 'green', label: 'Green', color:  'green'},
                        { value: 'orange', label: 'Orange', color: 'orange' }
                    ];
                }
            } else if (o.toggle||o.switch || uiType === 'toggle' || uiType === 'switch') {
                toggle = true;
            } else if (o.combo || o.comboBox || o.combobox || /^combo(?:box)?$/i.test(uiType)) {
                comboBox = true;
            } else if (o.dropdown || o.dropdownBox || o.dropdownbox || /^dropdown(?:box)?$/i.test(uiType)) {
                dropdown = true;
            } else if (!setCheck(o)) {
                checkbox = true;
            }
            states = getStates.apply(null, args);
            inputTag = o.tag||o.tagName||'span';
            id = unboxVal(o.id||o.Id||o.ID);
            withLabel = o.withLabel||o.labeled;
            labelBefore = coalesce(o, ['labelBefore', 'captionBefore']);
            if (typeof id === 'string' && id) {
                el = document.getElementById(id);
                if (el) {
                    if ((tag = (el.tagName||el.nodeName).toLowerCase()) === 'input' || tag === 'select') {
                        x= el;
                        el = newEl(inputTag);
                        x.parentElement.insertBefore(e, x);
                        x.parentElement.removeChild(x);
                    } else {
                        el.innerHTML = '';
                    }
                } else {
                    el = newEl(inputTag);
                    el.id = id;
                }
            } else {
                el = newEl(inputTag);
            }
            el.style.display = 'inline-block';
            if (arguments.length > 1) {
                initialValue = args[1];
            } else {
                initialValue = coalesce(o, ['initialValue', 'defaultValue', 'defaultVal', 'value']);
            }
            stateType = o.stateType||'full-background';
            
            //SereniX.KeyboardEvents requires serenix_keyboard_events.js
            
            el.nextStateKeys = SereniX.KeyboardEvents.getCombinedKeys(o.nextStateKeys);
            el.prevStateKeys = SereniX.KeyboardEvents.getCombinedKeys(o.prevStateKeys);
        } else {
            states = getStates.apply(null, args);
            colored = false;
            el = newEl('span');
            o = {};
            stateType = 'full-background';
        }
        el.__$$values$$__ = [];
        el.__disabled_ = toBool(o.disabled);
        el.__editable_ = isUndef(o.editable) ? 
                    (isUndef(o.readonly) ? 
                    (isUndef(o.readOnly) ? true : !toBool(o.readOnly)) : 
                    !toBool(o.readonly)) : 
                    toBool(o.editable);
        if (states.length !== 3) {
            throw Error('Incorrect number of states: ' + states.length);
        }
        states.forEach(function(s) {
            el.__$$values$$__.push(s.value);
        });
        var i, initialIndex;
        var display, sTag;
        var styleClass = unboxVal(o.styleClass);
        var borderRadius = length(unboxVal(o.borderRadius||o.radius));
        var stateWidth = length(unboxVal(o.stateWidth||o.stateSize||o.size||o.width||o.height));
        var stateBorderWidth = length(unboxVal(o.stateBorderWidth||o.borderWidth));
        var statePadding = length(unboxVal(o.statePadding))||'2px';
        var addBorderSelectionState;
        
        
        
        
        el._val = (i = initialIndex = el.__$$values$$__.indexOf(initialValue)) < 0 ? states[i = initialIndex = 0].value : initialValue;
        if (o.selectionColor)
            el.selectionColor = o.selectionColor;
        
        if (colored) {
            addCssClass(el, 'SereniX-tristate color');
            el.style.backgroundColor = states[i].color;
            addEvt('click', el, switchColor);
            addEvt('keydown', el, onColorKey);
            singleStateElt = true;
            if (!styleClass || stateWidth)
                CSSBoxModel.fullSize(el, stateWidth||21, stateWidth||21);
            el.setAttribute('tabindex', '0');
        } else if (toggle) {
            orientation = o.orientation||o.direction||o.dir||'horizontal';
            addCssClass(el, 'SereniX-tristate switch toggle');
            el.toggle = true;
            el.__isOptions__ = !!o.options;
            if (!o.options)
                el.setAttribute('tabindex', '0');
            if (/^(?:v(?:ertical)?|2)$/i.test(orientation) 
                    || (orientation === 2)) {
                display = 'block';
                sTag = 'div';
            } else {
                display = 'inline-block';
                sTag = 'div';
            }
            if (states[0].color) {
                setToggleColoredStates();
            } else {
                states.forEach(function(s) {
                    var sEl = newEl(sTag);

                    el.appendChild(sEl);
                });
            }
        } else {
            i = states[i].icon;
            el.appendChild(i = createImg(i));
            el.__$$img$$__ = i;

            addCssClass(el, 'SereniX-tristate checkbox');
            CSSBoxModel.fullSize(el, stateWidth||(stateWidth = 21), stateWidth);
            var s = CSSBoxModel.size(el);
            
            CSSBoxModel.fullSize(i, s.width, s.height);
            addEvt('click', el, onswitch);
            addEvt('keydown', el, onKey);
            singleStateElt = true;
            el.checkbox = true;
            el.setAttribute('tabindex', '0');
        }
        
        if (typeof styleClass === 'string' && styleClass) {
            addCssClass(el, styleClass);
        }
        
        if (!el.parentElement) {
            appendTo(el, container);
        }
        
        
        /**
         * 
         * @returns {type}
         */
        el.getValue = function() {
            return this._val;
        };
        /**
         * 
         * @param {type} val
         * @returns {HTMLElement}
         */
        el.setValue = function(val) {
            if (this.__$$values$$__.indexOf(val = unboxVal(val)) < 0) {
                throw new Error('Incorrect value: ' + val);
            }
            this._val = val;
            return this;
        };
        /**
         * 
         * @param {type} val
         * @returns {Boolean}
         */
        el.is = function(val) {
            return this._val === val;
        };
        el.getOwner = function() {
            return this.__owner_;
        };
        el.setOwner = function(o) {
            if (!isPlainObj(o)) {
                throw new Error('Incorrect argument');
            }
            this.__owner_ = o;
            return this;
        };
        /**
         * 
         * @param {Boolean} editable
         * @returns {HTMLElement}
         */
        el.setEditable = function(editable) {
            this.__editable_ = typeof editable === 'undefined' || editable === null ? true : toBool(editable);
            return this;
        };
        /**
         * 
         * @returns {Boolean}
         */
        el.isEditable = function() {
            return this.owner ? (isUndef(this.owner.editable) ? true : 
                    toBool(this.owner.editable) ? true : this.__editable_) : 
                    this.__editable_;
        };
        /**
         * 
         * @param {Boolean} readOnly
         * @returns {HTMLElement}
         */
        el.setReadOnly = function(readOnly) {
            this.__editable_ = !(typeof readOnly === 'undefined' || readOnly === null ? true : toBool(readOnly));
            return this;
        };
        /**
         * 
         * @returns {Boolean}
         */
        el.isReadOnly = function() {
            return !this.isEditable();
        };
        /**
         * 
         * @param {Boolean} disabled
         * @returns {HTMLElement}
         */
        el.setDisabled =  function(disabled) {
            var i, n, selectedIndex, states;
            if ((disabled = typeof disabled === undefined || disabled === null ? true : toBool(disabled))) {
                addCssClass(this, 'disabled');
                if (this.__isOptions__) {
                    for (i = 0, n = (states = this.children).length; i < n; i++) {
                        states[i].removeAttribute('tabindex');
                    }
                } else {
                    this.removeAttribute('tabindex');
                }
            } else {
                removeClass(this, 'disabled');
                if (this.__isOptions__) {
                    selectedIndex = this.__$$values$$__.indexOf(this._val);
                    for (i = 0, n = (states = this.children).length; i < n; i++) {
                        states[i].setAttribute('tabindex', i === selectedIndex ? '0' : '-1');
                    }
                } else {
                    this.setAttribute('tabindex', '0');
                }
            }
            this.__disabled_ = disabled;            
            return this;
        };
        /**
         * 
         * @returns {Boolean}
         */
        el.isDisabled =  function() {
            return this.__disabled_;
        };
        
        el.disable =  function(disabled) {
            if (arguments.length) {
                return this.setDisabled(disabled);
            }
            return this.isDisabled();
        };
        /**
         * 
         * @param {Function} fn
         * @returns {HTMLElement}
         */
        el.removeChangeListener = function(fn) {
            var lsnrs, i;
            if (isArray(lsnrs = this.__changeLsnrs__)) {
                i = lsnrs.indexOf(fn);
                if (i >= 0)
                    lsnrs.splice(i, 1);
            }
            return this;
        };
        /**
         * 
         * @param {Function} fn
         * @returns {HTMLElement}
         */
        el.addChangeListener = function(fn) {
            (this.__changeLsnrs__||(this.__changeLsnrs__ = [])).push(fn);
            return this;
        };
        
        el.__fireChange = function(ev, target) {
            if (!isArray(this.__changeLsnrs__))
                return;
            if (!target) {
                target = this;
            }
            this.__changeLsnrs__.forEach(function(fn) {
                fn.call(target, ev);
            });
        };
        function set (v) {
            return this;
        }
        states.forEach(function(s){
            var name = s.name||('' + s.value);
            function get() {
                return get.value === this._val;
            }
            get.value = s.value;
            Object.defineProperty(el, name,  { 
                name: name,
                get: get,
                set: set
            });
        });
        /**
         * Augmented property to HTMLElement object that represents a tristate created by the method SereniX.ui.createTriState.
         * @property {type} value The value of the state
         */
        /**
         * Augmented property to HTMLElement object that represents a tristate created by the method SereniX.ui.createTriState.
         * @property {Boolean} editable Tristate HTMLElement object editable property
         */
        /**
         * Augmented property to HTMLElement object that represents a tristate created by the method SereniX.ui.createTriState.
         * @property {Boolean} readOnly Tristate HTMLElement object read only property. It's the dual of editable property
         */
        /**
         * Augmented property to HTMLElement object that represents a tristate created by the method SereniX.ui.createTriState.
         * @property {Boolean} readonly Tristate HTMLElement object read only property. It's the alias of readOnly property
         */
        /**
         * Augmented property to HTMLElement object that represents a tristate created by the method SereniX.ui.createTriState.
         * @property {Boolean} disabled Tristate HTMLElement object disabled property.
         */
        Object.defineProperties(el, { 
            value: {
                name: 'value',
                get: el.getValue,
                set: el.setValue,
                enumerable: true,
                configurable: false
            },
            owner: {
                name: 'owner',
                get: el.getOwner,
                set: el.setOwner,
                enumerable: true,
                configurable: false
            },
            editable: {
                name: 'editable',
                get: el.isEditable,
                set: el.setEditable,
                enumerable: true,
                configurable: false
            },
            readOnly: {
                name: 'readOnly',
                get: el.isReadOnly,
                set: el.setReadOnly,
                enumerable: true,
                configurable: false
            },
            readonly: {
                name: 'readonly',
                alias: 'readOnly',
                get: el.isReadOnly,
                set: el.setReadOnly,
                enumerable: true,
                configurable: false
            },
            disabled: {
                name: 'disabled',
                get: el.isDisabled,
                set: el.setDisabled,
                enumerable: true,
                configurable: false
            }
        });        
        
        addCssClass(el, 'SereniX-tristate');
        el.states = states;
        return el;
    }
    
    var ts = createTriState;
    
    ts.getStates = getStates;
    
    ts.__FUNCTION__ = createTriState;
    
    ts.__FUNCTION_NAME__ = 'createTriState';
    
    createTristate = createTriState;
    
    if (typeof ui.addChild === 'function') {
        ui.addChild(ts);
    } else {
        ui.createTriState = ts;
    }
    ui.createTristate = ts;
    ui.tristate = ts;
    ui.ts = ts;
    
    ts.statusColorsList = statusColorsList;
    
    ts.statusColors = statusColors;
    
    ts.statusValues = statusValues;
    
    ts.statusLabels = statusLabels;
    
    ts.defaultPriorityColors = defaultPriorityColors;
    
    ts.defaultPriorityColorsList = defaultPriorityColorsList;
    
    ts.timeColors = timeColors;
    
    ts.timeColorsList = timeColorsList;
    
    ts.times = times;
    
    ts.deadlineColors = deadlineColors;
    
    ts.deadlineColorsList = deadlineColorsList;
    
    ts.deadlines = deadlines;
    
    ts.tristatesCheckboxes = tristatesCheckboxes;
    
    ts.ynnIcons = ynnCheckboxes;
    
    ts.ynnValues = ynnValues;
    
    ts.ynnCheckboxes = ynnCheckboxes;
    
    ts.yesNoNeutralIcons = ynnCheckboxes;
    
    ts.yesNoNeutralValues = ynnValues;
    
    ts.yesNoNeutralLabels = ynnLabels;
    
    ts.yesNoMaybeValues = yesNoMaybeValues;
    
    ts.yesNoMaybeLabels = yesNoMaybeLabels;
    
    ts.yesNoNeutralCheckboxes = ynnCheckboxes;
    
    ts.yesNoNeutralColors = yesNoNeutralColors;
    
    ts.yesNoNeutralValues = yesNoNeutralValues;
    
    ts.pendingValidInvalidValues = pendingValidInvalidValues;
    
    ts.pendingValidInvalidNames = pendingValidInvalidValues;
    
    ts.pendingValidInvalidLabels = pendingValidInvalidLabels;
    
    ts.pendingValidInvalidIcons = pendingValidInvalidIcons;
    
    ts.getSVG = getSVG;
    
    ts.__AUTHOR__ = 'Marc KAMGA Olivier';
    ts.__CREATOR__ = 'Marc KAMGA Olivier<kamga_marco@yahoo.com;mkamga.olivier@gmail.com>';
    ts.__SINCE__ = '2022';
    ts.__VERSION__ = '1.0';

    return ts;

})();