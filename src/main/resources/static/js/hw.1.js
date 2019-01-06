
var mouse_down = false;
var draw_canvas = false;
var pos_x = -1;
var pos_y = -1;

var sequence;

var stroke_num = 0;
var point_num = 0;
var grid_num = 1;

var canvas;
var ctx;

var xmlhttp;
var canvas_text = " ";

var resultArea;
var resultNum = 0;
var textInput;

var offsetLeft;
var offsetTop;
var khj;
var k;
var knext;
var unext;
//var clrindex=[ 0,       1,       2,	3,	4,	5];
//var colortbl=["black", "white", "red",    "orange",  "purple", "maroon"];
var colortbl=['#000000','#ffffff','#ff0000','#ffa500','#ff00ff','#B22222'];
var BackButton = "Back";
var InputButton = "Input";
var AgainButton = "Again";
var NextButton = "Next";
var Prompt = "Please input your kanji.";

window.onresize = function(){
	//alart("change window");
}

function checkXmlHttp() {
	if(! xmlhttp) xmlhttp = createXmlHttp();
	if(! xmlhttp || xmlhttp.readyState == 1 ||
			xmlhttp.readyState == 2 || xmlhttp.readyState == 3){
		return false;
	}
	return true;
}

function createXmlHttp () {
	xmlhttp = false;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP.6.0");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP.3.0");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (E) {
					xmlhttp = false;
				}
			}
		}
	}
	if(!xmlhttp && typeof XMLHttpRequest != 'undefined') {
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

function getCanvas() {
	return document.getElementById("canvas");
}

//function onload() {
window.onload = function() {
	onloadf();
}

function onloadf() {
	setButton();
	setMode();
	setKanji();

	setTimeout("scrollTo(0,1)", 138);
	canvas = getCanvas();
	ctx = canvas.getContext('2d'); 

	canvas.addEventListener("touchstart", touchStart, false);
	canvas.addEventListener("touchmove", touchMove, false);
	canvas.addEventListener("touchend", touchEnd, false);
	canvas.addEventListener("mouseclick", touchStart, false);
	canvas.addEventListener("mousedblclick", touchStart, false);
	canvas.addEventListener("mousedown", touchStart, false);
	canvas.addEventListener("mousemove", touchMove, false);
	canvas.addEventListener("mouseup", touchEnd, false);

	resultArea = document.getElementById("hwrj-result");
	resultArea.className = "hwrj-result";
	textInput = document.getElementById("hwrj-text");
	textInput.className = "hwrj-text";

	offsetLeft = 0;
	//offsetLeft = canvas.offsetLeft;
	offsetTop = canvas.offsetTop;
	if(offsetTop == 0)
		offsetTop = window.pageYOffset;
	unext = 0;
	clear();
}

function clearAll() {
	clear();
	textInput.value = "";
}

function clear() {
	sequence = new Array();
	point_num = 0;
	stroke_num = 0;
	pos_x = -1;
	pos_y = -1;
	//unext = 0;
	resultArea.innerHTML = "";
	clearImage();
}

function clearImage() {
	ctx.clearRect(0,0, size,size);

	drawLine2(0,0, 0,size, 1);
	drawLine2(0,size, size,size, 1);
	drawLine2(size,0, 0,0, 1);

	if(grid_num != 0) {
		ctx.strokeStyle='rgba(183, 183, 183, 1.0)';
		drawDash2(0,size/2, size,size/2, 1, 2, 6);
		drawDash2(size/2,0, size/2,size, 1, 2, 6);
		ctx.strokeStyle='black';
	}

	var x = 30;
	var y = 200;
	ctx.font = "200px KanjiStrokeOrders,HGKyokashotai,DFPKyoKaSho-W3,HG教科書体,ＤＦＰ教科書体W3,NtMotoyaKyotaiStd-W3,Serif";
	ctx.fillStyle = "Lightgray";
	ctx.fillText(k, x-15, y-5);
}

function touchStart(event) {
	event.preventDefault();
	mouse_down = true;
	if(event.touches) {
		pos_x = event.touches[0].pageX - offsetLeft;
		pos_y = event.touches[0].pageY - offsetTop;
	} else if(event.offsetX) {
		pos_x = event.offsetX;
		pos_y = event.offsetY;
	} else if(event.layerX) {
		pos_x = event.layerX;
		//pos_y = event.layerY;
		pos_y = event.layerY - offsetTop;
	} else if (evt.pageX) {
		pos_x = evt.pageX;
		pos_y = evt.pageY;
	} else {
		pos_x = evt.clientX; + document.documentElement.scrollLeft;
		pos_y = evt.clientY; + document.documentElement.scrollTop;
	}
}

function touchMove(event) {
	event.preventDefault();

	var x;
	var y;
	if(!mouse_down)
		return;

	if(event.touches) {
		x = event.touches[0].pageX - offsetLeft;
		y = event.touches[0].pageY - offsetTop;
	} else if(event.offsetX) {
		x = event.offsetX;
		y = event.offsetY;
	} else if(event.layerX) {
		x = event.layerX;
		//y = event.layerY;
		y = event.layerY - offsetTop;
	} else if (evt.pageX) {
		x = evt.pageX;
		y = evt.pageY;
	} else {
		x = evt.clientX + document.documentElement.scrollLeft;
		y = evt.clientY + document.documentElement.scrollTop;
	}

	var x2 = x;
	var y2 = y;
	if(point_num == 0) {
		sequence[stroke_num] = new Array();
	}

	sequence[stroke_num][point_num] = { x:x2, y:y2 };

	if(point_num == 0) {
		annotate(stroke_num+1, x, y);
	}
	if(pos_x != -1) {
		drawLine(pos_x, pos_y, x, y);
		draw_canvas = true;
	} else {
		drawLine(pos_x, pos_y, pos_x+1, pos_y+1);
	}
	++point_num;
	pos_x = x;
	pos_y = y;
	event.preventDefault();
}

function touchEnd(event) {
	if(!mouse_down)
		return;
	if(!draw_canvas)
		return;
	sendStroke();

	mouse_down = false;
	draw_canvas = false;
	stroke_num++;
	point_num = 0;
}

function againStroke() {
	if(stroke_num > 0) {
		var o=canvas;
		while (o.firstChild)
			o.removeChild(o.firstChild);
		sendFeedback('k', 'c');
	}
	clearAll();
	mouse_down = false;
	draw_canvas = false;
}

function backStroke() {
	if(stroke_num > 0) {
		sequence.pop();
		stroke_num--;
	}
	if(stroke_num > 0) {
		var o=canvas;
		while (o.firstChild)
			o.removeChild(o.firstChild);

		clearImage();
		drawAll();
		sendStroke();
	} else {
		clearAll();
	}
	mouse_down = false;
	draw_canvas = false;
}

function drawAll() {
	var stroke;
	var p_num;
	for(stroke = 0; stroke < stroke_num; stroke++) {
		var l = 0; //offsetLeft;
		var t = 0; //offsetTop;
		annotate(stroke+1, sequence[stroke][0].x + l, 
			sequence[stroke][0].y + t);
		drawStroke(stroke, 0);
/*
		for(p_num=0; p_num < sequence[stroke].length - 1; p_num++) {
			drawLine(sequence[stroke][p_num].x + l, 
				sequence[stroke][p_num].y + t,
				sequence[stroke][p_num+1].x + l, 
				sequence[stroke][p_num+1].y + t);
		}
*/
	}
	event.preventDefault();
}

function drawStroke(n, c) {
	//console.log("drawStroke: n="+n+", c="+c);
	//var self = this;
	if(n<0 || n>= sequence.length)
		return;
	if(c < 0 || c > 5)
		c = 0;
	ctx.strokeStyle = colortbl[c];
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(sequence[n][0].x, sequence[n][0].y);
	for (var i = 1; i < self.sequence[n].length; ++i) {
		ctx.lineTo(sequence[n][i].x, sequence[n][i].y);
		ctx.stroke();
	}
	ctx.strokeStyle = colortbl[0];
}

function annotate(number, x, y) {
	text(number, x, y, 0);
}

function text(number, x, y, c) {
	ctx.font = "bold 16px Serif";
	if(c < 0 || c > 5)
		c = 0;
	ctx.fillStyle = colortbl[c];
	ctx.fillText(number, x-15, y-5);
}

function drawLine(x1, y1, x2, y2) {
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	ctx.stroke();
}

function drawLine2(x1, y1, x2, y2, t) {
	ctx.lineWidth = t;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	ctx.stroke();
}

function drawDash2(x1, y1, x2, y2, t, length, skip) {
	ctx.lineWidth = t;
	var all = 0;
	var dx = length;
	var dy = 0.0;
	if((y1 - y2) == 0) {
		all = Math.abs(x2 - x1);
	} else if((x1 - x2) == 0) {
		all = Math.abs(y2 - y1);
		dx = 0.0;
		dy = length;
	} else {
		all = Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
		var ang = Math.atan2(y2 - y1, x2 - x1);
		dx = length * Math.cos(ang);
		dy = length * Math.sin(ang);
	}
	var n = Math.round(all / length);
	for (var i = skip / 2; i < n; i += skip) {
		ctx.beginPath();
		ctx.moveTo(dx * i + x1, dy * i + y1);
		ctx.lineTo(dx * (i+1) + x1, dy * (i+1) + y1);
		ctx.closePath();
		ctx.stroke();
	}
}

function sendStroke() {
	var r = makeMessage('_', khj, k);
	if(!checkXmlHttp()) return;
	xmlhttp.open("POST", "hwr.jsp", true);
	//xmlhttp.overrideMimeType('text/plain; charset=UTF-8');
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && self.xmlhttp.status == 200) {
			showResult();

			var back = createButton(BackButton, "0");
			back.onclick = function() { backStroke(); }
			resultArea.appendChild(back);

			var learn = createButton(InputButton, "0");
			learn.onclick = function() {
				var n = prompt(Prompt, "");
				if(n) {
					//self.sendFeedback('i', n);
					self.sendFeedback('k', n);
					self.textInput.value += n;
					self.clear();
				}
			}
			resultArea.appendChild(learn);

			var undo = createButton(AgainButton, "0");
			undo.onclick = function() { againStroke(); }
			resultArea.appendChild(undo);

			if(khj == "K" || khj == "H" || khj == "J") {
				var nextb = createButton(NextButton, "#ffc0cb");
				nextb.onclick = function() {
					gonext();
				}
				resultArea.appendChild(nextb);
			}

			var cand = xmlhttp.responseText;
			var obj = eval("(" + cand + ")");

			if(obj.manabix == "1.0") {
				for(var i=0; i<obj.r.length; i++) {
					self.addResult(obj.r[i][0],obj.r[i][1]);
				}
				for(var i=0; i < obj.c.length; i++) {
				//console.log("JSON: c["+i+"]="+obj.c[i]);
					if(obj.c[i] == null) continue;
					drawStroke(i, obj.c[i]);
		//var lastp = sequence[i].length - 1;
		//text(i+1, sequence[i][lastp].x, sequence[i][lastp].y, 0);
				}
			} else {
				var cand = self.xmlhttp.responseText.split("\n");
				self.addResult("　", " ");
				for (var i = 0; i < cand.length; i++) {
					if (cand[i] == "") continue;
					if (cand[i].length < 2) continue;
					var l = cand[i].split("\t");
					self.addResult(l[0], l[1]);
				}
			}
			//self.addResult("？", "0");
		}
	}

	xmlhttp.setRequestHeader("Content-Type",
		"application/x-www-form-urlencoded; charset=UTF-8");
	xmlhttp.send("s="+r);
}

function createButton(label, c) {
	var b = document.createElement("input");
	b.className = "hwrj-button";
	b.value = label;
	b.type = "button";
	b.style = "background-color:#ffc0cb;color:#000000;"
	//b.style = "background-color:"+c;
	//b.background-color = c;
	return b;
}

function sendFeedback(m, c) {
	xmlhttp.open("POST", "hwr.jsp", true);
	r = this.makeMessage(c, khj, k);
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			gowait();
		}
	}
	xmlhttp.setRequestHeader("Content-Type",
		"application/x-www-form-urlencoded; charset=UTF-8");
	xmlhttp.send(m+"="+r);
}

function makeMessage(c, khj, k) {
	var r = c;
	r += khj + k + "\n:" + sequence.length + "\n";
	for(var i = 0; i < sequence.length; ++i) {
		r += sequence[i].length;
		//r += (" (" + sequence[i][0].x + " " + sequence[i][0].y);
		r += (" (" + Math.round(sequence[i][0].x) + " " + Math.round(sequence[i][0].y));
		for(var j = 1; j < sequence[i].length; ++j) {
			//r += (" (" + (sequence[i][j].x-sequence[i][j-1].x) + " " + (sequence[i][j].y-sequence[i][j-1].y) );
			r += (" (" + Math.round(sequence[i][j].x-sequence[i][j-1].x) + " " + Math.round(sequence[i][j].y-sequence[i][j-1].y) );
		}
		r += "\n";
	}
	return r;
}

function showResult() {
	resultArea.style.display = "block";
	resultArea.innerHTML = "";
	resultNum = 0;
}

function addResult(c, p) {
	var div = document.createElement("div");
	var txt = document.createTextNode(c);
	var span = document.createElement("span");
	span.className = "hwrj-kanji";
	span.appendChild(txt);

	var txt2 = document.createTextNode(p);
	var span2 = document.createElement("span");
	span2.className = "hwrj-mark";
	span2.appendChild(txt2);

	div.appendChild(span);
	div.appendChild(span2);

	var idx = resultNum;
	div.onmouseover = function(event) {
		highlight(idx);
	}
	div.onclick = function(event) {
		sendFeedback('k', c);
		textInput.value += c;
		clear();
	}
	resultNum++;
	resultArea.appendChild(div);
}

function highlight(idx) {
	var divs = resultArea.getElementsByTagName('div');
	for(i = 0; i < divs.length; i++) {
		if(i == idx) {
			divs[i].className = 'hwrj-highlight';
		} else {
			divs[i].className = 'hwrj-normal';
		}
	}
}

function setNextKanji(idx) {
	k = knext;
}

function setValue(bushu) {
	document.getElementById("hwrj-text").value = 
		document.getElementById("hwrj-text").value + bushu + " ";
}

function gonext() {
	unext = 1;
	setNext();
	againStroke();
}

function gowait() {
	if(unext != 0) {
		unext = 0;
		kc = parseInt(knext.charCodeAt(0));
		if(kc >= 0x3040 && kc <= 0x309f) {
			gourl("ihwr.jsp?h="+encodeURI(knext));
		} else if(kc >= 0x30a0 && kc <= 0x30ff) {
			gourl("ihwr.jsp?j="+encodeURI(knext));
		} else {
			gourl("ihwr.jsp?k="+encodeURI(knext));
		}
	}
}

function gourl(url) {
	window.location=url;
	return false;
}

//-->
