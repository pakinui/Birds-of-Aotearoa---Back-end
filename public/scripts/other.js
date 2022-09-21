async function submitNewBird() {

    const p = document.querySelector('#pName');
    console.log(p.value);
    const e = document.querySelector('#eName');
    
    const birdData = {
        '_id': null,
        'primary_name': p,
        'english_name': e
    }

    const response = await fetch('.birds/create', {
        method: 'POST',
        body: JSON.stringify(birdData),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    console.log(await response.text());
}

function createHandler(event){
    event.preventDdefault();
    submitNewBird();
}
const createButton = document.querySelector('#createButton');
console.log('added click listener1');
if(createButton != null) {
    console.log('added click listener');
    createButton.addEventListener('click', clickHandler);
}

