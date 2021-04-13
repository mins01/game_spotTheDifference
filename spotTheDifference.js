/**
* spotTheDifference.js
*/

var spotTheDifference = {
	 "imgL":null
	,"imgR":null
	,"canvasL":null
	,"canvasR":null
	,"divClickL":null
	,"divClickR":null
	,"stageTitle":null
	,"gameTimer":null
	,"timer":null
	,"stageInfo":null
	,"stageInfos":[]
	,"stageInfosIdx":-1
	,"contnets":null
	,"stat":0 //0:게임전(게임오버), 1:로딩,2:게임중
	,"isDebug":false
	,"preloadImgsCallback":null
	,"init":function(){
		this.initIds();
		this.setEventImgLR();
	}
	,"initIds":function(){

		this.stageTitle = $("#stageTitle").get(0);
		this.gameTimer = $("#gameTimer").get(0);
		
		this.imgL = $("#imgL").get(0);
		this.imgR = $("#imgR").get(0);
		this.canvasL = $("#canvasL").get(0);
		this.canvasR = $("#canvasR").get(0);

		this.divClickL = $("#divClickL").get(0);
		this.divClickR = $("#divClickR").get(0);

		

		this.searchCnt = $("#searchCnt").get(0);
		this.goalCnt = $("#goalCnt").get(0);
		this.contnets = $("#contnets").get(0);
		
		
		
		this.setStat(0);
		$(this.imgL).bind("load",{"std":this},function(evt){
			evt.data.std.onloadImgLR(this);
		})
		$(this.imgR).bind("load",{"std":this},function(evt){
			evt.data.std.onloadImgLR(this);
		})
	}
	,"setStat":function(stat){
		this.stat = stat;
		setTimeout(
			function(thisC){
				return function(){
					console.log("stat:"+thisC.stat);
					thisC.contnets.className = "stat-"+thisC.stat
				}
			}(this)
			,0);
	}
	/**
	* 초기이미지로 돌린다.(게임 끝났을 때 동작)
	*/
	,"intImgs":function(){
		var fn = function(thisC){
			return function(){
				thisC.imgL.stat = "";
				thisC.imgR.stat = "";
				thisC.imgL.src = "./img/gate_L.png";
				thisC.imgR.src = "./img/gate_R.png";
				thisC.resetCanvas();
				$(thisC.searchCnt).text("0");
				$(thisC.goalCnt).text("0");
			}
		}(this);
		setTimeout(fn,0);
	}
	,"preloadImgs":function(callback){
		this.setStat(1);
		this.imgL.stat = "init0";
		this.imgR.stat = "init0";
		this.imgL.src = "./img/loading_L.gif";
		this.imgR.src = "./img/loading_R.gif";
		if(callback){ this.preloadImgsCallback = callback;}
	}
	,"loadImgs":function(){
		this.imgL.stat = "load0";
		this.imgR.stat = "load0";
		this.imgL.src = this.stageInfo.urlImgL;
		this.imgR.src = this.stageInfo.urlImgR;
	}
	,"getImgScale":function(){
		var scale = this.imgL.naturalWidth/this.imgL.width;
		return scale;
	}
	,"setStageInfos":function(stageInfos){
		this.stageInfos = stageInfos;
		this.stageInfosIdx = 0;
		
	}
	,"setStageInfo":function(stageInfo){ //단일 동작, 옛날버전 호환용
		this.setStageInfos([stageInfo])	
	}
	,"loadStageInfo":function(stageInfo){
		this.resetCanvas();
		this.stageInfo = stageInfo;
		//this.imgL.src = this.stageInfo.urlImgL;
		//this.imgR.src = this.stageInfo.urlImgR;
		//this.loadImgs();
		$(this.stageTitle).text(stageInfo.stageTitle);
		this.reset();
	}
	,"onloadImgLR":function(img){
		//console.log(img.id+":"+img.stat);
		//alert(img.id+":"+img.stat);
		//alert('onloadImgLR');
		if(img.stat=='load0'){
			img.stat='load1';
		}else if(img.stat=='init0'){
			img.stat='init1';
		}

		if(this.imgL.stat=='load1' && this.imgR.stat=='load1'
		&& this.imgL.complete && this.imgR.complete){
			this.canvasL.width = this.canvasR.width = this.imgL.naturalWidth;
			this.canvasL.height = this.canvasR.height = this.imgL.naturalHeight;
			this.divClickL.style.width = this.divClickR.style.width = this.canvasL.width+'px';
			//this.divClickL.style.height = this.divClickR.style.height = this.canvasL.height+'px';

			this.diffImgs()
			this.checkClear();
			//console.log(this.imgL.src+","+this.imgR.src);
			this.imgL.stat = this.imgR.stat = 'load2';
			this.gamestart();
		}else if(this.imgL.stat=='init1' && this.imgR.stat=='init1'
		&& this.imgL.complete && this.imgR.complete){
			if(this.preloadImgsCallback){
				this.preloadImgsCallback();
			}
		}
	}
	,"reset":function(){
		if(!this.stageInfo) return false;//스테이지가 로드된 후에만 동작
		this.resetCanvas();
		this.preloadImgs(function(thisC){return function(){thisC.loadImgs();}}(this));
		
	}
	,"start":function(){
		this.stageInfosIdx = 0;
		this.startGame();
	}
	,"solve":function(){
		if(!this.stageInfo) return false;//스테이지가 로드된 후에만 동작
		for(var i=0,m=this.stageInfo.solutions.length;i<m;i++){
			this.stageInfo.solutions[i].checked=true;
		}
		this.drawCanvasCheckedPos();
		this.checkClear();
	}
	,"startGame":function(){
		if(this.stageInfos.length > this.stageInfosIdx){
			this.loadStageInfo(this.stageInfos[this.stageInfosIdx])
		}else{
			this.gameclear(); //게임 클리어
		}
	}
	//게임을 성공적으로 완료
	,"gameclear":function(){
		var ts = [];
		var sumT = 0;
		for(var i=0,m=this.stageInfos.length;i<m;i++){
		var si = this.stageInfos[i];
			ts.push("Stage "+(i+1)+" : "+si.stageTitle+" : "+si.clearTime+" sec");
			if(si.clearTime>0){
				sumT+=si.clearTime;
			}
		}
		ts.push("Total : "+sumT+" sec");
		
		this.gameover("축하합니다. 모든 스테이지를 클리어 하였습니다,\n"+ts.join("\n"))
		$(this.stageTitle).text("## CLEAR ##");
	}
	,"gamestart":function(){
		this.stopTimer();
		// alert("## GAME START ##\n stage "+(this.stageInfosIdx+1)+" : "+this.stageInfo.stageTitle);
		// this.setStat(2);
		// this.startTimer();
		setTimeout(function(){
			alert("## GAME START ##\n stage "+(this.stageInfosIdx+1)+" : "+this.stageInfo.stageTitle);
			spotTheDifference.setStat(2);
			spotTheDifference.startTimer();
		},100)
	}
	,"ongameover":function(){
	}
	,"gameover":function(msg){
		this.setStat(0);
		this.stopTimer();
		this.intImgs();
		// alert("## GAME OVER ##\n"+msg);
		// this.ongameover();
		setTimeout(function(){
			alert("## GAME OVER ##\n"+msg);
			spotTheDifference.ongameover();
		},100)
	}
	,"stageclear":function(msg){
		this.stageInfo.clearTime = this.gameTimer.max-this.gameTimer.value;
		this.stageInfosIdx++;
		setTimeout(function(){
			alert("## STAGE CLEAR ##\n"+msg);
			spotTheDifference.startGame();
		},100)
		
	}
	,"startTimer":function(){
		var limitTime = Math.min(Math.max(this.stageInfo.solutions.length*5,10),120);
		this.gameTimer.max = limitTime;
		this.gameTimer.value = this.gameTimer.max;
		this.stageInfo.startTime = (new Date).getTime();
		this.timer = setInterval(
			function(thisC){
				return function(){
					thisC.inertvalTimer();
				}
			}(this)
			,500);
	}
	,"stopTimer":function(){
		if(this.timer){
			clearInterval(this.timer);
		}
		this.timer = null;
	}
	,"inertvalTimer":function(){
		if(this.stageInfo.startTime){
			var t = Math.floor(((new Date).getTime()-this.stageInfo.startTime)/1000);
			var sec = this.gameTimer.max-t
			if(sec<=0){
				this.drawTimer(0)
				this.gameover("TIME OUT!");
			}else{
				//this.gameTimer.value = sec;
				this.drawTimer(sec);
			}
		}
	}
	,"drawTimer":function(p){
		this.gameTimer.value = p;
	}
	,"setEventImgLR":function(){
		$(this.divClickL).bind("mousedown",{"std":this},function(evt){
			evt.data.std.onclickImgLR(evt);
			evt.stopPropagation();
			});
		$(this.divClickR).bind("mousedown",{"std":this},function(evt){
			evt.data.std.onclickImgLR(evt);
			evt.stopPropagation();
			});
		$(this.divClickL).bind("touchstart",{"std":this},function(evt){
			evt.data.std.onclickImgLR(evt);
			evt.stopPropagation();
			});
		$(this.divClickR).bind("touchstart",{"std":this},function(evt){
			evt.data.std.onclickImgLR(evt);
			evt.stopPropagation();
			});
		$(document).bind("touchmove",function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			evt.cancelBubble = true;
			return false;
			});
		$(document).bind("mousedown",function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			evt.cancelBubble = true;
			return false;
			});
	}
	,"onclickImgLR":function(evt){
		if(!this.stageInfo) return false;//스테이지가 로드된 후에만 동작
		var target = evt.target;
		var x = evt.offsetX!=undefined?evt.offsetX:evt.pageX-$(evt.target).offset().left; //FF에서는 offsetX,Y가 없다.
		var y = evt.offsetY!=undefined?evt.offsetY:evt.pageY-$(evt.target).offset().top;

		this.checkAnswer(x,y);
	}
	/**
	* return : 0:못찾음, 1:찾음, 2:중복찾음
	*/
	,"checkAnswer":function(x,y){
		var getImgScale = this.getImgScale();
		var x1 = Math.round(x*getImgScale);
		var y1 = Math.round(y*getImgScale);
		if(!this.stageInfo && !this.stageInfo.solutions){
			return false;
		}
		var sls = this.stageInfo.solutions;
		var isCheck = 0;
		var info = null
		for(var i=0,m = sls.length;i<m && !isCheck;i++){
			//if(sls[i].checked){continue;}
			var poss = sls[i].poss;

			if(sls[i].checked){
				continue; //이미 체크된건 체크 안함.
			}
			for(var i2=0,m2=poss.length;i2<m2 && !isCheck;i2++){
				var pos = poss[i2];
				if(this.isXyInPos(x1,y1,pos)){
					if(sls[i].checked){
						isCheck = 2;
					}else{
						isCheck = 1;
						sls[i].checked = true;
					}
					info = sls[i];
				}else{
					
				}
			}
		}
		if(isCheck==1){
			this.drawCanvasCheckedPos();
		}
		this.showClickMsg(isCheck,x1,y1,info);
		return isCheck;
	}
	,"showClickMsg":function(isCheck,x,y,info){
		var msg = "";
		switch(isCheck){
			case 1:msg="["+info.title+"]을 찾았어요!";break;
			case 2:msg="이미 찾은 부분이네요.";break;
			case 0:;
			default:msg="여기가 아니에요.";break;
		}
		//alert(msg);
		if(this.checkClear()){
			//alert();
			//this.gameover("축하합니다.\n스테이지 클리어!");
			this.stageclear("축하합니다.\n스테이지 클리어!");
		}
		if(this.isDebug){
			var str = 'click: x='+x+',y='+y;
			console.log(str);
		}
	}
	,"isXyInPos":function(x,y,pos){
		var x2 = pos["x"];
		var y2 = pos["y"];
		if(pos['type']=='circle'){
			var r = Math.sqrt( Math.pow(x2-x,2)+Math.pow(y2-y,2));
			if(r <= pos["r"]){
				return true;
			}

		}else if(pos['type']=='rect'){
			var x3 = x2+pos["w"];
			var y3 = y2+pos["h"];
			if(x2<=x && x<=x3 && y2<=y && y<=y3){
				return true;
			}
		}else{
			alert("ERROR : isXyInPos()");
		}
		return false;
	}
	,"resetCanvas":function(canvas){
		if(canvas){
			canvas.width = canvas.width;
		}else{
			var canvasL = this.canvasL;
			canvasL.width = canvasL.width;
			this.syncCanvas();
		}
	}

	,"syncCanvas":function(){
		var canvasL = this.canvasL;
		var context2dL = canvasL.getContext('2d');
		var canvasR = this.canvasR;
		var context2dR = canvasR.getContext('2d');
		context2dR.putImageData(context2dL.getImageData(0, 0, canvasL.width, canvasL.height), 0, 0);
	}
	,"drawCanvasCheckedPos":function(){
		this.resetCanvas();
		var colorTable = [
			"rgba(255,51,51,1)"
			,"rgba(51,255,51,1)"
			,"rgba(51,51,255,1)"
			,"rgba(255,255,51,1)"
			,"rgba(255,51,255,1)"
			,"rgba(51,255,255,1)"
			]
		var canvasL = this.canvasL;
		var sls = this.stageInfo.solutions;
		for(var i=0,m = sls.length;i<m;i++){
			if(!sls[i].checked){
				continue;
			}
			var pos = sls[i].poss[0]; //첫번째 위치만 표시한다.
			this.drawCanvasPos(canvasL,pos,colorTable[(i%colorTable.length)]);
		}
		this.syncCanvas();
	}
	,"drawCanvasPos":function(canvas,pos,strokeStyle){
		var context2d = canvas.getContext('2d');
		context2d.fillStyle = "rgba(255,255,255,0.5)"; //채우기 색
		if(strokeStyle){
			context2d.strokeStyle = strokeStyle; //선색
		}else{
			context2d.strokeStyle = "rgba(255,51,51,1)"; //선색
		}
		context2d.globalAlpha = 0.6;
		context2d.opacity = 1; //투명도
		//context2d.lineWidth = 10; //
		context2d.lineWidth = Math.max(3,this.imgL.naturalWidth/100);

		if(pos['type']=='circle'){
			context2d.beginPath();
			context2d.arc(pos['x'], pos['y'], pos['r'], 0, Math.PI*2,null);
			context2d.fill();
			context2d.stroke();
			context2d.closePath();
		}else if(pos['type']=='rect'){
			context2d.beginPath();
			context2d.strokeRect(pos['x'], pos['y'],pos['w'], pos['h']);
			context2d.fill();
			context2d.stroke();
			context2d.closePath();
		}
		context2d.globalAlpha = 1;
	}
	,"checkClear":function(){
		if(!this.stageInfo) return false;
		var sls = this.stageInfo.solutions;
		var slCnt = 0;
		for(var i=0,m = sls.length;i<m;i++){
			if(sls[i].checked){
				slCnt++;
			}
		}
		//console.log(slCnt+">="+sls.length)
		$(this.searchCnt).text(slCnt);
		$(this.goalCnt).text(sls.length);

		if(slCnt>=sls.length){
			return true;
		}

		return false;
	}
	,"diffImgs":function(){
		if( this.imgL.naturalWidth !=  this.imgR.naturalWidth ||  this.imgL.naturalHeight != this.imgR.naturalHeight){
			//alert(this.imgR.naturalWidth);
			alert("서로 크기가 다른 이미지입니다.");
			this.stageInfo = false;
			return false;
		}

		//alert("diffImgs0");
		var canvasL = this.canvasL;
		var canvasR = this.canvasR;
		var canvasD = $('#canvasD').get(0);
		var context2dL = canvasL.getContext('2d');
		var context2dR = canvasR.getContext('2d');

		canvasD.width = canvasL.width;
		canvasD.height = canvasL.height;
		var context2dD = canvasD.getContext('2d');
		context2dL.drawImage(this.imgL,0,0);
		context2dR.drawImage(this.imgR,0,0);
		var imgDataL = context2dL.getImageData(0, 0, canvasL.width, canvasL.height);
		var imgDataR = context2dR.getImageData(0, 0, canvasL.width, canvasL.height);
		var imgDataD = context2dD.getImageData(0, 0, canvasL.width, canvasL.height);

		//alert("diffImgs1");


		context2dD.fillStyle = "rgba(100,100,100,1)"; //채우기 색
		context2dD.strokeStyle = "rgba(255,51,51,1)"; //선색
		context2dD.opacity = 1; //투명도
		context2dD.lineWidth = 10;

		var diffCnt = 0;
		var i;
		//context2dD.beginPath();

		for(i=0,m=imgDataL.data.length;i<m;i+=4){
			
			var rL = imgDataL.data[i];
			var gL = imgDataL.data[i+1];
			var bL = imgDataL.data[i+2];
			var aL = imgDataL.data[i+3];
			var rR = imgDataR.data[i];
			var gR = imgDataR.data[i+1];
			var bR = imgDataR.data[i+2];
			var aR = imgDataR.data[i+3];

			var rD = Math.abs(rL-rR);
			var gD = Math.abs(gL-gR);
			var bD = Math.abs(bL-bR);
			var aD = Math.abs(aL-aR);
				
			if(rD > 20 || gD > 20 || bD > 20 || aD > 20){
				imgDataD.data[i] = 0;
				imgDataD.data[i+1] = 0;
				imgDataD.data[i+2] = 0;
				imgDataD.data[i+3] = 90;
				diffCnt++;
				//context2d.fillRect(i/4%canvasL.width,Math.floor(i/4/canvasL.width),1,1);

			}
			//if(i>10000){break;}
			if(i % (4*1000)==0){
				document.title = document.title;
			}
		}
		//alert(i);
		//alert("diffImgs2");
		//return false;
		//alert(diffCnt);
		context2dD.putImageData(imgDataD, 0, 0);
		this.resetCanvas();
		this.parseDiffRange();
	}
	,"parseDiffRange":function(){
		var canvasD = $('#canvasD').get(0);
		var context2dD = canvasD.getContext('2d');
		var imgDataD = context2dD.getImageData(0, 0, canvasL.width, canvasL.height);
		var w = canvasL.width;
		var h = canvasL.height;
		var solutions = [];
		for(var i=0,m=imgDataD.data.length;i<m;i+=4){
			if(imgDataD.data[i] < 1 &&imgDataD.data[i+3]>0 ){
				var rarr = this.searchDiffRange(imgDataD,i)
				if(rarr.length < 20){continue;} //10픽셀 이상 차이가 있어야한다.
				//alert(rarr.length);
				solutions.push(rarr);
			}
		}
		//-- 최대x,y 최소x,y를 구해서 원을 그림
		var sls = []
		this.stageInfo.solutions = [];
		for(var i=0,m=solutions.length;i<m;i++){
			var rarr = solutions[i];
			var x0 = w+1;
			var x1 = -1;
			var y0 = h+1;
			var y1 = -1;
			var x,y,posIdx;
			for(var i2=0,m2=rarr.length;i2<m2;i2++){
				posIdx = rarr[i2];
				x = posIdx/4%w;
				y = Math.floor(posIdx/4/w);
				x0 = Math.min(x0,x);
				x1 = Math.max(x1,x);
				y0 = Math.min(y0,y);
				y1 = Math.max(y1,y);
				imgDataD.data[posIdx] = (i*100)%250; //그룹에 맞춰서 색바꾸기
			}
			//alert(x0+","+x1+","+y0+","+y1)
			
			var r= Math.max(Math.sqrt(Math.pow(x0-x1,2)+Math.pow(y0-y1,2))/2.5,20);
			var sl = {"checked":false,"id":"pos"+(i+1),"title":"틀린부분"+(i+1),"poss":[{"type":"circle","x":(x0+x1)/2,"y":(y0+y1)/2,"r":r}]} 
			sls.push(sl);
		}
		//-- 가까운(겹쳐지는) 부분을 하나로 만듬.
		//alert('시작'+sls.length);
		/*
		for(var i=0;i<sls.length;i++){
			var sl0 = sls[i];
			var pos0 = sl0['poss'][0];
			this.drawCanvasPos(canvasD,pos0);
		}
		*/
		this.resetCanvas(canvasD);
		//alert(sls.length);
		for(var i=0;i<sls.length;i++){
			var sl0 = sls[i];
			var pos0 = sl0['poss'][0];
			var ch = false;

			this.drawCanvasPos(canvasD,pos0,"rgba(255,255,51,0.5)");
			//alert(sls.length);
			for(var i2=sls.length-1;i2>i;i2--){
				var sl2 = sls[i2];
				var pos2 = sl2['poss'][0];
				var r2 = Math.sqrt(Math.pow(pos0['x']-pos2['x'],2)+Math.pow(pos0['y']-pos2['y'],2));
				this.drawCanvasPos(canvasD,pos2);
				if(r2<= pos0['r']+pos2['r']){
					if(r2 <= pos0['r']){ //속에 포함될 때

					}else if(r2 <= pos2['r']){ //속에 포함될 때
						pos0['x'] = pos2['x'];
						pos0['y'] = pos2['y'];
						pos0['r'] = pos2['r'];
					}else{
						pos0['x'] = (pos0['x']+pos2['x'])/2;
						pos0['y'] = (pos0['y']+pos2['y'])/2;
						pos0['r'] = Math.max(pos0['r'],pos2['r'],r2,20);
					}
					sls.splice(i2,1);
					this.drawCanvasPos(canvasD,pos2);
					//alert('x');
					//alert('가까운 부분을 합침'+":"+i+":"+i2+":"+sls.length);
					i = -1; //처음부터 다시
					break;
				}
				
			}
			this.resetCanvas(canvasD);
		}
		//*/
		//--- title들을 재정의
		var minR = this.imgL.naturalWidth/20; //원의 최소 너비
		for(var i=0;i<sls.length;i++){
			var sl  = sls[i];
			sl.id="pos"+(i+1);
			sl.title="틀린부분"+(i+1);
			if(sl.poss[0].r < minR){ 
				sl.poss[0].r = minR;
			}
		}
		this.stageInfo.solutions = sls;
		//alert(solutions.length+"개의 틀린 부분 존재");

		context2dD.putImageData(imgDataD, 0, 0);
		
	}
	,"searchDiffRange":function(imgDataD,posIdx){
		var data = imgDataD.data;
		var w = imgDataD.width;
		var h = imgDataD.height;
		var x = posIdx/4%w;
		var y = Math.floor(posIdx/4/w);
		var rarr =[];
		var shArr = [];
		shArr.push(posIdx);
		var i,i2;
		var stPosIdx = posIdx;
		//console.log(stPosIdx+":시작");
		while(shArr.length>0){
			var posIdx = shArr.shift();
			if(data[posIdx]>0){continue;} //이미 체크한 것이다.
			//console.log(posIdx+":"+data[posIdx+3]+":"+data[posIdx]);
			rarr.push(posIdx);
			data[posIdx]+=100; //체크했다고 표시한다.
			
			x = posIdx/4%w;
			y = Math.floor(posIdx/4/w);
			for(var i3=1,m3=2;i3<m3;i3++){
				if(y-i3>=0){//위
					i = (x+(y-i3)*w)*4;
					if(data[i+3]>0 && data[i]<1 ){ shArr.push(i); 
					//console.log(stPosIdx+":"+posIdx+":"+i+":"+"위"+shArr.length);
					}
				}
				if(y+i3 < h){//아래
					i = (x+(y+i3)*w)*4;
					if(data[i+3]>0 && data[i]<1 ){ shArr.push(i); 
					//console.log(stPosIdx+":"+posIdx+":"+i+":"+"아래"+shArr.length);
					}
				}
				if(x-i3 >= 0){//왼쪽
					i = ((x-i3)+y*w)*4;
					if(data[i+3]>0 && data[i]<1 ){ shArr.push(i); 
					//console.log(stPosIdx+":"+posIdx+":"+i+":"+"왼쪽"+shArr.length);
					}
				}
				if(x+i3 < w){//오른쪽
					i = ((x+i3)+y*w)*4;
					if(data[i+3]>0 && data[i]<1 ){ shArr.push(i); 
					//console.log(stPosIdx+":"+posIdx+":"+i+":"+"오른쪽"+shArr.length);
					}
				}
			}
		}
		//console.log(stPosIdx+":끝");
		//alert(rarr.length);
		return rarr;
	}

}
/*
var stageInfo = {
	 "stageTitle":"테스트 이미지"
	,"stageDesc":"스테이지 설명부분"
	,"w":1080
	,"h":1920
	,"urlImgL":"img/Sketch15314354_L.png"
	,"urlImgR":"img/Sketch15314354_R.png"
	,"solutions":[
		{"id":"pos1","title":"틀린그림1","poss":[{"type":"circle","x":42,"y":510,"r":50}]} 
		,{"id":"pos2","title":"틀린그림2","poss":[{"type":"rect","x":200,"y":100,"w":50,"h":50},{"type":"circle","x":200 ,"y":200,"r":50}]}
		,{"id":"pos3","title":"틀린그림3","poss":[{"type":"circle","x":560,"y":780,"r":100},{"type":"rect","x":100,"y":200,"w":10,"h":10}]}
	 ]
}
*/
var stageInfo = {
	 "stageTitle":"테스트 스테이지"
	,"stageDesc":"스테이지 설명부분"
	,"limitTime":10
	,"clearTime":-1
	,"urlImgL":"img/Sketch15314354_L.png"
	,"urlImgR":"img/Sketch15314354_R.png"
	//,"urlImgL":"img/Sketch5025325.png"
	//,"urlImgR":"img/Sketch164161530.png"

	//,"urlImgL":"img/star_02.png"
	//,"urlImgR":"img/star_03.png"
	//,"urlImgR":"img/88.png"
	,"solutions":[/*
		 {"id":"pos2","title":"코가 달라!","poss":[{"type":"circle","x":552,"y":761,"r":50}]}
		,{"id":"pos3","title":"언어가 달라!","poss":[{"type":"circle","x":932,"y":836,"r":100}]}
		,{"id":"pos4","title":"색이 달라!","poss":[{"type":"circle","x":92,"y":1117,"r":50}]}
		*/
	 ]
}

var stageInfo2 = {
	 "stageTitle":"테스트 스테이지2"
	,"stageDesc":"스테이지 설명부분2"
	,"limitTime":50
	,"clearTime":-1
	,"urlImgL":"img/star_02.png"
	,"urlImgR":"img/star_03.png"

	,"solutions":[/*
		 {"id":"pos2","title":"코가 달라!","poss":[{"type":"circle","x":552,"y":761,"r":50}]}
		,{"id":"pos3","title":"언어가 달라!","poss":[{"type":"circle","x":932,"y":836,"r":100}]}
		,{"id":"pos4","title":"색이 달라!","poss":[{"type":"circle","x":92,"y":1117,"r":50}]}
		*/
	 ]
}

var stageInfos =[];
stageInfos.push(stageInfo);
stageInfos.push(stageInfo2);