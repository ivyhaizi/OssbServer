//main
var xmlhttp;
var resultTextArea;
var errorArea;
var deletetextButton;

//hand writing
var xsize = 425;
var ysize = 194;
var mouse_down = false;
var draw_canvas = false;
var pos_x = -1;
var pos_y = -1;
var sta_t = 0;
var IsWriting = false;
var sequence;
var stroke_num = 0;
var point_num = 0;
var offsetLeft;
var offsetTop;
var colortbl=['#000000','#ffffff','#ff0000','#ffa500','#ff00ff','#B22222'];

var canvas;
var ctx;

var hwImeArea;
var selectArea;
var selectAreaArray = [];
var selectAreaArrayInitValue = ["，","。","？","！","：","「","」","；"];
var resultNum = 0;

var enterButton;
var languageBar;
var clearButton;
var closeButton;
var gripButton;
var penButton;

//speech
var speechStatus = "off";
var authorizationToken;
var SpeechSDK;
var recognizer;
var authorizationEndpoint = "/speech/gettoken";
var speechButton;

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
	return document.getElementsByClassName("ita-hwt-canvas");
}

window.onload = function() {
	onloadf();
}

function onloadf() {
	debugger
	//main
	resultTextArea = document.getElementsByClassName("ita-hwt-result-textarea")[0];
	errorArea = document.getElementsByClassName("ita-hwt-ime-control-msg")[0];
	deletetextButton =  document.getElementsByClassName("ita-hwt-deletetext")[0];
    deletetextButton.addEventListener("touchstart", deletetextButtonTouchStart, false);
    deletetextButton.addEventListener("mousedown", deletetextButtonTouchStart, false);

	errorArea.innerHTML = "";
	resultTextArea.value = "";

	//hand write
    setTimeout("scrollTo(0,1)", 138);
	canvas = getCanvas()[0];
	ctx = canvas.getContext('2d'); 

	canvas.addEventListener("touchstart", touchStart, false);
	canvas.addEventListener("touchmove", touchMove, false);
	canvas.addEventListener("touchend", touchEnd, false);
	canvas.addEventListener("mouseclick", touchStart, false);
	canvas.addEventListener("mousedblclick", touchStart, false);
	canvas.addEventListener("mousedown", touchStart, false);
	canvas.addEventListener("mousemove", touchMove, false);
    canvas.addEventListener("mouseup", touchEnd, false);
    

    hwImeArea = document.getElementsByClassName("ita-hwt-ime")[0];

    selectArea = document.getElementsByClassName("ita-hwt-candidates")[0];
    selectAreaArray = document.getElementsByClassName("ita-hwt-candidate");

    cancelButton = document.getElementsByClassName("ita-hwt-backspace")[0];
    cancelButton.addEventListener("touchstart", cancelButtonTouchStart, false);
    cancelButton.addEventListener("mousedown", cancelButtonTouchStart, false);

    languageBar = document.getElementsByClassName("ita-hwt-space")[0];

    enterButton = document.getElementsByClassName("ita-hwt-jfk-action")[0];
    enterButton.addEventListener("touchstart", enterButtonTouchStart, false);
    enterButton.addEventListener("mousedown", enterButtonTouchStart, false);

    closeButton = document.getElementsByClassName("ita-hwt-close")[0];
    closeButton.addEventListener("touchstart", closeButtonTouchStart, false);
    closeButton.addEventListener("mousedown", closeButtonTouchStart, false);

    gripButton = document.getElementsByClassName("ita-hwt-grip")[0];
    gripButton.addEventListener("touchstart", gripButtonTouchStart, false);
    gripButton.addEventListener("mousedown", gripButtonTouchStart, false);

    penButton = document.getElementsByClassName("ita-hwt-pen")[0];
    penButton.addEventListener("touchstart", penButtonTouchStart, false);
    penButton.addEventListener("mousedown", penButtonTouchStart, false);


    var iLoop = 0;
    selectAreaArrayInitValue.forEach(function(item){
        if(selectAreaArray[iLoop]){
            selectAreaArray[iLoop].addEventListener("touchstart", selectButtonTouchStart, false);
            selectAreaArray[iLoop].addEventListener("mousedown", selectButtonTouchStart, false);
        }
        iLoop++;
    });

	offsetLeft = 0;
	offsetLeft = canvas.offsetLeft;
	offsetTop = canvas.offsetTop;
	if(offsetTop == 0)
		offsetTop = window.pageYOffset;
	clear();

	//speech
    speechButton = document.getElementsByClassName("ita-hwt-speech")[0];
    speechButton.addEventListener("touchstart", speechButtonTouchStart, false);
	speechButton.addEventListener("mousedown", speechButtonTouchStart, false);
	
	if (!!window.SpeechSDK) {
        SpeechSDK = window.SpeechSDK;
	}	  
}


function clear() {
	sequence = [];
	point_num = 0;
	stroke_num = 0;
	pos_x = -1;
	pos_y = -1;
	pos_t = 0;
	sta_t = 0;
	IsWriting = false;
    clearImage();
    clearResult();
}
function clearResult(){
    var iLoop = 0;
    selectAreaArrayInitValue.forEach(function(item){
        if(selectAreaArray[iLoop]){
            selectAreaArray[iLoop].innerText = item;
        }
        iLoop++;
    });
}

function clearImage() {
	ctx.clearRect(0,0, xsize,ysize);
}

function deletetextButtonTouchStart(event) {
	event.preventDefault();
	var len = resultTextArea.value.length;
	if(len > 0){
		resultTextArea.value = resultTextArea.value.substring(0,len-1)
	}
}

function cancelButtonTouchStart(event) {
	event.preventDefault();
	if(sequence && sequence.length > 0){
		clear();
	}else{
		var len = resultTextArea.value.length;
		if(len > 0){
			resultTextArea.value = resultTextArea.value.substring(0,len-1)
		}
	}
}
function enterButtonTouchStart(event) {
	event.preventDefault();
	if(sequence && sequence.length > 0){
		resultTextArea.value += selectAreaArray[0].innerHTML;
		clear();
	}else{
	}
}

function selectButtonTouchStart(event) {
	event.preventDefault();
	resultTextArea.value += event.currentTarget.innerHTML;
    clear();
}

function closeButtonTouchStart(event) {
    event.preventDefault();
    hwImeArea.style["display"]="none";
    penButton.style["display"]="block";
}

function penButtonTouchStart(event) {
    event.preventDefault();
    hwImeArea.style["display"]="block";
    penButton.style["display"]="none";
}

function speechButtonTouchStart(event) {

	event.preventDefault();

    if(speechStatus === "off"){
		errorArea.innerHTML = "";
        speechButton.style["background-color"]="red";
        resultTextArea.setAttribute("placeholder","speech now!");
        speechStatus = "on";

		var speechConfig;
		var a = new XMLHttpRequest();
		a.open("GET", authorizationEndpoint);
		a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		a.send("");
		a.onload = function() {
			authorizationToken = this.responseText;

			speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, "eastasia");

			speechConfig.speechRecognitionLanguage = "ja-JP";
			var audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
			recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
	
			recognizer.recognizeOnceAsync(
				function (result) {
				  resultTextArea.value += result.text;
				  console.log(result);
				  speechButton.style["background-color"]="";
				  speechStatus = "off";

				},
				function (err) {
				  speechButton.style["background-color"]="";
				  speechStatus = "off";
				  errorArea.innerHTML = "error in speech to text!!!";
				  console.log(err);
	
				  recognizer.close();
				  recognizer = undefined;
				}
			  );
		}
	}else{
		speechButton.style["background-color"]="";
		speechStatus = "off";

	}

}


function gripButtonTouchStart(event) {
    event.preventDefault();
    var hwmode = gripButton.getAttribute("hwmode");
    if(hwmode === "small"){
        gripButton.setAttribute("hwmode","large");
        xsize = window.innerWidth-10;
        canvas.style["width"]=xsize + "px";
        canvas.setAttribute("width",xsize);
        languageBar.style["width"]=(xsize -145 )+ "px";

        var attrVal = hwImeArea.getAttribute("class");
        hwImeArea.setAttribute("class",attrVal + " ita-hwt-ime-full");
        
    }else{
        gripButton.setAttribute("hwmode","small");
        canvas.style["width"]="425px";
        canvas.setAttribute("width",425);
        languageBar.style["width"]="280px";
    
        var attrVal = hwImeArea.getAttribute("class");
        var newattrVal = attrVal.replace(" ita-hwt-ime-full", "");
        hwImeArea.setAttribute("class",newattrVal);

    }
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
	if(IsWriting === false){
		sta_t = new Date().getTime();
		IsWriting = true;
	}
	pos_t = getNowT();
	console.log("pos_x:"+pos_x+",pos_y:"+pos_y+", pos_t:"+pos_t);
	
}

function getNowT(){
	var nt =new Date().getTime();
	return (nt - sta_t);
}

function touchMove(event) {
	event.preventDefault();

	var x;
	var y;
	var t;

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

	if(pos_x != -1) {
		drawLine(pos_x, pos_y, x, y);
		draw_canvas = true;
	} else {
		drawLine(pos_x, pos_y, pos_x+1, pos_y+1);
	}


    var x2 = x;
	var y2 = y;

	if(point_num == 0) {
		sequence[stroke_num] = new Array();
	}

	t = getNowT();
	sequence[stroke_num][point_num] = { x:x2, y:y2, t:t };
	console.log("x:"+x+",y:"+y+",t:"+t);
	point_num++;
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


function drawLine(x1, y1, x2, y2) {
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.closePath();
    ctx.strokeStyle = '#000fff';    
	ctx.stroke();
}

function sendStroke(){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'https://inputtools.google.com/request?itc=ja-t-i0-handwrit&app=translate', true);
	
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	xhr.onreadystatechange = function() {//Call a function when the state changes.
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			var rsp=JSON.parse(xhr.responseText);
			var hashkey = rsp[1][0];
			var rst = rsp[1][0][1];
			console.log(rsp[1]);

			selectAreaArray[0].innerHTML = rst[0];
			selectAreaArray[1].innerHTML = rst[1];
			selectAreaArray[2].innerHTML = rst[2];
			selectAreaArray[3].innerHTML = rst[3];
			selectAreaArray[4].innerHTML = rst[4];
			selectAreaArray[5].innerHTML = rst[5];
			selectAreaArray[6].innerHTML = rst[6];
			selectAreaArray[7].innerHTML = rst[7];

		}
	}
	var ink2dArray=[];
	var iLoop = 0;
	sequence.forEach(function(item1){
		ink2dArray[iLoop] = [];
		var xList = [];
		var yList = [];
		var tList = [];
		item1.forEach(function(item2){
			xList.push(item2.x);
			yList.push(item2.y);
			tList.push(item2.t);			
		});
		ink2dArray[iLoop].push(xList);
		ink2dArray[iLoop].push(yList);
		ink2dArray[iLoop].push(tList);
		iLoop++;
	});
	var preText = selectAreaArray[0].innerHTML;
	if (preText === selectAreaArrayInitValue[0]){
		preText = "";
	}

	var entity ={
		api_level: "537.36",
		app_version: 0.4,
		input_type: "0",
		itc: "ja-t-i0-handwrit",
		options: "enable_pre_space",
		requests:[
			{
				language: "ja",
				max_completions: 0,
				max_num_results: 10,
				pre_context: ""	,
				writing_guide:{
					writing_area_height: 194,
					writing_area_width: xsize,
				},
				ink:ink2dArray		
			}
		]
	};

	xhr.send(JSON.stringify(entity)); 
	// xhr.send('string'); 
	// xhr.send(new Blob()); 
	// xhr.send(new Int8Array()); 
	// xhr.send({ form: 'data' }); 
	// xhr.send(document);
}