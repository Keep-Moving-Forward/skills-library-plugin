(function ($) {

    /* Alter Class */
    $.fn.alterClass = function (removals, additions) {

        var self = this;
        if (removals.indexOf('*') === -1) {
            self.removeClass(removals);
            return !additions ? self : self.addClass(additions);
        }

        var patt = new RegExp('\\s' +
                removals.
                replace(/\*/g, '[A-Za-z0-9-_]+').
                split(' ').
                join('\\s|\\s') +
                '\\s', 'g');
        self.each(function (i, it) {
            var cn = ' ' + it.className + ' ';
            while (patt.test(cn)) {
                cn = cn.replace(patt, ' ');
            }
            it.className = $.trim(cn);
        });
        return !additions ? self : self.addClass(additions);
    }
    /* End of Alter Class */

    /* UUID */
    $.fn.uuid = function () {

        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    /* View Port*/
    $.belowthefold = function (element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.abovethetop = function (element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    $.rightofscreen = function (element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    $.leftofscreen = function (element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    $.inviewport = function (element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    $.extend($.expr[':'], {
        "below-the-fold": function (a, i, m) {
            return $.belowthefold(a, {threshold: 0});
        },
        "above-the-top": function (a, i, m) {
            return $.abovethetop(a, {threshold: 0});
        },
        "left-of-screen": function (a, i, m) {
            return $.leftofscreen(a, {threshold: 0});
        },
        "right-of-screen": function (a, i, m) {
            return $.rightofscreen(a, {threshold: 0});
        },
        "in-viewport": function (a, i, m) {
            return $.inviewport(a, {threshold: 0});
        }
    });
    /* End of  View Port*/

})($);

/*! * Bootstrap v3.3.2 (http://getbootstrap.com) * Copyright 2011-2015 Twitter, Inc. * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE) */ if ("undefined" == typeof jQuery)
    throw new Error("Bootstrap's JavaScript requires jQuery");
+function (a) {
    "use strict";
    var b = a.fn.jquery.split(" ")[0].split(".");
    if (b[0] < 2 && b[1] < 9 || 1 == b[0] && 9 == b[1] && b[2] < 1)
        throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")
}(jQuery), +function (a) {
    "use strict";
    function b() {
        var a = document.createElement("bootstrap"), b = {WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend"};
        for (var c in b)
            if (void 0 !== a.style[c])
                return{end: b[c]};
        return!1
    }
    a.fn.emulateTransitionEnd = function (b) {
        var c = !1, d = this;
        a(this).one("bsTransitionEnd", function () {
            c = !0
        });
        var e = function () {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b), this
    }, a(function () {
        a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {bindType: a.support.transition.end, delegateType: a.support.transition.end, handle: function (b) {
                return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0
            }})
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var c = a(this), e = c.data("bs.alert");
            e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c)
        })
    }
    var c = '[data-dismiss="alert"]', d = function (b) {
        a(b).on("click", c, this.close)
    };
    d.VERSION = "3.3.2", d.TRANSITION_DURATION = 150, d.prototype.close = function (b) {
        function c() {
            g.detach().trigger("closed.bs.alert").remove()
        }
        var e = a(this), f = e.attr("data-target");
        f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
        var g = a(f);
        b && b.preventDefault(), g.length || (g = e.closest(".alert")), g.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (g.removeClass("in"), a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c())
    };
    var e = a.fn.alert;
    a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function () {
        return a.fn.alert = e, this
    }, a(document).on("click.bs.alert.data-api", c, d.prototype.close)
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.button"), f = "object" == typeof b && b;
            e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b)
        })
    }
    var c = function (b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1
    };
    c.VERSION = "3.3.2", c.DEFAULTS = {loadingText: "loading..."}, c.prototype.setState = function (b) {
        var c = "disabled", d = this.$element, e = d.is("input") ? "val" : "html", f = d.data();
        b += "Text", null == f.resetText && d.data("resetText", d[e]()), setTimeout(a.proxy(function () {
            d[e](null == f[b] ? this.options[b] : f[b]), "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
        }, this), 0)
    }, c.prototype.toggle = function () {
        var a = !0, b = this.$element.closest('[data-toggle="buttons"]');
        if (b.length) {
            var c = this.$element.find("input");
            "radio" == c.prop("type") && (c.prop("checked") && this.$element.hasClass("active") ? a = !1 : b.find(".active").removeClass("active")), a && c.prop("checked", !this.$element.hasClass("active")).trigger("change")
        } else
            this.$element.attr("aria-pressed", !this.$element.hasClass("active"));
        a && this.$element.toggleClass("active")
    };
    var d = a.fn.button;
    a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function () {
        return a.fn.button = d, this
    }, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function (c) {
        var d = a(c.target);
        d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), c.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (b) {
        a(b.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(b.type))
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.carousel"), f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b), g = "string" == typeof b ? b : f.slide;
            e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
        })
    }
    var c = function (b, c) {
        this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = this.sliding = this.interval = this.$active = this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart"in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
    };
    c.VERSION = "3.3.2", c.TRANSITION_DURATION = 600, c.DEFAULTS = {interval: 5e3, pause: "hover", wrap: !0, keyboard: !0}, c.prototype.keydown = function (a) {
        if (!/input|textarea/i.test(a.target.tagName)) {
            switch (a.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
            }
            a.preventDefault()
        }
    }, c.prototype.cycle = function (b) {
        return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
    }, c.prototype.getItemIndex = function (a) {
        return this.$items = a.parent().children(".item"), this.$items.index(a || this.$active)
    }, c.prototype.getItemForDirection = function (a, b) {
        var c = this.getItemIndex(b), d = "prev" == a && 0 === c || "next" == a && c == this.$items.length - 1;
        if (d && !this.options.wrap)
            return b;
        var e = "prev" == a ? -1 : 1, f = (c + e) % this.$items.length;
        return this.$items.eq(f)
    }, c.prototype.to = function (a) {
        var b = this, c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        return a > this.$items.length - 1 || 0 > a ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function () {
            b.to(a)
        }) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a))
    }, c.prototype.pause = function (b) {
        return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, c.prototype.next = function () {
        return this.sliding ? void 0 : this.slide("next")
    }, c.prototype.prev = function () {
        return this.sliding ? void 0 : this.slide("prev")
    }, c.prototype.slide = function (b, d) {
        var e = this.$element.find(".item.active"), f = d || this.getItemForDirection(b, e), g = this.interval, h = "next" == b ? "left" : "right", i = this;
        if (f.hasClass("active"))
            return this.sliding = !1;
        var j = f[0], k = a.Event("slide.bs.carousel", {relatedTarget: j, direction: h});
        if (this.$element.trigger(k), !k.isDefaultPrevented()) {
            if (this.sliding = !0, g && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var l = a(this.$indicators.children()[this.getItemIndex(f)]);
                l && l.addClass("active")
            }
            var m = a.Event("slid.bs.carousel", {relatedTarget: j, direction: h});
            return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b), f[0].offsetWidth, e.addClass(h), f.addClass(h), e.one("bsTransitionEnd", function () {
                f.removeClass([b, h].join(" ")).addClass("active"), e.removeClass(["active", h].join(" ")), i.sliding = !1, setTimeout(function () {
                    i.$element.trigger(m)
                }, 0)
            }).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"), f.addClass("active"), this.sliding = !1, this.$element.trigger(m)), g && this.cycle(), this
        }
    };
    var d = a.fn.carousel;
    a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function () {
        return a.fn.carousel = d, this
    };
    var e = function (c) {
        var d, e = a(this), f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
        if (f.hasClass("carousel")) {
            var g = a.extend({}, f.data(), e.data()), h = e.attr("data-slide-to");
            h && (g.interval = !1), b.call(f, g), h && f.data("bs.carousel").to(h), c.preventDefault()
        }
    };
    a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e), a(window).on("load", function () {
        a('[data-ride="carousel"]').each(function () {
            var c = a(this);
            b.call(c, c.data())
        })
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        var c, d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
        return a(d)
    }
    function c(b) {
        return this.each(function () {
            var c = a(this), e = c.data("bs.collapse"), f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
            !e && f.toggle && "show" == b && (f.toggle = !1), e || c.data("bs.collapse", e = new d(this, f)), "string" == typeof b && e[b]()
        })
    }
    var d = function (b, c) {
        this.$element = a(b), this.options = a.extend({}, d.DEFAULTS, c), this.$trigger = a(this.options.trigger).filter('[href="#' + b.id + '"], [data-target="#' + b.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    d.VERSION = "3.3.2", d.TRANSITION_DURATION = 350, d.DEFAULTS = {toggle: !0, trigger: '[data-toggle="collapse"]'}, d.prototype.dimension = function () {
        var a = this.$element.hasClass("width");
        return a ? "width" : "height"
    }, d.prototype.show = function () {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var b, e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
            if (!(e && e.length && (b = e.data("bs.collapse"), b && b.transitioning))) {
                var f = a.Event("show.bs.collapse");
                if (this.$element.trigger(f), !f.isDefaultPrevented()) {
                    e && e.length && (c.call(e, "hide"), b || e.data("bs.collapse", null));
                    var g = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                    var h = function () {
                        this.$element.removeClass("collapsing").addClass("collapse in")[g](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                    };
                    if (!a.support.transition)
                        return h.call(this);
                    var i = a.camelCase(["scroll", g].join("-"));
                    this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])
                }
            }
        }
    }, d.prototype.hide = function () {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var b = a.Event("hide.bs.collapse");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                var c = this.dimension();
                this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                var e = function () {
                    this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this)
            }
        }
    }, d.prototype.toggle = function () {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, d.prototype.getParent = function () {
        return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function (c, d) {
            var e = a(d);
            this.addAriaAndCollapsedClass(b(e), e)
        }, this)).end()
    }, d.prototype.addAriaAndCollapsedClass = function (a, b) {
        var c = a.hasClass("in");
        a.attr("aria-expanded", c), b.toggleClass("collapsed", !c).attr("aria-expanded", c)
    };
    var e = a.fn.collapse;
    a.fn.collapse = c, a.fn.collapse.Constructor = d, a.fn.collapse.noConflict = function () {
        return a.fn.collapse = e, this
    }, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (d) {
        var e = a(this);
        e.attr("data-target") || d.preventDefault();
        var f = b(e), g = f.data("bs.collapse"), h = g ? "toggle" : a.extend({}, e.data(), {trigger: this});
        c.call(f, h)
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        b && 3 === b.which || (a(e).remove(), a(f).each(function () {
            var d = a(this), e = c(d), f = {relatedTarget: this};
            e.hasClass("open") && (e.trigger(b = a.Event("hide.bs.dropdown", f)), b.isDefaultPrevented() || (d.attr("aria-expanded", "false"), e.removeClass("open").trigger("hidden.bs.dropdown", f)))
        }))
    }
    function c(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d : b.parent()
    }
    function d(b) {
        return this.each(function () {
            var c = a(this), d = c.data("bs.dropdown");
            d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c)
        })
    }
    var e = ".dropdown-backdrop", f = '[data-toggle="dropdown"]', g = function (b) {
        a(b).on("click.bs.dropdown", this.toggle)
    };
    g.VERSION = "3.3.2", g.prototype.toggle = function (d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
            var f = c(e), g = f.hasClass("open");
            if (b(), !g) {
                "ontouchstart"in document.documentElement && !f.closest(".navbar-nav").length && a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click", b);
                var h = {relatedTarget: this};
                if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented())
                    return;
                e.trigger("focus").attr("aria-expanded", "true"), f.toggleClass("open").trigger("shown.bs.dropdown", h)
            }
            return!1
        }
    }, g.prototype.keydown = function (b) {
        if (/(38|40|27|32)/.test(b.which) && !/input|textarea/i.test(b.target.tagName)) {
            var d = a(this);
            if (b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled")) {
                var e = c(d), g = e.hasClass("open");
                if (!g && 27 != b.which || g && 27 == b.which)
                    return 27 == b.which && e.find(f).trigger("focus"), d.trigger("click");
                var h = " li:not(.divider):visible a", i = e.find('[role="menu"]' + h + ', [role="listbox"]' + h);
                if (i.length) {
                    var j = i.index(b.target);
                    38 == b.which && j > 0 && j--, 40 == b.which && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus")
                }
            }
        }
    };
    var h = a.fn.dropdown;
    a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function () {
        return a.fn.dropdown = h, this
    }, a(document).on("click.bs.dropdown.data-api", b).on("click.bs.dropdown.data-api", ".dropdown form", function (a) {
        a.stopPropagation()
    }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="menu"]', g.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="listbox"]', g.prototype.keydown)
}(jQuery), +function (a) {
    "use strict";
    function b(b, d) {
        return this.each(function () {
            var e = a(this), f = e.data("bs.modal"), g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
            f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
        })
    }
    var c = function (b, c) {
        this.options = c, this.$body = a(document.body), this.$element = a(b), this.$backdrop = this.isShown = null, this.scrollbarWidth = 0, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function () {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    c.VERSION = "3.3.2", c.TRANSITION_DURATION = 300, c.BACKDROP_TRANSITION_DURATION = 150, c.DEFAULTS = {backdrop: !0, keyboard: !0, show: !0}, c.prototype.toggle = function (a) {
        return this.isShown ? this.hide() : this.show(a)
    }, c.prototype.show = function (b) {
        var d = this, e = a.Event("show.bs.modal", {relatedTarget: b});
        this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.backdrop(function () {
            var e = a.support.transition && d.$element.hasClass("fade");
            d.$element.parent().length || d.$element.appendTo(d.$body), d.$element.show().scrollTop(0), d.options.backdrop && d.adjustBackdrop(), d.adjustDialog(), e && d.$element[0].offsetWidth, d.$element.addClass("in").attr("aria-hidden", !1), d.enforceFocus();
            var f = a.Event("shown.bs.modal", {relatedTarget: b});
            e ? d.$element.find(".modal-dialog").one("bsTransitionEnd", function () {
                d.$element.trigger("focus").trigger(f)
            }).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f)
        }))
    }, c.prototype.hide = function (b) {
        b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal())
    }, c.prototype.enforceFocus = function () {
        a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function (a) {
            this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
        }, this))
    }, c.prototype.escape = function () {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function (a) {
            27 == a.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, c.prototype.resize = function () {
        this.isShown ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this)) : a(window).off("resize.bs.modal")
    }, c.prototype.hideModal = function () {
        var a = this;
        this.$element.hide(), this.backdrop(function () {
            a.$body.removeClass("modal-open"), a.resetAdjustments(), a.resetScrollbar(), a.$element.trigger("hidden.bs.modal")
        })
    }, c.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, c.prototype.backdrop = function (b) {
        var d = this, e = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var f = a.support.transition && e;
            if (this.$backdrop = a('<div class="modal-backdrop ' + e + '" />').prependTo(this.$element).on("click.dismiss.bs.modal", a.proxy(function (a) {
                a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
            }, this)), f && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b)
                return;
            f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var g = function () {
                d.removeBackdrop(), b && b()
            };
            a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g()
        } else
            b && b()
    }, c.prototype.handleUpdate = function () {
        this.options.backdrop && this.adjustBackdrop(), this.adjustDialog()
    }, c.prototype.adjustBackdrop = function () {
        this.$backdrop.css("height", 0).css("height", this.$element[0].scrollHeight)
    }, c.prototype.adjustDialog = function () {
        var a = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "", paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""})
    }, c.prototype.resetAdjustments = function () {
        this.$element.css({paddingLeft: "", paddingRight: ""})
    }, c.prototype.checkScrollbar = function () {
        this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight, this.scrollbarWidth = this.measureScrollbar()
    }, c.prototype.setScrollbar = function () {
        var a = parseInt(this.$body.css("padding-right") || 0, 10);
        this.bodyIsOverflowing && this.$body.css("padding-right", a + this.scrollbarWidth)
    }, c.prototype.resetScrollbar = function () {
        this.$body.css("padding-right", "")
    }, c.prototype.measureScrollbar = function () {
        var a = document.createElement("div");
        a.className = "modal-scrollbar-measure", this.$body.append(a);
        var b = a.offsetWidth - a.clientWidth;
        return this.$body[0].removeChild(a), b
    };
    var d = a.fn.modal;
    a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function () {
        return a.fn.modal = d, this
    }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (c) {
        var d = a(this), e = d.attr("href"), f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")), g = f.data("bs.modal") ? "toggle" : a.extend({remote: !/#/.test(e) && e}, f.data(), d.data());
        d.is("a") && c.preventDefault(), f.one("show.bs.modal", function (a) {
            a.isDefaultPrevented() || f.one("hidden.bs.modal", function () {
                d.is(":visible") && d.trigger("focus")
            })
        }), b.call(f, g, this)
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.tooltip"), f = "object" == typeof b && b;
            (e || "destroy" != b) && (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }
    var c = function (a, b) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", a, b)
    };
    c.VERSION = "3.3.2", c.TRANSITION_DURATION = 150, c.DEFAULTS = {animation: !0, placement: "top", selector: !1, template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: !1, container: !1, viewport: {selector: "body", padding: 0}}, c.prototype.init = function (b, c, d) {
        this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(this.options.viewport.selector || this.options.viewport);
        for (var e = this.options.trigger.split(" "), f = e.length; f--; ) {
            var g = e[f];
            if ("click" == g)
                this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
            else if ("manual" != g) {
                var h = "hover" == g ? "mouseenter" : "focusin", i = "hover" == g ? "mouseleave" : "focusout";
                this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = a.extend({}, this.options, {trigger: "manual", selector: ""}) : this.fixTitle()
    }, c.prototype.getDefaults = function () {
        return c.DEFAULTS
    }, c.prototype.getOptions = function (b) {
        return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {show: b.delay, hide: b.delay}), b
    }, c.prototype.getDelegateOptions = function () {
        var b = {}, c = this.getDefaults();
        return this._options && a.each(this._options, function (a, d) {
            c[a] != d && (b[a] = d)
        }), b
    }, c.prototype.enter = function (b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c && c.$tip && c.$tip.is(":visible") ? void(c.hoverState = "in") : (c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function () {
            "in" == c.hoverState && c.show()
        }, c.options.delay.show)) : c.show())
    }, c.prototype.leave = function (b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function () {
            "out" == c.hoverState && c.hide()
        }, c.options.delay.hide)) : c.hide()
    }, c.prototype.show = function () {
        var b = a.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(b);
            var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (b.isDefaultPrevented() || !d)
                return;
            var e = this, f = this.tip(), g = this.getUID(this.type);
            this.setContent(), f.attr("id", g), this.$element.attr("aria-describedby", g), this.options.animation && f.addClass("fade");
            var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement, i = /\s?auto?\s?/i, j = i.test(h);
            j && (h = h.replace(i, "") || "top"), f.detach().css({top: 0, left: 0, display: "block"}).addClass(h).data("bs." + this.type, this), this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element);
            var k = this.getPosition(), l = f[0].offsetWidth, m = f[0].offsetHeight;
            if (j) {
                var n = h, o = this.options.container ? a(this.options.container) : this.$element.parent(), p = this.getPosition(o);
                h = "bottom" == h && k.bottom + m > p.bottom ? "top" : "top" == h && k.top - m < p.top ? "bottom" : "right" == h && k.right + l > p.width ? "left" : "left" == h && k.left - l < p.left ? "right" : h, f.removeClass(n).addClass(h)
            }
            var q = this.getCalculatedOffset(h, k, l, m);
            this.applyPlacement(q, h);
            var r = function () {
                var a = e.hoverState;
                e.$element.trigger("shown.bs." + e.type), e.hoverState = null, "out" == a && e.leave(e)
            };
            a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", r).emulateTransitionEnd(c.TRANSITION_DURATION) : r()
        }
    }, c.prototype.applyPlacement = function (b, c) {
        var d = this.tip(), e = d[0].offsetWidth, f = d[0].offsetHeight, g = parseInt(d.css("margin-top"), 10), h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top = b.top + g, b.left = b.left + h, a.offset.setOffset(d[0], a.extend({using: function (a) {
                d.css({top: Math.round(a.top), left: Math.round(a.left)})
            }}, b), 0), d.addClass("in");
        var i = d[0].offsetWidth, j = d[0].offsetHeight;
        "top" == c && j != f && (b.top = b.top + f - j);
        var k = this.getViewportAdjustedDelta(c, b, i, j);
        k.left ? b.left += k.left : b.top += k.top;
        var l = /top|bottom/.test(c), m = l ? 2 * k.left - e + i : 2 * k.top - f + j, n = l ? "offsetWidth" : "offsetHeight";
        d.offset(b), this.replaceArrow(m, d[0][n], l)
    }, c.prototype.replaceArrow = function (a, b, c) {
        this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "")
    }, c.prototype.setContent = function () {
        var a = this.tip(), b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
    }, c.prototype.hide = function (b) {
        function d() {
            "in" != e.hoverState && f.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), b && b()
        }
        var e = this, f = this.tip(), g = a.Event("hide.bs." + this.type);
        return this.$element.trigger(g), g.isDefaultPrevented() ? void 0 : (f.removeClass("in"), a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(), this.hoverState = null, this)
    }, c.prototype.fixTitle = function () {
        var a = this.$element;
        (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
    }, c.prototype.hasContent = function () {
        return this.getTitle()
    }, c.prototype.getPosition = function (b) {
        b = b || this.$element;
        var c = b[0], d = "BODY" == c.tagName, e = c.getBoundingClientRect();
        null == e.width && (e = a.extend({}, e, {width: e.right - e.left, height: e.bottom - e.top}));
        var f = d ? {top: 0, left: 0} : b.offset(), g = {scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()}, h = d ? {width: a(window).width(), height: a(window).height()} : null;
        return a.extend({}, e, g, h, f)
    }, c.prototype.getCalculatedOffset = function (a, b, c, d) {
        return"bottom" == a ? {top: b.top + b.height, left: b.left + b.width / 2 - c / 2} : "top" == a ? {top: b.top - d, left: b.left + b.width / 2 - c / 2} : "left" == a ? {top: b.top + b.height / 2 - d / 2, left: b.left - c} : {top: b.top + b.height / 2 - d / 2, left: b.left + b.width}
    }, c.prototype.getViewportAdjustedDelta = function (a, b, c, d) {
        var e = {top: 0, left: 0};
        if (!this.$viewport)
            return e;
        var f = this.options.viewport && this.options.viewport.padding || 0, g = this.getPosition(this.$viewport);
        if (/right|left/.test(a)) {
            var h = b.top - f - g.scroll, i = b.top + f - g.scroll + d;
            h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
        } else {
            var j = b.left - f, k = b.left + f + c;
            j < g.left ? e.left = g.left - j : k > g.width && (e.left = g.left + g.width - k)
        }
        return e
    }, c.prototype.getTitle = function () {
        var a, b = this.$element, c = this.options;
        return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
    }, c.prototype.getUID = function (a) {
        do
            a += ~~(1e6 * Math.random());
        while (document.getElementById(a));
        return a
    }, c.prototype.tip = function () {
        return this.$tip = this.$tip || a(this.options.template)
    }, c.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, c.prototype.enable = function () {
        this.enabled = !0
    }, c.prototype.disable = function () {
        this.enabled = !1
    }, c.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }, c.prototype.toggle = function (b) {
        var c = this;
        b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
    }, c.prototype.destroy = function () {
        var a = this;
        clearTimeout(this.timeout), this.hide(function () {
            a.$element.off("." + a.type).removeData("bs." + a.type)
        })
    };
    var d = a.fn.tooltip;
    a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function () {
        return a.fn.tooltip = d, this
    }
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.popover"), f = "object" == typeof b && b;
            (e || "destroy" != b) && (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }
    var c = function (a, b) {
        this.init("popover", a, b)
    };
    if (!a.fn.tooltip)
        throw new Error("Popover requires tooltip.js");
    c.VERSION = "3.3.2", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {placement: "right", trigger: "click", content: "", template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function () {
        return c.DEFAULTS
    }, c.prototype.setContent = function () {
        var a = this.tip(), b = this.getTitle(), c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide()
    }, c.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }, c.prototype.getContent = function () {
        var a = this.$element, b = this.options;
        return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
    }, c.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }, c.prototype.tip = function () {
        return this.$tip || (this.$tip = a(this.options.template)), this.$tip
    };
    var d = a.fn.popover;
    a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function () {
        return a.fn.popover = d, this
    }
}(jQuery), +function (a) {
    "use strict";
    function b(c, d) {
        var e = a.proxy(this.process, this);
        this.$body = a("body"), this.$scrollElement = a(a(c).is("body") ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", e), this.refresh(), this.process()
    }
    function c(c) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.scrollspy"), f = "object" == typeof c && c;
            e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]()
        })
    }
    b.VERSION = "3.3.2", b.DEFAULTS = {offset: 10}, b.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }, b.prototype.refresh = function () {
        var b = "offset", c = 0;
        a.isWindow(this.$scrollElement[0]) || (b = "position", c = this.$scrollElement.scrollTop()), this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight();
        var d = this;
        this.$body.find(this.selector).map(function () {
            var d = a(this), e = d.data("target") || d.attr("href"), f = /^#./.test(e) && a(e);
            return f && f.length && f.is(":visible") && [[f[b]().top + c, e]] || null
        }).sort(function (a, b) {
            return a[0] - b[0]
        }).each(function () {
            d.offsets.push(this[0]), d.targets.push(this[1])
        })
    }, b.prototype.process = function () {
        var a, b = this.$scrollElement.scrollTop() + this.options.offset, c = this.getScrollHeight(), d = this.options.offset + c - this.$scrollElement.height(), e = this.offsets, f = this.targets, g = this.activeTarget;
        if (this.scrollHeight != c && this.refresh(), b >= d)
            return g != (a = f[f.length - 1]) && this.activate(a);
        if (g && b < e[0])
            return this.activeTarget = null, this.clear();
        for (a = e.length; a--; )
            g != f[a] && b >= e[a] && (!e[a + 1] || b <= e[a + 1]) && this.activate(f[a])
    }, b.prototype.activate = function (b) {
        this.activeTarget = b, this.clear();
        var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]', d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy")
    }, b.prototype.clear = function () {
        a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var d = a.fn.scrollspy;
    a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function () {
        return a.fn.scrollspy = d, this
    }, a(window).on("load.bs.scrollspy.data-api", function () {
        a('[data-spy="scroll"]').each(function () {
            var b = a(this);
            c.call(b, b.data())
        })
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.tab");
            e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]()
        })
    }
    var c = function (b) {
        this.element = a(b)
    };
    c.VERSION = "3.3.2", c.TRANSITION_DURATION = 150, c.prototype.show = function () {
        var b = this.element, c = b.closest("ul:not(.dropdown-menu)"), d = b.data("target");
        if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
            var e = c.find(".active:last a"), f = a.Event("hide.bs.tab", {relatedTarget: b[0]}), g = a.Event("show.bs.tab", {relatedTarget: e[0]});
            if (e.trigger(f), b.trigger(g), !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
                var h = a(d);
                this.activate(b.closest("li"), c), this.activate(h, h.parent(), function () {
                    e.trigger({type: "hidden.bs.tab", relatedTarget: b[0]}), b.trigger({type: "shown.bs.tab", relatedTarget: e[0]})
                })
            }
        }
    }, c.prototype.activate = function (b, d, e) {
        function f() {
            g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu") && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), e && e()
        }
        var g = d.find("> .active"), h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
        g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(), g.removeClass("in")
    };
    var d = a.fn.tab;
    a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function () {
        return a.fn.tab = d, this
    };
    var e = function (c) {
        c.preventDefault(), b.call(a(this), "show")
    };
    a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e)
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.affix"), f = "object" == typeof b && b;
            e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]()
        })
    }
    var c = function (b, d) {
        this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = this.unpin = this.pinnedOffset = null, this.checkPosition()
    };
    c.VERSION = "3.3.2", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {offset: 0, target: window}, c.prototype.getState = function (a, b, c, d) {
        var e = this.$target.scrollTop(), f = this.$element.offset(), g = this.$target.height();
        if (null != c && "top" == this.affixed)
            return c > e ? "top" : !1;
        if ("bottom" == this.affixed)
            return null != c ? e + this.unpin <= f.top ? !1 : "bottom" : a - d >= e + g ? !1 : "bottom";
        var h = null == this.affixed, i = h ? e : f.top, j = h ? g : b;
        return null != c && c >= e ? "top" : null != d && i + j >= a - d ? "bottom" : !1
    }, c.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset)
            return this.pinnedOffset;
        this.$element.removeClass(c.RESET).addClass("affix");
        var a = this.$target.scrollTop(), b = this.$element.offset();
        return this.pinnedOffset = b.top - a
    }, c.prototype.checkPositionWithEventLoop = function () {
        setTimeout(a.proxy(this.checkPosition, this), 1)
    }, c.prototype.checkPosition = function () {
        if (this.$element.is(":visible")) {
            var b = this.$element.height(), d = this.options.offset, e = d.top, f = d.bottom, g = a("body").height();
            "object" != typeof d && (f = e = d), "function" == typeof e && (e = d.top(this.$element)), "function" == typeof f && (f = d.bottom(this.$element));
            var h = this.getState(g, b, e, f);
            if (this.affixed != h) {
                null != this.unpin && this.$element.css("top", "");
                var i = "affix" + (h ? "-" + h : ""), j = a.Event(i + ".bs.affix");
                if (this.$element.trigger(j), j.isDefaultPrevented())
                    return;
                this.affixed = h, this.unpin = "bottom" == h ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == h && this.$element.offset({top: g - b - f})
        }
    };
    var d = a.fn.affix;
    a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function () {
        return a.fn.affix = d, this
    }, a(window).on("load", function () {
        a('[data-spy="affix"]').each(function () {
            var c = a(this), d = c.data();
            d.offset = d.offset || {}, null != d.offsetBottom && (d.offset.bottom = d.offsetBottom), null != d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d)
        })
    })
}(jQuery);


/**
 * jQuery Bar Rating Plugin v1.0.5
 *
 * http://github.com/antennaio/jquery-bar-rating
 *
 * Copyright (c) 2012-2014 Kazik Pietruszewski
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function ($) {
    var BarRating, root;
    root = typeof window !== "undefined" && window !== null ? window : global;
    root.BarRating = BarRating = (function () {

        function BarRating() {
            this.show = function () {
                var $this = $(this.elem),
                        $widget,
                        $all,
                        userOptions = this.options,
                        nextAllorPreviousAll,
                        initialOption;
                // run only once
                if (!$this.data('barrating')) {

                    if (userOptions.initialRating) {
                        initialOption = $('option[value="' + userOptions.initialRating + '"]', $this);
                    } else {
                        initialOption = $('option:selected', $this);
                    }

                    $this.data('barrating', {
                        // initial rating based on the OPTION value
                        currentRatingValue: initialOption.val(),
                        currentRatingText: initialOption.text(),
                        // rating will be restored by calling destroy method
                        originalRatingValue: initialOption.val(),
                        originalRatingText: initialOption.text()

                    });
                    $widget = $('<div />', {'class': 'br-widget'}).insertAfter($this);
                    // create A elements that will replace OPTIONs
                    $this.find('option').each(function () {
                        var val, text, $a, $span;
                        val = $(this).val();
                        // create ratings - but only if val is defined
                        if (val) {
                            text = $(this).text();
                            $a = $('<a />', {href: '#', 'data-rating-value': val, 'data-rating-text': text});
                            $span = $('<span />', {text: (userOptions.showValues) ? text : ''});
                            $widget.append($a.append($span));
                        }

                    });
                    // append .br-current-rating div to the widget
                    if (userOptions.showSelectedRating) {
                        $widget.append($('<div />', {text: '', 'class': 'br-current-rating'}));
                    }

                    // first OPTION empty - allow deselecting of ratings
                    $this.data('barrating').deselectable = (!$this.find('option:first').val()) ? true : false;
                    // use different jQuery function depending on the 'reverse' setting
                    if (userOptions.reverse) {
                        nextAllorPreviousAll = 'nextAll';
                    } else {
                        nextAllorPreviousAll = 'prevAll';
                    }

                    // additional classes for the widget
                    if (userOptions.reverse) {
                        $widget.addClass('br-reverse');
                    }

                    if (userOptions.readonly) {
                        $widget.addClass('br-readonly');
                    }

                    // rating change event
                    $widget.on('ratingchange',
                            function (event, value, text) {

                                // value or text undefined?
                                value = value ? value : $this.data('barrating').currentRatingValue;
                                text = text ? text : $this.data('barrating').currentRatingText;
                                // change selected OPTION in the select box (now hidden)
                                $this.find('option[value="' + value + '"]').prop('selected', true);
                                $this.change();
                                // update .br-current-rating div
                                if (userOptions.showSelectedRating) {
                                    $(this).find('.br-current-rating').text(text);
                                }

                            }).trigger('ratingchange');
                    // update rating event
                    $widget.on('updaterating',
                            function (event) {

                                // add classes
                                $(this).find('a[data-rating-value="' + $this.data('barrating').currentRatingValue + '"]')
                                        .addClass('br-selected br-current')[nextAllorPreviousAll]()
                                        .addClass('br-selected');
                            }).trigger('updaterating');
                    $all = $widget.find('a');
                    // fast clicks
                    $all.on('touchstart', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        $(this).click();
                    });
                    // do not react to click events if rating is read-only
                    if (userOptions.readonly) {
                        $all.on('click', function (event) {
                            event.preventDefault();
                        });
                    }

                    // add interactions
                    if (!userOptions.readonly) {

                        $all.on('click', function (event) {
                            var $a = $(this),
                                    value,
                                    text;
                            event.preventDefault();
                            $all.removeClass('br-active br-selected');
                            $a.addClass('br-selected')[nextAllorPreviousAll]()
                                    .addClass('br-selected');
                            value = $a.attr('data-rating-value');
                            text = $a.attr('data-rating-text');
                            // is current and deselectable?
                            if ($a.hasClass('br-current') && $this.data('barrating').deselectable) {
                                $a.removeClass('br-selected br-current')[nextAllorPreviousAll]()
                                        .removeClass('br-selected br-current');
                                value = '', text = '';
                            } else {
                                $all.removeClass('br-current');
                                $a.addClass('br-current')
                            }

                            // remember selected rating
                            $this.data('barrating').currentRatingValue = value;
                            $this.data('barrating').currentRatingText = text;
                            $widget.trigger('ratingchange');
                            // onSelect callback
                            userOptions.onSelect.call(
                                    this,
                                    $this.data('barrating').currentRatingValue,
                                    $this.data('barrating').currentRatingText
                                    );
                            return false;
                        });
                        // attach mouseenter/mouseleave event handlers
                        $all.on({
                            mouseenter: function () {
                                var $a = $(this);
                                $all.removeClass('br-active').removeClass('br-selected');
                                $a.addClass('br-active')[nextAllorPreviousAll]()
                                        .addClass('br-active');
                                $widget.trigger('ratingchange',
                                        [$a.attr('data-rating-value'), $a.attr('data-rating-text')]
                                        );
                            }
                        });
                        $widget.on({
                            mouseleave: function () {
                                $all.removeClass('br-active');
                                $widget
                                        .trigger('ratingchange')
                                        .trigger('updaterating');
                            }
                        });
                    }

                    // hide the select box
                    $this.hide();
                }
            }
            this.clear = function () {
                var $this = $(this.elem);
                var $widget = $this.next('.br-widget');
                // attempt to clear the rating
                if ($widget && $this.data('barrating')) {

                    $widget.find('a').removeClass('br-selected br-current');
                    // restore original data
                    $this.data('barrating').currentRatingValue = $this.data('barrating').originalRatingValue;
                    $this.data('barrating').currentRatingText = $this.data('barrating').originalRatingText;
                    $widget
                            .trigger('ratingchange')
                            .trigger('updaterating');
                    // onClear callback
                    this.options.onClear.call(
                            this,
                            $this.data('barrating').currentRatingValue,
                            $this.data('barrating').currentRatingText
                            );
                }
            }
            this.destroy = function () {
                var $this = $(this.elem);
                var $widget = $this.next('.br-widget');
                // attempt to destroy the widget
                if ($widget && $this.data('barrating')) {
                    var value = $this.data('barrating').currentRatingValue;
                    var text = $this.data('barrating').currentRatingText;
                    $this.removeData('barrating');
                    $widget.off().remove();
                    // show the select box
                    $this.show();
                    // onDestroy callback
                    this.options.onDestroy.call(
                            this,
                            value,
                            text
                            );
                }
            }
        }

        BarRating.prototype.init = function (options, elem) {
            var self;
            self = this;
            self.elem = elem;
            return self.options = $.extend({}, $.fn.barrating.defaults, options);
        };
        return BarRating;
    })();
    $.fn.barrating = function (method, options) {
        return this.each(function () {
            var plugin = new BarRating();
            // plugin works with select fields
            if (!$(this).is('select')) {
                $.error('Sorry, this plugin only works with select fields.');
            }

            // method supplied
            if (plugin.hasOwnProperty(method)) {
                plugin.init(options, this);
                return plugin[method]();
                // no method supplied or only options supplied
            } else if (typeof method === 'object' || !method) {
                options = method;
                plugin.init(options, this);
                return plugin.show();
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.barrating');
            }

        });
    };
    return $.fn.barrating.defaults = {
        initialRating: null, // initial rating
        showValues: false, // display rating values on the bars?
        showSelectedRating: true, // append a div with a rating to the widget?
        reverse: false, // reverse the rating?
        readonly: false, // make the rating ready-only?
        onSelect: function (value, text) {
        }, // callback fired when a rating is selected
        onClear: function (value, text) {
        }, // callback fired when a rating is cleared
        onDestroy: function (value, text) {
        } // callback fired when a widget is destroyed
    };
})(jQuery);
/** * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com * Licensed under MIT * @author Ariel Flesler * @version 1.4.14 */;
(function (k) {
    'use strict';
    k(['jquery'], function ($) {
        var j = $.scrollTo = function (a, b, c) {
            return $(window).scrollTo(a, b, c)
        };
        j.defaults = {axis: 'xy', duration: 0, limit: !0};
        j.window = function (a) {
            return $(window)._scrollable()
        };
        $.fn._scrollable = function () {
            return this.map(function () {
                var a = this, isWin = !a.nodeName || $.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
                if (!isWin)
                    return a;
                var b = (a.contentWindow || a).document || a.ownerDocument || a;
                return/webkit/i.test(navigator.userAgent) || b.compatMode == 'BackCompat' ? b.body : b.documentElement
            })
        };
        $.fn.scrollTo = function (f, g, h) {
            if (typeof g == 'object') {
                h = g;
                g = 0
            }
            if (typeof h == 'function')
                h = {onAfter: h};
            if (f == 'max')
                f = 9e9;
            h = $.extend({}, j.defaults, h);
            g = g || h.duration;
            h.queue = h.queue && h.axis.length > 1;
            if (h.queue)
                g /= 2;
            h.offset = both(h.offset);
            h.over = both(h.over);
            return this._scrollable().each(function () {
                if (f == null)
                    return;
                var d = this, $elem = $(d), targ = f, toff, attr = {}, win = $elem.is('html,body');
                switch (typeof targ) {
                    case'number':
                    case'string':
                        if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
                            targ = both(targ);
                            break
                        }
                        targ = win ? $(targ) : $(targ, this);
                        if (!targ.length)
                            return;
                    case'object':
                        if (targ.is || targ.style)
                            toff = (targ = $(targ)).offset()
                }
                var e = $.isFunction(h.offset) && h.offset(d, targ) || h.offset;
                $.each(h.axis.split(''), function (i, a) {
                    var b = a == 'x' ? 'Left' : 'Top', pos = b.toLowerCase(), key = 'scroll' + b, old = d[key], max = j.max(d, a);
                    if (toff) {
                        attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);
                        if (h.margin) {
                            attr[key] -= parseInt(targ.css('margin' + b)) || 0;
                            attr[key] -= parseInt(targ.css('border' + b + 'Width')) || 0
                        }
                        attr[key] += e[pos] || 0;
                        if (h.over[pos])
                            attr[key] += targ[a == 'x' ? 'width' : 'height']() * h.over[pos]
                    } else {
                        var c = targ[pos];
                        attr[key] = c.slice && c.slice(-1) == '%' ? parseFloat(c) / 100 * max : c
                    }
                    if (h.limit && /^\d+$/.test(attr[key]))
                        attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
                    if (!i && h.queue) {
                        if (old != attr[key])
                            animate(h.onAfterFirst);
                        delete attr[key]
                    }
                });
                animate(h.onAfter);
                function animate(a) {
                    $elem.animate(attr, g, h.easing, a && function () {
                        a.call(this, targ, h)
                    })
                }}
            ).end()
        };
        j.max = function (a, b) {
            var c = b == 'x' ? 'Width' : 'Height', scroll = 'scroll' + c;
            if (!$(a).is('html,body'))
                return a[scroll] - $(a)[c.toLowerCase()]();
            var d = 'client' + c, html = a.ownerDocument.documentElement, body = a.ownerDocument.body;
            return Math.max(html[scroll], body[scroll]) - Math.min(html[d], body[d])
        };
        function both(a) {
            return $.isFunction(a) || $.isPlainObject(a) ? a : {top: a, left: a}
        }
        return j
    })
}(typeof define === 'function' && define.amd ? define : function (a, b) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = b(require('jquery'))
    } else {
        b(jQuery)
    }
}));

(function ($) {
    if (typeof $.fn.each2 == "undefined") {
        $.extend($.fn, {each2: function (c) {
                var j = $([0]), i = -1, l = this.length;
                while (++i < l && (j.context = j[0] = this[i]) && c.call(j[0], i, j) !== false)
                    ;
                return this;
            }});
    }
})(jQuery);
(function ($, undefined) {
    "use strict";
    if (window.Select2 !== undefined) {
        return;
    }
    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer, lastMousePosition = {x: 0, y: 0}, $document, scrollBarDimensions, KEY = {TAB: 9, ENTER: 13, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SHIFT: 16, CTRL: 17, ALT: 18, PAGE_UP: 33, PAGE_DOWN: 34, HOME: 36, END: 35, BACKSPACE: 8, DELETE: 46, isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
                case KEY.LEFT:
                case KEY.RIGHT:
                case KEY.UP:
                case KEY.DOWN:
                    return true;
            }
            return false;
        }, isControl: function (e) {
            var k = e.which;
            switch (k) {
                case KEY.SHIFT:
                case KEY.CTRL:
                case KEY.ALT:
                    return true;
            }
            if (e.metaKey)
                return true;
            return false;
        }, isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }}, MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>", DIACRITICS = {"\u24B6": "A", "\uFF21": "A", "\u00C0": "A", "\u00C1": "A", "\u00C2": "A", "\u1EA6": "A", "\u1EA4": "A", "\u1EAA": "A", "\u1EA8": "A", "\u00C3": "A", "\u0100": "A", "\u0102": "A", "\u1EB0": "A", "\u1EAE": "A", "\u1EB4": "A", "\u1EB2": "A", "\u0226": "A", "\u01E0": "A", "\u00C4": "A", "\u01DE": "A", "\u1EA2": "A", "\u00C5": "A", "\u01FA": "A", "\u01CD": "A", "\u0200": "A", "\u0202": "A", "\u1EA0": "A", "\u1EAC": "A", "\u1EB6": "A", "\u1E00": "A", "\u0104": "A", "\u023A": "A", "\u2C6F": "A", "\uA732": "AA", "\u00C6": "AE", "\u01FC": "AE", "\u01E2": "AE", "\uA734": "AO", "\uA736": "AU", "\uA738": "AV", "\uA73A": "AV", "\uA73C": "AY", "\u24B7": "B", "\uFF22": "B", "\u1E02": "B", "\u1E04": "B", "\u1E06": "B", "\u0243": "B", "\u0182": "B", "\u0181": "B", "\u24B8": "C", "\uFF23": "C", "\u0106": "C", "\u0108": "C", "\u010A": "C", "\u010C": "C", "\u00C7": "C", "\u1E08": "C", "\u0187": "C", "\u023B": "C", "\uA73E": "C", "\u24B9": "D", "\uFF24": "D", "\u1E0A": "D", "\u010E": "D", "\u1E0C": "D", "\u1E10": "D", "\u1E12": "D", "\u1E0E": "D", "\u0110": "D", "\u018B": "D", "\u018A": "D", "\u0189": "D", "\uA779": "D", "\u01F1": "DZ", "\u01C4": "DZ", "\u01F2": "Dz", "\u01C5": "Dz", "\u24BA": "E", "\uFF25": "E", "\u00C8": "E", "\u00C9": "E", "\u00CA": "E", "\u1EC0": "E", "\u1EBE": "E", "\u1EC4": "E", "\u1EC2": "E", "\u1EBC": "E", "\u0112": "E", "\u1E14": "E", "\u1E16": "E", "\u0114": "E", "\u0116": "E", "\u00CB": "E", "\u1EBA": "E", "\u011A": "E", "\u0204": "E", "\u0206": "E", "\u1EB8": "E", "\u1EC6": "E", "\u0228": "E", "\u1E1C": "E", "\u0118": "E", "\u1E18": "E", "\u1E1A": "E", "\u0190": "E", "\u018E": "E", "\u24BB": "F", "\uFF26": "F", "\u1E1E": "F", "\u0191": "F", "\uA77B": "F", "\u24BC": "G", "\uFF27": "G", "\u01F4": "G", "\u011C": "G", "\u1E20": "G", "\u011E": "G", "\u0120": "G", "\u01E6": "G", "\u0122": "G", "\u01E4": "G", "\u0193": "G", "\uA7A0": "G", "\uA77D": "G", "\uA77E": "G", "\u24BD": "H", "\uFF28": "H", "\u0124": "H", "\u1E22": "H", "\u1E26": "H", "\u021E": "H", "\u1E24": "H", "\u1E28": "H", "\u1E2A": "H", "\u0126": "H", "\u2C67": "H", "\u2C75": "H", "\uA78D": "H", "\u24BE": "I", "\uFF29": "I", "\u00CC": "I", "\u00CD": "I", "\u00CE": "I", "\u0128": "I", "\u012A": "I", "\u012C": "I", "\u0130": "I", "\u00CF": "I", "\u1E2E": "I", "\u1EC8": "I", "\u01CF": "I", "\u0208": "I", "\u020A": "I", "\u1ECA": "I", "\u012E": "I", "\u1E2C": "I", "\u0197": "I", "\u24BF": "J", "\uFF2A": "J", "\u0134": "J", "\u0248": "J", "\u24C0": "K", "\uFF2B": "K", "\u1E30": "K", "\u01E8": "K", "\u1E32": "K", "\u0136": "K", "\u1E34": "K", "\u0198": "K", "\u2C69": "K", "\uA740": "K", "\uA742": "K", "\uA744": "K", "\uA7A2": "K", "\u24C1": "L", "\uFF2C": "L", "\u013F": "L", "\u0139": "L", "\u013D": "L", "\u1E36": "L", "\u1E38": "L", "\u013B": "L", "\u1E3C": "L", "\u1E3A": "L", "\u0141": "L", "\u023D": "L", "\u2C62": "L", "\u2C60": "L", "\uA748": "L", "\uA746": "L", "\uA780": "L", "\u01C7": "LJ", "\u01C8": "Lj", "\u24C2": "M", "\uFF2D": "M", "\u1E3E": "M", "\u1E40": "M", "\u1E42": "M", "\u2C6E": "M", "\u019C": "M", "\u24C3": "N", "\uFF2E": "N", "\u01F8": "N", "\u0143": "N", "\u00D1": "N", "\u1E44": "N", "\u0147": "N", "\u1E46": "N", "\u0145": "N", "\u1E4A": "N", "\u1E48": "N", "\u0220": "N", "\u019D": "N", "\uA790": "N", "\uA7A4": "N", "\u01CA": "NJ", "\u01CB": "Nj", "\u24C4": "O", "\uFF2F": "O", "\u00D2": "O", "\u00D3": "O", "\u00D4": "O", "\u1ED2": "O", "\u1ED0": "O", "\u1ED6": "O", "\u1ED4": "O", "\u00D5": "O", "\u1E4C": "O", "\u022C": "O", "\u1E4E": "O", "\u014C": "O", "\u1E50": "O", "\u1E52": "O", "\u014E": "O", "\u022E": "O", "\u0230": "O", "\u00D6": "O", "\u022A": "O", "\u1ECE": "O", "\u0150": "O", "\u01D1": "O", "\u020C": "O", "\u020E": "O", "\u01A0": "O", "\u1EDC": "O", "\u1EDA": "O", "\u1EE0": "O", "\u1EDE": "O", "\u1EE2": "O", "\u1ECC": "O", "\u1ED8": "O", "\u01EA": "O", "\u01EC": "O", "\u00D8": "O", "\u01FE": "O", "\u0186": "O", "\u019F": "O", "\uA74A": "O", "\uA74C": "O", "\u01A2": "OI", "\uA74E": "OO", "\u0222": "OU", "\u24C5": "P", "\uFF30": "P", "\u1E54": "P", "\u1E56": "P", "\u01A4": "P", "\u2C63": "P", "\uA750": "P", "\uA752": "P", "\uA754": "P", "\u24C6": "Q", "\uFF31": "Q", "\uA756": "Q", "\uA758": "Q", "\u024A": "Q", "\u24C7": "R", "\uFF32": "R", "\u0154": "R", "\u1E58": "R", "\u0158": "R", "\u0210": "R", "\u0212": "R", "\u1E5A": "R", "\u1E5C": "R", "\u0156": "R", "\u1E5E": "R", "\u024C": "R", "\u2C64": "R", "\uA75A": "R", "\uA7A6": "R", "\uA782": "R", "\u24C8": "S", "\uFF33": "S", "\u1E9E": "S", "\u015A": "S", "\u1E64": "S", "\u015C": "S", "\u1E60": "S", "\u0160": "S", "\u1E66": "S", "\u1E62": "S", "\u1E68": "S", "\u0218": "S", "\u015E": "S", "\u2C7E": "S", "\uA7A8": "S", "\uA784": "S", "\u24C9": "T", "\uFF34": "T", "\u1E6A": "T", "\u0164": "T", "\u1E6C": "T", "\u021A": "T", "\u0162": "T", "\u1E70": "T", "\u1E6E": "T", "\u0166": "T", "\u01AC": "T", "\u01AE": "T", "\u023E": "T", "\uA786": "T", "\uA728": "TZ", "\u24CA": "U", "\uFF35": "U", "\u00D9": "U", "\u00DA": "U", "\u00DB": "U", "\u0168": "U", "\u1E78": "U", "\u016A": "U", "\u1E7A": "U", "\u016C": "U", "\u00DC": "U", "\u01DB": "U", "\u01D7": "U", "\u01D5": "U", "\u01D9": "U", "\u1EE6": "U", "\u016E": "U", "\u0170": "U", "\u01D3": "U", "\u0214": "U", "\u0216": "U", "\u01AF": "U", "\u1EEA": "U", "\u1EE8": "U", "\u1EEE": "U", "\u1EEC": "U", "\u1EF0": "U", "\u1EE4": "U", "\u1E72": "U", "\u0172": "U", "\u1E76": "U", "\u1E74": "U", "\u0244": "U", "\u24CB": "V", "\uFF36": "V", "\u1E7C": "V", "\u1E7E": "V", "\u01B2": "V", "\uA75E": "V", "\u0245": "V", "\uA760": "VY", "\u24CC": "W", "\uFF37": "W", "\u1E80": "W", "\u1E82": "W", "\u0174": "W", "\u1E86": "W", "\u1E84": "W", "\u1E88": "W", "\u2C72": "W", "\u24CD": "X", "\uFF38": "X", "\u1E8A": "X", "\u1E8C": "X", "\u24CE": "Y", "\uFF39": "Y", "\u1EF2": "Y", "\u00DD": "Y", "\u0176": "Y", "\u1EF8": "Y", "\u0232": "Y", "\u1E8E": "Y", "\u0178": "Y", "\u1EF6": "Y", "\u1EF4": "Y", "\u01B3": "Y", "\u024E": "Y", "\u1EFE": "Y", "\u24CF": "Z", "\uFF3A": "Z", "\u0179": "Z", "\u1E90": "Z", "\u017B": "Z", "\u017D": "Z", "\u1E92": "Z", "\u1E94": "Z", "\u01B5": "Z", "\u0224": "Z", "\u2C7F": "Z", "\u2C6B": "Z", "\uA762": "Z", "\u24D0": "a", "\uFF41": "a", "\u1E9A": "a", "\u00E0": "a", "\u00E1": "a", "\u00E2": "a", "\u1EA7": "a", "\u1EA5": "a", "\u1EAB": "a", "\u1EA9": "a", "\u00E3": "a", "\u0101": "a", "\u0103": "a", "\u1EB1": "a", "\u1EAF": "a", "\u1EB5": "a", "\u1EB3": "a", "\u0227": "a", "\u01E1": "a", "\u00E4": "a", "\u01DF": "a", "\u1EA3": "a", "\u00E5": "a", "\u01FB": "a", "\u01CE": "a", "\u0201": "a", "\u0203": "a", "\u1EA1": "a", "\u1EAD": "a", "\u1EB7": "a", "\u1E01": "a", "\u0105": "a", "\u2C65": "a", "\u0250": "a", "\uA733": "aa", "\u00E6": "ae", "\u01FD": "ae", "\u01E3": "ae", "\uA735": "ao", "\uA737": "au", "\uA739": "av", "\uA73B": "av", "\uA73D": "ay", "\u24D1": "b", "\uFF42": "b", "\u1E03": "b", "\u1E05": "b", "\u1E07": "b", "\u0180": "b", "\u0183": "b", "\u0253": "b", "\u24D2": "c", "\uFF43": "c", "\u0107": "c", "\u0109": "c", "\u010B": "c", "\u010D": "c", "\u00E7": "c", "\u1E09": "c", "\u0188": "c", "\u023C": "c", "\uA73F": "c", "\u2184": "c", "\u24D3": "d", "\uFF44": "d", "\u1E0B": "d", "\u010F": "d", "\u1E0D": "d", "\u1E11": "d", "\u1E13": "d", "\u1E0F": "d", "\u0111": "d", "\u018C": "d", "\u0256": "d", "\u0257": "d", "\uA77A": "d", "\u01F3": "dz", "\u01C6": "dz", "\u24D4": "e", "\uFF45": "e", "\u00E8": "e", "\u00E9": "e", "\u00EA": "e", "\u1EC1": "e", "\u1EBF": "e", "\u1EC5": "e", "\u1EC3": "e", "\u1EBD": "e", "\u0113": "e", "\u1E15": "e", "\u1E17": "e", "\u0115": "e", "\u0117": "e", "\u00EB": "e", "\u1EBB": "e", "\u011B": "e", "\u0205": "e", "\u0207": "e", "\u1EB9": "e", "\u1EC7": "e", "\u0229": "e", "\u1E1D": "e", "\u0119": "e", "\u1E19": "e", "\u1E1B": "e", "\u0247": "e", "\u025B": "e", "\u01DD": "e", "\u24D5": "f", "\uFF46": "f", "\u1E1F": "f", "\u0192": "f", "\uA77C": "f", "\u24D6": "g", "\uFF47": "g", "\u01F5": "g", "\u011D": "g", "\u1E21": "g", "\u011F": "g", "\u0121": "g", "\u01E7": "g", "\u0123": "g", "\u01E5": "g", "\u0260": "g", "\uA7A1": "g", "\u1D79": "g", "\uA77F": "g", "\u24D7": "h", "\uFF48": "h", "\u0125": "h", "\u1E23": "h", "\u1E27": "h", "\u021F": "h", "\u1E25": "h", "\u1E29": "h", "\u1E2B": "h", "\u1E96": "h", "\u0127": "h", "\u2C68": "h", "\u2C76": "h", "\u0265": "h", "\u0195": "hv", "\u24D8": "i", "\uFF49": "i", "\u00EC": "i", "\u00ED": "i", "\u00EE": "i", "\u0129": "i", "\u012B": "i", "\u012D": "i", "\u00EF": "i", "\u1E2F": "i", "\u1EC9": "i", "\u01D0": "i", "\u0209": "i", "\u020B": "i", "\u1ECB": "i", "\u012F": "i", "\u1E2D": "i", "\u0268": "i", "\u0131": "i", "\u24D9": "j", "\uFF4A": "j", "\u0135": "j", "\u01F0": "j", "\u0249": "j", "\u24DA": "k", "\uFF4B": "k", "\u1E31": "k", "\u01E9": "k", "\u1E33": "k", "\u0137": "k", "\u1E35": "k", "\u0199": "k", "\u2C6A": "k", "\uA741": "k", "\uA743": "k", "\uA745": "k", "\uA7A3": "k", "\u24DB": "l", "\uFF4C": "l", "\u0140": "l", "\u013A": "l", "\u013E": "l", "\u1E37": "l", "\u1E39": "l", "\u013C": "l", "\u1E3D": "l", "\u1E3B": "l", "\u017F": "l", "\u0142": "l", "\u019A": "l", "\u026B": "l", "\u2C61": "l", "\uA749": "l", "\uA781": "l", "\uA747": "l", "\u01C9": "lj", "\u24DC": "m", "\uFF4D": "m", "\u1E3F": "m", "\u1E41": "m", "\u1E43": "m", "\u0271": "m", "\u026F": "m", "\u24DD": "n", "\uFF4E": "n", "\u01F9": "n", "\u0144": "n", "\u00F1": "n", "\u1E45": "n", "\u0148": "n", "\u1E47": "n", "\u0146": "n", "\u1E4B": "n", "\u1E49": "n", "\u019E": "n", "\u0272": "n", "\u0149": "n", "\uA791": "n", "\uA7A5": "n", "\u01CC": "nj", "\u24DE": "o", "\uFF4F": "o", "\u00F2": "o", "\u00F3": "o", "\u00F4": "o", "\u1ED3": "o", "\u1ED1": "o", "\u1ED7": "o", "\u1ED5": "o", "\u00F5": "o", "\u1E4D": "o", "\u022D": "o", "\u1E4F": "o", "\u014D": "o", "\u1E51": "o", "\u1E53": "o", "\u014F": "o", "\u022F": "o", "\u0231": "o", "\u00F6": "o", "\u022B": "o", "\u1ECF": "o", "\u0151": "o", "\u01D2": "o", "\u020D": "o", "\u020F": "o", "\u01A1": "o", "\u1EDD": "o", "\u1EDB": "o", "\u1EE1": "o", "\u1EDF": "o", "\u1EE3": "o", "\u1ECD": "o", "\u1ED9": "o", "\u01EB": "o", "\u01ED": "o", "\u00F8": "o", "\u01FF": "o", "\u0254": "o", "\uA74B": "o", "\uA74D": "o", "\u0275": "o", "\u01A3": "oi", "\u0223": "ou", "\uA74F": "oo", "\u24DF": "p", "\uFF50": "p", "\u1E55": "p", "\u1E57": "p", "\u01A5": "p", "\u1D7D": "p", "\uA751": "p", "\uA753": "p", "\uA755": "p", "\u24E0": "q", "\uFF51": "q", "\u024B": "q", "\uA757": "q", "\uA759": "q", "\u24E1": "r", "\uFF52": "r", "\u0155": "r", "\u1E59": "r", "\u0159": "r", "\u0211": "r", "\u0213": "r", "\u1E5B": "r", "\u1E5D": "r", "\u0157": "r", "\u1E5F": "r", "\u024D": "r", "\u027D": "r", "\uA75B": "r", "\uA7A7": "r", "\uA783": "r", "\u24E2": "s", "\uFF53": "s", "\u00DF": "s", "\u015B": "s", "\u1E65": "s", "\u015D": "s", "\u1E61": "s", "\u0161": "s", "\u1E67": "s", "\u1E63": "s", "\u1E69": "s", "\u0219": "s", "\u015F": "s", "\u023F": "s", "\uA7A9": "s", "\uA785": "s", "\u1E9B": "s", "\u24E3": "t", "\uFF54": "t", "\u1E6B": "t", "\u1E97": "t", "\u0165": "t", "\u1E6D": "t", "\u021B": "t", "\u0163": "t", "\u1E71": "t", "\u1E6F": "t", "\u0167": "t", "\u01AD": "t", "\u0288": "t", "\u2C66": "t", "\uA787": "t", "\uA729": "tz", "\u24E4": "u", "\uFF55": "u", "\u00F9": "u", "\u00FA": "u", "\u00FB": "u", "\u0169": "u", "\u1E79": "u", "\u016B": "u", "\u1E7B": "u", "\u016D": "u", "\u00FC": "u", "\u01DC": "u", "\u01D8": "u", "\u01D6": "u", "\u01DA": "u", "\u1EE7": "u", "\u016F": "u", "\u0171": "u", "\u01D4": "u", "\u0215": "u", "\u0217": "u", "\u01B0": "u", "\u1EEB": "u", "\u1EE9": "u", "\u1EEF": "u", "\u1EED": "u", "\u1EF1": "u", "\u1EE5": "u", "\u1E73": "u", "\u0173": "u", "\u1E77": "u", "\u1E75": "u", "\u0289": "u", "\u24E5": "v", "\uFF56": "v", "\u1E7D": "v", "\u1E7F": "v", "\u028B": "v", "\uA75F": "v", "\u028C": "v", "\uA761": "vy", "\u24E6": "w", "\uFF57": "w", "\u1E81": "w", "\u1E83": "w", "\u0175": "w", "\u1E87": "w", "\u1E85": "w", "\u1E98": "w", "\u1E89": "w", "\u2C73": "w", "\u24E7": "x", "\uFF58": "x", "\u1E8B": "x", "\u1E8D": "x", "\u24E8": "y", "\uFF59": "y", "\u1EF3": "y", "\u00FD": "y", "\u0177": "y", "\u1EF9": "y", "\u0233": "y", "\u1E8F": "y", "\u00FF": "y", "\u1EF7": "y", "\u1E99": "y", "\u1EF5": "y", "\u01B4": "y", "\u024F": "y", "\u1EFF": "y", "\u24E9": "z", "\uFF5A": "z", "\u017A": "z", "\u1E91": "z", "\u017C": "z", "\u017E": "z", "\u1E93": "z", "\u1E95": "z", "\u01B6": "z", "\u0225": "z", "\u0240": "z", "\u2C6C": "z", "\uA763": "z", "\u0386": "\u0391", "\u0388": "\u0395", "\u0389": "\u0397", "\u038A": "\u0399", "\u03AA": "\u0399", "\u038C": "\u039F", "\u038E": "\u03A5", "\u03AB": "\u03A5", "\u038F": "\u03A9", "\u03AC": "\u03B1", "\u03AD": "\u03B5", "\u03AE": "\u03B7", "\u03AF": "\u03B9", "\u03CA": "\u03B9", "\u0390": "\u03B9", "\u03CC": "\u03BF", "\u03CD": "\u03C5", "\u03CB": "\u03C5", "\u03B0": "\u03C5", "\u03C9": "\u03C9", "\u03C2": "\u03C3"};
    $document = $(document);
    nextUid = (function () {
        var counter = 1;
        return function () {
            return counter++;
        };
    }());
    function reinsertElement(element) {
        var placeholder = $(document.createTextNode(''));
        element.before(placeholder);
        placeholder.before(element);
        placeholder.remove();
    }
    function stripDiacritics(str) {
        function match(a) {
            return DIACRITICS[a] || a;
        }
        return str.replace(/[^\u0000-\u007E]/g, match);
    }
    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i]))
                return i;
        }
        return-1;
    }
    function measureScrollbar() {
        var $template = $(MEASURE_SCROLLBAR_TEMPLATE);
        $template.appendTo('body');
        var dim = {width: $template.width() - $template[0].clientWidth, height: $template.height() - $template[0].clientHeight};
        $template.remove();
        return dim;
    }
    function equal(a, b) {
        if (a === b)
            return true;
        if (a === undefined || b === undefined)
            return false;
        if (a === null || b === null)
            return false;
        if (a.constructor === String)
            return a + '' === b + '';
        if (b.constructor === String)
            return b + '' === a + '';
        return false;
    }
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1)
            return[];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1)
            val[i] = $.trim(val[i]);
        return val;
    }
    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }
    function installKeyUpChangeEvent(element) {
        var key = "keyup-change-value";
        element.on("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.on("keyup", function () {
            var val = $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }
    function installFilteredMouseMove(element) {
        element.on("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }
    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) {
            element.trigger("scroll-debounced", e);
        });
        element.on("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0)
                notify(e);
        });
    }
    function focus($el) {
        if ($el[0] === document.activeElement)
            return;
        window.setTimeout(function () {
            var el = $el[0], pos = $el.val().length, range;
            $el.focus();
            var isVisible = (el.offsetWidth > 0 || el.offsetHeight > 0);
            if (isVisible && el === document.activeElement) {
                if (el.setSelectionRange) {
                    el.setSelectionRange(pos, pos);
                } else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }
    function getCursorInfo(el) {
        el = $(el)[0];
        var offset = 0;
        var length = 0;
        if ('selectionStart'in el) {
            offset = el.selectionStart;
            length = el.selectionEnd - offset;
        } else if ('selection'in document) {
            el.focus();
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            offset = sel.text.length - length;
        }
        return{offset: offset, length: length};
    }
    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
    function measureTextWidth(e) {
        if (!sizer) {
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $(document.createElement("div")).css({position: "absolute", left: "-10000px", top: "-10000px", display: "none", fontSize: style.fontSize, fontFamily: style.fontFamily, fontStyle: style.fontStyle, fontWeight: style.fontWeight, letterSpacing: style.letterSpacing, textTransform: style.textTransform, whiteSpace: "nowrap"});
            sizer.attr("class", "select2-sizer");
            $("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }
    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;
        classes = $.trim(dest.attr("class"));
        if (classes) {
            classes = '' + classes;
            $(classes.split(/\s+/)).each2(function () {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }
        classes = $.trim(src.attr("class"));
        if (classes) {
            classes = '' + classes;
            $(classes.split(/\s+/)).each2(function () {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);
                    if (adapted) {
                        replacements.push(adapted);
                    }
                }
            });
        }
        dest.attr("class", replacements.join(" "));
    }
    function markMatch(text, term, markup, escapeMarkup) {
        var match = stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())), tl = term.length;
        if (match < 0) {
            markup.push(escapeMarkup(text));
            return;
        }
        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }
    function defaultEscapeMarkup(markup) {
        var replace_map = {'\\': '&#92;', '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', "/": '&#47;'};
        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
            return replace_map[match];
        });
    }
    function ajax(options) {
        var timeout, handler = null, quietMillis = options.quietMillis || 100, ajaxUrl = options.url, self = this;
        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                var data = options.data, url = ajaxUrl, transport = options.transport || $.fn.select2.ajaxDefaults.transport, deprecated = {type: options.type || 'GET', cache: options.cache || false, jsonpCallback: options.jsonpCallback || undefined, dataType: options.dataType || "json"}, params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);
                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;
                if (handler && typeof handler.abort === "function") {
                    handler.abort();
                }
                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }
                $.extend(params, {url: url, dataType: options.dataType, data: data, success: function (data) {
                        var results = options.results(data, query.page, query);
                        query.callback(results);
                    }, error: function (jqXHR, textStatus, errorThrown) {
                        var results = {hasError: true, jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown, };
                        query.callback(results);
                    }});
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }
    function local(options) {
        var data = options, dataText, tmp, text = function (item) {
            return"" + item.text;
        };
        if ($.isArray(data)) {
            tmp = data;
            data = {results: tmp};
        }
        if ($.isFunction(data) === false) {
            tmp = data;
            data = function () {
                return tmp;
            };
        }
        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            if (!$.isFunction(text)) {
                dataText = dataItem.text;
                text = function (item) {
                    return item[dataText];
                };
            }
        }
        return function (query) {
            var t = query.term, filtered = {results: []}, process;
            if (t === "") {
                query.callback(data());
                return;
            }
            process = function (datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr))
                            group[attr] = datum[attr];
                    }
                    group.children = [];
                    $(datum.children).each2(function (i, childDatum) {
                        process(childDatum, group.children);
                    });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };
            $(data().results).each2(function (i, datum) {
                process(datum, filtered.results);
            });
            query.callback(filtered);
        };
    }
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            var result = isFunc ? data(query) : data;
            if ($.isArray(result)) {
                $(result).each(function () {
                    var isObject = this.text !== undefined, text = isObject ? this.text : this;
                    if (t === "" || query.matcher(t, text)) {
                        filtered.results.push(isObject ? this : {id: this, text: this});
                    }
                });
                query.callback(filtered);
            }
        };
    }
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter))
            return true;
        if (!formatter)
            return false;
        if (typeof (formatter) === 'string')
            return true;
        throw new Error(formatterName + " must be a string, function, or falsy value");
    }
    function evaluate(val, context) {
        if ($.isFunction(val)) {
            var args = Array.prototype.slice.call(arguments, 2);
            return val.apply(context, args);
        }
        return val;
    }
    function countResults(results) {
        var count = 0;
        $.each(results, function (i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, dupe = false, token, index, i, l, separator;
        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1)
            return undefined;
        while (true) {
            index = -1;
            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0)
                    break;
            }
            if (index < 0)
                break;
            token = input.substring(0, index);
            input = input.substring(index + separator.length);
            if (token.length > 0) {
                token = opts.createSearchChoice.call(this, token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true;
                            break;
                        }
                    }
                    if (!dupe)
                        selectCallback(token);
                }
            }
        }
        if (original !== input)
            return input;
    }
    function cleanupJQueryElements() {
        var self = this;
        $.each(arguments, function (i, element) {
            self[element].remove();
            self[element] = null;
        });
    }
    function clazz(SuperClass, methods) {
        var constructor = function () {
        };
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }
    AbstractSelect2 = clazz(Object, {bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        }, init: function (opts) {
            var results, search, resultsSelector = ".select2-results";
            this.opts = opts = this.prepareOpts(opts);
            this.id = opts.id;
            if (opts.element.data("select2") !== undefined && opts.element.data("select2") !== null) {
                opts.element.data("select2").destroy();
            }
            this.container = this.createContainer();
            this.liveRegion = $("<span>", {role: "status", "aria-live": "polite"}).addClass("select2-hidden-accessible").appendTo(document.body);
            this.containerId = "s2id_" + (opts.element.attr("id") || "autogen" + nextUid());
            this.containerEventName = this.containerId.replace(/([.])/g, '_').replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);
            this.container.attr("title", opts.element.attr("title"));
            this.body = $("body");
            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
            this.container.attr("style", opts.element.attr("style"));
            this.container.css(evaluate(opts.containerCss, this.opts.element));
            this.container.addClass(evaluate(opts.containerCssClass, this.opts.element));
            this.elementTabIndex = this.opts.element.attr("tabindex");
            this.opts.element.data("select2", this).attr("tabindex", "-1").before(this.container).on("click.select2", killEvent);
            this.container.data("select2", this);
            this.dropdown = this.container.find(".select2-drop");
            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
            this.dropdown.addClass(evaluate(opts.dropdownCssClass, this.opts.element));
            this.dropdown.data("select2", this);
            this.dropdown.on("click", killEvent);
            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");
            this.queryCount = 0;
            this.resultsPage = 0;
            this.context = null;
            this.initContainer();
            this.container.on("click", killEvent);
            installFilteredMouseMove(this.results);
            this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent));
            this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function (event) {
                this._touchEvent = true;
                this.highlightUnderEvent(event);
            }));
            this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved));
            this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved));
            this.dropdown.on('click', this.bind(function (event) {
                if (this._touchEvent) {
                    this._touchEvent = false;
                    this.selectHighlighted();
                }
            }));
            installDebouncedScroll(80, this.results);
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));
            $(this.container).on("change", ".select2-input", function (e) {
                e.stopPropagation();
            });
            $(this.dropdown).on("change", ".select2-input", function (e) {
                e.stopPropagation();
            });
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop();
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }
            installKeyUpChangeEvent(search);
            search.on("keyup-change input paste", this.bind(this.updateResults));
            search.on("focus", function () {
                search.addClass("select2-focused");
            });
            search.on("blur", function () {
                search.removeClass("select2-focused");
            });
            this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));
            this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function (e) {
                e.stopPropagation();
            });
            this.nextSearchTerm = undefined;
            if ($.isFunction(this.opts.initSelection)) {
                this.initSelection();
                this.monitorSource();
            }
            if (opts.maximumInputLength !== null) {
                this.search.attr("maxlength", opts.maximumInputLength);
            }
            var disabled = opts.element.prop("disabled");
            if (disabled === undefined)
                disabled = false;
            this.enable(!disabled);
            var readonly = opts.element.prop("readonly");
            if (readonly === undefined)
                readonly = false;
            this.readonly(readonly);
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();
            this.autofocus = opts.element.prop("autofocus");
            opts.element.prop("autofocus", false);
            if (this.autofocus)
                this.focus();
            this.search.attr("placeholder", opts.searchInputPlaceholder);
        }, destroy: function () {
            var element = this.opts.element, select2 = element.data("select2"), self = this;
            this.close();
            if (element.length && element[0].detachEvent) {
                element.each(function () {
                    this.detachEvent("onpropertychange", self._sync);
                });
            }
            if (this.propertyObserver) {
                this.propertyObserver.disconnect();
                this.propertyObserver = null;
            }
            this._sync = null;
            if (select2 !== undefined) {
                select2.container.remove();
                select2.liveRegion.remove();
                select2.dropdown.remove();
                element.removeClass("select2-offscreen").removeData("select2").off(".select2").prop("autofocus", this.autofocus || false);
                if (this.elementTabIndex) {
                    element.attr({tabindex: this.elementTabIndex});
                } else {
                    element.removeAttr("tabindex");
                }
                element.show();
            }
            cleanupJQueryElements.call(this, "container", "liveRegion", "dropdown", "results", "search");
        }, optionToData: function (element) {
            if (element.is("option")) {
                return{id: element.prop("value"), text: element.text(), element: element.get(), css: element.attr("class"), disabled: element.prop("disabled"), locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)};
            } else if (element.is("optgroup")) {
                return{text: element.attr("label"), children: [], element: element.get(), css: element.attr("class")};
            }
        }, prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl, self = this;
            element = opts.element;
            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }
            if (select) {
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }
            opts = $.extend({}, {populateResults: function (container, results, query) {
                    var populate, id = this.opts.id, liveRegion = this.liveRegion;
                    populate = function (results, container, depth) {
                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;
                        results = opts.sortResults(results, container, query);
                        var nodes = [];
                        for (i = 0, l = results.length; i < l; i = i + 1) {
                            result = results[i];
                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);
                            compound = result.children && result.children.length > 0;
                            node = $("<li></li>");
                            node.addClass("select2-results-dept-" + depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) {
                                node.addClass("select2-disabled");
                            }
                            if (compound) {
                                node.addClass("select2-result-with-children");
                            }
                            node.addClass(self.opts.formatResultCssClass(result));
                            node.attr("role", "presentation");
                            label = $(document.createElement("div"));
                            label.addClass("select2-result-label");
                            label.attr("id", "select2-result-label-" + nextUid());
                            label.attr("role", "option");
                            formatted = opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted !== undefined) {
                                label.html(formatted);
                                node.append(label);
                            }
                            if (compound) {
                                innerContainer = $("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth + 1);
                                node.append(innerContainer);
                            }
                            node.data("select2-data", result);
                            nodes.push(node[0]);
                        }
                        container.append(nodes);
                        liveRegion.text(opts.formatMatches(results.length));
                    };
                    populate(results, container, 0);
                }}, $.fn.select2.defaults, opts);
            if (typeof (opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) {
                    return e[idKey];
                };
            }
            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags"in opts) {
                    throw"tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags = opts.element.data("select2Tags");
            }
            if (select) {
                opts.query = this.bind(function (query) {
                    var data = {results: [], more: false}, term = query.term, children, placeholderOption, process;
                    process = function (element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push(self.optionToData(element));
                            }
                        } else if (element.is("optgroup")) {
                            group = self.optionToData(element);
                            element.children().each2(function (i, elm) {
                                process(elm, group.children);
                            });
                            if (group.children.length > 0) {
                                collection.push(group);
                            }
                        }
                    };
                    children = element.children();
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        placeholderOption = this.getPlaceholderOption();
                        if (placeholderOption) {
                            children = children.not(placeholderOption);
                        }
                    }
                    children.each2(function (i, elm) {
                        process(elm, data.results);
                    });
                    query.callback(data);
                });
                opts.id = function (e) {
                    return e.id;
                };
            } else {
                if (!("query"in opts)) {
                    if ("ajax"in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data"in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags"in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) {
                                return{id: $.trim(term), text: $.trim(term)};
                            };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator)).each(function () {
                                    var obj = {id: this, text: this}, tags = opts.tags;
                                    if ($.isFunction(tags))
                                        tags = tags();
                                    $(tags).each(function () {
                                        if (equal(this.id, obj.id)) {
                                            obj = this;
                                            return false;
                                        }
                                    });
                                    data.push(obj);
                                });
                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof (opts.query) !== "function") {
                throw"query function not defined for Select2 " + opts.element.attr("id");
            }
            if (opts.createSearchChoicePosition === 'top') {
                opts.createSearchChoicePosition = function (list, item) {
                    list.unshift(item);
                };
            } else if (opts.createSearchChoicePosition === 'bottom') {
                opts.createSearchChoicePosition = function (list, item) {
                    list.push(item);
                };
            } else if (typeof (opts.createSearchChoicePosition) !== "function") {
                throw"invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
            }
            return opts;
        }, monitorSource: function () {
            var el = this.opts.element, observer, self = this;
            el.on("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));
            this._sync = this.bind(function () {
                var disabled = el.prop("disabled");
                if (disabled === undefined)
                    disabled = false;
                this.enable(!disabled);
                var readonly = el.prop("readonly");
                if (readonly === undefined)
                    readonly = false;
                this.readonly(readonly);
                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.addClass(evaluate(this.opts.containerCssClass, this.opts.element));
                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass, this.opts.element));
            });
            if (el.length && el[0].attachEvent) {
                el.each(function () {
                    this.attachEvent("onpropertychange", self._sync);
                });
            }
            observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            if (observer !== undefined) {
                if (this.propertyObserver) {
                    delete this.propertyObserver;
                    this.propertyObserver = null;
                }
                this.propertyObserver = new observer(function (mutations) {
                    $.each(mutations, self._sync);
                });
                this.propertyObserver.observe(el.get(0), {attributes: true, subtree: false});
            }
        }, triggerSelect: function (data) {
            var evt = $.Event("select2-selecting", {val: this.id(data), object: data, choice: data});
            this.opts.element.trigger(evt);
            return!evt.isDefaultPrevented();
        }, triggerChange: function (details) {
            details = details || {};
            details = $.extend({}, details, {type: "change", val: this.val()});
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);
            this.opts.element.click();
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        }, isInterfaceEnabled: function () {
            return this.enabledInterface === true;
        }, enableInterface: function () {
            var enabled = this._enabled && !this._readonly, disabled = !enabled;
            if (enabled === this.enabledInterface)
                return false;
            this.container.toggleClass("select2-container-disabled", disabled);
            this.close();
            this.enabledInterface = enabled;
            return true;
        }, enable: function (enabled) {
            if (enabled === undefined)
                enabled = true;
            if (this._enabled === enabled)
                return;
            this._enabled = enabled;
            this.opts.element.prop("disabled", !enabled);
            this.enableInterface();
        }, disable: function () {
            this.enable(false);
        }, readonly: function (enabled) {
            if (enabled === undefined)
                enabled = false;
            if (this._readonly === enabled)
                return;
            this._readonly = enabled;
            this.opts.element.prop("readonly", enabled);
            this.enableInterface();
        }, opened: function () {
            return(this.container) ? this.container.hasClass("select2-dropdown-open") : false;
        }, positionDropdown: function () {
            var $dropdown = this.dropdown, offset = this.container.offset(), height = this.container.outerHeight(false), width = this.container.outerWidth(false), dropHeight = $dropdown.outerHeight(false), $window = $(window), windowWidth = $window.width(), windowHeight = $window.height(), viewPortRight = $window.scrollLeft() + windowWidth, viewportBottom = $window.scrollTop() + windowHeight, dropTop = offset.top + height, dropLeft = offset.left, enoughRoomBelow = dropTop + dropHeight <= viewportBottom, enoughRoomAbove = (offset.top - dropHeight) >= $window.scrollTop(), dropWidth = $dropdown.outerWidth(false), enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight, aboveNow = $dropdown.hasClass("select2-drop-above"), bodyOffset, above, changeDirection, css, resultsListNode;
            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) {
                    changeDirection = true;
                    above = false;
                }
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) {
                    changeDirection = true;
                    above = true;
                }
            }
            if (changeDirection) {
                $dropdown.hide();
                offset = this.container.offset();
                height = this.container.outerHeight(false);
                width = this.container.outerWidth(false);
                dropHeight = $dropdown.outerHeight(false);
                viewPortRight = $window.scrollLeft() + windowWidth;
                viewportBottom = $window.scrollTop() + windowHeight;
                dropTop = offset.top + height;
                dropLeft = offset.left;
                dropWidth = $dropdown.outerWidth(false);
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
                $dropdown.show();
                this.focusSearch();
            }
            if (this.opts.dropdownAutoWidth) {
                resultsListNode = $('.select2-results', $dropdown)[0];
                $dropdown.addClass('select2-drop-auto-width');
                $dropdown.css('width', '');
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;
                dropHeight = $dropdown.outerHeight(false);
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
            } else {
                this.container.removeClass('select2-drop-auto-width');
            }
            if (this.body.css('position') !== 'static') {
                bodyOffset = this.body.offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }
            if (!enoughRoomOnRight) {
                dropLeft = offset.left + this.container.outerWidth(false) - dropWidth;
            }
            css = {left: dropLeft, width: width};
            if (above) {
                css.top = offset.top - dropHeight;
                css.bottom = 'auto';
                this.container.addClass("select2-drop-above");
                $dropdown.addClass("select2-drop-above");
            } else {
                css.top = dropTop;
                css.bottom = 'auto';
                this.container.removeClass("select2-drop-above");
                $dropdown.removeClass("select2-drop-above");
            }
            css = $.extend(css, evaluate(this.opts.dropdownCss, this.opts.element));
            $dropdown.css(css);
        }, shouldOpen: function () {
            var event;
            if (this.opened())
                return false;
            if (this._enabled === false || this._readonly === true)
                return false;
            event = $.Event("select2-opening");
            this.opts.element.trigger(event);
            return!event.isDefaultPrevented();
        }, clearDropdownAlignmentPreference: function () {
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        }, open: function () {
            if (!this.shouldOpen())
                return false;
            this.opening();
            $document.on("mousemove.select2Event", function (e) {
                lastMousePosition.x = e.pageX;
                lastMousePosition.y = e.pageY;
            });
            return true;
        }, opening: function () {
            var cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid, mask;
            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");
            this.clearDropdownAlignmentPreference();
            if (this.dropdown[0] !== this.body.children().last()[0]) {
                this.dropdown.detach().appendTo(this.body);
            }
            mask = $("#select2-drop-mask");
            if (mask.length == 0) {
                mask = $(document.createElement("div"));
                mask.attr("id", "select2-drop-mask").attr("class", "select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body);
                mask.on("mousedown touchstart click", function (e) {
                    reinsertElement(mask);
                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self = dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");
            mask.show();
            this.positionDropdown();
            this.dropdown.show();
            this.positionDropdown();
            this.dropdown.addClass("select2-drop-active");
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).on(resize + " " + scroll + " " + orient, function (e) {
                    if (that.opened())
                        that.positionDropdown();
                });
            });
        }, close: function () {
            if (!this.opened())
                return;
            var cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid;
            this.container.parents().add(window).each(function () {
                $(this).off(scroll).off(resize).off(orient);
            });
            this.clearDropdownAlignmentPreference();
            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id");
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();
            $document.off("mousemove.select2Event");
            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("select2-close"));
        }, externalSearch: function (term) {
            this.open();
            this.search.val(term);
            this.updateResults(false);
        }, clearSearch: function () {
        }, getMaximumSelectionSize: function () {
            return evaluate(this.opts.maximumSelectionSize, this.opts.element);
        }, ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more, topOffset;
            index = this.highlight();
            if (index < 0)
                return;
            if (index == 0) {
                results.scrollTop(0);
                return;
            }
            children = this.findHighlightableChoices().find('.select2-result-label');
            child = $(children[index]);
            topOffset = (child.offset() || {}).top || 0;
            hb = topOffset + child.outerHeight(true);
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }
            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = topOffset - results.offset().top;
            if (y < 0 && child.css('display') != 'none') {
                results.scrollTop(results.scrollTop() + y);
            }
        }, findHighlightableChoices: function () {
            return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
        }, moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(), index = this.highlight();
            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        }, highlight: function (index) {
            var choices = this.findHighlightableChoices(), choice, data;
            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }
            if (index >= choices.length)
                index = choices.length - 1;
            if (index < 0)
                index = 0;
            this.removeHighlight();
            choice = $(choices[index]);
            choice.addClass("select2-highlighted");
            this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id"));
            this.ensureHighlightVisible();
            this.liveRegion.text(choice.text());
            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({type: "select2-highlight", val: this.id(data), choice: data});
            }
        }, removeHighlight: function () {
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");
        }, touchMoved: function () {
            this._touchMoved = true;
        }, clearTouchMoved: function () {
            this._touchMoved = false;
        }, countSelectableResults: function () {
            return this.findHighlightableChoices().length;
        }, highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
                var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                this.removeHighlight();
            }
        }, loadMoreIfNeeded: function () {
            var results = this.results, more = results.find("li.select2-more-results"), below, page = this.resultsPage + 1, self = this, term = this.search.val(), context = this.context;
            if (more.length === 0)
                return;
            below = more.offset().top - results.offset().top - results.height();
            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({element: this.opts.element, term: term, page: page, context: context, matcher: this.opts.matcher, callback: this.bind(function (data) {
                        if (!self.opened())
                            return;
                        self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context: context});
                        self.postprocessResults(data, false, false);
                        if (data.more === true) {
                            more.detach().appendTo(results).text(evaluate(self.opts.formatLoadMore, self.opts.element, page + 1));
                            window.setTimeout(function () {
                                self.loadMoreIfNeeded();
                            }, 10);
                        } else {
                            more.remove();
                        }
                        self.positionDropdown();
                        self.resultsPage = page;
                        self.context = data.context;
                        this.opts.element.trigger({type: "select2-loaded", items: data});
                    })});
            }
        }, tokenize: function () {
        }, updateResults: function (initial) {
            var search = this.search, results = this.results, opts = this.opts, data, self = this, input, term = search.val(), lastTerm = $.data(this.container, "select2-last-term"), queryNumber;
            if (initial !== true && lastTerm && equal(term, lastTerm))
                return;
            $.data(this.container, "select2-last-term", term);
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }
            function postRender() {
                search.removeClass("select2-active");
                self.positionDropdown();
                if (results.find('.select2-no-results,.select2-selection-limit,.select2-searching').length) {
                    self.liveRegion.text(results.text());
                } else {
                    self.liveRegion.text(self.opts.formatMatches(results.find('.select2-result-selectable').length));
                }
            }
            function render(html) {
                results.html(html);
                postRender();
            }
            queryNumber = ++this.queryCount;
            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >= 1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, opts.element, maxSelSize) + "</li>");
                    return;
                }
            }
            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, opts.element, search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                if (initial && this.showSearch)
                    this.showSearch(true);
                return;
            }
            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, opts.element, search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }
            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + evaluate(opts.formatSearching, opts.element) + "</li>");
            }
            search.addClass("select2-active");
            this.removeHighlight();
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }
            this.resultsPage = 1;
            opts.query({element: opts.element, term: search.val(), page: this.resultsPage, context: null, matcher: opts.matcher, callback: this.bind(function (data) {
                    var def;
                    if (queryNumber != this.queryCount) {
                        return;
                    }
                    if (!this.opened()) {
                        this.search.removeClass("select2-active");
                        return;
                    }
                    if (data.hasError !== undefined && checkFormatter(opts.formatAjaxError, "formatAjaxError")) {
                        render("<li class='select2-ajax-error'>" + evaluate(opts.formatAjaxError, opts.element, data.jqXHR, data.textStatus, data.errorThrown) + "</li>");
                        return;
                    }
                    this.context = (data.context === undefined) ? null : data.context;
                    if (this.opts.createSearchChoice && search.val() !== "") {
                        def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                        if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                            if ($(data.results).filter(function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                                this.opts.createSearchChoicePosition(data.results, def);
                            }
                        }
                    }
                    if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                        render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, opts.element, search.val()) + "</li>");
                        return;
                    }
                    results.empty();
                    self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context: null});
                    if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                        results.append("<li class='select2-more-results'>" + opts.escapeMarkup(evaluate(opts.formatLoadMore, opts.element, this.resultsPage)) + "</li>");
                        window.setTimeout(function () {
                            self.loadMoreIfNeeded();
                        }, 10);
                    }
                    this.postprocessResults(data, initial);
                    postRender();
                    this.opts.element.trigger({type: "select2-loaded", items: data});
                })});
        }, cancel: function () {
            this.close();
        }, blur: function () {
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});
            this.close();
            this.container.removeClass("select2-container-active");
            if (this.search[0] === document.activeElement) {
                this.search.blur();
            }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        }, focusSearch: function () {
            focus(this.search);
        }, selectHighlighted: function (options) {
            if (this._touchMoved) {
                this.clearTouchMoved();
                return;
            }
            var index = this.highlight(), highlighted = this.results.find(".select2-highlighted"), data = highlighted.closest('.select2-result').data("select2-data");
            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            } else if (options && options.noFocus) {
                this.close();
            }
        }, getPlaceholder: function () {
            var placeholderOption;
            return this.opts.element.attr("placeholder") || this.opts.element.attr("data-placeholder") || this.opts.element.data("placeholder") || this.opts.placeholder || ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
        }, getPlaceholderOption: function () {
            if (this.select) {
                var firstOption = this.select.children('option').first();
                if (this.opts.placeholderOption !== undefined) {
                    return(this.opts.placeholderOption === "first" && firstOption) || (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
                } else if ($.trim(firstOption.text()) === "" && firstOption.val() === "") {
                    return firstOption;
                }
            }
        }, initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l, attr;
                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element") {
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            attr = attrs[i].replace(/\s/g, '');
                            matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }
                    if (this.opts.width === "resolve") {
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0)
                            return style;
                        return(this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }
                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
                }
            }
            ;
            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }});
    SingleSelect2 = clazz(AbstractSelect2, {createContainer: function () {
            var container = $(document.createElement("div")).attr({"class": "select2-container"}).html(["<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>", " <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>", " <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>", "</a>", "<label for='' class='select2-offscreen'></label>", "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />", "<div class='select2-drop select2-display-none'>", " <div class='select2-search'>", " <label for='' class='select2-offscreen'></label>", " <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'", " aria-autocomplete='list' />", " </div>", " <ul class='select2-results' role='listbox'>", " </ul>", "</div>"].join(""));
            return container;
        }, enableInterface: function () {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.focusser.prop("disabled", !this.isInterfaceEnabled());
            }
        }, opening: function () {
            var el, range, len;
            if (this.opts.minimumResultsForSearch >= 0) {
                this.showSearch(true);
            }
            this.parent.opening.apply(this, arguments);
            if (this.showSearchInput !== false) {
                this.search.val(this.focusser.val());
            }
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
                el = this.search.get(0);
                if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                } else if (el.setSelectionRange) {
                    len = this.search.val().length;
                    el.setSelectionRange(len, len);
                }
            }
            if (this.search.val() === "") {
                if (this.nextSearchTerm != undefined) {
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }
            this.focusser.prop("disabled", true).val("");
            this.updateResults(true);
            this.opts.element.trigger($.Event("select2-open"));
        }, close: function () {
            if (!this.opened())
                return;
            this.parent.close.apply(this, arguments);
            this.focusser.prop("disabled", false);
            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        }, focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            }
        }, isFocused: function () {
            return this.container.hasClass("select2-container-active");
        }, cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.prop("disabled", false);
            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        }, destroy: function () {
            $("label[for='" + this.focusser.attr('id') + "']").attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);
            cleanupJQueryElements.call(this, "selection", "focusser");
        }, initContainer: function () {
            var selection, container = this.container, dropdown = this.dropdown, idSuffix = nextUid(), elementLabel;
            if (this.opts.minimumResultsForSearch < 0) {
                this.showSearch(false);
            } else {
                this.showSearch(true);
            }
            this.selection = selection = container.find(".select2-choice");
            this.focusser = container.find(".select2-focusser");
            selection.find(".select2-chosen").attr("id", "select2-chosen-" + idSuffix);
            this.focusser.attr("aria-labelledby", "select2-chosen-" + idSuffix);
            this.results.attr("id", "select2-results-" + idSuffix);
            this.search.attr("aria-owns", "select2-results-" + idSuffix);
            this.focusser.attr("id", "s2id_autogen" + idSuffix);
            elementLabel = $("label[for='" + this.opts.element.attr("id") + "']");
            this.focusser.prev().text(elementLabel.text()).attr('for', this.focusser.attr('id'));
            var originalTitle = this.opts.element.attr("title");
            this.opts.element.attr("title", (originalTitle || elementLabel.text()));
            this.focusser.attr("tabindex", this.elementTabIndex);
            this.search.attr("id", this.focusser.attr('id') + '_search');
            this.search.prev().text($("label[for='" + this.focusser.attr('id') + "']").text()).attr('for', this.search.attr('id'));
            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled())
                    return;
                if (229 == e.keyCode)
                    return;
                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    killEvent(e);
                    return;
                }
                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus: true});
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
            }));
            this.search.on("blur", this.bind(function (e) {
                if (document.activeElement === this.body.get(0)) {
                    window.setTimeout(this.bind(function () {
                        if (this.opened()) {
                            this.search.focus();
                        }
                    }), 0);
                }
            }));
            this.focusser.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled())
                    return;
                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }
                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }
                if (e.which == KEY.DOWN || e.which == KEY.UP || (e.which == KEY.ENTER && this.opts.openOnEnter)) {
                    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey)
                        return;
                    this.open();
                    killEvent(e);
                    return;
                }
                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));
            installKeyUpChangeEvent(this.focusser);
            this.focusser.on("keyup-change input", this.bind(function (e) {
                if (this.opts.minimumResultsForSearch >= 0) {
                    e.stopPropagation();
                    if (this.opened())
                        return;
                    this.open();
                }
            }));
            selection.on("mousedown touchstart", "abbr", this.bind(function (e) {
                if (!this.isInterfaceEnabled())
                    return;
                this.clear();
                killEventImmediately(e);
                this.close();
                this.selection.focus();
            }));
            selection.on("mousedown touchstart", this.bind(function (e) {
                reinsertElement(selection);
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                if (this.opened()) {
                    this.close();
                } else if (this.isInterfaceEnabled()) {
                    this.open();
                }
                killEvent(e);
            }));
            dropdown.on("mousedown touchstart", this.bind(function () {
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                }
            }));
            selection.on("focus", this.bind(function (e) {
                killEvent(e);
            }));
            this.focusser.on("focus", this.bind(function () {
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            })).on("blur", this.bind(function () {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                    this.opts.element.trigger($.Event("select2-blur"));
                }
            }));
            this.search.on("focus", this.bind(function () {
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            }));
            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.setPlaceholder();
        }, clear: function (triggerChange) {
            var data = this.selection.data("select2-data");
            if (data) {
                var evt = $.Event("select2-clearing");
                this.opts.element.trigger(evt);
                if (evt.isDefaultPrevented()) {
                    return;
                }
                var placeholderOption = this.getPlaceholderOption();
                this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                this.selection.find(".select2-chosen").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();
                if (triggerChange !== false) {
                    this.opts.element.trigger({type: "select2-removed", val: this.id(data), choice: data});
                    this.triggerChange({removed: data});
                }
            }
        }, initSelection: function () {
            var selected;
            if (this.isPlaceholderOptionSelected()) {
                this.updateSelection(null);
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function (selected) {
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                        self.nextSearchTerm = self.opts.nextSearchTerm(selected, self.search.val());
                    }
                });
            }
        }, isPlaceholderOptionSelected: function () {
            var placeholderOption;
            if (this.getPlaceholder() === undefined)
                return false;
            return((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected")) || (this.opts.element.val() === "") || (this.opts.element.val() === undefined) || (this.opts.element.val() === null);
        }, prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                opts.initSelection = function (element, callback) {
                    var selected = element.find("option").filter(function () {
                        return this.selected && !this.disabled
                    });
                    callback(self.optionToData(selected));
                };
            } else if ("data"in opts) {
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    var match = null;
                    opts.query({matcher: function (term, text, el) {
                            var is_match = equal(id, opts.id(el));
                            if (is_match) {
                                match = el;
                            }
                            return is_match;
                        }, callback: !$.isFunction(callback) ? $.noop : function () {
                            callback(match);
                        }});
                };
            }
            return opts;
        }, getPlaceholder: function () {
            if (this.select) {
                if (this.getPlaceholderOption() === undefined) {
                    return undefined;
                }
            }
            return this.parent.getPlaceholder.apply(this, arguments);
        }, setPlaceholder: function () {
            var placeholder = this.getPlaceholder();
            if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {
                if (this.select && this.getPlaceholderOption() === undefined)
                    return;
                this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));
                this.selection.addClass("select2-default");
                this.container.removeClass("select2-allowclear");
            }
        }, postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;
            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });
            if (noHighlightUpdate !== false) {
                if (initial === true && selected >= 0) {
                    this.highlight(selected);
                } else {
                    this.highlight(0);
                }
            }
            if (initial === true) {
                var min = this.opts.minimumResultsForSearch;
                if (min >= 0) {
                    this.showSearch(countResults(data.results) >= min);
                }
            }
        }, showSearch: function (showSearchInput) {
            if (this.showSearchInput === showSearchInput)
                return;
            this.showSearchInput = showSearchInput;
            this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
            this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
            $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
        }, onSelect: function (data, options) {
            if (!this.triggerSelect(data)) {
                return;
            }
            var old = this.opts.element.val(), oldData = this.data();
            this.opts.element.val(this.id(data));
            this.updateSelection(data);
            this.opts.element.trigger({type: "select2-selected", val: this.id(data), choice: data});
            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.close();
            if ((!options || !options.noFocus) && this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
            if (!equal(old, this.id(data))) {
                this.triggerChange({added: data, removed: oldData});
            }
        }, updateSelection: function (data) {
            var container = this.selection.find(".select2-chosen"), formatted, cssClass;
            this.selection.data("select2-data", data);
            container.empty();
            if (data !== null) {
                formatted = this.opts.formatSelection(data, container, this.opts.escapeMarkup);
            }
            if (formatted !== undefined) {
                container.append(formatted);
            }
            cssClass = this.opts.formatSelectionCssClass(data, container);
            if (cssClass !== undefined) {
                container.addClass(cssClass);
            }
            this.selection.removeClass("select2-default");
            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.container.addClass("select2-allowclear");
            }
        }, val: function () {
            var val, triggerChange = false, data = null, self = this, oldData = this.data();
            if (arguments.length === 0) {
                return this.opts.element.val();
            }
            val = arguments[0];
            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }
            if (this.select) {
                this.select.val(val).find("option").filter(function () {
                    return this.selected
                }).each2(function (i, elm) {
                    data = self.optionToData(elm);
                    return false;
                });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange({added: data, removed: oldData});
                }
            } else {
                if (!val && val !== 0) {
                    this.clear(triggerChange);
                    return;
                }
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function (data) {
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange({added: data, removed: oldData});
                    }
                });
            }
        }, clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        }, data: function (value) {
            var data, triggerChange = false;
            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined)
                    data = null;
                return data;
            } else {
                if (arguments.length > 1) {
                    triggerChange = arguments[1];
                }
                if (!value) {
                    this.clear(triggerChange);
                } else {
                    data = this.data();
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                    if (triggerChange) {
                        this.triggerChange({added: value, removed: data});
                    }
                }
            }
        }});
    MultiSelect2 = clazz(AbstractSelect2, {createContainer: function () {
            var container = $(document.createElement("div")).attr({"class": "select2-container select2-container-multi"}).html(["<ul class='select2-choices'>", " <li class='select2-search-field'>", " <label for='' class='select2-offscreen'></label>", " <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>", " </li>", "</ul>", "<div class='select2-drop select2-drop-multi select2-display-none'>", " <ul class='select2-results'>", " </ul>", "</div>"].join(""));
            return container;
        }, prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                opts.initSelection = function (element, callback) {
                    var data = [];
                    element.find("option").filter(function () {
                        return this.selected && !this.disabled
                    }).each2(function (i, elm) {
                        data.push(self.optionToData(elm));
                    });
                    callback(data);
                };
            } else if ("data"in opts) {
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator);
                    var matches = [];
                    opts.query({matcher: function (term, text, el) {
                            var is_match = $.grep(ids, function (id) {
                                return equal(id, opts.id(el));
                            }).length;
                            if (is_match) {
                                matches.push(el);
                            }
                            return is_match;
                        }, callback: !$.isFunction(callback) ? $.noop : function () {
                            var ordered = [];
                            for (var i = 0; i < ids.length; i++) {
                                var id = ids[i];
                                for (var j = 0; j < matches.length; j++) {
                                    var match = matches[j];
                                    if (equal(id, opts.id(match))) {
                                        ordered.push(match);
                                        matches.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                            callback(ordered);
                        }});
                };
            }
            return opts;
        }, selectChoice: function (choice) {
            var selected = this.container.find(".select2-search-choice-focus");
            if (selected.length && choice && choice[0] == selected[0]) {
            } else {
                if (selected.length) {
                    this.opts.element.trigger("choice-deselected", selected);
                }
                selected.removeClass("select2-search-choice-focus");
                if (choice && choice.length) {
                    this.close();
                    choice.addClass("select2-search-choice-focus");
                    this.opts.element.trigger("choice-selected", choice);
                }
            }
        }, destroy: function () {
            $("label[for='" + this.search.attr('id') + "']").attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);
            cleanupJQueryElements.call(this, "searchContainer", "selection");
        }, initContainer: function () {
            var selector = ".select2-choices", selection;
            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);
            var _this = this;
            this.selection.on("click", ".select2-search-choice:not(.select2-locked)", function (e) {
                _this.search[0].focus();
                _this.selectChoice($(this));
            });
            this.search.attr("id", "s2id_autogen" + nextUid());
            this.search.prev().text($("label[for='" + this.opts.element.attr("id") + "']").text()).attr('for', this.search.attr('id'));
            this.search.on("input paste", this.bind(function () {
                if (this.search.attr('placeholder') && this.search.val().length == 0)
                    return;
                if (!this.isInterfaceEnabled())
                    return;
                if (!this.opened()) {
                    this.open();
                }
            }));
            this.search.attr("tabindex", this.elementTabIndex);
            this.keydowns = 0;
            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled())
                    return;
                ++this.keydowns;
                var selected = selection.find(".select2-search-choice-focus");
                var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
                var next = selected.next(".select2-search-choice:not(.select2-locked)");
                var pos = getCursorInfo(this.search);
                if (selected.length && (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                    var selectedChoice = selected;
                    if (e.which == KEY.LEFT && prev.length) {
                        selectedChoice = prev;
                    } else if (e.which == KEY.RIGHT) {
                        selectedChoice = next.length ? next : null;
                    } else if (e.which === KEY.BACKSPACE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = prev.length ? prev : next;
                        }
                    } else if (e.which == KEY.DELETE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = next.length ? next : null;
                        }
                    } else if (e.which == KEY.ENTER) {
                        selectedChoice = null;
                    }
                    this.selectChoice(selectedChoice);
                    killEvent(e);
                    if (!selectedChoice || !selectedChoice.length) {
                        this.open();
                    }
                    return;
                } else if (((e.which === KEY.BACKSPACE && this.keydowns == 1) || e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {
                    this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
                    killEvent(e);
                    return;
                } else {
                    this.selectChoice(null);
                }
                if (this.opened()) {
                    switch (e.which) {
                        case KEY.UP:
                        case KEY.DOWN:
                            this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                            killEvent(e);
                            return;
                        case KEY.ENTER:
                            this.selectHighlighted();
                            killEvent(e);
                            return;
                        case KEY.TAB:
                            this.selectHighlighted({noFocus: true});
                            this.close();
                            return;
                        case KEY.ESC:
                            this.cancel(e);
                            killEvent(e);
                            return;
                        }
                }
                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }
                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }
                this.open();
                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    killEvent(e);
                }
                if (e.which === KEY.ENTER) {
                    killEvent(e);
                }
            }));
            this.search.on("keyup", this.bind(function (e) {
                this.keydowns = 0;
                this.resizeSearch();
            }));
            this.search.on("blur", this.bind(function (e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.selectChoice(null);
                if (!this.opened())
                    this.clearSearch();
                e.stopImmediatePropagation();
                this.opts.element.trigger($.Event("select2-blur"));
            }));
            this.container.on("click", selector, this.bind(function (e) {
                if (!this.isInterfaceEnabled())
                    return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    return;
                }
                this.selectChoice(null);
                this.clearPlaceholder();
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));
            this.container.on("focus", selector, this.bind(function () {
                if (!this.isInterfaceEnabled())
                    return;
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));
            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.clearSearch();
        }, enableInterface: function () {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.search.prop("disabled", !this.isInterfaceEnabled());
            }
        }, initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function (data) {
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        self.clearSearch();
                    }
                });
            }
        }, clearSearch: function () {
            var placeholder = this.getPlaceholder(), maxWidth = this.getMaxSearchWidth();
            if (placeholder !== undefined && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
            } else {
                this.search.val("").width(10);
            }
        }, clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        }, opening: function () {
            this.clearPlaceholder();
            this.resizeSearch();
            this.parent.opening.apply(this, arguments);
            this.focusSearch();
            if (this.search.val() === "") {
                if (this.nextSearchTerm != undefined) {
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }
            this.updateResults(true);
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
            }
            this.opts.element.trigger($.Event("select2-open"));
        }, close: function () {
            if (!this.opened())
                return;
            this.parent.close.apply(this, arguments);
        }, focus: function () {
            this.close();
            this.search.focus();
        }, isFocused: function () {
            return this.search.hasClass("select2-focused");
        }, updateSelection: function (data) {
            var ids = [], filtered = [], self = this;
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;
            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        }, tokenize: function () {
            var input = this.search.val();
            input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }
        }, onSelect: function (data, options) {
            if (!this.triggerSelect(data) || data.text === "") {
                return;
            }
            this.addSelectedChoice(data);
            this.opts.element.trigger({type: "selected", val: this.id(data), choice: data});
            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.clearSearch();
            this.updateResults();
            if (this.select || !this.opts.closeOnSelect)
                this.postprocessResults(data, false, this.opts.closeOnSelect === true);
            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults() > 0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                        this.updateResults(true);
                    } else {
                        if (this.nextSearchTerm != undefined) {
                            this.search.val(this.nextSearchTerm);
                            this.updateResults();
                            this.search.select();
                        }
                    }
                    this.positionDropdown();
                } else {
                    this.close();
                    this.search.width(10);
                }
            }
            this.triggerChange({added: data});
            if (!options || !options.noFocus)
                this.focusSearch();
        }, cancel: function () {
            this.close();
            this.focusSearch();
        }, addSelectedChoice: function (data) {
            var enableChoice = !data.locked, enabledItem = $("<li class='select2-search-choice'>" + " <div></div>" + " <a href='#' class='select2-search-choice-close' tabindex='-1'></a>" + "</li>"), disabledItem = $("<li class='select2-search-choice select2-locked'>" + "<div></div>" + "</li>");
            var choice = enableChoice ? enabledItem : disabledItem, id = this.id(data), val = this.getVal(), formatted, cssClass;
            formatted = this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
            if (formatted != undefined) {
                choice.find("div").replaceWith("<div>" + formatted + "</div>");
            }
            cssClass = this.opts.formatSelectionCssClass(data, choice.find("div"));
            if (cssClass != undefined) {
                choice.addClass(cssClass);
            }
            if (enableChoice) {
                choice.find(".select2-search-choice-close").on("mousedown", killEvent).on("click dblclick", this.bind(function (e) {
                    if (!this.isInterfaceEnabled())
                        return;
                    this.unselect($(e.target));
                    this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                    killEvent(e);
                    this.close();
                    this.focusSearch();
                })).on("focus", this.bind(function () {
                    if (!this.isInterfaceEnabled())
                        return;
                    this.container.addClass("select2-container-active");
                    this.dropdown.addClass("select2-drop-active");
                }));
            }
            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);
            val.push(id);
            this.setVal(val);
        }, unselect: function (selected) {
            var val = this.getVal(), data, index;
            selected = selected.closest(".select2-search-choice");
            if (selected.length === 0) {
                throw"Invalid argument: " + selected + ". Must be .select2-search-choice";
            }
            data = selected.data("select2-data");
            if (!data) {
                return;
            }
            var evt = $.Event("select2-removing");
            evt.val = this.id(data);
            evt.choice = data;
            this.opts.element.trigger(evt);
            if (evt.isDefaultPrevented()) {
                return false;
            }
            while ((index = indexOf(this.id(data), val)) >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select)
                    this.postprocessResults();
            }
            selected.remove();
            this.opts.element.trigger({type: "select2-removed", val: this.id(data), choice: data});
            this.triggerChange({removed: data});
            return true;
        }, postprocessResults: function (data, initial, noHighlightUpdate) {
            var val = this.getVal(), choices = this.results.find(".select2-result"), compound = this.results.find(".select2-result-with-children"), self = this;
            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });
            compound.each2(function (i, choice) {
                if (!choice.is('.select2-result-selectable') && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });
            if (this.highlight() == -1 && noHighlightUpdate !== false) {
                self.highlight(0);
            }
            if (!this.opts.createSearchChoice && !choices.filter('.select2-result:not(.select2-selected)').length > 0) {
                if (!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                    if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                        this.results.append("<li class='select2-no-results'>" + evaluate(self.opts.formatNoMatches, self.opts.element, self.search.val()) + "</li>");
                    }
                }
            }
        }, getMaxSearchWidth: function () {
            return this.selection.width() - getSideBorderPadding(this.search);
        }, resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth, sideBorderPadding = getSideBorderPadding(this.search);
            minimumWidth = measureTextWidth(this.search) + 10;
            left = this.search.offset().left;
            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;
            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;
            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }
            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }
            if (searchWidth <= 0) {
                searchWidth = minimumWidth;
            }
            this.search.width(Math.floor(searchWidth));
        }, getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        }, setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                $(val).each(function () {
                    if (indexOf(this, unique) < 0)
                        unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        }, buildChangeDetails: function (old, current) {
            var current = current.slice(0), old = old.slice(0);
            for (var i = 0; i < current.length; i++) {
                for (var j = 0; j < old.length; j++) {
                    if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                        current.splice(i, 1);
                        if (i > 0) {
                            i--;
                        }
                        old.splice(j, 1);
                        j--;
                    }
                }
            }
            return{added: current, removed: old};
        }, val: function (val, triggerChange) {
            var oldData, self = this;
            if (arguments.length === 0) {
                return this.getVal();
            }
            oldData = this.data();
            if (!oldData.length)
                oldData = [];
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange({added: this.data(), removed: oldData});
                }
                return;
            }
            this.setVal(val);
            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }
                this.opts.initSelection(this.opts.element, function (data) {
                    var ids = $.map(data, self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                    }
                });
            }
            this.clearSearch();
        }, onSortStart: function () {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }
            this.search.width(0);
            this.searchContainer.hide();
        }, onSortEnd: function () {
            var val = [], self = this;
            this.searchContainer.show();
            this.searchContainer.appendTo(this.searchContainer.parent());
            this.resizeSearch();
            this.selection.find(".select2-search-choice").each(function () {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        }, data: function (values, triggerChange) {
            var self = this, ids, old;
            if (arguments.length === 0) {
                return this.selection.children(".select2-search-choice").map(function () {
                    return $(this).data("select2-data");
                }).get();
            } else {
                old = this.data();
                if (!values) {
                    values = [];
                }
                ids = $.map(values, function (e) {
                    return self.opts.id(e);
                });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(old, this.data()));
                }
            }
        }});
    $.fn.select2 = function () {
        var args = Array.prototype.slice.call(arguments, 0), opts, select2, method, value, multiple, allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"], valueMethods = ["opened", "isFocused", "container", "dropdown"], propertyMethods = ["val", "data"], methodsMap = {search: "externalSearch"};
        this.each(function () {
            if (args.length === 0 || typeof (args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);
                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.prop("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags"in opts) {
                        opts.multiple = multiple = true;
                    }
                }
                select2 = multiple ? new window.Select2["class"].multi() : new window.Select2["class"].single();
                select2.init(opts);
            } else if (typeof (args[0]) === "string") {
                if (indexOf(args[0], allowedMethods) < 0) {
                    throw"Unknown method: " + args[0];
                }
                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined)
                    return;
                method = args[0];
                if (method === "container") {
                    value = select2.container;
                } else if (method === "dropdown") {
                    value = select2.dropdown;
                } else {
                    if (methodsMap[method])
                        method = methodsMap[method];
                    value = select2[method].apply(select2, args.slice(1));
                }
                if (indexOf(args[0], valueMethods) >= 0 || (indexOf(args[0], propertyMethods) >= 0 && args.length == 1)) {
                    return false;
                }
            } else {
                throw"Invalid arguments to select2 plugin: " + args;
            }
        });
        return(value === undefined) ? this : value;
    };
    $.fn.select2.defaults = {width: "copy", loadMorePadding: 0, closeOnSelect: true, openOnEnter: true, containerCss: {}, dropdownCss: {}, containerCssClass: "", dropdownCssClass: "", formatResult: function (result, container, query, escapeMarkup) {
            var markup = [];
            markMatch(result.text, query.term, markup, escapeMarkup);
            return markup.join("");
        }, formatSelection: function (data, container, escapeMarkup) {
            return data ? escapeMarkup(data.text) : undefined;
        }, sortResults: function (results, container, query) {
            return results;
        }, formatResultCssClass: function (data) {
            return data.css;
        }, formatSelectionCssClass: function (data, container) {
            return undefined;
        }, minimumResultsForSearch: 0, minimumInputLength: 0, maximumInputLength: null, maximumSelectionSize: 0, id: function (e) {
            return e == undefined ? null : e.id;
        }, matcher: function (term, text) {
            return stripDiacritics('' + text).toUpperCase().indexOf(stripDiacritics('' + term).toUpperCase()) >= 0;
        }, separator: ",", tokenSeparators: [], tokenizer: defaultTokenizer, escapeMarkup: defaultEscapeMarkup, blurOnChange: false, selectOnBlur: false, adaptContainerCssClass: function (c) {
            return c;
        }, adaptDropdownCssClass: function (c) {
            return null;
        }, nextSearchTerm: function (selectedObject, currentSearchTerm) {
            return undefined;
        }, searchInputPlaceholder: '', createSearchChoicePosition: 'top', shouldFocusInput: function (instance) {
            var supportsTouchEvents = (('ontouchstart'in window) || (navigator.msMaxTouchPoints > 0));
            if (!supportsTouchEvents) {
                return true;
            }
            if (instance.opts.minimumResultsForSearch < 0) {
                return false;
            }
            return true;
        }};
    $.fn.select2.locales = [];
    $.fn.select2.locales['en'] = {formatMatches: function (matches) {
            if (matches === 1) {
                return"One result is available, press enter to select it.";
            }
            return matches + " results are available, use up and down arrow keys to navigate.";
        }, formatNoMatches: function () {
            return"No matches found";
        }, formatAjaxError: function (jqXHR, textStatus, errorThrown) {
            return"Loading failed";
        }, formatInputTooShort: function (input, min) {
            var n = min - input.length;
            return"Please enter " + n + " or more character" + (n == 1 ? "" : "s");
        }, formatInputTooLong: function (input, max) {
            var n = input.length - max;
            return"Please delete " + n + " character" + (n == 1 ? "" : "s");
        }, formatSelectionTooBig: function (limit) {
            return"You can only select " + limit + " item" + (limit == 1 ? "" : "s");
        }, formatLoadMore: function (pageNumber) {
            return"Loading more results…";
        }, formatSearching: function () {
            return"Searching…";
        }, };
    $.extend($.fn.select2.defaults, $.fn.select2.locales['en']);
    $.fn.select2.ajaxDefaults = {transport: $.ajax, params: {type: "GET", cache: false, dataType: "json"}};
    window.Select2 = {query: {ajax: ajax, local: local, tags: tags}, util: {debounce: debounce, markMatch: markMatch, escapeMarkup: defaultEscapeMarkup, stripDiacritics: stripDiacritics}, "class": {"abstract": AbstractSelect2, "single": SingleSelect2, "multi": MultiSelect2}};
}(jQuery)); 