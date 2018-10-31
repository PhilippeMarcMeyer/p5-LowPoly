

 
var cnv;
var	w = 600;
var	h = 600;
var doodle = null;
var points2D = [];
var definition = 27;
var points = [];
var rotx =0.0001;
var rotxPace;
var maxz = 300;
var minz = -800;
var multiple = 2;
var isRotate= true;
var isTranslate= false;
var translateWay = 1;
var translatePace = 20;
var rotMin;
var rotMax;
var rotWay = 1;
 function setup(){
	cnv = createCanvas(w,h,WEBGL); //WEBGL
	cnv.parent('canvasZone');
	//doodle = createGraphics(w,h);
 makeBoat()
 frameRate(10);
 rotxPace = radians(3);
 rotMin = 0;
 rotMax = HALF_PI-0.2 ;
 //noLoop();
 }
 
 function draw(){	
orbitControl() 
	background(255);
	stroke(0);
	fill(90);
	if(rotWay == 1){
		if( rotx < rotMax & rotx > rotMin){
			rotx+=rotxPace*rotWay;
		}else{
			isRotate = false;
			rotWay=-1;
			rotMin+=HALF_PI-0.2 % TWO_PI;
			rotMax +=HALF_PI-0.2 % TWO_PI;
			isTranslate = true;
		}	
	}else{
		if( rotx > -1.5 & rotx <rotMax){
			rotx+=rotxPace*rotWay;
		}else{
			isRotate = false;
			rotWay=1;
			isTranslate = true;
		}	
	}

	var mode = TRIANGLE_STRIP;
		
		var pointsCopy = points.map(function(arr) {
			return arr.slice();
		});
		if(isRotate){
			for (var i = 0; i < definition; i++) {
				for (var j = 0; j < definition; j++) {
					pointsCopy[i][j] = doRotate(pointsCopy[i][j],rotxPace*rotWay,0,0);
				}
			}
		}
		if(isTranslate){
			for (var i = 0; i < definition; i++) {
				for (var j = 0; j < definition; j++) {
					
					pointsCopy[i][j].z +=translatePace*translateWay;
					if(pointsCopy[i][j].z > maxz || pointsCopy[i][j].z <minz){
						isTranslate = false;
						translateWay*=-1;
						isRotate = true;
						
					}
				}
			}
		}
		//push();
		//rotateY(rot);
		for (var i = 0; i < definition; i++) {
			if(mode!=LINES){
				var hu = map(i, 0, definition, 0, 255*6);
				var colorOffsetValue =(( hu )  % 250);
				var colorOffsetValue2 =(( hu)  % 170);
				var colorOffsetValue3 =(( hu )  % 90);
				fill(colorOffsetValue,colorOffsetValue2,colorOffsetValue3);	
			}
			
			beginShape(mode);//TRIANGLE_STRIP,TRIANGLE_FAN,LINES

			for (var j = 0; j < definition-1; j++) {
			if(i == 0){
					var v1 = pointsCopy[i][0];
					vertex(v1.x,v1.y,v1.z);
					var v2 = pointsCopy[i][definition-2];
					vertex(v2.x,v2.y,v2.z);	
			}	
			if(i == definition-1){
					var v1 = pointsCopy[i][0];
					vertex(v1.x,v1.y,v1.z);
					var v2 = pointsCopy[i][definition-2];
					vertex(v2.x,v2.y,v2.z);	
			}	
			
			if(i>0 ){
				var v1 = pointsCopy[i][j];
				vertex(v1.x,v1.y,v1.z);
				var v2 = pointsCopy[i-1][j];
				vertex(v2.x,v2.y,v2.z);	
			}
			
			if(j>0 && mode==LINES){
				var v1 = pointsCopy[i][j];
				vertex(v1.x,v1.y,v1.z);
				var v3= pointsCopy[i][j-1];
				vertex(v3.x,v3.y,v3.z);	
			}

				

			}
				fill(0);
			endShape();
		}
		//pop();

}
 
 
 
 function makeBoat(){
	 
	 var segmentAngle = PI / definition;
	 noFill();
	 stroke(0);
	 //formula = "bezier("+ptA.x+","+ptA.y+","+CrtlPt1.x+","+CrtlPt1.y+","+CrtlPt2.x+","+CrtlPt2.y+","+ptB.x+","+ptB.y+");"
	 var ptA = createVector(-multiple*100,0);
	 var ptB = createVector(multiple*100,0);
	 var CrtlPt1 = createVector(-multiple*50,multiple*300);
	 var CrtlPt2 = createVector(multiple*100,multiple*200);
	//bezier(ptA.x,ptA.y,CrtlPt1.x,CrtlPt1.y,CrtlPt2.x,CrtlPt2.y,ptB.x,ptB.y);
	fill(255);
	for (var i = 0; i <= definition; i++) {
	  var t = i / definition;
	  var x = bezierPoint(ptA.x, CrtlPt1.x, CrtlPt2.x, ptB.x, t);
	  var y = bezierPoint(ptA.y, CrtlPt1.y, CrtlPt2.y, ptB.x, t);
	   points2D.push(createVector(x,y));
	   //points2D[i].add(-221,-94);//.div(108);
	}

	for (var i = 0; i <= definition; i++) {
		var pt = points2D[i];
		var len = pt.y;
		var angle = -definition/2 *segmentAngle;
		points.push([]);
		for (var j = 0; j <= definition; j++) {
			angle +=segmentAngle;
			var x = pt.x;
			var z = sin(angle)*len/10;
			var y = cos(angle)*len/4;
			points[i].push(doRotate(createVector(x,y,z),0,0,0));
		}
	}
	

 }
 
 
 function scalarProduct(a,b){
	return a.x*b.x+a.y*b.y+a.z*b.z;
}
function doRotate(vect,pitch, roll, yaw) {
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);
    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);
    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);
    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;
    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;
    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;
	var px = vect.x;
	var py = vect.y;
	var pz = vect.z;
	vect.x = Axx*px + Axy*py + Axz*pz;
	vect.y = Ayx*px + Ayy*py + Ayz*pz;
	vect.z = Azx*px + Azy*py + Azz*pz;
		
	return vect;
}
 