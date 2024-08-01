
let dropArea = document.getElementById('dropArea');
let fileNameArea = document.getElementById('fileName');
let img = document.getElementById('img');

//限制图片格式为png
const isPng = (file) => {
    return file.type === 'image/png';
}

//处理图片 转为base64
const handleImg = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {     
        img.src = e.target.result;
    }
}

//点击上传事件
dropArea.addEventListener('click', function (e) {
    let input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.addEventListener('change', function (e) {
        let file = e.target.files[0];
        if(!isPng(file)){
            alert('只能传入png');
            return
        }
        fileNameArea.innerText = file.name;
        handleImg(file)
    });
})

//拖拽上传
dropArea.addEventListener('dragover', function (e) {
    e.preventDefault()
 })
 
dropArea.addEventListener('drop', function (e) {
   e.preventDefault()
    let file = e.dataTransfer.files[0]
    if(!isPng(file)){
        alert('只能传入png');
        return
    }
    fileNameArea.innerText = file.name;
    handleImg(file)
})
