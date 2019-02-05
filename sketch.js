let video;
let poseNet;
let noseX=0;
let noseY=0;
let wristX=0;
let wristY=0;
let x= new Array(17);
let y= new Array(17);
let filters = [];
let preset = ["cigar.png", "sunglass.png", "elf-ear-right.png", "elf-ear-left.png"];
//let img;
let buttonX = 670;
let buttonY = 0;
function setup() {
  createCanvas(640, 480);

  for(var i=0;i<preset.length;i++){
    filters.push(new Filter(loadImage(preset[i]), 0, 0));
    addButton(preset[i]);
  }

  filters[0].x  = -120; //cigar
  filters[0].y  = 20;
  filters[0].width = 145;

  filters[1].x  = -50; //sunglass
  filters[1].y  = -40;
  filters[1].width = 175;
  filters[1].height = 100;
  filters[1].kp = 2;

  filters[2].x  = -70; //right ear
  filters[2].y  = -90;
  filters[2].width = 120;
  filters[2].height = 140;
  filters[2].kp = 4;

  filters[3].x  = -50; //left ear
  filters[3].y  = -90;
  filters[3].width = 120;
  filters[3].height = 140;
  filters[3].kp = 3;


  let addFilterBtn = createButton("Add custom filter");
  addFilterBtn.position(0,500);
  addFilterBtn.mousePressed(addFilter);


	video = createCapture(VIDEO);
	video.hide()
  poseNet = ml5.poseNet(video);
  poseNet.on('pose',getPoses);
 
}

function getPoses(poses){
  if(poses.length>0){
    for(var i=0; i<x.length;i++){
      x[i] = poses[0].pose.keypoints[i].position.x;
      y[i] = poses[0].pose.keypoints[i].position.y;
    }
  }
}
  
function draw() {
  image(video, 0, 0);
  for(var i=0;i<filters.length;i++){
    if(filters[i].visible==true){     
      image(filters[i].img, x[filters[i].kp]+filters[i].x, y[filters[i].kp]+filters[i].y , filters[i].width, filters[i].height);
    }
  }
  // fill(255,0,0);
  // for(var i=0; i<x.length;i++){
  //   ellipse(x[i], y[i], 20);
  // }
	// ellipse(wristX, wristY, 50);
	// ellipse(noseX, noseY, 50);
}
function changeFilter(num){
  filters[num].visible = !filters[num].visible;
}
function addFilter(){
  console.log(document.body.clientWidth);
  let filterOpt = createSelect();
  filterOpt.position(120,500);
  filterOpt.option("Mouth");
  filterOpt.option("Left ear");
  filterOpt.option("Right ear");
  filterOpt.option("Left eye");
  filterOpt.option("Right eye");

  let input = document.createElement("INPUT");
  //input.position(240,500);
  
  input.setAttribute("type","file");
  input.style.position = "absolute";
  input.style.left = 240+"px";
  input.style.top = 500+"px";
  document.body.append(input);

  //input = document.getElementsByTagName("input");

  // let inputUrl =createInput("Type link to image");
  // inputUrl.position(240,500);

  let addBtn = createButton("Add")
  addBtn.position(450,500);
  addBtn.mousePressed(function(){
    var url = URL.createObjectURL(input.files[0]);
    filters.push(new Filter(loadImage(url)));
    if(filterOpt.value()=="Mouth"){
      filters[filters.length-1].kp=0;
    }else if(filterOpt.value()=="Left ear"){
      filters[filters.length-1].kp=3;
    }else if(filterOpt.value()=="Right ear"){
      filters[filters.length-1].kp=4;
    }else if(filterOpt.value()=="Left eye"){
      filters[filters.length-1].kp=1;
    }else if(filterOpt.value()=="Right eye"){
      filters[filters.length-1].kp=2;
    }
    addButton(url);
    //console.log(URL.createObjectURL(input.files[0]));
  });
  //let reader = FileReader();
  // addBtn.mousePressed(function(){
  //   try {
  //     let img = loadImage(inputUrl.value());
  //     image(img, 0, 700, 100,100);
  //   } catch (error) {
  //     console.log("Link does not work");
  //   }
    
  // });
}
function addButton(imgUrl){
  let img = createImg(imgUrl);
  img.position(buttonX,buttonY);
  img.size(50,50);
  var num = filters.length-1;
  img.mousePressed(()=>changeFilter(num));
  if(buttonX+50>document.body.clientWidth){
    buttonY+=50;
    buttonX=670;
  }else{
    buttonX+=50;
  }
}
class Filter{
  constructor(img){
    this.img = img;
    this.x = 0;
    this.y = 0;
    this.kp = 0;
    this.width = 175;
    this.height = 100;
    this.visible = false;
  }
}