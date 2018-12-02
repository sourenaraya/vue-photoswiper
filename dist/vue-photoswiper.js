(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('photoswipe/dist/photoswipe.css'), require('photoswipe/dist/default-skin/default-skin.css'), require('photoswipe'), require('photoswipe/dist/photoswipe-ui-default')) :
	typeof define === 'function' && define.amd ? define(['photoswipe/dist/photoswipe.css', 'photoswipe/dist/default-skin/default-skin.css', 'photoswipe', 'photoswipe/dist/photoswipe-ui-default'], factory) :
	(global.fullpage = factory(null,null,global.PhotoSwipe,global.PhotoSwipeUI_Default));
}(this, (function (photoswipe_dist_photoswipe_css,photoswipe_dist_defaultSkin_defaultSkin_css,PhotoSwipe,PhotoSwipeUI_Default) { 'use strict';

PhotoSwipe = PhotoSwipe && 'default' in PhotoSwipe ? PhotoSwipe['default'] : PhotoSwipe;
PhotoSwipeUI_Default = PhotoSwipeUI_Default && 'default' in PhotoSwipeUI_Default ? PhotoSwipeUI_Default['default'] : PhotoSwipeUI_Default;

var previewComponent = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _vm._m(0);
    }, staticRenderFns: [function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "pswp", attrs: { "tabindex": "-1", "role": "dialog", "aria-hidden": "true" } }, [_c('div', { staticClass: "pswp__bg" }), _vm._v(" "), _c('div', { staticClass: "pswp__scroll-wrap" }, [_c('div', { staticClass: "pswp__container" }, [_c('div', { staticClass: "pswp__item" }), _vm._v(" "), _c('div', { staticClass: "pswp__item" }), _vm._v(" "), _c('div', { staticClass: "pswp__item" })]), _vm._v(" "), _c('div', { staticClass: "pswp__ui pswp__ui--hidden" }, [_c('div', { staticClass: "pswp__top-bar" }, [_c('div', { staticClass: "pswp__counter" }), _vm._v(" "), _c('button', { staticClass: "pswp__button pswp__button--close", attrs: { "title": "Close (Esc)" } }), _vm._v(" "), _c('button', { staticClass: "pswp__button pswp__button--share", attrs: { "title": "Share" } }), _vm._v(" "), _c('button', { staticClass: "pswp__button pswp__button--fs", attrs: { "title": "Toggle fullscreen" } }), _vm._v(" "), _c('button', { staticClass: "pswp__button pswp__button--zoom", attrs: { "title": "Zoom in/out" } }), _vm._v(" "), _c('div', { staticClass: "pswp__preloader" }, [_c('div', { staticClass: "pswp__preloader__icn" }, [_c('div', { staticClass: "pswp__preloader__cut" }, [_c('div', { staticClass: "pswp__preloader__donut" })])])])]), _vm._v(" "), _c('div', { staticClass: "pswp__share-modal pswp__share-modal--hidden pswp__single-tap" }, [_c('div', { staticClass: "pswp__share-tooltip" })]), _vm._v(" "), _c('button', { staticClass: "pswp__button pswp__button--arrow--left", attrs: { "title": "Previous (arrow left)" } }), _vm._v(" "), _c('button', { staticClass: "pswp__button pswp__button--arrow--right", attrs: { "title": "Next (arrow right)" } }), _vm._v(" "), _c('div', { staticClass: "pswp__caption" }, [_c('div', { staticClass: "pswp__caption__center" })])])])]);
    }]

};

var $preview = void 0;
var vuePhotoPreview = {
	install: function install(Vue, opts) {
		var Preview = Vue.extend(previewComponent);
		var opts = opts || {};
		if (!$preview) {
			$preview = new Preview({
				el: document.createElement('div')
			});
			document.body.appendChild($preview.$el);
		}

		Vue.directive('preview', {
			bind: function bind(el, binding, vnode) {
				initPhotoSwipeFromDOM(el, {}, binding.value);
			}
		});
	}
};
/* eslint-disable */
function initPhotoSwipeFromDOM(galleryElement) {
	var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var group = arguments[2];

	var parseThumbnailElements = function parseThumbnailElements(thumbElements) {
		var numNodes = thumbElements.length,
		    items = [],
		    figureEl,
		    linkEl,
		    size,
		    item;

		for (var i = 0; i < numNodes; i++) {

			figureEl = thumbElements[i]; // <figure> element

			// include only element nodes
			if (figureEl.nodeType !== 1) {
				continue;
			}

			linkEl = figureEl.children[0]; // <a> element

			size = linkEl.getAttribute('data-size').split('x');

			// create slide object
			item = {
				src: linkEl.getAttribute('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			};

			if (figureEl.children.length > 1) {
				// <figcaption> content
				item.title = figureEl.children[1].innerHTML;
			}

			if (linkEl.children.length > 0) {
				// <img> thumbnail element, retrieving thumbnail url
				item.msrc = linkEl.children[0].getAttribute('src');
			}

			item.el = figureEl; // save link to element for getThumbBoundsFn
			items.push(item);
		}
		return items;
	};

	var closest = function closest(el, fn) {
		return el && (fn(el) ? el : closest(el.parentNode, fn));
	};

	var onThumbnailsClick = function onThumbnailsClick(e) {
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : e.returnValue = false;

		var eTarget = e.target || e.srcElement;

		var clickedListItem = closest(eTarget, function (el) {
			return el.tagName && el.tagName.toUpperCase() === 'FIGURE';
		});

		if (!clickedListItem) {
			return;
		}

		var thumbElements;
		var group = eTarget.getAttribute('preview');
		if (group) {
			thumbElements = document.querySelectorAll('figure[preview="' + group + '"]');
		} else {
			thumbElements = document.querySelectorAll('figure.preview');
		}
		var index;

		for (var i = 0; i < thumbElements.length; i++) {
			if (thumbElements[i] === clickedListItem) {
				index = i;
				break;
			}
		}
		if (index >= 0) {
			openPhotoSwipe(index, thumbElements);
		}
		return false;
	};

	var photoswipeParseHash = function photoswipeParseHash() {
		var hash = window.location.hash.substring(1),
		    params = {};

		if (hash.length < 5) {
			// pid=1
			return params;
		}

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if (!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');
			if (pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}

		if (params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	};

	var openPhotoSwipe = function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
		var pswpElement = document.querySelectorAll('.pswp')[0],
		    gallery,
		    options,
		    items;
		if (!pswpElement) {
			pswpElement = document.createElement('div');
			pswpElement.className = 'pswp';
			document.body.appendChild(pswpElement);
		}
		var items = parseThumbnailElements(galleryElement);
		options = {

			//galleryUID: galleryElement.getAttribute('data-pswp-uid'),

			getThumbBoundsFn: function getThumbBoundsFn() {
				var thumbnail = items[index].el,
				    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
				    rect = thumbnail.getBoundingClientRect();

				return {
					x: rect.left,
					y: rect.top + pageYScroll,
					w: rect.width
				};
			},

			addCaptionHTMLFn: function addCaptionHTMLFn(item, captionEl, isFake) {
				if (!item.title) {
					captionEl.children[0].innerText = '';
					return false;
				}
				captionEl.children[0].innerHTML = item.title;
				return true;
			},
			showHideOpacity: true,
			history: false,
			shareEl: false

		};

		if (fromURL) {
			if (options.galleryPIDs) {
				// parse real index when custom PIDs are used
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for (var j = 0; j < items.length; j++) {
					if (items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

		// exit if index not found
		if (isNaN(options.index)) {
			return;
		}
		options = extend(options, opts);

		if (disableAnimation) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

		// see: http://photoswipe.com/documentation/responsive-images.html
		var realViewportWidth,
		    useLargeImages = false,
		    firstResize = true,
		    imageSrcWillChange;

		gallery.listen('beforeResize', function () {

			var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
			dpiRatio = Math.min(dpiRatio, 2.5);
			realViewportWidth = gallery.viewportSize.x * dpiRatio;

			if (realViewportWidth >= 1200 || !gallery.likelyTouchDevice && realViewportWidth > 800 || screen.width > 1200) {
				if (!useLargeImages) {
					useLargeImages = true;
					imageSrcWillChange = true;
				}
			} else {
				if (useLargeImages) {
					useLargeImages = false;
					imageSrcWillChange = true;
				}
			}

			if (imageSrcWillChange && !firstResize) {
				gallery.invalidateCurrItems();
			}

			if (firstResize) {
				firstResize = false;
			}

			imageSrcWillChange = false;
		});

		gallery.listen('gettingData', function (index, item) {
			// if (useLargeImages) {
			// 	item.src = item.src;
			// 	item.w = item.o.w;
			// 	item.h = item.o.h;
			// } else {
			// 	item.src = item.msrc;
			// 	item.w = item.m.w;
			// 	item.h = item.m.h;
			// }
		});

		gallery.init();
	};

	var extend = function extend(o1, o2) {
		for (var prop in o2) {
			o1[prop] = o2[prop];
		}
		return o1;
	};

	// select all gallery elements
	// var galleryElements = document.querySelectorAll(gallerySelector);
	// for (var i = 0, l = galleryElements.length; i < l; i++) {
	// 	galleryElements[i].setAttribute('data-pswp-uid', i + 1);
	// 	galleryElements[i].onclick = onThumbnailsClick;
	// }
	//galleryElement.setAttribute('data-pswp-uid', i + 1);
	galleryElement.onclick = onThumbnailsClick;

	galleryElement.classList.add('preview');

	if (group) {
		galleryElement.setAttribute('preview', group);
	}

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();
}

if (typeof window !== 'undefined' && !window.vuePhotoPreview) {
	window.vuePhotoPreview = vuePhotoPreview;
}
/* eslint-disable */

return vuePhotoPreview;

})));
