const { dialog } = require('electron')
const {autoUpdater} = require('electron-updater')

// configure log for auto update
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'
// disable auto downloading of updates
autoUpdater.autoDownload = false

module.exports = () => {    
    autoUpdater.checkForUpdates()

    // listen for update found
    autoUpdater.on('update-available', () => {
        // prompt user to start upadate
        dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version fo Readit is available. Do you want to update now?',
            buttons: ['Update', 'No']
        }).then ( result => {
            let buttonIndex = result.response
            if(buttonIndex === 0) {
                autoUpdater.downloadUpdate()
            }
        })
    })

    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: 'Install & restart now?',
            buttons: ['Yes', 'Later']
        }).then ( result => {
            let buttonIndex = result.response
            if(buttonIndex === 0) {
                autoUpdater.quitAndInstall(false, true)
            }
        })
    })
}