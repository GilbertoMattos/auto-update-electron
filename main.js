const {app, BrowserWindow} = require('electron')
const path = require('path')
const {autoUpdater} = require('electron-updater')
const log = require('electron-log')
log.transports.file.resolvePath = () => path.join('/home/user/projetos/auto-update-electron', 'logs/main.log')
log.info('Versão da aplicação = ' + app.getVersion())
let win;

function createWindow() {
    win = new BrowserWindow({width: 300, height: 400})
    win.loadFile(path.join(__dirname, 'index.html'))
}

app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify()
})

autoUpdater.on('update-available', () => {
    console.log('update-available')
})

autoUpdater.on('update-not-available', () => {
    console.log('update-not-available')
})

autoUpdater.on('checking-for-update', () => {
    console.log('checking-for-update')
})

autoUpdater.on('download-progress', (progressTrack) => {
    console.log('\n\ndownload-progress')
    console.log(progressTrack)
})

autoUpdater.on('update-downloaded', () => {
    console.log('update-downloaded')
})

autoUpdater.on('error', () => {
    console.log('Erro no auto-update')
})
