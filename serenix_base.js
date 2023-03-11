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

 if (typeof inBrowser === 'undefined') {
     /**
     * 
     * @type Object
     */
    inBrowser = typeof window !== 'undefined';
}

if (typeof globalNS === 'undefined') {
    /**
     * 
     * @type Object
     */
    globalNS = typeof window !== undefined ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this;
}

/**
 * Returns true if the argument is an array. Otherwise, returns false
 * @param {type} o
 * @returns {Boolean}
 */
globalNS.isArray = function isArray(o) {
    return Array.isArray(o);
};

if (!Array.prototype.contains) {
    Array.prototype.contains = function(o) {
        return this.indexOf(o) >= 0;
    };
}

// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn /*, thisp */ ) {
        if (this === void 0 || this === null) {
            throw TypeError();
        }
 
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fn !== "function") {
            throw TypeError();
        }
 
        var thisp = arguments[1],
            i;
        for (i = 0; i < len; i++) {
            if (i in t) {
                fn.call(thisp, t[i], i, t);
            }
        }
    };
}
/**
 * 
 * @param {type} o
 * @returns {Boolean}
 */
globalNS.isPlainObj = function isPlainObj(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
};
/**
 * 
 * @alias isPlainObj
 * @param {type} o
 * @returns {Boolean}
 */
globalNS.isPlainObject = globalNS.isPlainObj;
/**
 * 
 * @param {type} obj
 * @returns {HTMLElement|Boolean}
 */
globalNS.isDOMElt = function isDOMElt(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  }
  catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have (works on IE7)
    return (typeof obj==="object") &&
      (obj.nodeType===1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument ==="object");
  }
};
/**
 * 
 * @param {HTMLElement} e
 * @param {String} [fl]
 * @returns {HTMLElement|String}
 */
globalNS.cssFloat = function(e, fl) {
    var len = arguments.length, s;
    if (!e.style || typeof e.setAttribute !== 'function' || 
            (e.modeName||e.tagName).toLowerCase() === 'style'){
        if (len === 1)
            return e.cssFloat||e.styleFloat||'';
        e.cssFloat = e.styleFloat = fl;
    } else {
        if (len === 1) {
            s = cssStyle(e);
            return s.cssFloat||e.style.styleFloat||'';
        }
        e.style.cssFloat = e.style.styleFloat = fl;
        e.style.setAttribute("float", fl);
    }
    return e;
};
/**
 * Converts value instance of String, Number, Boolean or Function to it's 
 * primitive type value and keep other value the same.
 * @param {String|Number|Boolean|Function|Array|Object} val
 * @returns {unresolved}
 */
globalNS.unboxVal = function(val) {
    return val instanceof String || val instanceof Number 
            || val instanceof Boolean || val instanceof Function ? 
            val.valueOf() : val;
};
/**
 * 
 * @param {type} obj
 * @returns {HTMLElement|Boolean}
 */
var isElement = isDOMElt;
/**
 * 
 * @type Boolean
 */
globalNS.hasTouchEvents = document.documentElement ? "ontouchstart" in document.documentElement : false;
/**
 * Defines/Creates a global variable in nodejs, umd or browser.
 * @param {String} name The name of the variable to create
 * @param {Object|Array|Function|Number|String} val  The value to set to the created global variable
 */
globalNS.defineGlobal = function(name, val) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = (function () { return val; })();
    } else if (typeof define === 'function' && define.amd) {
        define([name], function () { return val; });
    } else {
        window[name] = val;
    }
};

if (typeof SereniX === 'undefined') {
    defineGlobal('SereniX', {});
}

SereniX.defineGlobal = defineGlobal;
defineGlobal('gdefine', defineGlobal);
defineGlobal('globalDefine', defineGlobal);

SereniX.gdefine = defineGlobal;

SereniX.globalDefine = defineGlobal;

/**
 * Returns the full name of the class or of the class of the given object
 * @param {Function|Object} o
 * @return {String}
 */
globalNS.getFullClassName = function(o) {
    if (o === undefined) {
        return "undefined";
    } else if (o === null) {
        return "null";
    } else {
        var cls = o.__CLASS__;
        if  (typeof cls === 'function') {
            if (cls.__FULL_NAME__)
                return cls.__FULL_NAME__;
            if (cls.__FULL_CLASS_NAME__)
                return cls.__FULL_CLASS_NAME__;
            if (cls.__CLASS_FULL_NAME__)
                return cls.__CLASS_FULL_NAME__;
            if (typeof cls.getFullClassName === 'function')
                cls.getFullClassName();
            if (typeof cls.getClassFullName === 'function')
                cls.getClassFullName();
            if (typeof cls.getFullName === 'function')
                cls.getFullName();
            var ns = cls.__NAMESPACE_NAME__||cls.__NAMESPACE__||"";
            if (ns) {
                ns += ".";
            }
            return ns + (cls.__CLASS_NAME__ ? cls.__CLASS_NAME__ : cls.__NAME__||cls.NAME||cls.name);
        } else {
            return o.constructor.name;
        }
    }
};
/**
 * 
 * @param {Object} obj
 * @returns {String}
 */
globalNS.getNativeClass = function(obj) {
  if (typeof obj === "undefined") return "undefined";
  if (obj === null) return "null";
  return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
};
/**
 * 
 * @param {type} own
 * @param {type} al
 * @returns {undefined}
 */
globalNS.setShowAlert=function setAlert(own , al) {
    if (al instanceof String)
        al = al.valueOf();
    if (typeof al === 'function' || al instanceof Function) {
        own.showAlert = al;
    } else if (isPlainObj(al)) {
        if (typeof al.show === 'function') {
            function _showAlert(msg) {
                _showAlert._alerter.show(msg||"");
            }
            _showAlert._alerter = al;
            own.showAlert = _showAlert;
        } else if (typeof al.info === 'function') {
            function _showAlert(msg) {
                _showAlert._alerter.info(msg||"");
            }
            _showAlert._alerter = al;
            own.showAlert = _showAlert;
        } else if (typeof al.alert === 'function') {
            function _showAlert(msg) {
                _showAlert._alerter.alert(msg||"");
            }
            _showAlert._alerter = al;
            own.showAlert = _showAlert;
        } else if (typeof al.display === 'function') {
            function _showAlert(msg) {
                _showAlert._alerter.display(msg||"");
            }
            _showAlert._alerter = al;
            own.showAlert = _showAlert;
        } else if (typeof al.showDialog === 'function') {
            function _showAlert(msg) {
                _showAlert._alerter.showDialog(msg||"");
            }
            _showAlert._alerter = al;
            own.showAlert = _showAlert;
        } else if (typeof al.showInfo === 'function') {
            function _showAlert(msg) {
                _showAlert._alerter.showInfo(msg||"");
            }
            _showAlert._alerter = al;
            own.showAlert = _showAlert;
        } else {
            throw new Error("Incorrect alerter");
        }
    } else if (typeof al === 'string') {
        
    } else if (isDOMElt(al)) {
        function _showAlert(msg) {
            _showAlert.alertPane.innerHTML = escapeHTML(msg||"");
        }
        _showAlert.alertPane = al;
        own.showAlert = _showAlert;
        own.__$$alertPane$$__= al;
    }
};

/**
 * Adds click event listener and keydown event listener to the given element.
 * @param {HTMLElement} el  The element on wich the event listeners are added/binded.
 * @param {Function} action  The function to call/fire
 * @param {int} [which=13] Specify the key on which the action is fired. The default value is enter key (13).
 * @return {HTMLElement}
 */
globalNS.setElementAction = function setAction(el, action, which) {
    if (!which)
        which = 13;
    function onClick(ev) {
        ev = ev||window.event;
        onKeydown.action.call(this, ev);
        preventDefault(ev);
    }
    onClick.action = action;
    function onKeydown(ev) {
        var which;
        ev = ev||window.event;
        which = ev.which;
        if (which == undefined)
            which = ev.keyCode;
        if (which === onKeydown.which) {
            onKeydown.action.call(this, ev);
            preventDefault(ev);
        }
    }
    onKeydown.which = which;
    onKeydown.action = action;
    addEvt('click', el, onClick);
    addEvt('keydown', el, onKeydown);
    
    el.__$$action$$__ =  action;
    el.__$$onClick$$__ = onClick;
    el.__$$onKeydown$$__ = onKeydown;
    return el;
};

/**
 * Removes the action binded to the given element
 * @param {HTMLElement} el
 * @return {Function}  The action that was bined
 */
globalNS.removeElementAction = function(el) {
    if (el.__$$onClick$$__) removeEvt('click', el, el.__$$onClick$$__);
    if (el.__$$onKeydown$$__) removeEvt('keydown', el, el.__$$onKeydown$$__);
    return el.__$$action$$__;
};

globalNS.bindAction = globalNS.setElementAction;

globalNS.setEltAction = globalNS.setElementAction;

globalNS.setOnAction = globalNS.setElementAction;

globalNS.setOnAct = globalNS.setElementAction;

globalNS.bindAction = globalNS.setElementAction;

globalNS.unbindAction = globalNS.removeElementAction;

/**
 * 
 * @param {Object} o The object to clone
 * @param {Object} [cloned]  <p>When cloned argument is not specified, a plain
 *      object is created and the created object returned. 
 *      The fields/properties and methods of the object to clone are copied to 
 *      created object.</p>
 *      <p>When cloned object (argument) is specified, fields/properties and 
 *      methods of the object are copied to cloned object.</p>
 * @returns {Object}
 */
globalNS.cloneObj = function(o, cloned) {
    cloned = cloned||{ objects : [], clones: []};
    var ndx = cloned.objects.indexOf(o);
    if (ndx >= 0)
        return cloned.clones[ndx];
    if (isArray(o)) {
        var _v = [];
        cloned.objects.push(o);
        cloned.clones.push(_v);
        o.forEach(function(e) {
            _v.push(cloneObj(e, cloned));
        });
        return _v;
    }
    if (!isPlainObj(o)) return o;
    var Cls = typeof o.__CLASS__ === 'function' ? o.__CLASS__ : undefined;
    var _o = Cls ? new Cls() : {}, v, _v, 
        prop, 
        props = o.__definedProperties__;
        
    cloned.objects.push(o);
    cloned.clones.push(_o);
    if (Cls && props) {
        if (isPlainObj(props)) {
            for (var _pname in props) {
                prop = props[_pname];
                if (!prop.property || !prop.property.formula) {
                    _v = o[_pname];
                    if (_v !== undefined) {
                        _o[_pname] = cloneObj(_v, cloned);
                    }
                }
            }
        } else if (isArray(props)) {
            props.forEach(function(p) {
                var n;
                if (!p.property || !p.property.formula) {
                    _v = o[n = p.name||p.property.name];
                    if (_v !== undefined) {
                        _o[n] = cloneObj(_v, cloned);
                    }
                }
            });
        }
    } else {
        for (var n in o) {
            if (n[0] !== '_') {
                try {
                    _v = o[n];
                    if (_v !== undefined) {
                        _o[n] = cloneObj(_v, cloned);
                    }
                } catch (e) {
                    throw e;
                }
            }
        }
    }
    return _o;
};

globalNS.toBool = (function() {

    /**
     * 
     * @type Array&lt;String&gt;
     */
    var TRUE_VALUES = ['true', '1', 'on', 'yes', 'y', 't', 'oui', 'ok', 'o'];
    /**
     * 
     * @type Array&lt;String&gt;
     */
    var FALSE_VALUES = ['false', '0', 'off', 'no', 'n', 'f', 'non', 'ko', 'nok'];
    /**
     * 
     * @param {type} b
     * @returns {Boolean}
     */
    function toBool(b) {
        if (b === null || b === '' || b === undefined) {
            if (arguments.length > 1) {
                var defVal = arguments[1];
                if (typeof defVal === 'boolean') {
                    return defVal;
                }
                if (typeof defVal === 'string') {
                    defVal = defVal.toLowerCase();
                    if (TRUE_VALUES.indexOf(defVal) >= 0) {
                        return true;
                    }
                    if (FALSE_VALUES.indexOf(defVal) >= 0) {
                        return false;
                    }
                }
            }
            return false;
        }
        var type = typeof b;
        if (type === 'boolean') {
            return b;
        }
        if (type === 'number' ) {
            return b === 0 ? false : true;
        }
        if (type === 'undefined') {
            return false;
        }
        if (type !== 'string' ) {
            throw "Incorrect argument";
        }
        var s = b.toLowerCase();
        if (TRUE_VALUES.indexOf(s) >= 0) {
            return true;
        }
        if (FALSE_VALUES.indexOf(s) >= 0) {
            return false;
        }
    }

    toBool.TRUE_VALUES = TRUE_VALUES;

    toBool.FALSE_VALUES = FALSE_VALUES;

    return toBool;

})();