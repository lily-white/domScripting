(function (){
	var domCode = '';
	var nodeNameCounters = [];
	var requiredVariables = '';
	var newVariables = '';

	function encode(str){
		if(!str) return null;
		str = str.replace(/\\/g, '\\\\');
		str = str.replace(/'/g, "\\'");
		str = str.replace(/\s+^/mg, '\\n');

		return str;
	}
	function checkForVariables(v){
		if(v.indexOf('$') == -1){
			v = "\'" + v + "\'";
		}else{
			v = v.substring(v.indexOf('$')+1);
			requiredVariables += 'var ' + v + ";\n";
		}

		return v;
	}
	function generate(strHtml, strRoot){
		domCode = '';
		nodeNameCounters = [];
		requiredVariables = '';
		newVariables = '';

		var root = document.createElement("div");
		root.innerHTML = strHtml;

		var node = root.firstChild;
		while(node){
			Lily.walkDomRecursive(processNode, node, 0, strRoot);

			node = node.nextSibling;
		}


		
		domCode = '/* required variables \n' + requiredVariables + '*/\n\n' +
				   domCode +
				   '/* new variables \n' + newVariables + '*/\n\n';

		return domCode;
	}
	function processAttribute(tabCount, refParent){
		if(!this.nodeType == Lily.node.ATTRIBUTE_NODE) return;
		var value = this.nodeValue ? encode(this.nodeValue.trim()) : '';
		if(!value) return;

		var tabs = tabCount ? '\t'.repeat(parseInt(tabCount)) : refParent;
		var ref;

		switch(this.nodeName){
			default:
				if(this.nodeName.substring(0, 2) == 'on'){
					domCode += tabs + refParent + "." + this.nodeName + " = function (){ " + this.nodeValue + "};\n";
				}else{
					domCode += tabs + refParent + ".setAttribute('" + this.nodeName + "', " + checkForVariables(value) + ");\n";
				}
				break;
			case "class":
				domCode += tabs + refParent + ".className = " + checkForVariables(value) + ";\n";
				break;
			case "style":
				var style = this.nodeValue.split(/\s*;\s*/);
				for(index in style){
					if(!style[index]) continue;
					var pair = style[index].split(/\s*:\s*/);

					if(!pair[1]) continue;
					var attrValue = checkForVariables(pair[1]);
					if(pair[0] == 'float'){
						domCode += tabs + refParent + ".style.cssFloat = " + attrValue + ";\n";
						domCode += tabs + refParent + ".style.styleFloat = " + attrValue + ";\n";
					}else{
						domCode += tabs + refParent + ".style." + Lily.camelize(pair[0]) + " = " + attrValue + ";\n";
					}
				}
				break;
		}

	}
	function processNode(tabCount, refParent){
		var tabs = tabCount ? "\t".repeat(parseInt(tabCount)) : '';
		var ref;
		switch(this.nodeType){
			case Lily.node.ELEMENT_NODE:
				if(nodeNameCounters[this.nodeName]){
					++nodeNameCounters[this.nodeName];
				}else{
					nodeNameCounters[this.nodeName] = 1;
				}

				ref = this.nodeName.toLowerCase() + nodeNameCounters[this.nodeName];
				domCode += tabs + "var " + ref + " = document.createElement('" + this.nodeName + "');\n";
				newVariables += ' ' + ref + ';\n';

				if(this.attributes){
					for(var i = 0; i <this.attributes.length; i++){
						Lily.walkDomRecursive(processAttribute, this.attributes[i], tabCount, ref);
					}
				}
				break;
			case Lily.node.TEXT_NODE:
				var value = this.nodeValue ? encode(this.nodeValue.trim()) : '';
				if(value){
					if(nodeNameCounters['txt']){
						++nodeNameCounters['txt'];
					}else{
						nodeNameCounters['txt'] = 1;
					}

					ref = 'txt' + nodeNameCounters['txt'];
					value = checkForVariables(value);

					domCode += tabs + "var " + ref + " = document.createTextNode(" + value + ");\n";
					newVariables += ' ' + ref + ';\n';
					
				}else{
					return;
				}
				break;
			default:
				break;
		}

		if(refParent){
			domCode += refParent + ".appendChild(" + ref + ");\n";
		}
		return ref;
	}
	Lily['generateDom'] = generate;
})();