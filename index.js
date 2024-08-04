let dropArea = document.getElementById("dropArea");
let fileNameArea = document.getElementById("fileName");
let img = document.getElementById("img");
let reader;
let width
let height
let canvas;
let ctx;
//限制图片格式为png
const isPng = (file) => {
  return file.type === "image/png";
};

const loadHandler = (e) => {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = e.target.result;
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height
    width = image.width
    height = image.height
    console.log(width, height);
    ctx.drawImage(image, 0, 0,);
  }
  reader.removeEventListener("load", loadHandler);
};

//处理图片 转为base64
const handleImg = (file) => {
  reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener("load", loadHandler);
};

//点击上传事件
dropArea.addEventListener("click", function (e) {
  let input = document.createElement("input");
  input.type = "file";
  input.click();
  input.addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (!isPng(file)) {
      alert("只能传入png");
      return;
    }
    handleImg(file);
  });
});

//拖拽上传
dropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
});

dropArea.addEventListener("drop", function (e) {
  e.preventDefault();
  let file = e.dataTransfer.files[0];
  if (!isPng(file)) {
    alert("只能传入png");
    return;
  }
  handleImg(file);
});

//按钮A
let btnA = document.getElementById("btnA");
btnA.addEventListener("click", function () {
  let imgData = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    let grey =
      (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
    imgData.data[i] = grey;
    imgData.data[i + 1] = grey;
    imgData.data[i + 2] = grey;
  }
  ctx.putImageData(imgData, 0, 0);
});

//按钮B
let btnB = document.getElementById("btnB");
btnB.addEventListener("click", function () {
  //下载canvas
  canvas = document.querySelector("#canvas");
  if (canvas) {
    let a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = "grey.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    alert("请先点击按钮A");
  }
});

//按钮C
let btnC = document.getElementById("btnC");
btnC.addEventListener("click", function () {
  canvas = document.querySelector("#canvas");
  let imgBase64 = canvas.toDataURL();
  navigator.clipboard
    .writeText(imgBase64)
    .then((r) => {
      alert("复制成功");
    })
    .catch((e) => {
      alert("复制失败");
    });
});

//按钮D
let btnD = document.getElementById("btnD");
btnD.addEventListener("click", function () {
  //获取灰阶canvas的base64
  let imgBase64 = canvas.toDataURL();
  let pixelArr = []; //存放像素的数组

  //将base64转为像素
  for (let i = 0; i < imgBase64.length; i++) {
    pixelArr.push(imgBase64[i].charCodeAt());
  }
  console.log(pixelArr.length);
  //补齐数组 让它为4的倍数
  const r = imgBase64.length % 4;
  for (let i = 0; i < 4 - r; i++) {
    pixelArr.push(255)
  }
  //计算canvas的面积有多少个像素点
  // let area = canvas.width * canvas.height;
  const l = Math.ceil(Math.sqrt(pixelArr.length / 4));
  //将像素点补全
  for (let i = pixelArr.length / 4; i < l * l; i++) {
    pixelArr.push(255);
    pixelArr.push(255);
    pixelArr.push(255);
    pixelArr.push(255);
  }
  let data = ctx.createImageData(l, l);
  data.data.set(pixelArr)
  console.log(1,canvas.width, canvas.height);
  canvas.width = l;
  canvas.height = l;
  console.log(2,canvas.width, canvas.height);
  // console.log(data);
  ctx.putImageData(data, 0, 0);
});

// 如果canvas元素的CSS尺寸（即在页面上的显示尺寸）和绘图表面尺寸（即canvas.width和canvas.height）不一致，
// 浏览器会自动将绘图表面缩放到CSS尺寸。这可能会导致图像被拉伸或压缩。

// 当你调用ctx.putImageData(data, 0, 0);时，你是在将data的图像数据放到canvas的绘图表面上。
// 由于data的尺寸（l x l）和canvas的绘图表面尺寸一致，所以data的图像数据会填满整个绘图表面。
// 然后，浏览器会将绘图表面缩放到CSS尺寸，所以你看到的图像会填满整个canvas元素，并且可能会被拉伸。
//所以这里实际上渲染的是个正方形，只不过被拉伸了
