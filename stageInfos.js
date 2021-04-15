

var stageInfos = (function(){
	
	function shuffle(a) { var j, x, i; for (i = a.length; i; i -= 1) { j = Math.floor(Math.random() * i); x = a[i - 1]; a[i - 1] = a[j]; a[j] = x; } }	
	
	// let stageInfo = {
	// 	"stageTitle":"테스트 스테이지"
	// 	,"stageDesc":"스테이지 설명부분"
	// 	,"limitTime":10
	// 	,"clearTime":-1
	// 	,"urlImgL":"img/Sketch15314354_L.png"
	// 	,"urlImgR":"img/Sketch15314354_R.png"
	// 	//,"urlImgL":"img/Sketch5025325.png"
	// 	//,"urlImgR":"img/Sketch164161530.png"
	
	// 	//,"urlImgL":"img/star_02.png"
	// 	//,"urlImgR":"img/star_03.png"
	// 	//,"urlImgR":"img/88.png"
	// 	,"solutions":[/*
	// 		{"id":"pos2","title":"코가 달라!","poss":[{"type":"circle","x":552,"y":761,"r":50}]}
	// 		,{"id":"pos3","title":"언어가 달라!","poss":[{"type":"circle","x":932,"y":836,"r":100}]}
	// 		,{"id":"pos4","title":"색이 달라!","poss":[{"type":"circle","x":92,"y":1117,"r":50}]}
	// 		*/
	// 	]
	// }
	
	// let stageInfo2 = {
	// 	"stageTitle":"테스트 스테이지2"
	// 	,"stageDesc":"스테이지 설명부분2"
	// 	,"limitTime":50
	// 	,"clearTime":-1
	// 	,"urlImgL":"img/star_02.png"
	// 	,"urlImgR":"img/star_03.png"
	
	// 	,"solutions":[/*
	// 		{"id":"pos2","title":"코가 달라!","poss":[{"type":"circle","x":552,"y":761,"r":50}]}
	// 		,{"id":"pos3","title":"언어가 달라!","poss":[{"type":"circle","x":932,"y":836,"r":100}]}
	// 		,{"id":"pos4","title":"색이 달라!","poss":[{"type":"circle","x":92,"y":1117,"r":50}]}
	// 		*/
	// 	]
	// }
	
	let stageInfos = [];
	// stageInfos.push(stageInfo);
	// stageInfos.push(stageInfo2);
	
	let imgss = []
	
	imgss.push(['img/excel_01.png',
		'img/excel_02.png',
		'img/excel_03.png']);
		
	imgss.push(['img/Sketch15314354_L.png',
		'img/Sketch15314354_R.png'])
		
	imgss.push(['img/star_01.png',
		'img/star_02.png',
		'img/star_03.png',
		'img/star_04.png']);
	imgss.push(['img/excel2-01.png',
		'img/excel2-02.png',
		'img/excel2-03.png']);

	let imgs = null;
	shuffle(imgss);
	let limit = 2;
	for(var i=0,m=imgss.length;i<m;i++){
		if(limit--<=0){break;}
		
		imgs = imgss[i];
		shuffle(imgs);
		stageInfos.push({
			"stageTitle":"테스트 스테이지 "+(i+1)
			,"stageDesc":"스테이지 설명부분 "+(i+1)
			,"limitTime":120
			,"clearTime":-1
			,"urlImgL":imgs[0]
			,"urlImgR":imgs[1]
			
			,"solutions":[] //자동 생성됨
		})
	}
	
	return stageInfos;
})()

