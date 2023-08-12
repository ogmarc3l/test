/*
 The MIT License (MIT)
 @todo Lazy Load Icon
 @todo prevent animationend bubling
 @todo itemsScaleUp
 @todo Test Zepto
 @todo stagePadding calculate wrong active classes
 The MIT License (MIT)
*/
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function(c, k, l) {
    c instanceof String && (c = String(c));
    for (var m = c.length, e = 0; e < m; e++) {
        var a = c[e];
        if (k.call(l, a, e, c))
            return {
                i: e,
                v: a
            }
    }
    return {
        i: -1,
        v: void 0
    }
}
;
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(c, k, l) {
    if (c == Array.prototype || c == Object.prototype)
        return c;
    c[k] = l.value;
    return c
}
;
$jscomp.getGlobal = function(c) {
    c = ["object" == typeof globalThis && globalThis, c, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var k = 0; k < c.length; ++k) {
        var l = c[k];
        if (l && l.Math == Math)
            return l
    }
    throw Error("Cannot find global object");
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(c, k) {
    var l = $jscomp.propertyToPolyfillSymbol[k];
    if (null == l)
        return c[k];
    l = c[l];
    return void 0 !== l ? l : c[k]
};
$jscomp.polyfill = function(c, k, l, m) {
    k && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(c, k, l, m) : $jscomp.polyfillUnisolated(c, k, l, m))
}
;
$jscomp.polyfillUnisolated = function(c, k, l, m) {
    l = $jscomp.global;
    c = c.split(".");
    for (m = 0; m < c.length - 1; m++) {
        var e = c[m];
        if (!(e in l))
            return;
        l = l[e]
    }
    c = c[c.length - 1];
    m = l[c];
    k = k(m);
    k != m && null != k && $jscomp.defineProperty(l, c, {
        configurable: !0,
        writable: !0,
        value: k
    })
}
;
$jscomp.polyfillIsolated = function(c, k, l, m) {
    var e = c.split(".");
    c = 1 === e.length;
    m = e[0];
    m = !c && m in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
    for (var a = 0; a < e.length - 1; a++) {
        var b = e[a];
        if (!(b in m))
            return;
        m = m[b]
    }
    e = e[e.length - 1];
    l = $jscomp.IS_SYMBOL_NATIVE && "es6" === l ? m[e] : null;
    k = k(l);
    null != k && (c ? $jscomp.defineProperty($jscomp.polyfills, e, {
        configurable: !0,
        writable: !0,
        value: k
    }) : k !== l && (void 0 === $jscomp.propertyToPolyfillSymbol[e] && (l = 1E9 * Math.random() >>> 0,
    $jscomp.propertyToPolyfillSymbol[e] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(e) : $jscomp.POLYFILL_PREFIX + l + "$" + e),
    $jscomp.defineProperty(m, $jscomp.propertyToPolyfillSymbol[e], {
        configurable: !0,
        writable: !0,
        value: k
    })))
}
;
$jscomp.polyfill("Array.prototype.find", function(c) {
    return c ? c : function(k, l) {
        return $jscomp.findInternal(this, k, l).v
    }
}, "es6", "es3");
(function(c, k, l, m) {
    function e(a, b) {
        this.settings = null;
        this.options = c.extend({}, e.Defaults, b);
        this.$element = c(a);
        this._handlers = {};
        this._plugins = {};
        this._supress = {};
        this._speed = this._current = null;
        this._coordinates = [];
        this._width = this._breakpoint = null;
        this._items = [];
        this._clones = [];
        this._mergers = [];
        this._widths = [];
        this._invalidated = {};
        this._pipe = [];
        this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {
                start: null,
                current: null
            },
            direction: null
        };
        this._states = {
            current: {},
            tags: {
                initializing: ["busy"],
                animating: ["busy"],
                dragging: ["interacting"]
            }
        };
        c.each(["onResize", "onThrottledResize"], c.proxy(function(d, f) {
            this._handlers[f] = c.proxy(this[f], this)
        }, this));
        c.each(e.Plugins, c.proxy(function(d, f) {
            this._plugins[d.charAt(0).toLowerCase() + d.slice(1)] = new f(this)
        }, this));
        c.each(e.Workers, c.proxy(function(d, f) {
            this._pipe.push({
                filter: f.filter,
                run: c.proxy(f.run, this)
            })
        }, this));
        this.setup();
        this.initialize()
    }
    e.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        checkVisibility: !0,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: k,
        fallbackEasing: "swing",
        slideTransition: "",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab"
    };
    e.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    };
    e.Type = {
        Event: "event",
        State: "state"
    };
    e.Plugins = {};
    e.Workers = [{
        filter: ["width", "settings"],
        run: function() {
            this._width = this.$element.width()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            a.current = this._items && this._items[this.relative(this._current)]
        }
    }, {
        filter: ["items", "settings"],
        run: function() {
            this.$stage.children(".cloned").remove()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            var b = this.settings.margin || ""
              , d = this.settings.rtl;
            b = {
                width: "auto",
                "margin-left": d ? b : "",
                "margin-right": d ? "" : b
            };
            this.settings.autoWidth && this.$stage.children().css(b);
            a.css = b
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            var b = (this.width() / this.settings.items).toFixed(3) - this.settings.margin
              , d = this._items.length
              , f = !this.settings.autoWidth
              , g = [];
            for (a.items = {
                merge: !1,
                width: b
            }; d--; ) {
                var h = this._mergers[d];
                h = this.settings.mergeFit && Math.min(h, this.settings.items) || h;
                a.items.merge = 1 < h || a.items.merge;
                g[d] = f ? b * h : this._items[d].width()
            }
            this._widths = g
        }
    }, {
        filter: ["items", "settings"],
        run: function() {
            var a = []
              , b = this._items
              , d = this.settings
              , f = Math.max(2 * d.items, 4)
              , g = 2 * Math.ceil(b.length / 2);
            d = d.loop && b.length ? d.rewind ? f : Math.max(f, g) : 0;
            g = f = "";
            for (d /= 2; 0 < d; )
                a.push(this.normalize(a.length / 2, !0)),
                f += b[a[a.length - 1]][0].outerHTML,
                a.push(this.normalize(b.length - 1 - (a.length - 1) / 2, !0)),
                g = b[a[a.length - 1]][0].outerHTML + g,
                --d;
            this._clones = a;
            c(f).addClass("cloned").appendTo(this.$stage);
            c(g).addClass("cloned").prependTo(this.$stage)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function() {
            for (var a = this.settings.rtl ? 1 : -1, b = this._clones.length + this._items.length, d = -1, f, g, h = []; ++d < b; )
                f = h[d - 1] || 0,
                g = this._widths[this.relative(d)] + this.settings.margin,
                h.push(f + g * a);
            this._coordinates = h
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function() {
            var a = this.settings.stagePadding
              , b = this._coordinates;
            this.$stage.css({
                width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
                "padding-left": a || "",
                "padding-right": a || ""
            })
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            var b = this._coordinates.length
              , d = !this.settings.autoWidth
              , f = this.$stage.children();
            if (d && a.items.merge)
                for (; b--; )
                    a.css.width = this._widths[this.relative(b)],
                    f.eq(b).css(a.css);
            else
                d && (a.css.width = a.items.width,
                f.css(a.css))
        }
    }, {
        filter: ["items"],
        run: function() {
            1 > this._coordinates.length && this.$stage.removeAttr("style")
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function(a) {
            a.current = a.current ? this.$stage.children().index(a.current) : 0;
            a.current = Math.max(this.minimum(), Math.min(this.maximum(), a.current));
            this.reset(a.current)
        }
    }, {
        filter: ["position"],
        run: function() {
            this.animate(this.coordinates(this._current))
        }
    }, {
        filter: ["width", "position", "items", "settings"],
        run: function() {
            var a = this.settings.rtl ? 1 : -1, b = 2 * this.settings.stagePadding, d = this.coordinates(this.current()) + b, f = d + this.width() * a, g = [], h;
            var n = 0;
            for (h = this._coordinates.length; n < h; n++) {
                var p = this._coordinates[n - 1] || 0;
                var q = Math.abs(this._coordinates[n]) + b * a;
                (this.op(p, "<=", d) && this.op(p, ">", f) || this.op(q, "<", d) && this.op(q, ">", f)) && g.push(n)
            }
            this.$stage.children(".active").removeClass("active");
            this.$stage.children(":eq(" + g.join("), :eq(") + ")").addClass("active");
            this.$stage.children(".center").removeClass("center");
            this.settings.center && this.$stage.children().eq(this.current()).addClass("center")
        }
    }];
    e.prototype.initializeStage = function() {
        this.$stage = this.$element.find("." + this.settings.stageClass);
        this.$stage.length || (this.$element.addClass(this.options.loadingClass),
        this.$stage = c("<" + this.settings.stageElement + ">", {
            "class": this.settings.stageClass
        }).wrap(c("<div/>", {
            "class": this.settings.stageOuterClass
        })),
        this.$element.append(this.$stage.parent()))
    }
    ;
    e.prototype.initializeItems = function() {
        var a = this.$element.find(".owl-item");
        a.length ? (this._items = a.get().map(function(b) {
            return c(b)
        }),
        this._mergers = this._items.map(function() {
            return 1
        }),
        this.refresh()) : (this.replace(this.$element.children().not(this.$stage.parent())),
        this.isVisible() ? this.refresh() : this.invalidate("width"),
        this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass))
    }
    ;
    e.prototype.initialize = function() {
        this.enter("initializing");
        this.trigger("initialize");
        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl);
        if (this.settings.autoWidth && !this.is("pre-loading")) {
            var a = this.$element.find("img");
            var b = this.$element.children(this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : m).width();
            a.length && 0 >= b && this.preloadAutoWidthImages(a)
        }
        this.initializeStage();
        this.initializeItems();
        this.registerEventHandlers();
        this.leave("initializing");
        this.trigger("initialized")
    }
    ;
    e.prototype.isVisible = function() {
        return this.settings.checkVisibility ? this.$element.is(":visible") : !0
    }
    ;
    e.prototype.setup = function() {
        var a = this.viewport()
          , b = this.options.responsive
          , d = -1
          , f = null;
        b ? (c.each(b, function(g) {
            g <= a && g > d && (d = Number(g))
        }),
        f = c.extend({}, this.options, b[d]),
        "function" === typeof f.stagePadding && (f.stagePadding = f.stagePadding()),
        delete f.responsive,
        f.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s","g"), "$1" + d))) : f = c.extend({}, this.options);
        this.trigger("change", {
            property: {
                name: "settings",
                value: f
            }
        });
        this._breakpoint = d;
        this.settings = f;
        this.invalidate("settings");
        this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        })
    }
    ;
    e.prototype.optionsLogic = function() {
        this.settings.autoWidth && (this.settings.stagePadding = !1,
        this.settings.merge = !1)
    }
    ;
    e.prototype.prepare = function(a) {
        var b = this.trigger("prepare", {
            content: a
        });
        b.data || (b.data = c("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(a));
        this.trigger("prepared", {
            content: b.data
        });
        return b.data
    }
    ;
    e.prototype.update = function() {
        for (var a = 0, b = this._pipe.length, d = c.proxy(function(g) {
            return this[g]
        }, this._invalidated), f = {}; a < b; )
            (this._invalidated.all || 0 < c.grep(this._pipe[a].filter, d).length) && this._pipe[a].run(f),
            a++;
        this._invalidated = {};
        !this.is("valid") && this.enter("valid")
    }
    ;
    e.prototype.width = function(a) {
        a = a || e.Width.Default;
        switch (a) {
        case e.Width.Inner:
        case e.Width.Outer:
            return this._width;
        default:
            return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }
    ;
    e.prototype.refresh = function() {
        this.enter("refreshing");
        this.trigger("refresh");
        this.setup();
        this.optionsLogic();
        this.$element.addClass(this.options.refreshClass);
        this.update();
        this.$element.removeClass(this.options.refreshClass);
        this.leave("refreshing");
        this.trigger("refreshed")
    }
    ;
    e.prototype.onThrottledResize = function() {
        k.clearTimeout(this.resizeTimer);
        this.resizeTimer = k.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
    }
    ;
    e.prototype.onResize = function() {
        if (!this._items.length || this._width === this.$element.width() || !this.isVisible())
            return !1;
        this.enter("resizing");
        if (this.trigger("resize").isDefaultPrevented())
            return this.leave("resizing"),
            !1;
        this.invalidate("width");
        this.refresh();
        this.leave("resizing");
        this.trigger("resized")
    }
    ;
    e.prototype.registerEventHandlers = function() {
        if (c.support.transition)
            this.$stage.on(c.support.transition.end + ".owl.core", c.proxy(this.onTransitionEnd, this));
        if (!1 !== this.settings.responsive)
            this.on(k, "resize", this._handlers.onThrottledResize);
        this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass),
        this.$stage.on("mousedown.owl.core", c.proxy(this.onDragStart, this)),
        this.$stage.on("dragstart.owl.core selectstart.owl.core", function() {
            return !1
        }));
        this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", c.proxy(this.onDragStart, this)),
        this.$stage.on("touchcancel.owl.core", c.proxy(this.onDragEnd, this)))
    }
    ;
    e.prototype.onDragStart = function(a) {
        var b = null;
        3 !== a.which && (c.support.transform ? (b = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","),
        b = {
            x: b[16 === b.length ? 12 : 4],
            y: b[16 === b.length ? 13 : 5]
        }) : (b = this.$stage.position(),
        b = {
            x: this.settings.rtl ? b.left + this.$stage.width() - this.width() + this.settings.margin : b.left,
            y: b.top
        }),
        this.is("animating") && (c.support.transform ? this.animate(b.x) : this.$stage.stop(),
        this.invalidate("position")),
        this.$element.toggleClass(this.options.grabClass, "mousedown" === a.type),
        this.speed(0),
        this._drag.time = (new Date).getTime(),
        this._drag.target = c(a.target),
        this._drag.stage.start = b,
        this._drag.stage.current = b,
        this._drag.pointer = this.pointer(a),
        c(l).on("mouseup.owl.core touchend.owl.core", c.proxy(this.onDragEnd, this)),
        c(l).one("mousemove.owl.core touchmove.owl.core", c.proxy(function(d) {
            var f = this.difference(this._drag.pointer, this.pointer(d));
            c(l).on("mousemove.owl.core touchmove.owl.core", c.proxy(this.onDragMove, this));
            Math.abs(f.x) < Math.abs(f.y) && this.is("valid") || (d.preventDefault(),
            this.enter("dragging"),
            this.trigger("drag"))
        }, this)))
    }
    ;
    e.prototype.onDragMove = function(a) {
        var b = this.difference(this._drag.pointer, this.pointer(a));
        var d = this.difference(this._drag.stage.start, b);
        if (this.is("dragging")) {
            a.preventDefault();
            if (this.settings.loop) {
                a = this.coordinates(this.minimum());
                var f = this.coordinates(this.maximum() + 1) - a;
                d.x = ((d.x - a) % f + f) % f + a
            } else
                a = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()),
                f = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()),
                b = this.settings.pullDrag ? -1 * b.x / 5 : 0,
                d.x = Math.max(Math.min(d.x, a + b), f + b);
            this._drag.stage.current = d;
            this.animate(d.x)
        }
    }
    ;
    e.prototype.onDragEnd = function(a) {
        a = this.difference(this._drag.pointer, this.pointer(a));
        var b = this._drag.stage.current
          , d = 0 < a.x ^ this.settings.rtl ? "left" : "right";
        c(l).off(".owl.core");
        this.$element.removeClass(this.options.grabClass);
        if (0 !== a.x && this.is("dragging") || !this.is("valid"))
            if (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
            this.current(this.closest(b.x, 0 !== a.x ? d : this._drag.direction)),
            this.invalidate("position"),
            this.update(),
            this._drag.direction = d,
            3 < Math.abs(a.x) || 300 < (new Date).getTime() - this._drag.time)
                this._drag.target.one("click.owl.core", function() {
                    return !1
                });
        this.is("dragging") && (this.leave("dragging"),
        this.trigger("dragged"))
    }
    ;
    e.prototype.closest = function(a, b) {
        var d = -1
          , f = this.width()
          , g = this.coordinates();
        this.settings.freeDrag || c.each(g, c.proxy(function(h, n) {
            "left" === b && a > n - 30 && a < n + 30 ? d = h : "right" === b && a > n - f - 30 && a < n - f + 30 ? d = h + 1 : this.op(a, "<", n) && this.op(a, ">", g[h + 1] !== m ? g[h + 1] : n - f) && (d = "left" === b ? h + 1 : h);
            return -1 === d
        }, this));
        this.settings.loop || (this.op(a, ">", g[this.minimum()]) ? d = a = this.minimum() : this.op(a, "<", g[this.maximum()]) && (d = a = this.maximum()));
        return d
    }
    ;
    e.prototype.animate = function(a) {
        var b = 0 < this.speed();
        this.is("animating") && this.onTransitionEnd();
        b && (this.enter("animating"),
        this.trigger("translate"));
        c.support.transform3d && c.support.transition ? this.$stage.css({
            transform: "translate3d(" + a + "px,0px,0px)",
            transition: this.speed() / 1E3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "")
        }) : b ? this.$stage.animate({
            left: a + "px"
        }, this.speed(), this.settings.fallbackEasing, c.proxy(this.onTransitionEnd, this)) : this.$stage.css({
            left: a + "px"
        })
    }
    ;
    e.prototype.is = function(a) {
        return this._states.current[a] && 0 < this._states.current[a]
    }
    ;
    e.prototype.current = function(a) {
        if (a === m)
            return this._current;
        if (0 === this._items.length)
            return m;
        a = this.normalize(a);
        if (this._current !== a) {
            var b = this.trigger("change", {
                property: {
                    name: "position",
                    value: a
                }
            });
            b.data !== m && (a = this.normalize(b.data));
            this._current = a;
            this.invalidate("position");
            this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            })
        }
        return this._current
    }
    ;
    e.prototype.invalidate = function(a) {
        "string" === c.type(a) && (this._invalidated[a] = !0,
        this.is("valid") && this.leave("valid"));
        return c.map(this._invalidated, function(b, d) {
            return d
        })
    }
    ;
    e.prototype.reset = function(a) {
        a = this.normalize(a);
        a !== m && (this._speed = 0,
        this._current = a,
        this.suppress(["translate", "translated"]),
        this.animate(this.coordinates(a)),
        this.release(["translate", "translated"]))
    }
    ;
    e.prototype.normalize = function(a, b) {
        var d = this._items.length;
        b = b ? 0 : this._clones.length;
        if (!this.isNumeric(a) || 1 > d)
            a = m;
        else if (0 > a || a >= d + b)
            a = ((a - b / 2) % d + d) % d + b / 2;
        return a
    }
    ;
    e.prototype.relative = function(a) {
        a -= this._clones.length / 2;
        return this.normalize(a, !0)
    }
    ;
    e.prototype.maximum = function(a) {
        var b = this.settings, d;
        if (b.loop)
            b = this._clones.length / 2 + this._items.length - 1;
        else if (b.autoWidth || b.merge) {
            if (b = this._items.length) {
                var f = this._items[--b].width();
                for (d = this.$element.width(); b-- && !(f += this._items[b].width() + this.settings.margin,
                f > d); )
                    ;
            }
            b += 1
        } else
            b = b.center ? this._items.length - 1 : this._items.length - b.items;
        a && (b -= this._clones.length / 2);
        return Math.max(b, 0)
    }
    ;
    e.prototype.minimum = function(a) {
        return a ? 0 : this._clones.length / 2
    }
    ;
    e.prototype.items = function(a) {
        if (a === m)
            return this._items.slice();
        a = this.normalize(a, !0);
        return this._items[a]
    }
    ;
    e.prototype.mergers = function(a) {
        if (a === m)
            return this._mergers.slice();
        a = this.normalize(a, !0);
        return this._mergers[a]
    }
    ;
    e.prototype.clones = function(a) {
        var b = this._clones.length / 2
          , d = b + this._items.length;
        return a === m ? c.map(this._clones, function(f, g) {
            return 0 === g % 2 ? d + g / 2 : b - (g + 1) / 2
        }) : c.map(this._clones, function(f, g) {
            return f === a ? 0 === g % 2 ? d + g / 2 : b - (g + 1) / 2 : null
        })
    }
    ;
    e.prototype.speed = function(a) {
        a !== m && (this._speed = a);
        return this._speed
    }
    ;
    e.prototype.coordinates = function(a) {
        var b = 1
          , d = a - 1;
        if (a === m)
            return c.map(this._coordinates, c.proxy(function(f, g) {
                return this.coordinates(g)
            }, this));
        this.settings.center ? (this.settings.rtl && (b = -1,
        d = a + 1),
        a = this._coordinates[a],
        a += (this.width() - a + (this._coordinates[d] || 0)) / 2 * b) : a = this._coordinates[d] || 0;
        return a = Math.ceil(a)
    }
    ;
    e.prototype.duration = function(a, b, d) {
        return 0 === d ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(d || this.settings.smartSpeed)
    }
    ;
    e.prototype.to = function(a, b) {
        var d = this.current()
          , f = a - this.relative(d);
        var g = (0 < f) - (0 > f);
        var h = this._items.length
          , n = this.minimum()
          , p = this.maximum();
        this.settings.loop ? (!this.settings.rewind && Math.abs(f) > h / 2 && (f += -1 * g * h),
        a = d + f,
        g = ((a - n) % h + h) % h + n,
        g !== a && g - f <= p && 0 < g - f && (d = g - f,
        a = g,
        this.reset(d))) : this.settings.rewind ? (p += 1,
        a = (a % p + p) % p) : a = Math.max(n, Math.min(p, a));
        this.speed(this.duration(d, a, b));
        this.current(a);
        this.isVisible() && this.update()
    }
    ;
    e.prototype.next = function(a) {
        a = a || !1;
        this.to(this.relative(this.current()) + 1, a)
    }
    ;
    e.prototype.prev = function(a) {
        a = a || !1;
        this.to(this.relative(this.current()) - 1, a)
    }
    ;
    e.prototype.onTransitionEnd = function(a) {
        if (a !== m && (a.stopPropagation(),
        (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0)))
            return !1;
        this.leave("animating");
        this.trigger("translated")
    }
    ;
    e.prototype.viewport = function() {
        var a;
        this.options.responsiveBaseElement !== k ? a = c(this.options.responsiveBaseElement).width() : k.innerWidth ? a = k.innerWidth : l.documentElement && l.documentElement.clientWidth ? a = l.documentElement.clientWidth : console.warn("Can not detect viewport width.");
        return a
    }
    ;
    e.prototype.replace = function(a) {
        this.$stage.empty();
        this._items = [];
        a && (a = a instanceof jQuery ? a : c(a));
        this.settings.nestedItemSelector && (a = a.find("." + this.settings.nestedItemSelector));
        a.filter(function() {
            return 1 === this.nodeType
        }).each(c.proxy(function(b, d) {
            d = this.prepare(d);
            this.$stage.append(d);
            this._items.push(d);
            this._mergers.push(1 * d.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
        }, this));
        this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);
        this.invalidate("items")
    }
    ;
    e.prototype.add = function(a, b) {
        var d = this.relative(this._current);
        b = b === m ? this._items.length : this.normalize(b, !0);
        a = a instanceof jQuery ? a : c(a);
        this.trigger("add", {
            content: a,
            position: b
        });
        a = this.prepare(a);
        0 === this._items.length || b === this._items.length ? (0 === this._items.length && this.$stage.append(a),
        0 !== this._items.length && this._items[b - 1].after(a),
        this._items.push(a),
        this._mergers.push(1 * a.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[b].before(a),
        this._items.splice(b, 0, a),
        this._mergers.splice(b, 0, 1 * a.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1));
        this._items[d] && this.reset(this._items[d].index());
        this.invalidate("items");
        this.trigger("added", {
            content: a,
            position: b
        })
    }
    ;
    e.prototype.remove = function(a) {
        a = this.normalize(a, !0);
        a !== m && (this.trigger("remove", {
            content: this._items[a],
            position: a
        }),
        this._items[a].remove(),
        this._items.splice(a, 1),
        this._mergers.splice(a, 1),
        this.invalidate("items"),
        this.trigger("removed", {
            content: null,
            position: a
        }))
    }
    ;
    e.prototype.preloadAutoWidthImages = function(a) {
        a.each(c.proxy(function(b, d) {
            this.enter("pre-loading");
            d = c(d);
            c(new Image).one("load", c.proxy(function(f) {
                d.attr("src", f.target.src);
                d.css("opacity", 1);
                this.leave("pre-loading");
                this.is("pre-loading") || this.is("initializing") || this.refresh()
            }, this)).attr("src", d.attr("src") || d.attr("data-src") || d.attr("data-src-retina"))
        }, this))
    }
    ;
    e.prototype.destroy = function() {
        this.$element.off(".owl.core");
        this.$stage.off(".owl.core");
        c(l).off(".owl.core");
        !1 !== this.settings.responsive && (k.clearTimeout(this.resizeTimer),
        this.off(k, "resize", this._handlers.onThrottledResize));
        for (var a in this._plugins)
            this._plugins[a].destroy();
        this.$stage.children(".cloned").remove();
        this.$stage.unwrap();
        this.$stage.children().contents().unwrap();
        this.$stage.children().unwrap();
        this.$stage.remove();
        this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s","g"), "")).removeData("owl.carousel")
    }
    ;
    e.prototype.op = function(a, b, d) {
        var f = this.settings.rtl;
        switch (b) {
        case "<":
            return f ? a > d : a < d;
        case ">":
            return f ? a < d : a > d;
        case ">=":
            return f ? a <= d : a >= d;
        case "<=":
            return f ? a >= d : a <= d
        }
    }
    ;
    e.prototype.on = function(a, b, d, f) {
        a.addEventListener ? a.addEventListener(b, d, f) : a.attachEvent && a.attachEvent("on" + b, d)
    }
    ;
    e.prototype.off = function(a, b, d, f) {
        a.removeEventListener ? a.removeEventListener(b, d, f) : a.detachEvent && a.detachEvent("on" + b, d)
    }
    ;
    e.prototype.trigger = function(a, b, d, f, g) {
        f = {
            item: {
                count: this._items.length,
                index: this.current()
            }
        };
        g = c.camelCase(c.grep(["on", a, d], function(n) {
            return n
        }).join("-").toLowerCase());
        var h = c.Event([a, "owl", d || "carousel"].join(".").toLowerCase(), c.extend({
            relatedTarget: this
        }, f, b));
        this._supress[a] || (c.each(this._plugins, function(n, p) {
            if (p.onTrigger)
                p.onTrigger(h)
        }),
        this.register({
            type: e.Type.Event,
            name: a
        }),
        this.$element.trigger(h),
        this.settings && "function" === typeof this.settings[g] && this.settings[g].call(this, h));
        return h
    }
    ;
    e.prototype.enter = function(a) {
        c.each([a].concat(this._states.tags[a] || []), c.proxy(function(b, d) {
            this._states.current[d] === m && (this._states.current[d] = 0);
            this._states.current[d]++
        }, this))
    }
    ;
    e.prototype.leave = function(a) {
        c.each([a].concat(this._states.tags[a] || []), c.proxy(function(b, d) {
            this._states.current[d]--
        }, this))
    }
    ;
    e.prototype.register = function(a) {
        if (a.type === e.Type.Event) {
            if (c.event.special[a.name] || (c.event.special[a.name] = {}),
            !c.event.special[a.name].owl) {
                var b = c.event.special[a.name]._default;
                c.event.special[a.name]._default = function(d) {
                    return !b || !b.apply || d.namespace && -1 !== d.namespace.indexOf("owl") ? d.namespace && -1 < d.namespace.indexOf("owl") : b.apply(this, arguments)
                }
                ;
                c.event.special[a.name].owl = !0
            }
        } else
            a.type === e.Type.State && (this._states.tags[a.name] = this._states.tags[a.name] ? this._states.tags[a.name].concat(a.tags) : a.tags,
            this._states.tags[a.name] = c.grep(this._states.tags[a.name], c.proxy(function(d, f) {
                return c.inArray(d, this._states.tags[a.name]) === f
            }, this)))
    }
    ;
    e.prototype.suppress = function(a) {
        c.each(a, c.proxy(function(b, d) {
            this._supress[d] = !0
        }, this))
    }
    ;
    e.prototype.release = function(a) {
        c.each(a, c.proxy(function(b, d) {
            delete this._supress[d]
        }, this))
    }
    ;
    e.prototype.pointer = function(a) {
        var b = {
            x: null,
            y: null
        };
        a = a.originalEvent || a || k.event;
        a = a.touches && a.touches.length ? a.touches[0] : a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : a;
        a.pageX ? (b.x = a.pageX,
        b.y = a.pageY) : (b.x = a.clientX,
        b.y = a.clientY);
        return b
    }
    ;
    e.prototype.isNumeric = function(a) {
        return !isNaN(parseFloat(a))
    }
    ;
    e.prototype.difference = function(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        }
    }
    ;
    c.fn.owlCarousel = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var d = c(this)
              , f = d.data("owl.carousel");
            f || (f = new e(this,"object" == typeof a && a),
            d.data("owl.carousel", f),
            c.each("next prev to destroy refresh replace add remove".split(" "), function(g, h) {
                f.register({
                    type: e.Type.Event,
                    name: h
                });
                f.$element.on(h + ".owl.carousel.core", c.proxy(function(n) {
                    n.namespace && n.relatedTarget !== this && (this.suppress([h]),
                    f[h].apply(this, [].slice.call(arguments, 1)),
                    this.release([h]))
                }, f))
            }));
            "string" == typeof a && "_" !== a.charAt(0) && f[a].apply(f, b)
        })
    }
    ;
    c.fn.owlCarousel.Constructor = e
}
)(window.Zepto || window.jQuery, window, document);
(function(c, k, l, m) {
    var e = function(a) {
        this._core = a;
        this._visible = this._interval = null;
        this._handlers = {
            "initialized.owl.carousel": c.proxy(function(b) {
                b.namespace && this._core.settings.autoRefresh && this.watch()
            }, this)
        };
        this._core.options = c.extend({}, e.Defaults, this._core.options);
        this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        autoRefresh: !0,
        autoRefreshInterval: 500
    };
    e.prototype.watch = function() {
        this._interval || (this._visible = this._core.isVisible(),
        this._interval = k.setInterval(c.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
    }
    ;
    e.prototype.refresh = function() {
        this._core.isVisible() !== this._visible && (this._visible = !this._visible,
        this._core.$element.toggleClass("owl-hidden", !this._visible),
        this._visible && this._core.invalidate("width") && this._core.refresh())
    }
    ;
    e.prototype.destroy = function() {
        var a, b;
        k.clearInterval(this._interval);
        for (a in this._handlers)
            this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
            "function" != typeof this[b] && (this[b] = null)
    }
    ;
    c.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e
}
)(window.Zepto || window.jQuery, window, document);
(function(c, k, l, m) {
    var e = function(a) {
        this._core = a;
        this._loaded = [];
        this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel": c.proxy(function(b) {
                if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type)) {
                    var d = this._core.settings
                      , f = d.center && Math.ceil(d.items / 2) || d.items
                      , g = d.center && -1 * f || 0;
                    b = (b.property && b.property.value !== m ? b.property.value : this._core.current()) + g;
                    var h = this._core.clones().length
                      , n = c.proxy(function(p, q) {
                        this.load(q)
                    }, this);
                    0 < d.lazyLoadEager && (f += d.lazyLoadEager,
                    d.loop && (b -= d.lazyLoadEager,
                    f++));
                    for (; g++ < f; )
                        this.load(h / 2 + this._core.relative(b)),
                        h && c.each(this._core.clones(this._core.relative(b)), n),
                        b++
                }
            }, this)
        };
        this._core.options = c.extend({}, e.Defaults, this._core.options);
        this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        lazyLoad: !1,
        lazyLoadEager: 0
    };
    e.prototype.load = function(a) {
        var b = (a = this._core.$stage.children().eq(a)) && a.find(".owl-lazy");
        !b || -1 < c.inArray(a.get(0), this._loaded) || (b.each(c.proxy(function(d, f) {
            var g = c(f)
              , h = 1 < k.devicePixelRatio && g.attr("data-src-retina") || g.attr("data-src") || g.attr("data-srcset");
            this._core.trigger("load", {
                element: g,
                url: h
            }, "lazy");
            g.is("img") ? g.one("load.owl.lazy", c.proxy(function() {
                g.css("opacity", 1);
                this._core.trigger("loaded", {
                    element: g,
                    url: h
                }, "lazy")
            }, this)).attr("src", h) : g.is("source") ? g.one("load.owl.lazy", c.proxy(function() {
                this._core.trigger("loaded", {
                    element: g,
                    url: h
                }, "lazy")
            }, this)).attr("srcset", h) : (d = new Image,
            d.onload = c.proxy(function() {
                g.css({
                    "background-image": 'url("' + h + '")',
                    opacity: "1"
                });
                this._core.trigger("loaded", {
                    element: g,
                    url: h
                }, "lazy")
            }, this),
            d.src = h)
        }, this)),
        this._loaded.push(a.get(0)))
    }
    ;
    e.prototype.destroy = function() {
        var a, b;
        for (a in this.handlers)
            this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
            "function" != typeof this[b] && (this[b] = null)
    }
    ;
    c.fn.owlCarousel.Constructor.Plugins.Lazy = e
}
)(window.Zepto || window.jQuery, window, document);
(function(c, k, l, m) {
    var e = function(a) {
        this._core = a;
        this._previousHeight = null;
        this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel": c.proxy(function(d) {
                d.namespace && this._core.settings.autoHeight && this.update()
            }, this),
            "changed.owl.carousel": c.proxy(function(d) {
                d.namespace && this._core.settings.autoHeight && "position" === d.property.name && this.update()
            }, this),
            "loaded.owl.lazy": c.proxy(function(d) {
                d.namespace && this._core.settings.autoHeight && d.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
            }, this)
        };
        this._core.options = c.extend({}, e.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
        this._intervalId = null;
        var b = this;
        c(k).on("load", function() {
            b._core.settings.autoHeight && b.update()
        });
        c(k).resize(function() {
            b._core.settings.autoHeight && (null != b._intervalId && clearTimeout(b._intervalId),
            b._intervalId = setTimeout(function() {
                b.update()
            }, 250))
        })
    };
    e.Defaults = {
        autoHeight: !1,
        autoHeightClass: "owl-height"
    };
    e.prototype.update = function() {
        var a = this._core._current
          , b = a + this._core.settings.items
          , d = this._core.settings.lazyLoad;
        a = this._core.$stage.children().toArray().slice(a, b);
        var f = [];
        b = 0;
        c.each(a, function(g, h) {
            f.push(c(h).height())
        });
        b = Math.max.apply(null, f);
        1 >= b && d && this._previousHeight && (b = this._previousHeight);
        this._previousHeight = b;
        this._core.$stage.parent().height(b).addClass(this._core.settings.autoHeightClass)
    }
    ;
    e.prototype.destroy = function() {
        var a, b;
        for (a in this._handlers)
            this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
            "function" !== typeof this[b] && (this[b] = null)
    }
    ;
    c.fn.owlCarousel.Constructor.Plugins.AutoHeight = e
}
)(window.Zepto || window.jQuery, window, document);
(function(c, k, l, m) {
    var e = function(a) {
        this._core = a;
        this._videos = {};
        this._playing = null;
        this._handlers = {
            "initialized.owl.carousel": c.proxy(function(b) {
                b.namespace && this._core.register({
                    type: "state",
                    name: "playing",
                    tags: ["interacting"]
                })
            }, this),
            "resize.owl.carousel": c.proxy(function(b) {
                b.namespace && this._core.settings.video && this.isInFullScreen() && b.preventDefault()
            }, this),
            "refreshed.owl.carousel": c.proxy(function(b) {
                b.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
            }, this),
            "changed.owl.carousel": c.proxy(function(b) {
                b.namespace && "position" === b.property.name && this._playing && this.stop()
            }, this),
            "prepared.owl.carousel": c.proxy(function(b) {
                if (b.namespace) {
                    var d = c(b.content).find(".owl-video");
                    d.length && (d.css("display", "none"),
                    this.fetch(d, c(b.content)))
                }
            }, this)
        };
        this._core.options = c.extend({}, e.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
        this._core.$element.on("click.owl.video", ".owl-video-play-icon", c.proxy(function(b) {
            this.play(b)
        }, this))
    };
    e.Defaults = {
        video: !1,
        videoHeight: !1,
        videoWidth: !1
    };
    e.prototype.fetch = function(a, b) {
        a.attr("data-vimeo-id") || a.attr("data-vzaar-id");
        a.attr("data-vimeo-id") || a.attr("data-youtube-id") || a.attr("data-vzaar-id");
        var d = a.attr("data-width") || this._core.settings.videoWidth
          , f = a.attr("data-height") || this._core.settings.videoHeight
          , g = a.attr("href");
        if (g) {
            var h = g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/);
            if (-1 < h[3].indexOf("youtu"))
                var n = "youtube";
            else if (-1 < h[3].indexOf("vimeo"))
                n = "vimeo";
            else if (-1 < h[3].indexOf("vzaar"))
                n = "vzaar";
            else
                throw Error("Video URL not supported.");
            h = h[6]
        } else
            throw Error("Missing video URL.");
        this._videos[g] = {
            type: n,
            id: h,
            width: d,
            height: f
        };
        b.attr("data-video", g);
        this.thumbnail(a, this._videos[g])
    }
    ;
    e.prototype.thumbnail = function(a, b) {
        var d, f = b.width && b.height ? "width:" + b.width + "px;height:" + b.height + "px;" : "", g = a.find("img"), h = "src", n = "", p = this._core.settings, q = function(r) {
            d = p.lazyLoad ? c("<div/>", {
                "class": "owl-video-tn " + n,
                srcType: r
            }) : c("<div/>", {
                "class": "owl-video-tn",
                style: "opacity:1;background-image:url(" + r + ")"
            });
            a.after(d);
            a.after('<div class="owl-video-play-icon"></div>')
        };
        a.wrap(c("<div/>", {
            "class": "owl-video-wrapper",
            style: f
        }));
        this._core.settings.lazyLoad && (h = "data-src",
        n = "owl-lazy");
        if (g.length)
            return q(g.attr(h)),
            g.remove(),
            !1;
        if ("youtube" === b.type) {
            var t = "//img.youtube.com/vi/" + b.id + "/hqdefault.jpg";
            q(t)
        } else
            "vimeo" === b.type ? c.ajax({
                type: "GET",
                url: "//vimeo.com/api/v2/video/" + b.id + ".json",
                jsonp: "callback",
                dataType: "jsonp",
                success: function(r) {
                    t = r[0].thumbnail_large;
                    q(t)
                }
            }) : "vzaar" === b.type && c.ajax({
                type: "GET",
                url: "//vzaar.com/api/videos/" + b.id + ".json",
                jsonp: "callback",
                dataType: "jsonp",
                success: function(r) {
                    t = r.framegrab_url;
                    q(t)
                }
            })
    }
    ;
    e.prototype.stop = function() {
        this._core.trigger("stop", null, "video");
        this._playing.find(".owl-video-frame").remove();
        this._playing.removeClass("owl-video-playing");
        this._playing = null;
        this._core.leave("playing");
        this._core.trigger("stopped", null, "video")
    }
    ;
    e.prototype.play = function(a) {
        a = c(a.target).closest("." + this._core.settings.itemClass);
        var b = this._videos[a.attr("data-video")]
          , d = b.width || "100%"
          , f = b.height || this._core.$stage.height();
        if (!this._playing) {
            this._core.enter("playing");
            this._core.trigger("play", null, "video");
            a = this._core.items(this._core.relative(a.index()));
            this._core.reset(a.index());
            var g = c('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>');
            g.attr("height", f);
            g.attr("width", d);
            "youtube" === b.type ? g.attr("src", "//www.youtube.com/embed/" + b.id + "?autoplay=1&rel=0&v=" + b.id) : "vimeo" === b.type ? g.attr("src", "//player.vimeo.com/video/" + b.id + "?autoplay=1") : "vzaar" === b.type && g.attr("src", "//view.vzaar.com/" + b.id + "/player?autoplay=true");
            c(g).wrap('<div class="owl-video-frame" />').insertAfter(a.find(".owl-video"));
            this._playing = a.addClass("owl-video-playing")
        }
    }
    ;
    e.prototype.isInFullScreen = function() {
        var a = l.fullscreenElement || l.mozFullScreenElement || l.webkitFullscreenElement;
        return a && c(a).parent().hasClass("owl-video-frame")
    }
    ;
    e.prototype.destroy = function() {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers)
            this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
            "function" != typeof this[b] && (this[b] = null)
    }
    ;
    c.fn.owlCarousel.Constructor.Plugins.Video = e
}
)(window.Zepto || window.jQuery, window, document);
(function(c, k, l, m) {
    var e = function(a) {
        this.core = a;
        this.core.options = c.extend({}, e.Defaults, this.core.options);
        this.swapping = !0;
        this.next = this.previous = m;
        this.handlers = {
            "change.owl.carousel": c.proxy(function(b) {
                b.namespace && "position" == b.property.name && (this.previous = this.core.current(),
                this.next = b.property.value)
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": c.proxy(function(b) {
                b.namespace && (this.swapping = "translated" == b.type)
            }, this),
            "translate.owl.carousel": c.proxy(function(b) {
                b.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
            }, this)
        };
        this.core.$element.on(this.handlers)
    };
    e.Defaults = {
        animateOut: !1,
        animateIn: !1
    };
    e.prototype.swap = function() {
        if (1 === this.core.settings.items && c.support.animation && c.support.transition) {
            this.core.speed(0);
            var a = c.proxy(this.clear, this)
              , b = this.core.$stage.children().eq(this.previous)
              , d = this.core.$stage.children().eq(this.next)
              , f = this.core.settings.animateIn
              , g = this.core.settings.animateOut;
            if (this.core.current() !== this.previous) {
                if (g) {
                    var h = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
                    b.one(c.support.animation.end, a).css({
                        left: h + "px"
                    }).addClass("animated owl-animated-out").addClass(g)
                }
                f && d.one(c.support.animation.end, a).addClass("animated owl-animated-in").addClass(f)
            }
        }
    }
    ;
    e.prototype.clear = function(a) {
        c(a.target).css({
            left: ""
        }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut);
        this.core.onTransitionEnd()
    }
    ;
    e.prototype.destroy = function() {
        var a, b;
        for (a in this.handlers)
            this.core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
            "function" != typeof this[b] && (this[b] = null)
    }
    ;
    c.fn.owlCarousel.Constructor.Plugins.Animate = e
}
)(window.Zepto || window.jQuery, window, document);
(function(c, k, l, m) {
    var e = function(a) {
        this._core = a;
        this._call = null;
        this._timeout = this._time = 0;
        this._paused = !0;
        this._handlers = {
            "changed.owl.carousel": c.proxy(function(b) {
                b.namespace && "settings" === b.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : b.namespace && "position" === b.property.name && this._paused && (this._time = 0)
            }, this),
            "initialized.owl.carousel": c.proxy(function(b) {
                b.namespace && this._core.settings.autoplay && this.play()
            }, this),
            "play.owl.autoplay": c.proxy(function(b, d, f) {
                b.namespace && this.play(d, f)
            }, this),
            "stop.owl.autoplay": c.proxy(function(b) {
                b.namespace && this.stop()
            }, this),
            "mouseover.owl.autoplay": c.proxy(function() {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "mouseleave.owl.autoplay": c.proxy(function() {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
            }, this),
            "touchstart.owl.core": c.proxy(function() {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "touchend.owl.core": c.proxy(function() {
                this._core.settings.autoplayHoverPause && this.play()
            }, this)
        };
        this._core.$element.on(this._handlers);
        this._core.options = c.extend({}, e.Defaults, this._core.options)
    };
    e.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5E3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    };
    e.prototype._next = function(a) {
        this._call = k.setTimeout(c.proxy(this._next, this, a), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read());
        this._core.is("interacting") || l.hidden || this._core.next(a || this._core.settings.autoplaySpeed)
    }
    ;
    e.prototype.read = function() {
        return (new Date).getTime() - this._time
    }
    ;
    e.prototype.play = function(a, b) {
        this._core.is("rotating") || this._core.enter("rotating");
        a = a || this._core.settings.autoplayTimeout;
        var d = Math.min(this._time % (this._timeout || a), a);
        this._paused ? (this._time = this.read(),
        this._paused = !1) : k.clearTimeout(this._call);
        this._time += this.read() % a - d;
        this._timeout = a;
        this._call = k.setTimeout(c.proxy(this._next, this, b), a - d)
    }
    ;
    e.prototype.stop = function() {
        this._core.is("rotating") && (this._time = 0,
        this._paused = !0,
        k.clearTimeout(this._call),
        this._core.leave("rotating"))
    }
    ;
    e.prototype.pause = function() {
        this._core.is("rotating") && !this._paused && (this._time = this.read(),
        this._paused = !0,
        k.clearTimeout(this._call))
    }
    ;
    e.prototype.destroy = function() {
        var a, b;
        this.stop();
        for (a in this._handlers)
            this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
            "function" != typeof this[b] && (this[b] = null)
    }
    ;
    c.fn.owlCarousel.Constructor.Plugins.autoplay = e
}
)(window.Zepto || window.jQuery, window, document);
(function(c, k, l, m) {
    var e = function(a) {
        this._core = a;
        this._initialized = !1;
        this._pages = [];
        this._controls = {};
        this._templates = [];
        this.$element = this._core.$element;
        this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        };
        this._handlers = {
            "prepared.owl.carousel": c.proxy(function(b) {
                b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + c(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
            }, this),
            "added.owl.carousel": c.proxy(function(b) {
                b.namespace && this._core.settings.dotsData && this._templates.splice(b.position, 0, this._templates.pop())
            }, this),
            "remove.owl.carousel": c.proxy(function(b) {
                b.namespace && this._core.settings.dotsData && this._templates.splice(b.position, 1)
            }, this),
            "changed.owl.carousel": c.proxy(function(b) {
                b.namespace && "position" == b.property.name && this.draw()
            }, this),
            "initialized.owl.carousel": c.proxy(function(b) {
                b.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"),
                this.initialize(),
                this.update(),
                this.draw(),
                this._initialized = !0,
                this._core.trigger("initialized", null, "navigation"))
            }, this),
            "refreshed.owl.carousel": c.proxy(function(b) {
                b.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"),
                this.update(),
                this.draw(),
                this._core.trigger("refreshed", null, "navigation"))
            }, this)
        };
        this._core.options = c.extend({}, e.Defaults, this._core.options);
        this.$element.on(this._handlers)
    };
    e.Defaults = {
        nav: !1,
        navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'],
        navSpeed: !1,
        navElement: 'button type="button" role="presentation"',
        navContainer: !1,
        navContainerClass: "owl-nav",
        navClass: ["owl-prev", "owl-next"],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: !0,
        dotsEach: !1,
        dotsData: !1,
        dotsSpeed: !1,
        dotsContainer: !1
    };
    e.prototype.initialize = function() {
        var a, b = this._core.settings;
        this._controls.$relative = (b.navContainer ? c(b.navContainer) : c("<div>").addClass(b.navContainerClass).appendTo(this.$element)).addClass("disabled");
        this._controls.$previous = c("<" + b.navElement + ">").addClass(b.navClass[0]).html(b.navText[0]).prependTo(this._controls.$relative).on("click", c.proxy(function(d) {
            this.prev(b.navSpeed)
        }, this));
        this._controls.$next = c("<" + b.navElement + ">").addClass(b.navClass[1]).html(b.navText[1]).appendTo(this._controls.$relative).on("click", c.proxy(function(d) {
            this.next(b.navSpeed)
        }, this));
        b.dotsData || (this._templates = [c('<button role="button">').addClass(b.dotClass).append(c("<span>")).prop("outerHTML")]);
        this._controls.$absolute = (b.dotsContainer ? c(b.dotsContainer) : c("<div>").addClass(b.dotsClass).appendTo(this.$element)).addClass("disabled");
        this._controls.$absolute.on("click", "button", c.proxy(function(d) {
            var f = c(d.target).parent().is(this._controls.$absolute) ? c(d.target).index() : c(d.target).parent().index();
            d.preventDefault();
            this.to(f, b.dotsSpeed)
        }, this));
        for (a in this._overrides)
            this._core[a] = c.proxy(this[a], this)
    }
    ;
    e.prototype.destroy = function() {
        var a, b, d, f;
        var g = this._core.settings;
        for (a in this._handlers)
            this.$element.off(a, this._handlers[a]);
        for (b in this._controls)
            "$relative" === b && g.navContainer ? this._controls[b].html("") : this._controls[b].remove();
        for (f in this.overides)
            this._core[f] = this._overrides[f];
        for (d in Object.getOwnPropertyNames(this))
            "function" != typeof this[d] && (this[d] = null)
    }
    ;
    e.prototype.update = function() {
        var a, b, d = this._core.clones().length / 2, f = d + this._core.items().length, g = this._core.maximum(!0);
        var h = this._core.settings;
        var n = h.center || h.autoWidth || h.dotsData ? 1 : h.dotsEach || h.items;
        "page" !== h.slideBy && (h.slideBy = Math.min(h.slideBy, h.items));
        if (h.dots || "page" == h.slideBy)
            for (this._pages = [],
            h = d,
            b = a = 0; h < f; h++) {
                if (a >= n || 0 === a) {
                    this._pages.push({
                        start: Math.min(g, h - d),
                        end: h - d + n - 1
                    });
                    if (Math.min(g, h - d) === g)
                        break;
                    a = 0;
                    ++b
                }
                a += this._core.mergers(this._core.relative(h))
            }
    }
    ;
    e.prototype.draw = function() {
        var a = this._core.settings;
        var b = this._core.items().length <= a.items;
        var d = this._core.relative(this._core.current())
          , f = a.loop || a.rewind;
        this._controls.$relative.toggleClass("disabled", !a.nav || b);
        a.nav && (this._controls.$previous.toggleClass("disabled", !f && d <= this._core.minimum(!0)),
        this._controls.$next.toggleClass("disabled", !f && d >= this._core.maximum(!0)));
        this._controls.$absolute.toggleClass("disabled", !a.dots || b);
        a.dots && (b = this._pages.length - this._controls.$absolute.children().length,
        a.dotsData && 0 !== b ? this._controls.$absolute.html(this._templates.join("")) : 0 < b ? this._controls.$absolute.append(Array(b + 1).join(this._templates[0])) : 0 > b && this._controls.$absolute.children().slice(b).remove(),
        this._controls.$absolute.find(".active").removeClass("active"),
        this._controls.$absolute.children().eq(c.inArray(this.current(), this._pages)).addClass("active"))
    }
    ;
    e.prototype.onTrigger = function(a) {
        var b = this._core.settings;
        a.page = {
            index: c.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: b && (b.center || b.autoWidth || b.dotsData ? 1 : b.dotsEach || b.items)
        }
    }
    ;
    e.prototype.current = function() {
        var a = this._core.relative(this._core.current());
        return c.grep(this._pages, c.proxy(function(b, d) {
            return b.start <= a && b.end >= a
        }, this)).pop()
    }
    ;
    e.prototype.getPosition = function(a) {
        var b = this._core.settings;
        if ("page" == b.slideBy) {
            var d = c.inArray(this.current(), this._pages);
            b = this._pages.length;
            a ? ++d : --d;
            d = this._pages[(d % b + b) % b].start
        } else
            d = this._core.relative(this._core.current()),
            this._core.items(),
            a ? d += b.slideBy : d -= b.slideBy;
        return d
    }
    ;
    e.prototype.next = function(a) {
        c.proxy(this._overrides.to, this._core)(this.getPosition(!0), a)
    }
    ;
    e.prototype.prev = function(a) {
        c.proxy(this._overrides.to, this._core)(this.getPosition(!1), a)
    }
    ;
    e.prototype.to = function(a, b, d) {
        !d && this._pages.length ? (d = this._pages.length,
        c.proxy(this._overrides.to, this._core)(this._pages[(a % d + d) % d].start, b)) : c.proxy(this._overrides.to, this._core)(a, b)
    }
    ;
    c.fn.owlCarousel.Constructor.Plugins.Navigation = e
}
)(window.Zepto || window.jQuery, window, document);
(function(c, k, l, m) {
    var e = function(a) {
        this._core = a;
        this._hashes = {};
        this.$element = this._core.$element;
        this._handlers = {
            "initialized.owl.carousel": c.proxy(function(b) {
                b.namespace && "URLHash" === this._core.settings.startPosition && c(k).trigger("hashchange.owl.navigation")
            }, this),
            "prepared.owl.carousel": c.proxy(function(b) {
                if (b.namespace) {
                    var d = c(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    d && (this._hashes[d] = b.content)
                }
            }, this),
            "changed.owl.carousel": c.proxy(function(b) {
                if (b.namespace && "position" === b.property.name) {
                    var d = this._core.items(this._core.relative(this._core.current()));
                    (b = c.map(this._hashes, function(f, g) {
                        return f === d ? g : null
                    }).join()) && k.location.hash.slice(1) !== b && (k.location.hash = b)
                }
            }, this)
        };
        this._core.options = c.extend({}, e.Defaults, this._core.options);
        this.$element.on(this._handlers);
        c(k).on("hashchange.owl.navigation", c.proxy(function(b) {
            b = k.location.hash.substring(1);
            var d = this._core.$stage.children();
            b = this._hashes[b] && d.index(this._hashes[b]);
            b !== m && b !== this._core.current() && this._core.to(this._core.relative(b), !1, !0)
        }, this))
    };
    e.Defaults = {
        URLhashListener: !1
    };
    e.prototype.destroy = function() {
        var a, b;
        c(k).off("hashchange.owl.navigation");
        for (a in this._handlers)
            this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
            "function" != typeof this[b] && (this[b] = null)
    }
    ;
    c.fn.owlCarousel.Constructor.Plugins.Hash = e
}
)(window.Zepto || window.jQuery, window, document);
(function(c, k, l, m) {
    function e(f, g) {
        var h = !1
          , n = f.charAt(0).toUpperCase() + f.slice(1);
        c.each((f + " " + b.join(n + " ") + n).split(" "), function(p, q) {
            if (a[q] !== m)
                return h = g ? q : !0,
                !1
        });
        return h
    }
    var a = c("<support>").get(0).style
      , b = ["Webkit", "Moz", "O", "ms"];
    k = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd",
        transition: "transitionend"
    };
    l = {
        WebkitAnimation: "webkitAnimationEnd",
        MozAnimation: "animationend",
        OAnimation: "oAnimationEnd",
        animation: "animationend"
    };
    var d = {
        csstransforms: function() {
            return !!e("transform")
        },
        csstransforms3d: function() {
            return !!e("perspective")
        },
        csstransitions: function() {
            return !!e("transition")
        },
        cssanimations: function() {
            return !!e("animation")
        }
    };
    d.csstransitions() && (c.support.transition = new String(e("transition", !0)),
    c.support.transition.end = k[c.support.transition]);
    d.cssanimations() && (c.support.animation = new String(e("animation", !0)),
    c.support.animation.end = l[c.support.animation]);
    d.csstransforms() && (c.support.transform = new String(e("transform", !0)),
    c.support.transform3d = d.csstransforms3d())
}
)(window.Zepto || window.jQuery, window, document);
