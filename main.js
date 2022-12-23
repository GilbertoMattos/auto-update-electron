const {app, BrowserWindow} = require('electron')
const path = require('path')
const {autoUpdater} = require('electron-updater')
const log = require('electron-log')
const os = require("os");
log.transports.file.resolvePath = () => path.join(os.homedir(), 'auto-update-electron.log')
log.info('Versão da aplicação = ' + app.getVersion())
let win;

function createWindow() {
    win = new BrowserWindow({width: 300, height: 400})
    win.loadFile(path.join(__dirname, 'index.html'))
}

app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify().then(function (r) {
        return log.info('finalizou check update');
    })
})

autoUpdater.on('update-available', () => {
    log.info('update-available')
})

autoUpdater.on('update-not-available', () => {
    log.info('update-not-available')
})

autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update')
})

autoUpdater.on('download-progress', (progressTrack) => {
    log.info('\n\ndownload-progress')
    log.info(progressTrack)
})

autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded')
})

autoUpdater.on('appimage-filename-updated', () => {
    log.info('appimage-filename-updated')
})

autoUpdater.on('update-cancelled', () => {
    log.info('update-cancelled')
})

autoUpdater.on('error', (e) => {
    log.info('Erro no auto-update '+ e)
})
