const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var DB = firebase.database();
var getDrawing = DB.ref('game');

var mousePressed = false;
var lastX, lastY;
var ctx;
var uniqid = Date.now();
var ignoreItems = true;

getDrawing.on('value', (snapshot) => {
  if (!ignoreItems) {
    if (uniqid !== snapshot.val().uid) {
      ctx.strokeStyle = snapshot.val().color;
      ctx.lineWidth = snapshot.val().width; 
      lastX = snapshot.val().lastX;
      lastY = snapshot.val().lastY;
      Draw(snapshot.val().x, snapshot.val().y)   
    } 
  }
});

getDrawing.on('value', () => {
  ignoreItems = false;
})

function InitThis() {
  ctx = document.getElementById('myCanvas').getContext("2d");

  $('#myCanvas').mousedown(function (e) {
    mousePressed = true;
    lastX = e.pageX - $(this).offset().left; 
    lastY = e.pageY - $(this).offset().top;
  });

  $('#myCanvas').mousemove(function (e) {
    if (mousePressed) {    
      const color = $('#selColor').val();
      const widthSize = $('#selWidth').val();   
      ctx.strokeStyle = color;
      ctx.lineWidth = widthSize;  
      Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);    

      DB.ref().update({
        game: {
          color: color,
          width: widthSize,
          x: e.pageX - $(this).offset().left,
          y: e.pageY - $(this).offset().top,
          lastX: lastX,
          lastY: lastY,
          uid: uniqid
        }
      });

      lastX = e.pageX - $(this).offset().left; 
      lastY = e.pageY - $(this).offset().top;
    }
  });

  $('#myCanvas').mouseup(() => {
    mousePressed = false;
  });

  $('#myCanvas').mouseleave(() => {
    mousePressed = false;
  });
}

function Draw(x, y) {
  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.stroke();
}
	
function clearArea() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
