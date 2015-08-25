function myLogger(id){
	id = id || 'LilyLogWindow';
	var logWindow = null;

	var createWindow = function (){
		var windowSize = Lily.getBrowserWindowSize();
		var left = (windowSize.width - 200)/2 || 0;
		var top = (windowSize.height - 200)/2 || 0;

		logWindow = document.createElement("ul");
		logWindow.setAttribute("id", id);

		logWindow.style.position = "absolute";
		logWindow.style.left = left + "px";
		logWindow.style.top = top + "px";

		logWindow.style.width = "200px";
		logWindow.style.height = "200px";
		logWindow.style.overflow = "scroll";

		logWindow.style.border = "1px solid #f1f1f1";
		logWindow.style.padding = "0";
		logWindow.style.margin = "0";
		logWindow.style.listStyle = "none";

		document.body.appendChild(logWindow);
	};

	this.writeRaw = function (message){
		if(!logWindow) createWindow();
		var li = document.createElement("li");

		li.style.padding = "2px";
		li.style.margin = "0";
		li.style.borderBottom = "1px dotted #f0f0f0";

		if(typeof message == "undefined"){
			li.appendChild(document.createTextNode("message is undefined"));
		}else if(typeof li.innerHTML != "undefined"){
			li.innerHTML = message;
		}else{
			li.appendChild(document.createTextNode(message));
		}

		logWindow.appendChild(li);
		return true;
	};
}

myLogger.prototype = {
	write : function (message){
		if(typeof message != 'string'){
			if(message.toString){
				return this.writeRaw(message.toString());
			}else{
				return this.writeRaw(typeof message);
			}
		}

		if(typeof message == 'string' && message.length == 0){
			return this.writeRaw("Lily log : message is null");
		}

		message = message.replace(/</g, '&lt;').replace(/>/g, "&gt;");
		return this.writeRaw(message);

	},
	header: function (message){
		message = '<span style="color:#fff;background-color:#000;font-weight:bold;padding:2px 5px">' + message + '</span>';
		return this.writeRaw(message);
	}
};

if(!window.Lily) { window.Lily = {}; }
window['Lily']['log'] = new myLogger();