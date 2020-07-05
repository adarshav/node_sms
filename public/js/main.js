// New types of naming constant variables
const numberInput = document.getElementById('number'),
      textInput = document.getElementById('msg'),
      button = document.getElementById('button'),
      response = document.querySelector('.response');

button.addEventListener('click', send, false);

const socket = io();
socket.on('smsStatus', (data) => {
    response.innerHTML = '<h5>Text message sent to ' + data.number + '</h5>'
})

// function send
function send() {
    const number = numberInput.value;
    const text = textInput.value;
    console.log('Message sent');
    // console.log(number, text);
    // calling external api
    fetch('/', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body:  JSON.stringify({ number: number, text: text })
    })
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.log(error);
    })
}