// modules
const fs = require('fs')

let items = document.getElementById('items')

// get readerJS content
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

exports.select = e => {
    // remove current selected
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected')
    // set item is selected
    e.currentTarget.classList.add('selected')
}

exports.addItem = (item, newItem = false) => {
//     <div class="read-item">
//     <img src="">
//     <h2>Title of item added</h2>
// </div>

    let itemNode = document.createElement('div')
    itemNode.setAttribute('class', 'read-item')
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // set url as data attribute
    itemNode.setAttribute('data-url', item.url)

    items.appendChild(itemNode)

    // attach click event handler
    itemNode.addEventListener('click', this.select)

    // attach double click handler
    itemNode.addEventListener('dblclick', this.open)

    // if it is the first item, select it
    if(document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected')
    }

    if(newItem) {
        this.storage.push(item)
        this.save()
    }

}

exports.changeSelection = direction => {
    // get current selected item
    let selectedItem = document.getElementsByClassName('read-item selected')[0]
    if(direction === 1) {
        if(selectedItem.nextElementSibling) {
            selectedItem.classList.remove('selected')
            selectedItem.nextElementSibling.classList.add('selected')
        }
    }
    else if(direction === -1) {
        if(selectedItem.previousElementSibling) {
            selectedItem.classList.remove('selected')
            selectedItem.previousElementSibling.classList.add('selected')
        }
    }
}

// open the selected item
exports.open = () => {
    // get current selected item
    let selectedItem = document.getElementsByClassName('read-item selected')[0]

    let url = selectedItem.dataset.url;
    console.log('Opening item:', url)
    // open item in proxy BrowserWindow
    let readerWin = window.open(url, `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1
    `)

    readerWin.eval(readerJS)
}

this.storage.forEach(item => {
    this.addItem(item)
});