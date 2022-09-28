const fileImg = document.getElementById('uploaded_preview');
//console.log("fileimg file");
//console.log(`preview img: ${fileImg.src}`);


const fileButton = document.getElementById('fileButton');
//console.log(`file selected: ${fileButton}`);


fileButton.addEventListener("click", fileListener);

function fileListener(){
    //console.log('click');
}

const input = document.querySelector("input[type=file]");
//console.log(input.value);

function onChange(){
    //console.log('changed');
    //console.log(`-- ${fileButton.files[0].name}`);
    const p = `/images/${fileButton.files[0].name}`;
    //console.log(p);
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