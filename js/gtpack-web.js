'use strict';

var app = {}, gtpack = {};

(function(__root__){
	var app_root = document.querySelector("script[main-class]").getAttribute('package-src'), 
		buffer = [];

	__root__.onload = function() {
		var mainModule = document.querySelector("script[main-class]").getAttribute('main-class');
		loadClassAsync(mainModule);
	}

	function loadClassAsync(className, fOnload) {
		var s = document.createElement('script');
		s.src = app_root + className.replace(/\./g, '/') + '.js';
		s.async = true;
		if (fOnload) {
			s.onload = fOnload;
		}
		document.querySelector('head').appendChild(s);
	}

	function define(aImport, cClass, oStaticMethods) {
		var cClass = cClass || function() {};
		var oStaticMethods = oStaticMethods || {};
		
		var aClassNames = [];
		for (var i = 0; i < aImport.length; i++) {
			aClassNames[i] = aImport[i];
		}
		buildPackage(__root__, aClassNames[0].split('.'));
		if (aClassNames.length > 1) {
			for (var i = 1; i < aClassNames.length; i++) {
				if (!classExists(aClassNames[i])) {
					if (!scriptInDOM(aClassNames[i])) {
						loadClassAsync(aClassNames[i]);
					}
					buffer.push({
						import: aImport,
						class: cClass,
						staticMethods: oStaticMethods
					});
					return;
				}
			}
		}
		function each( obj, callback ) {
			var length, i = 0;

			if ( obj instanceof Array) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}

			return obj;
		}
		function buildPackage(obj, aPackage) {
			var ss = aPackage.shift();
			if (aPackage.length == 0) {
				obj[ss] = cClass;
				each(oStaticMethods, function(staticMethodName, staticMethodValue) {
					obj[ss][staticMethodName] = staticMethodValue;
				});
				return;
			} else {
				if (obj[ss] == undefined)
					obj[ss] = {};
				buildPackage(obj[ss], aPackage);
			}
		};
		function classExists (sName) {
			var aName = sName.split('.');
			var exists = true;
			var node = aName.shift();
			while (exists) {
				try {
					eval(node);
				} catch (e) {
					return false;
				}
				if (eval(node) === undefined)
					exists = false;
				if (aName.length > 0) {
					node = node + '.' + aName.shift();
				} else {
					break;
				}
			}
			return exists;
		};
		function scriptInDOM (className) {
			var classPath = app_root + className.replace(/\./g, '/') + '.js';
			var exists = false;
			if (document.querySelectorAll('script[src=\'' + classPath + '\']').length) {
				exists = true;
			}
			return exists;
		};
		
		(function (sClassName) {
			var sMainModule = document.querySelector("script[main-class]").getAttribute('main-class');
			if (sClassName == sMainModule) {
				function stringToFunction(str) {
					var arr = str.split('.');
					var fn = (__root__ || this);
					for (var i = 0, len = arr.length; i < len; i++) {
						fn = fn[arr[i]];
					}
					if (typeof fn !== 'function') {
						throw new Error('function not found');
					}
					return fn;
				};

				var cMainController = stringToFunction(sClassName);
				app = new cMainController();
				if (__root__._ready) {
					__root__._ready();
					delete __root__._ready;
					if (gtpack.ready)
						delete gtpack.ready;
				}
			}
		})(aClassNames[0]);

		if (buffer.length > 0) {
			var bufferedArgs = buffer.pop();
			define(bufferedArgs.import, bufferedArgs.class, bufferedArgs.staticMethods);
		}
	}

	gtpack.CSS = function(obj) {
		function createCSSSelector(selector, style) {
			if (!document.styleSheets)
				return;
			if (document.getElementsByTagName('head').length == 0)
				return;

			var styleSheet, mediaType;

			if (document.styleSheets.length > 0) {
				for (var i = 0, l = document.styleSheets.length; i < l; i++) {
					if (document.styleSheets[i].disabled)
						continue;
					var media = document.styleSheets[i].media;
					mediaType = typeof media;

					if (mediaType === 'string') {
						if (media === '' || (media.indexOf('screen') !== -1)) {
							styleSheet = document.styleSheets[i];
						}
					} else if (mediaType == 'object') {
						if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
							styleSheet = document.styleSheets[i];
						}
					}

					if (typeof styleSheet !== 'undefined')
						break;
				}
			}

			if (typeof styleSheet === 'undefined') {
				var styleSheetElement = document.createElement('style');
				styleSheetElement.type = 'text/css';
				document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

				for (i = 0; i < document.styleSheets.length; i++) {
					if (document.styleSheets[i].disabled) {
						continue;
					}
					styleSheet = document.styleSheets[i];
				}

				mediaType = typeof styleSheet.media;
			}

			if (mediaType === 'string') {
				for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
					if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
						console.log('(mediaType === string) reset style a '+ i)
						styleSheet.rules[i].style.cssText = style;
						return;
					}
				}
				styleSheet.addRule(selector, style);
			} else if (mediaType === 'object') {
				// var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
				var styleSheetLength = 0;
				for (var i = 0; i < styleSheetLength; i++) {
					if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
						console.log('(mediaType === object) reset style a '+ i)
						styleSheet.cssRules[i].style.cssText = style;
						return;
					}
				}
				styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
			}
		}
		function createClass(name,rules){
			var style;
			if(document.getElementsByTagName('style').length == 0){
				style = document.createElement('style');
				style.type = 'text/css';
				document.getElementsByTagName('head')[0].appendChild(style);
			}else{
				style = document.getElementsByTagName('style')[0];
			}
			
			if(!(style.sheet||{}).insertRule) 
				(style.styleSheet || style.sheet).addRule(name, rules);
			else
				style.sheet.insertRule(name+" {"+rules+"}",(style.styleSheet || style.sheet).length);
		}
		var kk;
		for (var i in obj) {
			if (true || !gtpack.CSS[i]) {
				gtpack.CSS[i] = '\n';
				for (var j in obj[i]) {
					kk = j.split(/([A-Z]{1})/).map(function(a){ 
						return a===a.toUpperCase()? '-'+a.toLowerCase(): a
					}).join('');
					if(typeof obj[i][j] == 'string'){
						gtpack.CSS[i] += kk + ': ' + obj[i][j] + ';\n';
					}else if( obj[i][j] instanceof Array){
						gtpack.CSS[i] += kk + ': ' + obj[i][j].map(function(a){ return kk + ": " + a +""}).join(';\n') + ';\n';
					}
				}
				
				try{
					createCSSSelector(i, gtpack.CSS[i])
				}catch(e){
					createClass(i, gtpack.CSS[i])
				}
			}else{
				console.warn('CSS Class a '+i+' already exist');
			}
		}
	};
	gtpack.cssImport = function(url){
		var _css = document.createElement('link');
		_css.href = url;
		_css.rel = "stylesheet";
		_css.type = "text/css";
		document.head.append(_css);
	}
	gtpack.DOM = function() {
		var dom = this, fn = {
			add: function (child) {
				if (child instanceof Node) {
					this.appendChild(child)
				}else{
					for (var item in child) {
						this.appendChild(child[item])
					}
				}
				return this;
			},
			event: function (... ar) {
				for (var i = 0; i < ar.length; i++) {
					for(var item in ar[i]){
						this[item] = ar[i][item];
					}
				}
				return this;
			},
			addClass: function (className) {
				this.classList.add(className);
				return this;
			},
			attr: function (attrName, value) {
				this.setAttribute(attrName, value);
				return this;
			},
			text: function (str) {
				if (this.tagName === 'INPUT') {
					if (str == null) {
						return this.value;
					} else {
						this.value = str;
						return this;
					}
				}else{
					if (str == null) {
						return this.innerHTML;
					} else {
						this.innerHTML = str;
						return this;
					}
				}
			}
		};
		this.render = function (el) {
			document.body.innerHTML = '';
			document.body.appendChild(el);
		};
		this.text = function (data) {
			return document.createTextNode(data);
		},
		this.div = function (config, tag, attr) {
			if (typeof config === 'string' || typeof config === 'number') {
			   return dom.div([dom.text(config+'')], tag, attr);
			}

			var el = document.createElement(tag || 'div');

			el.add      = fn.add;
			el.addClass = fn.addClass;
			el.text     = fn.text;
			el.attr     = fn.attr;
			el.event     = fn.event;
			if (attr && typeof attr === 'object') {
				for(var atr in attr){
					el.setAttribute(atr, attr[atr]);
				}
			}
			if (config instanceof Node) {
				el.appendChild(config)
			}else{
				for (var item in config) {
					el[item] = config[item];
					el.appendChild(config[item])
				}
			}
			return el;
		},
		this.button = function (title, click) {
			var el = dom.div(null, 'input', {type: 'button', value: title});
			if (click) el.onclick = click;
			return el;
		},
		this.input = function (value) {
			var atr = {
				type: 'input'
			}
			if (value) {
				atr.value = value;
			}
			return dom.div(null, 'input', atr);
		},
		this.inputPass = function (value) {
			var atr = {
				type: 'password'
			}
			if (value) {
				atr.value = value;
			}
			return dom.div(null, 'input', atr);
		},
		this.p = function (text) {
			return dom.div([dom.text(text)], 'p');
		}
	}
	gtpack.DOM.render = function  (el) {
		document.body.innerHTML = '';
		document.body.appendChild(el);
	};

	gtpack.import = loadClassAsync;
	__root__.define = define;
	(function(){
		var dom = new gtpack.DOM();
		__root__.$ = function(tag, content, attributes){
			if(typeof tag != 'string') 
				return dom.div(tag, content, attributes);
			else if(typeof content === 'object') 
				return dom.div(null, tag, content);
			else if(!content && !attributes) 
				return dom.div(tag);
			else
				return dom.div(content, tag, attributes);
		};
		var arrTags = "a$abbr$acronym$address$applet$area$article$aside$audio$b$base$basefont$bdi$bdo$big$blockquote$body$br$button$canvas$caption$center$cite$code$col$colgroup$command$datalist$dd$del$details$dfn$dir$div$dl$dt$em$embed$fieldset$figcaption$figure$font$footer$form$frame$frameset$h1$h2$h3$h4$h5$h6$head$header$hgroup$hr$html$i$iframe$img$input$ins$kbd$keygen$label$legend$li$link$map$mark$menu$meta$meter$nav$noframes$noscript$object$ol$optgroup$option$output$p$param$pre$progress$q$rp$rt$ruby$s$samp$script$section$select$small$source$span$strike$strong$style$sub$summary$sup$table$tbody$td$textarea$tfoot$th$thead$time$title$tr$track$tt$u$ul$var$video$wbr".split('$')
		for (var i = 0; i < arrTags.length; i++) {
			switch (arrTags[i]) {
				case "a":
					__root__["$" + arrTags[i]] = function(paramA, paramB) {
						var _a = document.createElement('a');
						_a.innerHTML = paramA instanceof Node? paramA.outerHTML: paramA +"";
						if(paramB){
							for(var item in paramB){
								_a[item] = paramB[item];
							}
						}
						return _a;
					}

					break;
				case "table":
					__root__["$" + arrTags[i]] = function(paramA, paramB) {
						if(!paramA) return $(null, 'table');
						var d = $(null, 'table'), tbody, tr;
						
						if(paramA.caption) d.add($caption(paramA.caption))
						if(paramA.head) {
							d.add($thead(tr = $tr()));
							for (var j = 0; j < paramA.head.length; j++) {
								tr.add($th(paramA.head[j]))	
							}
						}
						if(paramA.foot) {
							d.add($tfoot(tr = $tr()));
							for (var j = 0; j < paramA.foot.length; j++) {
								tr.add($td(paramA.foot[j]))	
							}
						}
						if(paramB) paramA = paramB;
						d.add(tbody = $tbody());
						for (var i = 0; i < paramA.length; i++) {
							tbody.add(tr = $tr());
							for (var j = 0; j < paramA[i].length; j++) {
								tr.add($td(paramA[i][j]))	
							}
						}
						return d;
					}
					break;
				default:
					__root__["$" + arrTags[i]] = (function(tag){
						return function(content, attr) {
							return dom.div(content, tag, attr);
						}
					})(arrTags[i])
					break;
			}
		}
	})()
})(window);
Object.more = function(o){
	Object.defineProperty(o, 'getset', {
		enumerable: false,
		configurable: true,
		get: function() {
			return function(PropName, fget, fset) {
				Object.defineProperty(this, PropName, {
					set: fset,
					get: fget
				});
				return this;
			}
		},
		set: function(a) {
			throw 'error'
		}
	});

	Object.defineProperty(o, 'Json', {
		enumerable: false,
		configurable: true,
		get: function() {
			return function() {
				return JSON.stringify(this);
			};
		}
	});
	Object.defineProperty(o, "prop", {
		enumerable: false,
		configurable: true,
		get: function() {
			return this
		},
		set: function(a) {
			for (var b in a){
				if(a[b] != this[b]){
					this[b] = a[b];
				}
			}
		}
	});
	return o;
};

String.prototype.compress = function() {
	var str = this;
	var alf = []
	  , ind = []
	  , c = []
	  , a = str.split("");
	for (var i in a) {
		if (alf.indexOf(a[i]) == -1)
			alf.push(a[i]);
		ind.push(alf.indexOf(a[i]))
	}
	if (ind.length % 2)
		ind.push(0xFF)
	for (var i = 0; i < ind.length; i += 2)
		c.push((ind[i] << 8) ^ ind[i + 1]);
	return [alf.join(""), String.fromCharCode(0xffff, 0xffff), c.map(function(a) {
		return String.fromCharCode(a)
	}).join("")].join("")
}

String.prototype.uncompress = function() {
	var str = this;
	var arr = str.split(String.fromCharCode(0xffff, 0xffff)), alf = arr[0], ind = [], i, c = arr[1].split("").map(function(a) {
		return a.charCodeAt()
	});
	for (i in c)
		ind.push(c[i] >>> 8, c[i] ^ (c[i] >>> 8 << 8));
	for (i in ind)
		ind[i] = alf[ind[i]]
	return ind.join("");
}
String.prototype.hash = function(lenHash) {
	var str = this;
	lenHash = lenHash || 32;
	str = str || "";
	var ar = str.split('').map(function(a) {
		return a.charCodeAt(0)
	}), s2alength = ar.length || 1, i = ar.length ? ar.reduce(function(p, c) {
		return p + c
	}) : 1, s = "", A, B, k = 0, tan = Math.tan;
	while (s.length < lenHash) {
		A = ar[k++ % s2alength] || 0.5;
		B = ar[k++ % s2alength ^ lenHash] || 1.5 ^ lenHash;
		i = i + (A ^ B) % lenHash;
		// s += tan(i*B/A).toString(16).split('.')[1];
		s += tan(i * B / A).toString(16).split('.')[1].slice(0, 10);
	}
	return s.slice(0, lenHash);
}
String.prototype.jsonParse = function() {
	return JSON.parse(this);
}