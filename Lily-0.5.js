if(!String.repeat){
	String.prototype.repeat = function (count){
		return new Array(count + 1).join(this);
	}
}
if(!String.trim){
	String.prototype.trim = function (){
		return this.replace(/^\s+|\s+$/g, '');
	}
}
(function(){
	//命名空间
	var Lily = {}
	if(!window.Lily){
		window['Lily'] = Lily
	}

	function isCompatible(other){
		if(other === false
			|| !Array.prototype.push
			|| !Object.hasOwnProperty
			|| !document.createElement
			|| !document.getElementsByTagName
		){
			return false;
		}
		return true;
	}
	Lily['isCompatible'] = isCompatible;

	Lily['node'] = {
		ELEMENT_NODE : 1,
		ATTRIBUTE_NODE : 2,
		TEXT_NODE : 3,
		CDATA_SECTION_NODE : 4,
		ENTITY_REFERENCE_NODE : 5,
		ENTITY_NODE : 6,
		PROCESSING_INSTRUCTION_NODE : 7,
		COMMENT_NODE : 8,
		DOCUMENT_NODE : 9,
		DOCUMENT_TYPE_NODE : 10,
		DOCUMENT_FRAGMENT_NODE : 11,
		NOTATION_NODE : 12
	};

	function $(){
		var elements = new Array();

		for(var i = 0; i < arguments.length; i++){
			var element = arguments[i];

			if(typeof element == "string"){
				element = document.getElementById(element);
			}

			if(arguments.length == 1){
				return element;
			}
			elements.push(element);
		}

		return elements;
	}
	Lily['$'] = $;

	function addEvent(node, type, listener){
		if(!isCompatible()) return false;
		if(!(node = $(node))) return false;

		if(node.addEventListener){
			node.addEventListener(type, listener, false);
			return true;
		}else if(node.attachEvent){
			node[type + listener] = function(){
				listener.call(node, window.event);
			};
			node.attachEvent('on'+type, node[type + listener]);
			return true;
		}
		return false;
	}
	Lily['addEvent'] = addEvent;

	function removeEvent(node, type, listener){
		if(!(node = $(node))) return false;
		if(node.removeEventListener){
			node.removeEventListener(type, listener, false);
			return true;
		}else if(node.detachEvent){
			node.detachEvent('on'+type, node[type + listener]);
			node[type + listener] = null;
			return true;
		}
		return false;
	}
	Lily['removeEvent'] = removeEvent;

	function getElementsByClassName(className, tag, parent){
		var elements = new Array();
		parent = parent || document;
		tag = tag || "*";
		if(!(parent = $(parent))) return false;

		var allTags = (tag == "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
		className = className.replace(/\-/g, "\\-");
		var regexp = new RegExp("(^|\\s+)" + className + "(\\s+|$)");

		for(var i = 0; i < allTags.length; i++){
			var element = allTags[i];
			if(regexp.test(element.className)){
				elements.push(element);
			}
		}

		return elements;
	}
	Lily['getElementsByClassName'] = getElementsByClassName;

	function toggleDisplay(node, value){
		if(!(node = $(node))) return false;

		if(node.style.display != "none"){
			node.style.display = "none"
		}else{
			node.style.display = value || '';
		}

		return true;
	}
	Lily['toggleDisplay'] = toggleDisplay;

	function insertAfter(node, referenceNode){
		if(!(node = $(node))) return false;
		if(!(referenceNode = $(node))) return false;

		return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
	}
	Lily['insertAfter'] = insertAfter;

	function removeChildren(parent){
		if(!(parent = $(parent))) return false;
		while(parent.firstChild){
			parent.firstChild.parentNode.removeChild(parent.firstChild);
		}
		return parent;
	}
	Lily['removeChildren'] = removeChildren;

	function prependChild(parent, newChild){
		if(!(parent = $(parent))) return false;
		if(!(newChild = $(newChild))) return false;

		if(parent.firstChild){
			parent.insertBefore(newChild, parent.firstChild);
		}else{
			parent.appendChild(newChild);
		}

		return parent;
	}
	Lily['prependChild'] = prependChild;

	function bindFunction(obj, func){
		return function(){
			func.apply(obj, arguments);
		};
	}
	Lily['bindFunction'] = bindFunction;

	function getBrowserWindowSize(){
		var de = document.documentElement;
		return {
			width : window.innerWidth || (de && de.clientWidth) || (document.body.clientWidth),
			height: window.innerHeight || (de && de.clientHeight) || (document.body.clientHeight)
		};
	}
	Lily['getBrowserWindowSize'] = getBrowserWindowSize;

	function camelize(s){
		return s.replace(/-(\w)/g, function(regMatch, strMatch){
			return strMatch.toUpperCase();
		});
	}
	Lily['camelize'] = camelize;

	function walkDomRecursive(func, node, depth, returnedFromParent){
		var root = node || document;
		returnedFromParent = func.call(root, depth++, returnedFromParent);

		node = node.firstChild;
		while(node){
			walkDomRecursive(func, node, depth, returnedFromParent);
			node = node.nextSibling;
		}
	}
	Lily['walkDomRecursive'] = walkDomRecursive;

	function getEvent(event){
		return event || window.event;
	}
	Lily['getEvent'] = getEvent;

	function stopPropagation(event){
		event = event || getEvent(event);
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	}
	Lily['event'] = stopPropagation;

	function preventDefault(event){
		event = event || getEvent(event);
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	}
	Lily['preventDefault'] = preventDefault;

	function addLoadEvent(loadEvent, waitForImages){
		if(!isCompatible()) return false;
		if(waitForImages){
			addEvent(window, 'load', loadEvent);
		}

		var init = function (){
			if(arguments.callee.done) return;
			arguments.callee.done = true;

			loadEvent.apply(document, arguments);
		};

		if(document.addEventListener){
			document.addEventListener("DomContentLoaded", init, false);
		}

		if(/WebKit/i.test(navigator.userAgent)){
			var timer = setInterval(function (){
				if(/complete|loaded/.test(document.readyState)){
					clearInteval(timer);
					init();
				}
			}, 10);
		}

		/*@cc_on @*/
		/*@if (@_win32)
		document.write("<src id=__ie_loaded defer src=//:><\/script>");
		var script = document.getElementById("__ie_loaded");
		script.onreadystatechange = function (){
			if(this.readyState == "complete"){
				this.onreadystatechange = null;
				init();
			}
		};
		/*@end @*/

		return true;
	}
	Lily['addLoadEvent'] = addLoadEvent;

	function getTarget(event){
		event = event || getEvent(event);
		var target = event.target || event.srcElement;

		if(target.nodeType == Lily.node.TEXT_NODE){
			target = target.parentNode;
		}

		return target;
	}
	Lily['getTarget'] = getTarget;

	function getMouseButton(event){
		event = event || getEvent(event);
		var buttons = {
			'left' : false,
			'middle' : false,
			'right' : false
		};

		if(event.toString && event.toString().indexOf('MouseEvent') != -1){
			switch(event.button){
				case 0:
					buttons.left = true;
					break;
				case 1:
					buttons.middle = true;
					break;
				case 2:
					buttons.right = true;
					break;
				default:
					break;
			}
		}else if(event.button){
			switch(event.button){
				case 1:
					buttons.left = true;
					break;
				case 2:
					buttons.right = true;
					break;
				case 3:
					buttons.left = true;
					buttons.right = true;
					break;
				case 4:
					buttons.middle = true;
					break;
				case 5:
					buttons.left = true;
					buttons.middle = true;
					break;
				case 6:
					buttons.middle = true;
					buttons.right = true;
					break;
				case 7:
					buttons.left = true;
					buttons.middle = true;
					buttons.right = true;
					break;
				default:
					break;

			}
		}else{
			return false;
		}

		return buttons;
	}
	Lily['getMouseButton'] = getMouseButton;

	function getPositionInDocument(event){
		event = event || getEvent(event);
		var x = event.pageX || 
				(event.clientX + document.documentElement.scrollLeft) || 
				(event.clientX + document.body.scrollLeft);
		var y = event.pageY || 
				(event.clientY + document.documentElement.scrollTop) ||
				(event.clientY + document.body.scrollTop);

		return {'x' : x, 'y' : y};
	}
	Lily['getPositionInDocument'] = getPositionInDocument;

	function getKeyPressed(event){
		event = event || getEvent(event);
		var code = event.keyCode;
		var value = String.fromCharCode(code);

		return {'code': code, 'value': value};
	}
	Lily['getKeyPressed'] = getKeyPressed;

	function setStyleById(elem, styles){
		if(!(elem = $(elem))) return false;

		for(prop in styles){
			if(!styles.hasOwnProperty(prop)) continue;

			if(elem.style.setProperty){
				elem.style.setProperty(prop, styles[prop]);
			}else{
				elem.style[camelize(prop)] = styles[prop];
			}
		}
		return true;
	}
	Lily['setStyleById'] = setStyleById;

	function setStyleByClass(parent, tag, className, styles){
		var elements = getElementsByClassName(className, tag, parent);
		for(var i = 0; i < elements.length; i++){
			setStyleById(elements[i], styles);
		}
		return true;
	}
	Lily['setStyleByClass'] = setStyleByClass;

	function setStyleByTag(tag, styles, parent){
		parent = $(parent) || document;
		var elements = parent.getElementsByTagName(tag);

		for(var i = 0; i < elements.length; i++){
			setStyleById(elements[i], styles);
		}
		return true;
	}
	Lily['setStyleByTag'] = setStyleByTag;

	function getClassNames(elem){
		if(!(elem = $(elem))) return false;
		return elem.className.split(/\s+/);
	}
	Lily['getClassNames'] = getClassNames;

	function hasClassName(elem, className){
		if(!(elem = $(elem))) return false;
		var classNames = getClassNames(elem);

		for (var i = 0; i < classNames.length; i++) {
			if(classNames[i] === className) return true;
		}

		return false;
	}
	Lily['hasClassName'] = hasClassName;

	function addClassName(elem, className){
		if(!(elem = $(elem))) return false;
		elem.className += (elem.className? ' ' : '') + className;
		return true;
	}
	Lily['addClassName'] = addClassName;

	function removeClassName(elem, className){
		if(!(elem = $(elem))) return false;
		var classNames =  getClassNames(elem);
		var length = classNames.length;

		for (var i = length - 1; i >= 0; i--) {
			if(classNames[i] === className) delete classNames[i];
		};

		elem.className = classNames.join(' ');
		return (length == classNames.length) ? false : true;
	}
	Lily['removeClassName'] = removeClassName;

	function toggleClassName(elem, className){
		if(!(elem = $(elem))) return false;
		if(hasClassName(elem, className)){
			removeClassName(elem, className);
		}else{
			addClassName(elem, className);
		}
	}
	Lily['toggleClassName'] = toggleClassName;

	function getComputedStyle(elem, property){
		if(!(elem = $(elem)) || !property) return false;
		var value = elem.style[camelize(property)];

		if(!value){
			if(document.defaultView && document.defaultView.getComputedStyle){
				var css = document.defaultView.getComputedStyle(elem, null);
				value = css ? css.getPropertyValue(property) : null;
			}else if(elem.currentStyle){
				value = elem.currentStyle[camelize(property)];
			}
		}

	    return value == "auto" ? '' : value;
	}
	Lily['getComputedStyle'] = getComputedStyle;
})();