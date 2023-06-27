// modules
const fs = require('fs')

let items = document.getElementById('items')

// get readerJS content
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// listen for 'Done' message from reader window
window.addEventListener('message', e => {
    console.log(e.data)
    if(e.data.action === 'delete-reader-item') {
        this.delete(e.data.itemIndex)
        e.source.close()
    }
})

exports.delete = itemIndex => {
    items.removeChild(items.childNodes[itemIndex + 1])
    this.storage.splice(itemIndex, 1)
    this.save()

    if(this.storage.length) {
        let = newSelectedItemIndex = (itemIndex === 0) ? 0: itemIndex - 1
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
}

exports.getSelectedItem = () => {
    let currentItem = document.getElementsByClassName('read-item selected')[0]
    let itemIndex = 0
    let child = currentItem
    while( (child = child.previousElementSibling) != null) {
        itemIndex++;
    }

    return {node:currentItem, index: itemIndex}
}

exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

exports.select = e => {
    // remove current selected
    this.getSelectedItem().node.classList.remove('selected')
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
    let selectedItem = this.getSelectedItem().node
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
    let selectedItem = this.getSelectedItem()

    let url = selectedItem.node.dataset.url;
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

    readerWin.eval(readerJS.replace('{{index}}', '' + selectedItem.index))
}

this.storage.forEach(item => {
    this.addItem(item)
});