var fabric = fabric || {
    version: "1.6.0-rc.1"
};

if (typeof exports !== "undefined") {
    exports.fabric = fabric;
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
    fabric.document = document;
    fabric.window = window;
    window.fabric = fabric;
} else {
    fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>");
    if (fabric.document.createWindow) {
        fabric.window = fabric.document.createWindow();
    } else {
        fabric.window = fabric.document.parentWindow;
    }
}

fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement;

fabric.isLikelyNode = typeof Buffer !== "undefined" && typeof window === "undefined";

fabric.SHARED_ATTRIBUTES = [ "display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id" ];

fabric.DPI = 96;

fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)";

fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1;

if (typeof JSON !== "object") {
    JSON = {};
}

(function() {
    "use strict";
    function f(n) {
        return n < 10 ? "0" + n : n;
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf();
        };
    }
    var cx, escapable, gap, indent, meta, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
          case "string":
            return quote(value);

          case "number":
            return isFinite(value) ? String(value) : "null";

          case "boolean":
          case "null":
            return String(value);

          case "object":
            if (!value) {
                return "null";
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }
                v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }
            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }
    if (typeof JSON.stringify !== "function") {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        };
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
            } else if (typeof space === "string") {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }
            return str("", {
                "": value
            });
        };
    }
    if (typeof JSON.parse !== "function") {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function(text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j;
            }
            throw new SyntaxError("JSON.parse");
        };
    }
})();

if (typeof eventjs === "undefined") var eventjs = {};

(function(root) {
    "use strict";
    root.modifyEventListener = false;
    root.modifySelectors = false;
    root.configure = function(conf) {
        if (isFinite(conf.modifyEventListener)) root.modifyEventListener = conf.modifyEventListener;
        if (isFinite(conf.modifySelectors)) root.modifySelectors = conf.modifySelectors;
        if (eventListenersAgumented === false && root.modifyEventListener) {
            augmentEventListeners();
        }
        if (selectorsAugmented === false && root.modifySelectors) {
            augmentSelectors();
        }
    };
    root.add = function(target, type, listener, configure) {
        return eventManager(target, type, listener, configure, "add");
    };
    root.remove = function(target, type, listener, configure) {
        return eventManager(target, type, listener, configure, "remove");
    };
    root.returnFalse = function(event) {
        return false;
    };
    root.stop = function(event) {
        if (!event) return;
        if (event.stopPropagation) event.stopPropagation();
        event.cancelBubble = true;
        event.cancelBubbleCount = 0;
    };
    root.prevent = function(event) {
        if (!event) return;
        if (event.preventDefault) {
            event.preventDefault();
        } else if (event.preventManipulation) {
            event.preventManipulation();
        } else {
            event.returnValue = false;
        }
    };
    root.cancel = function(event) {
        root.stop(event);
        root.prevent(event);
    };
    root.blur = function() {
        var node = document.activeElement;
        if (!node) return;
        var nodeName = document.activeElement.nodeName;
        if (nodeName === "INPUT" || nodeName === "TEXTAREA" || node.contentEditable === "true") {
            if (node.blur) node.blur();
        }
    };
    root.getEventSupport = function(target, type) {
        if (typeof target === "string") {
            type = target;
            target = window;
        }
        type = "on" + type;
        if (type in target) return true;
        if (!target.setAttribute) target = document.createElement("div");
        if (target.setAttribute && target.removeAttribute) {
            target.setAttribute(type, "");
            var isSupported = typeof target[type] === "function";
            if (typeof target[type] !== "undefined") target[type] = null;
            target.removeAttribute(type);
            return isSupported;
        }
    };
    var clone = function(obj) {
        if (!obj || typeof obj !== "object") return obj;
        var temp = new obj.constructor();
        for (var key in obj) {
            if (!obj[key] || typeof obj[key] !== "object") {
                temp[key] = obj[key];
            } else {
                temp[key] = clone(obj[key]);
            }
        }
        return temp;
    };
    var eventManager = function(target, type, listener, configure, trigger, fromOverwrite) {
        configure = configure || {};
        if (String(target) === "[object Object]") {
            var data = target;
            target = data.target;
            delete data.target;
            if (data.type && data.listener) {
                type = data.type;
                delete data.type;
                listener = data.listener;
                delete data.listener;
                for (var key in data) {
                    configure[key] = data[key];
                }
            } else {
                for (var param in data) {
                    var value = data[param];
                    if (typeof value === "function") continue;
                    configure[param] = value;
                }
                var ret = {};
                for (var key in data) {
                    var param = key.split(",");
                    var o = data[key];
                    var conf = {};
                    for (var k in configure) {
                        conf[k] = configure[k];
                    }
                    if (typeof o === "function") {
                        var listener = o;
                    } else if (typeof o.listener === "function") {
                        var listener = o.listener;
                        for (var k in o) {
                            if (typeof o[k] === "function") continue;
                            conf[k] = o[k];
                        }
                    } else {
                        continue;
                    }
                    for (var n = 0; n < param.length; n++) {
                        ret[key] = eventjs.add(target, param[n], listener, conf, trigger);
                    }
                }
                return ret;
            }
        }
        if (!target || !type || !listener) return;
        if (typeof target === "string" && type === "ready") {
            if (window.eventjs_stallOnReady) {
                type = "load";
                target = window;
            } else {
                var time = new Date().getTime();
                var timeout = configure.timeout;
                var ms = configure.interval || 1e3 / 60;
                var interval = window.setInterval(function() {
                    if (new Date().getTime() - time > timeout) {
                        window.clearInterval(interval);
                    }
                    if (document.querySelector(target)) {
                        window.clearInterval(interval);
                        setTimeout(listener, 1);
                    }
                }, ms);
                return;
            }
        }
        if (typeof target === "string") {
            target = document.querySelectorAll(target);
            if (target.length === 0) return createError("Missing target on listener!", arguments);
            if (target.length === 1) {
                target = target[0];
            }
        }
        var event;
        var events = {};
        if (target.length > 0 && target !== window) {
            for (var n0 = 0, length0 = target.length; n0 < length0; n0++) {
                event = eventManager(target[n0], type, listener, clone(configure), trigger);
                if (event) events[n0] = event;
            }
            return createBatchCommands(events);
        }
        if (typeof type === "string") {
            type = type.toLowerCase();
            if (type.indexOf(" ") !== -1) {
                type = type.split(" ");
            } else if (type.indexOf(",") !== -1) {
                type = type.split(",");
            }
        }
        if (typeof type !== "string") {
            if (typeof type.length === "number") {
                for (var n1 = 0, length1 = type.length; n1 < length1; n1++) {
                    event = eventManager(target, type[n1], listener, clone(configure), trigger);
                    if (event) events[type[n1]] = event;
                }
            } else {
                for (var key in type) {
                    if (typeof type[key] === "function") {
                        event = eventManager(target, key, type[key], clone(configure), trigger);
                    } else {
                        event = eventManager(target, key, type[key].listener, clone(type[key]), trigger);
                    }
                    if (event) events[key] = event;
                }
            }
            return createBatchCommands(events);
        } else if (type.indexOf("on") === 0) {
            type = type.substr(2);
        }
        if (typeof target !== "object") return createError("Target is not defined!", arguments);
        if (typeof listener !== "function") return createError("Listener is not a function!", arguments);
        var useCapture = configure.useCapture || false;
        var id = getID(target) + "." + getID(listener) + "." + (useCapture ? 1 : 0);
        if (root.Gesture && root.Gesture._gestureHandlers[type]) {
            id = type + id;
            if (trigger === "remove") {
                if (!wrappers[id]) return;
                wrappers[id].remove();
                delete wrappers[id];
            } else if (trigger === "add") {
                if (wrappers[id]) {
                    wrappers[id].add();
                    return wrappers[id];
                }
                if (configure.useCall && !root.modifyEventListener) {
                    var tmp = listener;
                    listener = function(event, self) {
                        for (var key in self) event[key] = self[key];
                        return tmp.call(target, event);
                    };
                }
                configure.gesture = type;
                configure.target = target;
                configure.listener = listener;
                configure.fromOverwrite = fromOverwrite;
                wrappers[id] = root.proxy[type](configure);
            }
            return wrappers[id];
        } else {
            var eventList = getEventList(type);
            for (var n = 0, eventId; n < eventList.length; n++) {
                type = eventList[n];
                eventId = type + "." + id;
                if (trigger === "remove") {
                    if (!wrappers[eventId]) continue;
                    target[remove](type, listener, useCapture);
                    delete wrappers[eventId];
                } else if (trigger === "add") {
                    if (wrappers[eventId]) return wrappers[eventId];
                    target[add](type, listener, useCapture);
                    wrappers[eventId] = {
                        id: eventId,
                        type: type,
                        target: target,
                        listener: listener,
                        remove: function() {
                            for (var n = 0; n < eventList.length; n++) {
                                root.remove(target, eventList[n], listener, configure);
                            }
                        }
                    };
                }
            }
            return wrappers[eventId];
        }
    };
    var createBatchCommands = function(events) {
        return {
            remove: function() {
                for (var key in events) {
                    events[key].remove();
                }
            },
            add: function() {
                for (var key in events) {
                    events[key].add();
                }
            }
        };
    };
    var createError = function(message, data) {
        if (typeof console === "undefined") return;
        if (typeof console.error === "undefined") return;
        console.error(message, data);
    };
    var pointerDefs = {
        msPointer: [ "MSPointerDown", "MSPointerMove", "MSPointerUp" ],
        touch: [ "touchstart", "touchmove", "touchend" ],
        mouse: [ "mousedown", "mousemove", "mouseup" ]
    };
    var pointerDetect = {
        MSPointerDown: 0,
        MSPointerMove: 1,
        MSPointerUp: 2,
        touchstart: 0,
        touchmove: 1,
        touchend: 2,
        mousedown: 0,
        mousemove: 1,
        mouseup: 2
    };
    var getEventSupport = function() {
        root.supports = {};
        if (window.navigator.msPointerEnabled) {
            root.supports.msPointer = true;
        }
        if (root.getEventSupport("touchstart")) {
            root.supports.touch = true;
        }
        if (root.getEventSupport("mousedown")) {
            root.supports.mouse = true;
        }
    }();
    var getEventList = function() {
        return function(type) {
            var prefix = document.addEventListener ? "" : "on";
            var idx = pointerDetect[type];
            if (isFinite(idx)) {
                var types = [];
                for (var key in root.supports) {
                    types.push(prefix + pointerDefs[key][idx]);
                }
                return types;
            } else {
                return [ prefix + type ];
            }
        };
    }();
    var wrappers = {};
    var counter = 0;
    var getID = function(object) {
        if (object === window) return "#window";
        if (object === document) return "#document";
        if (!object.uniqueID) object.uniqueID = "e" + counter++;
        return object.uniqueID;
    };
    var add = document.addEventListener ? "addEventListener" : "attachEvent";
    var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";
    root.createPointerEvent = function(event, self, preventRecord) {
        var eventName = self.gesture;
        var target = self.target;
        var pts = event.changedTouches || root.proxy.getCoords(event);
        if (pts.length) {
            var pt = pts[0];
            self.pointers = preventRecord ? [] : pts;
            self.pageX = pt.pageX;
            self.pageY = pt.pageY;
            self.x = self.pageX;
            self.y = self.pageY;
        }
        var newEvent = document.createEvent("Event");
        newEvent.initEvent(eventName, true, true);
        newEvent.originalEvent = event;
        for (var k in self) {
            if (k === "target") continue;
            newEvent[k] = self[k];
        }
        var type = newEvent.type;
        if (root.Gesture && root.Gesture._gestureHandlers[type]) {
            self.oldListener.call(target, newEvent, self, false);
        }
    };
    var eventListenersAgumented = false;
    var augmentEventListeners = function() {
        if (!window.HTMLElement) return;
        var augmentEventListener = function(proto) {
            var recall = function(trigger) {
                var handle = trigger + "EventListener";
                var handler = proto[handle];
                proto[handle] = function(type, listener, useCapture) {
                    if (root.Gesture && root.Gesture._gestureHandlers[type]) {
                        var configure = useCapture;
                        if (typeof useCapture === "object") {
                            configure.useCall = true;
                        } else {
                            configure = {
                                useCall: true,
                                useCapture: useCapture
                            };
                        }
                        eventManager(this, type, listener, configure, trigger, true);
                    } else {
                        var types = getEventList(type);
                        for (var n = 0; n < types.length; n++) {
                            handler.call(this, types[n], listener, useCapture);
                        }
                    }
                };
            };
            recall("add");
            recall("remove");
        };
        if (navigator.userAgent.match(/Firefox/)) {
            augmentEventListener(HTMLDivElement.prototype);
            augmentEventListener(HTMLCanvasElement.prototype);
        } else {
            augmentEventListener(HTMLElement.prototype);
        }
        augmentEventListener(document);
        augmentEventListener(window);
    };
    var selectorsAugmented = false;
    var augmentSelectors = function() {
        var proto = NodeList.prototype;
        proto.removeEventListener = function(type, listener, useCapture) {
            for (var n = 0, length = this.length; n < length; n++) {
                this[n].removeEventListener(type, listener, useCapture);
            }
        };
        proto.addEventListener = function(type, listener, useCapture) {
            for (var n = 0, length = this.length; n < length; n++) {
                this[n].addEventListener(type, listener, useCapture);
            }
        };
    };
    return root;
})(eventjs);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.pointerSetup = function(conf, self) {
        conf.target = conf.target || window;
        conf.doc = conf.target.ownerDocument || conf.target;
        conf.minFingers = conf.minFingers || conf.fingers || 1;
        conf.maxFingers = conf.maxFingers || conf.fingers || Infinity;
        conf.position = conf.position || "relative";
        delete conf.fingers;
        self = self || {};
        self.enabled = true;
        self.gesture = conf.gesture;
        self.target = conf.target;
        self.env = conf.env;
        if (eventjs.modifyEventListener && conf.fromOverwrite) {
            conf.oldListener = conf.listener;
            conf.listener = eventjs.createPointerEvent;
        }
        var fingers = 0;
        var type = self.gesture.indexOf("pointer") === 0 && eventjs.modifyEventListener ? "pointer" : "mouse";
        if (conf.oldListener) self.oldListener = conf.oldListener;
        self.listener = conf.listener;
        self.proxy = function(listener) {
            self.defaultListener = conf.listener;
            conf.listener = listener;
            listener(conf.event, self);
        };
        self.add = function() {
            if (self.enabled === true) return;
            if (conf.onPointerDown) eventjs.add(conf.target, type + "down", conf.onPointerDown);
            if (conf.onPointerMove) eventjs.add(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp) eventjs.add(conf.doc, type + "up", conf.onPointerUp);
            self.enabled = true;
        };
        self.remove = function() {
            if (self.enabled === false) return;
            if (conf.onPointerDown) eventjs.remove(conf.target, type + "down", conf.onPointerDown);
            if (conf.onPointerMove) eventjs.remove(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp) eventjs.remove(conf.doc, type + "up", conf.onPointerUp);
            self.reset();
            self.enabled = false;
        };
        self.pause = function(opt) {
            if (conf.onPointerMove && (!opt || opt.move)) eventjs.remove(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp && (!opt || opt.up)) eventjs.remove(conf.doc, type + "up", conf.onPointerUp);
            fingers = conf.fingers;
            conf.fingers = 0;
        };
        self.resume = function(opt) {
            if (conf.onPointerMove && (!opt || opt.move)) eventjs.add(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp && (!opt || opt.up)) eventjs.add(conf.doc, type + "up", conf.onPointerUp);
            conf.fingers = fingers;
        };
        self.reset = function() {
            conf.tracker = {};
            conf.fingers = 0;
        };
        return self;
    };
    var sp = eventjs.supports;
    eventjs.isMouse = !!sp.mouse;
    eventjs.isMSPointer = !!sp.touch;
    eventjs.isTouch = !!sp.msPointer;
    root.pointerStart = function(event, self, conf) {
        var type = (event.type || "mousedown").toUpperCase();
        if (type.indexOf("MOUSE") === 0) {
            eventjs.isMouse = true;
            eventjs.isTouch = false;
            eventjs.isMSPointer = false;
        } else if (type.indexOf("TOUCH") === 0) {
            eventjs.isMouse = false;
            eventjs.isTouch = true;
            eventjs.isMSPointer = false;
        } else if (type.indexOf("MSPOINTER") === 0) {
            eventjs.isMouse = false;
            eventjs.isTouch = false;
            eventjs.isMSPointer = true;
        }
        var addTouchStart = function(touch, sid) {
            var bbox = conf.bbox;
            var pt = track[sid] = {};
            switch (conf.position) {
              case "absolute":
                pt.offsetX = 0;
                pt.offsetY = 0;
                break;

              case "differenceFromLast":
                pt.offsetX = touch.pageX;
                pt.offsetY = touch.pageY;
                break;

              case "difference":
                pt.offsetX = touch.pageX;
                pt.offsetY = touch.pageY;
                break;

              case "move":
                pt.offsetX = touch.pageX - bbox.x1;
                pt.offsetY = touch.pageY - bbox.y1;
                break;

              default:
                pt.offsetX = bbox.x1 - bbox.scrollLeft;
                pt.offsetY = bbox.y1 - bbox.scrollTop;
                break;
            }
            var x = touch.pageX - pt.offsetX;
            var y = touch.pageY - pt.offsetY;
            pt.rotation = 0;
            pt.scale = 1;
            pt.startTime = pt.moveTime = new Date().getTime();
            pt.move = {
                x: x,
                y: y
            };
            pt.start = {
                x: x,
                y: y
            };
            conf.fingers++;
        };
        conf.event = event;
        if (self.defaultListener) {
            conf.listener = self.defaultListener;
            delete self.defaultListener;
        }
        var isTouchStart = !conf.fingers;
        var track = conf.tracker;
        var touches = event.changedTouches || root.getCoords(event);
        var length = touches.length;
        for (var i = 0; i < length; i++) {
            var touch = touches[i];
            var sid = touch.identifier || Infinity;
            if (conf.fingers) {
                if (conf.fingers >= conf.maxFingers) {
                    var ids = [];
                    for (var sid in conf.tracker) ids.push(sid);
                    self.identifier = ids.join(",");
                    return isTouchStart;
                }
                var fingers = 0;
                for (var rid in track) {
                    if (track[rid].up) {
                        delete track[rid];
                        addTouchStart(touch, sid);
                        conf.cancel = true;
                        break;
                    }
                    fingers++;
                }
                if (track[sid]) continue;
                addTouchStart(touch, sid);
            } else {
                track = conf.tracker = {};
                self.bbox = conf.bbox = root.getBoundingBox(conf.target);
                conf.fingers = 0;
                conf.cancel = false;
                addTouchStart(touch, sid);
            }
        }
        var ids = [];
        for (var sid in conf.tracker) ids.push(sid);
        self.identifier = ids.join(",");
        return isTouchStart;
    };
    root.pointerEnd = function(event, self, conf, onPointerUp) {
        var touches = event.touches || [];
        var length = touches.length;
        var exists = {};
        for (var i = 0; i < length; i++) {
            var touch = touches[i];
            var sid = touch.identifier;
            exists[sid || Infinity] = true;
        }
        for (var sid in conf.tracker) {
            var track = conf.tracker[sid];
            if (exists[sid] || track.up) continue;
            if (onPointerUp) {
                onPointerUp({
                    pageX: track.pageX,
                    pageY: track.pageY,
                    changedTouches: [ {
                        pageX: track.pageX,
                        pageY: track.pageY,
                        identifier: sid === "Infinity" ? Infinity : sid
                    } ]
                }, "up");
            }
            track.up = true;
            conf.fingers--;
        }
        if (conf.fingers !== 0) return false;
        var ids = [];
        conf.gestureFingers = 0;
        for (var sid in conf.tracker) {
            conf.gestureFingers++;
            ids.push(sid);
        }
        self.identifier = ids.join(",");
        return true;
    };
    root.getCoords = function(event) {
        if (typeof event.pageX !== "undefined") {
            root.getCoords = function(event) {
                return Array({
                    type: "mouse",
                    x: event.pageX,
                    y: event.pageY,
                    pageX: event.pageX,
                    pageY: event.pageY,
                    identifier: event.pointerId || Infinity
                });
            };
        } else {
            root.getCoords = function(event) {
                var doc = document.documentElement;
                event = event || window.event;
                return Array({
                    type: "mouse",
                    x: event.clientX + doc.scrollLeft,
                    y: event.clientY + doc.scrollTop,
                    pageX: event.clientX + doc.scrollLeft,
                    pageY: event.clientY + doc.scrollTop,
                    identifier: Infinity
                });
            };
        }
        return root.getCoords(event);
    };
    root.getCoord = function(event) {
        if ("ontouchstart" in window) {
            var pX = 0;
            var pY = 0;
            root.getCoord = function(event) {
                var touches = event.changedTouches;
                if (touches && touches.length) {
                    return {
                        x: pX = touches[0].pageX,
                        y: pY = touches[0].pageY
                    };
                } else {
                    return {
                        x: pX,
                        y: pY
                    };
                }
            };
        } else if (typeof event.pageX !== "undefined" && typeof event.pageY !== "undefined") {
            root.getCoord = function(event) {
                return {
                    x: event.pageX,
                    y: event.pageY
                };
            };
        } else {
            root.getCoord = function(event) {
                var doc = document.documentElement;
                event = event || window.event;
                return {
                    x: event.clientX + doc.scrollLeft,
                    y: event.clientY + doc.scrollTop
                };
            };
        }
        return root.getCoord(event);
    };
    var getPropertyAsFloat = function(o, type) {
        var n = parseFloat(o.getPropertyValue(type), 10);
        return isFinite(n) ? n : 0;
    };
    root.getBoundingBox = function(o) {
        if (o === window || o === document) o = document.body;
        var bbox = {};
        var bcr = o.getBoundingClientRect();
        bbox.width = bcr.width;
        bbox.height = bcr.height;
        bbox.x1 = bcr.left;
        bbox.y1 = bcr.top;
        bbox.scaleX = bcr.width / o.offsetWidth || 1;
        bbox.scaleY = bcr.height / o.offsetHeight || 1;
        bbox.scrollLeft = 0;
        bbox.scrollTop = 0;
        var style = window.getComputedStyle(o);
        var borderBox = style.getPropertyValue("box-sizing") === "border-box";
        if (borderBox === false) {
            var left = getPropertyAsFloat(style, "border-left-width");
            var right = getPropertyAsFloat(style, "border-right-width");
            var bottom = getPropertyAsFloat(style, "border-bottom-width");
            var top = getPropertyAsFloat(style, "border-top-width");
            bbox.border = [ left, right, top, bottom ];
            bbox.x1 += left;
            bbox.y1 += top;
            bbox.width -= right + left;
            bbox.height -= bottom + top;
        }
        bbox.x2 = bbox.x1 + bbox.width;
        bbox.y2 = bbox.y1 + bbox.height;
        var position = style.getPropertyValue("position");
        var tmp = position === "fixed" ? o : o.parentNode;
        while (tmp !== null) {
            if (tmp === document.body) break;
            if (tmp.scrollTop === undefined) break;
            var style = window.getComputedStyle(tmp);
            var position = style.getPropertyValue("position");
            if (position === "absolute") {} else if (position === "fixed") {
                bbox.scrollTop -= tmp.parentNode.scrollTop;
                bbox.scrollLeft -= tmp.parentNode.scrollLeft;
                break;
            } else {
                bbox.scrollLeft += tmp.scrollLeft;
                bbox.scrollTop += tmp.scrollTop;
            }
            tmp = tmp.parentNode;
        }
        bbox.scrollBodyLeft = window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        bbox.scrollBodyTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        bbox.scrollLeft -= bbox.scrollBodyLeft;
        bbox.scrollTop -= bbox.scrollBodyTop;
        return bbox;
    };
    (function() {
        var agent = navigator.userAgent.toLowerCase();
        var mac = agent.indexOf("macintosh") !== -1;
        var metaKeys;
        if (mac && agent.indexOf("khtml") !== -1) {
            metaKeys = {
                91: true,
                93: true
            };
        } else if (mac && agent.indexOf("firefox") !== -1) {
            metaKeys = {
                224: true
            };
        } else {
            metaKeys = {
                17: true
            };
        }
        (root.metaTrackerReset = function() {
            eventjs.fnKey = root.fnKey = false;
            eventjs.metaKey = root.metaKey = false;
            eventjs.escKey = root.escKey = false;
            eventjs.ctrlKey = root.ctrlKey = false;
            eventjs.shiftKey = root.shiftKey = false;
            eventjs.altKey = root.altKey = false;
        })();
        root.metaTracker = function(event) {
            var isKeyDown = event.type === "keydown";
            if (event.keyCode === 27) eventjs.escKey = root.escKey = isKeyDown;
            if (metaKeys[event.keyCode]) eventjs.metaKey = root.metaKey = isKeyDown;
            eventjs.ctrlKey = root.ctrlKey = event.ctrlKey;
            eventjs.shiftKey = root.shiftKey = event.shiftKey;
            eventjs.altKey = root.altKey = event.altKey;
        };
    })();
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

eventjs.MutationObserver = function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var DOMAttrModifiedSupported = !MutationObserver && function() {
        var p = document.createElement("p");
        var flag = false;
        var fn = function() {
            flag = true;
        };
        if (p.addEventListener) {
            p.addEventListener("DOMAttrModified", fn, false);
        } else if (p.attachEvent) {
            p.attachEvent("onDOMAttrModified", fn);
        } else {
            return false;
        }
        p.setAttribute("id", "target");
        return flag;
    }();
    return function(container, callback) {
        if (MutationObserver) {
            var options = {
                subtree: false,
                attributes: true
            };
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(e) {
                    callback.call(e.target, e.attributeName);
                });
            });
            observer.observe(container, options);
        } else if (DOMAttrModifiedSupported) {
            eventjs.add(container, "DOMAttrModified", function(e) {
                callback.call(container, e.attrName);
            });
        } else if ("onpropertychange" in document.body) {
            eventjs.add(container, "propertychange", function(e) {
                callback.call(container, window.event.propertyName);
            });
        }
    };
}();

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.click = function(conf) {
        conf.gesture = conf.gesture || "click";
        conf.maxFingers = conf.maxFingers || conf.fingers || 1;
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                eventjs.add(conf.target, "mouseup", conf.onPointerUp);
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                eventjs.remove(conf.target, "mouseup", conf.onPointerUp);
                var pointers = event.changedTouches || root.getCoords(event);
                var pointer = pointers[0];
                var bbox = conf.bbox;
                var newbbox = root.getBoundingBox(conf.target);
                var y = pointer.pageY - newbbox.scrollBodyTop;
                var x = pointer.pageX - newbbox.scrollBodyLeft;
                if (x > bbox.x1 && y > bbox.y1 && x < bbox.x2 && y < bbox.y2 && bbox.scrollTop === newbbox.scrollTop) {
                    for (var key in conf.tracker) break;
                    var point = conf.tracker[key];
                    self.x = point.start.x;
                    self.y = point.start.y;
                    conf.listener(event, self);
                }
            }
        };
        var self = root.pointerSetup(conf);
        self.state = "click";
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.click = root.click;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.dbltap = root.dblclick = function(conf) {
        conf.gesture = conf.gesture || "dbltap";
        conf.maxFingers = conf.maxFingers || conf.fingers || 1;
        var delay = 700;
        var time0, time1, timeout;
        var pointer0, pointer1;
        conf.onPointerDown = function(event) {
            var pointers = event.changedTouches || root.getCoords(event);
            if (time0 && !time1) {
                pointer1 = pointers[0];
                time1 = new Date().getTime() - time0;
            } else {
                pointer0 = pointers[0];
                time0 = new Date().getTime();
                time1 = 0;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    time0 = 0;
                }, delay);
            }
            if (root.pointerStart(event, self, conf)) {
                eventjs.add(conf.target, "mousemove", conf.onPointerMove).listener(event);
                eventjs.add(conf.target, "mouseup", conf.onPointerUp);
            }
        };
        conf.onPointerMove = function(event) {
            if (time0 && !time1) {
                var pointers = event.changedTouches || root.getCoords(event);
                pointer1 = pointers[0];
            }
            var bbox = conf.bbox;
            var ax = pointer1.pageX - bbox.x1;
            var ay = pointer1.pageY - bbox.y1;
            if (!(ax > 0 && ax < bbox.width && ay > 0 && ay < bbox.height && Math.abs(pointer1.pageX - pointer0.pageX) <= 25 && Math.abs(pointer1.pageY - pointer0.pageY) <= 25)) {
                eventjs.remove(conf.target, "mousemove", conf.onPointerMove);
                clearTimeout(timeout);
                time0 = time1 = 0;
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                eventjs.remove(conf.target, "mousemove", conf.onPointerMove);
                eventjs.remove(conf.target, "mouseup", conf.onPointerUp);
            }
            if (time0 && time1) {
                if (time1 <= delay) {
                    self.state = conf.gesture;
                    for (var key in conf.tracker) break;
                    var point = conf.tracker[key];
                    self.x = point.start.x;
                    self.y = point.start.y;
                    conf.listener(event, self);
                }
                clearTimeout(timeout);
                time0 = time1 = 0;
            }
        };
        var self = root.pointerSetup(conf);
        self.state = "dblclick";
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.dbltap = root.dbltap;
    eventjs.Gesture._gestureHandlers.dblclick = root.dblclick;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.dragElement = function(that, event) {
        root.drag({
            event: event,
            target: that,
            position: "move",
            listener: function(event, self) {
                that.style.left = self.x + "px";
                that.style.top = self.y + "px";
                eventjs.prevent(event);
            }
        });
    };
    root.drag = function(conf) {
        conf.gesture = "drag";
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                if (!conf.monitor) {
                    eventjs.add(conf.doc, "mousemove", conf.onPointerMove);
                    eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
                }
            }
            conf.onPointerMove(event, "down");
        };
        conf.onPointerMove = function(event, state) {
            if (!conf.tracker) return conf.onPointerDown(event);
            var bbox = conf.bbox;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var identifier = touch.identifier || Infinity;
                var pt = conf.tracker[identifier];
                if (!pt) continue;
                pt.pageX = touch.pageX;
                pt.pageY = touch.pageY;
                self.state = state || "move";
                self.identifier = identifier;
                self.start = pt.start;
                self.fingers = conf.fingers;
                if (conf.position === "differenceFromLast") {
                    self.x = pt.pageX - pt.offsetX;
                    self.y = pt.pageY - pt.offsetY;
                    pt.offsetX = pt.pageX;
                    pt.offsetY = pt.pageY;
                } else {
                    self.x = pt.pageX - pt.offsetX;
                    self.y = pt.pageY - pt.offsetY;
                }
                conf.listener(event, self);
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf, conf.onPointerMove)) {
                if (!conf.monitor) {
                    eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                    eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
                }
            }
        };
        var self = root.pointerSetup(conf);
        if (conf.event) {
            conf.onPointerDown(conf.event);
        } else {
            eventjs.add(conf.target, "mousedown", conf.onPointerDown);
            if (conf.monitor) {
                eventjs.add(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
            }
        }
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.drag = root.drag;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    var RAD_DEG = Math.PI / 180;
    var getCentroid = function(self, points) {
        var centroidx = 0;
        var centroidy = 0;
        var length = 0;
        for (var sid in points) {
            var touch = points[sid];
            if (touch.up) continue;
            centroidx += touch.move.x;
            centroidy += touch.move.y;
            length++;
        }
        self.x = centroidx /= length;
        self.y = centroidy /= length;
        return self;
    };
    root.gesture = function(conf) {
        conf.gesture = conf.gesture || "gesture";
        conf.minFingers = conf.minFingers || conf.fingers || 2;
        conf.onPointerDown = function(event) {
            var fingers = conf.fingers;
            if (root.pointerStart(event, self, conf)) {
                eventjs.add(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
            }
            if (conf.fingers === conf.minFingers && fingers !== conf.fingers) {
                self.fingers = conf.minFingers;
                self.scale = 1;
                self.rotation = 0;
                self.state = "start";
                var sids = "";
                for (var key in conf.tracker) sids += key;
                self.identifier = parseInt(sids);
                getCentroid(self, conf.tracker);
                conf.listener(event, self);
            }
        };
        conf.onPointerMove = function(event, state) {
            var bbox = conf.bbox;
            var points = conf.tracker;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var sid = touch.identifier || Infinity;
                var pt = points[sid];
                if (!pt) continue;
                pt.move.x = touch.pageX - bbox.x1;
                pt.move.y = touch.pageY - bbox.y1;
            }
            if (conf.fingers < conf.minFingers) return;
            var touches = [];
            var scale = 0;
            var rotation = 0;
            getCentroid(self, points);
            for (var sid in points) {
                var touch = points[sid];
                if (touch.up) continue;
                var start = touch.start;
                if (!start.distance) {
                    var dx = start.x - self.x;
                    var dy = start.y - self.y;
                    start.distance = Math.sqrt(dx * dx + dy * dy);
                    start.angle = Math.atan2(dx, dy) / RAD_DEG;
                }
                var dx = touch.move.x - self.x;
                var dy = touch.move.y - self.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                scale += distance / start.distance;
                var angle = Math.atan2(dx, dy) / RAD_DEG;
                var rotate = (start.angle - angle + 360) % 360 - 180;
                touch.DEG2 = touch.DEG1;
                touch.DEG1 = rotate > 0 ? rotate : -rotate;
                if (typeof touch.DEG2 !== "undefined") {
                    if (rotate > 0) {
                        touch.rotation += touch.DEG1 - touch.DEG2;
                    } else {
                        touch.rotation -= touch.DEG1 - touch.DEG2;
                    }
                    rotation += touch.rotation;
                }
                touches.push(touch.move);
            }
            self.touches = touches;
            self.fingers = conf.fingers;
            self.scale = scale / conf.fingers;
            self.rotation = rotation / conf.fingers;
            self.state = "change";
            conf.listener(event, self);
        };
        conf.onPointerUp = function(event) {
            var fingers = conf.fingers;
            if (root.pointerEnd(event, self, conf)) {
                eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
            }
            if (fingers === conf.minFingers && conf.fingers < conf.minFingers) {
                self.fingers = conf.fingers;
                self.state = "end";
                conf.listener(event, self);
            }
        };
        var self = root.pointerSetup(conf);
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.gesture = root.gesture;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.pointerdown = root.pointermove = root.pointerup = function(conf) {
        conf.gesture = conf.gesture || "pointer";
        if (conf.target.isPointerEmitter) return;
        var isDown = true;
        conf.onPointerDown = function(event) {
            isDown = false;
            self.gesture = "pointerdown";
            conf.listener(event, self);
        };
        conf.onPointerMove = function(event) {
            self.gesture = "pointermove";
            conf.listener(event, self, isDown);
        };
        conf.onPointerUp = function(event) {
            isDown = true;
            self.gesture = "pointerup";
            conf.listener(event, self, true);
        };
        var self = root.pointerSetup(conf);
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        eventjs.add(conf.target, "mousemove", conf.onPointerMove);
        eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
        conf.target.isPointerEmitter = true;
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.pointerdown = root.pointerdown;
    eventjs.Gesture._gestureHandlers.pointermove = root.pointermove;
    eventjs.Gesture._gestureHandlers.pointerup = root.pointerup;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.shake = function(conf) {
        var self = {
            gesture: "devicemotion",
            acceleration: {},
            accelerationIncludingGravity: {},
            target: conf.target,
            listener: conf.listener,
            remove: function() {
                window.removeEventListener("devicemotion", onDeviceMotion, false);
            }
        };
        var threshold = 4;
        var timeout = 1e3;
        var timeframe = 200;
        var shakes = 3;
        var lastShake = new Date().getTime();
        var gravity = {
            x: 0,
            y: 0,
            z: 0
        };
        var delta = {
            x: {
                count: 0,
                value: 0
            },
            y: {
                count: 0,
                value: 0
            },
            z: {
                count: 0,
                value: 0
            }
        };
        var onDeviceMotion = function(e) {
            var alpha = .8;
            var o = e.accelerationIncludingGravity;
            gravity.x = alpha * gravity.x + (1 - alpha) * o.x;
            gravity.y = alpha * gravity.y + (1 - alpha) * o.y;
            gravity.z = alpha * gravity.z + (1 - alpha) * o.z;
            self.accelerationIncludingGravity = gravity;
            self.acceleration.x = o.x - gravity.x;
            self.acceleration.y = o.y - gravity.y;
            self.acceleration.z = o.z - gravity.z;
            if (conf.gesture === "devicemotion") {
                conf.listener(e, self);
                return;
            }
            var data = "xyz";
            var now = new Date().getTime();
            for (var n = 0, length = data.length; n < length; n++) {
                var letter = data[n];
                var ACCELERATION = self.acceleration[letter];
                var DELTA = delta[letter];
                var abs = Math.abs(ACCELERATION);
                if (now - lastShake < timeout) continue;
                if (abs > threshold) {
                    var idx = now * ACCELERATION / abs;
                    var span = Math.abs(idx + DELTA.value);
                    if (DELTA.value && span < timeframe) {
                        DELTA.value = idx;
                        DELTA.count++;
                        if (DELTA.count === shakes) {
                            conf.listener(e, self);
                            lastShake = now;
                            DELTA.value = 0;
                            DELTA.count = 0;
                        }
                    } else {
                        DELTA.value = idx;
                        DELTA.count = 1;
                    }
                }
            }
        };
        if (!window.addEventListener) return;
        window.addEventListener("devicemotion", onDeviceMotion, false);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.shake = root.shake;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    var RAD_DEG = Math.PI / 180;
    root.swipe = function(conf) {
        conf.snap = conf.snap || 90;
        conf.threshold = conf.threshold || 1;
        conf.gesture = conf.gesture || "swipe";
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                eventjs.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
            }
        };
        conf.onPointerMove = function(event) {
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var sid = touch.identifier || Infinity;
                var o = conf.tracker[sid];
                if (!o) continue;
                o.move.x = touch.pageX;
                o.move.y = touch.pageY;
                o.moveTime = new Date().getTime();
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
                var velocity1;
                var velocity2;
                var degree1;
                var degree2;
                var start = {
                    x: 0,
                    y: 0
                };
                var endx = 0;
                var endy = 0;
                var length = 0;
                for (var sid in conf.tracker) {
                    var touch = conf.tracker[sid];
                    var xdist = touch.move.x - touch.start.x;
                    var ydist = touch.move.y - touch.start.y;
                    endx += touch.move.x;
                    endy += touch.move.y;
                    start.x += touch.start.x;
                    start.y += touch.start.y;
                    length++;
                    var distance = Math.sqrt(xdist * xdist + ydist * ydist);
                    var ms = touch.moveTime - touch.startTime;
                    var degree2 = Math.atan2(xdist, ydist) / RAD_DEG + 180;
                    var velocity2 = ms ? distance / ms : 0;
                    if (typeof degree1 === "undefined") {
                        degree1 = degree2;
                        velocity1 = velocity2;
                    } else if (Math.abs(degree2 - degree1) <= 20) {
                        degree1 = (degree1 + degree2) / 2;
                        velocity1 = (velocity1 + velocity2) / 2;
                    } else {
                        return;
                    }
                }
                var fingers = conf.gestureFingers;
                if (conf.minFingers <= fingers && conf.maxFingers >= fingers) {
                    if (velocity1 > conf.threshold) {
                        start.x /= length;
                        start.y /= length;
                        self.start = start;
                        self.x = endx / length;
                        self.y = endy / length;
                        self.angle = -(((degree1 / conf.snap + .5 >> 0) * conf.snap || 360) - 360);
                        self.velocity = velocity1;
                        self.fingers = fingers;
                        self.state = "swipe";
                        conf.listener(event, self);
                    }
                }
            }
        };
        var self = root.pointerSetup(conf);
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.swipe = root.swipe;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.longpress = function(conf) {
        conf.gesture = "longpress";
        return root.tap(conf);
    };
    root.tap = function(conf) {
        conf.delay = conf.delay || 500;
        conf.timeout = conf.timeout || 250;
        conf.driftDeviance = conf.driftDeviance || 10;
        conf.gesture = conf.gesture || "tap";
        var timestamp, timeout;
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                timestamp = new Date().getTime();
                eventjs.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
                if (conf.gesture !== "longpress") return;
                timeout = setTimeout(function() {
                    if (event.cancelBubble && ++event.cancelBubbleCount > 1) return;
                    var fingers = 0;
                    for (var key in conf.tracker) {
                        var point = conf.tracker[key];
                        if (point.end === true) return;
                        if (conf.cancel) return;
                        fingers++;
                    }
                    if (conf.minFingers <= fingers && conf.maxFingers >= fingers) {
                        self.state = "start";
                        self.fingers = fingers;
                        self.x = point.start.x;
                        self.y = point.start.y;
                        conf.listener(event, self);
                    }
                }, conf.delay);
            }
        };
        conf.onPointerMove = function(event) {
            var bbox = conf.bbox;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var identifier = touch.identifier || Infinity;
                var pt = conf.tracker[identifier];
                if (!pt) continue;
                var x = touch.pageX - bbox.x1;
                var y = touch.pageY - bbox.y1;
                var dx = x - pt.start.x;
                var dy = y - pt.start.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (!(x > 0 && x < bbox.width && y > 0 && y < bbox.height && distance <= conf.driftDeviance)) {
                    eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                    conf.cancel = true;
                    return;
                }
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                clearTimeout(timeout);
                eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
                if (event.cancelBubble && ++event.cancelBubbleCount > 1) return;
                if (conf.gesture === "longpress") {
                    if (self.state === "start") {
                        self.state = "end";
                        conf.listener(event, self);
                    }
                    return;
                }
                if (conf.cancel) return;
                if (new Date().getTime() - timestamp > conf.timeout) return;
                var fingers = conf.gestureFingers;
                if (conf.minFingers <= fingers && conf.maxFingers >= fingers) {
                    self.state = "tap";
                    self.fingers = conf.gestureFingers;
                    conf.listener(event, self);
                }
            }
        };
        var self = root.pointerSetup(conf);
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.tap = root.tap;
    eventjs.Gesture._gestureHandlers.longpress = root.longpress;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.wheelPreventElasticBounce = function(el) {
        if (!el) return;
        if (typeof el === "string") el = document.querySelector(el);
        eventjs.add(el, "wheel", function(event, self) {
            self.preventElasticBounce();
            eventjs.stop(event);
        });
    };
    root.wheel = function(conf) {
        var interval;
        var timeout = conf.timeout || 150;
        var count = 0;
        var self = {
            gesture: "wheel",
            state: "start",
            wheelDelta: 0,
            target: conf.target,
            listener: conf.listener,
            preventElasticBounce: function(event) {
                var target = this.target;
                var scrollTop = target.scrollTop;
                var top = scrollTop + target.offsetHeight;
                var height = target.scrollHeight;
                if (top === height && this.wheelDelta <= 0) eventjs.cancel(event); else if (scrollTop === 0 && this.wheelDelta >= 0) eventjs.cancel(event);
                eventjs.stop(event);
            },
            add: function() {
                conf.target[add](type, onMouseWheel, false);
            },
            remove: function() {
                conf.target[remove](type, onMouseWheel, false);
            }
        };
        var onMouseWheel = function(event) {
            event = event || window.event;
            self.state = count++ ? "change" : "start";
            self.wheelDelta = event.detail ? event.detail * -20 : event.wheelDelta;
            conf.listener(event, self);
            clearTimeout(interval);
            interval = setTimeout(function() {
                count = 0;
                self.state = "end";
                self.wheelDelta = 0;
                conf.listener(event, self);
            }, timeout);
        };
        var add = document.addEventListener ? "addEventListener" : "attachEvent";
        var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";
        var type = eventjs.getEventSupport("mousewheel") ? "mousewheel" : "DOMMouseScroll";
        conf.target[add](type, onMouseWheel, false);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.wheel = root.wheel;
    return root;
}(eventjs.proxy);

if (typeof Event === "undefined") var Event = {};

if (typeof Event.proxy === "undefined") Event.proxy = {};

Event.proxy = function(root) {
    "use strict";
    root.orientation = function(conf) {
        var self = {
            gesture: "orientationchange",
            previous: null,
            current: window.orientation,
            target: conf.target,
            listener: conf.listener,
            remove: function() {
                window.removeEventListener("orientationchange", onOrientationChange, false);
            }
        };
        var onOrientationChange = function(e) {
            self.previous = self.current;
            self.current = window.orientation;
            if (self.previous !== null && self.previous != self.current) {
                conf.listener(e, self);
                return;
            }
        };
        if (window.DeviceOrientationEvent) {
            window.addEventListener("orientationchange", onOrientationChange, false);
        }
        return self;
    };
    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.orientation = root.orientation;
    return root;
}(Event.proxy);

(function() {
    function _removeEventListener(eventName, handler) {
        if (!this.__eventListeners[eventName]) {
            return;
        }
        if (handler) {
            fabric.util.removeFromArray(this.__eventListeners[eventName], handler);
        } else {
            this.__eventListeners[eventName].length = 0;
        }
    }
    function observe(eventName, handler) {
        if (!this.__eventListeners) {
            this.__eventListeners = {};
        }
        if (arguments.length === 1) {
            for (var prop in eventName) {
                this.on(prop, eventName[prop]);
            }
        } else {
            if (!this.__eventListeners[eventName]) {
                this.__eventListeners[eventName] = [];
            }
            this.__eventListeners[eventName].push(handler);
        }
        return this;
    }
    function stopObserving(eventName, handler) {
        if (!this.__eventListeners) {
            return;
        }
        if (arguments.length === 0) {
            this.__eventListeners = {};
        } else if (arguments.length === 1 && typeof arguments[0] === "object") {
            for (var prop in eventName) {
                _removeEventListener.call(this, prop, eventName[prop]);
            }
        } else {
            _removeEventListener.call(this, eventName, handler);
        }
        return this;
    }
    function fire(eventName, options) {
        if (!this.__eventListeners) {
            return;
        }
        var listenersForEvent = this.__eventListeners[eventName];
        if (!listenersForEvent) {
            return;
        }
        for (var i = 0, len = listenersForEvent.length; i < len; i++) {
            listenersForEvent[i].call(this, options || {});
        }
        return this;
    }
    fabric.Observable = {
        observe: observe,
        stopObserving: stopObserving,
        fire: fire,
        on: observe,
        off: stopObserving,
        trigger: fire
    };
})();

fabric.Collection = {
    add: function() {
        this._objects.push.apply(this._objects, arguments);
        for (var i = 0, length = arguments.length; i < length; i++) {
            this._onObjectAdded(arguments[i]);
        }
        this.renderOnAddRemove && this.renderAll();
        return this;
    },
    insertAt: function(object, index, nonSplicing) {
        var objects = this.getObjects();
        if (nonSplicing) {
            objects[index] = object;
        } else {
            objects.splice(index, 0, object);
        }
        this._onObjectAdded(object);
        this.renderOnAddRemove && this.renderAll();
        return this;
    },
    remove: function() {
        var objects = this.getObjects(), index;
        for (var i = 0, length = arguments.length; i < length; i++) {
            index = objects.indexOf(arguments[i]);
            if (index !== -1) {
                objects.splice(index, 1);
                this._onObjectRemoved(arguments[i]);
            }
        }
        this.renderOnAddRemove && this.renderAll();
        return this;
    },
    forEachObject: function(callback, context) {
        var objects = this.getObjects(), i = objects.length;
        while (i--) {
            callback.call(context, objects[i], i, objects);
        }
        return this;
    },
    getObjects: function(type) {
        if (typeof type === "undefined") {
            return this._objects;
        }
        return this._objects.filter(function(o) {
            return o.type === type;
        });
    },
    item: function(index) {
        return this.getObjects()[index];
    },
    isEmpty: function() {
        return this.getObjects().length === 0;
    },
    size: function() {
        return this.getObjects().length;
    },
    contains: function(object) {
        return this.getObjects().indexOf(object) > -1;
    },
    complexity: function() {
        return this.getObjects().reduce(function(memo, current) {
            memo += current.complexity ? current.complexity() : 0;
            return memo;
        }, 0);
    }
};

(function(global) {
    var sqrt = Math.sqrt, atan2 = Math.atan2, PiBy180 = Math.PI / 180;
    fabric.util = {
        removeFromArray: function(array, value) {
            var idx = array.indexOf(value);
            if (idx !== -1) {
                array.splice(idx, 1);
            }
            return array;
        },
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        degreesToRadians: function(degrees) {
            return degrees * PiBy180;
        },
        radiansToDegrees: function(radians) {
            return radians / PiBy180;
        },
        rotatePoint: function(point, origin, radians) {
            point.subtractEquals(origin);
            var sin = Math.sin(radians), cos = Math.cos(radians), rx = point.x * cos - point.y * sin, ry = point.x * sin + point.y * cos;
            return new fabric.Point(rx, ry).addEquals(origin);
        },
        transformPoint: function(p, t, ignoreOffset) {
            if (ignoreOffset) {
                return new fabric.Point(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y);
            }
            return new fabric.Point(t[0] * p.x + t[2] * p.y + t[4], t[1] * p.x + t[3] * p.y + t[5]);
        },
        invertTransform: function(t) {
            var a = 1 / (t[0] * t[3] - t[1] * t[2]), r = [ a * t[3], -a * t[1], -a * t[2], a * t[0] ], o = fabric.util.transformPoint({
                x: t[4],
                y: t[5]
            }, r, true);
            r[4] = -o.x;
            r[5] = -o.y;
            return r;
        },
        toFixed: function(number, fractionDigits) {
            return parseFloat(Number(number).toFixed(fractionDigits));
        },
        parseUnit: function(value, fontSize) {
            var unit = /\D{0,2}$/.exec(value), number = parseFloat(value);
            if (!fontSize) {
                fontSize = fabric.Text.DEFAULT_SVG_FONT_SIZE;
            }
            switch (unit[0]) {
              case "mm":
                return number * fabric.DPI / 25.4;

              case "cm":
                return number * fabric.DPI / 2.54;

              case "in":
                return number * fabric.DPI;

              case "pt":
                return number * fabric.DPI / 72;

              case "pc":
                return number * fabric.DPI / 72 * 12;

              case "em":
                return number * fontSize;

              default:
                return number;
            }
        },
        falseFunction: function() {
            return false;
        },
        getKlass: function(type, namespace) {
            type = fabric.util.string.camelize(type.charAt(0).toUpperCase() + type.slice(1));
            return fabric.util.resolveNamespace(namespace)[type];
        },
        resolveNamespace: function(namespace) {
            if (!namespace) {
                return fabric;
            }
            var parts = namespace.split("."), len = parts.length, obj = global || fabric.window;
            for (var i = 0; i < len; ++i) {
                obj = obj[parts[i]];
            }
            return obj;
        },
        loadImage: function(url, callback, context, crossOrigin) {
            if (!url) {
                callback && callback.call(context, url);
                return;
            }
            var img = fabric.util.createImage();
            img.onload = function() {
                callback && callback.call(context, img);
                img = img.onload = img.onerror = null;
            };
            img.onerror = function() {
                fabric.log("Error loading " + img.src);
                callback && callback.call(context, null, true);
                img = img.onload = img.onerror = null;
            };
            if (url.indexOf("data") !== 0 && typeof crossOrigin !== "undefined") {
                img.crossOrigin = crossOrigin;
            }
            img.src = url;
        },
        enlivenObjects: function(objects, callback, namespace, reviver) {
            objects = objects || [];
            function onLoaded() {
                if (++numLoadedObjects === numTotalObjects) {
                    callback && callback(enlivenedObjects);
                }
            }
            var enlivenedObjects = [], numLoadedObjects = 0, numTotalObjects = objects.length;
            if (!numTotalObjects) {
                callback && callback(enlivenedObjects);
                return;
            }
            objects.forEach(function(o, index) {
                if (!o || !o.type) {
                    onLoaded();
                    return;
                }
                var klass = fabric.util.getKlass(o.type, namespace);
                if (klass.async) {
                    klass.fromObject(o, function(obj, error) {
                        if (!error) {
                            enlivenedObjects[index] = obj;
                            reviver && reviver(o, enlivenedObjects[index]);
                        }
                        onLoaded();
                    });
                } else {
                    enlivenedObjects[index] = klass.fromObject(o);
                    reviver && reviver(o, enlivenedObjects[index]);
                    onLoaded();
                }
            });
        },
        groupSVGElements: function(elements, options, path) {
            var object;
            object = new fabric.PathGroup(elements, options);
            if (typeof path !== "undefined") {
                object.setSourcePath(path);
            }
            return object;
        },
        populateWithProperties: function(source, destination, properties) {
            if (properties && Object.prototype.toString.call(properties) === "[object Array]") {
                for (var i = 0, len = properties.length; i < len; i++) {
                    if (properties[i] in source) {
                        destination[properties[i]] = source[properties[i]];
                    }
                }
            }
        },
        drawDashedLine: function(ctx, x, y, x2, y2, da) {
            var dx = x2 - x, dy = y2 - y, len = sqrt(dx * dx + dy * dy), rot = atan2(dy, dx), dc = da.length, di = 0, draw = true;
            ctx.save();
            ctx.translate(x, y);
            ctx.moveTo(0, 0);
            ctx.rotate(rot);
            x = 0;
            while (len > x) {
                x += da[di++ % dc];
                if (x > len) {
                    x = len;
                }
                ctx[draw ? "lineTo" : "moveTo"](x, 0);
                draw = !draw;
            }
            ctx.restore();
        },
        createCanvasElement: function(canvasEl) {
            canvasEl || (canvasEl = fabric.document.createElement("canvas"));
            if (!canvasEl.getContext && typeof G_vmlCanvasManager !== "undefined") {
                G_vmlCanvasManager.initElement(canvasEl);
            }
            return canvasEl;
        },
        createImage: function() {
            return fabric.isLikelyNode ? new (require("canvas").Image)() : fabric.document.createElement("img");
        },
        createAccessors: function(klass) {
            var proto = klass.prototype;
            for (var i = proto.stateProperties.length; i--; ) {
                var propName = proto.stateProperties[i], capitalizedPropName = propName.charAt(0).toUpperCase() + propName.slice(1), setterName = "set" + capitalizedPropName, getterName = "get" + capitalizedPropName;
                if (!proto[getterName]) {
                    proto[getterName] = function(property) {
                        return new Function('return this.get("' + property + '")');
                    }(propName);
                }
                if (!proto[setterName]) {
                    proto[setterName] = function(property) {
                        return new Function("value", 'return this.set("' + property + '", value)');
                    }(propName);
                }
            }
        },
        clipContext: function(receiver, ctx) {
            ctx.save();
            ctx.beginPath();
            receiver.clipTo(ctx);
            ctx.clip();
        },
        multiplyTransformMatrices: function(a, b) {
            return [ a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5] ];
        },
        getFunctionBody: function(fn) {
            return (String(fn).match(/function[^{]*\{([\s\S]*)\}/) || {})[1];
        },
        isTransparent: function(ctx, x, y, tolerance) {
            if (tolerance > 0) {
                if (x > tolerance) {
                    x -= tolerance;
                } else {
                    x = 0;
                }
                if (y > tolerance) {
                    y -= tolerance;
                } else {
                    y = 0;
                }
            }
            var _isTransparent = true, imageData = ctx.getImageData(x, y, tolerance * 2 || 1, tolerance * 2 || 1);
            for (var i = 3, l = imageData.data.length; i < l; i += 4) {
                var temp = imageData.data[i];
                _isTransparent = temp <= 0;
                if (_isTransparent === false) {
                    break;
                }
            }
            imageData = null;
            return _isTransparent;
        }
    };
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var arcToSegmentsCache = {}, segmentToBezierCache = {}, boundsOfCurveCache = {}, _join = Array.prototype.join;
    function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
        var argsString = _join.call(arguments);
        if (arcToSegmentsCache[argsString]) {
            return arcToSegmentsCache[argsString];
        }
        var PI = Math.PI, th = rotateX * PI / 180, sinTh = Math.sin(th), cosTh = Math.cos(th), fromX = 0, fromY = 0;
        rx = Math.abs(rx);
        ry = Math.abs(ry);
        var px = -cosTh * toX * .5 - sinTh * toY * .5, py = -cosTh * toY * .5 + sinTh * toX * .5, rx2 = rx * rx, ry2 = ry * ry, py2 = py * py, px2 = px * px, pl = rx2 * ry2 - rx2 * py2 - ry2 * px2, root = 0;
        if (pl < 0) {
            var s = Math.sqrt(1 - pl / (rx2 * ry2));
            rx *= s;
            ry *= s;
        } else {
            root = (large === sweep ? -1 : 1) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
        }
        var cx = root * rx * py / ry, cy = -root * ry * px / rx, cx1 = cosTh * cx - sinTh * cy + toX * .5, cy1 = sinTh * cx + cosTh * cy + toY * .5, mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry), dtheta = calcVectorAngle((px - cx) / rx, (py - cy) / ry, (-px - cx) / rx, (-py - cy) / ry);
        if (sweep === 0 && dtheta > 0) {
            dtheta -= 2 * PI;
        } else if (sweep === 1 && dtheta < 0) {
            dtheta += 2 * PI;
        }
        var segments = Math.ceil(Math.abs(dtheta / PI * 2)), result = [], mDelta = dtheta / segments, mT = 8 / 3 * Math.sin(mDelta / 4) * Math.sin(mDelta / 4) / Math.sin(mDelta / 2), th3 = mTheta + mDelta;
        for (var i = 0; i < segments; i++) {
            result[i] = segmentToBezier(mTheta, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY);
            fromX = result[i][4];
            fromY = result[i][5];
            mTheta = th3;
            th3 += mDelta;
        }
        arcToSegmentsCache[argsString] = result;
        return result;
    }
    function segmentToBezier(th2, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) {
        var argsString2 = _join.call(arguments);
        if (segmentToBezierCache[argsString2]) {
            return segmentToBezierCache[argsString2];
        }
        var costh2 = Math.cos(th2), sinth2 = Math.sin(th2), costh3 = Math.cos(th3), sinth3 = Math.sin(th3), toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1, toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1, cp1X = fromX + mT * (-cosTh * rx * sinth2 - sinTh * ry * costh2), cp1Y = fromY + mT * (-sinTh * rx * sinth2 + cosTh * ry * costh2), cp2X = toX + mT * (cosTh * rx * sinth3 + sinTh * ry * costh3), cp2Y = toY + mT * (sinTh * rx * sinth3 - cosTh * ry * costh3);
        segmentToBezierCache[argsString2] = [ cp1X, cp1Y, cp2X, cp2Y, toX, toY ];
        return segmentToBezierCache[argsString2];
    }
    function calcVectorAngle(ux, uy, vx, vy) {
        var ta = Math.atan2(uy, ux), tb = Math.atan2(vy, vx);
        if (tb >= ta) {
            return tb - ta;
        } else {
            return 2 * Math.PI - (ta - tb);
        }
    }
    fabric.util.drawArc = function(ctx, fx, fy, coords) {
        var rx = coords[0], ry = coords[1], rot = coords[2], large = coords[3], sweep = coords[4], tx = coords[5], ty = coords[6], segs = [ [], [], [], [] ], segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);
        for (var i = 0, len = segsNorm.length; i < len; i++) {
            segs[i][0] = segsNorm[i][0] + fx;
            segs[i][1] = segsNorm[i][1] + fy;
            segs[i][2] = segsNorm[i][2] + fx;
            segs[i][3] = segsNorm[i][3] + fy;
            segs[i][4] = segsNorm[i][4] + fx;
            segs[i][5] = segsNorm[i][5] + fy;
            ctx.bezierCurveTo.apply(ctx, segs[i]);
        }
    };
    fabric.util.getBoundsOfArc = function(fx, fy, rx, ry, rot, large, sweep, tx, ty) {
        var fromX = 0, fromY = 0, bound = [], bounds = [], segs = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot), boundCopy = [ [], [] ];
        for (var i = 0, len = segs.length; i < len; i++) {
            bound = getBoundsOfCurve(fromX, fromY, segs[i][0], segs[i][1], segs[i][2], segs[i][3], segs[i][4], segs[i][5]);
            boundCopy[0].x = bound[0].x + fx;
            boundCopy[0].y = bound[0].y + fy;
            boundCopy[1].x = bound[1].x + fx;
            boundCopy[1].y = bound[1].y + fy;
            bounds.push(boundCopy[0]);
            bounds.push(boundCopy[1]);
            fromX = segs[i][4];
            fromY = segs[i][5];
        }
        return bounds;
    };
    function getBoundsOfCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
        var argsString = _join.call(arguments);
        if (boundsOfCurveCache[argsString]) {
            return boundsOfCurveCache[argsString];
        }
        var sqrt = Math.sqrt, min = Math.min, max = Math.max, abs = Math.abs, tvalues = [], bounds = [ [], [] ], a, b, c, t, t1, t2, b2ac, sqrtb2ac;
        b = 6 * x0 - 12 * x1 + 6 * x2;
        a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
        c = 3 * x1 - 3 * x0;
        for (var i = 0; i < 2; ++i) {
            if (i > 0) {
                b = 6 * y0 - 12 * y1 + 6 * y2;
                a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
                c = 3 * y1 - 3 * y0;
            }
            if (abs(a) < 1e-12) {
                if (abs(b) < 1e-12) {
                    continue;
                }
                t = -c / b;
                if (0 < t && t < 1) {
                    tvalues.push(t);
                }
                continue;
            }
            b2ac = b * b - 4 * c * a;
            if (b2ac < 0) {
                continue;
            }
            sqrtb2ac = sqrt(b2ac);
            t1 = (-b + sqrtb2ac) / (2 * a);
            if (0 < t1 && t1 < 1) {
                tvalues.push(t1);
            }
            t2 = (-b - sqrtb2ac) / (2 * a);
            if (0 < t2 && t2 < 1) {
                tvalues.push(t2);
            }
        }
        var x, y, j = tvalues.length, jlen = j, mt;
        while (j--) {
            t = tvalues[j];
            mt = 1 - t;
            x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
            bounds[0][j] = x;
            y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
            bounds[1][j] = y;
        }
        bounds[0][jlen] = x0;
        bounds[1][jlen] = y0;
        bounds[0][jlen + 1] = x3;
        bounds[1][jlen + 1] = y3;
        var result = [ {
            x: min.apply(null, bounds[0]),
            y: min.apply(null, bounds[1])
        }, {
            x: max.apply(null, bounds[0]),
            y: max.apply(null, bounds[1])
        } ];
        boundsOfCurveCache[argsString] = result;
        return result;
    }
    fabric.util.getBoundsOfCurve = getBoundsOfCurve;
})();

(function() {
    var slice = Array.prototype.slice;
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement) {
            if (this === void 0 || this === null) {
                throw new TypeError();
            }
            var t = Object(this), len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (n !== n) {
                    n = 0;
                } else if (n !== 0 && n !== Number.POSITIVE_INFINITY && n !== Number.NEGATIVE_INFINITY) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (;k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(fn, context) {
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this) {
                    fn.call(context, this[i], i, this);
                }
            }
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function(fn, context) {
            var result = [];
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this) {
                    result[i] = fn.call(context, this[i], i, this);
                }
            }
            return result;
        };
    }
    if (!Array.prototype.every) {
        Array.prototype.every = function(fn, context) {
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this && !fn.call(context, this[i], i, this)) {
                    return false;
                }
            }
            return true;
        };
    }
    if (!Array.prototype.some) {
        Array.prototype.some = function(fn, context) {
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this && fn.call(context, this[i], i, this)) {
                    return true;
                }
            }
            return false;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(fn, context) {
            var result = [], val;
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                if (i in this) {
                    val = this[i];
                    if (fn.call(context, val, i, this)) {
                        result.push(val);
                    }
                }
            }
            return result;
        };
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function(fn) {
            var len = this.length >>> 0, i = 0, rv;
            if (arguments.length > 1) {
                rv = arguments[1];
            } else {
                do {
                    if (i in this) {
                        rv = this[i++];
                        break;
                    }
                    if (++i >= len) {
                        throw new TypeError();
                    }
                } while (true);
            }
            for (;i < len; i++) {
                if (i in this) {
                    rv = fn.call(null, rv, this[i], i, this);
                }
            }
            return rv;
        };
    }
    function invoke(array, method) {
        var args = slice.call(arguments, 2), result = [];
        for (var i = 0, len = array.length; i < len; i++) {
            result[i] = args.length ? array[i][method].apply(array[i], args) : array[i][method].call(array[i]);
        }
        return result;
    }
    function max(array, byProperty) {
        return find(array, byProperty, function(value1, value2) {
            return value1 >= value2;
        });
    }
    function min(array, byProperty) {
        return find(array, byProperty, function(value1, value2) {
            return value1 < value2;
        });
    }
    function find(array, byProperty, condition) {
        if (!array || array.length === 0) {
            return;
        }
        var i = array.length - 1, result = byProperty ? array[i][byProperty] : array[i];
        if (byProperty) {
            while (i--) {
                if (condition(array[i][byProperty], result)) {
                    result = array[i][byProperty];
                }
            }
        } else {
            while (i--) {
                if (condition(array[i], result)) {
                    result = array[i];
                }
            }
        }
        return result;
    }
    fabric.util.array = {
        invoke: invoke,
        min: min,
        max: max
    };
})();

(function() {
    function extend(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    }
    function clone(object) {
        return extend({}, object);
    }
    fabric.util.object = {
        extend: extend,
        clone: clone
    };
})();

(function() {
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "");
        };
    }
    function camelize(string) {
        return string.replace(/-+(.)?/g, function(match, character) {
            return character ? character.toUpperCase() : "";
        });
    }
    function capitalize(string, firstLetterOnly) {
        return string.charAt(0).toUpperCase() + (firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase());
    }
    function escapeXml(string) {
        return string.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    fabric.util.string = {
        camelize: camelize,
        capitalize: capitalize,
        escapeXml: escapeXml
    };
})();

(function() {
    var slice = Array.prototype.slice, apply = Function.prototype.apply, Dummy = function() {};
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(thisArg) {
            var _this = this, args = slice.call(arguments, 1), bound;
            if (args.length) {
                bound = function() {
                    return apply.call(_this, this instanceof Dummy ? this : thisArg, args.concat(slice.call(arguments)));
                };
            } else {
                bound = function() {
                    return apply.call(_this, this instanceof Dummy ? this : thisArg, arguments);
                };
            }
            Dummy.prototype = this.prototype;
            bound.prototype = new Dummy();
            return bound;
        };
    }
})();

(function() {
    var slice = Array.prototype.slice, emptyFunction = function() {}, IS_DONTENUM_BUGGY = function() {
        for (var p in {
            toString: 1
        }) {
            if (p === "toString") {
                return false;
            }
        }
        return true;
    }(), addMethods = function(klass, source, parent) {
        for (var property in source) {
            if (property in klass.prototype && typeof klass.prototype[property] === "function" && (source[property] + "").indexOf("callSuper") > -1) {
                klass.prototype[property] = function(property) {
                    return function() {
                        var superclass = this.constructor.superclass;
                        this.constructor.superclass = parent;
                        var returnValue = source[property].apply(this, arguments);
                        this.constructor.superclass = superclass;
                        if (property !== "initialize") {
                            return returnValue;
                        }
                    };
                }(property);
            } else {
                klass.prototype[property] = source[property];
            }
            if (IS_DONTENUM_BUGGY) {
                if (source.toString !== Object.prototype.toString) {
                    klass.prototype.toString = source.toString;
                }
                if (source.valueOf !== Object.prototype.valueOf) {
                    klass.prototype.valueOf = source.valueOf;
                }
            }
        }
    };
    function Subclass() {}
    function callSuper(methodName) {
        var fn = this.constructor.superclass.prototype[methodName];
        return arguments.length > 1 ? fn.apply(this, slice.call(arguments, 1)) : fn.call(this);
    }
    function createClass() {
        var parent = null, properties = slice.call(arguments, 0);
        if (typeof properties[0] === "function") {
            parent = properties.shift();
        }
        function klass() {
            this.initialize.apply(this, arguments);
        }
        klass.superclass = parent;
        klass.subclasses = [];
        if (parent) {
            Subclass.prototype = parent.prototype;
            klass.prototype = new Subclass();
            parent.subclasses.push(klass);
        }
        for (var i = 0, length = properties.length; i < length; i++) {
            addMethods(klass, properties[i], parent);
        }
        if (!klass.prototype.initialize) {
            klass.prototype.initialize = emptyFunction;
        }
        klass.prototype.constructor = klass;
        klass.prototype.callSuper = callSuper;
        return klass;
    }
    fabric.util.createClass = createClass;
})();

(function() {
    var unknown = "unknown";
    function areHostMethods(object) {
        var methodNames = Array.prototype.slice.call(arguments, 1), t, i, len = methodNames.length;
        for (i = 0; i < len; i++) {
            t = typeof object[methodNames[i]];
            if (!/^(?:function|object|unknown)$/.test(t)) {
                return false;
            }
        }
        return true;
    }
    var getElement, setElement, getUniqueId = function() {
        var uid = 0;
        return function(element) {
            return element.__uniqueID || (element.__uniqueID = "uniqueID__" + uid++);
        };
    }();
    (function() {
        var elements = {};
        getElement = function(uid) {
            return elements[uid];
        };
        setElement = function(uid, element) {
            elements[uid] = element;
        };
    })();
    function createListener(uid, handler) {
        return {
            handler: handler,
            wrappedHandler: createWrappedHandler(uid, handler)
        };
    }
    function createWrappedHandler(uid, handler) {
        return function(e) {
            handler.call(getElement(uid), e || fabric.window.event);
        };
    }
    function createDispatcher(uid, eventName) {
        return function(e) {
            if (handlers[uid] && handlers[uid][eventName]) {
                var handlersForEvent = handlers[uid][eventName];
                for (var i = 0, len = handlersForEvent.length; i < len; i++) {
                    handlersForEvent[i].call(this, e || fabric.window.event);
                }
            }
        };
    }
    var shouldUseAddListenerRemoveListener = areHostMethods(fabric.document.documentElement, "addEventListener", "removeEventListener") && areHostMethods(fabric.window, "addEventListener", "removeEventListener"), shouldUseAttachEventDetachEvent = areHostMethods(fabric.document.documentElement, "attachEvent", "detachEvent") && areHostMethods(fabric.window, "attachEvent", "detachEvent"), listeners = {}, handlers = {}, addListener, removeListener;
    if (shouldUseAddListenerRemoveListener) {
        addListener = function(element, eventName, handler) {
            element.addEventListener(eventName, handler, false);
        };
        removeListener = function(element, eventName, handler) {
            element.removeEventListener(eventName, handler, false);
        };
    } else if (shouldUseAttachEventDetachEvent) {
        addListener = function(element, eventName, handler) {
            var uid = getUniqueId(element);
            setElement(uid, element);
            if (!listeners[uid]) {
                listeners[uid] = {};
            }
            if (!listeners[uid][eventName]) {
                listeners[uid][eventName] = [];
            }
            var listener = createListener(uid, handler);
            listeners[uid][eventName].push(listener);
            element.attachEvent("on" + eventName, listener.wrappedHandler);
        };
        removeListener = function(element, eventName, handler) {
            var uid = getUniqueId(element), listener;
            if (listeners[uid] && listeners[uid][eventName]) {
                for (var i = 0, len = listeners[uid][eventName].length; i < len; i++) {
                    listener = listeners[uid][eventName][i];
                    if (listener && listener.handler === handler) {
                        element.detachEvent("on" + eventName, listener.wrappedHandler);
                        listeners[uid][eventName][i] = null;
                    }
                }
            }
        };
    } else {
        addListener = function(element, eventName, handler) {
            var uid = getUniqueId(element);
            if (!handlers[uid]) {
                handlers[uid] = {};
            }
            if (!handlers[uid][eventName]) {
                handlers[uid][eventName] = [];
                var existingHandler = element["on" + eventName];
                if (existingHandler) {
                    handlers[uid][eventName].push(existingHandler);
                }
                element["on" + eventName] = createDispatcher(uid, eventName);
            }
            handlers[uid][eventName].push(handler);
        };
        removeListener = function(element, eventName, handler) {
            var uid = getUniqueId(element);
            if (handlers[uid] && handlers[uid][eventName]) {
                var handlersForEvent = handlers[uid][eventName];
                for (var i = 0, len = handlersForEvent.length; i < len; i++) {
                    if (handlersForEvent[i] === handler) {
                        handlersForEvent.splice(i, 1);
                    }
                }
            }
        };
    }
    fabric.util.addListener = addListener;
    fabric.util.removeListener = removeListener;
    function getPointer(event) {
        event || (event = fabric.window.event);
        var element = event.target || (typeof event.srcElement !== unknown ? event.srcElement : null), scroll = fabric.util.getScrollLeftTop(element);
        return {
            x: pointerX(event) + scroll.left,
            y: pointerY(event) + scroll.top
        };
    }
    var pointerX = function(event) {
        return typeof event.clientX !== unknown ? event.clientX : 0;
    }, pointerY = function(event) {
        return typeof event.clientY !== unknown ? event.clientY : 0;
    };
    function _getPointer(event, pageProp, clientProp) {
        var touchProp = event.type === "touchend" ? "changedTouches" : "touches";
        return event[touchProp] && event[touchProp][0] ? event[touchProp][0][pageProp] - (event[touchProp][0][pageProp] - event[touchProp][0][clientProp]) || event[clientProp] : event[clientProp];
    }
    if (fabric.isTouchSupported) {
        pointerX = function(event) {
            return _getPointer(event, "pageX", "clientX");
        };
        pointerY = function(event) {
            return _getPointer(event, "pageY", "clientY");
        };
    }
    fabric.util.getPointer = getPointer;
    fabric.util.object.extend(fabric.util, fabric.Observable);
})();

(function() {
    function setStyle(element, styles) {
        var elementStyle = element.style;
        if (!elementStyle) {
            return element;
        }
        if (typeof styles === "string") {
            element.style.cssText += ";" + styles;
            return styles.indexOf("opacity") > -1 ? setOpacity(element, styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
        }
        for (var property in styles) {
            if (property === "opacity") {
                setOpacity(element, styles[property]);
            } else {
                var normalizedProperty = property === "float" || property === "cssFloat" ? typeof elementStyle.styleFloat === "undefined" ? "cssFloat" : "styleFloat" : property;
                elementStyle[normalizedProperty] = styles[property];
            }
        }
        return element;
    }
    var parseEl = fabric.document.createElement("div"), supportsOpacity = typeof parseEl.style.opacity === "string", supportsFilters = typeof parseEl.style.filter === "string", reOpacity = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/, setOpacity = function(element) {
        return element;
    };
    if (supportsOpacity) {
        setOpacity = function(element, value) {
            element.style.opacity = value;
            return element;
        };
    } else if (supportsFilters) {
        setOpacity = function(element, value) {
            var es = element.style;
            if (element.currentStyle && !element.currentStyle.hasLayout) {
                es.zoom = 1;
            }
            if (reOpacity.test(es.filter)) {
                value = value >= .9999 ? "" : "alpha(opacity=" + value * 100 + ")";
                es.filter = es.filter.replace(reOpacity, value);
            } else {
                es.filter += " alpha(opacity=" + value * 100 + ")";
            }
            return element;
        };
    }
    fabric.util.setStyle = setStyle;
})();

(function() {
    var _slice = Array.prototype.slice;
    function getById(id) {
        return typeof id === "string" ? fabric.document.getElementById(id) : id;
    }
    var sliceCanConvertNodelists, toArray = function(arrayLike) {
        return _slice.call(arrayLike, 0);
    };
    try {
        sliceCanConvertNodelists = toArray(fabric.document.childNodes) instanceof Array;
    } catch (err) {}
    if (!sliceCanConvertNodelists) {
        toArray = function(arrayLike) {
            var arr = new Array(arrayLike.length), i = arrayLike.length;
            while (i--) {
                arr[i] = arrayLike[i];
            }
            return arr;
        };
    }
    function makeElement(tagName, attributes) {
        var el = fabric.document.createElement(tagName);
        for (var prop in attributes) {
            if (prop === "class") {
                el.className = attributes[prop];
            } else if (prop === "for") {
                el.htmlFor = attributes[prop];
            } else {
                el.setAttribute(prop, attributes[prop]);
            }
        }
        return el;
    }
    function addClass(element, className) {
        if (element && (" " + element.className + " ").indexOf(" " + className + " ") === -1) {
            element.className += (element.className ? " " : "") + className;
        }
    }
    function wrapElement(element, wrapper, attributes) {
        if (typeof wrapper === "string") {
            wrapper = makeElement(wrapper, attributes);
        }
        if (element.parentNode) {
            element.parentNode.replaceChild(wrapper, element);
        }
        wrapper.appendChild(element);
        return wrapper;
    }
    function getScrollLeftTop(element) {
        var left = 0, top = 0, docElement = fabric.document.documentElement, body = fabric.document.body || {
            scrollLeft: 0,
            scrollTop: 0
        };
        while (element && element.parentNode) {
            element = element.parentNode;
            if (element === fabric.document) {
                left = body.scrollLeft || docElement.scrollLeft || 0;
                top = body.scrollTop || docElement.scrollTop || 0;
            } else {
                left += element.scrollLeft || 0;
                top += element.scrollTop || 0;
            }
            if (element.nodeType === 1 && fabric.util.getElementStyle(element, "position") === "fixed") {
                break;
            }
        }
        return {
            left: left,
            top: top
        };
    }
    function getElementOffset(element) {
        var docElem, doc = element && element.ownerDocument, box = {
            left: 0,
            top: 0
        }, offset = {
            left: 0,
            top: 0
        }, scrollLeftTop, offsetAttributes = {
            borderLeftWidth: "left",
            borderTopWidth: "top",
            paddingLeft: "left",
            paddingTop: "top"
        };
        if (!doc) {
            return offset;
        }
        for (var attr in offsetAttributes) {
            offset[offsetAttributes[attr]] += parseInt(getElementStyle(element, attr), 10) || 0;
        }
        docElem = doc.documentElement;
        if (typeof element.getBoundingClientRect !== "undefined") {
            box = element.getBoundingClientRect();
        }
        scrollLeftTop = getScrollLeftTop(element);
        return {
            left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
            top: box.top + scrollLeftTop.top - (docElem.clientTop || 0) + offset.top
        };
    }
    var getElementStyle;
    if (fabric.document.defaultView && fabric.document.defaultView.getComputedStyle) {
        getElementStyle = function(element, attr) {
            var style = fabric.document.defaultView.getComputedStyle(element, null);
            return style ? style[attr] : undefined;
        };
    } else {
        getElementStyle = function(element, attr) {
            var value = element.style[attr];
            if (!value && element.currentStyle) {
                value = element.currentStyle[attr];
            }
            return value;
        };
    }
    (function() {
        var style = fabric.document.documentElement.style, selectProp = "userSelect" in style ? "userSelect" : "MozUserSelect" in style ? "MozUserSelect" : "WebkitUserSelect" in style ? "WebkitUserSelect" : "KhtmlUserSelect" in style ? "KhtmlUserSelect" : "";
        function makeElementUnselectable(element) {
            if (typeof element.onselectstart !== "undefined") {
                element.onselectstart = fabric.util.falseFunction;
            }
            if (selectProp) {
                element.style[selectProp] = "none";
            } else if (typeof element.unselectable === "string") {
                element.unselectable = "on";
            }
            return element;
        }
        function makeElementSelectable(element) {
            if (typeof element.onselectstart !== "undefined") {
                element.onselectstart = null;
            }
            if (selectProp) {
                element.style[selectProp] = "";
            } else if (typeof element.unselectable === "string") {
                element.unselectable = "";
            }
            return element;
        }
        fabric.util.makeElementUnselectable = makeElementUnselectable;
        fabric.util.makeElementSelectable = makeElementSelectable;
    })();
    (function() {
        function getScript(url, callback) {
            var headEl = fabric.document.getElementsByTagName("head")[0], scriptEl = fabric.document.createElement("script"), loading = true;
            scriptEl.onload = scriptEl.onreadystatechange = function(e) {
                if (loading) {
                    if (typeof this.readyState === "string" && this.readyState !== "loaded" && this.readyState !== "complete") {
                        return;
                    }
                    loading = false;
                    callback(e || fabric.window.event);
                    scriptEl = scriptEl.onload = scriptEl.onreadystatechange = null;
                }
            };
            scriptEl.src = url;
            headEl.appendChild(scriptEl);
        }
        fabric.util.getScript = getScript;
    })();
    fabric.util.getById = getById;
    fabric.util.toArray = toArray;
    fabric.util.makeElement = makeElement;
    fabric.util.addClass = addClass;
    fabric.util.wrapElement = wrapElement;
    fabric.util.getScrollLeftTop = getScrollLeftTop;
    fabric.util.getElementOffset = getElementOffset;
    fabric.util.getElementStyle = getElementStyle;
})();

(function() {
    function addParamToUrl(url, param) {
        return url + (/\?/.test(url) ? "&" : "?") + param;
    }
    var makeXHR = function() {
        var factories = [ function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        }, function() {
            return new XMLHttpRequest();
        } ];
        for (var i = factories.length; i--; ) {
            try {
                var req = factories[i]();
                if (req) {
                    return factories[i];
                }
            } catch (err) {}
        }
    }();
    function emptyFn() {}
    function request(url, options) {
        options || (options = {});
        var method = options.method ? options.method.toUpperCase() : "GET", onComplete = options.onComplete || function() {}, xhr = makeXHR(), body;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                onComplete(xhr);
                xhr.onreadystatechange = emptyFn;
            }
        };
        if (method === "GET") {
            body = null;
            if (typeof options.parameters === "string") {
                url = addParamToUrl(url, options.parameters);
            }
        }
        xhr.open(method, url, true);
        if (method === "POST" || method === "PUT") {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(body);
        return xhr;
    }
    fabric.util.request = request;
})();

fabric.log = function() {};

fabric.warn = function() {};

if (typeof console !== "undefined") {
    [ "log", "warn" ].forEach(function(methodName) {
        if (typeof console[methodName] !== "undefined" && typeof console[methodName].apply === "function") {
            fabric[methodName] = function() {
                return console[methodName].apply(console, arguments);
            };
        }
    });
}

(function() {
    function animate(options) {
        requestAnimFrame(function(timestamp) {
            options || (options = {});
            var start = timestamp || +new Date(), duration = options.duration || 500, finish = start + duration, time, onChange = options.onChange || function() {}, abort = options.abort || function() {
                return false;
            }, easing = options.easing || function(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            }, startValue = "startValue" in options ? options.startValue : 0, endValue = "endValue" in options ? options.endValue : 100, byValue = options.byValue || endValue - startValue;
            options.onStart && options.onStart();
            (function tick(ticktime) {
                time = ticktime || +new Date();
                var currentTime = time > finish ? duration : time - start;
                if (abort()) {
                    options.onComplete && options.onComplete();
                    return;
                }
                onChange(easing(currentTime, startValue, byValue, duration));
                if (time > finish) {
                    options.onComplete && options.onComplete();
                    return;
                }
                requestAnimFrame(tick);
            })(start);
        });
    }
    var _requestAnimFrame = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(callback) {
        fabric.window.setTimeout(callback, 1e3 / 60);
    };
    function requestAnimFrame() {
        return _requestAnimFrame.apply(fabric.window, arguments);
    }
    fabric.util.animate = animate;
    fabric.util.requestAnimFrame = requestAnimFrame;
})();

(function() {
    function normalize(a, c, p, s) {
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return {
            a: a,
            c: c,
            p: p,
            s: s
        };
    }
    function elastic(opts, t, d) {
        return opts.a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p);
    }
    function easeOutCubic(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }
    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    }
    function easeInQuart(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    }
    function easeOutQuart(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }
    function easeInOutQuart(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
    function easeInQuint(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    }
    function easeOutQuint(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    }
    function easeInOutQuint(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }
    function easeInSine(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    }
    function easeOutSine(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }
    function easeInOutSine(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
    function easeInExpo(t, b, c, d) {
        return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    }
    function easeOutExpo(t, b, c, d) {
        return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }
    function easeInOutExpo(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        t /= d / 2;
        if (t < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
    function easeInCirc(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    }
    function easeOutCirc(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    }
    function easeInOutCirc(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    }
    function easeInElastic(t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t === 0) {
            return b;
        }
        t /= d;
        if (t === 1) {
            return b + c;
        }
        if (!p) {
            p = d * .3;
        }
        var opts = normalize(a, c, p, s);
        return -elastic(opts, t, d) + b;
    }
    function easeOutElastic(t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t === 0) {
            return b;
        }
        t /= d;
        if (t === 1) {
            return b + c;
        }
        if (!p) {
            p = d * .3;
        }
        var opts = normalize(a, c, p, s);
        return opts.a * Math.pow(2, -10 * t) * Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p) + opts.c + b;
    }
    function easeInOutElastic(t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t === 0) {
            return b;
        }
        t /= d / 2;
        if (t === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (.3 * 1.5);
        }
        var opts = normalize(a, c, p, s);
        if (t < 1) {
            return -.5 * elastic(opts, t, d) + b;
        }
        return opts.a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p) * .5 + opts.c + b;
    }
    function easeInBack(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    }
    function easeOutBack(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
    function easeInOutBack(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        t /= d / 2;
        if (t < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    }
    function easeInBounce(t, b, c, d) {
        return c - easeOutBounce(d - t, 0, c, d) + b;
    }
    function easeOutBounce(t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
        }
    }
    function easeInOutBounce(t, b, c, d) {
        if (t < d / 2) {
            return easeInBounce(t * 2, 0, c, d) * .5 + b;
        }
        return easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
    fabric.util.ease = {
        easeInQuad: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function(t, b, c, d) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * (--t * (t - 2) - 1) + b;
        },
        easeInCubic: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: easeOutCubic,
        easeInOutCubic: easeInOutCubic,
        easeInQuart: easeInQuart,
        easeOutQuart: easeOutQuart,
        easeInOutQuart: easeInOutQuart,
        easeInQuint: easeInQuint,
        easeOutQuint: easeOutQuint,
        easeInOutQuint: easeInOutQuint,
        easeInSine: easeInSine,
        easeOutSine: easeOutSine,
        easeInOutSine: easeInOutSine,
        easeInExpo: easeInExpo,
        easeOutExpo: easeOutExpo,
        easeInOutExpo: easeInOutExpo,
        easeInCirc: easeInCirc,
        easeOutCirc: easeOutCirc,
        easeInOutCirc: easeInOutCirc,
        easeInElastic: easeInElastic,
        easeOutElastic: easeOutElastic,
        easeInOutElastic: easeInOutElastic,
        easeInBack: easeInBack,
        easeOutBack: easeOutBack,
        easeInOutBack: easeInOutBack,
        easeInBounce: easeInBounce,
        easeOutBounce: easeOutBounce,
        easeInOutBounce: easeInOutBounce
    };
})();

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, capitalize = fabric.util.string.capitalize, clone = fabric.util.object.clone, toFixed = fabric.util.toFixed, parseUnit = fabric.util.parseUnit, multiplyTransformMatrices = fabric.util.multiplyTransformMatrices, reAllowedSVGTagNames = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/i, reViewBoxTagNames = /^(symbol|image|marker|pattern|view|svg)$/i, reNotAllowedAncestors = /^(?:pattern|defs|symbol|metadata)$/i, reAllowedParents = /^(symbol|g|a|svg)$/i, attributesMap = {
        cx: "left",
        x: "left",
        r: "radius",
        cy: "top",
        y: "top",
        display: "visible",
        visibility: "visible",
        transform: "transformMatrix",
        "fill-opacity": "fillOpacity",
        "fill-rule": "fillRule",
        "font-family": "fontFamily",
        "font-size": "fontSize",
        "font-style": "fontStyle",
        "font-weight": "fontWeight",
        "stroke-dasharray": "strokeDashArray",
        "stroke-linecap": "strokeLineCap",
        "stroke-linejoin": "strokeLineJoin",
        "stroke-miterlimit": "strokeMiterLimit",
        "stroke-opacity": "strokeOpacity",
        "stroke-width": "strokeWidth",
        "text-decoration": "textDecoration",
        "text-anchor": "originX"
    }, colorAttributes = {
        stroke: "strokeOpacity",
        fill: "fillOpacity"
    };
    fabric.cssRules = {};
    fabric.gradientDefs = {};
    function normalizeAttr(attr) {
        if (attr in attributesMap) {
            return attributesMap[attr];
        }
        return attr;
    }
    function normalizeValue(attr, value, parentAttributes, fontSize) {
        var isArray = Object.prototype.toString.call(value) === "[object Array]", parsed;
        if ((attr === "fill" || attr === "stroke") && value === "none") {
            value = "";
        } else if (attr === "strokeDashArray") {
            value = value.replace(/,/g, " ").split(/\s+/).map(function(n) {
                return parseFloat(n);
            });
        } else if (attr === "transformMatrix") {
            if (parentAttributes && parentAttributes.transformMatrix) {
                value = multiplyTransformMatrices(parentAttributes.transformMatrix, fabric.parseTransformAttribute(value));
            } else {
                value = fabric.parseTransformAttribute(value);
            }
        } else if (attr === "visible") {
            value = value === "none" || value === "hidden" ? false : true;
            if (parentAttributes && parentAttributes.visible === false) {
                value = false;
            }
        } else if (attr === "originX") {
            value = value === "start" ? "left" : value === "end" ? "right" : "center";
        } else {
            parsed = isArray ? value.map(parseUnit) : parseUnit(value, fontSize);
        }
        return !isArray && isNaN(parsed) ? value : parsed;
    }
    function _setStrokeFillOpacity(attributes) {
        for (var attr in colorAttributes) {
            if (!attributes[attr] || typeof attributes[colorAttributes[attr]] === "undefined") {
                continue;
            }
            if (attributes[attr].indexOf("url(") === 0) {
                continue;
            }
            var color = new fabric.Color(attributes[attr]);
            attributes[attr] = color.setAlpha(toFixed(color.getAlpha() * attributes[colorAttributes[attr]], 2)).toRgba();
        }
        return attributes;
    }
    fabric.parseTransformAttribute = function() {
        function rotateMatrix(matrix, args) {
            var angle = args[0];
            matrix[0] = Math.cos(angle);
            matrix[1] = Math.sin(angle);
            matrix[2] = -Math.sin(angle);
            matrix[3] = Math.cos(angle);
        }
        function scaleMatrix(matrix, args) {
            var multiplierX = args[0], multiplierY = args.length === 2 ? args[1] : args[0];
            matrix[0] = multiplierX;
            matrix[3] = multiplierY;
        }
        function skewXMatrix(matrix, args) {
            matrix[2] = Math.tan(fabric.util.degreesToRadians(args[0]));
        }
        function skewYMatrix(matrix, args) {
            matrix[1] = Math.tan(fabric.util.degreesToRadians(args[0]));
        }
        function translateMatrix(matrix, args) {
            matrix[4] = args[0];
            if (args.length === 2) {
                matrix[5] = args[1];
            }
        }
        var iMatrix = [ 1, 0, 0, 1, 0, 0 ], number = fabric.reNum, commaWsp = "(?:\\s+,?\\s*|,\\s*)", skewX = "(?:(skewX)\\s*\\(\\s*(" + number + ")\\s*\\))", skewY = "(?:(skewY)\\s*\\(\\s*(" + number + ")\\s*\\))", rotate = "(?:(rotate)\\s*\\(\\s*(" + number + ")(?:" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + "))?\\s*\\))", scale = "(?:(scale)\\s*\\(\\s*(" + number + ")(?:" + commaWsp + "(" + number + "))?\\s*\\))", translate = "(?:(translate)\\s*\\(\\s*(" + number + ")(?:" + commaWsp + "(" + number + "))?\\s*\\))", matrix = "(?:(matrix)\\s*\\(\\s*" + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + "\\s*\\))", transform = "(?:" + matrix + "|" + translate + "|" + scale + "|" + rotate + "|" + skewX + "|" + skewY + ")", transforms = "(?:" + transform + "(?:" + commaWsp + transform + ")*" + ")", transformList = "^\\s*(?:" + transforms + "?)\\s*$", reTransformList = new RegExp(transformList), reTransform = new RegExp(transform, "g");
        return function(attributeValue) {
            var matrix = iMatrix.concat(), matrices = [];
            if (!attributeValue || attributeValue && !reTransformList.test(attributeValue)) {
                return matrix;
            }
            attributeValue.replace(reTransform, function(match) {
                var m = new RegExp(transform).exec(match).filter(function(match) {
                    return match !== "" && match != null;
                }), operation = m[1], args = m.slice(2).map(parseFloat);
                switch (operation) {
                  case "translate":
                    translateMatrix(matrix, args);
                    break;

                  case "rotate":
                    args[0] = fabric.util.degreesToRadians(args[0]);
                    rotateMatrix(matrix, args);
                    break;

                  case "scale":
                    scaleMatrix(matrix, args);
                    break;

                  case "skewX":
                    skewXMatrix(matrix, args);
                    break;

                  case "skewY":
                    skewYMatrix(matrix, args);
                    break;

                  case "matrix":
                    matrix = args;
                    break;
                }
                matrices.push(matrix.concat());
                matrix = iMatrix.concat();
            });
            var combinedMatrix = matrices[0];
            while (matrices.length > 1) {
                matrices.shift();
                combinedMatrix = fabric.util.multiplyTransformMatrices(combinedMatrix, matrices[0]);
            }
            return combinedMatrix;
        };
    }();
    function parseStyleString(style, oStyle) {
        var attr, value;
        style.replace(/;\s*$/, "").split(";").forEach(function(chunk) {
            var pair = chunk.split(":");
            attr = normalizeAttr(pair[0].trim().toLowerCase());
            value = normalizeValue(attr, pair[1].trim());
            oStyle[attr] = value;
        });
    }
    function parseStyleObject(style, oStyle) {
        var attr, value;
        for (var prop in style) {
            if (typeof style[prop] === "undefined") {
                continue;
            }
            attr = normalizeAttr(prop.toLowerCase());
            value = normalizeValue(attr, style[prop]);
            oStyle[attr] = value;
        }
    }
    function getGlobalStylesForElement(element, svgUid) {
        var styles = {};
        for (var rule in fabric.cssRules[svgUid]) {
            if (elementMatchesRule(element, rule.split(" "))) {
                for (var property in fabric.cssRules[svgUid][rule]) {
                    styles[property] = fabric.cssRules[svgUid][rule][property];
                }
            }
        }
        return styles;
    }
    function elementMatchesRule(element, selectors) {
        var firstMatching, parentMatching = true;
        firstMatching = selectorMatches(element, selectors.pop());
        if (firstMatching && selectors.length) {
            parentMatching = doesSomeParentMatch(element, selectors);
        }
        return firstMatching && parentMatching && selectors.length === 0;
    }
    function doesSomeParentMatch(element, selectors) {
        var selector, parentMatching = true;
        while (element.parentNode && element.parentNode.nodeType === 1 && selectors.length) {
            if (parentMatching) {
                selector = selectors.pop();
            }
            element = element.parentNode;
            parentMatching = selectorMatches(element, selector);
        }
        return selectors.length === 0;
    }
    function selectorMatches(element, selector) {
        var nodeName = element.nodeName, classNames = element.getAttribute("class"), id = element.getAttribute("id"), matcher;
        matcher = new RegExp("^" + nodeName, "i");
        selector = selector.replace(matcher, "");
        if (id && selector.length) {
            matcher = new RegExp("#" + id + "(?![a-zA-Z\\-]+)", "i");
            selector = selector.replace(matcher, "");
        }
        if (classNames && selector.length) {
            classNames = classNames.split(" ");
            for (var i = classNames.length; i--; ) {
                matcher = new RegExp("\\." + classNames[i] + "(?![a-zA-Z\\-]+)", "i");
                selector = selector.replace(matcher, "");
            }
        }
        return selector.length === 0;
    }
    function elementById(doc, id) {
        var el;
        doc.getElementById && (el = doc.getElementById(id));
        if (el) {
            return el;
        }
        var node, i, idAttr, nodelist = doc.getElementsByTagName("*");
        for (i = 0; i < nodelist.length; i++) {
            node = nodelist[i];
            if (idAttr === node.getAttribute("id")) {
                return node;
            }
        }
    }
    function parseUseDirectives(doc) {
        var nodelist = doc.getElementsByTagName("use"), i = 0;
        while (nodelist.length && i < nodelist.length) {
            var el = nodelist[i], xlink = el.getAttribute("xlink:href").substr(1), x = el.getAttribute("x") || 0, y = el.getAttribute("y") || 0, el2 = elementById(doc, xlink).cloneNode(true), currentTrans = (el2.getAttribute("transform") || "") + " translate(" + x + ", " + y + ")", parentNode, oldLength = nodelist.length, attr, j, attrs, l;
            applyViewboxTransform(el2);
            if (/^svg$/i.test(el2.nodeName)) {
                var el3 = el2.ownerDocument.createElement("g");
                for (j = 0, attrs = el2.attributes, l = attrs.length; j < l; j++) {
                    attr = attrs.item(j);
                    el3.setAttribute(attr.nodeName, attr.nodeValue);
                }
                while (el2.firstChild != null) {
                    el3.appendChild(el2.firstChild);
                }
                el2 = el3;
            }
            for (j = 0, attrs = el.attributes, l = attrs.length; j < l; j++) {
                attr = attrs.item(j);
                if (attr.nodeName === "x" || attr.nodeName === "y" || attr.nodeName === "xlink:href") {
                    continue;
                }
                if (attr.nodeName === "transform") {
                    currentTrans = attr.nodeValue + " " + currentTrans;
                } else {
                    el2.setAttribute(attr.nodeName, attr.nodeValue);
                }
            }
            el2.setAttribute("transform", currentTrans);
            el2.setAttribute("instantiated_by_use", "1");
            el2.removeAttribute("id");
            parentNode = el.parentNode;
            parentNode.replaceChild(el2, el);
            if (nodelist.length === oldLength) {
                i++;
            }
        }
    }
    var reViewBoxAttrValue = new RegExp("^" + "\\s*(" + fabric.reNum + "+)\\s*,?" + "\\s*(" + fabric.reNum + "+)\\s*,?" + "\\s*(" + fabric.reNum + "+)\\s*,?" + "\\s*(" + fabric.reNum + "+)\\s*" + "$");
    function applyViewboxTransform(element) {
        var viewBoxAttr = element.getAttribute("viewBox"), scaleX = 1, scaleY = 1, minX = 0, minY = 0, viewBoxWidth, viewBoxHeight, matrix, el, widthAttr = element.getAttribute("width"), heightAttr = element.getAttribute("height"), missingViewBox = !viewBoxAttr || !reViewBoxTagNames.test(element.tagName) || !(viewBoxAttr = viewBoxAttr.match(reViewBoxAttrValue)), missingDimAttr = !widthAttr || !heightAttr || widthAttr === "100%" || heightAttr === "100%", toBeParsed = missingViewBox && missingDimAttr, parsedDim = {};
        parsedDim.width = 0;
        parsedDim.height = 0;
        parsedDim.toBeParsed = toBeParsed;
        if (toBeParsed) {
            return parsedDim;
        }
        if (missingViewBox) {
            parsedDim.width = parseUnit(widthAttr);
            parsedDim.height = parseUnit(heightAttr);
            return parsedDim;
        }
        minX = -parseFloat(viewBoxAttr[1]), minY = -parseFloat(viewBoxAttr[2]), viewBoxWidth = parseFloat(viewBoxAttr[3]), 
        viewBoxHeight = parseFloat(viewBoxAttr[4]);
        if (!missingDimAttr) {
            parsedDim.width = parseUnit(widthAttr);
            parsedDim.height = parseUnit(heightAttr);
            scaleX = parsedDim.width / viewBoxWidth;
            scaleY = parsedDim.height / viewBoxHeight;
        } else {
            parsedDim.width = viewBoxWidth;
            parsedDim.height = viewBoxHeight;
        }
        scaleY = scaleX = scaleX > scaleY ? scaleY : scaleX;
        if (scaleX === 1 && scaleY === 1 && minX === 0 && minY === 0) {
            return parsedDim;
        }
        matrix = " matrix(" + scaleX + " 0" + " 0 " + scaleY + " " + minX * scaleX + " " + minY * scaleY + ") ";
        if (element.tagName === "svg") {
            el = element.ownerDocument.createElement("g");
            while (element.firstChild != null) {
                el.appendChild(element.firstChild);
            }
            element.appendChild(el);
        } else {
            el = element;
            matrix = el.getAttribute("transform") + matrix;
        }
        el.setAttribute("transform", matrix);
        return parsedDim;
    }
    fabric.parseSVGDocument = function() {
        function hasAncestorWithNodeName(element, nodeName) {
            while (element && (element = element.parentNode)) {
                if (nodeName.test(element.nodeName) && !element.getAttribute("instantiated_by_use")) {
                    return true;
                }
            }
            return false;
        }
        return function(doc, callback, reviver) {
            if (!doc) {
                return;
            }
            parseUseDirectives(doc);
            var startTime = new Date(), svgUid = fabric.Object.__uid++, options = applyViewboxTransform(doc), descendants = fabric.util.toArray(doc.getElementsByTagName("*"));
            options.svgUid = svgUid;
            if (descendants.length === 0 && fabric.isLikelyNode) {
                descendants = doc.selectNodes('//*[name(.)!="svg"]');
                var arr = [];
                for (var i = 0, len = descendants.length; i < len; i++) {
                    arr[i] = descendants[i];
                }
                descendants = arr;
            }
            var elements = descendants.filter(function(el) {
                applyViewboxTransform(el);
                return reAllowedSVGTagNames.test(el.tagName) && !hasAncestorWithNodeName(el, reNotAllowedAncestors);
            });
            if (!elements || elements && !elements.length) {
                callback && callback([], {});
                return;
            }
            fabric.gradientDefs[svgUid] = fabric.getGradientDefs(doc);
            fabric.cssRules[svgUid] = fabric.getCSSRules(doc);
            fabric.parseElements(elements, function(instances) {
                fabric.documentParsingTime = new Date() - startTime;
                if (callback) {
                    callback(instances, options);
                }
            }, clone(options), reviver);
        };
    }();
    var svgCache = {
        has: function(name, callback) {
            callback(false);
        },
        get: function() {},
        set: function() {}
    };
    function _enlivenCachedObject(cachedObject) {
        var objects = cachedObject.objects, options = cachedObject.options;
        objects = objects.map(function(o) {
            return fabric[capitalize(o.type)].fromObject(o);
        });
        return {
            objects: objects,
            options: options
        };
    }
    function _createSVGPattern(markup, canvas, property) {
        if (canvas[property] && canvas[property].toSVG) {
            markup.push('<pattern x="0" y="0" id="', property, 'Pattern" ', 'width="', canvas[property].source.width, '" height="', canvas[property].source.height, '" patternUnits="userSpaceOnUse">', '<image x="0" y="0" ', 'width="', canvas[property].source.width, '" height="', canvas[property].source.height, '" xlink:href="', canvas[property].source.src, '"></image></pattern>');
        }
    }
    var reFontDeclaration = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*" + "(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + fabric.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + fabric.reNum + "))?\\s+(.*)");
    extend(fabric, {
        parseFontDeclaration: function(value, oStyle) {
            var match = value.match(reFontDeclaration);
            if (!match) {
                return;
            }
            var fontStyle = match[1], fontWeight = match[3], fontSize = match[4], lineHeight = match[5], fontFamily = match[6];
            if (fontStyle) {
                oStyle.fontStyle = fontStyle;
            }
            if (fontWeight) {
                oStyle.fontWeight = isNaN(parseFloat(fontWeight)) ? fontWeight : parseFloat(fontWeight);
            }
            if (fontSize) {
                oStyle.fontSize = parseUnit(fontSize);
            }
            if (fontFamily) {
                oStyle.fontFamily = fontFamily;
            }
            if (lineHeight) {
                oStyle.lineHeight = lineHeight === "normal" ? 1 : lineHeight;
            }
        },
        getGradientDefs: function(doc) {
            var linearGradientEls = doc.getElementsByTagName("linearGradient"), radialGradientEls = doc.getElementsByTagName("radialGradient"), el, i, j = 0, id, xlink, elList = [], gradientDefs = {}, idsToXlinkMap = {};
            elList.length = linearGradientEls.length + radialGradientEls.length;
            i = linearGradientEls.length;
            while (i--) {
                elList[j++] = linearGradientEls[i];
            }
            i = radialGradientEls.length;
            while (i--) {
                elList[j++] = radialGradientEls[i];
            }
            while (j--) {
                el = elList[j];
                xlink = el.getAttribute("xlink:href");
                id = el.getAttribute("id");
                if (xlink) {
                    idsToXlinkMap[id] = xlink.substr(1);
                }
                gradientDefs[id] = el;
            }
            for (id in idsToXlinkMap) {
                var el2 = gradientDefs[idsToXlinkMap[id]].cloneNode(true);
                el = gradientDefs[id];
                while (el2.firstChild) {
                    el.appendChild(el2.firstChild);
                }
            }
            return gradientDefs;
        },
        parseAttributes: function(element, attributes, svgUid) {
            if (!element) {
                return;
            }
            var value, parentAttributes = {}, fontSize;
            if (typeof svgUid === "undefined") {
                svgUid = element.getAttribute("svgUid");
            }
            if (element.parentNode && reAllowedParents.test(element.parentNode.nodeName)) {
                parentAttributes = fabric.parseAttributes(element.parentNode, attributes, svgUid);
            }
            fontSize = parentAttributes && parentAttributes.fontSize || element.getAttribute("font-size") || fabric.Text.DEFAULT_SVG_FONT_SIZE;
            var ownAttributes = attributes.reduce(function(memo, attr) {
                value = element.getAttribute(attr);
                if (value) {
                    attr = normalizeAttr(attr);
                    value = normalizeValue(attr, value, parentAttributes, fontSize);
                    memo[attr] = value;
                }
                return memo;
            }, {});
            ownAttributes = extend(ownAttributes, extend(getGlobalStylesForElement(element, svgUid), fabric.parseStyleAttribute(element)));
            if (ownAttributes.font) {
                fabric.parseFontDeclaration(ownAttributes.font, ownAttributes);
            }
            return _setStrokeFillOpacity(extend(parentAttributes, ownAttributes));
        },
        parseElements: function(elements, callback, options, reviver) {
            new fabric.ElementsParser(elements, callback, options, reviver).parse();
        },
        parseStyleAttribute: function(element) {
            var oStyle = {}, style = element.getAttribute("style");
            if (!style) {
                return oStyle;
            }
            if (typeof style === "string") {
                parseStyleString(style, oStyle);
            } else {
                parseStyleObject(style, oStyle);
            }
            return oStyle;
        },
        parsePointsAttribute: function(points) {
            if (!points) {
                return null;
            }
            points = points.replace(/,/g, " ").trim();
            points = points.split(/\s+/);
            var parsedPoints = [], i, len;
            i = 0;
            len = points.length;
            for (;i < len; i += 2) {
                parsedPoints.push({
                    x: parseFloat(points[i]),
                    y: parseFloat(points[i + 1])
                });
            }
            return parsedPoints;
        },
        getCSSRules: function(doc) {
            var styles = doc.getElementsByTagName("style"), allRules = {}, rules;
            for (var i = 0, len = styles.length; i < len; i++) {
                var styleContents = styles[i].textContent;
                styleContents = styleContents.replace(/\/\*[\s\S]*?\*\//g, "");
                if (styleContents.trim() === "") {
                    continue;
                }
                rules = styleContents.match(/[^{]*\{[\s\S]*?\}/g);
                rules = rules.map(function(rule) {
                    return rule.trim();
                });
                rules.forEach(function(rule) {
                    var match = rule.match(/([\s\S]*?)\s*\{([^}]*)\}/), ruleObj = {}, declaration = match[2].trim(), propertyValuePairs = declaration.replace(/;$/, "").split(/\s*;\s*/);
                    for (var i = 0, len = propertyValuePairs.length; i < len; i++) {
                        var pair = propertyValuePairs[i].split(/\s*:\s*/), property = normalizeAttr(pair[0]), value = normalizeValue(property, pair[1], pair[0]);
                        ruleObj[property] = value;
                    }
                    rule = match[1];
                    rule.split(",").forEach(function(_rule) {
                        _rule = _rule.replace(/^svg/i, "").trim();
                        if (_rule === "") {
                            return;
                        }
                        allRules[_rule] = fabric.util.object.clone(ruleObj);
                    });
                });
            }
            return allRules;
        },
        loadSVGFromURL: function(url, callback, reviver) {
            url = url.replace(/^\n\s*/, "").trim();
            svgCache.has(url, function(hasUrl) {
                if (hasUrl) {
                    svgCache.get(url, function(value) {
                        var enlivedRecord = _enlivenCachedObject(value);
                        callback(enlivedRecord.objects, enlivedRecord.options);
                    });
                } else {
                    new fabric.util.request(url, {
                        method: "get",
                        onComplete: onComplete
                    });
                }
            });
            function onComplete(r) {
                var xml = r.responseXML;
                if (xml && !xml.documentElement && fabric.window.ActiveXObject && r.responseText) {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(r.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""));
                }
                if (!xml || !xml.documentElement) {
                    return;
                }
                fabric.parseSVGDocument(xml.documentElement, function(results, options) {
                    svgCache.set(url, {
                        objects: fabric.util.array.invoke(results, "toObject"),
                        options: options
                    });
                    callback(results, options);
                }, reviver);
            }
        },
        loadSVGFromString: function(string, callback, reviver) {
            string = string.trim();
            var doc;
            if (typeof DOMParser !== "undefined") {
                var parser = new DOMParser();
                if (parser && parser.parseFromString) {
                    doc = parser.parseFromString(string, "text/xml");
                }
            } else if (fabric.window.ActiveXObject) {
                doc = new ActiveXObject("Microsoft.XMLDOM");
                doc.async = "false";
                doc.loadXML(string.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""));
            }
            fabric.parseSVGDocument(doc.documentElement, function(results, options) {
                callback(results, options);
            }, reviver);
        },
        createSVGFontFacesMarkup: function(objects) {
            var markup = "";
            for (var i = 0, len = objects.length; i < len; i++) {
                if (objects[i].type !== "text" || !objects[i].path) {
                    continue;
                }
                markup += [ "@font-face {", "font-family: ", objects[i].fontFamily, "; ", "src: url('", objects[i].path, "')", "}" ].join("");
            }
            if (markup) {
                markup = [ '<style type="text/css">', "<![CDATA[", markup, "]]>", "</style>" ].join("");
            }
            return markup;
        },
        createSVGRefElementsMarkup: function(canvas) {
            var markup = [];
            _createSVGPattern(markup, canvas, "backgroundColor");
            _createSVGPattern(markup, canvas, "overlayColor");
            return markup.join("");
        }
    });
})(typeof exports !== "undefined" ? exports : this);

fabric.ElementsParser = function(elements, callback, options, reviver) {
    this.elements = elements;
    this.callback = callback;
    this.options = options;
    this.reviver = reviver;
    this.svgUid = options && options.svgUid || 0;
};

fabric.ElementsParser.prototype.parse = function() {
    this.instances = new Array(this.elements.length);
    this.numElements = this.elements.length;
    this.createObjects();
};

fabric.ElementsParser.prototype.createObjects = function() {
    for (var i = 0, len = this.elements.length; i < len; i++) {
        this.elements[i].setAttribute("svgUid", this.svgUid);
        (function(_this, i) {
            setTimeout(function() {
                _this.createObject(_this.elements[i], i);
            }, 0);
        })(this, i);
    }
};

fabric.ElementsParser.prototype.createObject = function(el, index) {
    var klass = fabric[fabric.util.string.capitalize(el.tagName)];
    if (klass && klass.fromElement) {
        try {
            this._createObject(klass, el, index);
        } catch (err) {
            fabric.log(err);
        }
    } else {
        this.checkIfDone();
    }
};

fabric.ElementsParser.prototype._createObject = function(klass, el, index) {
    if (klass.async) {
        klass.fromElement(el, this.createCallback(index, el), this.options);
    } else {
        var obj = klass.fromElement(el, this.options);
        this.resolveGradient(obj, "fill");
        this.resolveGradient(obj, "stroke");
        this.reviver && this.reviver(el, obj);
        this.instances[index] = obj;
        this.checkIfDone();
    }
};

fabric.ElementsParser.prototype.createCallback = function(index, el) {
    var _this = this;
    return function(obj) {
        _this.resolveGradient(obj, "fill");
        _this.resolveGradient(obj, "stroke");
        _this.reviver && _this.reviver(el, obj);
        _this.instances[index] = obj;
        _this.checkIfDone();
    };
};

fabric.ElementsParser.prototype.resolveGradient = function(obj, property) {
    var instanceFillValue = obj.get(property);
    if (!/^url\(/.test(instanceFillValue)) {
        return;
    }
    var gradientId = instanceFillValue.slice(5, instanceFillValue.length - 1);
    if (fabric.gradientDefs[this.svgUid][gradientId]) {
        obj.set(property, fabric.Gradient.fromElement(fabric.gradientDefs[this.svgUid][gradientId], obj));
    }
};

fabric.ElementsParser.prototype.checkIfDone = function() {
    if (--this.numElements === 0) {
        this.instances = this.instances.filter(function(el) {
            return el != null;
        });
        this.callback(this.instances);
    }
};

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Point) {
        fabric.warn("fabric.Point is already defined");
        return;
    }
    fabric.Point = Point;
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype = {
        constructor: Point,
        add: function(that) {
            return new Point(this.x + that.x, this.y + that.y);
        },
        addEquals: function(that) {
            this.x += that.x;
            this.y += that.y;
            return this;
        },
        scalarAdd: function(scalar) {
            return new Point(this.x + scalar, this.y + scalar);
        },
        scalarAddEquals: function(scalar) {
            this.x += scalar;
            this.y += scalar;
            return this;
        },
        subtract: function(that) {
            return new Point(this.x - that.x, this.y - that.y);
        },
        subtractEquals: function(that) {
            this.x -= that.x;
            this.y -= that.y;
            return this;
        },
        scalarSubtract: function(scalar) {
            return new Point(this.x - scalar, this.y - scalar);
        },
        scalarSubtractEquals: function(scalar) {
            this.x -= scalar;
            this.y -= scalar;
            return this;
        },
        multiply: function(scalar) {
            return new Point(this.x * scalar, this.y * scalar);
        },
        multiplyEquals: function(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        },
        divide: function(scalar) {
            return new Point(this.x / scalar, this.y / scalar);
        },
        divideEquals: function(scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        },
        eq: function(that) {
            return this.x === that.x && this.y === that.y;
        },
        lt: function(that) {
            return this.x < that.x && this.y < that.y;
        },
        lte: function(that) {
            return this.x <= that.x && this.y <= that.y;
        },
        gt: function(that) {
            return this.x > that.x && this.y > that.y;
        },
        gte: function(that) {
            return this.x >= that.x && this.y >= that.y;
        },
        lerp: function(that, t) {
            return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
        },
        distanceFrom: function(that) {
            var dx = this.x - that.x, dy = this.y - that.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
        midPointFrom: function(that) {
            return new Point(this.x + (that.x - this.x) / 2, this.y + (that.y - this.y) / 2);
        },
        min: function(that) {
            return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
        },
        max: function(that) {
            return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
        },
        toString: function() {
            return this.x + "," + this.y;
        },
        setXY: function(x, y) {
            this.x = x;
            this.y = y;
        },
        setFromPoint: function(that) {
            this.x = that.x;
            this.y = that.y;
        },
        swap: function(that) {
            var x = this.x, y = this.y;
            this.x = that.x;
            this.y = that.y;
            that.x = x;
            that.y = y;
        }
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Intersection) {
        fabric.warn("fabric.Intersection is already defined");
        return;
    }
    function Intersection(status) {
        this.status = status;
        this.points = [];
    }
    fabric.Intersection = Intersection;
    fabric.Intersection.prototype = {
        appendPoint: function(point) {
            this.points.push(point);
        },
        appendPoints: function(points) {
            this.points = this.points.concat(points);
        }
    };
    fabric.Intersection.intersectLineLine = function(a1, a2, b1, b2) {
        var result, uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x), ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x), uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if (uB !== 0) {
            var ua = uaT / uB, ub = ubT / uB;
            if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                result = new Intersection("Intersection");
                result.points.push(new fabric.Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
            } else {
                result = new Intersection();
            }
        } else {
            if (uaT === 0 || ubT === 0) {
                result = new Intersection("Coincident");
            } else {
                result = new Intersection("Parallel");
            }
        }
        return result;
    };
    fabric.Intersection.intersectLinePolygon = function(a1, a2, points) {
        var result = new Intersection(), length = points.length;
        for (var i = 0; i < length; i++) {
            var b1 = points[i], b2 = points[(i + 1) % length], inter = Intersection.intersectLineLine(a1, a2, b1, b2);
            result.appendPoints(inter.points);
        }
        if (result.points.length > 0) {
            result.status = "Intersection";
        }
        return result;
    };
    fabric.Intersection.intersectPolygonPolygon = function(points1, points2) {
        var result = new Intersection(), length = points1.length;
        for (var i = 0; i < length; i++) {
            var a1 = points1[i], a2 = points1[(i + 1) % length], inter = Intersection.intersectLinePolygon(a1, a2, points2);
            result.appendPoints(inter.points);
        }
        if (result.points.length > 0) {
            result.status = "Intersection";
        }
        return result;
    };
    fabric.Intersection.intersectPolygonRectangle = function(points, r1, r2) {
        var min = r1.min(r2), max = r1.max(r2), topRight = new fabric.Point(max.x, min.y), bottomLeft = new fabric.Point(min.x, max.y), inter1 = Intersection.intersectLinePolygon(min, topRight, points), inter2 = Intersection.intersectLinePolygon(topRight, max, points), inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points), inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points), result = new Intersection();
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);
        if (result.points.length > 0) {
            result.status = "Intersection";
        }
        return result;
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Color) {
        fabric.warn("fabric.Color is already defined.");
        return;
    }
    function Color(color) {
        if (!color) {
            this.setSource([ 0, 0, 0, 1 ]);
        } else {
            this._tryParsingColor(color);
        }
    }
    fabric.Color = Color;
    fabric.Color.prototype = {
        _tryParsingColor: function(color) {
            var source;
            if (color in Color.colorNameMap) {
                color = Color.colorNameMap[color];
            }
            if (color === "transparent") {
                this.setSource([ 255, 255, 255, 0 ]);
                return;
            }
            source = Color.sourceFromHex(color);
            if (!source) {
                source = Color.sourceFromRgb(color);
            }
            if (!source) {
                source = Color.sourceFromHsl(color);
            }
            if (source) {
                this.setSource(source);
            }
        },
        _rgbToHsl: function(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var h, s, l, max = fabric.util.array.max([ r, g, b ]), min = fabric.util.array.min([ r, g, b ]);
            l = (max + min) / 2;
            if (max === min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > .5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                  case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;

                  case g:
                    h = (b - r) / d + 2;
                    break;

                  case b:
                    h = (r - g) / d + 4;
                    break;
                }
                h /= 6;
            }
            return [ Math.round(h * 360), Math.round(s * 100), Math.round(l * 100) ];
        },
        getSource: function() {
            return this._source;
        },
        setSource: function(source) {
            this._source = source;
        },
        toRgb: function() {
            var source = this.getSource();
            return "rgb(" + source[0] + "," + source[1] + "," + source[2] + ")";
        },
        toRgba: function() {
            var source = this.getSource();
            return "rgba(" + source[0] + "," + source[1] + "," + source[2] + "," + source[3] + ")";
        },
        toHsl: function() {
            var source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
            return "hsl(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%)";
        },
        toHsla: function() {
            var source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
            return "hsla(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%," + source[3] + ")";
        },
        toHex: function() {
            var source = this.getSource(), r, g, b;
            r = source[0].toString(16);
            r = r.length === 1 ? "0" + r : r;
            g = source[1].toString(16);
            g = g.length === 1 ? "0" + g : g;
            b = source[2].toString(16);
            b = b.length === 1 ? "0" + b : b;
            return r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
        },
        getAlpha: function() {
            return this.getSource()[3];
        },
        setAlpha: function(alpha) {
            var source = this.getSource();
            source[3] = alpha;
            this.setSource(source);
            return this;
        },
        toGrayscale: function() {
            var source = this.getSource(), average = parseInt((source[0] * .3 + source[1] * .59 + source[2] * .11).toFixed(0), 10), currentAlpha = source[3];
            this.setSource([ average, average, average, currentAlpha ]);
            return this;
        },
        toBlackWhite: function(threshold) {
            var source = this.getSource(), average = (source[0] * .3 + source[1] * .59 + source[2] * .11).toFixed(0), currentAlpha = source[3];
            threshold = threshold || 127;
            average = Number(average) < Number(threshold) ? 0 : 255;
            this.setSource([ average, average, average, currentAlpha ]);
            return this;
        },
        overlayWith: function(otherColor) {
            if (!(otherColor instanceof Color)) {
                otherColor = new Color(otherColor);
            }
            var result = [], alpha = this.getAlpha(), otherAlpha = .5, source = this.getSource(), otherSource = otherColor.getSource();
            for (var i = 0; i < 3; i++) {
                result.push(Math.round(source[i] * (1 - otherAlpha) + otherSource[i] * otherAlpha));
            }
            result[3] = alpha;
            this.setSource(result);
            return this;
        }
    };
    fabric.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
    fabric.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
    fabric.Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;
    fabric.Color.colorNameMap = {
        aqua: "#00FFFF",
        black: "#000000",
        blue: "#0000FF",
        fuchsia: "#FF00FF",
        gray: "#808080",
        green: "#008000",
        lime: "#00FF00",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        orange: "#FFA500",
        purple: "#800080",
        red: "#FF0000",
        silver: "#C0C0C0",
        teal: "#008080",
        white: "#FFFFFF",
        yellow: "#FFFF00"
    };
    function hue2rgb(p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    }
    fabric.Color.fromRgb = function(color) {
        return Color.fromSource(Color.sourceFromRgb(color));
    };
    fabric.Color.sourceFromRgb = function(color) {
        var match = color.match(Color.reRGBa);
        if (match) {
            var r = parseInt(match[1], 10) / (/%$/.test(match[1]) ? 100 : 1) * (/%$/.test(match[1]) ? 255 : 1), g = parseInt(match[2], 10) / (/%$/.test(match[2]) ? 100 : 1) * (/%$/.test(match[2]) ? 255 : 1), b = parseInt(match[3], 10) / (/%$/.test(match[3]) ? 100 : 1) * (/%$/.test(match[3]) ? 255 : 1);
            return [ parseInt(r, 10), parseInt(g, 10), parseInt(b, 10), match[4] ? parseFloat(match[4]) : 1 ];
        }
    };
    fabric.Color.fromRgba = Color.fromRgb;
    fabric.Color.fromHsl = function(color) {
        return Color.fromSource(Color.sourceFromHsl(color));
    };
    fabric.Color.sourceFromHsl = function(color) {
        var match = color.match(Color.reHSLa);
        if (!match) {
            return;
        }
        var h = (parseFloat(match[1]) % 360 + 360) % 360 / 360, s = parseFloat(match[2]) / (/%$/.test(match[2]) ? 100 : 1), l = parseFloat(match[3]) / (/%$/.test(match[3]) ? 100 : 1), r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            var q = l <= .5 ? l * (s + 1) : l + s - l * s, p = l * 2 - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), match[4] ? parseFloat(match[4]) : 1 ];
    };
    fabric.Color.fromHsla = Color.fromHsl;
    fabric.Color.fromHex = function(color) {
        return Color.fromSource(Color.sourceFromHex(color));
    };
    fabric.Color.sourceFromHex = function(color) {
        if (color.match(Color.reHex)) {
            var value = color.slice(color.indexOf("#") + 1), isShortNotation = value.length === 3, r = isShortNotation ? value.charAt(0) + value.charAt(0) : value.substring(0, 2), g = isShortNotation ? value.charAt(1) + value.charAt(1) : value.substring(2, 4), b = isShortNotation ? value.charAt(2) + value.charAt(2) : value.substring(4, 6);
            return [ parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), 1 ];
        }
    };
    fabric.Color.fromSource = function(source) {
        var oColor = new Color();
        oColor.setSource(source);
        return oColor;
    };
})(typeof exports !== "undefined" ? exports : this);

(function() {
    function getColorStop(el) {
        var style = el.getAttribute("style"), offset = el.getAttribute("offset"), color, colorAlpha, opacity;
        offset = parseFloat(offset) / (/%$/.test(offset) ? 100 : 1);
        offset = offset < 0 ? 0 : offset > 1 ? 1 : offset;
        if (style) {
            var keyValuePairs = style.split(/\s*;\s*/);
            if (keyValuePairs[keyValuePairs.length - 1] === "") {
                keyValuePairs.pop();
            }
            for (var i = keyValuePairs.length; i--; ) {
                var split = keyValuePairs[i].split(/\s*:\s*/), key = split[0].trim(), value = split[1].trim();
                if (key === "stop-color") {
                    color = value;
                } else if (key === "stop-opacity") {
                    opacity = value;
                }
            }
        }
        if (!color) {
            color = el.getAttribute("stop-color") || "rgb(0,0,0)";
        }
        if (!opacity) {
            opacity = el.getAttribute("stop-opacity");
        }
        color = new fabric.Color(color);
        colorAlpha = color.getAlpha();
        opacity = isNaN(parseFloat(opacity)) ? 1 : parseFloat(opacity);
        opacity *= colorAlpha;
        return {
            offset: offset,
            color: color.toRgb(),
            opacity: opacity
        };
    }
    function getLinearCoords(el) {
        return {
            x1: el.getAttribute("x1") || 0,
            y1: el.getAttribute("y1") || 0,
            x2: el.getAttribute("x2") || "100%",
            y2: el.getAttribute("y2") || 0
        };
    }
    function getRadialCoords(el) {
        return {
            x1: el.getAttribute("fx") || el.getAttribute("cx") || "50%",
            y1: el.getAttribute("fy") || el.getAttribute("cy") || "50%",
            r1: 0,
            x2: el.getAttribute("cx") || "50%",
            y2: el.getAttribute("cy") || "50%",
            r2: el.getAttribute("r") || "50%"
        };
    }
    fabric.Gradient = fabric.util.createClass({
        offsetX: 0,
        offsetY: 0,
        initialize: function(options) {
            options || (options = {});
            var coords = {};
            this.id = fabric.Object.__uid++;
            this.type = options.type || "linear";
            coords = {
                x1: options.coords.x1 || 0,
                y1: options.coords.y1 || 0,
                x2: options.coords.x2 || 0,
                y2: options.coords.y2 || 0
            };
            if (this.type === "radial") {
                coords.r1 = options.coords.r1 || 0;
                coords.r2 = options.coords.r2 || 0;
            }
            this.coords = coords;
            this.colorStops = options.colorStops.slice();
            if (options.gradientTransform) {
                this.gradientTransform = options.gradientTransform;
            }
            this.offsetX = options.offsetX || this.offsetX;
            this.offsetY = options.offsetY || this.offsetY;
        },
        addColorStop: function(colorStop) {
            for (var position in colorStop) {
                var color = new fabric.Color(colorStop[position]);
                this.colorStops.push({
                    offset: position,
                    color: color.toRgb(),
                    opacity: color.getAlpha()
                });
            }
            return this;
        },
        toObject: function() {
            return {
                type: this.type,
                coords: this.coords,
                colorStops: this.colorStops,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            };
        },
        toSVG: function(object) {
            var coords = fabric.util.object.clone(this.coords), markup, commonAttributes;
            this.colorStops.sort(function(a, b) {
                return a.offset - b.offset;
            });
            if (!(object.group && object.group.type === "path-group")) {
                for (var prop in coords) {
                    if (prop === "x1" || prop === "x2" || prop === "r2") {
                        coords[prop] += this.offsetX - object.width / 2;
                    } else if (prop === "y1" || prop === "y2") {
                        coords[prop] += this.offsetY - object.height / 2;
                    }
                }
            }
            commonAttributes = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"';
            if (this.gradientTransform) {
                commonAttributes += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" ';
            }
            if (this.type === "linear") {
                markup = [ "<linearGradient ", commonAttributes, ' x1="', coords.x1, '" y1="', coords.y1, '" x2="', coords.x2, '" y2="', coords.y2, '">\n' ];
            } else if (this.type === "radial") {
                markup = [ "<radialGradient ", commonAttributes, ' cx="', coords.x2, '" cy="', coords.y2, '" r="', coords.r2, '" fx="', coords.x1, '" fy="', coords.y1, '">\n' ];
            }
            for (var i = 0; i < this.colorStops.length; i++) {
                markup.push("<stop ", 'offset="', this.colorStops[i].offset * 100 + "%", '" style="stop-color:', this.colorStops[i].color, this.colorStops[i].opacity != null ? ";stop-opacity: " + this.colorStops[i].opacity : ";", '"/>\n');
            }
            markup.push(this.type === "linear" ? "</linearGradient>\n" : "</radialGradient>\n");
            return markup.join("");
        },
        toLive: function(ctx, object) {
            var gradient, prop, coords = fabric.util.object.clone(this.coords);
            if (!this.type) {
                return;
            }
            if (object.group && object.group.type === "path-group") {
                for (prop in coords) {
                    if (prop === "x1" || prop === "x2") {
                        coords[prop] += -this.offsetX + object.width / 2;
                    } else if (prop === "y1" || prop === "y2") {
                        coords[prop] += -this.offsetY + object.height / 2;
                    }
                }
            }
            if (this.type === "linear") {
                gradient = ctx.createLinearGradient(coords.x1, coords.y1, coords.x2, coords.y2);
            } else if (this.type === "radial") {
                gradient = ctx.createRadialGradient(coords.x1, coords.y1, coords.r1, coords.x2, coords.y2, coords.r2);
            }
            for (var i = 0, len = this.colorStops.length; i < len; i++) {
                var color = this.colorStops[i].color, opacity = this.colorStops[i].opacity, offset = this.colorStops[i].offset;
                if (typeof opacity !== "undefined") {
                    color = new fabric.Color(color).setAlpha(opacity).toRgba();
                }
                gradient.addColorStop(parseFloat(offset), color);
            }
            return gradient;
        }
    });
    fabric.util.object.extend(fabric.Gradient, {
        fromElement: function(el, instance) {
            var colorStopEls = el.getElementsByTagName("stop"), type = el.nodeName === "linearGradient" ? "linear" : "radial", gradientUnits = el.getAttribute("gradientUnits") || "objectBoundingBox", gradientTransform = el.getAttribute("gradientTransform"), colorStops = [], coords = {}, ellipseMatrix;
            if (type === "linear") {
                coords = getLinearCoords(el);
            } else if (type === "radial") {
                coords = getRadialCoords(el);
            }
            for (var i = colorStopEls.length; i--; ) {
                colorStops.push(getColorStop(colorStopEls[i]));
            }
            ellipseMatrix = _convertPercentUnitsToValues(instance, coords, gradientUnits);
            var gradient = new fabric.Gradient({
                type: type,
                coords: coords,
                colorStops: colorStops,
                offsetX: -instance.left,
                offsetY: -instance.top
            });
            if (gradientTransform || ellipseMatrix !== "") {
                gradient.gradientTransform = fabric.parseTransformAttribute((gradientTransform || "") + ellipseMatrix);
            }
            return gradient;
        },
        forObject: function(obj, options) {
            options || (options = {});
            _convertPercentUnitsToValues(obj, options.coords, "userSpaceOnUse");
            return new fabric.Gradient(options);
        }
    });
    function _convertPercentUnitsToValues(object, options, gradientUnits) {
        var propValue, addFactor = 0, multFactor = 1, ellipseMatrix = "";
        for (var prop in options) {
            propValue = parseFloat(options[prop], 10);
            if (typeof options[prop] === "string" && /^\d+%$/.test(options[prop])) {
                multFactor = .01;
            } else {
                multFactor = 1;
            }
            if (prop === "x1" || prop === "x2" || prop === "r2") {
                multFactor *= gradientUnits === "objectBoundingBox" ? object.width : 1;
                addFactor = gradientUnits === "objectBoundingBox" ? object.left || 0 : 0;
            } else if (prop === "y1" || prop === "y2") {
                multFactor *= gradientUnits === "objectBoundingBox" ? object.height : 1;
                addFactor = gradientUnits === "objectBoundingBox" ? object.top || 0 : 0;
            }
            options[prop] = propValue * multFactor + addFactor;
        }
        if (object.type === "ellipse" && options.r2 !== null && gradientUnits === "objectBoundingBox" && object.rx !== object.ry) {
            var scaleFactor = object.ry / object.rx;
            ellipseMatrix = " scale(1, " + scaleFactor + ")";
            if (options.y1) {
                options.y1 /= scaleFactor;
            }
            if (options.y2) {
                options.y2 /= scaleFactor;
            }
        }
        return ellipseMatrix;
    }
})();

fabric.Pattern = fabric.util.createClass({
    repeat: "repeat",
    offsetX: 0,
    offsetY: 0,
    initialize: function(options) {
        options || (options = {});
        this.id = fabric.Object.__uid++;
        if (options.source) {
            if (typeof options.source === "string") {
                if (typeof fabric.util.getFunctionBody(options.source) !== "undefined") {
                    this.source = new Function(fabric.util.getFunctionBody(options.source));
                } else {
                    var _this = this;
                    this.source = fabric.util.createImage();
                    fabric.util.loadImage(options.source, function(img) {
                        _this.source = img;
                    });
                }
            } else {
                this.source = options.source;
            }
        }
        if (options.repeat) {
            this.repeat = options.repeat;
        }
        if (options.offsetX) {
            this.offsetX = options.offsetX;
        }
        if (options.offsetY) {
            this.offsetY = options.offsetY;
        }
    },
    toObject: function() {
        var source;
        if (typeof this.source === "function") {
            source = String(this.source);
        } else if (typeof this.source.src === "string") {
            source = this.source.src;
        } else if (typeof this.source === "object" && this.source.toDataURL) {
            source = this.source.toDataURL();
        }
        return {
            source: source,
            repeat: this.repeat,
            offsetX: this.offsetX,
            offsetY: this.offsetY
        };
    },
    toSVG: function(object) {
        var patternSource = typeof this.source === "function" ? this.source() : this.source, patternWidth = patternSource.width / object.getWidth(), patternHeight = patternSource.height / object.getHeight(), patternOffsetX = this.offsetX / object.getWidth(), patternOffsetY = this.offsetY / object.getHeight(), patternImgSrc = "";
        if (this.repeat === "repeat-x" || this.repeat === "no-repeat") {
            patternHeight = 1;
        }
        if (this.repeat === "repeat-y" || this.repeat === "no-repeat") {
            patternWidth = 1;
        }
        if (patternSource.src) {
            patternImgSrc = patternSource.src;
        } else if (patternSource.toDataURL) {
            patternImgSrc = patternSource.toDataURL();
        }
        return '<pattern id="SVGID_' + this.id + '" x="' + patternOffsetX + '" y="' + patternOffsetY + '" width="' + patternWidth + '" height="' + patternHeight + '">\n' + '<image x="0" y="0"' + ' width="' + patternSource.width + '" height="' + patternSource.height + '" xlink:href="' + patternImgSrc + '"></image>\n' + "</pattern>\n";
    },
    toLive: function(ctx) {
        var source = typeof this.source === "function" ? this.source() : this.source;
        if (!source) {
            return "";
        }
        if (typeof source.src !== "undefined") {
            if (!source.complete) {
                return "";
            }
            if (source.naturalWidth === 0 || source.naturalHeight === 0) {
                return "";
            }
        }
        return ctx.createPattern(source, this.repeat);
    }
});

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), toFixed = fabric.util.toFixed;
    if (fabric.Shadow) {
        fabric.warn("fabric.Shadow is already defined.");
        return;
    }
    fabric.Shadow = fabric.util.createClass({
        color: "rgb(0,0,0)",
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: false,
        includeDefaultValues: true,
        initialize: function(options) {
            if (typeof options === "string") {
                options = this._parseShadow(options);
            }
            for (var prop in options) {
                this[prop] = options[prop];
            }
            this.id = fabric.Object.__uid++;
        },
        _parseShadow: function(shadow) {
            var shadowStr = shadow.trim(), offsetsAndBlur = fabric.Shadow.reOffsetsAndBlur.exec(shadowStr) || [], color = shadowStr.replace(fabric.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)";
            return {
                color: color.trim(),
                offsetX: parseInt(offsetsAndBlur[1], 10) || 0,
                offsetY: parseInt(offsetsAndBlur[2], 10) || 0,
                blur: parseInt(offsetsAndBlur[3], 10) || 0
            };
        },
        toString: function() {
            return [ this.offsetX, this.offsetY, this.blur, this.color ].join("px ");
        },
        toSVG: function(object) {
            var fBoxX = 40, fBoxY = 40;
            if (object.width && object.height) {
                fBoxX = toFixed((Math.abs(this.offsetX) + this.blur) / object.width, 2) * 100 + 20;
                fBoxY = toFixed((Math.abs(this.offsetY) + this.blur) / object.height, 2) * 100 + 20;
            }
            return '<filter id="SVGID_' + this.id + '" y="-' + fBoxY + '%" height="' + (100 + 2 * fBoxY) + '%" ' + 'x="-' + fBoxX + '%" width="' + (100 + 2 * fBoxX) + '%" ' + ">\n" + '	<feGaussianBlur in="SourceAlpha" stdDeviation="' + toFixed(this.blur ? this.blur / 2 : 0, 3) + '"></feGaussianBlur>\n' + '	<feOffset dx="' + this.offsetX + '" dy="' + this.offsetY + '" result="oBlur" ></feOffset>\n' + '	<feFlood flood-color="' + this.color + '"/>\n' + '	<feComposite in2="oBlur" operator="in" />\n' + "	<feMerge>\n" + "		<feMergeNode></feMergeNode>\n" + '		<feMergeNode in="SourceGraphic"></feMergeNode>\n' + "	</feMerge>\n" + "</filter>\n";
        },
        toObject: function() {
            if (this.includeDefaultValues) {
                return {
                    color: this.color,
                    blur: this.blur,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY
                };
            }
            var obj = {}, proto = fabric.Shadow.prototype;
            if (this.color !== proto.color) {
                obj.color = this.color;
            }
            if (this.blur !== proto.blur) {
                obj.blur = this.blur;
            }
            if (this.offsetX !== proto.offsetX) {
                obj.offsetX = this.offsetX;
            }
            if (this.offsetY !== proto.offsetY) {
                obj.offsetY = this.offsetY;
            }
            return obj;
        }
    });
    fabric.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/;
})(typeof exports !== "undefined" ? exports : this);

(function() {
    "use strict";
    if (fabric.StaticCanvas) {
        fabric.warn("fabric.StaticCanvas is already defined.");
        return;
    }
    var extend = fabric.util.object.extend, getElementOffset = fabric.util.getElementOffset, removeFromArray = fabric.util.removeFromArray, CANVAS_INIT_ERROR = new Error("Could not initialize `canvas` element");
    fabric.StaticCanvas = fabric.util.createClass({
        initialize: function(el, options) {
            options || (options = {});
            this._initStatic(el, options);
            fabric.StaticCanvas.activeInstance = this;
        },
        backgroundColor: "",
        backgroundImage: null,
        overlayColor: "",
        overlayImage: null,
        includeDefaultValues: true,
        stateful: true,
        renderOnAddRemove: true,
        clipTo: null,
        controlsAboveOverlay: false,
        allowTouchScrolling: false,
        imageSmoothingEnabled: true,
        preserveObjectStacking: false,
        viewportTransform: [ 1, 0, 0, 1, 0, 0 ],
        onBeforeScaleRotate: function() {},
        enableRetinaScaling: true,
        _initStatic: function(el, options) {
            this._objects = [];
            this._createLowerCanvas(el);
            this._initOptions(options);
            this._setImageSmoothing();
            if (!this.interactive) {
                this._initRetinaScaling();
            }
            if (options.overlayImage) {
                this.setOverlayImage(options.overlayImage, this.renderAll.bind(this));
            }
            if (options.backgroundImage) {
                this.setBackgroundImage(options.backgroundImage, this.renderAll.bind(this));
            }
            if (options.backgroundColor) {
                this.setBackgroundColor(options.backgroundColor, this.renderAll.bind(this));
            }
            if (options.overlayColor) {
                this.setOverlayColor(options.overlayColor, this.renderAll.bind(this));
            }
            this.calcOffset();
        },
        _initRetinaScaling: function() {
            if (fabric.devicePixelRatio === 1 || !this.enableRetinaScaling) {
                return;
            }
            this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio);
            this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio);
            this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio);
        },
        calcOffset: function() {
            this._offset = getElementOffset(this.lowerCanvasEl);
            return this;
        },
        setOverlayImage: function(image, callback, options) {
            return this.__setBgOverlayImage("overlayImage", image, callback, options);
        },
        setBackgroundImage: function(image, callback, options) {
            return this.__setBgOverlayImage("backgroundImage", image, callback, options);
        },
        setOverlayColor: function(overlayColor, callback) {
            return this.__setBgOverlayColor("overlayColor", overlayColor, callback);
        },
        setBackgroundColor: function(backgroundColor, callback) {
            return this.__setBgOverlayColor("backgroundColor", backgroundColor, callback);
        },
        _setImageSmoothing: function() {
            var ctx = this.getContext();
            if (typeof ctx.imageSmoothingEnabled !== "undefined") {
                ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
                return;
            }
            ctx.webkitImageSmoothingEnabled = this.imageSmoothingEnabled;
            ctx.mozImageSmoothingEnabled = this.imageSmoothingEnabled;
            ctx.msImageSmoothingEnabled = this.imageSmoothingEnabled;
            ctx.oImageSmoothingEnabled = this.imageSmoothingEnabled;
        },
        __setBgOverlayImage: function(property, image, callback, options) {
            if (typeof image === "string") {
                fabric.util.loadImage(image, function(img) {
                    this[property] = new fabric.Image(img, options);
                    callback && callback();
                }, this, options && options.crossOrigin);
            } else {
                options && image.setOptions(options);
                this[property] = image;
                callback && callback();
            }
            return this;
        },
        __setBgOverlayColor: function(property, color, callback) {
            if (color && color.source) {
                var _this = this;
                fabric.util.loadImage(color.source, function(img) {
                    _this[property] = new fabric.Pattern({
                        source: img,
                        repeat: color.repeat,
                        offsetX: color.offsetX,
                        offsetY: color.offsetY
                    });
                    callback && callback();
                });
            } else {
                this[property] = color;
                callback && callback();
            }
            return this;
        },
        _createCanvasElement: function() {
            var element = fabric.document.createElement("canvas");
            if (!element.style) {
                element.style = {};
            }
            if (!element) {
                throw CANVAS_INIT_ERROR;
            }
            this._initCanvasElement(element);
            return element;
        },
        _initCanvasElement: function(element) {
            fabric.util.createCanvasElement(element);
            if (typeof element.getContext === "undefined") {
                throw CANVAS_INIT_ERROR;
            }
        },
        _initOptions: function(options) {
            for (var prop in options) {
                this[prop] = options[prop];
            }
            this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0;
            this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0;
            if (!this.lowerCanvasEl.style) {
                return;
            }
            this.lowerCanvasEl.width = this.width;
            this.lowerCanvasEl.height = this.height;
            this.lowerCanvasEl.style.width = this.width + "px";
            this.lowerCanvasEl.style.height = this.height + "px";
            this.viewportTransform = this.viewportTransform.slice();
        },
        _createLowerCanvas: function(canvasEl) {
            this.lowerCanvasEl = fabric.util.getById(canvasEl) || this._createCanvasElement();
            this._initCanvasElement(this.lowerCanvasEl);
            fabric.util.addClass(this.lowerCanvasEl, "lower-canvas");
            if (this.interactive) {
                this._applyCanvasStyle(this.lowerCanvasEl);
            }
            this.contextContainer = this.lowerCanvasEl.getContext("2d");
        },
        getWidth: function() {
            return this.width;
        },
        getHeight: function() {
            return this.height;
        },
        setWidth: function(value, options) {
            return this.setDimensions({
                width: value
            }, options);
        },
        setHeight: function(value, options) {
            return this.setDimensions({
                height: value
            }, options);
        },
        setDimensions: function(dimensions, options) {
            var cssValue;
            options = options || {};
            for (var prop in dimensions) {
                cssValue = dimensions[prop];
                if (!options.cssOnly) {
                    this._setBackstoreDimension(prop, dimensions[prop]);
                    cssValue += "px";
                }
                if (!options.backstoreOnly) {
                    this._setCssDimension(prop, cssValue);
                }
            }
            this._setImageSmoothing();
            this.calcOffset();
            if (!options.cssOnly) {
                this.renderAll();
            }
            return this;
        },
        _setBackstoreDimension: function(prop, value) {
            this.lowerCanvasEl[prop] = value;
            if (this.upperCanvasEl) {
                this.upperCanvasEl[prop] = value;
            }
            if (this.cacheCanvasEl) {
                this.cacheCanvasEl[prop] = value;
            }
            this[prop] = value;
            return this;
        },
        _setCssDimension: function(prop, value) {
            this.lowerCanvasEl.style[prop] = value;
            if (this.upperCanvasEl) {
                this.upperCanvasEl.style[prop] = value;
            }
            if (this.wrapperEl) {
                this.wrapperEl.style[prop] = value;
            }
            return this;
        },
        getZoom: function() {
            return Math.sqrt(this.viewportTransform[0] * this.viewportTransform[3]);
        },
        setViewportTransform: function(vpt) {
            var activeGroup = this.getActiveGroup();
            this.viewportTransform = vpt;
            this.renderAll();
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._objects[i].setCoords();
            }
            if (activeGroup) {
                activeGroup.setCoords();
            }
            return this;
        },
        zoomToPoint: function(point, value) {
            var before = point;
            point = fabric.util.transformPoint(point, fabric.util.invertTransform(this.viewportTransform));
            this.viewportTransform[0] = value;
            this.viewportTransform[3] = value;
            var after = fabric.util.transformPoint(point, this.viewportTransform);
            this.viewportTransform[4] += before.x - after.x;
            this.viewportTransform[5] += before.y - after.y;
            this.renderAll();
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._objects[i].setCoords();
            }
            return this;
        },
        setZoom: function(value) {
            this.zoomToPoint(new fabric.Point(0, 0), value);
            return this;
        },
        absolutePan: function(point) {
            this.viewportTransform[4] = -point.x;
            this.viewportTransform[5] = -point.y;
            this.renderAll();
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._objects[i].setCoords();
            }
            return this;
        },
        relativePan: function(point) {
            return this.absolutePan(new fabric.Point(-point.x - this.viewportTransform[4], -point.y - this.viewportTransform[5]));
        },
        getElement: function() {
            return this.lowerCanvasEl;
        },
        getActiveObject: function() {
            return null;
        },
        getActiveGroup: function() {
            return null;
        },
        _draw: function(ctx, object) {
            if (!object) {
                return;
            }
            ctx.save();
            var v = this.viewportTransform;
            ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
            if (this._shouldRenderObject(object)) {
                object.render(ctx);
            }
            ctx.restore();
            if (!this.controlsAboveOverlay) {
                object._renderControls(ctx);
            }
        },
        _shouldRenderObject: function(object) {
            if (!object) {
                return false;
            }
            return object !== this.getActiveGroup() || !this.preserveObjectStacking;
        },
        _onObjectAdded: function(obj) {
            this.stateful && obj.setupState();
            obj._set("canvas", this);
            obj.setCoords();
            this.fire("object:added", {
                target: obj
            });
            obj.fire("added");
        },
        _onObjectRemoved: function(obj) {
            if (this.getActiveObject() === obj) {
                this.fire("before:selection:cleared", {
                    target: obj
                });
                this._discardActiveObject();
                this.fire("selection:cleared");
            }
            this.fire("object:removed", {
                target: obj
            });
            obj.fire("removed");
        },
        clearContext: function(ctx) {
            ctx.clearRect(0, 0, this.width, this.height);
            return this;
        },
        getContext: function() {
            return this.contextContainer;
        },
        clear: function() {
            this._objects.length = 0;
            if (this.discardActiveGroup) {
                this.discardActiveGroup();
            }
            if (this.discardActiveObject) {
                this.discardActiveObject();
            }
            this.clearContext(this.contextContainer);
            if (this.contextTop) {
                this.clearContext(this.contextTop);
            }
            this.fire("canvas:cleared");
            this.renderAll();
            return this;
        },
        renderAll: function(allOnTop) {
            var canvasToDrawOn = this[allOnTop === true && this.interactive ? "contextTop" : "contextContainer"], activeGroup = this.getActiveGroup();
            if (this.contextTop && this.selection && !this._groupSelector) {
                this.clearContext(this.contextTop);
            }
            if (!allOnTop) {
                this.clearContext(canvasToDrawOn);
            }
            this.fire("before:render");
            if (this.clipTo) {
                fabric.util.clipContext(this, canvasToDrawOn);
            }
            this._renderBackground(canvasToDrawOn);
            this._renderObjects(canvasToDrawOn, activeGroup);
            this._renderActiveGroup(canvasToDrawOn, activeGroup);
            if (this.clipTo) {
                canvasToDrawOn.restore();
            }
            this._renderOverlay(canvasToDrawOn);
            if (this.controlsAboveOverlay && this.interactive) {
                this.drawControls(canvasToDrawOn);
            }
            this.fire("after:render");
            return this;
        },
        _renderObjects: function(ctx, activeGroup) {
            var i, length;
            if (!activeGroup || this.preserveObjectStacking) {
                for (i = 0, length = this._objects.length; i < length; ++i) {
                    this._draw(ctx, this._objects[i]);
                }
            } else {
                for (i = 0, length = this._objects.length; i < length; ++i) {
                    if (this._objects[i] && !activeGroup.contains(this._objects[i])) {
                        this._draw(ctx, this._objects[i]);
                    }
                }
            }
        },
        _renderActiveGroup: function(ctx, activeGroup) {
            if (activeGroup) {
                var sortedObjects = [];
                this.forEachObject(function(object) {
                    if (activeGroup.contains(object)) {
                        sortedObjects.push(object);
                    }
                });
                activeGroup._set("_objects", sortedObjects.reverse());
                this._draw(ctx, activeGroup);
            }
        },
        _renderBackground: function(ctx) {
            if (this.backgroundColor) {
                ctx.fillStyle = this.backgroundColor.toLive ? this.backgroundColor.toLive(ctx) : this.backgroundColor;
                ctx.fillRect(this.backgroundColor.offsetX || 0, this.backgroundColor.offsetY || 0, this.width, this.height);
            }
            if (this.backgroundImage) {
                this._draw(ctx, this.backgroundImage);
            }
        },
        _renderOverlay: function(ctx) {
            if (this.overlayColor) {
                ctx.fillStyle = this.overlayColor.toLive ? this.overlayColor.toLive(ctx) : this.overlayColor;
                ctx.fillRect(this.overlayColor.offsetX || 0, this.overlayColor.offsetY || 0, this.width, this.height);
            }
            if (this.overlayImage) {
                this._draw(ctx, this.overlayImage);
            }
        },
        renderTop: function() {
            var ctx = this.contextTop || this.contextContainer;
            this.clearContext(ctx);
            if (this.selection && this._groupSelector) {
                this._drawSelection();
            }
            var activeGroup = this.getActiveGroup();
            if (activeGroup) {
                activeGroup.render(ctx);
            }
            this._renderOverlay(ctx);
            this.fire("after:render");
            return this;
        },
        getCenter: function() {
            return {
                top: this.getHeight() / 2,
                left: this.getWidth() / 2
            };
        },
        centerObjectH: function(object) {
            this._centerObject(object, new fabric.Point(this.getCenter().left, object.getCenterPoint().y));
            this.renderAll();
            return this;
        },
        centerObjectV: function(object) {
            this._centerObject(object, new fabric.Point(object.getCenterPoint().x, this.getCenter().top));
            this.renderAll();
            return this;
        },
        centerObject: function(object) {
            var center = this.getCenter();
            this._centerObject(object, new fabric.Point(center.left, center.top));
            this.renderAll();
            return this;
        },
        _centerObject: function(object, center) {
            object.setPositionByOrigin(center, "center", "center");
            return this;
        },
        toDatalessJSON: function(propertiesToInclude) {
            return this.toDatalessObject(propertiesToInclude);
        },
        toObject: function(propertiesToInclude) {
            return this._toObjectMethod("toObject", propertiesToInclude);
        },
        toDatalessObject: function(propertiesToInclude) {
            return this._toObjectMethod("toDatalessObject", propertiesToInclude);
        },
        _toObjectMethod: function(methodName, propertiesToInclude) {
            var data = {
                objects: this._toObjects(methodName, propertiesToInclude)
            };
            extend(data, this.__serializeBgOverlay());
            fabric.util.populateWithProperties(this, data, propertiesToInclude);
            return data;
        },
        _toObjects: function(methodName, propertiesToInclude) {
            return this.getObjects().map(function(instance) {
                return this._toObject(instance, methodName, propertiesToInclude);
            }, this);
        },
        _toObject: function(instance, methodName, propertiesToInclude) {
            var originalValue;
            if (!this.includeDefaultValues) {
                originalValue = instance.includeDefaultValues;
                instance.includeDefaultValues = false;
            }
            var originalProperties = this._realizeGroupTransformOnObject(instance), object = instance[methodName](propertiesToInclude);
            if (!this.includeDefaultValues) {
                instance.includeDefaultValues = originalValue;
            }
            this._unwindGroupTransformOnObject(instance, originalProperties);
            return object;
        },
        _realizeGroupTransformOnObject: function(instance) {
            var layoutProps = [ "angle", "flipX", "flipY", "height", "left", "scaleX", "scaleY", "top", "width" ];
            if (instance.group && instance.group === this.getActiveGroup()) {
                var originalValues = {};
                layoutProps.forEach(function(prop) {
                    originalValues[prop] = instance[prop];
                });
                this.getActiveGroup().realizeTransform(instance);
                return originalValues;
            } else {
                return null;
            }
        },
        _unwindGroupTransformOnObject: function(instance, originalValues) {
            if (originalValues) {
                instance.set(originalValues);
            }
        },
        __serializeBgOverlay: function() {
            var data = {
                background: this.backgroundColor && this.backgroundColor.toObject ? this.backgroundColor.toObject() : this.backgroundColor
            };
            if (this.overlayColor) {
                data.overlay = this.overlayColor.toObject ? this.overlayColor.toObject() : this.overlayColor;
            }
            if (this.backgroundImage) {
                data.backgroundImage = this.backgroundImage.toObject();
            }
            if (this.overlayImage) {
                data.overlayImage = this.overlayImage.toObject();
            }
            return data;
        },
        svgViewportTransformation: true,
        toSVG: function(options, reviver) {
            options || (options = {});
            var markup = [];
            this._setSVGPreamble(markup, options);
            this._setSVGHeader(markup, options);
            this._setSVGBgOverlayColor(markup, "backgroundColor");
            this._setSVGBgOverlayImage(markup, "backgroundImage");
            this._setSVGObjects(markup, reviver);
            this._setSVGBgOverlayColor(markup, "overlayColor");
            this._setSVGBgOverlayImage(markup, "overlayImage");
            markup.push("</svg>");
            return markup.join("");
        },
        _setSVGPreamble: function(markup, options) {
            if (!options.suppressPreamble) {
                markup.push('<?xml version="1.0" encoding="', options.encoding || "UTF-8", '" standalone="no" ?>', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n');
            }
        },
        _setSVGHeader: function(markup, options) {
            var width, height, vpt;
            if (options.viewBox) {
                width = options.viewBox.width;
                height = options.viewBox.height;
            } else {
                width = this.width;
                height = this.height;
                if (!this.svgViewportTransformation) {
                    vpt = this.viewportTransform;
                    width /= vpt[0];
                    height /= vpt[3];
                }
            }
            markup.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', width, '" ', 'height="', height, '" ', this.backgroundColor && !this.backgroundColor.toLive ? 'style="background-color: ' + this.backgroundColor + '" ' : null, options.viewBox ? 'viewBox="' + options.viewBox.x + " " + options.viewBox.y + " " + options.viewBox.width + " " + options.viewBox.height + '" ' : null, 'xml:space="preserve">', "<desc>Created with Fabric.js ", fabric.version, "</desc>", "<defs>", fabric.createSVGFontFacesMarkup(this.getObjects()), fabric.createSVGRefElementsMarkup(this), "</defs>");
        },
        _setSVGObjects: function(markup, reviver) {
            for (var i = 0, objects = this.getObjects(), len = objects.length; i < len; i++) {
                var instance = objects[i], originalProperties = this._realizeGroupTransformOnObject(instance);
                markup.push(instance.toSVG(reviver));
                this._unwindGroupTransformOnObject(instance, originalProperties);
            }
        },
        _setSVGBgOverlayImage: function(markup, property) {
            if (this[property] && this[property].toSVG) {
                markup.push(this[property].toSVG());
            }
        },
        _setSVGBgOverlayColor: function(markup, property) {
            if (this[property] && this[property].source) {
                markup.push('<rect x="', this[property].offsetX, '" y="', this[property].offsetY, '" ', 'width="', this[property].repeat === "repeat-y" || this[property].repeat === "no-repeat" ? this[property].source.width : this.width, '" height="', this[property].repeat === "repeat-x" || this[property].repeat === "no-repeat" ? this[property].source.height : this.height, '" fill="url(#' + property + 'Pattern)"', "></rect>");
            } else if (this[property] && property === "overlayColor") {
                markup.push('<rect x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" fill="', this[property], '"', "></rect>");
            }
        },
        sendToBack: function(object) {
            removeFromArray(this._objects, object);
            this._objects.unshift(object);
            return this.renderAll && this.renderAll();
        },
        bringToFront: function(object) {
            removeFromArray(this._objects, object);
            this._objects.push(object);
            return this.renderAll && this.renderAll();
        },
        sendBackwards: function(object, intersecting) {
            var idx = this._objects.indexOf(object);
            if (idx !== 0) {
                var newIdx = this._findNewLowerIndex(object, idx, intersecting);
                removeFromArray(this._objects, object);
                this._objects.splice(newIdx, 0, object);
                this.renderAll && this.renderAll();
            }
            return this;
        },
        _findNewLowerIndex: function(object, idx, intersecting) {
            var newIdx;
            if (intersecting) {
                newIdx = idx;
                for (var i = idx - 1; i >= 0; --i) {
                    var isIntersecting = object.intersectsWithObject(this._objects[i]) || object.isContainedWithinObject(this._objects[i]) || this._objects[i].isContainedWithinObject(object);
                    if (isIntersecting) {
                        newIdx = i;
                        break;
                    }
                }
            } else {
                newIdx = idx - 1;
            }
            return newIdx;
        },
        bringForward: function(object, intersecting) {
            var idx = this._objects.indexOf(object);
            if (idx !== this._objects.length - 1) {
                var newIdx = this._findNewUpperIndex(object, idx, intersecting);
                removeFromArray(this._objects, object);
                this._objects.splice(newIdx, 0, object);
                this.renderAll && this.renderAll();
            }
            return this;
        },
        _findNewUpperIndex: function(object, idx, intersecting) {
            var newIdx;
            if (intersecting) {
                newIdx = idx;
                for (var i = idx + 1; i < this._objects.length; ++i) {
                    var isIntersecting = object.intersectsWithObject(this._objects[i]) || object.isContainedWithinObject(this._objects[i]) || this._objects[i].isContainedWithinObject(object);
                    if (isIntersecting) {
                        newIdx = i;
                        break;
                    }
                }
            } else {
                newIdx = idx + 1;
            }
            return newIdx;
        },
        moveTo: function(object, index) {
            removeFromArray(this._objects, object);
            this._objects.splice(index, 0, object);
            return this.renderAll && this.renderAll();
        },
        dispose: function() {
            this.clear();
            this.interactive && this.removeListeners();
            return this;
        },
        toString: function() {
            return "#<fabric.Canvas (" + this.complexity() + "): " + "{ objects: " + this.getObjects().length + " }>";
        }
    });
    extend(fabric.StaticCanvas.prototype, fabric.Observable);
    extend(fabric.StaticCanvas.prototype, fabric.Collection);
    extend(fabric.StaticCanvas.prototype, fabric.DataURLExporter);
    extend(fabric.StaticCanvas, {
        EMPTY_JSON: '{"objects": [], "background": "white"}',
        supports: function(methodName) {
            var el = fabric.util.createCanvasElement();
            if (!el || !el.getContext) {
                return null;
            }
            var ctx = el.getContext("2d");
            if (!ctx) {
                return null;
            }
            switch (methodName) {
              case "getImageData":
                return typeof ctx.getImageData !== "undefined";

              case "setLineDash":
                return typeof ctx.setLineDash !== "undefined";

              case "toDataURL":
                return typeof el.toDataURL !== "undefined";

              case "toDataURLWithQuality":
                try {
                    el.toDataURL("image/jpeg", 0);
                    return true;
                } catch (e) {}
                return false;

              default:
                return null;
            }
        }
    });
    fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject;
})();

fabric.BaseBrush = fabric.util.createClass({
    color: "rgb(0, 0, 0)",
    width: 1,
    shadow: null,
    strokeLineCap: "round",
    strokeLineJoin: "round",
    strokeDashArray: null,
    setShadow: function(options) {
        this.shadow = new fabric.Shadow(options);
        return this;
    },
    _setBrushStyles: function() {
        var ctx = this.canvas.contextTop;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = this.strokeLineCap;
        ctx.lineJoin = this.strokeLineJoin;
        if (this.strokeDashArray && fabric.StaticCanvas.supports("setLineDash")) {
            ctx.setLineDash(this.strokeDashArray);
        }
    },
    _setShadow: function() {
        if (!this.shadow) {
            return;
        }
        var ctx = this.canvas.contextTop;
        ctx.shadowColor = this.shadow.color;
        ctx.shadowBlur = this.shadow.blur;
        ctx.shadowOffsetX = this.shadow.offsetX;
        ctx.shadowOffsetY = this.shadow.offsetY;
    },
    _resetShadow: function() {
        var ctx = this.canvas.contextTop;
        ctx.shadowColor = "";
        ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
    }
});

(function() {
    fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
        initialize: function(canvas) {
            this.canvas = canvas;
            this._points = [];
        },
        onMouseDown: function(pointer) {
            this._prepareForDrawing(pointer);
            this._captureDrawingPath(pointer);
            this._render();
        },
        onMouseMove: function(pointer) {
            this._captureDrawingPath(pointer);
            this.canvas.clearContext(this.canvas.contextTop);
            this._render();
        },
        onMouseUp: function() {
            this._finalizeAndAddPath();
        },
        _prepareForDrawing: function(pointer) {
            var p = new fabric.Point(pointer.x, pointer.y);
            this._reset();
            this._addPoint(p);
            this.canvas.contextTop.moveTo(p.x, p.y);
        },
        _addPoint: function(point) {
            this._points.push(point);
        },
        _reset: function() {
            this._points.length = 0;
            this._setBrushStyles();
            this._setShadow();
        },
        _captureDrawingPath: function(pointer) {
            var pointerPoint = new fabric.Point(pointer.x, pointer.y);
            this._addPoint(pointerPoint);
        },
        _render: function() {
            var ctx = this.canvas.contextTop, v = this.canvas.viewportTransform, p1 = this._points[0], p2 = this._points[1];
            ctx.save();
            ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
            ctx.beginPath();
            if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
                p1.x -= .5;
                p2.x += .5;
            }
            ctx.moveTo(p1.x, p1.y);
            for (var i = 1, len = this._points.length; i < len; i++) {
                var midPoint = p1.midPointFrom(p2);
                ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                p1 = this._points[i];
                p2 = this._points[i + 1];
            }
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
            ctx.restore();
        },
        convertPointsToSVGPath: function(points) {
            var path = [], p1 = new fabric.Point(points[0].x, points[0].y), p2 = new fabric.Point(points[1].x, points[1].y);
            path.push("M ", points[0].x, " ", points[0].y, " ");
            for (var i = 1, len = points.length; i < len; i++) {
                var midPoint = p1.midPointFrom(p2);
                path.push("Q ", p1.x, " ", p1.y, " ", midPoint.x, " ", midPoint.y, " ");
                p1 = new fabric.Point(points[i].x, points[i].y);
                if (i + 1 < points.length) {
                    p2 = new fabric.Point(points[i + 1].x, points[i + 1].y);
                }
            }
            path.push("L ", p1.x, " ", p1.y, " ");
            return path;
        },
        createPath: function(pathData) {
            var path = new fabric.Path(pathData, {
                fill: null,
                stroke: this.color,
                strokeWidth: this.width,
                strokeLineCap: this.strokeLineCap,
                strokeLineJoin: this.strokeLineJoin,
                strokeDashArray: this.strokeDashArray,
                originX: "center",
                originY: "center"
            });
            if (this.shadow) {
                this.shadow.affectStroke = true;
                path.setShadow(this.shadow);
            }
            return path;
        },
        _finalizeAndAddPath: function() {
            var ctx = this.canvas.contextTop;
            ctx.closePath();
            var pathData = this.convertPointsToSVGPath(this._points).join("");
            if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
                this.canvas.renderAll();
                return;
            }
            var path = this.createPath(pathData);
            this.canvas.add(path);
            path.setCoords();
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
            this.canvas.renderAll();
            this.canvas.fire("path:created", {
                path: path
            });
        }
    });
})();

fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    initialize: function(canvas) {
        this.canvas = canvas;
        this.points = [];
    },
    drawDot: function(pointer) {
        var point = this.addPoint(pointer), ctx = this.canvas.contextTop, v = this.canvas.viewportTransform;
        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        ctx.fillStyle = point.fill;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    onMouseDown: function(pointer) {
        this.points.length = 0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.drawDot(pointer);
    },
    onMouseMove: function(pointer) {
        this.drawDot(pointer);
    },
    onMouseUp: function() {
        var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        var circles = [];
        for (var i = 0, len = this.points.length; i < len; i++) {
            var point = this.points[i], circle = new fabric.Circle({
                radius: point.radius,
                left: point.x,
                top: point.y,
                originX: "center",
                originY: "center",
                fill: point.fill
            });
            this.shadow && circle.setShadow(this.shadow);
            circles.push(circle);
        }
        var group = new fabric.Group(circles, {
            originX: "center",
            originY: "center"
        });
        group.canvas = this.canvas;
        this.canvas.add(group);
        this.canvas.fire("path:created", {
            path: group
        });
        this.canvas.clearContext(this.canvas.contextTop);
        this._resetShadow();
        this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        this.canvas.renderAll();
    },
    addPoint: function(pointer) {
        var pointerPoint = new fabric.Point(pointer.x, pointer.y), circleRadius = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2, circleColor = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
        pointerPoint.radius = circleRadius;
        pointerPoint.fill = circleColor;
        this.points.push(pointerPoint);
        return pointerPoint;
    }
});

fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    density: 20,
    dotWidth: 1,
    dotWidthVariance: 1,
    randomOpacity: false,
    optimizeOverlapping: true,
    initialize: function(canvas) {
        this.canvas = canvas;
        this.sprayChunks = [];
    },
    onMouseDown: function(pointer) {
        this.sprayChunks.length = 0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.addSprayChunk(pointer);
        this.render();
    },
    onMouseMove: function(pointer) {
        this.addSprayChunk(pointer);
        this.render();
    },
    onMouseUp: function() {
        var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        var rects = [];
        for (var i = 0, ilen = this.sprayChunks.length; i < ilen; i++) {
            var sprayChunk = this.sprayChunks[i];
            for (var j = 0, jlen = sprayChunk.length; j < jlen; j++) {
                var rect = new fabric.Rect({
                    width: sprayChunk[j].width,
                    height: sprayChunk[j].width,
                    left: sprayChunk[j].x + 1,
                    top: sprayChunk[j].y + 1,
                    originX: "center",
                    originY: "center",
                    fill: this.color
                });
                this.shadow && rect.setShadow(this.shadow);
                rects.push(rect);
            }
        }
        if (this.optimizeOverlapping) {
            rects = this._getOptimizedRects(rects);
        }
        var group = new fabric.Group(rects, {
            originX: "center",
            originY: "center"
        });
        group.canvas = this.canvas;
        this.canvas.add(group);
        this.canvas.fire("path:created", {
            path: group
        });
        this.canvas.clearContext(this.canvas.contextTop);
        this._resetShadow();
        this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        this.canvas.renderAll();
    },
    _getOptimizedRects: function(rects) {
        var uniqueRects = {}, key;
        for (var i = 0, len = rects.length; i < len; i++) {
            key = rects[i].left + "" + rects[i].top;
            if (!uniqueRects[key]) {
                uniqueRects[key] = rects[i];
            }
        }
        var uniqueRectsArray = [];
        for (key in uniqueRects) {
            uniqueRectsArray.push(uniqueRects[key]);
        }
        return uniqueRectsArray;
    },
    render: function() {
        var ctx = this.canvas.contextTop;
        ctx.fillStyle = this.color;
        var v = this.canvas.viewportTransform;
        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        for (var i = 0, len = this.sprayChunkPoints.length; i < len; i++) {
            var point = this.sprayChunkPoints[i];
            if (typeof point.opacity !== "undefined") {
                ctx.globalAlpha = point.opacity;
            }
            ctx.fillRect(point.x, point.y, point.width, point.width);
        }
        ctx.restore();
    },
    addSprayChunk: function(pointer) {
        this.sprayChunkPoints = [];
        var x, y, width, radius = this.width / 2;
        for (var i = 0; i < this.density; i++) {
            x = fabric.util.getRandomInt(pointer.x - radius, pointer.x + radius);
            y = fabric.util.getRandomInt(pointer.y - radius, pointer.y + radius);
            if (this.dotWidthVariance) {
                width = fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance);
            } else {
                width = this.dotWidth;
            }
            var point = new fabric.Point(x, y);
            point.width = width;
            if (this.randomOpacity) {
                point.opacity = fabric.util.getRandomInt(0, 100) / 100;
            }
            this.sprayChunkPoints.push(point);
        }
        this.sprayChunks.push(this.sprayChunkPoints);
    }
});

fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
    getPatternSrc: function() {
        var dotWidth = 20, dotDistance = 5, patternCanvas = fabric.document.createElement("canvas"), patternCtx = patternCanvas.getContext("2d");
        patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;
        patternCtx.fillStyle = this.color;
        patternCtx.beginPath();
        patternCtx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
        patternCtx.closePath();
        patternCtx.fill();
        return patternCanvas;
    },
    getPatternSrcFunction: function() {
        return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"');
    },
    getPattern: function() {
        return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat");
    },
    _setBrushStyles: function() {
        this.callSuper("_setBrushStyles");
        this.canvas.contextTop.strokeStyle = this.getPattern();
    },
    createPath: function(pathData) {
        var path = this.callSuper("createPath", pathData);
        path.stroke = new fabric.Pattern({
            source: this.source || this.getPatternSrcFunction()
        });
        return path;
    }
});

(function() {
    var getPointer = fabric.util.getPointer, degreesToRadians = fabric.util.degreesToRadians, radiansToDegrees = fabric.util.radiansToDegrees, atan2 = Math.atan2, abs = Math.abs, STROKE_OFFSET = .5;
    fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
        initialize: function(el, options) {
            options || (options = {});
            this._initStatic(el, options);
            this._initInteractive();
            this._createCacheCanvas();
            fabric.Canvas.activeInstance = this;
        },
        uniScaleTransform: false,
        centeredScaling: false,
        centeredRotation: false,
        interactive: true,
        selection: true,
        selectionColor: "rgba(100, 100, 255, 0.3)",
        selectionDashArray: [],
        selectionBorderColor: "rgba(255, 255, 255, 0.3)",
        selectionLineWidth: 1,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        freeDrawingCursor: "crosshair",
        rotationCursor: "crosshair",
        containerClass: "canvas-container",
        perPixelTargetFind: false,
        targetFindTolerance: 0,
        skipTargetFind: false,
        isDrawingMode: false,
        _initInteractive: function() {
            this._currentTransform = null;
            this._groupSelector = null;
            this._initWrapperElement();
            this._createUpperCanvas();
            this._initEventListeners();
            this._initRetinaScaling();
            this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this);
            this.calcOffset();
        },
        _resetCurrentTransform: function(e) {
            var t = this._currentTransform;
            t.target.set({
                scaleX: t.original.scaleX,
                scaleY: t.original.scaleY,
                left: t.original.left,
                top: t.original.top
            });
            if (this._shouldCenterTransform(e, t.target)) {
                if (t.action === "rotate") {
                    this._setOriginToCenter(t.target);
                } else {
                    if (t.originX !== "center") {
                        if (t.originX === "right") {
                            t.mouseXSign = -1;
                        } else {
                            t.mouseXSign = 1;
                        }
                    }
                    if (t.originY !== "center") {
                        if (t.originY === "bottom") {
                            t.mouseYSign = -1;
                        } else {
                            t.mouseYSign = 1;
                        }
                    }
                    t.originX = "center";
                    t.originY = "center";
                }
            } else {
                t.originX = t.original.originX;
                t.originY = t.original.originY;
            }
        },
        containsPoint: function(e, target) {
            var pointer = this.getPointer(e, true), xy = this._normalizePointer(target, pointer);
            return target.containsPoint(xy) || target._findTargetCorner(pointer);
        },
        _normalizePointer: function(object, pointer) {
            var activeGroup = this.getActiveGroup(), x = pointer.x, y = pointer.y, isObjectInGroup = activeGroup && object.type !== "group" && activeGroup.contains(object), lt;
            if (isObjectInGroup) {
                lt = fabric.util.transformPoint(activeGroup.getCenterPoint(), this.viewportTransform, true);
                x -= lt.x;
                y -= lt.y;
                x /= activeGroup.scaleX;
                y /= activeGroup.scaleY;
            }
            return {
                x: x,
                y: y
            };
        },
        isTargetTransparent: function(target, x, y) {
            var hasBorders = target.hasBorders, transparentCorners = target.transparentCorners;
            target.hasBorders = target.transparentCorners = false;
            this._draw(this.contextCache, target);
            target.hasBorders = hasBorders;
            target.transparentCorners = transparentCorners;
            var isTransparent = fabric.util.isTransparent(this.contextCache, x, y, this.targetFindTolerance);
            this.clearContext(this.contextCache);
            return isTransparent;
        },
        _shouldClearSelection: function(e, target) {
            var activeGroup = this.getActiveGroup(), activeObject = this.getActiveObject();
            return !target || target && activeGroup && !activeGroup.contains(target) && activeGroup !== target && !e.shiftKey || target && !target.evented || target && !target.selectable && activeObject && activeObject !== target;
        },
        _shouldCenterTransform: function(e, target) {
            if (!target) {
                return;
            }
            var t = this._currentTransform, centerTransform;
            if (t.action === "scale" || t.action === "scaleX" || t.action === "scaleY") {
                centerTransform = this.centeredScaling || target.centeredScaling;
            } else if (t.action === "rotate") {
                centerTransform = this.centeredRotation || target.centeredRotation;
            }
            return centerTransform ? !e.altKey : e.altKey;
        },
        _getOriginFromCorner: function(target, corner) {
            var origin = {
                x: target.originX,
                y: target.originY
            };
            if (corner === "ml" || corner === "tl" || corner === "bl") {
                origin.x = "right";
            } else if (corner === "mr" || corner === "tr" || corner === "br") {
                origin.x = "left";
            }
            if (corner === "tl" || corner === "mt" || corner === "tr") {
                origin.y = "bottom";
            } else if (corner === "bl" || corner === "mb" || corner === "br") {
                origin.y = "top";
            }
            return origin;
        },
        _getActionFromCorner: function(target, corner) {
            var action = "drag";
            if (corner) {
                action = corner === "ml" || corner === "mr" ? "scaleX" : corner === "mt" || corner === "mb" ? "scaleY" : corner === "mtr" ? "rotate" : "scale";
            }
            return action;
        },
        _setupCurrentTransform: function(e, target) {
            if (!target) {
                return;
            }
            var pointer = this.getPointer(e), corner = target._findTargetCorner(this.getPointer(e, true)), action = this._getActionFromCorner(target, corner), origin = this._getOriginFromCorner(target, corner);
            this._currentTransform = {
                target: target,
                action: action,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                offsetX: pointer.x - target.left,
                offsetY: pointer.y - target.top,
                originX: origin.x,
                originY: origin.y,
                ex: pointer.x,
                ey: pointer.y,
                left: target.left,
                top: target.top,
                theta: degreesToRadians(target.angle),
                width: target.width * target.scaleX,
                mouseXSign: 1,
                mouseYSign: 1
            };
            this._currentTransform.original = {
                left: target.left,
                top: target.top,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                originX: origin.x,
                originY: origin.y
            };
            this._resetCurrentTransform(e);
        },
        _translateObject: function(x, y) {
            var target = this._currentTransform.target;
            if (!target.get("lockMovementX")) {
                target.set("left", x - this._currentTransform.offsetX);
            }
            if (!target.get("lockMovementY")) {
                target.set("top", y - this._currentTransform.offsetY);
            }
        },
        _scaleObject: function(x, y, by) {
            var t = this._currentTransform, target = t.target, lockScalingX = target.get("lockScalingX"), lockScalingY = target.get("lockScalingY"), lockScalingFlip = target.get("lockScalingFlip");
            if (lockScalingX && lockScalingY) {
                return;
            }
            var constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY), localMouse = target.toLocalPoint(new fabric.Point(x, y), t.originX, t.originY);
            this._setLocalMouse(localMouse, t);
            this._setObjectScale(localMouse, t, lockScalingX, lockScalingY, by, lockScalingFlip);
            target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
        },
        _setObjectScale: function(localMouse, transform, lockScalingX, lockScalingY, by, lockScalingFlip) {
            var target = transform.target, forbidScalingX = false, forbidScalingY = false, dim = target._getNonTransformedDimensions();
            transform.newScaleX = localMouse.x / dim.x;
            transform.newScaleY = localMouse.y / dim.y;
            if (lockScalingFlip && transform.newScaleX <= 0 && transform.newScaleX < target.scaleX) {
                forbidScalingX = true;
            }
            if (lockScalingFlip && transform.newScaleY <= 0 && transform.newScaleY < target.scaleY) {
                forbidScalingY = true;
            }
            if (by === "equally" && !lockScalingX && !lockScalingY) {
                forbidScalingX || forbidScalingY || this._scaleObjectEqually(localMouse, target, transform);
            } else if (!by) {
                forbidScalingX || lockScalingX || target.set("scaleX", transform.newScaleX);
                forbidScalingY || lockScalingY || target.set("scaleY", transform.newScaleY);
            } else if (by === "x" && !target.get("lockUniScaling")) {
                forbidScalingX || lockScalingX || target.set("scaleX", transform.newScaleX);
            } else if (by === "y" && !target.get("lockUniScaling")) {
                forbidScalingY || lockScalingY || target.set("scaleY", transform.newScaleY);
            }
            forbidScalingX || forbidScalingY || this._flipObject(transform, by);
        },
        _scaleObjectEqually: function(localMouse, target, transform) {
            var dist = localMouse.y + localMouse.x, dim = target._getNonTransformedDimensions(), lastDist = dim.y * transform.original.scaleY + dim.x * transform.original.scaleX;
            transform.newScaleX = transform.original.scaleX * dist / lastDist;
            transform.newScaleY = transform.original.scaleY * dist / lastDist;
            target.set("scaleX", transform.newScaleX);
            target.set("scaleY", transform.newScaleY);
        },
        _flipObject: function(transform, by) {
            if (transform.newScaleX < 0 && by !== "y") {
                if (transform.originX === "left") {
                    transform.originX = "right";
                } else if (transform.originX === "right") {
                    transform.originX = "left";
                }
            }
            if (transform.newScaleY < 0 && by !== "x") {
                if (transform.originY === "top") {
                    transform.originY = "bottom";
                } else if (transform.originY === "bottom") {
                    transform.originY = "top";
                }
            }
        },
        _setLocalMouse: function(localMouse, t) {
            var target = t.target;
            if (t.originX === "right") {
                localMouse.x *= -1;
            } else if (t.originX === "center") {
                localMouse.x *= t.mouseXSign * 2;
                if (localMouse.x < 0) {
                    t.mouseXSign = -t.mouseXSign;
                }
            }
            if (t.originY === "bottom") {
                localMouse.y *= -1;
            } else if (t.originY === "center") {
                localMouse.y *= t.mouseYSign * 2;
                if (localMouse.y < 0) {
                    t.mouseYSign = -t.mouseYSign;
                }
            }
            if (abs(localMouse.x) > target.padding) {
                if (localMouse.x < 0) {
                    localMouse.x += target.padding;
                } else {
                    localMouse.x -= target.padding;
                }
            } else {
                localMouse.x = 0;
            }
            if (abs(localMouse.y) > target.padding) {
                if (localMouse.y < 0) {
                    localMouse.y += target.padding;
                } else {
                    localMouse.y -= target.padding;
                }
            } else {
                localMouse.y = 0;
            }
        },
        _rotateObject: function(x, y) {
            var t = this._currentTransform;
            if (t.target.get("lockRotation")) {
                return;
            }
            var lastAngle = atan2(t.ey - t.top, t.ex - t.left), curAngle = atan2(y - t.top, x - t.left), angle = radiansToDegrees(curAngle - lastAngle + t.theta);
            if (angle < 0) {
                angle = 360 + angle;
            }
            t.target.angle = angle % 360;
        },
        setCursor: function(value) {
            this.upperCanvasEl.style.cursor = value;
        },
        _resetObjectTransform: function(target) {
            target.scaleX = 1;
            target.scaleY = 1;
            target.setAngle(0);
        },
        _drawSelection: function() {
            var ctx = this.contextTop, groupSelector = this._groupSelector, left = groupSelector.left, top = groupSelector.top, aleft = abs(left), atop = abs(top);
            ctx.fillStyle = this.selectionColor;
            ctx.fillRect(groupSelector.ex - (left > 0 ? 0 : -left), groupSelector.ey - (top > 0 ? 0 : -top), aleft, atop);
            ctx.lineWidth = this.selectionLineWidth;
            ctx.strokeStyle = this.selectionBorderColor;
            if (this.selectionDashArray.length > 1) {
                var px = groupSelector.ex + STROKE_OFFSET - (left > 0 ? 0 : aleft), py = groupSelector.ey + STROKE_OFFSET - (top > 0 ? 0 : atop);
                ctx.beginPath();
                fabric.util.drawDashedLine(ctx, px, py, px + aleft, py, this.selectionDashArray);
                fabric.util.drawDashedLine(ctx, px, py + atop - 1, px + aleft, py + atop - 1, this.selectionDashArray);
                fabric.util.drawDashedLine(ctx, px, py, px, py + atop, this.selectionDashArray);
                fabric.util.drawDashedLine(ctx, px + aleft - 1, py, px + aleft - 1, py + atop, this.selectionDashArray);
                ctx.closePath();
                ctx.stroke();
            } else {
                ctx.strokeRect(groupSelector.ex + STROKE_OFFSET - (left > 0 ? 0 : aleft), groupSelector.ey + STROKE_OFFSET - (top > 0 ? 0 : atop), aleft, atop);
            }
        },
        _isLastRenderedObject: function(e) {
            return this.controlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay.visible && this.containsPoint(e, this.lastRenderedObjectWithControlsAboveOverlay) && this.lastRenderedObjectWithControlsAboveOverlay._findTargetCorner(this.getPointer(e, true));
        },
        findTarget: function(e, skipGroup) {
            if (this.skipTargetFind) {
                return;
            }
            if (this._isLastRenderedObject(e)) {
                return this.lastRenderedObjectWithControlsAboveOverlay;
            }
            var activeGroup = this.getActiveGroup();
            if (activeGroup && !skipGroup && this.containsPoint(e, activeGroup)) {
                return activeGroup;
            }
            var target = this._searchPossibleTargets(e, skipGroup);
            this._fireOverOutEvents(target, e);
            return target;
        },
        _fireOverOutEvents: function(target, e) {
            if (target) {
                if (this._hoveredTarget !== target) {
                    if (this._hoveredTarget) {
                        this.fire("mouse:out", {
                            target: this._hoveredTarget,
                            e: e
                        });
                        this._hoveredTarget.fire("mouseout");
                    }
                    this.fire("mouse:over", {
                        target: target,
                        e: e
                    });
                    target.fire("mouseover");
                    this._hoveredTarget = target;
                }
            } else if (this._hoveredTarget) {
                this.fire("mouse:out", {
                    target: this._hoveredTarget,
                    e: e
                });
                this._hoveredTarget.fire("mouseout");
                this._hoveredTarget = null;
            }
        },
        _checkTarget: function(e, obj, pointer) {
            if (obj && obj.visible && obj.evented && this.containsPoint(e, obj)) {
                if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
                    var isTransparent = this.isTargetTransparent(obj, pointer.x, pointer.y);
                    if (!isTransparent) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        },
        _searchPossibleTargets: function(e, skipGroup) {
            var target, pointer = this.getPointer(e, true), i = this._objects.length;
            while (i--) {
                if ((!this._objects[i].group || skipGroup) && this._checkTarget(e, this._objects[i], pointer)) {
                    this.relatedTarget = this._objects[i];
                    target = this._objects[i];
                    break;
                }
            }
            return target;
        },
        getPointer: function(e, ignoreZoom, upperCanvasEl) {
            if (!upperCanvasEl) {
                upperCanvasEl = this.upperCanvasEl;
            }
            var pointer = getPointer(e), bounds = upperCanvasEl.getBoundingClientRect(), boundsWidth = bounds.width || 0, boundsHeight = bounds.height || 0, cssScale;
            if (!boundsWidth || !boundsHeight) {
                if ("top" in bounds && "bottom" in bounds) {
                    boundsHeight = Math.abs(bounds.top - bounds.bottom);
                }
                if ("right" in bounds && "left" in bounds) {
                    boundsWidth = Math.abs(bounds.right - bounds.left);
                }
            }
            this.calcOffset();
            pointer.x = pointer.x - this._offset.left;
            pointer.y = pointer.y - this._offset.top;
            if (!ignoreZoom) {
                pointer = fabric.util.transformPoint(pointer, fabric.util.invertTransform(this.viewportTransform));
            }
            if (boundsWidth === 0 || boundsHeight === 0) {
                cssScale = {
                    width: 1,
                    height: 1
                };
            } else {
                cssScale = {
                    width: upperCanvasEl.width / boundsWidth,
                    height: upperCanvasEl.height / boundsHeight
                };
            }
            return {
                x: pointer.x * cssScale.width,
                y: pointer.y * cssScale.height
            };
        },
        _createUpperCanvas: function() {
            var lowerCanvasClass = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
            this.upperCanvasEl = this._createCanvasElement();
            fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + lowerCanvasClass);
            this.wrapperEl.appendChild(this.upperCanvasEl);
            this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl);
            this._applyCanvasStyle(this.upperCanvasEl);
            this.contextTop = this.upperCanvasEl.getContext("2d");
        },
        _createCacheCanvas: function() {
            this.cacheCanvasEl = this._createCanvasElement();
            this.cacheCanvasEl.setAttribute("width", this.width);
            this.cacheCanvasEl.setAttribute("height", this.height);
            this.contextCache = this.cacheCanvasEl.getContext("2d");
        },
        _initWrapperElement: function() {
            this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                "class": this.containerClass
            });
            fabric.util.setStyle(this.wrapperEl, {
                width: this.getWidth() + "px",
                height: this.getHeight() + "px",
                position: "relative"
            });
            fabric.util.makeElementUnselectable(this.wrapperEl);
        },
        _applyCanvasStyle: function(element) {
            var width = this.getWidth() || element.width, height = this.getHeight() || element.height;
            fabric.util.setStyle(element, {
                position: "absolute",
                width: width + "px",
                height: height + "px",
                left: 0,
                top: 0
            });
            element.width = width;
            element.height = height;
            fabric.util.makeElementUnselectable(element);
        },
        _copyCanvasStyle: function(fromEl, toEl) {
            toEl.style.cssText = fromEl.style.cssText;
        },
        getSelectionContext: function() {
            return this.contextTop;
        },
        getSelectionElement: function() {
            return this.upperCanvasEl;
        },
        _setActiveObject: function(object) {
            if (this._activeObject) {
                this._activeObject.set("active", false);
            }
            this._activeObject = object;
            object.set("active", true);
        },
        setActiveObject: function(object, e) {
            this._setActiveObject(object);
            this.renderAll();
            this.fire("object:selected", {
                target: object,
                e: e
            });
            object.fire("selected", {
                e: e
            });
            return this;
        },
        getActiveObject: function() {
            return this._activeObject;
        },
        _discardActiveObject: function() {
            if (this._activeObject) {
                this._activeObject.set("active", false);
            }
            this._activeObject = null;
        },
        discardActiveObject: function(e) {
            this._discardActiveObject();
            this.renderAll();
            this.fire("selection:cleared", {
                e: e
            });
            return this;
        },
        _setActiveGroup: function(group) {
            this._activeGroup = group;
            if (group) {
                group.set("active", true);
            }
        },
        setActiveGroup: function(group, e) {
            this._setActiveGroup(group);
            if (group) {
                this.fire("object:selected", {
                    target: group,
                    e: e
                });
                group.fire("selected", {
                    e: e
                });
            }
            return this;
        },
        getActiveGroup: function() {
            return this._activeGroup;
        },
        _discardActiveGroup: function() {
            var g = this.getActiveGroup();
            if (g) {
                g.destroy();
            }
            this.setActiveGroup(null);
        },
        discardActiveGroup: function(e) {
            this._discardActiveGroup();
            this.fire("selection:cleared", {
                e: e
            });
            return this;
        },
        deactivateAll: function() {
            var allObjects = this.getObjects(), i = 0, len = allObjects.length;
            for (;i < len; i++) {
                allObjects[i].set("active", false);
            }
            this._discardActiveGroup();
            this._discardActiveObject();
            return this;
        },
        deactivateAllWithDispatch: function(e) {
            var activeObject = this.getActiveGroup() || this.getActiveObject();
            if (activeObject) {
                this.fire("before:selection:cleared", {
                    target: activeObject,
                    e: e
                });
            }
            this.deactivateAll();
            if (activeObject) {
                this.fire("selection:cleared", {
                    e: e
                });
            }
            return this;
        },
        drawControls: function(ctx) {
            var activeGroup = this.getActiveGroup();
            if (activeGroup) {
                this._drawGroupControls(ctx, activeGroup);
            } else {
                this._drawObjectsControls(ctx);
            }
        },
        _drawGroupControls: function(ctx, activeGroup) {
            activeGroup._renderControls(ctx);
        },
        _drawObjectsControls: function(ctx) {
            for (var i = 0, len = this._objects.length; i < len; ++i) {
                if (!this._objects[i] || !this._objects[i].active) {
                    continue;
                }
                this._objects[i]._renderControls(ctx);
                this.lastRenderedObjectWithControlsAboveOverlay = this._objects[i];
            }
        }
    });
    for (var prop in fabric.StaticCanvas) {
        if (prop !== "prototype") {
            fabric.Canvas[prop] = fabric.StaticCanvas[prop];
        }
    }
    if (fabric.isTouchSupported) {
        fabric.Canvas.prototype._setCursorFromEvent = function() {};
    }
    fabric.Element = fabric.Canvas;
})();

(function() {
    var cursorOffset = {
        mt: 0,
        tr: 1,
        mr: 2,
        br: 3,
        mb: 4,
        bl: 5,
        ml: 6,
        tl: 7
    }, addListener = fabric.util.addListener, removeListener = fabric.util.removeListener;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        cursorMap: [ "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize" ],
        _initEventListeners: function() {
            this._bindEvents();
            addListener(fabric.window, "resize", this._onResize);
            addListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
            addListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            addListener(this.upperCanvasEl, "mousewheel", this._onMouseWheel);
            addListener(this.upperCanvasEl, "touchstart", this._onMouseDown);
            addListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (typeof eventjs !== "undefined" && "add" in eventjs) {
                eventjs.add(this.upperCanvasEl, "gesture", this._onGesture);
                eventjs.add(this.upperCanvasEl, "drag", this._onDrag);
                eventjs.add(this.upperCanvasEl, "orientation", this._onOrientationChange);
                eventjs.add(this.upperCanvasEl, "shake", this._onShake);
                eventjs.add(this.upperCanvasEl, "longpress", this._onLongPress);
            }
        },
        _bindEvents: function() {
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._onResize = this._onResize.bind(this);
            this._onGesture = this._onGesture.bind(this);
            this._onDrag = this._onDrag.bind(this);
            this._onShake = this._onShake.bind(this);
            this._onLongPress = this._onLongPress.bind(this);
            this._onOrientationChange = this._onOrientationChange.bind(this);
            this._onMouseWheel = this._onMouseWheel.bind(this);
        },
        removeListeners: function() {
            removeListener(fabric.window, "resize", this._onResize);
            removeListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
            removeListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            removeListener(this.upperCanvasEl, "mousewheel", this._onMouseWheel);
            removeListener(this.upperCanvasEl, "touchstart", this._onMouseDown);
            removeListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (typeof eventjs !== "undefined" && "remove" in eventjs) {
                eventjs.remove(this.upperCanvasEl, "gesture", this._onGesture);
                eventjs.remove(this.upperCanvasEl, "drag", this._onDrag);
                eventjs.remove(this.upperCanvasEl, "orientation", this._onOrientationChange);
                eventjs.remove(this.upperCanvasEl, "shake", this._onShake);
                eventjs.remove(this.upperCanvasEl, "longpress", this._onLongPress);
            }
        },
        _onGesture: function(e, self) {
            this.__onTransformGesture && this.__onTransformGesture(e, self);
        },
        _onDrag: function(e, self) {
            this.__onDrag && this.__onDrag(e, self);
        },
        _onMouseWheel: function(e, self) {
            this.__onMouseWheel && this.__onMouseWheel(e, self);
        },
        _onOrientationChange: function(e, self) {
            this.__onOrientationChange && this.__onOrientationChange(e, self);
        },
        _onShake: function(e, self) {
            this.__onShake && this.__onShake(e, self);
        },
        _onLongPress: function(e, self) {
            this.__onLongPress && this.__onLongPress(e, self);
        },
        _onMouseDown: function(e) {
            this.__onMouseDown(e);
            addListener(fabric.document, "touchend", this._onMouseUp);
            addListener(fabric.document, "touchmove", this._onMouseMove);
            removeListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            removeListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (e.type === "touchstart") {
                removeListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
            } else {
                addListener(fabric.document, "mouseup", this._onMouseUp);
                addListener(fabric.document, "mousemove", this._onMouseMove);
            }
        },
        _onMouseUp: function(e) {
            this.__onMouseUp(e);
            removeListener(fabric.document, "mouseup", this._onMouseUp);
            removeListener(fabric.document, "touchend", this._onMouseUp);
            removeListener(fabric.document, "mousemove", this._onMouseMove);
            removeListener(fabric.document, "touchmove", this._onMouseMove);
            addListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            addListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (e.type === "touchend") {
                var _this = this;
                setTimeout(function() {
                    addListener(_this.upperCanvasEl, "mousedown", _this._onMouseDown);
                }, 400);
            }
        },
        _onMouseMove: function(e) {
            !this.allowTouchScrolling && e.preventDefault && e.preventDefault();
            this.__onMouseMove(e);
        },
        _onResize: function() {
            this.calcOffset();
        },
        _shouldRender: function(target, pointer) {
            var activeObject = this.getActiveGroup() || this.getActiveObject();
            return !!(target && (target.isMoving || target !== activeObject) || !target && !!activeObject || !target && !activeObject && !this._groupSelector || pointer && this._previousPointer && this.selection && (pointer.x !== this._previousPointer.x || pointer.y !== this._previousPointer.y));
        },
        __onMouseUp: function(e) {
            var target;
            if (this.isDrawingMode && this._isCurrentlyDrawing) {
                this._onMouseUpInDrawingMode(e);
                return;
            }
            if (this._currentTransform) {
                this._finalizeCurrentTransform();
                target = this._currentTransform.target;
            } else {
                target = this.findTarget(e, true);
            }
            var shouldRender = this._shouldRender(target, this.getPointer(e));
            this._maybeGroupObjects(e);
            if (target) {
                target.isMoving = false;
            }
            shouldRender && this.renderAll();
            this._handleCursorAndEvent(e, target);
        },
        _handleCursorAndEvent: function(e, target) {
            this._setCursorFromEvent(e, target);
            var _this = this;
            setTimeout(function() {
                _this._setCursorFromEvent(e, target);
            }, 50);
            this.fire("mouse:up", {
                target: target,
                e: e
            });
            target && target.fire("mouseup", {
                e: e
            });
        },
        _finalizeCurrentTransform: function() {
            var transform = this._currentTransform, target = transform.target;
            if (target._scaling) {
                target._scaling = false;
            }
            target.setCoords();
            if (this.stateful && target.hasStateChanged()) {
                this.fire("object:modified", {
                    target: target
                });
                target.fire("modified");
            }
            this._restoreOriginXY(target);
        },
        _restoreOriginXY: function(target) {
            if (this._previousOriginX && this._previousOriginY) {
                var originPoint = target.translateToOriginPoint(target.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                target.originX = this._previousOriginX;
                target.originY = this._previousOriginY;
                target.left = originPoint.x;
                target.top = originPoint.y;
                this._previousOriginX = null;
                this._previousOriginY = null;
            }
        },
        _onMouseDownInDrawingMode: function(e) {
            this._isCurrentlyDrawing = true;
            this.discardActiveObject(e).renderAll();
            if (this.clipTo) {
                fabric.util.clipContext(this, this.contextTop);
            }
            var ivt = fabric.util.invertTransform(this.viewportTransform), pointer = fabric.util.transformPoint(this.getPointer(e, true), ivt);
            this.freeDrawingBrush.onMouseDown(pointer);
            this.fire("mouse:down", {
                e: e
            });
            var target = this.findTarget(e);
            if (typeof target !== "undefined") {
                target.fire("mousedown", {
                    e: e,
                    target: target
                });
            }
        },
        _onMouseMoveInDrawingMode: function(e) {
            if (this._isCurrentlyDrawing) {
                var ivt = fabric.util.invertTransform(this.viewportTransform), pointer = fabric.util.transformPoint(this.getPointer(e, true), ivt);
                this.freeDrawingBrush.onMouseMove(pointer);
            }
            this.setCursor(this.freeDrawingCursor);
            this.fire("mouse:move", {
                e: e
            });
            var target = this.findTarget(e);
            if (typeof target !== "undefined") {
                target.fire("mousemove", {
                    e: e,
                    target: target
                });
            }
        },
        _onMouseUpInDrawingMode: function(e) {
            this._isCurrentlyDrawing = false;
            if (this.clipTo) {
                this.contextTop.restore();
            }
            this.freeDrawingBrush.onMouseUp();
            this.fire("mouse:up", {
                e: e
            });
            var target = this.findTarget(e);
            if (typeof target !== "undefined") {
                target.fire("mouseup", {
                    e: e,
                    target: target
                });
            }
        },
        __onMouseDown: function(e) {
            var isLeftClick = "which" in e ? e.which === 1 : e.button === 1;
            if (!isLeftClick && !fabric.isTouchSupported) {
                return;
            }
            if (this.isDrawingMode) {
                this._onMouseDownInDrawingMode(e);
                return;
            }
            if (this._currentTransform) {
                return;
            }
            var target = this.findTarget(e), pointer = this.getPointer(e, true);
            this._previousPointer = pointer;
            var shouldRender = this._shouldRender(target, pointer), shouldGroup = this._shouldGroup(e, target);
            if (this._shouldClearSelection(e, target)) {
                this._clearSelection(e, target, pointer);
            } else if (shouldGroup) {
                this._handleGrouping(e, target);
                target = this.getActiveGroup();
            }
            if (target && target.selectable && !shouldGroup) {
                this._beforeTransform(e, target);
                this._setupCurrentTransform(e, target);
            }
            shouldRender && this.renderAll();
            this.fire("mouse:down", {
                target: target,
                e: e
            });
            target && target.fire("mousedown", {
                e: e
            });
        },
        _beforeTransform: function(e, target) {
            this.stateful && target.saveState();
            if (target._findTargetCorner(this.getPointer(e))) {
                this.onBeforeScaleRotate(target);
            }
            if (target !== this.getActiveGroup() && target !== this.getActiveObject()) {
                this.deactivateAll();
                this.setActiveObject(target, e);
            }
        },
        _clearSelection: function(e, target, pointer) {
            this.deactivateAllWithDispatch(e);
            if (target && target.selectable) {
                this.setActiveObject(target, e);
            } else if (this.selection) {
                this._groupSelector = {
                    ex: pointer.x,
                    ey: pointer.y,
                    top: 0,
                    left: 0
                };
            }
        },
        _setOriginToCenter: function(target) {
            this._previousOriginX = this._currentTransform.target.originX;
            this._previousOriginY = this._currentTransform.target.originY;
            var center = target.getCenterPoint();
            target.originX = "center";
            target.originY = "center";
            target.left = center.x;
            target.top = center.y;
            this._currentTransform.left = target.left;
            this._currentTransform.top = target.top;
        },
        _setCenterToOrigin: function(target) {
            var originPoint = target.translateToOriginPoint(target.getCenterPoint(), this._previousOriginX, this._previousOriginY);
            target.originX = this._previousOriginX;
            target.originY = this._previousOriginY;
            target.left = originPoint.x;
            target.top = originPoint.y;
            this._previousOriginX = null;
            this._previousOriginY = null;
        },
        __onMouseMove: function(e) {
            var target, pointer;
            if (this.isDrawingMode) {
                this._onMouseMoveInDrawingMode(e);
                return;
            }
            if (typeof e.touches !== "undefined" && e.touches.length > 1) {
                return;
            }
            var groupSelector = this._groupSelector;
            if (groupSelector) {
                pointer = this.getPointer(e, true);
                groupSelector.left = pointer.x - groupSelector.ex;
                groupSelector.top = pointer.y - groupSelector.ey;
                this.renderTop();
            } else if (!this._currentTransform) {
                target = this.findTarget(e);
                if (!target || target && !target.selectable) {
                    this.setCursor(this.defaultCursor);
                } else {
                    this._setCursorFromEvent(e, target);
                }
            } else {
                this._transformObject(e);
            }
            this.fire("mouse:move", {
                target: target,
                e: e
            });
            target && target.fire("mousemove", {
                e: e
            });
        },
        _transformObject: function(e) {
            var pointer = this.getPointer(e), transform = this._currentTransform;
            transform.reset = false, transform.target.isMoving = true;
            this._beforeScaleTransform(e, transform);
            this._performTransformAction(e, transform, pointer);
            this.renderAll();
        },
        _performTransformAction: function(e, transform, pointer) {
            var x = pointer.x, y = pointer.y, target = transform.target, action = transform.action;
            if (action === "rotate") {
                this._rotateObject(x, y);
                this._fire("rotating", target, e);
            } else if (action === "scale") {
                this._onScale(e, transform, x, y);
                this._fire("scaling", target, e);
            } else if (action === "scaleX") {
                this._scaleObject(x, y, "x");
                this._fire("scaling", target, e);
            } else if (action === "scaleY") {
                this._scaleObject(x, y, "y");
                this._fire("scaling", target, e);
            } else {
                this._translateObject(x, y);
                this._fire("moving", target, e);
                this.setCursor(this.moveCursor);
            }
        },
        _fire: function(eventName, target, e) {
            this.fire("object:" + eventName, {
                target: target,
                e: e
            });
            target.fire(eventName, {
                e: e
            });
        },
        _beforeScaleTransform: function(e, transform) {
            if (transform.action === "scale" || transform.action === "scaleX" || transform.action === "scaleY") {
                var centerTransform = this._shouldCenterTransform(e, transform.target);
                if (centerTransform && (transform.originX !== "center" || transform.originY !== "center") || !centerTransform && transform.originX === "center" && transform.originY === "center") {
                    this._resetCurrentTransform(e);
                    transform.reset = true;
                }
            }
        },
        _onScale: function(e, transform, x, y) {
            if ((e.shiftKey || this.uniScaleTransform) && !transform.target.get("lockUniScaling")) {
                transform.currentAction = "scale";
                this._scaleObject(x, y);
            } else {
                if (!transform.reset && transform.currentAction === "scale") {
                    this._resetCurrentTransform(e, transform.target);
                }
                transform.currentAction = "scaleEqually";
                this._scaleObject(x, y, "equally");
            }
        },
        _setCursorFromEvent: function(e, target) {
            if (!target || !target.selectable) {
                this.setCursor(this.defaultCursor);
                return false;
            } else {
                var activeGroup = this.getActiveGroup(), corner = target._findTargetCorner && (!activeGroup || !activeGroup.contains(target)) && target._findTargetCorner(this.getPointer(e, true));
                if (!corner) {
                    this.setCursor(target.hoverCursor || this.hoverCursor);
                } else {
                    this._setCornerCursor(corner, target);
                }
            }
            return true;
        },
        _setCornerCursor: function(corner, target) {
            if (corner in cursorOffset) {
                this.setCursor(this._getRotatedCornerCursor(corner, target));
            } else if (corner === "mtr" && target.hasRotatingPoint) {
                this.setCursor(this.rotationCursor);
            } else {
                this.setCursor(this.defaultCursor);
                return false;
            }
        },
        _getRotatedCornerCursor: function(corner, target) {
            var n = Math.round(target.getAngle() % 360 / 45);
            if (n < 0) {
                n += 8;
            }
            n += cursorOffset[corner];
            n %= 8;
            return this.cursorMap[n];
        }
    });
})();

(function() {
    var min = Math.min, max = Math.max;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        _shouldGroup: function(e, target) {
            var activeObject = this.getActiveObject();
            return e.shiftKey && (this.getActiveGroup() || activeObject && activeObject !== target) && this.selection;
        },
        _handleGrouping: function(e, target) {
            if (target === this.getActiveGroup()) {
                target = this.findTarget(e, true);
                if (!target || target.isType("group")) {
                    return;
                }
            }
            if (this.getActiveGroup()) {
                this._updateActiveGroup(target, e);
            } else {
                this._createActiveGroup(target, e);
            }
            if (this._activeGroup) {
                this._activeGroup.saveCoords();
            }
        },
        _updateActiveGroup: function(target, e) {
            var activeGroup = this.getActiveGroup();
            if (activeGroup.contains(target)) {
                activeGroup.removeWithUpdate(target);
                this._resetObjectTransform(activeGroup);
                target.set("active", false);
                if (activeGroup.size() === 1) {
                    this.discardActiveGroup(e);
                    this.setActiveObject(activeGroup.item(0));
                    return;
                }
            } else {
                activeGroup.addWithUpdate(target);
                this._resetObjectTransform(activeGroup);
            }
            this.fire("selection:created", {
                target: activeGroup,
                e: e
            });
            activeGroup.set("active", true);
        },
        _createActiveGroup: function(target, e) {
            if (this._activeObject && target !== this._activeObject) {
                var group = this._createGroup(target);
                group.addWithUpdate();
                this.setActiveGroup(group);
                this._activeObject = null;
                this.fire("selection:created", {
                    target: group,
                    e: e
                });
            }
            target.set("active", true);
        },
        _createGroup: function(target) {
            var objects = this.getObjects(), isActiveLower = objects.indexOf(this._activeObject) < objects.indexOf(target), groupObjects = isActiveLower ? [ this._activeObject, target ] : [ target, this._activeObject ];
            return new fabric.Group(groupObjects, {
                canvas: this
            });
        },
        _groupSelectedObjects: function(e) {
            var group = this._collectObjects();
            if (group.length === 1) {
                this.setActiveObject(group[0], e);
            } else if (group.length > 1) {
                group = new fabric.Group(group.reverse(), {
                    canvas: this
                });
                group.addWithUpdate();
                this.setActiveGroup(group, e);
                group.saveCoords();
                this.fire("selection:created", {
                    target: group
                });
                this.renderAll();
            }
        },
        _collectObjects: function() {
            var group = [], currentObject, x1 = this._groupSelector.ex, y1 = this._groupSelector.ey, x2 = x1 + this._groupSelector.left, y2 = y1 + this._groupSelector.top, selectionX1Y1 = new fabric.Point(min(x1, x2), min(y1, y2)), selectionX2Y2 = new fabric.Point(max(x1, x2), max(y1, y2)), isClick = x1 === x2 && y1 === y2;
            for (var i = this._objects.length; i--; ) {
                currentObject = this._objects[i];
                if (!currentObject || !currentObject.selectable || !currentObject.visible) {
                    continue;
                }
                if (currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) || currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2) || currentObject.containsPoint(selectionX1Y1) || currentObject.containsPoint(selectionX2Y2)) {
                    currentObject.set("active", true);
                    group.push(currentObject);
                    if (isClick) {
                        break;
                    }
                }
            }
            return group;
        },
        _maybeGroupObjects: function(e) {
            if (this.selection && this._groupSelector) {
                this._groupSelectedObjects(e);
            }
            var activeGroup = this.getActiveGroup();
            if (activeGroup) {
                activeGroup.setObjectsCoords().setCoords();
                activeGroup.isMoving = false;
                this.setCursor(this.defaultCursor);
            }
            this._groupSelector = null;
            this._currentTransform = null;
        }
    });
})();

fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    toDataURL: function(options) {
        options || (options = {});
        var format = options.format || "png", quality = options.quality || 1, multiplier = options.multiplier || 1, cropping = {
            left: options.left,
            top: options.top,
            width: options.width,
            height: options.height
        };
        if (multiplier !== 1) {
            return this.__toDataURLWithMultiplier(format, quality, cropping, multiplier);
        } else {
            return this.__toDataURL(format, quality, cropping);
        }
    },
    __toDataURL: function(format, quality, cropping) {
        this.renderAll(true);
        var canvasEl = this.upperCanvasEl || this.lowerCanvasEl, croppedCanvasEl = this.__getCroppedCanvas(canvasEl, cropping);
        if (format === "jpg") {
            format = "jpeg";
        }
        var data = fabric.StaticCanvas.supports("toDataURLWithQuality") ? (croppedCanvasEl || canvasEl).toDataURL("image/" + format, quality) : (croppedCanvasEl || canvasEl).toDataURL("image/" + format);
        this.contextTop && this.clearContext(this.contextTop);
        this.renderAll();
        if (croppedCanvasEl) {
            croppedCanvasEl = null;
        }
        return data;
    },
    __getCroppedCanvas: function(canvasEl, cropping) {
        var croppedCanvasEl, croppedCtx, shouldCrop = "left" in cropping || "top" in cropping || "width" in cropping || "height" in cropping;
        if (shouldCrop) {
            croppedCanvasEl = fabric.util.createCanvasElement();
            croppedCtx = croppedCanvasEl.getContext("2d");
            croppedCanvasEl.width = cropping.width || this.width;
            croppedCanvasEl.height = cropping.height || this.height;
            croppedCtx.drawImage(canvasEl, -cropping.left || 0, -cropping.top || 0);
        }
        return croppedCanvasEl;
    },
    __toDataURLWithMultiplier: function(format, quality, cropping, multiplier) {
        var origWidth = this.getWidth(), origHeight = this.getHeight(), scaledWidth = origWidth * multiplier, scaledHeight = origHeight * multiplier, activeObject = this.getActiveObject(), activeGroup = this.getActiveGroup(), ctx = this.contextTop || this.contextContainer;
        if (multiplier > 1) {
            this.setWidth(scaledWidth).setHeight(scaledHeight);
        }
        ctx.scale(multiplier, multiplier);
        if (cropping.left) {
            cropping.left *= multiplier;
        }
        if (cropping.top) {
            cropping.top *= multiplier;
        }
        if (cropping.width) {
            cropping.width *= multiplier;
        } else if (multiplier < 1) {
            cropping.width = scaledWidth;
        }
        if (cropping.height) {
            cropping.height *= multiplier;
        } else if (multiplier < 1) {
            cropping.height = scaledHeight;
        }
        if (activeGroup) {
            this._tempRemoveBordersControlsFromGroup(activeGroup);
        } else if (activeObject && this.deactivateAll) {
            this.deactivateAll();
        }
        this.renderAll(true);
        var data = this.__toDataURL(format, quality, cropping);
        this.width = origWidth;
        this.height = origHeight;
        ctx.scale(1 / multiplier, 1 / multiplier);
        this.setWidth(origWidth).setHeight(origHeight);
        if (activeGroup) {
            this._restoreBordersControlsOnGroup(activeGroup);
        } else if (activeObject && this.setActiveObject) {
            this.setActiveObject(activeObject);
        }
        this.contextTop && this.clearContext(this.contextTop);
        this.renderAll();
        return data;
    },
    toDataURLWithMultiplier: function(format, multiplier, quality) {
        return this.toDataURL({
            format: format,
            multiplier: multiplier,
            quality: quality
        });
    },
    _tempRemoveBordersControlsFromGroup: function(group) {
        group.origHasControls = group.hasControls;
        group.origBorderColor = group.borderColor;
        group.hasControls = true;
        group.borderColor = "rgba(0,0,0,0)";
        group.forEachObject(function(o) {
            o.origBorderColor = o.borderColor;
            o.borderColor = "rgba(0,0,0,0)";
        });
    },
    _restoreBordersControlsOnGroup: function(group) {
        group.hideControls = group.origHideControls;
        group.borderColor = group.origBorderColor;
        group.forEachObject(function(o) {
            o.borderColor = o.origBorderColor;
            delete o.origBorderColor;
        });
    }
});

fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    loadFromDatalessJSON: function(json, callback, reviver) {
        return this.loadFromJSON(json, callback, reviver);
    },
    loadFromJSON: function(json, callback, reviver) {
        if (!json) {
            return;
        }
        var serialized = typeof json === "string" ? JSON.parse(json) : json;
        this.clear();
        var _this = this;
        this._enlivenObjects(serialized.objects, function() {
            _this._setBgOverlay(serialized, callback);
        }, reviver);
        return this;
    },
    _setBgOverlay: function(serialized, callback) {
        var _this = this, loaded = {
            backgroundColor: false,
            overlayColor: false,
            backgroundImage: false,
            overlayImage: false
        };
        if (!serialized.backgroundImage && !serialized.overlayImage && !serialized.background && !serialized.overlay) {
            callback && callback();
            return;
        }
        var cbIfLoaded = function() {
            if (loaded.backgroundImage && loaded.overlayImage && loaded.backgroundColor && loaded.overlayColor) {
                _this.renderAll();
                callback && callback();
            }
        };
        this.__setBgOverlay("backgroundImage", serialized.backgroundImage, loaded, cbIfLoaded);
        this.__setBgOverlay("overlayImage", serialized.overlayImage, loaded, cbIfLoaded);
        this.__setBgOverlay("backgroundColor", serialized.background, loaded, cbIfLoaded);
        this.__setBgOverlay("overlayColor", serialized.overlay, loaded, cbIfLoaded);
        cbIfLoaded();
    },
    __setBgOverlay: function(property, value, loaded, callback) {
        var _this = this;
        if (!value) {
            loaded[property] = true;
            return;
        }
        if (property === "backgroundImage" || property === "overlayImage") {
            fabric.Image.fromObject(value, function(img) {
                _this[property] = img;
                loaded[property] = true;
                callback && callback();
            });
        } else {
            this["set" + fabric.util.string.capitalize(property, true)](value, function() {
                loaded[property] = true;
                callback && callback();
            });
        }
    },
    _enlivenObjects: function(objects, callback, reviver) {
        var _this = this;
        if (!objects || objects.length === 0) {
            callback && callback();
            return;
        }
        var renderOnAddRemove = this.renderOnAddRemove;
        this.renderOnAddRemove = false;
        fabric.util.enlivenObjects(objects, function(enlivenedObjects) {
            enlivenedObjects.forEach(function(obj, index) {
                _this.insertAt(obj, index, true);
            });
            _this.renderOnAddRemove = renderOnAddRemove;
            callback && callback();
        }, null, reviver);
    },
    _toDataURL: function(format, callback) {
        this.clone(function(clone) {
            callback(clone.toDataURL(format));
        });
    },
    _toDataURLWithMultiplier: function(format, multiplier, callback) {
        this.clone(function(clone) {
            callback(clone.toDataURLWithMultiplier(format, multiplier));
        });
    },
    clone: function(callback, properties) {
        var data = JSON.stringify(this.toJSON(properties));
        this.cloneWithoutData(function(clone) {
            clone.loadFromJSON(data, function() {
                callback && callback(clone);
            });
        });
    },
    cloneWithoutData: function(callback) {
        var el = fabric.document.createElement("canvas");
        el.width = this.getWidth();
        el.height = this.getHeight();
        var clone = new fabric.Canvas(el);
        clone.clipTo = this.clipTo;
        if (this.backgroundImage) {
            clone.setBackgroundImage(this.backgroundImage.src, function() {
                clone.renderAll();
                callback && callback(clone);
            });
            clone.backgroundImageOpacity = this.backgroundImageOpacity;
            clone.backgroundImageStretch = this.backgroundImageStretch;
        } else {
            callback && callback(clone);
        }
    }
});

(function() {
    var degreesToRadians = fabric.util.degreesToRadians, radiansToDegrees = fabric.util.radiansToDegrees;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        __onTransformGesture: function(e, self) {
            if (this.isDrawingMode || !e.touches || e.touches.length !== 2 || "gesture" !== self.gesture) {
                return;
            }
            var target = this.findTarget(e);
            if ("undefined" !== typeof target) {
                this.__gesturesParams = {
                    e: e,
                    self: self,
                    target: target
                };
                this.__gesturesRenderer();
            }
            this.fire("touch:gesture", {
                target: target,
                e: e,
                self: self
            });
        },
        __gesturesParams: null,
        __gesturesRenderer: function() {
            if (this.__gesturesParams === null || this._currentTransform === null) {
                return;
            }
            var self = this.__gesturesParams.self, t = this._currentTransform, e = this.__gesturesParams.e;
            t.action = "scale";
            t.originX = t.originY = "center";
            this._setOriginToCenter(t.target);
            this._scaleObjectBy(self.scale, e);
            if (self.rotation !== 0) {
                t.action = "rotate";
                this._rotateObjectByAngle(self.rotation, e);
            }
            this.renderAll();
            t.action = "drag";
        },
        __onDrag: function(e, self) {
            this.fire("touch:drag", {
                e: e,
                self: self
            });
        },
        __onOrientationChange: function(e, self) {
            this.fire("touch:orientation", {
                e: e,
                self: self
            });
        },
        __onShake: function(e, self) {
            this.fire("touch:shake", {
                e: e,
                self: self
            });
        },
        __onLongPress: function(e, self) {
            this.fire("touch:longpress", {
                e: e,
                self: self
            });
        },
        _scaleObjectBy: function(s, e) {
            var t = this._currentTransform, target = t.target, lockScalingX = target.get("lockScalingX"), lockScalingY = target.get("lockScalingY");
            if (lockScalingX && lockScalingY) {
                return;
            }
            target._scaling = true;
            var constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY), dim = target._getNonTransformedDimensions();
            this._setObjectScale(new fabric.Point(t.scaleX * s * dim.x, t.scaleY * s * dim.y), t, lockScalingX, lockScalingY, null, target.get("lockScalingFlip"));
            target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
            this._fire("scaling", target, e);
        },
        _rotateObjectByAngle: function(curAngle, e) {
            var t = this._currentTransform;
            if (t.target.get("lockRotation")) {
                return;
            }
            t.target.angle = radiansToDegrees(degreesToRadians(curAngle) + t.theta);
            this._fire("rotating", t.target, e);
        }
    });
})();

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, toFixed = fabric.util.toFixed, capitalize = fabric.util.string.capitalize, degreesToRadians = fabric.util.degreesToRadians, supportsLineDash = fabric.StaticCanvas.supports("setLineDash");
    if (fabric.Object) {
        return;
    }
    fabric.Object = fabric.util.createClass({
        type: "object",
        originX: "left",
        originY: "top",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        opacity: 1,
        angle: 0,
        cornerSize: 12,
        transparentCorners: true,
        hoverCursor: null,
        padding: 0,
        borderColor: "rgba(102,153,255,0.75)",
        cornerColor: "rgba(102,153,255,0.5)",
        centeredScaling: false,
        centeredRotation: true,
        fill: "rgb(0,0,0)",
        fillRule: "nonzero",
        globalCompositeOperation: "source-over",
        backgroundColor: "",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeLineJoin: "miter",
        strokeMiterLimit: 10,
        shadow: null,
        borderOpacityWhenMoving: .4,
        borderScaleFactor: 1,
        transformMatrix: null,
        minScaleLimit: .01,
        selectable: true,
        evented: true,
        visible: true,
        hasControls: true,
        hasBorders: true,
        hasRotatingPoint: true,
        rotatingPointOffset: 40,
        perPixelTargetFind: false,
        includeDefaultValues: true,
        clipTo: null,
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        lockUniScaling: false,
        lockScalingFlip: false,
        stateProperties: ("top left width height scaleX scaleY flipX flipY originX originY transformMatrix " + "stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit " + "angle opacity fill fillRule globalCompositeOperation shadow clipTo visible backgroundColor " + "alignX alignY meetOrSlice").split(" "),
        initialize: function(options) {
            if (options) {
                this.setOptions(options);
            }
        },
        _initGradient: function(options) {
            if (options.fill && options.fill.colorStops && !(options.fill instanceof fabric.Gradient)) {
                this.set("fill", new fabric.Gradient(options.fill));
            }
            if (options.stroke && options.stroke.colorStops && !(options.stroke instanceof fabric.Gradient)) {
                this.set("stroke", new fabric.Gradient(options.stroke));
            }
        },
        _initPattern: function(options) {
            if (options.fill && options.fill.source && !(options.fill instanceof fabric.Pattern)) {
                this.set("fill", new fabric.Pattern(options.fill));
            }
            if (options.stroke && options.stroke.source && !(options.stroke instanceof fabric.Pattern)) {
                this.set("stroke", new fabric.Pattern(options.stroke));
            }
        },
        _initClipping: function(options) {
            if (!options.clipTo || typeof options.clipTo !== "string") {
                return;
            }
            var functionBody = fabric.util.getFunctionBody(options.clipTo);
            if (typeof functionBody !== "undefined") {
                this.clipTo = new Function("ctx", functionBody);
            }
        },
        setOptions: function(options) {
            for (var prop in options) {
                this.set(prop, options[prop]);
            }
            this._initGradient(options);
            this._initPattern(options);
            this._initClipping(options);
        },
        transform: function(ctx, fromLeft) {
            if (this.group && this.canvas.preserveObjectStacking && this.group === this.canvas._activeGroup) {
                this.group.transform(ctx);
            }
            var center = fromLeft ? this._getLeftTopCoords() : this.getCenterPoint();
            ctx.translate(center.x, center.y);
            ctx.rotate(degreesToRadians(this.angle));
            ctx.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1));
        },
        toObject: function(propertiesToInclude) {
            var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS, object = {
                type: this.type,
                originX: this.originX,
                originY: this.originY,
                left: toFixed(this.left, NUM_FRACTION_DIGITS),
                top: toFixed(this.top, NUM_FRACTION_DIGITS),
                width: toFixed(this.width, NUM_FRACTION_DIGITS),
                height: toFixed(this.height, NUM_FRACTION_DIGITS),
                fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                strokeWidth: toFixed(this.strokeWidth, NUM_FRACTION_DIGITS),
                strokeDashArray: this.strokeDashArray,
                strokeLineCap: this.strokeLineCap,
                strokeLineJoin: this.strokeLineJoin,
                strokeMiterLimit: toFixed(this.strokeMiterLimit, NUM_FRACTION_DIGITS),
                scaleX: toFixed(this.scaleX, NUM_FRACTION_DIGITS),
                scaleY: toFixed(this.scaleY, NUM_FRACTION_DIGITS),
                angle: toFixed(this.getAngle(), NUM_FRACTION_DIGITS),
                flipX: this.flipX,
                flipY: this.flipY,
                opacity: toFixed(this.opacity, NUM_FRACTION_DIGITS),
                shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                visible: this.visible,
                clipTo: this.clipTo && String(this.clipTo),
                backgroundColor: this.backgroundColor,
                fillRule: this.fillRule,
                globalCompositeOperation: this.globalCompositeOperation,
                transformMatrix: this.transformMatrix
            };
            if (!this.includeDefaultValues) {
                object = this._removeDefaultValues(object);
            }
            fabric.util.populateWithProperties(this, object, propertiesToInclude);
            return object;
        },
        toDatalessObject: function(propertiesToInclude) {
            return this.toObject(propertiesToInclude);
        },
        _removeDefaultValues: function(object) {
            var prototype = fabric.util.getKlass(object.type).prototype, stateProperties = prototype.stateProperties;
            stateProperties.forEach(function(prop) {
                if (object[prop] === prototype[prop]) {
                    delete object[prop];
                }
                var isArray = Object.prototype.toString.call(object[prop]) === "[object Array]" && Object.prototype.toString.call(prototype[prop]) === "[object Array]";
                if (isArray && object[prop].length === 0 && prototype[prop].length === 0) {
                    delete object[prop];
                }
            });
            return object;
        },
        toString: function() {
            return "#<fabric." + capitalize(this.type) + ">";
        },
        get: function(property) {
            return this[property];
        },
        _setObject: function(obj) {
            for (var prop in obj) {
                this._set(prop, obj[prop]);
            }
        },
        set: function(key, value) {
            if (typeof key === "object") {
                this._setObject(key);
            } else {
                if (typeof value === "function" && key !== "clipTo") {
                    this._set(key, value(this.get(key)));
                } else {
                    this._set(key, value);
                }
            }
            return this;
        },
        _set: function(key, value) {
            var shouldConstrainValue = key === "scaleX" || key === "scaleY";
            if (shouldConstrainValue) {
                value = this._constrainScale(value);
            }
            if (key === "scaleX" && value < 0) {
                this.flipX = !this.flipX;
                value *= -1;
            } else if (key === "scaleY" && value < 0) {
                this.flipY = !this.flipY;
                value *= -1;
            } else if (key === "width" || key === "height") {
                this.minScaleLimit = toFixed(Math.min(.1, 1 / Math.max(this.width, this.height)), 2);
            } else if (key === "shadow" && value && !(value instanceof fabric.Shadow)) {
                value = new fabric.Shadow(value);
            }
            this[key] = value;
            return this;
        },
        setOnGroup: function() {},
        toggle: function(property) {
            var value = this.get(property);
            if (typeof value === "boolean") {
                this.set(property, !value);
            }
            return this;
        },
        setSourcePath: function(value) {
            this.sourcePath = value;
            return this;
        },
        getViewportTransform: function() {
            if (this.canvas && this.canvas.viewportTransform) {
                return this.canvas.viewportTransform;
            }
            return [ 1, 0, 0, 1, 0, 0 ];
        },
        render: function(ctx, noTransform) {
            if (this.width === 0 && this.height === 0 || !this.visible) {
                return;
            }
            ctx.save();
            this._setupCompositeOperation(ctx);
            if (!noTransform) {
                this.transform(ctx);
            }
            this._setStrokeStyles(ctx);
            this._setFillStyles(ctx);
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            this._setOpacity(ctx);
            this._setShadow(ctx);
            this.clipTo && fabric.util.clipContext(this, ctx);
            this._render(ctx, noTransform);
            this.clipTo && ctx.restore();
            ctx.restore();
        },
        _setOpacity: function(ctx) {
            if (this.group) {
                this.group._setOpacity(ctx);
            }
            ctx.globalAlpha *= this.opacity;
        },
        _setStrokeStyles: function(ctx) {
            if (this.stroke) {
                ctx.lineWidth = this.strokeWidth;
                ctx.lineCap = this.strokeLineCap;
                ctx.lineJoin = this.strokeLineJoin;
                ctx.miterLimit = this.strokeMiterLimit;
                ctx.strokeStyle = this.stroke.toLive ? this.stroke.toLive(ctx, this) : this.stroke;
            }
        },
        _setFillStyles: function(ctx) {
            if (this.fill) {
                ctx.fillStyle = this.fill.toLive ? this.fill.toLive(ctx, this) : this.fill;
            }
        },
        _renderControls: function(ctx, noTransform) {
            if (!this.active || noTransform) {
                return;
            }
            var vpt = this.getViewportTransform();
            ctx.save();
            var center;
            if (this.group) {
                center = fabric.util.transformPoint(this.group.getCenterPoint(), vpt);
                ctx.translate(center.x, center.y);
                ctx.rotate(degreesToRadians(this.group.angle));
            }
            center = fabric.util.transformPoint(this.getCenterPoint(), vpt, null != this.group);
            if (this.group) {
                center.x *= this.group.scaleX;
                center.y *= this.group.scaleY;
            }
            ctx.translate(center.x, center.y);
            ctx.rotate(degreesToRadians(this.angle));
            this.drawBorders(ctx);
            this.drawControls(ctx);
            ctx.restore();
        },
        _setShadow: function(ctx) {
            if (!this.shadow) {
                return;
            }
            var multX = this.canvas && this.canvas.viewportTransform[0] || 1, multY = this.canvas && this.canvas.viewportTransform[3] || 1;
            ctx.shadowColor = this.shadow.color;
            ctx.shadowBlur = this.shadow.blur * (multX + multY) * (this.scaleX + this.scaleY) / 4;
            ctx.shadowOffsetX = this.shadow.offsetX * multX * this.scaleX;
            ctx.shadowOffsetY = this.shadow.offsetY * multY * this.scaleY;
        },
        _removeShadow: function(ctx) {
            if (!this.shadow) {
                return;
            }
            ctx.shadowColor = "";
            ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
        },
        _renderFill: function(ctx) {
            if (!this.fill) {
                return;
            }
            ctx.save();
            if (this.fill.gradientTransform) {
                var g = this.fill.gradientTransform;
                ctx.transform.apply(ctx, g);
            }
            if (this.fill.toLive) {
                ctx.translate(-this.width / 2 + this.fill.offsetX || 0, -this.height / 2 + this.fill.offsetY || 0);
            }
            if (this.fillRule === "evenodd") {
                ctx.fill("evenodd");
            } else {
                ctx.fill();
            }
            ctx.restore();
        },
        _renderStroke: function(ctx) {
            if (!this.stroke || this.strokeWidth === 0) {
                return;
            }
            if (this.shadow && !this.shadow.affectStroke) {
                this._removeShadow(ctx);
            }
            ctx.save();
            if (this.strokeDashArray) {
                if (1 & this.strokeDashArray.length) {
                    this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
                }
                if (supportsLineDash) {
                    ctx.setLineDash(this.strokeDashArray);
                    this._stroke && this._stroke(ctx);
                } else {
                    this._renderDashedStroke && this._renderDashedStroke(ctx);
                }
                ctx.stroke();
            } else {
                if (this.stroke.gradientTransform) {
                    var g = this.stroke.gradientTransform;
                    ctx.transform.apply(ctx, g);
                }
                this._stroke ? this._stroke(ctx) : ctx.stroke();
            }
            ctx.restore();
        },
        clone: function(callback, propertiesToInclude) {
            if (this.constructor.fromObject) {
                return this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
            }
            return new fabric.Object(this.toObject(propertiesToInclude));
        },
        cloneAsImage: function(callback) {
            var dataUrl = this.toDataURL();
            fabric.util.loadImage(dataUrl, function(img) {
                if (callback) {
                    callback(new fabric.Image(img));
                }
            });
            return this;
        },
        toDataURL: function(options) {
            options || (options = {});
            var el = fabric.util.createCanvasElement(), boundingRect = this.getBoundingRect();
            el.width = boundingRect.width;
            el.height = boundingRect.height;
            fabric.util.wrapElement(el, "div");
            var canvas = new fabric.StaticCanvas(el);
            if (options.format === "jpg") {
                options.format = "jpeg";
            }
            if (options.format === "jpeg") {
                canvas.backgroundColor = "#fff";
            }
            var origParams = {
                active: this.get("active"),
                left: this.getLeft(),
                top: this.getTop()
            };
            this.set("active", false);
            this.setPositionByOrigin(new fabric.Point(el.width / 2, el.height / 2), "center", "center");
            var originalCanvas = this.canvas;
            canvas.add(this);
            var data = canvas.toDataURL(options);
            this.set(origParams).setCoords();
            this.canvas = originalCanvas;
            canvas.dispose();
            canvas = null;
            return data;
        },
        isType: function(type) {
            return this.type === type;
        },
        complexity: function() {
            return 0;
        },
        toJSON: function(propertiesToInclude) {
            return this.toObject(propertiesToInclude);
        },
        setGradient: function(property, options) {
            options || (options = {});
            var gradient = {
                colorStops: []
            };
            gradient.type = options.type || (options.r1 || options.r2 ? "radial" : "linear");
            gradient.coords = {
                x1: options.x1,
                y1: options.y1,
                x2: options.x2,
                y2: options.y2
            };
            if (options.r1 || options.r2) {
                gradient.coords.r1 = options.r1;
                gradient.coords.r2 = options.r2;
            }
            for (var position in options.colorStops) {
                var color = new fabric.Color(options.colorStops[position]);
                gradient.colorStops.push({
                    offset: position,
                    color: color.toRgb(),
                    opacity: color.getAlpha()
                });
            }
            return this.set(property, fabric.Gradient.forObject(this, gradient));
        },
        setPatternFill: function(options) {
            return this.set("fill", new fabric.Pattern(options));
        },
        setShadow: function(options) {
            return this.set("shadow", options ? new fabric.Shadow(options) : null);
        },
        setColor: function(color) {
            this.set("fill", color);
            return this;
        },
        setAngle: function(angle) {
            var shouldCenterOrigin = (this.originX !== "center" || this.originY !== "center") && this.centeredRotation;
            if (shouldCenterOrigin) {
                this._setOriginToCenter();
            }
            this.set("angle", angle);
            if (shouldCenterOrigin) {
                this._resetOrigin();
            }
            return this;
        },
        centerH: function() {
            this.canvas.centerObjectH(this);
            return this;
        },
        centerV: function() {
            this.canvas.centerObjectV(this);
            return this;
        },
        center: function() {
            this.canvas.centerObject(this);
            return this;
        },
        remove: function() {
            this.canvas.remove(this);
            return this;
        },
        getLocalPointer: function(e, pointer) {
            pointer = pointer || this.canvas.getPointer(e);
            var pClicked = new fabric.Point(pointer.x, pointer.y), objectLeftTop = this._getLeftTopCoords();
            if (this.angle) {
                pClicked = fabric.util.rotatePoint(pClicked, objectLeftTop, fabric.util.degreesToRadians(-this.angle));
            }
            return {
                x: pClicked.x - objectLeftTop.x,
                y: pClicked.y - objectLeftTop.y
            };
        },
        _setupCompositeOperation: function(ctx) {
            if (this.globalCompositeOperation) {
                ctx.globalCompositeOperation = this.globalCompositeOperation;
            }
        }
    });
    fabric.util.createAccessors(fabric.Object);
    fabric.Object.prototype.rotate = fabric.Object.prototype.setAngle;
    extend(fabric.Object.prototype, fabric.Observable);
    fabric.Object.NUM_FRACTION_DIGITS = 2;
    fabric.Object.__uid = 0;
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var degreesToRadians = fabric.util.degreesToRadians, originXOffset = {
        left: -.5,
        center: 0,
        right: .5
    }, originYOffset = {
        top: -.5,
        center: 0,
        bottom: .5
    };
    fabric.util.object.extend(fabric.Object.prototype, {
        translateToGivenOrigin: function(point, fromOriginX, fromOriginY, toOriginX, toOriginY) {
            var x = point.x, y = point.y, offsetX = originXOffset[toOriginX] - originXOffset[fromOriginX], offsetY = originYOffset[toOriginY] - originYOffset[fromOriginY], dim;
            if (offsetX || offsetY) {
                dim = this._getTransformedDimensions();
                x = point.x + offsetX * dim.x;
                y = point.y + offsetY * dim.y;
            }
            return new fabric.Point(x, y);
        },
        translateToCenterPoint: function(point, originX, originY) {
            var p = this.translateToGivenOrigin(point, originX, originY, "center", "center");
            if (this.angle) {
                return fabric.util.rotatePoint(p, point, degreesToRadians(this.angle));
            }
            return p;
        },
        translateToOriginPoint: function(center, originX, originY) {
            var p = this.translateToGivenOrigin(center, "center", "center", originX, originY);
            if (this.angle) {
                return fabric.util.rotatePoint(p, center, degreesToRadians(this.angle));
            }
            return p;
        },
        getCenterPoint: function() {
            var leftTop = new fabric.Point(this.left, this.top);
            return this.translateToCenterPoint(leftTop, this.originX, this.originY);
        },
        getPointByOrigin: function(originX, originY) {
            var center = this.getCenterPoint();
            return this.translateToOriginPoint(center, originX, originY);
        },
        toLocalPoint: function(point, originX, originY) {
            var center = this.getCenterPoint(), p, p2;
            if (originX && originY) {
                p = this.translateToGivenOrigin(center, "center", "center", originX, originY);
            } else {
                p = new fabric.Point(this.left, this.top);
            }
            p2 = new fabric.Point(point.x, point.y);
            if (this.angle) {
                p2 = fabric.util.rotatePoint(p2, center, -degreesToRadians(this.angle));
            }
            return p2.subtractEquals(p);
        },
        setPositionByOrigin: function(pos, originX, originY) {
            var center = this.translateToCenterPoint(pos, originX, originY), position = this.translateToOriginPoint(center, this.originX, this.originY);
            this.set("left", position.x);
            this.set("top", position.y);
        },
        adjustPosition: function(to) {
            var angle = degreesToRadians(this.angle), hypotFull = this.getWidth(), xFull = Math.cos(angle) * hypotFull, yFull = Math.sin(angle) * hypotFull;
            this.left += xFull * (originXOffset[to] - originXOffset[this.originX]);
            this.top += yFull * (originXOffset[to] - originXOffset[this.originX]);
            this.setCoords();
            this.originX = to;
        },
        _setOriginToCenter: function() {
            this._originalOriginX = this.originX;
            this._originalOriginY = this.originY;
            var center = this.getCenterPoint();
            this.originX = "center";
            this.originY = "center";
            this.left = center.x;
            this.top = center.y;
        },
        _resetOrigin: function() {
            var originPoint = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
            this.originX = this._originalOriginX;
            this.originY = this._originalOriginY;
            this.left = originPoint.x;
            this.top = originPoint.y;
            this._originalOriginX = null;
            this._originalOriginY = null;
        },
        _getLeftTopCoords: function() {
            return this.translateToOriginPoint(this.getCenterPoint(), "left", "top");
        }
    });
})();

(function() {
    var degreesToRadians = fabric.util.degreesToRadians;
    fabric.util.object.extend(fabric.Object.prototype, {
        oCoords: null,
        intersectsWithRect: function(pointTL, pointBR) {
            var oCoords = this.oCoords, tl = new fabric.Point(oCoords.tl.x, oCoords.tl.y), tr = new fabric.Point(oCoords.tr.x, oCoords.tr.y), bl = new fabric.Point(oCoords.bl.x, oCoords.bl.y), br = new fabric.Point(oCoords.br.x, oCoords.br.y), intersection = fabric.Intersection.intersectPolygonRectangle([ tl, tr, br, bl ], pointTL, pointBR);
            return intersection.status === "Intersection";
        },
        intersectsWithObject: function(other) {
            function getCoords(oCoords) {
                return {
                    tl: new fabric.Point(oCoords.tl.x, oCoords.tl.y),
                    tr: new fabric.Point(oCoords.tr.x, oCoords.tr.y),
                    bl: new fabric.Point(oCoords.bl.x, oCoords.bl.y),
                    br: new fabric.Point(oCoords.br.x, oCoords.br.y)
                };
            }
            var thisCoords = getCoords(this.oCoords), otherCoords = getCoords(other.oCoords), intersection = fabric.Intersection.intersectPolygonPolygon([ thisCoords.tl, thisCoords.tr, thisCoords.br, thisCoords.bl ], [ otherCoords.tl, otherCoords.tr, otherCoords.br, otherCoords.bl ]);
            return intersection.status === "Intersection";
        },
        isContainedWithinObject: function(other) {
            var boundingRect = other.getBoundingRect(), point1 = new fabric.Point(boundingRect.left, boundingRect.top), point2 = new fabric.Point(boundingRect.left + boundingRect.width, boundingRect.top + boundingRect.height);
            return this.isContainedWithinRect(point1, point2);
        },
        isContainedWithinRect: function(pointTL, pointBR) {
            var boundingRect = this.getBoundingRect();
            return boundingRect.left >= pointTL.x && boundingRect.left + boundingRect.width <= pointBR.x && boundingRect.top >= pointTL.y && boundingRect.top + boundingRect.height <= pointBR.y;
        },
        containsPoint: function(point) {
            var lines = this._getImageLines(this.oCoords), xPoints = this._findCrossPoints(point, lines);
            return xPoints !== 0 && xPoints % 2 === 1;
        },
        _getImageLines: function(oCoords) {
            return {
                topline: {
                    o: oCoords.tl,
                    d: oCoords.tr
                },
                rightline: {
                    o: oCoords.tr,
                    d: oCoords.br
                },
                bottomline: {
                    o: oCoords.br,
                    d: oCoords.bl
                },
                leftline: {
                    o: oCoords.bl,
                    d: oCoords.tl
                }
            };
        },
        _findCrossPoints: function(point, oCoords) {
            var b1, b2, a1, a2, xi, yi, xcount = 0, iLine;
            for (var lineKey in oCoords) {
                iLine = oCoords[lineKey];
                if (iLine.o.y < point.y && iLine.d.y < point.y) {
                    continue;
                }
                if (iLine.o.y >= point.y && iLine.d.y >= point.y) {
                    continue;
                }
                if (iLine.o.x === iLine.d.x && iLine.o.x >= point.x) {
                    xi = iLine.o.x;
                    yi = point.y;
                } else {
                    b1 = 0;
                    b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
                    a1 = point.y - b1 * point.x;
                    a2 = iLine.o.y - b2 * iLine.o.x;
                    xi = -(a1 - a2) / (b1 - b2);
                    yi = a1 + b1 * xi;
                }
                if (xi >= point.x) {
                    xcount += 1;
                }
                if (xcount === 2) {
                    break;
                }
            }
            return xcount;
        },
        getBoundingRectWidth: function() {
            return this.getBoundingRect().width;
        },
        getBoundingRectHeight: function() {
            return this.getBoundingRect().height;
        },
        getBoundingRect: function() {
            this.oCoords || this.setCoords();
            var xCoords = [ this.oCoords.tl.x, this.oCoords.tr.x, this.oCoords.br.x, this.oCoords.bl.x ], minX = fabric.util.array.min(xCoords), maxX = fabric.util.array.max(xCoords), width = Math.abs(minX - maxX), yCoords = [ this.oCoords.tl.y, this.oCoords.tr.y, this.oCoords.br.y, this.oCoords.bl.y ], minY = fabric.util.array.min(yCoords), maxY = fabric.util.array.max(yCoords), height = Math.abs(minY - maxY);
            return {
                left: minX,
                top: minY,
                width: width,
                height: height
            };
        },
        getWidth: function() {
            return this.width * this.scaleX;
        },
        getHeight: function() {
            return this.height * this.scaleY;
        },
        _constrainScale: function(value) {
            if (Math.abs(value) < this.minScaleLimit) {
                if (value < 0) {
                    return -this.minScaleLimit;
                } else {
                    return this.minScaleLimit;
                }
            }
            return value;
        },
        scale: function(value) {
            value = this._constrainScale(value);
            if (value < 0) {
                this.flipX = !this.flipX;
                this.flipY = !this.flipY;
                value *= -1;
            }
            this.scaleX = value;
            this.scaleY = value;
            this.setCoords();
            return this;
        },
        scaleToWidth: function(value) {
            var boundingRectFactor = this.getBoundingRectWidth() / this.getWidth();
            return this.scale(value / this.width / boundingRectFactor);
        },
        scaleToHeight: function(value) {
            var boundingRectFactor = this.getBoundingRectHeight() / this.getHeight();
            return this.scale(value / this.height / boundingRectFactor);
        },
        setCoords: function() {
            var theta = degreesToRadians(this.angle), vpt = this.getViewportTransform(), dim = this._calculateCurrentDimensions(true), currentWidth = dim.x, currentHeight = dim.y;
            if (currentWidth < 0) {
                currentWidth = Math.abs(currentWidth);
            }
            var sinTh = Math.sin(theta), cosTh = Math.cos(theta), _angle = currentWidth > 0 ? Math.atan(currentHeight / currentWidth) : 0, _hypotenuse = currentWidth / Math.cos(_angle) / 2, offsetX = Math.cos(_angle + theta) * _hypotenuse, offsetY = Math.sin(_angle + theta) * _hypotenuse, coords = fabric.util.transformPoint(this.getCenterPoint(), vpt), tl = new fabric.Point(coords.x - offsetX, coords.y - offsetY), tr = new fabric.Point(tl.x + currentWidth * cosTh, tl.y + currentWidth * sinTh), bl = new fabric.Point(tl.x - currentHeight * sinTh, tl.y + currentHeight * cosTh), br = new fabric.Point(coords.x + offsetX, coords.y + offsetY), ml = new fabric.Point((tl.x + bl.x) / 2, (tl.y + bl.y) / 2), mt = new fabric.Point((tr.x + tl.x) / 2, (tr.y + tl.y) / 2), mr = new fabric.Point((br.x + tr.x) / 2, (br.y + tr.y) / 2), mb = new fabric.Point((br.x + bl.x) / 2, (br.y + bl.y) / 2), mtr = new fabric.Point(mt.x + sinTh * this.rotatingPointOffset, mt.y - cosTh * this.rotatingPointOffset);
            this.oCoords = {
                tl: tl,
                tr: tr,
                br: br,
                bl: bl,
                ml: ml,
                mt: mt,
                mr: mr,
                mb: mb,
                mtr: mtr
            };
            this._setCornerCoords && this._setCornerCoords();
            return this;
        },
        _calcDimensionsTransformMatrix: function() {
            return [ this.scaleX, 0, 0, this.scaleY, 0, 0 ];
        }
    });
})();

fabric.util.object.extend(fabric.Object.prototype, {
    sendToBack: function() {
        if (this.group) {
            fabric.StaticCanvas.prototype.sendToBack.call(this.group, this);
        } else {
            this.canvas.sendToBack(this);
        }
        return this;
    },
    bringToFront: function() {
        if (this.group) {
            fabric.StaticCanvas.prototype.bringToFront.call(this.group, this);
        } else {
            this.canvas.bringToFront(this);
        }
        return this;
    },
    sendBackwards: function(intersecting) {
        if (this.group) {
            fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, intersecting);
        } else {
            this.canvas.sendBackwards(this, intersecting);
        }
        return this;
    },
    bringForward: function(intersecting) {
        if (this.group) {
            fabric.StaticCanvas.prototype.bringForward.call(this.group, this, intersecting);
        } else {
            this.canvas.bringForward(this, intersecting);
        }
        return this;
    },
    moveTo: function(index) {
        if (this.group) {
            fabric.StaticCanvas.prototype.moveTo.call(this.group, this, index);
        } else {
            this.canvas.moveTo(this, index);
        }
        return this;
    }
});

fabric.util.object.extend(fabric.Object.prototype, {
    getSvgStyles: function() {
        var fill = this.fill ? this.fill.toLive ? "url(#SVGID_" + this.fill.id + ")" : this.fill : "none", fillRule = this.fillRule, stroke = this.stroke ? this.stroke.toLive ? "url(#SVGID_" + this.stroke.id + ")" : this.stroke : "none", strokeWidth = this.strokeWidth ? this.strokeWidth : "0", strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none", strokeLineCap = this.strokeLineCap ? this.strokeLineCap : "butt", strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : "miter", strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : "4", opacity = typeof this.opacity !== "undefined" ? this.opacity : "1", visibility = this.visible ? "" : " visibility: hidden;", filter = this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : "";
        return [ "stroke: ", stroke, "; ", "stroke-width: ", strokeWidth, "; ", "stroke-dasharray: ", strokeDashArray, "; ", "stroke-linecap: ", strokeLineCap, "; ", "stroke-linejoin: ", strokeLineJoin, "; ", "stroke-miterlimit: ", strokeMiterLimit, "; ", "fill: ", fill, "; ", "fill-rule: ", fillRule, "; ", "opacity: ", opacity, ";", filter, visibility ].join("");
    },
    getSvgTransform: function() {
        if (this.group && this.group.type === "path-group") {
            return "";
        }
        var toFixed = fabric.util.toFixed, angle = this.getAngle(), vpt = !this.canvas || this.canvas.svgViewportTransformation ? this.getViewportTransform() : [ 1, 0, 0, 1, 0, 0 ], center = fabric.util.transformPoint(this.getCenterPoint(), vpt), NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS, translatePart = this.type === "path-group" ? "" : "translate(" + toFixed(center.x, NUM_FRACTION_DIGITS) + " " + toFixed(center.y, NUM_FRACTION_DIGITS) + ")", anglePart = angle !== 0 ? " rotate(" + toFixed(angle, NUM_FRACTION_DIGITS) + ")" : "", scalePart = this.scaleX === 1 && this.scaleY === 1 && vpt[0] === 1 && vpt[3] === 1 ? "" : " scale(" + toFixed(this.scaleX * vpt[0], NUM_FRACTION_DIGITS) + " " + toFixed(this.scaleY * vpt[3], NUM_FRACTION_DIGITS) + ")", addTranslateX = this.type === "path-group" ? this.width * vpt[0] : 0, flipXPart = this.flipX ? " matrix(-1 0 0 1 " + addTranslateX + " 0) " : "", addTranslateY = this.type === "path-group" ? this.height * vpt[3] : 0, flipYPart = this.flipY ? " matrix(1 0 0 -1 0 " + addTranslateY + ")" : "";
        return [ translatePart, anglePart, scalePart, flipXPart, flipYPart ].join("");
    },
    getSvgTransformMatrix: function() {
        return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ") " : "";
    },
    _createBaseSVGMarkup: function() {
        var markup = [];
        if (this.fill && this.fill.toLive) {
            markup.push(this.fill.toSVG(this, false));
        }
        if (this.stroke && this.stroke.toLive) {
            markup.push(this.stroke.toSVG(this, false));
        }
        if (this.shadow) {
            markup.push(this.shadow.toSVG(this));
        }
        return markup;
    }
});

fabric.util.object.extend(fabric.Object.prototype, {
    hasStateChanged: function() {
        return this.stateProperties.some(function(prop) {
            return this.get(prop) !== this.originalState[prop];
        }, this);
    },
    saveState: function(options) {
        this.stateProperties.forEach(function(prop) {
            this.originalState[prop] = this.get(prop);
        }, this);
        if (options && options.stateProperties) {
            options.stateProperties.forEach(function(prop) {
                this.originalState[prop] = this.get(prop);
            }, this);
        }
        return this;
    },
    setupState: function() {
        this.originalState = {};
        this.saveState();
        return this;
    }
});

(function() {
    var degreesToRadians = fabric.util.degreesToRadians, isVML = function() {
        return typeof G_vmlCanvasManager !== "undefined";
    };
    fabric.util.object.extend(fabric.Object.prototype, {
        _controlsVisibility: null,
        _findTargetCorner: function(pointer) {
            if (!this.hasControls || !this.active) {
                return false;
            }
            var ex = pointer.x, ey = pointer.y, xPoints, lines;
            for (var i in this.oCoords) {
                if (!this.isControlVisible(i)) {
                    continue;
                }
                if (i === "mtr" && !this.hasRotatingPoint) {
                    continue;
                }
                if (this.get("lockUniScaling") && (i === "mt" || i === "mr" || i === "mb" || i === "ml")) {
                    continue;
                }
                lines = this._getImageLines(this.oCoords[i].corner);
                xPoints = this._findCrossPoints({
                    x: ex,
                    y: ey
                }, lines);
                if (xPoints !== 0 && xPoints % 2 === 1) {
                    this.__corner = i;
                    return i;
                }
            }
            return false;
        },
        _setCornerCoords: function() {
            var coords = this.oCoords, newTheta = degreesToRadians(45 - this.angle), cornerHypotenuse = this.cornerSize * .707106, cosHalfOffset = cornerHypotenuse * Math.cos(newTheta), sinHalfOffset = cornerHypotenuse * Math.sin(newTheta), x, y;
            for (var point in coords) {
                x = coords[point].x;
                y = coords[point].y;
                coords[point].corner = {
                    tl: {
                        x: x - sinHalfOffset,
                        y: y - cosHalfOffset
                    },
                    tr: {
                        x: x + cosHalfOffset,
                        y: y - sinHalfOffset
                    },
                    bl: {
                        x: x - cosHalfOffset,
                        y: y + sinHalfOffset
                    },
                    br: {
                        x: x + sinHalfOffset,
                        y: y + cosHalfOffset
                    }
                };
            }
        },
        _getNonTransformedDimensions: function() {
            var strokeWidth = this.strokeWidth, w = this.width, h = this.height, capped = this.strokeLineCap === "round" || this.strokeLineCap === "square", vLine = this.type === "line" && this.width === 0, hLine = this.type === "line" && this.height === 0, sLine = vLine || hLine, strokeW = capped && hLine || !sLine, strokeH = capped && vLine || !sLine;
            if (vLine) {
                w = strokeWidth;
            } else if (hLine) {
                h = strokeWidth;
            }
            if (strokeW) {
                w += w < 0 ? -strokeWidth : strokeWidth;
            }
            if (strokeH) {
                h += h < 0 ? -strokeWidth : strokeWidth;
            }
            return {
                x: w,
                y: h
            };
        },
        _getTransformedDimensions: function(dimensions) {
            if (!dimensions) {
                dimensions = this._getNonTransformedDimensions();
            }
            var transformMatrix = this._calcDimensionsTransformMatrix();
            return fabric.util.transformPoint(dimensions, transformMatrix, true);
        },
        _calculateCurrentDimensions: function(shouldTransform) {
            var vpt = this.getViewportTransform(), dim = this._getTransformedDimensions(), w = dim.x, h = dim.y;
            w += 2 * this.padding;
            h += 2 * this.padding;
            if (shouldTransform) {
                return fabric.util.transformPoint(new fabric.Point(w, h), vpt, true);
            }
            return {
                x: w,
                y: h
            };
        },
        drawBorders: function(ctx) {
            if (!this.hasBorders) {
                return this;
            }
            ctx.save();
            ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = 1 / this.borderScaleFactor;
            var wh = this._calculateCurrentDimensions(true), width = wh.x, height = wh.y;
            if (this.group) {
                width = width * this.group.scaleX;
                height = height * this.group.scaleY;
            }
            ctx.strokeRect(~~-(width / 2) - .5, ~~-(height / 2) - .5, ~~width + 1, ~~height + 1);
            if (this.hasRotatingPoint && this.isControlVisible("mtr") && !this.get("lockRotation") && this.hasControls) {
                var rotateHeight = -height / 2;
                ctx.beginPath();
                ctx.moveTo(0, rotateHeight);
                ctx.lineTo(0, rotateHeight - this.rotatingPointOffset);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
            return this;
        },
        drawControls: function(ctx) {
            if (!this.hasControls) {
                return this;
            }
            var wh = this._calculateCurrentDimensions(true), width = wh.x, height = wh.y, left = -(width / 2), top = -(height / 2), scaleOffset = this.cornerSize / 2, methodName = this.transparentCorners ? "strokeRect" : "fillRect";
            ctx.save();
            ctx.lineWidth = 1;
            ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            ctx.strokeStyle = ctx.fillStyle = this.cornerColor;
            this._drawControl("tl", ctx, methodName, left - scaleOffset, top - scaleOffset);
            this._drawControl("tr", ctx, methodName, left + width - scaleOffset, top - scaleOffset);
            this._drawControl("bl", ctx, methodName, left - scaleOffset, top + height - scaleOffset);
            this._drawControl("br", ctx, methodName, left + width - scaleOffset, top + height - scaleOffset);
            if (!this.get("lockUniScaling")) {
                this._drawControl("mt", ctx, methodName, left + width / 2 - scaleOffset, top - scaleOffset);
                this._drawControl("mb", ctx, methodName, left + width / 2 - scaleOffset, top + height - scaleOffset);
                this._drawControl("mr", ctx, methodName, left + width - scaleOffset, top + height / 2 - scaleOffset);
                this._drawControl("ml", ctx, methodName, left - scaleOffset, top + height / 2 - scaleOffset);
            }
            if (this.hasRotatingPoint) {
                this._drawControl("mtr", ctx, methodName, left + width / 2 - scaleOffset, top - this.rotatingPointOffset - scaleOffset);
            }
            ctx.restore();
            return this;
        },
        _drawControl: function(control, ctx, methodName, left, top) {
            if (!this.isControlVisible(control)) {
                return;
            }
            var size = this.cornerSize;
            isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);
            ctx[methodName](left, top, size, size);
        },
        isControlVisible: function(controlName) {
            return this._getControlsVisibility()[controlName];
        },
        setControlVisible: function(controlName, visible) {
            this._getControlsVisibility()[controlName] = visible;
            return this;
        },
        setControlsVisibility: function(options) {
            options || (options = {});
            for (var p in options) {
                this.setControlVisible(p, options[p]);
            }
            return this;
        },
        _getControlsVisibility: function() {
            if (!this._controlsVisibility) {
                this._controlsVisibility = {
                    tl: true,
                    tr: true,
                    br: true,
                    bl: true,
                    ml: true,
                    mt: true,
                    mr: true,
                    mb: true,
                    mtr: true
                };
            }
            return this._controlsVisibility;
        }
    });
})();

fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    FX_DURATION: 500,
    fxCenterObjectH: function(object, callbacks) {
        callbacks = callbacks || {};
        var empty = function() {}, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
        fabric.util.animate({
            startValue: object.get("left"),
            endValue: this.getCenter().left,
            duration: this.FX_DURATION,
            onChange: function(value) {
                object.set("left", value);
                _this.renderAll();
                onChange();
            },
            onComplete: function() {
                object.setCoords();
                onComplete();
            }
        });
        return this;
    },
    fxCenterObjectV: function(object, callbacks) {
        callbacks = callbacks || {};
        var empty = function() {}, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
        fabric.util.animate({
            startValue: object.get("top"),
            endValue: this.getCenter().top,
            duration: this.FX_DURATION,
            onChange: function(value) {
                object.set("top", value);
                _this.renderAll();
                onChange();
            },
            onComplete: function() {
                object.setCoords();
                onComplete();
            }
        });
        return this;
    },
    fxRemove: function(object, callbacks) {
        callbacks = callbacks || {};
        var empty = function() {}, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
        fabric.util.animate({
            startValue: object.get("opacity"),
            endValue: 0,
            duration: this.FX_DURATION,
            onStart: function() {
                object.set("active", false);
            },
            onChange: function(value) {
                object.set("opacity", value);
                _this.renderAll();
                onChange();
            },
            onComplete: function() {
                _this.remove(object);
                onComplete();
            }
        });
        return this;
    }
});

fabric.util.object.extend(fabric.Object.prototype, {
    animate: function() {
        if (arguments[0] && typeof arguments[0] === "object") {
            var propsToAnimate = [], prop, skipCallbacks;
            for (prop in arguments[0]) {
                propsToAnimate.push(prop);
            }
            for (var i = 0, len = propsToAnimate.length; i < len; i++) {
                prop = propsToAnimate[i];
                skipCallbacks = i !== len - 1;
                this._animate(prop, arguments[0][prop], arguments[1], skipCallbacks);
            }
        } else {
            this._animate.apply(this, arguments);
        }
        return this;
    },
    _animate: function(property, to, options, skipCallbacks) {
        var _this = this, propPair;
        to = to.toString();
        if (!options) {
            options = {};
        } else {
            options = fabric.util.object.clone(options);
        }
        if (~property.indexOf(".")) {
            propPair = property.split(".");
        }
        var currentValue = propPair ? this.get(propPair[0])[propPair[1]] : this.get(property);
        if (!("from" in options)) {
            options.from = currentValue;
        }
        if (~to.indexOf("=")) {
            to = currentValue + parseFloat(to.replace("=", ""));
        } else {
            to = parseFloat(to);
        }
        fabric.util.animate({
            startValue: options.from,
            endValue: to,
            byValue: options.by,
            easing: options.easing,
            duration: options.duration,
            abort: options.abort && function() {
                return options.abort.call(_this);
            },
            onChange: function(value) {
                if (propPair) {
                    _this[propPair[0]][propPair[1]] = value;
                } else {
                    _this.set(property, value);
                }
                if (skipCallbacks) {
                    return;
                }
                options.onChange && options.onChange();
            },
            onComplete: function() {
                if (skipCallbacks) {
                    return;
                }
                _this.setCoords();
                options.onComplete && options.onComplete();
            }
        });
    }
});

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, coordProps = {
        x1: 1,
        x2: 1,
        y1: 1,
        y2: 1
    }, supportsLineDash = fabric.StaticCanvas.supports("setLineDash");
    if (fabric.Line) {
        fabric.warn("fabric.Line is already defined");
        return;
    }
    fabric.Line = fabric.util.createClass(fabric.Object, {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        initialize: function(points, options) {
            options = options || {};
            if (!points) {
                points = [ 0, 0, 0, 0 ];
            }
            this.callSuper("initialize", options);
            this.set("x1", points[0]);
            this.set("y1", points[1]);
            this.set("x2", points[2]);
            this.set("y2", points[3]);
            this._setWidthHeight(options);
        },
        _setWidthHeight: function(options) {
            options || (options = {});
            this.width = Math.abs(this.x2 - this.x1);
            this.height = Math.abs(this.y2 - this.y1);
            this.left = "left" in options ? options.left : this._getLeftToOriginX();
            this.top = "top" in options ? options.top : this._getTopToOriginY();
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            if (typeof coordProps[key] !== "undefined") {
                this._setWidthHeight();
            }
            return this;
        },
        _getLeftToOriginX: makeEdgeToOriginGetter({
            origin: "originX",
            axis1: "x1",
            axis2: "x2",
            dimension: "width"
        }, {
            nearest: "left",
            center: "center",
            farthest: "right"
        }),
        _getTopToOriginY: makeEdgeToOriginGetter({
            origin: "originY",
            axis1: "y1",
            axis2: "y2",
            dimension: "height"
        }, {
            nearest: "top",
            center: "center",
            farthest: "bottom"
        }),
        _render: function(ctx, noTransform) {
            ctx.beginPath();
            if (noTransform) {
                var cp = this.getCenterPoint();
                ctx.translate(cp.x - this.strokeWidth / 2, cp.y - this.strokeWidth / 2);
            }
            if (!this.strokeDashArray || this.strokeDashArray && supportsLineDash) {
                var p = this.calcLinePoints();
                ctx.moveTo(p.x1, p.y1);
                ctx.lineTo(p.x2, p.y2);
            }
            ctx.lineWidth = this.strokeWidth;
            var origStrokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = this.stroke || ctx.fillStyle;
            this.stroke && this._renderStroke(ctx);
            ctx.strokeStyle = origStrokeStyle;
        },
        _renderDashedStroke: function(ctx) {
            var p = this.calcLinePoints();
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, p.x1, p.y1, p.x2, p.y2, this.strokeDashArray);
            ctx.closePath();
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), this.calcLinePoints());
        },
        calcLinePoints: function() {
            var xMult = this.x1 <= this.x2 ? -1 : 1, yMult = this.y1 <= this.y2 ? -1 : 1, x1 = xMult * this.width * .5, y1 = yMult * this.height * .5, x2 = xMult * this.width * -.5, y2 = yMult * this.height * -.5;
            return {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            };
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), p = {
                x1: this.x1,
                x2: this.x2,
                y1: this.y1,
                y2: this.y2
            };
            if (!(this.group && this.group.type === "path-group")) {
                p = this.calcLinePoints();
            }
            markup.push("<line ", 'x1="', p.x1, '" y1="', p.y1, '" x2="', p.x2, '" y2="', p.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Line.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" "));
    fabric.Line.fromElement = function(element, options) {
        var parsedAttributes = fabric.parseAttributes(element, fabric.Line.ATTRIBUTE_NAMES), points = [ parsedAttributes.x1 || 0, parsedAttributes.y1 || 0, parsedAttributes.x2 || 0, parsedAttributes.y2 || 0 ];
        return new fabric.Line(points, extend(parsedAttributes, options));
    };
    fabric.Line.fromObject = function(object) {
        var points = [ object.x1, object.y1, object.x2, object.y2 ];
        return new fabric.Line(points, object);
    };
    function makeEdgeToOriginGetter(propertyNames, originValues) {
        var origin = propertyNames.origin, axis1 = propertyNames.axis1, axis2 = propertyNames.axis2, dimension = propertyNames.dimension, nearest = originValues.nearest, center = originValues.center, farthest = originValues.farthest;
        return function() {
            switch (this.get(origin)) {
              case nearest:
                return Math.min(this.get(axis1), this.get(axis2));

              case center:
                return Math.min(this.get(axis1), this.get(axis2)) + .5 * this.get(dimension);

              case farthest:
                return Math.max(this.get(axis1), this.get(axis2));
            }
        };
    }
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), pi = Math.PI, extend = fabric.util.object.extend;
    if (fabric.Circle) {
        fabric.warn("fabric.Circle is already defined.");
        return;
    }
    fabric.Circle = fabric.util.createClass(fabric.Object, {
        type: "circle",
        radius: 0,
        startAngle: 0,
        endAngle: pi * 2,
        initialize: function(options) {
            options = options || {};
            this.callSuper("initialize", options);
            this.set("radius", options.radius || 0);
            this.startAngle = options.startAngle || this.startAngle;
            this.endAngle = options.endAngle || this.endAngle;
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            if (key === "radius") {
                this.setRadius(value);
            }
            return this;
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), {
                radius: this.get("radius"),
                startAngle: this.startAngle,
                endAngle: this.endAngle
            });
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), x = 0, y = 0, angle = (this.endAngle - this.startAngle) % (2 * pi);
            if (angle === 0) {
                if (this.group && this.group.type === "path-group") {
                    x = this.left + this.radius;
                    y = this.top + this.radius;
                }
                markup.push("<circle ", 'cx="' + x + '" cy="' + y + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
            } else {
                var startX = Math.cos(this.startAngle) * this.radius, startY = Math.sin(this.startAngle) * this.radius, endX = Math.cos(this.endAngle) * this.radius, endY = Math.sin(this.endAngle) * this.radius, largeFlag = angle > pi ? "1" : "0";
                markup.push('<path d="M ' + startX + " " + startY, " A " + this.radius + " " + this.radius, " 0 ", +largeFlag + " 1", " " + endX + " " + endY, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
            }
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _render: function(ctx, noTransform) {
            ctx.beginPath();
            ctx.arc(noTransform ? this.left + this.radius : 0, noTransform ? this.top + this.radius : 0, this.radius, this.startAngle, this.endAngle, false);
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        getRadiusX: function() {
            return this.get("radius") * this.get("scaleX");
        },
        getRadiusY: function() {
            return this.get("radius") * this.get("scaleY");
        },
        setRadius: function(value) {
            this.radius = value;
            return this.set("width", value * 2).set("height", value * 2);
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Circle.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("cx cy r".split(" "));
    fabric.Circle.fromElement = function(element, options) {
        options || (options = {});
        var parsedAttributes = fabric.parseAttributes(element, fabric.Circle.ATTRIBUTE_NAMES);
        if (!isValidRadius(parsedAttributes)) {
            throw new Error("value of `r` attribute is required and can not be negative");
        }
        parsedAttributes.left = parsedAttributes.left || 0;
        parsedAttributes.top = parsedAttributes.top || 0;
        var obj = new fabric.Circle(extend(parsedAttributes, options));
        obj.left -= obj.radius;
        obj.top -= obj.radius;
        return obj;
    };
    function isValidRadius(attributes) {
        return "radius" in attributes && attributes.radius >= 0;
    }
    fabric.Circle.fromObject = function(object) {
        return new fabric.Circle(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Triangle) {
        fabric.warn("fabric.Triangle is already defined");
        return;
    }
    fabric.Triangle = fabric.util.createClass(fabric.Object, {
        type: "triangle",
        initialize: function(options) {
            options = options || {};
            this.callSuper("initialize", options);
            this.set("width", options.width || 100).set("height", options.height || 100);
        },
        _render: function(ctx) {
            var widthBy2 = this.width / 2, heightBy2 = this.height / 2;
            ctx.beginPath();
            ctx.moveTo(-widthBy2, heightBy2);
            ctx.lineTo(0, -heightBy2);
            ctx.lineTo(widthBy2, heightBy2);
            ctx.closePath();
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        _renderDashedStroke: function(ctx) {
            var widthBy2 = this.width / 2, heightBy2 = this.height / 2;
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, -widthBy2, heightBy2, 0, -heightBy2, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, 0, -heightBy2, widthBy2, heightBy2, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, widthBy2, heightBy2, -widthBy2, heightBy2, this.strokeDashArray);
            ctx.closePath();
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), widthBy2 = this.width / 2, heightBy2 = this.height / 2, points = [ -widthBy2 + " " + heightBy2, "0 " + -heightBy2, widthBy2 + " " + heightBy2 ].join(",");
            markup.push("<polygon ", 'points="', points, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Triangle.fromObject = function(object) {
        return new fabric.Triangle(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), piBy2 = Math.PI * 2, extend = fabric.util.object.extend;
    if (fabric.Ellipse) {
        fabric.warn("fabric.Ellipse is already defined.");
        return;
    }
    fabric.Ellipse = fabric.util.createClass(fabric.Object, {
        type: "ellipse",
        rx: 0,
        ry: 0,
        initialize: function(options) {
            options = options || {};
            this.callSuper("initialize", options);
            this.set("rx", options.rx || 0);
            this.set("ry", options.ry || 0);
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            switch (key) {
              case "rx":
                this.rx = value;
                this.set("width", value * 2);
                break;

              case "ry":
                this.ry = value;
                this.set("height", value * 2);
                break;
            }
            return this;
        },
        getRx: function() {
            return this.get("rx") * this.get("scaleX");
        },
        getRy: function() {
            return this.get("ry") * this.get("scaleY");
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), {
                rx: this.get("rx"),
                ry: this.get("ry")
            });
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), x = 0, y = 0;
            if (this.group && this.group.type === "path-group") {
                x = this.left + this.rx;
                y = this.top + this.ry;
            }
            markup.push("<ellipse ", 'cx="', x, '" cy="', y, '" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _render: function(ctx, noTransform) {
            ctx.beginPath();
            ctx.save();
            ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
            ctx.arc(noTransform ? this.left + this.rx : 0, noTransform ? (this.top + this.ry) * this.rx / this.ry : 0, this.rx, 0, piBy2, false);
            ctx.restore();
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Ellipse.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" "));
    fabric.Ellipse.fromElement = function(element, options) {
        options || (options = {});
        var parsedAttributes = fabric.parseAttributes(element, fabric.Ellipse.ATTRIBUTE_NAMES);
        parsedAttributes.left = parsedAttributes.left || 0;
        parsedAttributes.top = parsedAttributes.top || 0;
        var ellipse = new fabric.Ellipse(extend(parsedAttributes, options));
        ellipse.top -= ellipse.ry;
        ellipse.left -= ellipse.rx;
        return ellipse;
    };
    fabric.Ellipse.fromObject = function(object) {
        return new fabric.Ellipse(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    if (fabric.Rect) {
        fabric.warn("fabric.Rect is already defined");
        return;
    }
    var stateProperties = fabric.Object.prototype.stateProperties.concat();
    stateProperties.push("rx", "ry", "x", "y");
    fabric.Rect = fabric.util.createClass(fabric.Object, {
        stateProperties: stateProperties,
        type: "rect",
        rx: 0,
        ry: 0,
        strokeDashArray: null,
        initialize: function(options) {
            options = options || {};
            this.callSuper("initialize", options);
            this._initRxRy();
        },
        _initRxRy: function() {
            if (this.rx && !this.ry) {
                this.ry = this.rx;
            } else if (this.ry && !this.rx) {
                this.rx = this.ry;
            }
        },
        _render: function(ctx, noTransform) {
            if (this.width === 1 && this.height === 1) {
                ctx.fillRect(0, 0, 1, 1);
                return;
            }
            var rx = this.rx ? Math.min(this.rx, this.width / 2) : 0, ry = this.ry ? Math.min(this.ry, this.height / 2) : 0, w = this.width, h = this.height, x = noTransform ? this.left : -this.width / 2, y = noTransform ? this.top : -this.height / 2, isRounded = rx !== 0 || ry !== 0, k = 1 - .5522847498;
            ctx.beginPath();
            ctx.moveTo(x + rx, y);
            ctx.lineTo(x + w - rx, y);
            isRounded && ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry);
            ctx.lineTo(x + w, y + h - ry);
            isRounded && ctx.bezierCurveTo(x + w, y + h - k * ry, x + w - k * rx, y + h, x + w - rx, y + h);
            ctx.lineTo(x + rx, y + h);
            isRounded && ctx.bezierCurveTo(x + k * rx, y + h, x, y + h - k * ry, x, y + h - ry);
            ctx.lineTo(x, y + ry);
            isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);
            ctx.closePath();
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        _renderDashedStroke: function(ctx) {
            var x = -this.width / 2, y = -this.height / 2, w = this.width, h = this.height;
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
            ctx.closePath();
        },
        toObject: function(propertiesToInclude) {
            var object = extend(this.callSuper("toObject", propertiesToInclude), {
                rx: this.get("rx") || 0,
                ry: this.get("ry") || 0
            });
            if (!this.includeDefaultValues) {
                this._removeDefaultValues(object);
            }
            return object;
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), x = this.left, y = this.top;
            if (!(this.group && this.group.type === "path-group")) {
                x = -this.width / 2;
                y = -this.height / 2;
            }
            markup.push("<rect ", 'x="', x, '" y="', y, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Rect.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" "));
    fabric.Rect.fromElement = function(element, options) {
        if (!element) {
            return null;
        }
        options = options || {};
        var parsedAttributes = fabric.parseAttributes(element, fabric.Rect.ATTRIBUTE_NAMES);
        parsedAttributes.left = parsedAttributes.left || 0;
        parsedAttributes.top = parsedAttributes.top || 0;
        var rect = new fabric.Rect(extend(options ? fabric.util.object.clone(options) : {}, parsedAttributes));
        rect.visible = rect.width > 0 && rect.height > 0;
        return rect;
    };
    fabric.Rect.fromObject = function(object) {
        return new fabric.Rect(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Polyline) {
        fabric.warn("fabric.Polyline is already defined");
        return;
    }
    fabric.Polyline = fabric.util.createClass(fabric.Object, {
        type: "polyline",
        points: null,
        minX: 0,
        minY: 0,
        initialize: function(points, options) {
            return fabric.Polygon.prototype.initialize.call(this, points, options);
        },
        _calcDimensions: function() {
            return fabric.Polygon.prototype._calcDimensions.call(this);
        },
        _applyPointOffset: function() {
            return fabric.Polygon.prototype._applyPointOffset.call(this);
        },
        toObject: function(propertiesToInclude) {
            return fabric.Polygon.prototype.toObject.call(this, propertiesToInclude);
        },
        toSVG: function(reviver) {
            return fabric.Polygon.prototype.toSVG.call(this, reviver);
        },
        _render: function(ctx) {
            if (!fabric.Polygon.prototype.commonRender.call(this, ctx)) {
                return;
            }
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        _renderDashedStroke: function(ctx) {
            var p1, p2;
            ctx.beginPath();
            for (var i = 0, len = this.points.length; i < len; i++) {
                p1 = this.points[i];
                p2 = this.points[i + 1] || p1;
                fabric.util.drawDashedLine(ctx, p1.x, p1.y, p2.x, p2.y, this.strokeDashArray);
            }
        },
        complexity: function() {
            return this.get("points").length;
        }
    });
    fabric.Polyline.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat();
    fabric.Polyline.fromElement = function(element, options) {
        if (!element) {
            return null;
        }
        options || (options = {});
        var points = fabric.parsePointsAttribute(element.getAttribute("points")), parsedAttributes = fabric.parseAttributes(element, fabric.Polyline.ATTRIBUTE_NAMES);
        return new fabric.Polyline(points, fabric.util.object.extend(parsedAttributes, options));
    };
    fabric.Polyline.fromObject = function(object) {
        var points = object.points;
        return new fabric.Polyline(points, object, true);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, min = fabric.util.array.min, max = fabric.util.array.max, toFixed = fabric.util.toFixed;
    if (fabric.Polygon) {
        fabric.warn("fabric.Polygon is already defined");
        return;
    }
    fabric.Polygon = fabric.util.createClass(fabric.Object, {
        type: "polygon",
        points: null,
        minX: 0,
        minY: 0,
        initialize: function(points, options) {
            options = options || {};
            this.points = points || [];
            this.callSuper("initialize", options);
            this._calcDimensions();
            if (!("top" in options)) {
                this.top = this.minY;
            }
            if (!("left" in options)) {
                this.left = this.minX;
            }
        },
        _calcDimensions: function() {
            var points = this.points, minX = min(points, "x"), minY = min(points, "y"), maxX = max(points, "x"), maxY = max(points, "y");
            this.width = maxX - minX || 0;
            this.height = maxY - minY || 0;
            this.minX = minX || 0, this.minY = minY || 0;
        },
        _applyPointOffset: function() {
            this.points.forEach(function(p) {
                p.x -= this.minX + this.width / 2;
                p.y -= this.minY + this.height / 2;
            }, this);
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), {
                points: this.points.concat()
            });
        },
        toSVG: function(reviver) {
            var points = [], markup = this._createBaseSVGMarkup();
            for (var i = 0, len = this.points.length; i < len; i++) {
                points.push(toFixed(this.points[i].x, 2), ",", toFixed(this.points[i].y, 2), " ");
            }
            markup.push("<", this.type, " ", 'points="', points.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _render: function(ctx) {
            if (!this.commonRender(ctx)) {
                return;
            }
            this._renderFill(ctx);
            if (this.stroke || this.strokeDashArray) {
                ctx.closePath();
                this._renderStroke(ctx);
            }
        },
        commonRender: function(ctx) {
            var point, len = this.points.length;
            if (!len || isNaN(this.points[len - 1].y)) {
                return false;
            }
            ctx.beginPath();
            if (this._applyPointOffset) {
                if (!(this.group && this.group.type === "path-group")) {
                    this._applyPointOffset();
                }
                this._applyPointOffset = null;
            }
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 0; i < len; i++) {
                point = this.points[i];
                ctx.lineTo(point.x, point.y);
            }
            return true;
        },
        _renderDashedStroke: function(ctx) {
            fabric.Polyline.prototype._renderDashedStroke.call(this, ctx);
            ctx.closePath();
        },
        complexity: function() {
            return this.points.length;
        }
    });
    fabric.Polygon.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat();
    fabric.Polygon.fromElement = function(element, options) {
        if (!element) {
            return null;
        }
        options || (options = {});
        var points = fabric.parsePointsAttribute(element.getAttribute("points")), parsedAttributes = fabric.parseAttributes(element, fabric.Polygon.ATTRIBUTE_NAMES);
        return new fabric.Polygon(points, extend(parsedAttributes, options));
    };
    fabric.Polygon.fromObject = function(object) {
        return new fabric.Polygon(object.points, object, true);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), min = fabric.util.array.min, max = fabric.util.array.max, extend = fabric.util.object.extend, _toString = Object.prototype.toString, drawArc = fabric.util.drawArc, commandLengths = {
        m: 2,
        l: 2,
        h: 1,
        v: 1,
        c: 6,
        s: 4,
        q: 4,
        t: 2,
        a: 7
    }, repeatedCommands = {
        m: "l",
        M: "L"
    };
    if (fabric.Path) {
        fabric.warn("fabric.Path is already defined");
        return;
    }
    fabric.Path = fabric.util.createClass(fabric.Object, {
        type: "path",
        path: null,
        minX: 0,
        minY: 0,
        initialize: function(path, options) {
            options = options || {};
            this.setOptions(options);
            if (!path) {
                path = [];
            }
            var fromArray = _toString.call(path) === "[object Array]";
            this.path = fromArray ? path : path.match && path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
            if (!this.path) {
                return;
            }
            if (!fromArray) {
                this.path = this._parsePath();
            }
            this._setPositionDimensions(options);
            if (options.sourcePath) {
                this.setSourcePath(options.sourcePath);
            }
        },
        _setPositionDimensions: function(options) {
            var calcDim = this._parseDimensions();
            this.minX = calcDim.left;
            this.minY = calcDim.top;
            this.width = calcDim.width;
            this.height = calcDim.height;
            if (typeof options.left === "undefined") {
                this.left = calcDim.left + (this.originX === "center" ? this.width / 2 : this.originX === "right" ? this.width : 0);
            }
            if (typeof options.top === "undefined") {
                this.top = calcDim.top + (this.originY === "center" ? this.height / 2 : this.originY === "bottom" ? this.height : 0);
            }
            this.pathOffset = this.pathOffset || {
                x: this.minX + this.width / 2,
                y: this.minY + this.height / 2
            };
        },
        _render: function(ctx) {
            var current, previous = null, subpathStartX = 0, subpathStartY = 0, x = 0, y = 0, controlX = 0, controlY = 0, tempX, tempY, l = -this.pathOffset.x, t = -this.pathOffset.y;
            if (this.group && this.group.type === "path-group") {
                l = 0;
                t = 0;
            }
            ctx.beginPath();
            for (var i = 0, len = this.path.length; i < len; ++i) {
                current = this.path[i];
                switch (current[0]) {
                  case "l":
                    x += current[1];
                    y += current[2];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "L":
                    x = current[1];
                    y = current[2];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "h":
                    x += current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "H":
                    x = current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "v":
                    y += current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "V":
                    y = current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "m":
                    x += current[1];
                    y += current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    ctx.moveTo(x + l, y + t);
                    break;

                  case "M":
                    x = current[1];
                    y = current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    ctx.moveTo(x + l, y + t);
                    break;

                  case "c":
                    tempX = x + current[5];
                    tempY = y + current[6];
                    controlX = x + current[3];
                    controlY = y + current[4];
                    ctx.bezierCurveTo(x + current[1] + l, y + current[2] + t, controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "C":
                    x = current[5];
                    y = current[6];
                    controlX = current[3];
                    controlY = current[4];
                    ctx.bezierCurveTo(current[1] + l, current[2] + t, controlX + l, controlY + t, x + l, y + t);
                    break;

                  case "s":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.bezierCurveTo(controlX + l, controlY + t, x + current[1] + l, y + current[2] + t, tempX + l, tempY + t);
                    controlX = x + current[1];
                    controlY = y + current[2];
                    x = tempX;
                    y = tempY;
                    break;

                  case "S":
                    tempX = current[3];
                    tempY = current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.bezierCurveTo(controlX + l, controlY + t, current[1] + l, current[2] + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    controlX = current[1];
                    controlY = current[2];
                    break;

                  case "q":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    controlX = x + current[1];
                    controlY = y + current[2];
                    ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "Q":
                    tempX = current[3];
                    tempY = current[4];
                    ctx.quadraticCurveTo(current[1] + l, current[2] + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    controlX = current[1];
                    controlY = current[2];
                    break;

                  case "t":
                    tempX = x + current[1];
                    tempY = y + current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "T":
                    tempX = current[1];
                    tempY = current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "a":
                    drawArc(ctx, x + l, y + t, [ current[1], current[2], current[3], current[4], current[5], current[6] + x + l, current[7] + y + t ]);
                    x += current[6];
                    y += current[7];
                    break;

                  case "A":
                    drawArc(ctx, x + l, y + t, [ current[1], current[2], current[3], current[4], current[5], current[6] + l, current[7] + t ]);
                    x = current[6];
                    y = current[7];
                    break;

                  case "z":
                  case "Z":
                    x = subpathStartX;
                    y = subpathStartY;
                    ctx.closePath();
                    break;
                }
                previous = current;
            }
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        toString: function() {
            return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>";
        },
        toObject: function(propertiesToInclude) {
            var o = extend(this.callSuper("toObject", propertiesToInclude), {
                path: this.path.map(function(item) {
                    return item.slice();
                }),
                pathOffset: this.pathOffset
            });
            if (this.sourcePath) {
                o.sourcePath = this.sourcePath;
            }
            if (this.transformMatrix) {
                o.transformMatrix = this.transformMatrix;
            }
            return o;
        },
        toDatalessObject: function(propertiesToInclude) {
            var o = this.toObject(propertiesToInclude);
            if (this.sourcePath) {
                o.path = this.sourcePath;
            }
            delete o.sourcePath;
            return o;
        },
        toSVG: function(reviver) {
            var chunks = [], markup = this._createBaseSVGMarkup(), addTransform = "";
            for (var i = 0, len = this.path.length; i < len; i++) {
                chunks.push(this.path[i].join(" "));
            }
            var path = chunks.join(" ");
            if (!(this.group && this.group.type === "path-group")) {
                addTransform = " translate(" + -this.pathOffset.x + ", " + -this.pathOffset.y + ") ";
            }
            markup.push("<path ", 'd="', path, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), addTransform, this.getSvgTransformMatrix(), '" stroke-linecap="round" ', "/>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        complexity: function() {
            return this.path.length;
        },
        _parsePath: function() {
            var result = [], coords = [], currentPath, parsed, re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, match, coordsStr;
            for (var i = 0, coordsParsed, len = this.path.length; i < len; i++) {
                currentPath = this.path[i];
                coordsStr = currentPath.slice(1).trim();
                coords.length = 0;
                while (match = re.exec(coordsStr)) {
                    coords.push(match[0]);
                }
                coordsParsed = [ currentPath.charAt(0) ];
                for (var j = 0, jlen = coords.length; j < jlen; j++) {
                    parsed = parseFloat(coords[j]);
                    if (!isNaN(parsed)) {
                        coordsParsed.push(parsed);
                    }
                }
                var command = coordsParsed[0], commandLength = commandLengths[command.toLowerCase()], repeatedCommand = repeatedCommands[command] || command;
                if (coordsParsed.length - 1 > commandLength) {
                    for (var k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
                        result.push([ command ].concat(coordsParsed.slice(k, k + commandLength)));
                        command = repeatedCommand;
                    }
                } else {
                    result.push(coordsParsed);
                }
            }
            return result;
        },
        _parseDimensions: function() {
            var aX = [], aY = [], current, previous = null, subpathStartX = 0, subpathStartY = 0, x = 0, y = 0, controlX = 0, controlY = 0, tempX, tempY, bounds;
            for (var i = 0, len = this.path.length; i < len; ++i) {
                current = this.path[i];
                switch (current[0]) {
                  case "l":
                    x += current[1];
                    y += current[2];
                    bounds = [];
                    break;

                  case "L":
                    x = current[1];
                    y = current[2];
                    bounds = [];
                    break;

                  case "h":
                    x += current[1];
                    bounds = [];
                    break;

                  case "H":
                    x = current[1];
                    bounds = [];
                    break;

                  case "v":
                    y += current[1];
                    bounds = [];
                    break;

                  case "V":
                    y = current[1];
                    bounds = [];
                    break;

                  case "m":
                    x += current[1];
                    y += current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    bounds = [];
                    break;

                  case "M":
                    x = current[1];
                    y = current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    bounds = [];
                    break;

                  case "c":
                    tempX = x + current[5];
                    tempY = y + current[6];
                    controlX = x + current[3];
                    controlY = y + current[4];
                    bounds = fabric.util.getBoundsOfCurve(x, y, x + current[1], y + current[2], controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "C":
                    x = current[5];
                    y = current[6];
                    controlX = current[3];
                    controlY = current[4];
                    bounds = fabric.util.getBoundsOfCurve(x, y, current[1], current[2], controlX, controlY, x, y);
                    break;

                  case "s":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, x + current[1], y + current[2], tempX, tempY);
                    controlX = x + current[1];
                    controlY = y + current[2];
                    x = tempX;
                    y = tempY;
                    break;

                  case "S":
                    tempX = current[3];
                    tempY = current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, current[1], current[2], tempX, tempY);
                    x = tempX;
                    y = tempY;
                    controlX = current[1];
                    controlY = current[2];
                    break;

                  case "q":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    controlX = x + current[1];
                    controlY = y + current[2];
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "Q":
                    controlX = current[1];
                    controlY = current[2];
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, current[3], current[4]);
                    x = current[3];
                    y = current[4];
                    break;

                  case "t":
                    tempX = x + current[1];
                    tempY = y + current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "T":
                    tempX = current[1];
                    tempY = current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "a":
                    bounds = fabric.util.getBoundsOfArc(x, y, current[1], current[2], current[3], current[4], current[5], current[6] + x, current[7] + y);
                    x += current[6];
                    y += current[7];
                    break;

                  case "A":
                    bounds = fabric.util.getBoundsOfArc(x, y, current[1], current[2], current[3], current[4], current[5], current[6], current[7]);
                    x = current[6];
                    y = current[7];
                    break;

                  case "z":
                  case "Z":
                    x = subpathStartX;
                    y = subpathStartY;
                    break;
                }
                previous = current;
                bounds.forEach(function(point) {
                    aX.push(point.x);
                    aY.push(point.y);
                });
                aX.push(x);
                aY.push(y);
            }
            var minX = min(aX) || 0, minY = min(aY) || 0, maxX = max(aX) || 0, maxY = max(aY) || 0, deltaX = maxX - minX, deltaY = maxY - minY, o = {
                left: minX,
                top: minY,
                width: deltaX,
                height: deltaY
            };
            return o;
        }
    });
    fabric.Path.fromObject = function(object, callback) {
        if (typeof object.path === "string") {
            fabric.loadSVGFromURL(object.path, function(elements) {
                var path = elements[0], pathUrl = object.path;
                delete object.path;
                fabric.util.object.extend(path, object);
                path.setSourcePath(pathUrl);
                callback(path);
            });
        } else {
            callback(new fabric.Path(object.path, object));
        }
    };
    fabric.Path.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat([ "d" ]);
    fabric.Path.fromElement = function(element, callback, options) {
        var parsedAttributes = fabric.parseAttributes(element, fabric.Path.ATTRIBUTE_NAMES);
        callback && callback(new fabric.Path(parsedAttributes.d, extend(parsedAttributes, options)));
    };
    fabric.Path.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, invoke = fabric.util.array.invoke, parentToObject = fabric.Object.prototype.toObject;
    if (fabric.PathGroup) {
        fabric.warn("fabric.PathGroup is already defined");
        return;
    }
    fabric.PathGroup = fabric.util.createClass(fabric.Path, {
        type: "path-group",
        fill: "",
        initialize: function(paths, options) {
            options = options || {};
            this.paths = paths || [];
            for (var i = this.paths.length; i--; ) {
                this.paths[i].group = this;
            }
            if (options.toBeParsed) {
                this.parseDimensionsFromPaths(options);
                delete options.toBeParsed;
            }
            this.setOptions(options);
            this.setCoords();
            if (options.sourcePath) {
                this.setSourcePath(options.sourcePath);
            }
        },
        parseDimensionsFromPaths: function(options) {
            var points, p, xC = [], yC = [], path, height, width, m;
            for (var j = this.paths.length; j--; ) {
                path = this.paths[j];
                height = path.height + path.strokeWidth;
                width = path.width + path.strokeWidth;
                points = [ {
                    x: path.left,
                    y: path.top
                }, {
                    x: path.left + width,
                    y: path.top
                }, {
                    x: path.left,
                    y: path.top + height
                }, {
                    x: path.left + width,
                    y: path.top + height
                } ];
                m = this.paths[j].transformMatrix;
                for (var i = 0; i < points.length; i++) {
                    p = points[i];
                    if (m) {
                        p = fabric.util.transformPoint(p, m, false);
                    }
                    xC.push(p.x);
                    yC.push(p.y);
                }
            }
            options.width = Math.max.apply(null, xC);
            options.height = Math.max.apply(null, yC);
        },
        render: function(ctx) {
            if (!this.visible) {
                return;
            }
            ctx.save();
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            this.transform(ctx);
            this._setShadow(ctx);
            this.clipTo && fabric.util.clipContext(this, ctx);
            ctx.translate(-this.width / 2, -this.height / 2);
            for (var i = 0, l = this.paths.length; i < l; ++i) {
                this.paths[i].render(ctx, true);
            }
            this.clipTo && ctx.restore();
            ctx.restore();
        },
        _set: function(prop, value) {
            if (prop === "fill" && value && this.isSameColor()) {
                var i = this.paths.length;
                while (i--) {
                    this.paths[i]._set(prop, value);
                }
            }
            return this.callSuper("_set", prop, value);
        },
        toObject: function(propertiesToInclude) {
            var o = extend(parentToObject.call(this, propertiesToInclude), {
                paths: invoke(this.getObjects(), "toObject", propertiesToInclude)
            });
            if (this.sourcePath) {
                o.sourcePath = this.sourcePath;
            }
            return o;
        },
        toDatalessObject: function(propertiesToInclude) {
            var o = this.toObject(propertiesToInclude);
            if (this.sourcePath) {
                o.paths = this.sourcePath;
            }
            return o;
        },
        toSVG: function(reviver) {
            var objects = this.getObjects(), p = this.getPointByOrigin("left", "top"), translatePart = "translate(" + p.x + " " + p.y + ")", markup = [ "<g ", 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransformMatrix(), translatePart, this.getSvgTransform(), '" ', ">\n" ];
            for (var i = 0, len = objects.length; i < len; i++) {
                markup.push(objects[i].toSVG(reviver));
            }
            markup.push("</g>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        toString: function() {
            return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>";
        },
        isSameColor: function() {
            var firstPathFill = (this.getObjects()[0].get("fill") || "").toLowerCase();
            return this.getObjects().every(function(path) {
                return (path.get("fill") || "").toLowerCase() === firstPathFill;
            });
        },
        complexity: function() {
            return this.paths.reduce(function(total, path) {
                return total + (path && path.complexity ? path.complexity() : 0);
            }, 0);
        },
        getObjects: function() {
            return this.paths;
        }
    });
    fabric.PathGroup.fromObject = function(object, callback) {
        if (typeof object.paths === "string") {
            fabric.loadSVGFromURL(object.paths, function(elements) {
                var pathUrl = object.paths;
                delete object.paths;
                var pathGroup = fabric.util.groupSVGElements(elements, object, pathUrl);
                callback(pathGroup);
            });
        } else {
            fabric.util.enlivenObjects(object.paths, function(enlivenedObjects) {
                delete object.paths;
                callback(new fabric.PathGroup(enlivenedObjects, object));
            });
        }
    };
    fabric.PathGroup.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, min = fabric.util.array.min, max = fabric.util.array.max, invoke = fabric.util.array.invoke;
    if (fabric.Group) {
        return;
    }
    var _lockProperties = {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true
    };
    fabric.Group = fabric.util.createClass(fabric.Object, fabric.Collection, {
        type: "group",
        strokeWidth: 0,
        initialize: function(objects, options, isAlreadyGrouped) {
            options = options || {};
            this._objects = [];
            isAlreadyGrouped && this.callSuper("initialize", options);
            this._objects = objects || [];
            for (var i = this._objects.length; i--; ) {
                this._objects[i].group = this;
            }
            this.originalState = {};
            if (options.originX) {
                this.originX = options.originX;
            }
            if (options.originY) {
                this.originY = options.originY;
            }
            if (isAlreadyGrouped) {
                this._updateObjectsCoords(true);
            } else {
                this._calcBounds();
                this._updateObjectsCoords();
                this.callSuper("initialize", options);
            }
            this.setCoords();
            this.saveCoords();
        },
        _updateObjectsCoords: function(skipCoordsChange) {
            for (var i = this._objects.length; i--; ) {
                this._updateObjectCoords(this._objects[i], skipCoordsChange);
            }
        },
        _updateObjectCoords: function(object, skipCoordsChange) {
            object.__origHasControls = object.hasControls;
            object.hasControls = false;
            if (skipCoordsChange) {
                return;
            }
            var objectLeft = object.getLeft(), objectTop = object.getTop(), center = this.getCenterPoint();
            object.set({
                originalLeft: objectLeft,
                originalTop: objectTop,
                left: objectLeft - center.x,
                top: objectTop - center.y
            });
            object.setCoords();
        },
        toString: function() {
            return "#<fabric.Group: (" + this.complexity() + ")>";
        },
        addWithUpdate: function(object) {
            this._restoreObjectsState();
            if (object) {
                this._objects.push(object);
                object.group = this;
                object._set("canvas", this.canvas);
            }
            this.forEachObject(this._setObjectActive, this);
            this._calcBounds();
            this._updateObjectsCoords();
            return this;
        },
        _setObjectActive: function(object) {
            object.set("active", true);
            object.group = this;
        },
        removeWithUpdate: function(object) {
            this._moveFlippedObject(object);
            this._restoreObjectsState();
            this.forEachObject(this._setObjectActive, this);
            this.remove(object);
            this._calcBounds();
            this._updateObjectsCoords();
            return this;
        },
        _onObjectAdded: function(object) {
            object.group = this;
            object._set("canvas", this.canvas);
        },
        _onObjectRemoved: function(object) {
            delete object.group;
            object.set("active", false);
        },
        delegatedProperties: {
            fill: true,
            opacity: true,
            fontFamily: true,
            fontWeight: true,
            fontSize: true,
            fontStyle: true,
            lineHeight: true,
            textDecoration: true,
            textAlign: true,
            backgroundColor: true
        },
        _set: function(key, value) {
            var i = this._objects.length;
            if (this.delegatedProperties[key] || key === "canvas") {
                while (i--) {
                    this._objects[i].set(key, value);
                }
            } else {
                while (i--) {
                    this._objects[i].setOnGroup(key, value);
                }
            }
            this.callSuper("_set", key, value);
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), {
                objects: invoke(this._objects, "toObject", propertiesToInclude)
            });
        },
        render: function(ctx) {
            if (!this.visible) {
                return;
            }
            ctx.save();
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            this.transform(ctx);
            this.clipTo && fabric.util.clipContext(this, ctx);
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._renderObject(this._objects[i], ctx);
            }
            this.clipTo && ctx.restore();
            ctx.restore();
        },
        _renderControls: function(ctx, noTransform) {
            this.callSuper("_renderControls", ctx, noTransform);
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._objects[i]._renderControls(ctx);
            }
        },
        _renderObject: function(object, ctx) {
            if (!object.visible) {
                return;
            }
            var originalHasRotatingPoint = object.hasRotatingPoint;
            object.hasRotatingPoint = false;
            object.render(ctx);
            object.hasRotatingPoint = originalHasRotatingPoint;
        },
        _restoreObjectsState: function() {
            this._objects.forEach(this._restoreObjectState, this);
            return this;
        },
        realizeTransform: function(object) {
            this._moveFlippedObject(object);
            this._setObjectPosition(object);
            return object;
        },
        _moveFlippedObject: function(object) {
            var oldOriginX = object.get("originX"), oldOriginY = object.get("originY"), center = object.getCenterPoint();
            object.set({
                originX: "center",
                originY: "center",
                left: center.x,
                top: center.y
            });
            this._toggleFlipping(object);
            var newOrigin = object.getPointByOrigin(oldOriginX, oldOriginY);
            object.set({
                originX: oldOriginX,
                originY: oldOriginY,
                left: newOrigin.x,
                top: newOrigin.y
            });
            return this;
        },
        _toggleFlipping: function(object) {
            if (this.flipX) {
                object.toggle("flipX");
                object.set("left", -object.get("left"));
                object.setAngle(-object.getAngle());
            }
            if (this.flipY) {
                object.toggle("flipY");
                object.set("top", -object.get("top"));
                object.setAngle(-object.getAngle());
            }
        },
        _restoreObjectState: function(object) {
            this._setObjectPosition(object);
            object.setCoords();
            object.hasControls = object.__origHasControls;
            delete object.__origHasControls;
            object.set("active", false);
            object.setCoords();
            delete object.group;
            return this;
        },
        _setObjectPosition: function(object) {
            var center = this.getCenterPoint(), rotated = this._getRotatedLeftTop(object);
            object.set({
                angle: object.getAngle() + this.getAngle(),
                left: center.x + rotated.left,
                top: center.y + rotated.top,
                scaleX: object.get("scaleX") * this.get("scaleX"),
                scaleY: object.get("scaleY") * this.get("scaleY")
            });
        },
        _getRotatedLeftTop: function(object) {
            var groupAngle = this.getAngle() * (Math.PI / 180);
            return {
                left: -Math.sin(groupAngle) * object.getTop() * this.get("scaleY") + Math.cos(groupAngle) * object.getLeft() * this.get("scaleX"),
                top: Math.cos(groupAngle) * object.getTop() * this.get("scaleY") + Math.sin(groupAngle) * object.getLeft() * this.get("scaleX")
            };
        },
        destroy: function() {
            this._objects.forEach(this._moveFlippedObject, this);
            return this._restoreObjectsState();
        },
        saveCoords: function() {
            this._originalLeft = this.get("left");
            this._originalTop = this.get("top");
            return this;
        },
        hasMoved: function() {
            return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top");
        },
        setObjectsCoords: function() {
            this.forEachObject(function(object) {
                object.setCoords();
            });
            return this;
        },
        _calcBounds: function(onlyWidthHeight) {
            var aX = [], aY = [], o, prop, props = [ "tr", "br", "bl", "tl" ], i = 0, iLen = this._objects.length, j, jLen = props.length;
            for (;i < iLen; ++i) {
                o = this._objects[i];
                o.setCoords();
                for (j = 0; j < jLen; j++) {
                    prop = props[j];
                    aX.push(o.oCoords[prop].x);
                    aY.push(o.oCoords[prop].y);
                }
            }
            this.set(this._getBounds(aX, aY, onlyWidthHeight));
        },
        _getBounds: function(aX, aY, onlyWidthHeight) {
            var ivt = fabric.util.invertTransform(this.getViewportTransform()), minXY = fabric.util.transformPoint(new fabric.Point(min(aX), min(aY)), ivt), maxXY = fabric.util.transformPoint(new fabric.Point(max(aX), max(aY)), ivt), obj = {
                width: maxXY.x - minXY.x || 0,
                height: maxXY.y - minXY.y || 0
            };
            if (!onlyWidthHeight) {
                obj.left = minXY.x || 0;
                obj.top = minXY.y || 0;
                if (this.originX === "center") {
                    obj.left += obj.width / 2;
                }
                if (this.originX === "right") {
                    obj.left += obj.width;
                }
                if (this.originY === "center") {
                    obj.top += obj.height / 2;
                }
                if (this.originY === "bottom") {
                    obj.top += obj.height;
                }
            }
            return obj;
        },
        toSVG: function(reviver) {
            var markup = [ "<g ", 'transform="', this.getSvgTransform(), '">\n' ];
            for (var i = 0, len = this._objects.length; i < len; i++) {
                markup.push(this._objects[i].toSVG(reviver));
            }
            markup.push("</g>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        get: function(prop) {
            if (prop in _lockProperties) {
                if (this[prop]) {
                    return this[prop];
                } else {
                    for (var i = 0, len = this._objects.length; i < len; i++) {
                        if (this._objects[i][prop]) {
                            return true;
                        }
                    }
                    return false;
                }
            } else {
                if (prop in this.delegatedProperties) {
                    return this._objects[0] && this._objects[0].get(prop);
                }
                return this[prop];
            }
        }
    });
    fabric.Group.fromObject = function(object, callback) {
        fabric.util.enlivenObjects(object.objects, function(enlivenedObjects) {
            delete object.objects;
            callback && callback(new fabric.Group(enlivenedObjects, object, true));
        });
    };
    fabric.Group.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var extend = fabric.util.object.extend;
    if (!global.fabric) {
        global.fabric = {};
    }
    if (global.fabric.Image) {
        fabric.warn("fabric.Image is already defined.");
        return;
    }
    fabric.Image = fabric.util.createClass(fabric.Object, {
        type: "image",
        crossOrigin: "",
        alignX: "none",
        alignY: "none",
        meetOrSlice: "meet",
        _lastScaleX: 1,
        _lastScaleY: 1,
        initialize: function(element, options) {
            options || (options = {});
            this.filters = [];
            this.resizeFilters = [];
            this.callSuper("initialize", options);
            this._initElement(element, options);
        },
        getElement: function() {
            return this._element;
        },
        setElement: function(element, callback, options) {
            this._element = element;
            this._originalElement = element;
            this._initConfig(options);
            if (this.filters.length !== 0) {
                this.applyFilters(callback);
            } else if (callback) {
                callback();
            }
            return this;
        },
        setCrossOrigin: function(value) {
            this.crossOrigin = value;
            this._element.crossOrigin = value;
            return this;
        },
        getOriginalSize: function() {
            var element = this.getElement();
            return {
                width: element.width,
                height: element.height
            };
        },
        _stroke: function(ctx) {
            ctx.save();
            this._setStrokeStyles(ctx);
            ctx.beginPath();
            ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.closePath();
            ctx.restore();
        },
        _renderDashedStroke: function(ctx) {
            var x = -this.width / 2, y = -this.height / 2, w = this.width, h = this.height;
            ctx.save();
            this._setStrokeStyles(ctx);
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
            ctx.closePath();
            ctx.restore();
        },
        toObject: function(propertiesToInclude) {
            var filters = [];
            this.filters.forEach(function(filterObj) {
                if (filterObj) {
                    filters.push(filterObj.toObject());
                }
            });
            var object = extend(this.callSuper("toObject", propertiesToInclude), {
                src: this._originalElement.src || this._originalElement._src,
                filters: filters,
                crossOrigin: this.crossOrigin,
                alignX: this.alignX,
                alignY: this.alignY,
                meetOrSlice: this.meetOrSlice
            });
            if (this.resizeFilters.length > 0) {
                object.resizeFilters = this.resizeFilters.map(function(filterObj) {
                    return filterObj && filterObj.toObject();
                });
            }
            if (!this.includeDefaultValues) {
                this._removeDefaultValues(object);
            }
            return object;
        },
        toSVG: function(reviver) {
            var markup = [], x = -this.width / 2, y = -this.height / 2, preserveAspectRatio = "none";
            if (this.group && this.group.type === "path-group") {
                x = this.left;
                y = this.top;
            }
            if (this.alignX !== "none" && this.alignY !== "none") {
                preserveAspectRatio = "x" + this.alignX + "Y" + this.alignY + " " + this.meetOrSlice;
            }
            markup.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', '<image xlink:href="', this.getSvgSrc(), '" x="', x, '" y="', y, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '" preserveAspectRatio="', preserveAspectRatio, '"', "></image>\n");
            if (this.stroke || this.strokeDashArray) {
                var origFill = this.fill;
                this.fill = null;
                markup.push("<rect ", 'x="', x, '" y="', y, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n');
                this.fill = origFill;
            }
            markup.push("</g>\n");
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        getSrc: function() {
            if (this.getElement()) {
                return this.getElement().src || this.getElement()._src;
            }
        },
        setSrc: function(src, callback, options) {
            fabric.util.loadImage(src, function(img) {
                return this.setElement(img, callback, options);
            }, this, options && options.crossOrigin);
        },
        toString: function() {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
        },
        clone: function(callback, propertiesToInclude) {
            this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
        },
        applyFilters: function(callback, filters, imgElement, forResizing) {
            filters = filters || this.filters;
            imgElement = imgElement || this._originalElement;
            if (!imgElement) {
                return;
            }
            var imgEl = imgElement, canvasEl = fabric.util.createCanvasElement(), replacement = fabric.util.createImage(), _this = this;
            canvasEl.width = imgEl.width;
            canvasEl.height = imgEl.height;
            canvasEl.getContext("2d").drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);
            if (filters.length === 0) {
                this._element = imgElement;
                callback && callback();
                return canvasEl;
            }
            filters.forEach(function(filter) {
                filter && filter.applyTo(canvasEl, filter.scaleX || _this.scaleX, filter.scaleY || _this.scaleY);
                if (!forResizing && filter && filter.type === "Resize") {
                    _this.width *= filter.scaleX;
                    _this.height *= filter.scaleY;
                }
            });
            replacement.width = canvasEl.width;
            replacement.height = canvasEl.height;
            if (fabric.isLikelyNode) {
                replacement.src = canvasEl.toBuffer(undefined, fabric.Image.pngCompression);
                _this._element = replacement;
                !forResizing && (_this._filteredEl = replacement);
                callback && callback();
            } else {
                replacement.onload = function() {
                    _this._element = replacement;
                    !forResizing && (_this._filteredEl = replacement);
                    callback && callback();
                    replacement.onload = canvasEl = imgEl = null;
                };
                replacement.src = canvasEl.toDataURL("image/png");
            }
            return canvasEl;
        },
        _render: function(ctx, noTransform) {
            var x, y, imageMargins = this._findMargins(), elementToDraw;
            x = noTransform ? this.left : -this.width / 2;
            y = noTransform ? this.top : -this.height / 2;
            if (this.meetOrSlice === "slice") {
                ctx.beginPath();
                ctx.rect(x, y, this.width, this.height);
                ctx.clip();
            }
            if (this.isMoving === false && this.resizeFilters.length && this._needsResize()) {
                this._lastScaleX = this.scaleX;
                this._lastScaleY = this.scaleY;
                elementToDraw = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, true);
            } else {
                elementToDraw = this._element;
            }
            elementToDraw && ctx.drawImage(elementToDraw, x + imageMargins.marginX, y + imageMargins.marginY, imageMargins.width, imageMargins.height);
            this._renderStroke(ctx);
        },
        _needsResize: function() {
            return this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY;
        },
        _findMargins: function() {
            var width = this.width, height = this.height, scales, scale, marginX = 0, marginY = 0;
            if (this.alignX !== "none" || this.alignY !== "none") {
                scales = [ this.width / this._element.width, this.height / this._element.height ];
                scale = this.meetOrSlice === "meet" ? Math.min.apply(null, scales) : Math.max.apply(null, scales);
                width = this._element.width * scale;
                height = this._element.height * scale;
                if (this.alignX === "Mid") {
                    marginX = (this.width - width) / 2;
                }
                if (this.alignX === "Max") {
                    marginX = this.width - width;
                }
                if (this.alignY === "Mid") {
                    marginY = (this.height - height) / 2;
                }
                if (this.alignY === "Max") {
                    marginY = this.height - height;
                }
            }
            return {
                width: width,
                height: height,
                marginX: marginX,
                marginY: marginY
            };
        },
        _resetWidthHeight: function() {
            var element = this.getElement();
            this.set("width", element.width);
            this.set("height", element.height);
        },
        _initElement: function(element, options) {
            this.setElement(fabric.util.getById(element), null, options);
            fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
        },
        _initConfig: function(options) {
            options || (options = {});
            this.setOptions(options);
            this._setWidthHeight(options);
            if (this._element && this.crossOrigin) {
                this._element.crossOrigin = this.crossOrigin;
            }
        },
        _initFilters: function(filters, callback) {
            if (filters && filters.length) {
                fabric.util.enlivenObjects(filters, function(enlivenedObjects) {
                    callback && callback(enlivenedObjects);
                }, "fabric.Image.filters");
            } else {
                callback && callback();
            }
        },
        _setWidthHeight: function(options) {
            this.width = "width" in options ? options.width : this.getElement() ? this.getElement().width || 0 : 0;
            this.height = "height" in options ? options.height : this.getElement() ? this.getElement().height || 0 : 0;
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Image.CSS_CANVAS = "canvas-img";
    fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc;
    fabric.Image.fromObject = function(object, callback) {
        fabric.util.loadImage(object.src, function(img) {
            fabric.Image.prototype._initFilters.call(object, object.filters, function(filters) {
                object.filters = filters || [];
                fabric.Image.prototype._initFilters.call(object, object.resizeFilters, function(resizeFilters) {
                    object.resizeFilters = resizeFilters || [];
                    var instance = new fabric.Image(img, object);
                    callback && callback(instance);
                });
            });
        }, null, object.crossOrigin);
    };
    fabric.Image.fromURL = function(url, callback, imgOptions) {
        fabric.util.loadImage(url, function(img) {
            callback && callback(new fabric.Image(img, imgOptions));
        }, null, imgOptions && imgOptions.crossOrigin);
    };
    fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href".split(" "));
    fabric.Image.fromElement = function(element, callback, options) {
        var parsedAttributes = fabric.parseAttributes(element, fabric.Image.ATTRIBUTE_NAMES), align = "xMidYMid", meetOrSlice = "meet", alignX, alignY, aspectRatioAttrs;
        if (parsedAttributes.preserveAspectRatio) {
            aspectRatioAttrs = parsedAttributes.preserveAspectRatio.split(" ");
        }
        if (aspectRatioAttrs && aspectRatioAttrs.length) {
            meetOrSlice = aspectRatioAttrs.pop();
            if (meetOrSlice !== "meet" && meetOrSlice !== "slice") {
                align = meetOrSlice;
                meetOrSlice = "meet";
            } else if (aspectRatioAttrs.length) {
                align = aspectRatioAttrs.pop();
            }
        }
        alignX = align !== "none" ? align.slice(1, 4) : "none";
        alignY = align !== "none" ? align.slice(5, 8) : "none";
        parsedAttributes.alignX = alignX;
        parsedAttributes.alignY = alignY;
        parsedAttributes.meetOrSlice = meetOrSlice;
        fabric.Image.fromURL(parsedAttributes["xlink:href"], callback, extend(options ? fabric.util.object.clone(options) : {}, parsedAttributes));
    };
    fabric.Image.async = true;
    fabric.Image.pngCompression = 1;
})(typeof exports !== "undefined" ? exports : this);

fabric.util.object.extend(fabric.Object.prototype, {
    _getAngleValueForStraighten: function() {
        var angle = this.getAngle() % 360;
        if (angle > 0) {
            return Math.round((angle - 1) / 90) * 90;
        }
        return Math.round(angle / 90) * 90;
    },
    straighten: function() {
        this.setAngle(this._getAngleValueForStraighten());
        return this;
    },
    fxStraighten: function(callbacks) {
        callbacks = callbacks || {};
        var empty = function() {}, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
        fabric.util.animate({
            startValue: this.get("angle"),
            endValue: this._getAngleValueForStraighten(),
            duration: this.FX_DURATION,
            onChange: function(value) {
                _this.setAngle(value);
                onChange();
            },
            onComplete: function() {
                _this.setCoords();
                onComplete();
            },
            onStart: function() {
                _this.set("active", false);
            }
        });
        return this;
    }
});

fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    straightenObject: function(object) {
        object.straighten();
        this.renderAll();
        return this;
    },
    fxStraightenObject: function(object) {
        object.fxStraighten({
            onChange: this.renderAll.bind(this)
        });
        return this;
    }
});

fabric.Image.filters = fabric.Image.filters || {};

fabric.Image.filters.BaseFilter = fabric.util.createClass({
    type: "BaseFilter",
    initialize: function(options) {
        if (options) {
            this.setOptions(options);
        }
    },
    setOptions: function(options) {
        for (var prop in options) {
            this[prop] = options[prop];
        }
    },
    toObject: function() {
        return {
            type: this.type
        };
    },
    toJSON: function() {
        return this.toObject();
    }
});

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    fabric.Image.filters.Brightness = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Brightness",
        initialize: function(options) {
            options = options || {};
            this.brightness = options.brightness || 0;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, brightness = this.brightness;
            for (var i = 0, len = data.length; i < len; i += 4) {
                data[i] += brightness;
                data[i + 1] += brightness;
                data[i + 2] += brightness;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                brightness: this.brightness
            });
        }
    });
    fabric.Image.filters.Brightness.fromObject = function(object) {
        return new fabric.Image.filters.Brightness(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    fabric.Image.filters.Convolute = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Convolute",
        initialize: function(options) {
            options = options || {};
            this.opaque = options.opaque;
            this.matrix = options.matrix || [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ];
            var canvasEl = fabric.util.createCanvasElement();
            this.tmpCtx = canvasEl.getContext("2d");
        },
        _createImageData: function(w, h) {
            return this.tmpCtx.createImageData(w, h);
        },
        applyTo: function(canvasEl) {
            var weights = this.matrix, context = canvasEl.getContext("2d"), pixels = context.getImageData(0, 0, canvasEl.width, canvasEl.height), side = Math.round(Math.sqrt(weights.length)), halfSide = Math.floor(side / 2), src = pixels.data, sw = pixels.width, sh = pixels.height, w = sw, h = sh, output = this._createImageData(w, h), dst = output.data, alphaFac = this.opaque ? 1 : 0;
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var sy = y, sx = x, dstOff = (y * w + x) * 4, r = 0, g = 0, b = 0, a = 0;
                    for (var cy = 0; cy < side; cy++) {
                        for (var cx = 0; cx < side; cx++) {
                            var scy = sy + cy - halfSide, scx = sx + cx - halfSide;
                            if (scy < 0 || scy > sh || scx < 0 || scx > sw) {
                                continue;
                            }
                            var srcOff = (scy * sw + scx) * 4, wt = weights[cy * side + cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a += src[srcOff + 3] * wt;
                        }
                    }
                    dst[dstOff] = r;
                    dst[dstOff + 1] = g;
                    dst[dstOff + 2] = b;
                    dst[dstOff + 3] = a + alphaFac * (255 - a);
                }
            }
            context.putImageData(output, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                opaque: this.opaque,
                matrix: this.matrix
            });
        }
    });
    fabric.Image.filters.Convolute.fromObject = function(object) {
        return new fabric.Image.filters.Convolute(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    fabric.Image.filters.GradientTransparency = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "GradientTransparency",
        initialize: function(options) {
            options = options || {};
            this.threshold = options.threshold || 100;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, threshold = this.threshold, total = data.length;
            for (var i = 0, len = data.length; i < len; i += 4) {
                data[i + 3] = threshold + 255 * (total - i) / total;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                threshold: this.threshold
            });
        }
    });
    fabric.Image.filters.GradientTransparency.fromObject = function(object) {
        return new fabric.Image.filters.GradientTransparency(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    fabric.Image.filters.Grayscale = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Grayscale",
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, len = imageData.width * imageData.height * 4, index = 0, average;
            while (index < len) {
                average = (data[index] + data[index + 1] + data[index + 2]) / 3;
                data[index] = average;
                data[index + 1] = average;
                data[index + 2] = average;
                index += 4;
            }
            context.putImageData(imageData, 0, 0);
        }
    });
    fabric.Image.filters.Grayscale.fromObject = function() {
        return new fabric.Image.filters.Grayscale();
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    fabric.Image.filters.Invert = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Invert",
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i;
            for (i = 0; i < iLen; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            context.putImageData(imageData, 0, 0);
        }
    });
    fabric.Image.filters.Invert.fromObject = function() {
        return new fabric.Image.filters.Invert();
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    fabric.Image.filters.Mask = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Mask",
        initialize: function(options) {
            options = options || {};
            this.mask = options.mask;
            this.channel = [ 0, 1, 2, 3 ].indexOf(options.channel) > -1 ? options.channel : 0;
        },
        applyTo: function(canvasEl) {
            if (!this.mask) {
                return;
            }
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, maskEl = this.mask.getElement(), maskCanvasEl = fabric.util.createCanvasElement(), channel = this.channel, i, iLen = imageData.width * imageData.height * 4;
            maskCanvasEl.width = maskEl.width;
            maskCanvasEl.height = maskEl.height;
            maskCanvasEl.getContext("2d").drawImage(maskEl, 0, 0, maskEl.width, maskEl.height);
            var maskImageData = maskCanvasEl.getContext("2d").getImageData(0, 0, maskEl.width, maskEl.height), maskData = maskImageData.data;
            for (i = 0; i < iLen; i += 4) {
                data[i + 3] = maskData[i + channel];
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                mask: this.mask.toObject(),
                channel: this.channel
            });
        }
    });
    fabric.Image.filters.Mask.fromObject = function(object, callback) {
        fabric.util.loadImage(object.mask.src, function(img) {
            object.mask = new fabric.Image(img, object.mask);
            callback && callback(new fabric.Image.filters.Mask(object));
        });
    };
    fabric.Image.filters.Mask.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    fabric.Image.filters.Noise = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Noise",
        initialize: function(options) {
            options = options || {};
            this.noise = options.noise || 0;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, noise = this.noise, rand;
            for (var i = 0, len = data.length; i < len; i += 4) {
                rand = (.5 - Math.random()) * noise;
                data[i] += rand;
                data[i + 1] += rand;
                data[i + 2] += rand;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                noise: this.noise
            });
        }
    });
    fabric.Image.filters.Noise.fromObject = function(object) {
        return new fabric.Image.filters.Noise(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    fabric.Image.filters.Pixelate = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Pixelate",
        initialize: function(options) {
            options = options || {};
            this.blocksize = options.blocksize || 4;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = imageData.height, jLen = imageData.width, index, i, j, r, g, b, a;
            for (i = 0; i < iLen; i += this.blocksize) {
                for (j = 0; j < jLen; j += this.blocksize) {
                    index = i * 4 * jLen + j * 4;
                    r = data[index];
                    g = data[index + 1];
                    b = data[index + 2];
                    a = data[index + 3];
                    for (var _i = i, _ilen = i + this.blocksize; _i < _ilen; _i++) {
                        for (var _j = j, _jlen = j + this.blocksize; _j < _jlen; _j++) {
                            index = _i * 4 * jLen + _j * 4;
                            data[index] = r;
                            data[index + 1] = g;
                            data[index + 2] = b;
                            data[index + 3] = a;
                        }
                    }
                }
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                blocksize: this.blocksize
            });
        }
    });
    fabric.Image.filters.Pixelate.fromObject = function(object) {
        return new fabric.Image.filters.Pixelate(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    fabric.Image.filters.RemoveWhite = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "RemoveWhite",
        initialize: function(options) {
            options = options || {};
            this.threshold = options.threshold || 30;
            this.distance = options.distance || 20;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, threshold = this.threshold, distance = this.distance, limit = 255 - threshold, abs = Math.abs, r, g, b;
            for (var i = 0, len = data.length; i < len; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                if (r > limit && g > limit && b > limit && abs(r - g) < distance && abs(r - b) < distance && abs(g - b) < distance) {
                    data[i + 3] = 1;
                }
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                threshold: this.threshold,
                distance: this.distance
            });
        }
    });
    fabric.Image.filters.RemoveWhite.fromObject = function(object) {
        return new fabric.Image.filters.RemoveWhite(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    fabric.Image.filters.Sepia = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Sepia",
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, avg;
            for (i = 0; i < iLen; i += 4) {
                avg = .3 * data[i] + .59 * data[i + 1] + .11 * data[i + 2];
                data[i] = avg + 100;
                data[i + 1] = avg + 50;
                data[i + 2] = avg + 255;
            }
            context.putImageData(imageData, 0, 0);
        }
    });
    fabric.Image.filters.Sepia.fromObject = function() {
        return new fabric.Image.filters.Sepia();
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    fabric.Image.filters.Sepia2 = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Sepia2",
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, r, g, b;
            for (i = 0; i < iLen; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                data[i] = (r * .393 + g * .769 + b * .189) / 1.351;
                data[i + 1] = (r * .349 + g * .686 + b * .168) / 1.203;
                data[i + 2] = (r * .272 + g * .534 + b * .131) / 2.14;
            }
            context.putImageData(imageData, 0, 0);
        }
    });
    fabric.Image.filters.Sepia2.fromObject = function() {
        return new fabric.Image.filters.Sepia2();
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    fabric.Image.filters.Tint = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Tint",
        initialize: function(options) {
            options = options || {};
            this.color = options.color || "#000000";
            this.opacity = typeof options.opacity !== "undefined" ? options.opacity : new fabric.Color(this.color).getAlpha();
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, tintR, tintG, tintB, r, g, b, alpha1, source;
            source = new fabric.Color(this.color).getSource();
            tintR = source[0] * this.opacity;
            tintG = source[1] * this.opacity;
            tintB = source[2] * this.opacity;
            alpha1 = 1 - this.opacity;
            for (i = 0; i < iLen; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                data[i] = tintR + r * alpha1;
                data[i + 1] = tintG + g * alpha1;
                data[i + 2] = tintB + b * alpha1;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                color: this.color,
                opacity: this.opacity
            });
        }
    });
    fabric.Image.filters.Tint.fromObject = function(object) {
        return new fabric.Image.filters.Tint(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    fabric.Image.filters.Multiply = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Multiply",
        initialize: function(options) {
            options = options || {};
            this.color = options.color || "#000000";
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, iLen = data.length, i, source;
            source = new fabric.Color(this.color).getSource();
            for (i = 0; i < iLen; i += 4) {
                data[i] *= source[0] / 255;
                data[i + 1] *= source[1] / 255;
                data[i + 2] *= source[2] / 255;
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                color: this.color
            });
        }
    });
    fabric.Image.filters.Multiply.fromObject = function(object) {
        return new fabric.Image.filters.Multiply(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric;
    fabric.Image.filters.Blend = fabric.util.createClass({
        type: "Blend",
        initialize: function(options) {
            options = options || {};
            this.color = options.color || "#000";
            this.image = options.image || false;
            this.mode = options.mode || "multiply";
            this.alpha = options.alpha || 1;
        },
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext("2d"), imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height), data = imageData.data, tr, tg, tb, r, g, b, _r, _g, _b, source, isImage = false;
            if (this.image) {
                isImage = true;
                var _el = fabric.util.createCanvasElement();
                _el.width = this.image.width;
                _el.height = this.image.height;
                var tmpCanvas = new fabric.StaticCanvas(_el);
                tmpCanvas.add(this.image);
                var context2 = tmpCanvas.getContext("2d");
                source = context2.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height).data;
            } else {
                source = new fabric.Color(this.color).getSource();
                tr = source[0] * this.alpha;
                tg = source[1] * this.alpha;
                tb = source[2] * this.alpha;
            }
            for (var i = 0, len = data.length; i < len; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                if (isImage) {
                    tr = source[i] * this.alpha;
                    tg = source[i + 1] * this.alpha;
                    tb = source[i + 2] * this.alpha;
                }
                switch (this.mode) {
                  case "multiply":
                    data[i] = r * tr / 255;
                    data[i + 1] = g * tg / 255;
                    data[i + 2] = b * tb / 255;
                    break;

                  case "screen":
                    data[i] = 1 - (1 - r) * (1 - tr);
                    data[i + 1] = 1 - (1 - g) * (1 - tg);
                    data[i + 2] = 1 - (1 - b) * (1 - tb);
                    break;

                  case "add":
                    data[i] = Math.min(255, r + tr);
                    data[i + 1] = Math.min(255, g + tg);
                    data[i + 2] = Math.min(255, b + tb);
                    break;

                  case "diff":
                  case "difference":
                    data[i] = Math.abs(r - tr);
                    data[i + 1] = Math.abs(g - tg);
                    data[i + 2] = Math.abs(b - tb);
                    break;

                  case "subtract":
                    _r = r - tr;
                    _g = g - tg;
                    _b = b - tb;
                    data[i] = _r < 0 ? 0 : _r;
                    data[i + 1] = _g < 0 ? 0 : _g;
                    data[i + 2] = _b < 0 ? 0 : _b;
                    break;

                  case "darken":
                    data[i] = Math.min(r, tr);
                    data[i + 1] = Math.min(g, tg);
                    data[i + 2] = Math.min(b, tb);
                    break;

                  case "lighten":
                    data[i] = Math.max(r, tr);
                    data[i + 1] = Math.max(g, tg);
                    data[i + 2] = Math.max(b, tb);
                    break;
                }
            }
            context.putImageData(imageData, 0, 0);
        },
        toObject: function() {
            return {
                color: this.color,
                image: this.image,
                mode: this.mode,
                alpha: this.alpha
            };
        }
    });
    fabric.Image.filters.Blend.fromObject = function(object) {
        return new fabric.Image.filters.Blend(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), pow = Math.pow, floor = Math.floor, sqrt = Math.sqrt, abs = Math.abs, max = Math.max, round = Math.round, sin = Math.sin, ceil = Math.ceil;
    fabric.Image.filters.Resize = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
        type: "Resize",
        resizeType: "hermite",
        scaleX: 0,
        scaleY: 0,
        lanczosLobes: 3,
        applyTo: function(canvasEl, scaleX, scaleY) {
            this.rcpScaleX = 1 / scaleX;
            this.rcpScaleY = 1 / scaleY;
            var oW = canvasEl.width, oH = canvasEl.height, dW = round(oW * scaleX), dH = round(oH * scaleY), imageData;
            if (this.resizeType === "sliceHack") {
                imageData = this.sliceByTwo(canvasEl, oW, oH, dW, dH);
            }
            if (this.resizeType === "hermite") {
                imageData = this.hermiteFastResize(canvasEl, oW, oH, dW, dH);
            }
            if (this.resizeType === "bilinear") {
                imageData = this.bilinearFiltering(canvasEl, oW, oH, dW, dH);
            }
            if (this.resizeType === "lanczos") {
                imageData = this.lanczosResize(canvasEl, oW, oH, dW, dH);
            }
            canvasEl.width = dW;
            canvasEl.height = dH;
            canvasEl.getContext("2d").putImageData(imageData, 0, 0);
        },
        sliceByTwo: function(canvasEl, width, height, newWidth, newHeight) {
            var context = canvasEl.getContext("2d"), imageData, multW = .5, multH = .5, signW = 1, signH = 1, doneW = false, doneH = false, stepW = width, stepH = height, tmpCanvas = fabric.util.createCanvasElement(), tmpCtx = tmpCanvas.getContext("2d");
            newWidth = floor(newWidth);
            newHeight = floor(newHeight);
            tmpCanvas.width = max(newWidth, width);
            tmpCanvas.height = max(newHeight, height);
            if (newWidth > width) {
                multW = 2;
                signW = -1;
            }
            if (newHeight > height) {
                multH = 2;
                signH = -1;
            }
            imageData = context.getImageData(0, 0, width, height);
            canvasEl.width = max(newWidth, width);
            canvasEl.height = max(newHeight, height);
            context.putImageData(imageData, 0, 0);
            while (!doneW || !doneH) {
                width = stepW;
                height = stepH;
                if (newWidth * signW < floor(stepW * multW * signW)) {
                    stepW = floor(stepW * multW);
                } else {
                    stepW = newWidth;
                    doneW = true;
                }
                if (newHeight * signH < floor(stepH * multH * signH)) {
                    stepH = floor(stepH * multH);
                } else {
                    stepH = newHeight;
                    doneH = true;
                }
                imageData = context.getImageData(0, 0, width, height);
                tmpCtx.putImageData(imageData, 0, 0);
                context.clearRect(0, 0, stepW, stepH);
                context.drawImage(tmpCanvas, 0, 0, width, height, 0, 0, stepW, stepH);
            }
            return context.getImageData(0, 0, newWidth, newHeight);
        },
        lanczosResize: function(canvasEl, oW, oH, dW, dH) {
            function lanczosCreate(lobes) {
                return function(x) {
                    if (x > lobes) {
                        return 0;
                    }
                    x *= Math.PI;
                    if (abs(x) < 1e-16) {
                        return 1;
                    }
                    var xx = x / lobes;
                    return sin(x) * sin(xx) / x / xx;
                };
            }
            function process(u) {
                var v, i, weight, idx, a, red, green, blue, alpha, fX, fY;
                center.x = (u + .5) * ratioX;
                icenter.x = floor(center.x);
                for (v = 0; v < dH; v++) {
                    center.y = (v + .5) * ratioY;
                    icenter.y = floor(center.y);
                    a = 0, red = 0, green = 0, blue = 0, alpha = 0;
                    for (i = icenter.x - range2X; i <= icenter.x + range2X; i++) {
                        if (i < 0 || i >= oW) {
                            continue;
                        }
                        fX = floor(1e3 * abs(i - center.x));
                        if (!cacheLanc[fX]) {
                            cacheLanc[fX] = {};
                        }
                        for (var j = icenter.y - range2Y; j <= icenter.y + range2Y; j++) {
                            if (j < 0 || j >= oH) {
                                continue;
                            }
                            fY = floor(1e3 * abs(j - center.y));
                            if (!cacheLanc[fX][fY]) {
                                cacheLanc[fX][fY] = lanczos(sqrt(pow(fX * rcpRatioX, 2) + pow(fY * rcpRatioY, 2)) / 1e3);
                            }
                            weight = cacheLanc[fX][fY];
                            if (weight > 0) {
                                idx = (j * oW + i) * 4;
                                a += weight;
                                red += weight * srcData[idx];
                                green += weight * srcData[idx + 1];
                                blue += weight * srcData[idx + 2];
                                alpha += weight * srcData[idx + 3];
                            }
                        }
                    }
                    idx = (v * dW + u) * 4;
                    destData[idx] = red / a;
                    destData[idx + 1] = green / a;
                    destData[idx + 2] = blue / a;
                    destData[idx + 3] = alpha / a;
                }
                if (++u < dW) {
                    return process(u);
                } else {
                    return destImg;
                }
            }
            var context = canvasEl.getContext("2d"), srcImg = context.getImageData(0, 0, oW, oH), destImg = context.getImageData(0, 0, dW, dH), srcData = srcImg.data, destData = destImg.data, lanczos = lanczosCreate(this.lanczosLobes), ratioX = this.rcpScaleX, ratioY = this.rcpScaleY, rcpRatioX = 2 / this.rcpScaleX, rcpRatioY = 2 / this.rcpScaleY, range2X = ceil(ratioX * this.lanczosLobes / 2), range2Y = ceil(ratioY * this.lanczosLobes / 2), cacheLanc = {}, center = {}, icenter = {};
            return process(0);
        },
        bilinearFiltering: function(canvasEl, w, h, w2, h2) {
            var a, b, c, d, x, y, i, j, xDiff, yDiff, chnl, color, offset = 0, origPix, ratioX = this.rcpScaleX, ratioY = this.rcpScaleY, context = canvasEl.getContext("2d"), w4 = 4 * (w - 1), img = context.getImageData(0, 0, w, h), pixels = img.data, destImage = context.getImageData(0, 0, w2, h2), destPixels = destImage.data;
            for (i = 0; i < h2; i++) {
                for (j = 0; j < w2; j++) {
                    x = floor(ratioX * j);
                    y = floor(ratioY * i);
                    xDiff = ratioX * j - x;
                    yDiff = ratioY * i - y;
                    origPix = 4 * (y * w + x);
                    for (chnl = 0; chnl < 4; chnl++) {
                        a = pixels[origPix + chnl];
                        b = pixels[origPix + 4 + chnl];
                        c = pixels[origPix + w4 + chnl];
                        d = pixels[origPix + w4 + 4 + chnl];
                        color = a * (1 - xDiff) * (1 - yDiff) + b * xDiff * (1 - yDiff) + c * yDiff * (1 - xDiff) + d * xDiff * yDiff;
                        destPixels[offset++] = color;
                    }
                }
            }
            return destImage;
        },
        hermiteFastResize: function(canvasEl, oW, oH, dW, dH) {
            var ratioW = this.rcpScaleX, ratioH = this.rcpScaleY, ratioWHalf = ceil(ratioW / 2), ratioHHalf = ceil(ratioH / 2), context = canvasEl.getContext("2d"), img = context.getImageData(0, 0, oW, oH), data = img.data, img2 = context.getImageData(0, 0, dW, dH), data2 = img2.data;
            for (var j = 0; j < dH; j++) {
                for (var i = 0; i < dW; i++) {
                    var x2 = (i + j * dW) * 4, weight = 0, weights = 0, weightsAlpha = 0, gxR = 0, gxG = 0, gxB = 0, gxA = 0, centerY = (j + .5) * ratioH;
                    for (var yy = floor(j * ratioH); yy < (j + 1) * ratioH; yy++) {
                        var dy = abs(centerY - (yy + .5)) / ratioHHalf, centerX = (i + .5) * ratioW, w0 = dy * dy;
                        for (var xx = floor(i * ratioW); xx < (i + 1) * ratioW; xx++) {
                            var dx = abs(centerX - (xx + .5)) / ratioWHalf, w = sqrt(w0 + dx * dx);
                            if (w > 1 && w < -1) {
                                continue;
                            }
                            weight = 2 * w * w * w - 3 * w * w + 1;
                            if (weight > 0) {
                                dx = 4 * (xx + yy * oW);
                                gxA += weight * data[dx + 3];
                                weightsAlpha += weight;
                                if (data[dx + 3] < 255) {
                                    weight = weight * data[dx + 3] / 250;
                                }
                                gxR += weight * data[dx];
                                gxG += weight * data[dx + 1];
                                gxB += weight * data[dx + 2];
                                weights += weight;
                            }
                        }
                    }
                    data2[x2] = gxR / weights;
                    data2[x2 + 1] = gxG / weights;
                    data2[x2 + 2] = gxB / weights;
                    data2[x2 + 3] = gxA / weightsAlpha;
                }
            }
            return img2;
        },
        toObject: function() {
            return {
                type: this.type,
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                resizeType: this.resizeType,
                lanczosLobes: this.lanczosLobes
            };
        }
    });
    fabric.Image.filters.Resize.fromObject = function(object) {
        return new fabric.Image.filters.Resize(object);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, clone = fabric.util.object.clone, toFixed = fabric.util.toFixed, supportsLineDash = fabric.StaticCanvas.supports("setLineDash"), NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
    if (fabric.Text) {
        fabric.warn("fabric.Text is already defined");
        return;
    }
    var stateProperties = fabric.Object.prototype.stateProperties.concat();
    stateProperties.push("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor");
    fabric.Text = fabric.util.createClass(fabric.Object, {
        _dimensionAffectingProps: {
            fontSize: true,
            fontWeight: true,
            fontFamily: true,
            fontStyle: true,
            lineHeight: true,
            stroke: true,
            strokeWidth: true,
            text: true,
            textAlign: true
        },
        _reNewline: /\r?\n/,
        _reSpacesAndTabs: /[ \t\r]+/g,
        type: "text",
        fontSize: 40,
        fontWeight: "normal",
        fontFamily: "Times New Roman",
        textDecoration: "",
        textAlign: "left",
        fontStyle: "",
        lineHeight: 1.16,
        textBackgroundColor: "",
        stateProperties: stateProperties,
        stroke: null,
        shadow: null,
        _fontSizeFraction: .25,
        _fontSizeMult: 1.13,
        initialize: function(text, options) {
            options = options || {};
            this.text = text;
            this.__skipDimension = true;
            this.setOptions(options);
            this.__skipDimension = false;
            this._initDimensions();
        },
        _initDimensions: function(ctx) {
            if (this.__skipDimension) {
                return;
            }
            if (!ctx) {
                ctx = fabric.util.createCanvasElement().getContext("2d");
                this._setTextStyles(ctx);
            }
            this._textLines = this._splitTextIntoLines();
            this._clearCache();
            this._cacheLinesWidth = this.textAlign !== "justify";
            this.width = this._getTextWidth(ctx);
            this._cacheLinesWidth = true;
            this.height = this._getTextHeight(ctx);
        },
        toString: function() {
            return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>';
        },
        _render: function(ctx) {
            this.clipTo && fabric.util.clipContext(this, ctx);
            this._setOpacity(ctx);
            this._setShadow(ctx);
            this._setupCompositeOperation(ctx);
            this._renderTextBackground(ctx);
            this._setStrokeStyles(ctx);
            this._setFillStyles(ctx);
            this._renderText(ctx);
            this._renderTextDecoration(ctx);
            this.clipTo && ctx.restore();
        },
        _renderText: function(ctx) {
            this._translateForTextAlign(ctx);
            this._renderTextFill(ctx);
            this._renderTextStroke(ctx);
            this._translateForTextAlign(ctx, true);
        },
        _translateForTextAlign: function(ctx, back) {
            if (this.textAlign !== "left" && this.textAlign !== "justify") {
                var sign = back ? -1 : 1;
                ctx.translate(this.textAlign === "center" ? sign * this.width / 2 : sign * this.width, 0);
            }
        },
        _setTextStyles: function(ctx) {
            ctx.textBaseline = "alphabetic";
            if (!this.skipTextAlign) {
                ctx.textAlign = this.textAlign;
            }
            ctx.font = this._getFontDeclaration();
        },
        _getTextHeight: function() {
            return this._textLines.length * this._getHeightOfLine();
        },
        _getTextWidth: function(ctx) {
            var maxWidth = this._getLineWidth(ctx, 0);
            for (var i = 1, len = this._textLines.length; i < len; i++) {
                var currentLineWidth = this._getLineWidth(ctx, i);
                if (currentLineWidth > maxWidth) {
                    maxWidth = currentLineWidth;
                }
            }
            return maxWidth;
        },
        _renderChars: function(method, ctx, chars, left, top) {
            var shortM = method.slice(0, -4);
            if (this[shortM].toLive) {
                var offsetX = -this.width / 2 + this[shortM].offsetX || 0, offsetY = -this.height / 2 + this[shortM].offsetY || 0;
                ctx.save();
                ctx.translate(offsetX, offsetY);
                left -= offsetX;
                top -= offsetY;
            }
            ctx[method](chars, left, top);
            this[shortM].toLive && ctx.restore();
        },
        _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
            top -= this.fontSize * this._fontSizeFraction;
            if (this.textAlign !== "justify") {
                this._renderChars(method, ctx, line, left, top, lineIndex);
                return;
            }
            var lineWidth = this._getLineWidth(ctx, lineIndex), totalWidth = this.width;
            if (totalWidth >= lineWidth) {
                var words = line.split(/\s+/), wordsWidth = this._getWidthOfWords(ctx, line, lineIndex), widthDiff = totalWidth - wordsWidth, numSpaces = words.length - 1, spaceWidth = widthDiff / numSpaces, leftOffset = 0;
                for (var i = 0, len = words.length; i < len; i++) {
                    this._renderChars(method, ctx, words[i], left + leftOffset, top, lineIndex);
                    leftOffset += ctx.measureText(words[i]).width + spaceWidth;
                }
            } else {
                this._renderChars(method, ctx, line, left, top, lineIndex);
            }
        },
        _getWidthOfWords: function(ctx, line) {
            return ctx.measureText(line.replace(/\s+/g, "")).width;
        },
        _getLeftOffset: function() {
            return -this.width / 2;
        },
        _getTopOffset: function() {
            return -this.height / 2;
        },
        _renderTextFill: function(ctx) {
            if (!this.fill && !this._skipFillStrokeCheck) {
                return;
            }
            var lineHeights = 0;
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                var heightOfLine = this._getHeightOfLine(ctx, i), maxHeight = heightOfLine / this.lineHeight;
                this._renderTextLine("fillText", ctx, this._textLines[i], this._getLeftOffset(), this._getTopOffset() + lineHeights + maxHeight, i);
                lineHeights += heightOfLine;
            }
        },
        _renderTextStroke: function(ctx) {
            if ((!this.stroke || this.strokeWidth === 0) && !this._skipFillStrokeCheck) {
                return;
            }
            var lineHeights = 0;
            if (this.shadow && !this.shadow.affectStroke) {
                this._removeShadow(ctx);
            }
            ctx.save();
            if (this.strokeDashArray) {
                if (1 & this.strokeDashArray.length) {
                    this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
                }
                supportsLineDash && ctx.setLineDash(this.strokeDashArray);
            }
            ctx.beginPath();
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                var heightOfLine = this._getHeightOfLine(ctx, i), maxHeight = heightOfLine / this.lineHeight;
                this._renderTextLine("strokeText", ctx, this._textLines[i], this._getLeftOffset(), this._getTopOffset() + lineHeights + maxHeight, i);
                lineHeights += heightOfLine;
            }
            ctx.closePath();
            ctx.restore();
        },
        _getHeightOfLine: function() {
            return this.fontSize * this._fontSizeMult * this.lineHeight;
        },
        _renderTextBackground: function(ctx) {
            this._renderTextBoxBackground(ctx);
            this._renderTextLinesBackground(ctx);
        },
        _renderTextBoxBackground: function(ctx) {
            if (!this.backgroundColor) {
                return;
            }
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height);
        },
        _renderTextLinesBackground: function(ctx) {
            if (!this.textBackgroundColor) {
                return;
            }
            var lineTopOffset = 0, heightOfLine = this._getHeightOfLine(), lineWidth, lineLeftOffset;
            ctx.fillStyle = this.textBackgroundColor;
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                if (this._textLines[i] !== "") {
                    lineWidth = this._getLineWidth(ctx, i);
                    lineLeftOffset = this._getLineLeftOffset(lineWidth);
                    ctx.fillRect(this._getLeftOffset() + lineLeftOffset, this._getTopOffset() + lineTopOffset, lineWidth, this.fontSize * this._fontSizeMult);
                }
                lineTopOffset += heightOfLine;
            }
        },
        _getLineLeftOffset: function(lineWidth) {
            if (this.textAlign === "center") {
                return (this.width - lineWidth) / 2;
            }
            if (this.textAlign === "right") {
                return this.width - lineWidth;
            }
            return 0;
        },
        _clearCache: function() {
            this.__lineWidths = [];
            this.__lineHeights = [];
            this.__lineOffsets = [];
        },
        _shouldClearCache: function() {
            var shouldClear = false;
            if (this._forceClearCache) {
                this._forceClearCache = false;
                return true;
            }
            for (var prop in this._dimensionAffectingProps) {
                if (this["__" + prop] !== this[prop]) {
                    this["__" + prop] = this[prop];
                    shouldClear = true;
                }
            }
            return shouldClear;
        },
        _getLineWidth: function(ctx, lineIndex) {
            if (this.__lineWidths[lineIndex]) {
                return this.__lineWidths[lineIndex];
            }
            var width, wordCount, line = this._textLines[lineIndex];
            if (line === "") {
                width = 0;
            } else if (this.textAlign === "justify" && this._cacheLinesWidth) {
                wordCount = line.split(" ");
                if (wordCount.length > 1) {
                    width = this.width;
                } else {
                    width = ctx.measureText(line).width;
                }
            } else {
                width = ctx.measureText(line).width;
            }
            this._cacheLinesWidth && (this.__lineWidths[lineIndex] = width);
            return width;
        },
        _renderTextDecoration: function(ctx) {
            if (!this.textDecoration) {
                return;
            }
            var halfOfVerticalBox = this.height / 2, _this = this, offsets = [];
            function renderLinesAtOffset(offsets) {
                var i, lineHeight = 0, len, j, oLen, lineWidth, lineLeftOffset, heightOfLine;
                for (i = 0, len = _this._textLines.length; i < len; i++) {
                    lineWidth = _this._getLineWidth(ctx, i), lineLeftOffset = _this._getLineLeftOffset(lineWidth), 
                    heightOfLine = _this._getHeightOfLine(ctx, i);
                    for (j = 0, oLen = offsets.length; j < oLen; j++) {
                        ctx.fillRect(_this._getLeftOffset() + lineLeftOffset, lineHeight + (_this._fontSizeMult - 1 + offsets[j]) * _this.fontSize - halfOfVerticalBox, lineWidth, _this.fontSize / 15);
                    }
                    lineHeight += heightOfLine;
                }
            }
            if (this.textDecoration.indexOf("underline") > -1) {
                offsets.push(.85);
            }
            if (this.textDecoration.indexOf("line-through") > -1) {
                offsets.push(.43);
            }
            if (this.textDecoration.indexOf("overline") > -1) {
                offsets.push(-.12);
            }
            if (offsets.length > 0) {
                renderLinesAtOffset(offsets);
            }
        },
        _getFontDeclaration: function() {
            return [ fabric.isLikelyNode ? this.fontWeight : this.fontStyle, fabric.isLikelyNode ? this.fontStyle : this.fontWeight, this.fontSize + "px", fabric.isLikelyNode ? '"' + this.fontFamily + '"' : this.fontFamily ].join(" ");
        },
        render: function(ctx, noTransform) {
            if (!this.visible) {
                return;
            }
            ctx.save();
            this._setTextStyles(ctx);
            if (this._shouldClearCache()) {
                this._initDimensions(ctx);
            }
            if (!noTransform) {
                this.transform(ctx);
            }
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            if (this.group && this.group.type === "path-group") {
                ctx.translate(this.left, this.top);
            }
            this._render(ctx);
            ctx.restore();
        },
        _splitTextIntoLines: function() {
            return this.text.split(this._reNewline);
        },
        toObject: function(propertiesToInclude) {
            var object = extend(this.callSuper("toObject", propertiesToInclude), {
                text: this.text,
                fontSize: this.fontSize,
                fontWeight: this.fontWeight,
                fontFamily: this.fontFamily,
                fontStyle: this.fontStyle,
                lineHeight: this.lineHeight,
                textDecoration: this.textDecoration,
                textAlign: this.textAlign,
                textBackgroundColor: this.textBackgroundColor
            });
            if (!this.includeDefaultValues) {
                this._removeDefaultValues(object);
            }
            return object;
        },
        toSVG: function(reviver) {
            var markup = this._createBaseSVGMarkup(), offsets = this._getSVGLeftTopOffsets(this.ctx), textAndBg = this._getSVGTextAndBg(offsets.textTop, offsets.textLeft);
            this._wrapSVGTextAndBg(markup, textAndBg);
            return reviver ? reviver(markup.join("")) : markup.join("");
        },
        _getSVGLeftTopOffsets: function(ctx) {
            var lineTop = this._getHeightOfLine(ctx, 0), textLeft = -this.width / 2, textTop = 0;
            return {
                textLeft: textLeft + (this.group && this.group.type === "path-group" ? this.left : 0),
                textTop: textTop + (this.group && this.group.type === "path-group" ? -this.top : 0),
                lineTop: lineTop
            };
        },
        _wrapSVGTextAndBg: function(markup, textAndBg) {
            markup.push('	<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', textAndBg.textBgRects.join(""), "		<text ", this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : "", 'style="', this.getSvgStyles(), '" >', textAndBg.textSpans.join(""), "</text>\n", "	</g>\n");
        },
        _getSVGTextAndBg: function(textTopOffset, textLeftOffset) {
            var textSpans = [], textBgRects = [], height = 0;
            this._setSVGBg(textBgRects);
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                if (this.textBackgroundColor) {
                    this._setSVGTextLineBg(textBgRects, i, textLeftOffset, textTopOffset, height);
                }
                this._setSVGTextLineText(i, textSpans, height, textLeftOffset, textTopOffset, textBgRects);
                height += this._getHeightOfLine(this.ctx, i);
            }
            return {
                textSpans: textSpans,
                textBgRects: textBgRects
            };
        },
        _setSVGTextLineText: function(i, textSpans, height, textLeftOffset, textTopOffset) {
            var yPos = this.fontSize * (this._fontSizeMult - this._fontSizeFraction) - textTopOffset + height - this.height / 2;
            textSpans.push('<tspan x="', toFixed(textLeftOffset + this._getLineLeftOffset(this.__lineWidths[i]), NUM_FRACTION_DIGITS), '" ', 'y="', toFixed(yPos, NUM_FRACTION_DIGITS), '" ', this._getFillAttributes(this.fill), ">", fabric.util.string.escapeXml(this._textLines[i]), "</tspan>");
        },
        _setSVGTextLineBg: function(textBgRects, i, textLeftOffset, textTopOffset, height) {
            textBgRects.push("		<rect ", this._getFillAttributes(this.textBackgroundColor), ' x="', toFixed(textLeftOffset + this._getLineLeftOffset(this.__lineWidths[i]), NUM_FRACTION_DIGITS), '" y="', toFixed(height - this.height / 2, NUM_FRACTION_DIGITS), '" width="', toFixed(this.__lineWidths[i], NUM_FRACTION_DIGITS), '" height="', toFixed(this._getHeightOfLine(this.ctx, i) / this.lineHeight, NUM_FRACTION_DIGITS), '"></rect>\n');
        },
        _setSVGBg: function(textBgRects) {
            if (this.backgroundColor) {
                textBgRects.push("		<rect ", this._getFillAttributes(this.backgroundColor), ' x="', toFixed(-this.width / 2, NUM_FRACTION_DIGITS), '" y="', toFixed(-this.height / 2, NUM_FRACTION_DIGITS), '" width="', toFixed(this.width, NUM_FRACTION_DIGITS), '" height="', toFixed(this.height, NUM_FRACTION_DIGITS), '"></rect>\n');
            }
        },
        _getFillAttributes: function(value) {
            var fillColor = value && typeof value === "string" ? new fabric.Color(value) : "";
            if (!fillColor || !fillColor.getSource() || fillColor.getAlpha() === 1) {
                return 'fill="' + value + '"';
            }
            return 'opacity="' + fillColor.getAlpha() + '" fill="' + fillColor.setAlpha(1).toRgb() + '"';
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            if (key in this._dimensionAffectingProps) {
                this._initDimensions();
                this.setCoords();
            }
        },
        complexity: function() {
            return 1;
        }
    });
    fabric.Text.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" "));
    fabric.Text.DEFAULT_SVG_FONT_SIZE = 16;
    fabric.Text.fromElement = function(element, options) {
        if (!element) {
            return null;
        }
        var parsedAttributes = fabric.parseAttributes(element, fabric.Text.ATTRIBUTE_NAMES);
        options = fabric.util.object.extend(options ? fabric.util.object.clone(options) : {}, parsedAttributes);
        options.top = options.top || 0;
        options.left = options.left || 0;
        if ("dx" in parsedAttributes) {
            options.left += parsedAttributes.dx;
        }
        if ("dy" in parsedAttributes) {
            options.top += parsedAttributes.dy;
        }
        if (!("fontSize" in options)) {
            options.fontSize = fabric.Text.DEFAULT_SVG_FONT_SIZE;
        }
        if (!options.originX) {
            options.originX = "left";
        }
        var textContent = element.textContent.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " "), text = new fabric.Text(textContent, options), offX = 0;
        if (text.originX === "left") {
            offX = text.getWidth() / 2;
        }
        if (text.originX === "right") {
            offX = -text.getWidth() / 2;
        }
        text.set({
            left: text.getLeft() + offX,
            top: text.getTop() - text.getHeight() / 2 + text.fontSize * (.18 + text._fontSizeFraction)
        });
        return text;
    };
    fabric.Text.fromObject = function(object) {
        return new fabric.Text(object.text, clone(object));
    };
    fabric.util.createAccessors(fabric.Text);
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var clone = fabric.util.object.clone;
    fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
        type: "i-text",
        selectionStart: 0,
        selectionEnd: 0,
        selectionColor: "rgba(17,119,255,0.3)",
        isEditing: false,
        editable: true,
        editingBorderColor: "rgba(102,153,255,0.25)",
        cursorWidth: 2,
        cursorColor: "#333",
        cursorDelay: 1e3,
        cursorDuration: 600,
        styles: null,
        caching: true,
        _skipFillStrokeCheck: false,
        _reSpace: /\s|\n/,
        _currentCursorOpacity: 0,
        _selectionDirection: null,
        _abortCursorAnimation: false,
        _charWidthsCache: {},
        initialize: function(text, options) {
            this.styles = options ? options.styles || {} : {};
            this.callSuper("initialize", text, options);
            this.initBehavior();
        },
        _clearCache: function() {
            this.callSuper("_clearCache");
            this.__maxFontHeights = [];
            this.__widthOfSpace = [];
        },
        isEmptyStyles: function() {
            if (!this.styles) {
                return true;
            }
            var obj = this.styles;
            for (var p1 in obj) {
                for (var p2 in obj[p1]) {
                    for (var p3 in obj[p1][p2]) {
                        return false;
                    }
                }
            }
            return true;
        },
        setSelectionStart: function(index) {
            index = Math.max(index, 0);
            if (this.selectionStart !== index) {
                this.fire("selection:changed");
                this.canvas && this.canvas.fire("text:selection:changed", {
                    target: this
                });
                this.selectionStart = index;
            }
            this._updateTextarea();
        },
        setSelectionEnd: function(index) {
            index = Math.min(index, this.text.length);
            if (this.selectionEnd !== index) {
                this.fire("selection:changed");
                this.canvas && this.canvas.fire("text:selection:changed", {
                    target: this
                });
                this.selectionEnd = index;
            }
            this._updateTextarea();
        },
        getSelectionStyles: function(startIndex, endIndex) {
            if (arguments.length === 2) {
                var styles = [];
                for (var i = startIndex; i < endIndex; i++) {
                    styles.push(this.getSelectionStyles(i));
                }
                return styles;
            }
            var loc = this.get2DCursorLocation(startIndex), style = this._getStyleDeclaration(loc.lineIndex, loc.charIndex);
            return style || {};
        },
        setSelectionStyles: function(styles) {
            if (this.selectionStart === this.selectionEnd) {
                this._extendStyles(this.selectionStart, styles);
            } else {
                for (var i = this.selectionStart; i < this.selectionEnd; i++) {
                    this._extendStyles(i, styles);
                }
            }
            this._forceClearCache = true;
            return this;
        },
        _extendStyles: function(index, styles) {
            var loc = this.get2DCursorLocation(index);
            if (!this._getLineStyle(loc.lineIndex)) {
                this._setLineStyle(loc.lineIndex, {});
            }
            if (!this._getStyleDeclaration(loc.lineIndex, loc.charIndex)) {
                this._setStyleDeclaration(loc.lineIndex, loc.charIndex, {});
            }
            fabric.util.object.extend(this._getStyleDeclaration(loc.lineIndex, loc.charIndex), styles);
        },
        _render: function(ctx) {
            this.callSuper("_render", ctx);
            this.ctx = ctx;
            this.isEditing && this.renderCursorOrSelection();
        },
        renderCursorOrSelection: function() {
            if (!this.active) {
                return;
            }
            var chars = this.text.split(""), boundaries, ctx;
            if (this.canvas.contextTop) {
                ctx = this.canvas.contextTop;
                ctx.save();
                ctx.transform.apply(ctx, this.canvas.viewportTransform);
                this.transform(ctx);
                this.transformMatrix && ctx.transform.apply(ctx, this.transformMatrix);
            } else {
                ctx = this.ctx;
                ctx.save();
            }
            if (this.selectionStart === this.selectionEnd) {
                boundaries = this._getCursorBoundaries(chars, "cursor");
                this.renderCursor(boundaries, ctx);
            } else {
                boundaries = this._getCursorBoundaries(chars, "selection");
                this.renderSelection(chars, boundaries, ctx);
            }
            ctx.restore();
        },
        get2DCursorLocation: function(selectionStart) {
            if (typeof selectionStart === "undefined") {
                selectionStart = this.selectionStart;
            }
            var len = this._textLines.length;
            for (var i = 0; i < len; i++) {
                if (selectionStart <= this._textLines[i].length) {
                    return {
                        lineIndex: i,
                        charIndex: selectionStart
                    };
                }
                selectionStart -= this._textLines[i].length + 1;
            }
            return {
                lineIndex: i - 1,
                charIndex: this._textLines[i - 1].length < selectionStart ? this._textLines[i - 1].length : selectionStart
            };
        },
        getCurrentCharStyle: function(lineIndex, charIndex) {
            var style = this._getStyleDeclaration(lineIndex, charIndex === 0 ? 0 : charIndex - 1);
            return {
                fontSize: style && style.fontSize || this.fontSize,
                fill: style && style.fill || this.fill,
                textBackgroundColor: style && style.textBackgroundColor || this.textBackgroundColor,
                textDecoration: style && style.textDecoration || this.textDecoration,
                fontFamily: style && style.fontFamily || this.fontFamily,
                fontWeight: style && style.fontWeight || this.fontWeight,
                fontStyle: style && style.fontStyle || this.fontStyle,
                stroke: style && style.stroke || this.stroke,
                strokeWidth: style && style.strokeWidth || this.strokeWidth
            };
        },
        getCurrentCharFontSize: function(lineIndex, charIndex) {
            var style = this._getStyleDeclaration(lineIndex, charIndex === 0 ? 0 : charIndex - 1);
            return style && style.fontSize ? style.fontSize : this.fontSize;
        },
        getCurrentCharColor: function(lineIndex, charIndex) {
            var style = this._getStyleDeclaration(lineIndex, charIndex === 0 ? 0 : charIndex - 1);
            return style && style.fill ? style.fill : this.cursorColor;
        },
        _getCursorBoundaries: function(chars, typeOfBoundaries) {
            var left = Math.round(this._getLeftOffset()), top = this._getTopOffset(), offsets = this._getCursorBoundariesOffsets(chars, typeOfBoundaries);
            return {
                left: left,
                top: top,
                leftOffset: offsets.left + offsets.lineLeft,
                topOffset: offsets.top
            };
        },
        _getCursorBoundariesOffsets: function(chars, typeOfBoundaries) {
            var lineLeftOffset = 0, lineIndex = 0, charIndex = 0, topOffset = 0, leftOffset = 0;
            for (var i = 0; i < this.selectionStart; i++) {
                if (chars[i] === "\n") {
                    leftOffset = 0;
                    topOffset += this._getHeightOfLine(this.ctx, lineIndex);
                    lineIndex++;
                    charIndex = 0;
                } else {
                    leftOffset += this._getWidthOfChar(this.ctx, chars[i], lineIndex, charIndex);
                    charIndex++;
                }
                lineLeftOffset = this._getCachedLineOffset(lineIndex);
            }
            if (typeOfBoundaries === "cursor") {
                topOffset += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, lineIndex) / this.lineHeight - this.getCurrentCharFontSize(lineIndex, charIndex) * (1 - this._fontSizeFraction);
            }
            return {
                top: topOffset,
                left: leftOffset,
                lineLeft: lineLeftOffset
            };
        },
        _getCachedLineOffset: function(lineIndex) {
            var widthOfLine = this._getLineWidth(this.ctx, lineIndex);
            return this.__lineOffsets[lineIndex] || (this.__lineOffsets[lineIndex] = this._getLineLeftOffset(widthOfLine));
        },
        renderCursor: function(boundaries, ctx) {
            var cursorLocation = this.get2DCursorLocation(), lineIndex = cursorLocation.lineIndex, charIndex = cursorLocation.charIndex, charHeight = this.getCurrentCharFontSize(lineIndex, charIndex), leftOffset = lineIndex === 0 && charIndex === 0 ? this._getCachedLineOffset(lineIndex) : boundaries.leftOffset;
            ctx.fillStyle = this.getCurrentCharColor(lineIndex, charIndex);
            ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
            ctx.fillRect(boundaries.left + leftOffset, boundaries.top + boundaries.topOffset, this.cursorWidth / this.scaleX, charHeight);
        },
        renderSelection: function(chars, boundaries, ctx) {
            ctx.fillStyle = this.selectionColor;
            var start = this.get2DCursorLocation(this.selectionStart), end = this.get2DCursorLocation(this.selectionEnd), startLine = start.lineIndex, endLine = end.lineIndex;
            for (var i = startLine; i <= endLine; i++) {
                var lineOffset = this._getCachedLineOffset(i) || 0, lineHeight = this._getHeightOfLine(this.ctx, i), boxWidth = 0, line = this._textLines[i];
                if (i === startLine) {
                    for (var j = 0, len = line.length; j < len; j++) {
                        if (j >= start.charIndex && (i !== endLine || j < end.charIndex)) {
                            boxWidth += this._getWidthOfChar(ctx, line[j], i, j);
                        }
                        if (j < start.charIndex) {
                            lineOffset += this._getWidthOfChar(ctx, line[j], i, j);
                        }
                    }
                } else if (i > startLine && i < endLine) {
                    boxWidth += this._getLineWidth(ctx, i) || 5;
                } else if (i === endLine) {
                    for (var j2 = 0, j2len = end.charIndex; j2 < j2len; j2++) {
                        boxWidth += this._getWidthOfChar(ctx, line[j2], i, j2);
                    }
                }
                ctx.fillRect(boundaries.left + lineOffset, boundaries.top + boundaries.topOffset, boxWidth, lineHeight);
                boundaries.topOffset += lineHeight;
            }
        },
        _renderChars: function(method, ctx, line, left, top, lineIndex) {
            if (this.isEmptyStyles()) {
                return this._renderCharsFast(method, ctx, line, left, top);
            }
            this.skipTextAlign = true;
            left -= this.textAlign === "center" ? this.width / 2 : this.textAlign === "right" ? this.width : 0;
            var lineHeight = this._getHeightOfLine(ctx, lineIndex), lineLeftOffset = this._getCachedLineOffset(lineIndex), prevStyle, charsToRender = "";
            left += lineLeftOffset || 0;
            ctx.save();
            top -= lineHeight / this.lineHeight * this._fontSizeFraction;
            for (var i = 0, len = line.length; i <= len; i++) {
                prevStyle = prevStyle || this.getCurrentCharStyle(lineIndex, i);
                var thisStyle = this.getCurrentCharStyle(lineIndex, i + 1);
                if (this._hasStyleChanged(prevStyle, thisStyle) || i === len) {
                    this._renderChar(method, ctx, lineIndex, i - 1, charsToRender, left, top, lineHeight);
                    charsToRender = "";
                    prevStyle = thisStyle;
                }
                charsToRender += line[i];
            }
            ctx.restore();
        },
        _renderCharsFast: function(method, ctx, line, left, top) {
            this.skipTextAlign = false;
            if (method === "fillText" && this.fill) {
                this.callSuper("_renderChars", method, ctx, line, left, top);
            }
            if (method === "strokeText" && (this.stroke && this.strokeWidth > 0 || this.skipFillStrokeCheck)) {
                this.callSuper("_renderChars", method, ctx, line, left, top);
            }
        },
        _renderChar: function(method, ctx, lineIndex, i, _char, left, top, lineHeight) {
            var charWidth, charHeight, decl = this._getStyleDeclaration(lineIndex, i), offset = this._fontSizeFraction * lineHeight / this.lineHeight;
            if (decl) {
                var shouldStroke = decl.stroke || this.stroke, shouldFill = decl.fill || this.fill;
                ctx.save();
                charWidth = this._applyCharStylesGetWidth(ctx, _char, lineIndex, i, decl);
                charHeight = this._getHeightOfChar(ctx, _char, lineIndex, i);
                if (shouldFill) {
                    ctx.fillText(_char, left, top);
                }
                if (shouldStroke) {
                    ctx.strokeText(_char, left, top);
                }
                this._renderCharDecoration(ctx, decl, left, top, offset, charWidth, charHeight);
                ctx.restore();
                ctx.translate(charWidth, 0);
            } else {
                if (method === "strokeText" && this.stroke) {
                    ctx[method](_char, left, top);
                }
                if (method === "fillText" && this.fill) {
                    ctx[method](_char, left, top);
                }
                charWidth = this._applyCharStylesGetWidth(ctx, _char, lineIndex, i);
                this._renderCharDecoration(ctx, null, left, top, offset, charWidth, this.fontSize);
                ctx.translate(ctx.measureText(_char).width, 0);
            }
        },
        _hasStyleChanged: function(prevStyle, thisStyle) {
            return prevStyle.fill !== thisStyle.fill || prevStyle.fontSize !== thisStyle.fontSize || prevStyle.textBackgroundColor !== thisStyle.textBackgroundColor || prevStyle.textDecoration !== thisStyle.textDecoration || prevStyle.fontFamily !== thisStyle.fontFamily || prevStyle.fontWeight !== thisStyle.fontWeight || prevStyle.fontStyle !== thisStyle.fontStyle || prevStyle.stroke !== thisStyle.stroke || prevStyle.strokeWidth !== thisStyle.strokeWidth;
        },
        _renderCharDecoration: function(ctx, styleDeclaration, left, top, offset, charWidth, charHeight) {
            var textDecoration = styleDeclaration ? styleDeclaration.textDecoration || this.textDecoration : this.textDecoration;
            if (!textDecoration) {
                return;
            }
            if (textDecoration.indexOf("underline") > -1) {
                ctx.fillRect(left, top + charHeight / 10, charWidth, charHeight / 15);
            }
            if (textDecoration.indexOf("line-through") > -1) {
                ctx.fillRect(left, top - charHeight * (this._fontSizeFraction + this._fontSizeMult - 1) + charHeight / 15, charWidth, charHeight / 15);
            }
            if (textDecoration.indexOf("overline") > -1) {
                ctx.fillRect(left, top - (this._fontSizeMult - this._fontSizeFraction) * charHeight, charWidth, charHeight / 15);
            }
        },
        _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
            if (!this.isEmptyStyles()) {
                top += this.fontSize * (this._fontSizeFraction + .03);
            }
            this.callSuper("_renderTextLine", method, ctx, line, left, top, lineIndex);
        },
        _renderTextDecoration: function(ctx) {
            if (this.isEmptyStyles()) {
                return this.callSuper("_renderTextDecoration", ctx);
            }
        },
        _renderTextLinesBackground: function(ctx) {
            if (!this.textBackgroundColor && !this.styles) {
                return;
            }
            ctx.save();
            if (this.textBackgroundColor) {
                ctx.fillStyle = this.textBackgroundColor;
            }
            var lineHeights = 0;
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                var heightOfLine = this._getHeightOfLine(ctx, i);
                if (this._textLines[i] === "") {
                    lineHeights += heightOfLine;
                    continue;
                }
                var lineWidth = this._getLineWidth(ctx, i), lineLeftOffset = this._getCachedLineOffset(i);
                if (this.textBackgroundColor) {
                    ctx.fillStyle = this.textBackgroundColor;
                    ctx.fillRect(this._getLeftOffset() + lineLeftOffset, this._getTopOffset() + lineHeights, lineWidth, heightOfLine / this.lineHeight);
                }
                if (this._getLineStyle(i)) {
                    for (var j = 0, jlen = this._textLines[i].length; j < jlen; j++) {
                        var style = this._getStyleDeclaration(i, j);
                        if (style && style.textBackgroundColor) {
                            var _char = this._textLines[i][j];
                            ctx.fillStyle = style.textBackgroundColor;
                            ctx.fillRect(this._getLeftOffset() + lineLeftOffset + this._getWidthOfCharsAt(ctx, i, j), this._getTopOffset() + lineHeights, this._getWidthOfChar(ctx, _char, i, j) + 1, heightOfLine / this.lineHeight);
                        }
                    }
                }
                lineHeights += heightOfLine;
            }
            ctx.restore();
        },
        _getCacheProp: function(_char, styleDeclaration) {
            return _char + styleDeclaration.fontFamily + styleDeclaration.fontSize + styleDeclaration.fontWeight + styleDeclaration.fontStyle + styleDeclaration.shadow;
        },
        _applyCharStylesGetWidth: function(ctx, _char, lineIndex, charIndex, decl) {
            var styleDeclaration = decl || this._getStyleDeclaration(lineIndex, charIndex);
            if (styleDeclaration) {
                styleDeclaration = clone(styleDeclaration);
            } else {
                styleDeclaration = {};
            }
            this._applyFontStyles(styleDeclaration);
            var cacheProp = this._getCacheProp(_char, styleDeclaration);
            if (this.isEmptyStyles() && this._charWidthsCache[cacheProp] && this.caching) {
                return this._charWidthsCache[cacheProp];
            }
            if (typeof styleDeclaration.shadow === "string") {
                styleDeclaration.shadow = new fabric.Shadow(styleDeclaration.shadow);
            }
            var fill = styleDeclaration.fill || this.fill;
            ctx.fillStyle = fill.toLive ? fill.toLive(ctx, this) : fill;
            if (styleDeclaration.stroke) {
                ctx.strokeStyle = styleDeclaration.stroke && styleDeclaration.stroke.toLive ? styleDeclaration.stroke.toLive(ctx, this) : styleDeclaration.stroke;
            }
            ctx.lineWidth = styleDeclaration.strokeWidth || this.strokeWidth;
            ctx.font = this._getFontDeclaration.call(styleDeclaration);
            this._setShadow.call(styleDeclaration, ctx);
            if (!this.caching) {
                return ctx.measureText(_char).width;
            }
            if (!this._charWidthsCache[cacheProp]) {
                this._charWidthsCache[cacheProp] = ctx.measureText(_char).width;
            }
            return this._charWidthsCache[cacheProp];
        },
        _applyFontStyles: function(styleDeclaration) {
            if (!styleDeclaration.fontFamily) {
                styleDeclaration.fontFamily = this.fontFamily;
            }
            if (!styleDeclaration.fontSize) {
                styleDeclaration.fontSize = this.fontSize;
            }
            if (!styleDeclaration.fontWeight) {
                styleDeclaration.fontWeight = this.fontWeight;
            }
            if (!styleDeclaration.fontStyle) {
                styleDeclaration.fontStyle = this.fontStyle;
            }
        },
        _getStyleDeclaration: function(lineIndex, charIndex, returnCloneOrEmpty) {
            if (returnCloneOrEmpty) {
                return this.styles[lineIndex] && this.styles[lineIndex][charIndex] ? clone(this.styles[lineIndex][charIndex]) : {};
            }
            return this.styles[lineIndex] && this.styles[lineIndex][charIndex] ? this.styles[lineIndex][charIndex] : null;
        },
        _setStyleDeclaration: function(lineIndex, charIndex, style) {
            this.styles[lineIndex][charIndex] = style;
        },
        _deleteStyleDeclaration: function(lineIndex, charIndex) {
            delete this.styles[lineIndex][charIndex];
        },
        _getLineStyle: function(lineIndex) {
            return this.styles[lineIndex];
        },
        _setLineStyle: function(lineIndex, style) {
            this.styles[lineIndex] = style;
        },
        _deleteLineStyle: function(lineIndex) {
            delete this.styles[lineIndex];
        },
        _getWidthOfChar: function(ctx, _char, lineIndex, charIndex) {
            if (this.textAlign === "justify" && this._reSpacesAndTabs.test(_char)) {
                return this._getWidthOfSpace(ctx, lineIndex);
            }
            var styleDeclaration = this._getStyleDeclaration(lineIndex, charIndex, true);
            this._applyFontStyles(styleDeclaration);
            var cacheProp = this._getCacheProp(_char, styleDeclaration);
            if (this._charWidthsCache[cacheProp] && this.caching) {
                return this._charWidthsCache[cacheProp];
            } else if (ctx) {
                ctx.save();
                var width = this._applyCharStylesGetWidth(ctx, _char, lineIndex, charIndex);
                ctx.restore();
                return width;
            }
        },
        _getHeightOfChar: function(ctx, _char, lineIndex, charIndex) {
            var style = this._getStyleDeclaration(lineIndex, charIndex);
            return style && style.fontSize ? style.fontSize : this.fontSize;
        },
        _getHeightOfCharAt: function(ctx, lineIndex, charIndex) {
            var _char = this._textLines[lineIndex][charIndex];
            return this._getHeightOfChar(ctx, _char, lineIndex, charIndex);
        },
        _getWidthOfCharsAt: function(ctx, lineIndex, charIndex) {
            var width = 0, i, _char;
            for (i = 0; i < charIndex; i++) {
                _char = this._textLines[lineIndex][i];
                width += this._getWidthOfChar(ctx, _char, lineIndex, i);
            }
            return width;
        },
        _getLineWidth: function(ctx, lineIndex) {
            if (this.__lineWidths[lineIndex]) {
                return this.__lineWidths[lineIndex];
            }
            this.__lineWidths[lineIndex] = this._getWidthOfCharsAt(ctx, lineIndex, this._textLines[lineIndex].length);
            return this.__lineWidths[lineIndex];
        },
        _getWidthOfSpace: function(ctx, lineIndex) {
            if (this.__widthOfSpace[lineIndex]) {
                return this.__widthOfSpace[lineIndex];
            }
            var line = this._textLines[lineIndex], wordsWidth = this._getWidthOfWords(ctx, line, lineIndex), widthDiff = this.width - wordsWidth, numSpaces = line.length - line.replace(this._reSpacesAndTabs, "").length, width = widthDiff / numSpaces;
            this.__widthOfSpace[lineIndex] = width;
            return width;
        },
        _getWidthOfWords: function(ctx, line, lineIndex) {
            var width = 0;
            for (var charIndex = 0; charIndex < line.length; charIndex++) {
                var _char = line[charIndex];
                if (!_char.match(/\s/)) {
                    width += this._getWidthOfChar(ctx, _char, lineIndex, charIndex);
                }
            }
            return width;
        },
        _getHeightOfLine: function(ctx, lineIndex) {
            if (this.__lineHeights[lineIndex]) {
                return this.__lineHeights[lineIndex];
            }
            var line = this._textLines[lineIndex], maxHeight = this._getHeightOfChar(ctx, line[0], lineIndex, 0);
            for (var i = 1, len = line.length; i < len; i++) {
                var currentCharHeight = this._getHeightOfChar(ctx, line[i], lineIndex, i);
                if (currentCharHeight > maxHeight) {
                    maxHeight = currentCharHeight;
                }
            }
            this.__maxFontHeights[lineIndex] = maxHeight;
            this.__lineHeights[lineIndex] = maxHeight * this.lineHeight * this._fontSizeMult;
            return this.__lineHeights[lineIndex];
        },
        _getTextHeight: function(ctx) {
            var height = 0;
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                height += this._getHeightOfLine(ctx, i);
            }
            return height;
        },
        _renderTextBoxBackground: function(ctx) {
            if (!this.backgroundColor) {
                return;
            }
            ctx.save();
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height);
            ctx.restore();
        },
        toObject: function(propertiesToInclude) {
            return fabric.util.object.extend(this.callSuper("toObject", propertiesToInclude), {
                styles: clone(this.styles)
            });
        }
    });
    fabric.IText.fromObject = function(object) {
        return new fabric.IText(object.text, clone(object));
    };
})();

(function() {
    var clone = fabric.util.object.clone;
    fabric.util.object.extend(fabric.IText.prototype, {
        initBehavior: function() {
            this.initAddedHandler();
            this.initRemovedHandler();
            this.initCursorSelectionHandlers();
            this.initDoubleClickSimulation();
        },
        initSelectedHandler: function() {
            this.on("selected", function() {
                var _this = this;
                setTimeout(function() {
                    _this.selected = true;
                }, 100);
            });
        },
        initAddedHandler: function() {
            var _this = this;
            this.on("added", function() {
                if (this.canvas && !this.canvas._hasITextHandlers) {
                    this.canvas._hasITextHandlers = true;
                    this._initCanvasHandlers();
                }
                if (_this.canvas) {
                    _this.canvas._iTextInstances = _this.canvas._iTextInstances || [];
                    _this.canvas._iTextInstances.push(_this);
                }
            });
        },
        initRemovedHandler: function() {
            var _this = this;
            this.on("removed", function() {
                if (_this.canvas) {
                    _this.canvas._iTextInstances = _this.canvas._iTextInstances || [];
                    fabric.util.removeFromArray(_this.canvas._iTextInstances, _this);
                }
            });
        },
        _initCanvasHandlers: function() {
            var _this = this;
            this.canvas.on("selection:cleared", function() {
                fabric.IText.prototype.exitEditingOnOthers(_this.canvas);
            });
            this.canvas.on("mouse:up", function() {
                if (_this.canvas._iTextInstances) {
                    _this.canvas._iTextInstances.forEach(function(obj) {
                        obj.__isMousedown = false;
                    });
                }
            });
            this.canvas.on("object:selected", function() {
                fabric.IText.prototype.exitEditingOnOthers(_this.canvas);
            });
        },
        _tick: function() {
            this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete");
        },
        _animateCursor: function(obj, targetOpacity, duration, completeMethod) {
            var tickState;
            tickState = {
                isAborted: false,
                abort: function() {
                    this.isAborted = true;
                }
            };
            obj.animate("_currentCursorOpacity", targetOpacity, {
                duration: duration,
                onComplete: function() {
                    if (!tickState.isAborted) {
                        obj[completeMethod]();
                    }
                },
                onChange: function() {
                    if (obj.canvas) {
                        obj.canvas.clearContext(obj.canvas.contextTop || obj.ctx);
                        obj.renderCursorOrSelection();
                    }
                },
                abort: function() {
                    return tickState.isAborted;
                }
            });
            return tickState;
        },
        _onTickComplete: function() {
            var _this = this;
            if (this._cursorTimeout1) {
                clearTimeout(this._cursorTimeout1);
            }
            this._cursorTimeout1 = setTimeout(function() {
                _this._currentTickCompleteState = _this._animateCursor(_this, 0, this.cursorDuration / 2, "_tick");
            }, 100);
        },
        initDelayedCursor: function(restart) {
            var _this = this, delay = restart ? 0 : this.cursorDelay;
            this._currentTickState && this._currentTickState.abort();
            this._currentTickCompleteState && this._currentTickCompleteState.abort();
            clearTimeout(this._cursorTimeout1);
            this._currentCursorOpacity = 1;
            if (this.canvas) {
                this.canvas.clearContext(this.canvas.contextTop || this.ctx);
                this.renderCursorOrSelection();
            }
            if (this._cursorTimeout2) {
                clearTimeout(this._cursorTimeout2);
            }
            this._cursorTimeout2 = setTimeout(function() {
                _this._tick();
            }, delay);
        },
        abortCursorAnimation: function() {
            this._currentTickState && this._currentTickState.abort();
            this._currentTickCompleteState && this._currentTickCompleteState.abort();
            clearTimeout(this._cursorTimeout1);
            clearTimeout(this._cursorTimeout2);
            this._currentCursorOpacity = 0;
            this.canvas && this.canvas.clearContext(this.canvas.contextTop || this.ctx);
        },
        selectAll: function() {
            this.setSelectionStart(0);
            this.setSelectionEnd(this.text.length);
        },
        getSelectedText: function() {
            return this.text.slice(this.selectionStart, this.selectionEnd);
        },
        findWordBoundaryLeft: function(startFrom) {
            var offset = 0, index = startFrom - 1;
            if (this._reSpace.test(this.text.charAt(index))) {
                while (this._reSpace.test(this.text.charAt(index))) {
                    offset++;
                    index--;
                }
            }
            while (/\S/.test(this.text.charAt(index)) && index > -1) {
                offset++;
                index--;
            }
            return startFrom - offset;
        },
        findWordBoundaryRight: function(startFrom) {
            var offset = 0, index = startFrom;
            if (this._reSpace.test(this.text.charAt(index))) {
                while (this._reSpace.test(this.text.charAt(index))) {
                    offset++;
                    index++;
                }
            }
            while (/\S/.test(this.text.charAt(index)) && index < this.text.length) {
                offset++;
                index++;
            }
            return startFrom + offset;
        },
        findLineBoundaryLeft: function(startFrom) {
            var offset = 0, index = startFrom - 1;
            while (!/\n/.test(this.text.charAt(index)) && index > -1) {
                offset++;
                index--;
            }
            return startFrom - offset;
        },
        findLineBoundaryRight: function(startFrom) {
            var offset = 0, index = startFrom;
            while (!/\n/.test(this.text.charAt(index)) && index < this.text.length) {
                offset++;
                index++;
            }
            return startFrom + offset;
        },
        getNumNewLinesInSelectedText: function() {
            var selectedText = this.getSelectedText(), numNewLines = 0;
            for (var i = 0, len = selectedText.length; i < len; i++) {
                if (selectedText[i] === "\n") {
                    numNewLines++;
                }
            }
            return numNewLines;
        },
        searchWordBoundary: function(selectionStart, direction) {
            var index = this._reSpace.test(this.text.charAt(selectionStart)) ? selectionStart - 1 : selectionStart, _char = this.text.charAt(index), reNonWord = /[ \n\.,;!\?\-]/;
            while (!reNonWord.test(_char) && index > 0 && index < this.text.length) {
                index += direction;
                _char = this.text.charAt(index);
            }
            if (reNonWord.test(_char) && _char !== "\n") {
                index += direction === 1 ? 0 : 1;
            }
            return index;
        },
        selectWord: function(selectionStart) {
            var newSelectionStart = this.searchWordBoundary(selectionStart, -1), newSelectionEnd = this.searchWordBoundary(selectionStart, 1);
            this.setSelectionStart(newSelectionStart);
            this.setSelectionEnd(newSelectionEnd);
        },
        selectLine: function(selectionStart) {
            var newSelectionStart = this.findLineBoundaryLeft(selectionStart), newSelectionEnd = this.findLineBoundaryRight(selectionStart);
            this.setSelectionStart(newSelectionStart);
            this.setSelectionEnd(newSelectionEnd);
        },
        enterEditing: function() {
            if (this.isEditing || !this.editable) {
                return;
            }
            if (this.canvas) {
                this.exitEditingOnOthers(this.canvas);
            }
            this.isEditing = true;
            this.initHiddenTextarea();
            this.hiddenTextarea.focus();
            this._updateTextarea();
            this._saveEditingProps();
            this._setEditingProps();
            this._tick();
            this.fire("editing:entered");
            if (!this.canvas) {
                return this;
            }
            this.canvas.renderAll();
            this.canvas.fire("text:editing:entered", {
                target: this
            });
            this.initMouseMoveHandler();
            return this;
        },
        exitEditingOnOthers: function(canvas) {
            if (canvas._iTextInstances) {
                canvas._iTextInstances.forEach(function(obj) {
                    obj.selected = false;
                    if (obj.isEditing) {
                        obj.exitEditing();
                    }
                });
            }
        },
        initMouseMoveHandler: function() {
            var _this = this;
            this.canvas.on("mouse:move", function(options) {
                if (!_this.__isMousedown || !_this.isEditing) {
                    return;
                }
                var newSelectionStart = _this.getSelectionStartFromPointer(options.e);
                if (newSelectionStart >= _this.__selectionStartOnMouseDown) {
                    _this.setSelectionStart(_this.__selectionStartOnMouseDown);
                    _this.setSelectionEnd(newSelectionStart);
                } else {
                    _this.setSelectionStart(newSelectionStart);
                    _this.setSelectionEnd(_this.__selectionStartOnMouseDown);
                }
            });
        },
        _setEditingProps: function() {
            this.hoverCursor = "text";
            if (this.canvas) {
                this.canvas.defaultCursor = this.canvas.moveCursor = "text";
            }
            this.borderColor = this.editingBorderColor;
            this.hasControls = this.selectable = false;
            this.lockMovementX = this.lockMovementY = true;
        },
        _updateTextarea: function() {
            if (!this.hiddenTextarea) {
                return;
            }
            this.hiddenTextarea.value = this.text;
            this.hiddenTextarea.selectionStart = this.selectionStart;
            this.hiddenTextarea.selectionEnd = this.selectionEnd;
        },
        _saveEditingProps: function() {
            this._savedProps = {
                hasControls: this.hasControls,
                borderColor: this.borderColor,
                lockMovementX: this.lockMovementX,
                lockMovementY: this.lockMovementY,
                hoverCursor: this.hoverCursor,
                defaultCursor: this.canvas && this.canvas.defaultCursor,
                moveCursor: this.canvas && this.canvas.moveCursor
            };
        },
        _restoreEditingProps: function() {
            if (!this._savedProps) {
                return;
            }
            this.hoverCursor = this._savedProps.overCursor;
            this.hasControls = this._savedProps.hasControls;
            this.borderColor = this._savedProps.borderColor;
            this.lockMovementX = this._savedProps.lockMovementX;
            this.lockMovementY = this._savedProps.lockMovementY;
            if (this.canvas) {
                this.canvas.defaultCursor = this._savedProps.defaultCursor;
                this.canvas.moveCursor = this._savedProps.moveCursor;
            }
        },
        exitEditing: function() {
            this.selected = false;
            this.isEditing = false;
            this.selectable = true;
            this.selectionEnd = this.selectionStart;
            this.hiddenTextarea && this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea);
            this.hiddenTextarea = null;
            this.abortCursorAnimation();
            this._restoreEditingProps();
            this._currentCursorOpacity = 0;
            this.fire("editing:exited");
            this.canvas && this.canvas.fire("text:editing:exited", {
                target: this
            });
            return this;
        },
        _removeExtraneousStyles: function() {
            for (var prop in this.styles) {
                if (!this._textLines[prop]) {
                    delete this.styles[prop];
                }
            }
        },
        _removeCharsFromTo: function(start, end) {
            while (end !== start) {
                this._removeSingleCharAndStyle(start + 1);
                end--;
            }
            this.setSelectionStart(start);
        },
        _removeSingleCharAndStyle: function(index) {
            var isBeginningOfLine = this.text[index - 1] === "\n", indexStyle = isBeginningOfLine ? index : index - 1;
            this.removeStyleObject(isBeginningOfLine, indexStyle);
            this.text = this.text.slice(0, index - 1) + this.text.slice(index);
            this._textLines = this._splitTextIntoLines();
        },
        insertChars: function(_chars, useCopiedStyle) {
            var style;
            if (this.selectionEnd - this.selectionStart > 1) {
                this._removeCharsFromTo(this.selectionStart, this.selectionEnd);
                this.setSelectionEnd(this.selectionStart);
            }
            for (var i = 0, len = _chars.length; i < len; i++) {
                if (useCopiedStyle) {
                    style = fabric.copiedTextStyle[i];
                }
                this.insertChar(_chars[i], i < len - 1, style);
            }
        },
        insertChar: function(_char, skipUpdate, styleObject) {
            var isEndOfLine = this.text[this.selectionStart] === "\n";
            this.text = this.text.slice(0, this.selectionStart) + _char + this.text.slice(this.selectionEnd);
            this._textLines = this._splitTextIntoLines();
            this.insertStyleObjects(_char, isEndOfLine, styleObject);
            this.setSelectionStart(this.selectionStart + 1);
            this.setSelectionEnd(this.selectionStart);
            if (skipUpdate) {
                return;
            }
            this.canvas && this.canvas.renderAll();
            this.setCoords();
            this.fire("changed");
            this.canvas && this.canvas.fire("text:changed", {
                target: this
            });
        },
        insertNewlineStyleObject: function(lineIndex, charIndex, isEndOfLine) {
            this.shiftLineStyles(lineIndex, +1);
            if (!this.styles[lineIndex + 1]) {
                this.styles[lineIndex + 1] = {};
            }
            var currentCharStyle = {}, newLineStyles = {};
            if (this.styles[lineIndex] && this.styles[lineIndex][charIndex - 1]) {
                currentCharStyle = this.styles[lineIndex][charIndex - 1];
            }
            if (isEndOfLine) {
                newLineStyles[0] = clone(currentCharStyle);
                this.styles[lineIndex + 1] = newLineStyles;
            } else {
                for (var index in this.styles[lineIndex]) {
                    if (parseInt(index, 10) >= charIndex) {
                        newLineStyles[parseInt(index, 10) - charIndex] = this.styles[lineIndex][index];
                        delete this.styles[lineIndex][index];
                    }
                }
                this.styles[lineIndex + 1] = newLineStyles;
            }
            this._forceClearCache = true;
        },
        insertCharStyleObject: function(lineIndex, charIndex, style) {
            var currentLineStyles = this.styles[lineIndex], currentLineStylesCloned = clone(currentLineStyles);
            if (charIndex === 0 && !style) {
                charIndex = 1;
            }
            for (var index in currentLineStylesCloned) {
                var numericIndex = parseInt(index, 10);
                if (numericIndex >= charIndex) {
                    currentLineStyles[numericIndex + 1] = currentLineStylesCloned[numericIndex];
                    if (!currentLineStylesCloned[numericIndex - 1]) {
                        delete currentLineStyles[numericIndex];
                    }
                }
            }
            this.styles[lineIndex][charIndex] = style || clone(currentLineStyles[charIndex - 1]);
            this._forceClearCache = true;
        },
        insertStyleObjects: function(_chars, isEndOfLine, styleObject) {
            var cursorLocation = this.get2DCursorLocation(), lineIndex = cursorLocation.lineIndex, charIndex = cursorLocation.charIndex;
            if (!this._getLineStyle(lineIndex)) {
                this._setLineStyle(lineIndex, {});
            }
            if (_chars === "\n") {
                this.insertNewlineStyleObject(lineIndex, charIndex, isEndOfLine);
            } else {
                this.insertCharStyleObject(lineIndex, charIndex, styleObject);
            }
        },
        shiftLineStyles: function(lineIndex, offset) {
            var clonedStyles = clone(this.styles);
            for (var line in this.styles) {
                var numericLine = parseInt(line, 10);
                if (numericLine > lineIndex) {
                    this.styles[numericLine + offset] = clonedStyles[numericLine];
                    if (!clonedStyles[numericLine - offset]) {
                        delete this.styles[numericLine];
                    }
                }
            }
        },
        removeStyleObject: function(isBeginningOfLine, index) {
            var cursorLocation = this.get2DCursorLocation(index), lineIndex = cursorLocation.lineIndex, charIndex = cursorLocation.charIndex;
            if (isBeginningOfLine) {
                var textOnPreviousLine = this._textLines[lineIndex - 1], newCharIndexOnPrevLine = textOnPreviousLine ? textOnPreviousLine.length : 0;
                if (!this.styles[lineIndex - 1]) {
                    this.styles[lineIndex - 1] = {};
                }
                for (charIndex in this.styles[lineIndex]) {
                    this.styles[lineIndex - 1][parseInt(charIndex, 10) + newCharIndexOnPrevLine] = this.styles[lineIndex][charIndex];
                }
                this.shiftLineStyles(lineIndex, -1);
            } else {
                var currentLineStyles = this.styles[lineIndex];
                if (currentLineStyles) {
                    delete currentLineStyles[charIndex];
                }
                var currentLineStylesCloned = clone(currentLineStyles);
                for (var i in currentLineStylesCloned) {
                    var numericIndex = parseInt(i, 10);
                    if (numericIndex >= charIndex && numericIndex !== 0) {
                        currentLineStyles[numericIndex - 1] = currentLineStylesCloned[numericIndex];
                        delete currentLineStyles[numericIndex];
                    }
                }
            }
        },
        insertNewline: function() {
            this.insertChars("\n");
        }
    });
})();

fabric.util.object.extend(fabric.IText.prototype, {
    initDoubleClickSimulation: function() {
        this.__lastClickTime = +new Date();
        this.__lastLastClickTime = +new Date();
        this.__lastPointer = {};
        this.on("mousedown", this.onMouseDown.bind(this));
    },
    onMouseDown: function(options) {
        this.__newClickTime = +new Date();
        var newPointer = this.canvas.getPointer(options.e);
        if (this.isTripleClick(newPointer)) {
            this.fire("tripleclick", options);
            this._stopEvent(options.e);
        } else if (this.isDoubleClick(newPointer)) {
            this.fire("dblclick", options);
            this._stopEvent(options.e);
        }
        this.__lastLastClickTime = this.__lastClickTime;
        this.__lastClickTime = this.__newClickTime;
        this.__lastPointer = newPointer;
        this.__lastIsEditing = this.isEditing;
        this.__lastSelected = this.selected;
    },
    isDoubleClick: function(newPointer) {
        return this.__newClickTime - this.__lastClickTime < 500 && this.__lastPointer.x === newPointer.x && this.__lastPointer.y === newPointer.y && this.__lastIsEditing;
    },
    isTripleClick: function(newPointer) {
        return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === newPointer.x && this.__lastPointer.y === newPointer.y;
    },
    _stopEvent: function(e) {
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    },
    initCursorSelectionHandlers: function() {
        this.initSelectedHandler();
        this.initMousedownHandler();
        this.initMouseupHandler();
        this.initClicks();
    },
    initClicks: function() {
        this.on("dblclick", function(options) {
            this.selectWord(this.getSelectionStartFromPointer(options.e));
        });
        this.on("tripleclick", function(options) {
            this.selectLine(this.getSelectionStartFromPointer(options.e));
        });
    },
    initMousedownHandler: function() {
        this.on("mousedown", function(options) {
            var pointer = this.canvas.getPointer(options.e);
            this.__mousedownX = pointer.x;
            this.__mousedownY = pointer.y;
            this.__isMousedown = true;
            if (this.hiddenTextarea && this.canvas) {
                this.canvas.wrapperEl.appendChild(this.hiddenTextarea);
            }
            if (this.selected) {
                this.setCursorByClick(options.e);
            }
            if (this.isEditing) {
                this.__selectionStartOnMouseDown = this.selectionStart;
                this.initDelayedCursor(true);
            }
        });
    },
    _isObjectMoved: function(e) {
        var pointer = this.canvas.getPointer(e);
        return this.__mousedownX !== pointer.x || this.__mousedownY !== pointer.y;
    },
    initMouseupHandler: function() {
        this.on("mouseup", function(options) {
            this.__isMousedown = false;
            if (this._isObjectMoved(options.e)) {
                return;
            }
            if (this.__lastSelected) {
                this.enterEditing();
                this.initDelayedCursor(true);
            }
            this.selected = true;
        });
    },
    setCursorByClick: function(e) {
        var newSelectionStart = this.getSelectionStartFromPointer(e);
        if (e.shiftKey) {
            if (newSelectionStart < this.selectionStart) {
                this.setSelectionEnd(this.selectionStart);
                this.setSelectionStart(newSelectionStart);
            } else {
                this.setSelectionEnd(newSelectionStart);
            }
        } else {
            this.setSelectionStart(newSelectionStart);
            this.setSelectionEnd(newSelectionStart);
        }
    },
    getSelectionStartFromPointer: function(e) {
        var mouseOffset = this.getLocalPointer(e), prevWidth = 0, width = 0, height = 0, charIndex = 0, newSelectionStart, line;
        for (var i = 0, len = this._textLines.length; i < len; i++) {
            line = this._textLines[i];
            height += this._getHeightOfLine(this.ctx, i) * this.scaleY;
            var widthOfLine = this._getLineWidth(this.ctx, i), lineLeftOffset = this._getLineLeftOffset(widthOfLine);
            width = lineLeftOffset * this.scaleX;
            if (this.flipX) {
                this._textLines[i] = line.reverse().join("");
            }
            for (var j = 0, jlen = line.length; j < jlen; j++) {
                prevWidth = width;
                width += this._getWidthOfChar(this.ctx, line[j], i, this.flipX ? jlen - j : j) * this.scaleX;
                if (height <= mouseOffset.y || width <= mouseOffset.x) {
                    charIndex++;
                    continue;
                }
                return this._getNewSelectionStartFromOffset(mouseOffset, prevWidth, width, charIndex + i, jlen);
            }
            if (mouseOffset.y < height) {
                return this._getNewSelectionStartFromOffset(mouseOffset, prevWidth, width, charIndex + i - 1, jlen);
            }
        }
        if (typeof newSelectionStart === "undefined") {
            return this.text.length;
        }
    },
    _getNewSelectionStartFromOffset: function(mouseOffset, prevWidth, width, index, jlen) {
        var distanceBtwLastCharAndCursor = mouseOffset.x - prevWidth, distanceBtwNextCharAndCursor = width - mouseOffset.x, offset = distanceBtwNextCharAndCursor > distanceBtwLastCharAndCursor ? 0 : 1, newSelectionStart = index + offset;
        if (this.flipX) {
            newSelectionStart = jlen - newSelectionStart;
        }
        if (newSelectionStart > this.text.length) {
            newSelectionStart = this.text.length;
        }
        return newSelectionStart;
    }
});

fabric.util.object.extend(fabric.IText.prototype, {
    initHiddenTextarea: function() {
        this.hiddenTextarea = fabric.document.createElement("textarea");
        this.hiddenTextarea.setAttribute("autocapitalize", "off");
        this.hiddenTextarea.style.cssText = "position: fixed; bottom: 20px; left: 0px; opacity: 0;" + " width: 0px; height: 0px; z-index: -999;";
        fabric.document.body.appendChild(this.hiddenTextarea);
        fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this));
        if (!this._clickHandlerInitialized && this.canvas) {
            fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this));
            this._clickHandlerInitialized = true;
        }
    },
    _keysMap: {
        8: "removeChars",
        9: "exitEditing",
        27: "exitEditing",
        13: "insertNewline",
        33: "moveCursorUp",
        34: "moveCursorDown",
        35: "moveCursorRight",
        36: "moveCursorLeft",
        37: "moveCursorLeft",
        38: "moveCursorUp",
        39: "moveCursorRight",
        40: "moveCursorDown",
        46: "forwardDelete"
    },
    _ctrlKeysMap: {
        65: "selectAll",
        88: "cut"
    },
    onClick: function() {
        this.hiddenTextarea && this.hiddenTextarea.focus();
    },
    onKeyDown: function(e) {
        if (!this.isEditing) {
            return;
        }
        if (e.keyCode in this._keysMap) {
            this[this._keysMap[e.keyCode]](e);
        } else if (e.keyCode in this._ctrlKeysMap && (e.ctrlKey || e.metaKey)) {
            this[this._ctrlKeysMap[e.keyCode]](e);
        } else {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        this.canvas && this.canvas.renderAll();
    },
    onInput: function(e) {
        if (!this.isEditing || this._cancelOnInput) {
            this._cancelOnInput = false;
            return;
        }
        var offset = this.selectionStart || 0, textLength = this.text.length, newTextLength = this.hiddenTextarea.value.length, diff = newTextLength - textLength, charsToInsert = this.hiddenTextarea.value.slice(offset, offset + diff);
        this.insertChars(charsToInsert);
        e.stopPropagation();
    },
    forwardDelete: function(e) {
        if (this.selectionStart === this.selectionEnd) {
            if (this.selectionStart === this.text.length) {
                return;
            }
            this.moveCursorRight(e);
        }
        this.removeChars(e);
    },
    copy: function(e) {
        var selectedText = this.getSelectedText(), clipboardData = this._getClipboardData(e);
        if (clipboardData) {
            clipboardData.setData("text", selectedText);
        }
        fabric.copiedText = selectedText;
        fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd);
    },
    paste: function(e) {
        var copiedText = null, clipboardData = this._getClipboardData(e), useCopiedStyle = true;
        if (clipboardData) {
            copiedText = clipboardData.getData("text").replace(/\r/g, "");
            if (!fabric.copiedTextStyle || fabric.copiedText !== copiedText) {
                useCopiedStyle = false;
            }
        } else {
            copiedText = fabric.copiedText;
        }
        if (copiedText) {
            this.insertChars(copiedText, useCopiedStyle);
        }
        this._cancelOnInput = true;
    },
    cut: function(e) {
        if (this.selectionStart === this.selectionEnd) {
            return;
        }
        this.copy();
        this.removeChars(e);
    },
    _getClipboardData: function(e) {
        return e && (e.clipboardData || fabric.window.clipboardData);
    },
    getDownCursorOffset: function(e, isRight) {
        var selectionProp = isRight ? this.selectionEnd : this.selectionStart, cursorLocation = this.get2DCursorLocation(selectionProp), _char, lineLeftOffset, lineIndex = cursorLocation.lineIndex, textOnSameLineBeforeCursor = this._textLines[lineIndex].slice(0, cursorLocation.charIndex), textOnSameLineAfterCursor = this._textLines[lineIndex].slice(cursorLocation.charIndex), textOnNextLine = this._textLines[lineIndex + 1] || "";
        if (lineIndex === this._textLines.length - 1 || e.metaKey || e.keyCode === 34) {
            return this.text.length - selectionProp;
        }
        var widthOfSameLineBeforeCursor = this._getLineWidth(this.ctx, lineIndex);
        lineLeftOffset = this._getLineLeftOffset(widthOfSameLineBeforeCursor);
        var widthOfCharsOnSameLineBeforeCursor = lineLeftOffset;
        for (var i = 0, len = textOnSameLineBeforeCursor.length; i < len; i++) {
            _char = textOnSameLineBeforeCursor[i];
            widthOfCharsOnSameLineBeforeCursor += this._getWidthOfChar(this.ctx, _char, lineIndex, i);
        }
        var indexOnNextLine = this._getIndexOnNextLine(cursorLocation, textOnNextLine, widthOfCharsOnSameLineBeforeCursor);
        return textOnSameLineAfterCursor.length + 1 + indexOnNextLine;
    },
    _getIndexOnNextLine: function(cursorLocation, textOnNextLine, widthOfCharsOnSameLineBeforeCursor) {
        var lineIndex = cursorLocation.lineIndex + 1, widthOfNextLine = this._getLineWidth(this.ctx, lineIndex), lineLeftOffset = this._getLineLeftOffset(widthOfNextLine), widthOfCharsOnNextLine = lineLeftOffset, indexOnNextLine = 0, foundMatch;
        for (var j = 0, jlen = textOnNextLine.length; j < jlen; j++) {
            var _char = textOnNextLine[j], widthOfChar = this._getWidthOfChar(this.ctx, _char, lineIndex, j);
            widthOfCharsOnNextLine += widthOfChar;
            if (widthOfCharsOnNextLine > widthOfCharsOnSameLineBeforeCursor) {
                foundMatch = true;
                var leftEdge = widthOfCharsOnNextLine - widthOfChar, rightEdge = widthOfCharsOnNextLine, offsetFromLeftEdge = Math.abs(leftEdge - widthOfCharsOnSameLineBeforeCursor), offsetFromRightEdge = Math.abs(rightEdge - widthOfCharsOnSameLineBeforeCursor);
                indexOnNextLine = offsetFromRightEdge < offsetFromLeftEdge ? j + 1 : j;
                break;
            }
        }
        if (!foundMatch) {
            indexOnNextLine = textOnNextLine.length;
        }
        return indexOnNextLine;
    },
    moveCursorDown: function(e) {
        this.abortCursorAnimation();
        this._currentCursorOpacity = 1;
        var offset = this.getDownCursorOffset(e, this._selectionDirection === "right");
        if (e.shiftKey) {
            this.moveCursorDownWithShift(offset);
        } else {
            this.moveCursorDownWithoutShift(offset);
        }
        this.initDelayedCursor();
    },
    moveCursorDownWithoutShift: function(offset) {
        this._selectionDirection = "right";
        this.setSelectionStart(this.selectionStart + offset);
        this.setSelectionEnd(this.selectionStart);
    },
    swapSelectionPoints: function() {
        var swapSel = this.selectionEnd;
        this.setSelectionEnd(this.selectionStart);
        this.setSelectionStart(swapSel);
    },
    moveCursorDownWithShift: function(offset) {
        if (this.selectionEnd === this.selectionStart) {
            this._selectionDirection = "right";
        }
        if (this._selectionDirection === "right") {
            this.setSelectionEnd(this.selectionEnd + offset);
        } else {
            this.setSelectionStart(this.selectionStart + offset);
        }
        if (this.selectionEnd < this.selectionStart && this._selectionDirection === "left") {
            this.swapSelectionPoints();
            this._selectionDirection = "right";
        }
        if (this.selectionEnd > this.text.length) {
            this.setSelectionEnd(this.text.length);
        }
    },
    getUpCursorOffset: function(e, isRight) {
        var selectionProp = isRight ? this.selectionEnd : this.selectionStart, cursorLocation = this.get2DCursorLocation(selectionProp), lineIndex = cursorLocation.lineIndex;
        if (lineIndex === 0 || e.metaKey || e.keyCode === 33) {
            return selectionProp;
        }
        var textOnSameLineBeforeCursor = this._textLines[lineIndex].slice(0, cursorLocation.charIndex), textOnPreviousLine = this._textLines[lineIndex - 1] || "", _char, widthOfSameLineBeforeCursor = this._getLineWidth(this.ctx, cursorLocation.lineIndex), lineLeftOffset = this._getLineLeftOffset(widthOfSameLineBeforeCursor), widthOfCharsOnSameLineBeforeCursor = lineLeftOffset;
        for (var i = 0, len = textOnSameLineBeforeCursor.length; i < len; i++) {
            _char = textOnSameLineBeforeCursor[i];
            widthOfCharsOnSameLineBeforeCursor += this._getWidthOfChar(this.ctx, _char, lineIndex, i);
        }
        var indexOnPrevLine = this._getIndexOnPrevLine(cursorLocation, textOnPreviousLine, widthOfCharsOnSameLineBeforeCursor);
        return textOnPreviousLine.length - indexOnPrevLine + textOnSameLineBeforeCursor.length;
    },
    _getIndexOnPrevLine: function(cursorLocation, textOnPreviousLine, widthOfCharsOnSameLineBeforeCursor) {
        var lineIndex = cursorLocation.lineIndex - 1, widthOfPreviousLine = this._getLineWidth(this.ctx, lineIndex), lineLeftOffset = this._getLineLeftOffset(widthOfPreviousLine), widthOfCharsOnPreviousLine = lineLeftOffset, indexOnPrevLine = 0, foundMatch;
        for (var j = 0, jlen = textOnPreviousLine.length; j < jlen; j++) {
            var _char = textOnPreviousLine[j], widthOfChar = this._getWidthOfChar(this.ctx, _char, lineIndex, j);
            widthOfCharsOnPreviousLine += widthOfChar;
            if (widthOfCharsOnPreviousLine > widthOfCharsOnSameLineBeforeCursor) {
                foundMatch = true;
                var leftEdge = widthOfCharsOnPreviousLine - widthOfChar, rightEdge = widthOfCharsOnPreviousLine, offsetFromLeftEdge = Math.abs(leftEdge - widthOfCharsOnSameLineBeforeCursor), offsetFromRightEdge = Math.abs(rightEdge - widthOfCharsOnSameLineBeforeCursor);
                indexOnPrevLine = offsetFromRightEdge < offsetFromLeftEdge ? j : j - 1;
                break;
            }
        }
        if (!foundMatch) {
            indexOnPrevLine = textOnPreviousLine.length - 1;
        }
        return indexOnPrevLine;
    },
    moveCursorUp: function(e) {
        this.abortCursorAnimation();
        this._currentCursorOpacity = 1;
        var offset = this.getUpCursorOffset(e, this._selectionDirection === "right");
        if (e.shiftKey) {
            this.moveCursorUpWithShift(offset);
        } else {
            this.moveCursorUpWithoutShift(offset);
        }
        this.initDelayedCursor();
    },
    moveCursorUpWithShift: function(offset) {
        if (this.selectionEnd === this.selectionStart) {
            this._selectionDirection = "left";
        }
        if (this._selectionDirection === "right") {
            this.setSelectionEnd(this.selectionEnd - offset);
        } else {
            this.setSelectionStart(this.selectionStart - offset);
        }
        if (this.selectionEnd < this.selectionStart && this._selectionDirection === "right") {
            this.swapSelectionPoints();
            this._selectionDirection = "left";
        }
    },
    moveCursorUpWithoutShift: function(offset) {
        if (this.selectionStart === this.selectionEnd) {
            this.setSelectionStart(this.selectionStart - offset);
        }
        this.setSelectionEnd(this.selectionStart);
        this._selectionDirection = "left";
    },
    moveCursorLeft: function(e) {
        if (this.selectionStart === 0 && this.selectionEnd === 0) {
            return;
        }
        this.abortCursorAnimation();
        this._currentCursorOpacity = 1;
        if (e.shiftKey) {
            this.moveCursorLeftWithShift(e);
        } else {
            this.moveCursorLeftWithoutShift(e);
        }
        this.initDelayedCursor();
    },
    _move: function(e, prop, direction) {
        var propMethod = prop === "selectionStart" ? "setSelectionStart" : "setSelectionEnd";
        if (e.altKey) {
            this[propMethod](this["findWordBoundary" + direction](this[prop]));
        } else if (e.metaKey || e.keyCode === 35 || e.keyCode === 36) {
            this[propMethod](this["findLineBoundary" + direction](this[prop]));
        } else {
            this[propMethod](this[prop] + (direction === "Left" ? -1 : 1));
        }
    },
    _moveLeft: function(e, prop) {
        this._move(e, prop, "Left");
    },
    _moveRight: function(e, prop) {
        this._move(e, prop, "Right");
    },
    moveCursorLeftWithoutShift: function(e) {
        this._selectionDirection = "left";
        if (this.selectionEnd === this.selectionStart) {
            this._moveLeft(e, "selectionStart");
        }
        this.setSelectionEnd(this.selectionStart);
    },
    moveCursorLeftWithShift: function(e) {
        if (this._selectionDirection === "right" && this.selectionStart !== this.selectionEnd) {
            this._moveLeft(e, "selectionEnd");
        } else {
            this._selectionDirection = "left";
            this._moveLeft(e, "selectionStart");
        }
    },
    moveCursorRight: function(e) {
        if (this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length) {
            return;
        }
        this.abortCursorAnimation();
        this._currentCursorOpacity = 1;
        if (e.shiftKey) {
            this.moveCursorRightWithShift(e);
        } else {
            this.moveCursorRightWithoutShift(e);
        }
        this.initDelayedCursor();
    },
    moveCursorRightWithShift: function(e) {
        if (this._selectionDirection === "left" && this.selectionStart !== this.selectionEnd) {
            this._moveRight(e, "selectionStart");
        } else {
            this._selectionDirection = "right";
            this._moveRight(e, "selectionEnd");
        }
    },
    moveCursorRightWithoutShift: function(e) {
        this._selectionDirection = "right";
        if (this.selectionStart === this.selectionEnd) {
            this._moveRight(e, "selectionStart");
            this.setSelectionEnd(this.selectionStart);
        } else {
            this.setSelectionEnd(this.selectionEnd + this.getNumNewLinesInSelectedText());
            this.setSelectionStart(this.selectionEnd);
        }
    },
    removeChars: function(e) {
        if (this.selectionStart === this.selectionEnd) {
            this._removeCharsNearCursor(e);
        } else {
            this._removeCharsFromTo(this.selectionStart, this.selectionEnd);
        }
        this.setSelectionEnd(this.selectionStart);
        this._removeExtraneousStyles();
        this.canvas && this.canvas.renderAll();
        this.setCoords();
        this.fire("changed");
        this.canvas && this.canvas.fire("text:changed", {
            target: this
        });
    },
    _removeCharsNearCursor: function(e) {
        if (this.selectionStart === 0) {
            return;
        }
        if (e.metaKey) {
            var leftLineBoundary = this.findLineBoundaryLeft(this.selectionStart);
            this._removeCharsFromTo(leftLineBoundary, this.selectionStart);
            this.setSelectionStart(leftLineBoundary);
        } else if (e.altKey) {
            var leftWordBoundary = this.findWordBoundaryLeft(this.selectionStart);
            this._removeCharsFromTo(leftWordBoundary, this.selectionStart);
            this.setSelectionStart(leftWordBoundary);
        } else {
            this._removeSingleCharAndStyle(this.selectionStart);
            this.setSelectionStart(this.selectionStart - 1);
        }
    }
});

(function() {
    var toFixed = fabric.util.toFixed, NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
    fabric.util.object.extend(fabric.IText.prototype, {
        _setSVGTextLineText: function(lineIndex, textSpans, height, textLeftOffset, textTopOffset, textBgRects) {
            if (!this.styles[lineIndex]) {
                fabric.Text.prototype._setSVGTextLineText.call(this, lineIndex, textSpans, height, textLeftOffset, textTopOffset);
            } else {
                this._setSVGTextLineChars(lineIndex, textSpans, height, textLeftOffset, textBgRects);
            }
        },
        _setSVGTextLineChars: function(lineIndex, textSpans, height, textLeftOffset, textBgRects) {
            var chars = this._textLines[lineIndex], charOffset = 0, lineLeftOffset = this._getSVGLineLeftOffset(lineIndex) - this.width / 2, lineOffset = this._getSVGLineTopOffset(lineIndex), heightOfLine = this._getHeightOfLine(this.ctx, lineIndex);
            for (var i = 0, len = chars.length; i < len; i++) {
                var styleDecl = this.styles[lineIndex][i] || {};
                textSpans.push(this._createTextCharSpan(chars[i], styleDecl, lineLeftOffset, lineOffset.lineTop + lineOffset.offset, charOffset));
                var charWidth = this._getWidthOfChar(this.ctx, chars[i], lineIndex, i);
                if (styleDecl.textBackgroundColor) {
                    textBgRects.push(this._createTextCharBg(styleDecl, lineLeftOffset, lineOffset.lineTop, heightOfLine, charWidth, charOffset));
                }
                charOffset += charWidth;
            }
        },
        _getSVGLineLeftOffset: function(lineIndex) {
            return fabric.util.toFixed(this._getLineLeftOffset(this.__lineWidths[lineIndex]), 2);
        },
        _getSVGLineTopOffset: function(lineIndex) {
            var lineTopOffset = 0, lastHeight = 0;
            for (var j = 0; j < lineIndex; j++) {
                lineTopOffset += this._getHeightOfLine(this.ctx, j);
            }
            lastHeight = this._getHeightOfLine(this.ctx, j);
            return {
                lineTop: lineTopOffset,
                offset: (this._fontSizeMult - this._fontSizeFraction) * lastHeight / (this.lineHeight * this._fontSizeMult)
            };
        },
        _createTextCharBg: function(styleDecl, lineLeftOffset, lineTopOffset, heightOfLine, charWidth, charOffset) {
            return [ '<rect fill="', styleDecl.textBackgroundColor, '" x="', toFixed(lineLeftOffset + charOffset, NUM_FRACTION_DIGITS), '" y="', toFixed(lineTopOffset - this.height / 2, NUM_FRACTION_DIGITS), '" width="', toFixed(charWidth, NUM_FRACTION_DIGITS), '" height="', toFixed(heightOfLine / this.lineHeight, NUM_FRACTION_DIGITS), '"></rect>' ].join("");
        },
        _createTextCharSpan: function(_char, styleDecl, lineLeftOffset, lineTopOffset, charOffset) {
            var fillStyles = this.getSvgStyles.call(fabric.util.object.extend({
                visible: true,
                fill: this.fill,
                stroke: this.stroke,
                type: "text"
            }, styleDecl));
            return [ '<tspan x="', lineLeftOffset + charOffset, '" y="', lineTopOffset - this.height / 2, '" ', styleDecl.fontFamily ? 'font-family="' + styleDecl.fontFamily.replace(/"/g, "'") + '" ' : "", styleDecl.fontSize ? 'font-size="' + styleDecl.fontSize + '" ' : "", styleDecl.fontStyle ? 'font-style="' + styleDecl.fontStyle + '" ' : "", styleDecl.fontWeight ? 'font-weight="' + styleDecl.fontWeight + '" ' : "", styleDecl.textDecoration ? 'text-decoration="' + styleDecl.textDecoration + '" ' : "", 'style="', fillStyles, '">', fabric.util.string.escapeXml(_char), "</tspan>" ].join("");
        }
    });
})();

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), clone = fabric.util.object.clone;
    fabric.Textbox = fabric.util.createClass(fabric.IText, fabric.Observable, {
        type: "textbox",
        minWidth: 20,
        dynamicMinWidth: 0,
        __cachedLines: null,
        initialize: function(text, options) {
            this.ctx = fabric.util.createCanvasElement().getContext("2d");
            this.callSuper("initialize", text, options);
            this.set({
                lockUniScaling: false,
                lockScalingY: true,
                lockScalingFlip: true,
                hasBorders: true
            });
            this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());
            this._dimensionAffectingProps.width = true;
        },
        _initDimensions: function(ctx) {
            if (this.__skipDimension) {
                return;
            }
            if (!ctx) {
                ctx = fabric.util.createCanvasElement().getContext("2d");
                this._setTextStyles(ctx);
            }
            this.dynamicMinWidth = 0;
            this._textLines = this._splitTextIntoLines();
            if (this.dynamicMinWidth > this.width) {
                this._set("width", this.dynamicMinWidth);
            }
            this._clearCache();
            this.height = this._getTextHeight(ctx);
            this._setLineWidths();
        },
        _setLineWidths: function() {
            for (var i = 0, len = this._textLines.length; i < len; i++) {
                this.__lineWidths[i] = this.width;
            }
        },
        _generateStyleMap: function() {
            var realLineCount = 0, realLineCharCount = 0, charCount = 0, map = {};
            for (var i = 0; i < this._textLines.length; i++) {
                if (this.text[charCount] === "\n") {
                    realLineCharCount = 0;
                    charCount++;
                    realLineCount++;
                } else if (this.text[charCount] === " ") {
                    realLineCharCount++;
                    charCount++;
                }
                map[i] = {
                    line: realLineCount,
                    offset: realLineCharCount
                };
                charCount += this._textLines[i].length;
                realLineCharCount += this._textLines[i].length;
            }
            return map;
        },
        _getStyleDeclaration: function(lineIndex, charIndex, returnCloneOrEmpty) {
            if (this._styleMap) {
                var map = this._styleMap[lineIndex];
                lineIndex = map.line;
                charIndex = map.offset + charIndex;
            }
            if (returnCloneOrEmpty) {
                return this.styles[lineIndex] && this.styles[lineIndex][charIndex] ? clone(this.styles[lineIndex][charIndex]) : {};
            }
            return this.styles[lineIndex] && this.styles[lineIndex][charIndex] ? this.styles[lineIndex][charIndex] : null;
        },
        _setStyleDeclaration: function(lineIndex, charIndex, style) {
            var map = this._styleMap[lineIndex];
            lineIndex = map.line;
            charIndex = map.offset + charIndex;
            this.styles[lineIndex][charIndex] = style;
        },
        _deleteStyleDeclaration: function(lineIndex, charIndex) {
            var map = this._styleMap[lineIndex];
            lineIndex = map.line;
            charIndex = map.offset + charIndex;
            delete this.styles[lineIndex][charIndex];
        },
        _getLineStyle: function(lineIndex) {
            var map = this._styleMap[lineIndex];
            return this.styles[map.line];
        },
        _setLineStyle: function(lineIndex, style) {
            var map = this._styleMap[lineIndex];
            this.styles[map.line] = style;
        },
        _deleteLineStyle: function(lineIndex) {
            var map = this._styleMap[lineIndex];
            delete this.styles[map.line];
        },
        _wrapText: function(ctx, text) {
            var lines = text.split(this._reNewline), wrapped = [], i;
            for (i = 0; i < lines.length; i++) {
                wrapped = wrapped.concat(this._wrapLine(ctx, lines[i], i));
            }
            return wrapped;
        },
        _measureText: function(ctx, text, lineIndex, charOffset) {
            var width = 0, decl;
            charOffset = charOffset || 0;
            for (var i = 0; i < text.length; i++) {
                if (this.styles && this.styles[lineIndex] && (decl = this.styles[lineIndex][i + charOffset])) {
                    ctx.save();
                    width += this._applyCharStylesGetWidth(ctx, text[i], lineIndex, i, decl);
                    ctx.restore();
                } else {
                    width += this._applyCharStylesGetWidth(ctx, text[i], lineIndex, i, {});
                }
            }
            return width;
        },
        _wrapLine: function(ctx, text, lineIndex) {
            var maxWidth = this.width, lineWidth = this._measureText(ctx, text, lineIndex, 0);
            if (lineWidth < maxWidth) {
                if (text.indexOf(" ") === -1 && lineWidth > this.dynamicMinWidth) {
                    this.dynamicMinWidth = lineWidth;
                }
                return [ text ];
            }
            var lines = [], line = "", words = text.split(" "), offset = 0, infix = "", wordWidth = 0, largestWordWidth = 0;
            while (words.length > 0) {
                infix = line === "" ? "" : " ";
                wordWidth = this._measureText(ctx, words[0], lineIndex, line.length + infix.length + offset);
                lineWidth = line === "" ? wordWidth : this._measureText(ctx, line + infix + words[0], lineIndex, offset);
                if (lineWidth < maxWidth || line === "" && wordWidth >= maxWidth) {
                    line += infix + words.shift();
                } else {
                    offset += line.length + 1;
                    lines.push(line);
                    line = "";
                }
                if (words.length === 0) {
                    lines.push(line);
                }
                if (wordWidth > largestWordWidth) {
                    largestWordWidth = wordWidth;
                }
            }
            if (largestWordWidth > this.dynamicMinWidth) {
                this.dynamicMinWidth = largestWordWidth;
            }
            return lines;
        },
        _splitTextIntoLines: function() {
            this.ctx.save();
            this._setTextStyles(this.ctx);
            var lines = this._wrapText(this.ctx, this.text);
            this.ctx.restore();
            this._textLines = lines;
            this._styleMap = this._generateStyleMap();
            return lines;
        },
        setOnGroup: function(key, value) {
            if (key === "scaleX") {
                this.set("scaleX", Math.abs(1 / value));
                this.set("width", this.get("width") * value / (typeof this.__oldScaleX === "undefined" ? 1 : this.__oldScaleX));
                this.__oldScaleX = value;
            }
        },
        get2DCursorLocation: function(selectionStart) {
            if (typeof selectionStart === "undefined") {
                selectionStart = this.selectionStart;
            }
            var numLines = this._textLines.length, removed = 0;
            for (var i = 0; i < numLines; i++) {
                var line = this._textLines[i], lineLen = line.length;
                if (selectionStart <= removed + lineLen) {
                    return {
                        lineIndex: i,
                        charIndex: selectionStart - removed
                    };
                }
                removed += lineLen;
                if (this.text[removed] === "\n" || this.text[removed] === " ") {
                    removed++;
                }
            }
            return {
                lineIndex: numLines - 1,
                charIndex: this._textLines[numLines - 1].length
            };
        },
        _getCursorBoundariesOffsets: function(chars, typeOfBoundaries) {
            var topOffset = 0, leftOffset = 0, cursorLocation = this.get2DCursorLocation(), lineChars = this._textLines[cursorLocation.lineIndex].split(""), lineLeftOffset = this._getCachedLineOffset(cursorLocation.lineIndex);
            for (var i = 0; i < cursorLocation.charIndex; i++) {
                leftOffset += this._getWidthOfChar(this.ctx, lineChars[i], cursorLocation.lineIndex, i);
            }
            for (i = 0; i < cursorLocation.lineIndex; i++) {
                topOffset += this._getHeightOfLine(this.ctx, i);
            }
            if (typeOfBoundaries === "cursor") {
                topOffset += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, cursorLocation.lineIndex) / this.lineHeight - this.getCurrentCharFontSize(cursorLocation.lineIndex, cursorLocation.charIndex) * (1 - this._fontSizeFraction);
            }
            return {
                top: topOffset,
                left: leftOffset,
                lineLeft: lineLeftOffset
            };
        },
        getMinWidth: function() {
            return Math.max(this.minWidth, this.dynamicMinWidth);
        },
        toObject: function(propertiesToInclude) {
            return fabric.util.object.extend(this.callSuper("toObject", propertiesToInclude), {
                minWidth: this.minWidth
            });
        }
    });
    fabric.Textbox.fromObject = function(object) {
        return new fabric.Textbox(object.text, clone(object));
    };
    fabric.Textbox.getTextboxControlVisibility = function() {
        return {
            tl: false,
            tr: false,
            br: false,
            bl: false,
            ml: true,
            mt: false,
            mr: true,
            mb: false,
            mtr: true
        };
    };
    fabric.Textbox.instances = [];
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var setObjectScaleOverridden = fabric.Canvas.prototype._setObjectScale;
    fabric.Canvas.prototype._setObjectScale = function(localMouse, transform, lockScalingX, lockScalingY, by, lockScalingFlip) {
        var t = transform.target;
        if (t instanceof fabric.Textbox) {
            var w = t.width * (localMouse.x / transform.scaleX / (t.width + t.strokeWidth));
            if (w >= t.getMinWidth()) {
                t.set("width", w);
            }
        } else {
            setObjectScaleOverridden.call(fabric.Canvas.prototype, localMouse, transform, lockScalingX, lockScalingY, by, lockScalingFlip);
        }
    };
    fabric.Group.prototype._refreshControlsVisibility = function() {
        if (typeof fabric.Textbox === "undefined") {
            return;
        }
        for (var i = this._objects.length; i--; ) {
            if (this._objects[i] instanceof fabric.Textbox) {
                this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());
                return;
            }
        }
    };
    var clone = fabric.util.object.clone;
    fabric.util.object.extend(fabric.Textbox.prototype, {
        _removeExtraneousStyles: function() {
            for (var prop in this._styleMap) {
                if (!this._textLines[prop]) {
                    delete this.styles[this._styleMap[prop].line];
                }
            }
        },
        insertCharStyleObject: function(lineIndex, charIndex, style) {
            var map = this._styleMap[lineIndex];
            lineIndex = map.line;
            charIndex = map.offset + charIndex;
            fabric.IText.prototype.insertCharStyleObject.apply(this, [ lineIndex, charIndex, style ]);
        },
        insertNewlineStyleObject: function(lineIndex, charIndex, isEndOfLine) {
            var map = this._styleMap[lineIndex];
            lineIndex = map.line;
            charIndex = map.offset + charIndex;
            fabric.IText.prototype.insertNewlineStyleObject.apply(this, [ lineIndex, charIndex, isEndOfLine ]);
        },
        shiftLineStyles: function(lineIndex, offset) {
            var clonedStyles = clone(this.styles), map = this._styleMap[lineIndex];
            lineIndex = map.line;
            for (var line in this.styles) {
                var numericLine = parseInt(line, 10);
                if (numericLine > lineIndex) {
                    this.styles[numericLine + offset] = clonedStyles[numericLine];
                    if (!clonedStyles[numericLine - offset]) {
                        delete this.styles[numericLine];
                    }
                }
            }
        },
        _getTextOnPreviousLine: function(lIndex) {
            var textOnPreviousLine = this._textLines[lIndex - 1];
            while (this._styleMap[lIndex - 2] && this._styleMap[lIndex - 2].line === this._styleMap[lIndex - 1].line) {
                textOnPreviousLine = this._textLines[lIndex - 2] + textOnPreviousLine;
                lIndex--;
            }
            return textOnPreviousLine;
        },
        removeStyleObject: function(isBeginningOfLine, index) {
            var cursorLocation = this.get2DCursorLocation(index), map = this._styleMap[cursorLocation.lineIndex], lineIndex = map.line, charIndex = map.offset + cursorLocation.charIndex;
            if (isBeginningOfLine) {
                var textOnPreviousLine = this._getTextOnPreviousLine(cursorLocation.lineIndex), newCharIndexOnPrevLine = textOnPreviousLine ? textOnPreviousLine.length : 0;
                if (!this.styles[lineIndex - 1]) {
                    this.styles[lineIndex - 1] = {};
                }
                for (charIndex in this.styles[lineIndex]) {
                    this.styles[lineIndex - 1][parseInt(charIndex, 10) + newCharIndexOnPrevLine] = this.styles[lineIndex][charIndex];
                }
                this.shiftLineStyles(cursorLocation.lineIndex, -1);
            } else {
                var currentLineStyles = this.styles[lineIndex];
                if (currentLineStyles) {
                    delete currentLineStyles[charIndex];
                }
                var currentLineStylesCloned = clone(currentLineStyles);
                for (var i in currentLineStylesCloned) {
                    var numericIndex = parseInt(i, 10);
                    if (numericIndex >= charIndex && numericIndex !== 0) {
                        currentLineStyles[numericIndex - 1] = currentLineStylesCloned[numericIndex];
                        delete currentLineStyles[numericIndex];
                    }
                }
            }
        }
    });
})();

(function() {
    var override = fabric.IText.prototype._getNewSelectionStartFromOffset;
    fabric.IText.prototype._getNewSelectionStartFromOffset = function(mouseOffset, prevWidth, width, index, jlen) {
        index = override.call(this, mouseOffset, prevWidth, width, index, jlen);
        var tmp = 0, removed = 0;
        for (var i = 0; i < this._textLines.length; i++) {
            tmp += this._textLines[i].length;
            if (tmp + removed >= index) {
                break;
            }
            if (this.text[tmp + removed] === "\n" || this.text[tmp + removed] === " ") {
                removed++;
            }
        }
        return index - i + removed;
    };
})();

(function() {
    if (typeof document !== "undefined" && typeof window !== "undefined") {
        return;
    }
    var DOMParser = require("xmldom").DOMParser, URL = require("url"), HTTP = require("http"), HTTPS = require("https"), Canvas = require("canvas"), Image = require("canvas").Image;
    function request(url, encoding, callback) {
        var oURL = URL.parse(url);
        if (!oURL.port) {
            oURL.port = oURL.protocol.indexOf("https:") === 0 ? 443 : 80;
        }
        var reqHandler = oURL.protocol.indexOf("https:") === 0 ? HTTPS : HTTP, req = reqHandler.request({
            hostname: oURL.hostname,
            port: oURL.port,
            path: oURL.path,
            method: "GET"
        }, function(response) {
            var body = "";
            if (encoding) {
                response.setEncoding(encoding);
            }
            response.on("end", function() {
                callback(body);
            });
            response.on("data", function(chunk) {
                if (response.statusCode === 200) {
                    body += chunk;
                }
            });
        });
        req.on("error", function(err) {
            if (err.errno === process.ECONNREFUSED) {
                fabric.log("ECONNREFUSED: connection refused to " + oURL.hostname + ":" + oURL.port);
            } else {
                fabric.log(err.message);
            }
            callback(null);
        });
        req.end();
    }
    function requestFs(path, callback) {
        var fs = require("fs");
        fs.readFile(path, function(err, data) {
            if (err) {
                fabric.log(err);
                throw err;
            } else {
                callback(data);
            }
        });
    }
    fabric.util.loadImage = function(url, callback, context) {
        function createImageAndCallBack(data) {
            if (data) {
                img.src = new Buffer(data, "binary");
                img._src = url;
                callback && callback.call(context, img);
            } else {
                img = null;
                callback && callback.call(context, null, true);
            }
        }
        var img = new Image();
        if (url && (url instanceof Buffer || url.indexOf("data") === 0)) {
            img.src = img._src = url;
            callback && callback.call(context, img);
        } else if (url && url.indexOf("http") !== 0) {
            requestFs(url, createImageAndCallBack);
        } else if (url) {
            request(url, "binary", createImageAndCallBack);
        } else {
            callback && callback.call(context, url);
        }
    };
    fabric.loadSVGFromURL = function(url, callback, reviver) {
        url = url.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim();
        if (url.indexOf("http") !== 0) {
            requestFs(url, function(body) {
                fabric.loadSVGFromString(body.toString(), callback, reviver);
            });
        } else {
            request(url, "", function(body) {
                fabric.loadSVGFromString(body, callback, reviver);
            });
        }
    };
    fabric.loadSVGFromString = function(string, callback, reviver) {
        var doc = new DOMParser().parseFromString(string);
        fabric.parseSVGDocument(doc.documentElement, function(results, options) {
            callback && callback(results, options);
        }, reviver);
    };
    fabric.util.getScript = function(url, callback) {
        request(url, "", function(body) {
            eval(body);
            callback && callback();
        });
    };
    fabric.Image.fromObject = function(object, callback) {
        fabric.util.loadImage(object.src, function(img) {
            var oImg = new fabric.Image(img);
            oImg._initConfig(object);
            oImg._initFilters(object.filters, function(filters) {
                oImg.filters = filters || [];
                oImg._initFilters(object.resizeFilters, function(resizeFilters) {
                    oImg.resizeFilters = resizeFilters || [];
                    callback && callback(oImg);
                });
            });
        });
    };
    fabric.createCanvasForNode = function(width, height, options, nodeCanvasOptions) {
        nodeCanvasOptions = nodeCanvasOptions || options;
        var canvasEl = fabric.document.createElement("canvas"), nodeCanvas = new Canvas(width || 600, height || 600, nodeCanvasOptions);
        canvasEl.style = {};
        canvasEl.width = nodeCanvas.width;
        canvasEl.height = nodeCanvas.height;
        var FabricCanvas = fabric.Canvas || fabric.StaticCanvas, fabricCanvas = new FabricCanvas(canvasEl, options);
        fabricCanvas.contextContainer = nodeCanvas.getContext("2d");
        fabricCanvas.nodeCanvas = nodeCanvas;
        fabricCanvas.Font = Canvas.Font;
        return fabricCanvas;
    };
    fabric.StaticCanvas.prototype.createPNGStream = function() {
        return this.nodeCanvas.createPNGStream();
    };
    fabric.StaticCanvas.prototype.createJPEGStream = function(opts) {
        return this.nodeCanvas.createJPEGStream(opts);
    };
    var origSetWidth = fabric.StaticCanvas.prototype.setWidth;
    fabric.StaticCanvas.prototype.setWidth = function(width, options) {
        origSetWidth.call(this, width, options);
        this.nodeCanvas.width = width;
        return this;
    };
    if (fabric.Canvas) {
        fabric.Canvas.prototype.setWidth = fabric.StaticCanvas.prototype.setWidth;
    }
    var origSetHeight = fabric.StaticCanvas.prototype.setHeight;
    fabric.StaticCanvas.prototype.setHeight = function(height, options) {
        origSetHeight.call(this, height, options);
        this.nodeCanvas.height = height;
        return this;
    };
    if (fabric.Canvas) {
        fabric.Canvas.prototype.setHeight = fabric.StaticCanvas.prototype.setHeight;
    }
})();

window.fabric = fabric;

if (typeof define === "function" && define.amd) {
    define([], function() {
        return fabric;
    });
}