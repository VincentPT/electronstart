const {ipcRenderer} = require('electron')
const items = require('./items')

let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemURL = document.getElementById('url'),
    search = document.getElementById('search')

const enableModalButtons = () => {
    addItem.disabled = false
    addItem.style.opacity = 1
    addItem.innerText = "Add item"
    closeModal.style.display = 'inline'
}

const disableModalButtons = () => {
    addItem.disabled = true
    addItem.style.opacity = 0.5
    addItem.innerText = "Adding..."
    closeModal.style.display = 'none'
}


// filter item with search
search.addEventListener('keyup', e => {
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        let hasMatch = item.innerText.toLowerCase().includes(search.value.toLowerCase())
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})

// show modal
showModal.addEventListener('click', e=> {
    modal.style.display = 'flex'
    itemURL.focus();
})

//hide modal
closeModal.addEventListener('click', e=> {
    modal.style.display = 'none'
})

addItem.addEventListener('click', e => {
    if(itemURL.value) {
        disableModalButtons()
        // send url to main process to extract item information
        ipcRenderer.send('new-item', itemURL.value)
    }
})

itemURL.addEventListener('keyup', e => {
    if(e.key === 'Enter') {
        addItem.click()
    }
})

ipcRenderer.on('new-item-success', (e, item) => {
    enableModalButtons()
    items.addItem(item, true)

    modal.style.display = 'none'
    itemURL.value = ''
})

document.addEventListener('keyup', e => {
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key === 'ArrowUp' ? -1 : 1)
    }
})