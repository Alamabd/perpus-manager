// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const {contextBridge, ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('setting', {
    changePage: (page) => ipcRenderer.send('change-page', page),
})
contextBridge.exposeInMainWorld('books', {
    addBook: (data) => ipcRenderer.send('add-book', data),
    getBook: () => ipcRenderer.invoke('get-book'),
    changeStatusBook: (id, setStatus) => ipcRenderer.send('change-status-book', id, setStatus)
})