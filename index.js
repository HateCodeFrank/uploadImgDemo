//- 上传图片，并在页面内显示该图片

//- 支持 点击 和 拖拽 两种方式

//- 图片格式限制为 PNG

let dropArea = document.getElementById('drop-area');

//点击上传事件
dropArea.addEventListener('click', function (e) {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png';
    input.click();
    input.addEventListener('change', function (e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            let img = document.getElementById('img');
            img.src = e.target.result;
        }
    });
})
