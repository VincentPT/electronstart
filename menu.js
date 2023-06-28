// modules
const {Menu, shell} = require('electron')

// module function to create main app menu
module.exports = (appWin) => {
    // menu template
    let template = [
        {
            label: "Items",
            submenu: [
                {
                    label: 'Add new',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        appWin.send('menu-show-modal')
                    }
                },
                {
                    label: 'Read item',
                    accelerator: 'CmdOrCtrl + Enter',
                    click: () => {
                        appWin.send('menu-open-item')
                    }
                },
                {
                    label: 'Delete item',
                    accelerator: 'CmdOrCtrl + Backspace',
                    click: () => {
                        appWin.send('menu-delete-item')
                    }
                },
                {
                    label: 'Open in browser',
                    accelerator: 'CmdOrCtrl + Shift + Enter',
                    click: () => {
                        appWin.send('menu-open-item-native')
                    }
                },
                {
                    label: 'Search items',
                    accelerator: 'CmdOrCtrl + S',
                    click: () => {
                        appWin.send('menu-focus-search')
                    }
                }
            ]
        },
        {
            role: "editMenu"
        },
        {
            role: "windowMenu"
        },
        {
            label: "Help",
            submenu: [
                {
                    label: 'Learn more',
                    click: () => {
                        shell.openExternal('https://github.com/VincentPT/electronstart')
                    }
                }
            ]
        }
    ]

    // create Mac app menu
    if(process.platform === 'darwin') {
        template.unshift({role: 'appMenu'})
    }

    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}