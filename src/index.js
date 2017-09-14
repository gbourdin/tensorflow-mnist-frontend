import './style.css';
import print from './print.js';

function component() {
  var element = document.createElement('div');
  var btn = document.createElement('button');
  
  element.innerHTML = 'Test';
  element.classList.add('hello');
  
  btn.innerHTML = 'Click me and check the console';
  btn.onclick = print;

  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());