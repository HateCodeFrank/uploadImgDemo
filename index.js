let dropArea = document.getElementById("dropArea");
let fileNameArea = document.getElementById("fileName");
let img = document.getElementById("img");
let reader;
//限制图片格式为png
const isPng = (file) => {
  return file.type === "image/png";
};

const loadHandler = (e) => {
  img.src = e.target.result;
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
    fileNameArea.innerText = file.name;
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
  fileNameArea.innerText = file.name;
  handleImg(file);
});

//按钮A
let btnA = document.getElementById("btnA");
btnA.addEventListener("click", function () {
  //先删掉之前的child
  document
    .querySelector("#result")
    .removeChild(document.querySelector("#result").firstChild);
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  let imgData = ctx.getImageData(0, 0, img.width, img.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    let grey =
      (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
    imgData.data[i] = grey;
    imgData.data[i + 1] = grey;
    imgData.data[i + 2] = grey;
  }
  ctx.putImageData(imgData, 0, 0);
  console.log(imgData);
  document.querySelector("#result").appendChild(canvas);
});

//按钮B
let btnB = document.getElementById("btnB");
btnB.addEventListener("click", function () {
  //下载canvas
  let canvas = document.querySelector("canvas");
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
  let canvas = document.querySelector("canvas");
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
  let canvas = document.querySelector("canvas");
  let imgBase64 = canvas.toDataURL();
  let pixelArr = []; //存放像素的数组

  //将base64转为像素
  for (let i = 0; i < imgBase64.length; i++) {
    pixelArr.push(imgBase64[i].charCodeAt());
  }
 
  
  //循环pixelArr，每隔四个推入255的alpha值
  let result = [];
  for (let i = 0; i < pixelArr.length; i += 3) {
    const chunk = pixelArr.slice(i, i + 3);
    chunk.push(255);
    if (chunk.length < 4) {
      while (chunk.length < 4) {
        chunk.push(255);
      }
    }
    result.push(chunk);
  }
  result = result.flat();
  let newCanvas = document.createElement("canvas");
  newCanvas.width = img.width;
  newCanvas.height = img.height;
  let newCtx = newCanvas.getContext("2d");
  let newImgData = newCtx.createImageData(img.width, img.height);
  console.log(typeof newImgData.data);
  newImgData.data.set(result);
  newCtx.putImageData(newImgData, 0, 0);
  console.log(newImgData);
  document.querySelector("#result").appendChild(newCanvas);
});
