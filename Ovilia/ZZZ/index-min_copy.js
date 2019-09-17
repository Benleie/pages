"use strict";

function _toConsumableArray(n) {
	if (Array.isArray(n)) {
		for (var t = 0, e = Array(n.length); t < n.length; t++) e[t] = n[t];
		return e
	}
	return Array.from(n)
}
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(n) {
	return typeof n
} : function(n) {
	return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n
};
! function() {
	function n(n) {
		return "string" != typeof n && n.length ? n[Math.floor(Math.random() * n.length)] : n
	}

	function t() {
		setTimeout(function() {
			e();
			var n = $("#mobile-body-content .msg-row:last-child .msg");
			n.find("a").attr("target", "_blank"), r(n).then(e)
		})
	}

	function e() {
		var n = $("#mobile-body-content"),
			t = n[0].scrollHeight - n.height() - n.scrollTop(),
			e = Date.now();
		requestAnimationFrame(function i() {
			var o = Math.min(1, (Date.now() - e) / 250);
			n.scrollTop(n.scrollTop() + t * o), o < 1 && requestAnimationFrame(i)
		})
	}

	function i() {
		var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
		return new Promise(function(t) {
			setTimeout(t, n)
		})
	}

	function o() {
		var n = $("#mock-msg");
		return {
			width: n.width(),
			height: n.height()
		}
	}

	function r(n) {
		return new Promise(function(t) {
			n.one("load", t).each(function(n, t) {
				t.complete && $(t).trigger("load")
			})
		})
	}
	var s = {
		XIANZHE: "xianzhe",
		ME: "me"
	};
	new Vue({
		el: "#mobile",
		data: {
			messages: [],
			dialogs: null,
			lastDialog: null,
			msgChain: Promise.resolve(),
			isXianzheTyping: !1,
			nextTopics: [],
			hasPrompt: !1,
			latestMsgContent: null
		},
		mounted: function() {
			var n = this;
			$.getJSON("./assets/dialog.json", function(t) {
				n.dialogs = t, n.nextTopics = n.dialogs.fromUser, n.appendDialog("0000")
			})
		},
		methods: {
			appendDialog: function(t) {
				var e = this;
				if ("object" === (void 0 === t ? "undefined" : _typeof(t)) && t.length > 0) t.forEach(function(n) {
					return e.appendDialog(n)
				});
				else {
					if (null != t) {
						this.isXianzheTyping = !0;
						var o = this.getDialog(t);
						return n(o.details).forEach(function(n) {
							e.msgChain = e.msgChain.then(function() {
								return i(700)
							}).then(function() {
								return e.sendMsg(n, s.XIANZHE)
							})
						}), o.nextXianzhe ? this.appendDialog(o.nextXianzhe) : this.msgChain.then(function() {
							e.lastDialog = o, e.isXianzheTyping = !1
						})
					}
					this.lastDialog.responses = null
				}
			},
			sendMsg: function(n, t) {
				switch (t) {
					case "me":
						return this.sendUserMsg(n);
					default:
						return this.sendFriendMsg(n, t)
				}
			},
			sendFriendMsg: function(o, r) {
				var s = this,
					a = n(o),
					u = a.replace(/<[^>]+>/g, "").length,
					l = /<img[^>]+>/.test(a),
					h = u > 5 || l,
					c = {
						author: r,
						content: h ? '\n        <div class="dot"></div>\n        <div class="dot"></div>\n        <div class="dot"></div>\n    ' : a,
						isImg: l
					};
				return this.messages.push(c), h ? (this.markMsgSize(c), setTimeout(e), i(Math.min(100 * u, 2e3)).then(function() {
					return s.markMsgSize(c, a)
				}).then(function() {
					return i(150)
				}).then(function() {
					c.content = a, t()
				})) : (t(), Promise.resolve())
			},
			sendUserMsg: function(n) {
				return this.messages.push({
					author: s.ME,
					content: n
				}), t(), Promise.resolve()
			},
			markMsgSize: function(n) {
				var t = this,
					e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
				return this.latestMsgContent = e || n.content, i(0).then(function() {
					return n.isImg && r($("#mock-msg img"))
				}).then(function() {
					Object.assign(n, o()), t.messages = [].concat(_toConsumableArray(t.messages))
				})
			},
			getDialog: function(n) {
				var t = this.dialogs.fromXianzhe.filter(function(t) {
					return t.id === n
				});
				return t ? t[0] : null
			},
			getDialogFromUser: function(n) {
				var t = this.dialogs.fromUser.filter(function(t) {
					return t.id === n
				});
				return t ? t[0] : null
			},
			togglePrompt: function(n) {
				this.isXianzheTyping || (this.hasPrompt = n)
			},
			respond: function(n) {
				return _gaq && _gaq.push(["_trackEvent", "Home", "respond", n.content]), this.say(n.content, n.nextXianzhe)
			},
			ask: function(t) {
				_gaq && _gaq.push(["_trackEvent", "Home", "ask", t.brief]);
				var e = n(t.details);
				return this.say(e, t.nextXianzhe)
			},
			say: function(n, t) {
				var e = this;
				return this.hasPrompt = !1, i(200).then(function() {
					return e.sendMsg(n, s.ME)
				}).then(function() {
					return i(300)
				}).then(function() {
					return e.appendDialog(t)
				})
			}
		}
	})
}();