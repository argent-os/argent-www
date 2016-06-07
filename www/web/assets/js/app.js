function animateSectionFour() {
    setTimeout(function() {
        $(".roommate-left").addClass("active")
    }, 0), setTimeout(function() {
        $(".roommate-top").addClass("active")
    }, 200), setTimeout(function() {
        $(".roommate-right").addClass("active")
    }, 400), setTimeout(function() {
        $(".dot").addClass("active")
    }, 600)
}

function animateSectionOne() {
    hasPlayedSectionTwo || setTimeout(function() {
        $("#animated-phone").attr("src", "assets/img/mocks/iphone-animated.gif")
    }, 0)
}

function animateSectionThree() {
    hasPlayedSectionThree || $("#apple-watch").attr("src", "assets/img/mocks/apple-watch-dark.gif")
}

function sendSMS() {
    var phone = $(".phone-number").val(),
        data = {};
    branchBiller && (data = {
        biller: branchBiller
    });
    var linkData = {
            tags: [],
            channel: "Website",
            feature: "TextMeTheApp",
            data: data
        },
        options = {},
        toastOptions = {
            positionClass: "toast-top-center",
            preventDuplicates: !0,
            closeButton: !1
        },
        callback = function(err, result) {
            err ? (toastr.error("Double check your phone number.", "SMS Failed.", toastOptions), mixpanel.track("SMS Failed", {
                phone: phone
            })) : (toastr.success("Check your phone.", "Sent!", toastOptions), mixpanel.track("Sent SMS", {
                phone: phone
            }))
        };
    branch.sendSMS(phone, linkData, options, callback), $(".phone-number").val(""), window._fbq.push(["track", "6021511095115", {
        value: "0.00",
        currency: "USD"
    }])
}! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
}(function(a) {
    var b, c = navigator.userAgent,
        d = /iphone/i.test(c),
        e = /chrome/i.test(c),
        f = /android/i.test(c);
    a.mask = {
        definitions: {
            9: "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]"
        },
        autoclear: !0,
        dataName: "rawMaskFn",
        placeholder: "_"
    }, a.fn.extend({
        caret: function(a, b) {
            var c;
            return 0 === this.length || this.is(":hidden") ? void 0 : "number" == typeof a ? (b = "number" == typeof b ? b : a, this.each(function() {
                this.setSelectionRange ? this.setSelectionRange(a, b) : this.createTextRange && (c = this.createTextRange(), c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select())
            })) : (this[0].setSelectionRange ? (a = this[0].selectionStart, b = this[0].selectionEnd) : document.selection && document.selection.createRange && (c = document.selection.createRange(), a = 0 - c.duplicate().moveStart("character", -1e5), b = a + c.text.length), {
                begin: a,
                end: b
            })
        },
        unmask: function() {
            return this.trigger("unmask")
        },
        mask: function(c, g) {
            var h, i, j, k, l, m, n, o;
            if (!c && this.length > 0) {
                h = a(this[0]);
                var p = h.data(a.mask.dataName);
                return p ? p() : void 0
            }
            return g = a.extend({
                autoclear: a.mask.autoclear,
                placeholder: a.mask.placeholder,
                completed: null
            }, g), i = a.mask.definitions, j = [], k = n = c.length, l = null, a.each(c.split(""), function(a, b) {
                "?" == b ? (n--, k = a) : i[b] ? (j.push(new RegExp(i[b])), null === l && (l = j.length - 1), k > a && (m = j.length - 1)) : j.push(null)
            }), this.trigger("unmask").each(function() {
                function h() {
                    if (g.completed) {
                        for (var a = l; m >= a; a++)
                            if (j[a] && C[a] === p(a)) return;
                        g.completed.call(B)
                    }
                }

                function p(a) {
                    return g.placeholder.charAt(a < g.placeholder.length ? a : 0)
                }

                function q(a) {
                    for (; ++a < n && !j[a];);
                    return a
                }

                function r(a) {
                    for (; --a >= 0 && !j[a];);
                    return a
                }

                function s(a, b) {
                    var c, d;
                    if (!(0 > a)) {
                        for (c = a, d = q(b); n > c; c++)
                            if (j[c]) {
                                if (!(n > d && j[c].test(C[d]))) break;
                                C[c] = C[d], C[d] = p(d), d = q(d)
                            }
                        z(), B.caret(Math.max(l, a))
                    }
                }

                function t(a) {
                    var b, c, d, e;
                    for (b = a, c = p(a); n > b; b++)
                        if (j[b]) {
                            if (d = q(b), e = C[b], C[b] = c, !(n > d && j[d].test(e))) break;
                            c = e
                        }
                }

                function u() {
                    var a = B.val(),
                        b = B.caret();
                    if (o && o.length && o.length > a.length) {
                        for (A(!0); b.begin > 0 && !j[b.begin - 1];) b.begin--;
                        if (0 === b.begin)
                            for (; b.begin < l && !j[b.begin];) b.begin++;
                        B.caret(b.begin, b.begin)
                    } else {
                        for (A(!0); b.begin < n && !j[b.begin];) b.begin++;
                        B.caret(b.begin, b.begin)
                    }
                    h()
                }

                function v() {
                    A(), B.val() != E && B.change()
                }

                function w(a) {
                    if (!B.prop("readonly")) {
                        var b, c, e, f = a.which || a.keyCode;
                        o = B.val(), 8 === f || 46 === f || d && 127 === f ? (b = B.caret(), c = b.begin, e = b.end, e - c === 0 && (c = 46 !== f ? r(c) : e = q(c - 1), e = 46 === f ? q(e) : e), y(c, e), s(c, e - 1), a.preventDefault()) : 13 === f ? v.call(this, a) : 27 === f && (B.val(E), B.caret(0, A()), a.preventDefault())
                    }
                }

                function x(b) {
                    if (!B.prop("readonly")) {
                        var c, d, e, g = b.which || b.keyCode,
                            i = B.caret();
                        if (!(b.ctrlKey || b.altKey || b.metaKey || 32 > g) && g && 13 !== g) {
                            if (i.end - i.begin !== 0 && (y(i.begin, i.end), s(i.begin, i.end - 1)), c = q(i.begin - 1), n > c && (d = String.fromCharCode(g), j[c].test(d))) {
                                if (t(c), C[c] = d, z(), e = q(c), f) {
                                    var k = function() {
                                        a.proxy(a.fn.caret, B, e)()
                                    };
                                    setTimeout(k, 0)
                                } else B.caret(e);
                                i.begin <= m && h()
                            }
                            b.preventDefault()
                        }
                    }
                }

                function y(a, b) {
                    var c;
                    for (c = a; b > c && n > c; c++) j[c] && (C[c] = p(c))
                }

                function z() {
                    B.val(C.join(""))
                }

                function A(a) {
                    var b, c, d, e = B.val(),
                        f = -1;
                    for (b = 0, d = 0; n > b; b++)
                        if (j[b]) {
                            for (C[b] = p(b); d++ < e.length;)
                                if (c = e.charAt(d - 1), j[b].test(c)) {
                                    C[b] = c, f = b;
                                    break
                                }
                            if (d > e.length) {
                                y(b + 1, n);
                                break
                            }
                        } else C[b] === e.charAt(d) && d++, k > b && (f = b);
                    return a ? z() : k > f + 1 ? g.autoclear || C.join("") === D ? (B.val() && B.val(""), y(0, n)) : z() : (z(), B.val(B.val().substring(0, f + 1))), k ? b : l
                }
                var B = a(this),
                    C = a.map(c.split(""), function(a, b) {
                        return "?" != a ? i[a] ? p(b) : a : void 0
                    }),
                    D = C.join(""),
                    E = B.val();
                B.data(a.mask.dataName, function() {
                    return a.map(C, function(a, b) {
                        return j[b] && a != p(b) ? a : null
                    }).join("")
                }), B.one("unmask", function() {
                    B.off(".mask").removeData(a.mask.dataName)
                }).on("focus.mask", function() {
                    if (!B.prop("readonly")) {
                        clearTimeout(b);
                        var a;
                        E = B.val(), a = A(), b = setTimeout(function() {
                            B.get(0) === document.activeElement && (z(), a == c.replace("?", "").length ? B.caret(0, a) : B.caret(a))
                        }, 10)
                    }
                }).on("blur.mask", v).on("keydown.mask", w).on("keypress.mask", x).on("input.mask paste.mask", function() {
                    B.prop("readonly") || setTimeout(function() {
                        var a = A(!0);
                        B.caret(a), h()
                    }, 0)
                }), e && f && B.off("input.mask").on("input.mask", u), A()
            })
        }
    })
}),
function(e) {
    function t() {
        var t = e();
        if (e.each(n, function(e, i) {
                var n = i.data.selector,
                    a = i.$element;
                t = t.add(n ? a.find(n) : a)
            }), t.length)
            for (var i = 0; t.length > i; i++)
                if (t[i])
                    if (e.contains(r, t[i])) {
                        var a = e(t[i]),
                            c = a.data("inview"),
                            l = a[0].getBoundingClientRect(),
                            o = a.height(),
                            h = a.width();
                        l.top >= 0 - o && l.left >= 0 - h && l.bottom <= (d.innerHeight || r.clientHeight) + o && l.right <= (d.innerWidth || r.clientWidth) + h ? c || a.data("inview", !0).trigger("inview", [!0]) : c && a.data("inview", !1).trigger("inview", [!1])
                    } else delete t[i]
    }
    var i, n = {},
        a = document,
        d = window,
        r = a.documentElement,
        c = e.expando;
    e.event.special.inview = {
        add: function(a) {
            n[a.guid + "-" + this[c]] = {
                data: a,
                $element: e(this)
            }, i || e.isEmptyObject(n) || (i = setInterval(t, 333))
        },
        remove: function(t) {
            try {
                delete n[t.guid + "-" + this[c]]
            } catch (a) {}
            e.isEmptyObject(n) && (clearInterval(i), i = null)
        }
    }
}(jQuery);
var Zodiac = function() {
    function e(e, t) {
        function n(e) {
            d.x = e.pageX - window.innerWidth / 2, d.y = e.pageY - window.innerHeight / 2
        }

        function r(e) {
            d.x = Math.min(Math.max(-e.gamma, -30), 30) * (window.innerWidth / 30), d.y = Math.min(Math.max(-e.beta, -30), 30) * (window.innerHeight / 30)
        }
        var e, i, o, a = this;
        if (void 0 === t && (t = {}), this.options = {
                directionX: -1,
                directionY: -1,
                velocityX: [.1, .2],
                velocityY: [.5, 1],
                bounceX: !0,
                bounceY: !1,
                parallax: .2,
                pivot: 0,
                density: 6e3,
                dotRadius: [1, 5],
                linkColor: "rgba(99,99,99,.8)",
                linkDistance: 50,
                linkWidth: 2
            }, e = "string" == typeof e || e instanceof String ? document.getElementById(e) : e, "CANVAS" != e.tagName) throw "no canvas";
        for (i in t) this.options[i] = t[i];
        t = this.options;
        var s, l, u, c = this._ctx = e.getContext("2d", {
                alpha: !t.backgroundColor
            }),
            d = {
                x: 0,
                y: 0
            },
            f = function() {
                var e, n, r, i, o, a;
                for (t.backgroundColor ? (c.fillStyle = t.backgroundColor, c.fillRect(0, 0, l, u), c.fillStyle = t.dotColor) : c.clearRect(0, 0, l, u), c.beginPath(), e = 0; e < s.length; e++)
                    for (n = s[e], n.x += n.vx, n.y += n.vy, t.parallax && (o = n.z * t.parallax, n.dx += (d.x * o - n.dx) / 10, n.dy += (d.y * o - n.dy) / 10), r = n.x + n.dx, i = n.y + n.dy, (0 > r || r > l) && (t.bounceX ? n.vx = -n.vx : n.x = (r + l) % l - n.dx), (0 > i || i > u) && (t.bounceY ? n.vy = -n.vy : n.y = (i + u) % u - n.dy), c.moveTo(r + n.r, i), c.arc(r, i, n.r, 0, 2 * Math.PI), a = e - 1; a >= 0; a--) {
                        var p = s[a],
                            h = p.x - n.x,
                            m = p.y - n.y,
                            g = Math.sqrt(h * h + m * m);
                        if (g < t.linkDistance) {
                            var r = n.x + n.dx,
                                i = n.y + n.dy,
                                v = p.x + p.dx,
                                y = p.y + p.dy,
                                b = Math.atan2(y - i, v - r),
                                x = Math.cos(b),
                                w = Math.sin(b);
                            r += n.r * x, i += n.r * w, v -= p.r * x, y -= p.r * w, c.moveTo(r, i), c.lineTo(v, y)
                        }
                    }
                c.stroke(), t.dotColor && c.fill(), requestAnimationFrame(f)
            };
        o = this._refresh = function() {
            var n, r, i;
            s = a._ = a._ || [], n = [].concat(t.dotRadius), (1 == n.length || n[0] == n[1]) && (n = n[0]), l = e.width = e.offsetWidth, u = e.height = e.offsetHeight;
            var o = t.velocityX,
                d = t.velocityY,
                f = Math.random,
                p = Math.ceil(l * u / t.density);
            for (r = s.length - 1; r >= 0; r--)(s[r].x > l || s[r].y > u) && s.splice(r, 1);
            for (p < s.length && s.splice(p); p > s.length;) i = f(), s.push({
                z: (i - t.pivot) / 4,
                r: n[1] ? i * (n[1] - n[0]) + n[0] : n,
                x: Math.ceil(f() * l),
                y: Math.ceil(f() * u),
                vx: (t.directionX || (f() > .5 ? 1 : -1)) * (f() * (o[1] - o[0]) + o[0]),
                vy: (t.directionY || (f() > .5 ? 1 : -1)) * (f() * (d[1] - d[0]) + d[0]),
                dx: 0,
                dy: 0
            });
            c.strokeStyle = t.linkColor, c.lineWidth = t.linkWidth, c.fillStyle = t.dotColor
        }, window.addEventListener("resize", o, !1), document.addEventListener("mousemove", n, !1), window.addEventListener("deviceorientation", r, !1), o(), f()
    }
    return e
}();
! function() {
    for (var e = 0, t = ["ms", "moz", "webkit", "o"], n = 0; n < t.length && !window.requestAnimationFrame; ++n) window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(t) {
        var n = (new Date).getTime(),
            r = Math.max(0, 16 - (n - e)),
            i = window.setTimeout(function() {
                t(n + r)
            }, r);
        return e = n + r, i
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
        clearTimeout(e)
    })
}();
var hasPlayedSectionOne = !1,
    hasPlayedSectionTwo = !1,
    hasPlayedSectionThree = !1,
    hasPlayedSectionFour = !1,
    s3Path = "https://s3-us-west-2.amazonaws.com/cdn.unbill.com",
    apiPath = "https://unbill.co",
    branchBiller = void 0;
$(document).ready(function() {

}), $(window).on("DOMContentLoaded load resize scroll", function() {
    $(".section-one .bill-assistant").bind("inview", function(event, visible) {
        visible && (hasPlayedSectionOne || animateSectionOne(), hasPlayedSectionOne = !0)
    }), $(".section-three .badge").bind("inview", function(event, visible) {
        visible && (hasPlayedSectionOne || animateSectionThree(), hasPlayedSectionThree = !0)
    }), $(".footer").bind("inview", function(event, visible) {
        visible && (hasPlayedSectionFour || animateSectionFour(), hasPlayedSectionFour = !0)
    }), $(".phone-number").mask("(999) 999-9999")
});

$(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 1900 && y < 1950) {
    animateSectionThree()
  } else {
  }
});