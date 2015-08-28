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
})();