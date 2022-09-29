

const fileImage = document.getElementById('uploaded_preview');
console.log("fileimg file");
console.log(`preview img: ${fileImage.src}`);


const fileButton = document.getElementById('fileButton');
console.log(`file selected: ${fileButton.name}`);


fileButton.addEventListener("click", fileListener);

function fileListener() {
    //console.log('click');
}

const input = document.querySelector("input[type=file]");
//console.log(input);

function onChange(path) {
    //console.log('changed');

    const fileImg = fileImage
    const fromPath = `~/public/images/${fileButton.files[0].name}`;
    console.log(`path: ${path.value}`);
    filePath = fileButton.files[0].name;
    // fileButton.files[0].mv(fromPath, function (err) {
    //     if (err) {
    //         console.log('file error');
    //         return res.status(500).send(err);
    //     } else {
    //         console.log('file uploaded');
    //     }
    // });

    console.log(`-- ${fileButton.value}`);
    const p = `${fileButton.files[0].name}`;
    console.log(p);
    console.log(fileButton.src)
    fileImg.setAttribute('src', p);
}

/**
 * Function to change the preview image of 
 * the birdcard while in the edit and create 
 * bird area
 * 
 * 
 * 
 */