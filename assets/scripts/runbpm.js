// Search for a song

function songSearch() {
  "use strict";

  let searchOutput = document.querySelector('.search-output');

  let searchBtn = document.getElementById('search');

  let searchInput = document.getElementById('search-input');

  searchBtn.addEventListener('click', () => {
    createSearch(searchInput, searchOutput);
  });

  searchInput.addEventListener('keypress', (e) => {
    if(e.keyCode === 13) {
      createSearch(searchInput, searchOutput);
    }
  });
}

// creating a song search
function createSearch(input, output) {
  // create p node
  let p = document.createElement('p');
  // get value from input field for note
  let inputVal = input.value;
  // check input value
  if (inputVal !== '') {
    // create text node
    let noteText = document.createTextNode(inputVal);
    // append text to paragraph
    p.appendChild(noteText);
    // append new paragraph and text to existing note output
    output.appendChild(p);
    // clear input text field
    input.value = '';
  }
}

// load app
songSearch();