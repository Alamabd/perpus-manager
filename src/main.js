const { app, BrowserWindow, ipcMain, Menu, Notification, globalShortcut } = require('electron')
const path = require('node:path')
const booksDb = require('./handleDb/books')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

const createMenu = () => {
  const notif = new Notification()
  // Menu
  const menuTemplate = [
    {
      label: 'menu',
      submenu: [
        {
          label: 'tentang',
          click: () => {
            notif.title = "hello world"
            notif.show()
          }
        },
        {
          label: 'keluar',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'layar',
      submenu: [
        {
          label: 'layar penuh (f11)',
          click: () => {
            mainWindow.setFullScreen(true)
          }
        }
      ]
    },
    {
      label: 'bantuan'
    }
  ]
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

const createShortcut = () => {
  globalShortcut.register('F11', () => {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false)
    } else {
      mainWindow.setFullScreen(true)
    }
  })
  
  globalShortcut.register('Control+R', () => {
    mainWindow.reload()
  })
  globalShortcut.register('Control+Shift+I', () => {
    mainWindow.webContents.openDevTools()
  })
}

app.whenReady().then(() => {
  createWindow()
  createMenu()
  createShortcut()

  
  // On OS X it's common to re-create a window in the app when the
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Chanels
  ipcMain.on('change-page', (_, page) => {
    mainWindow.loadFile(path.join(__dirname, page))
  })

  // Books
  booksDb.init()
  ipcMain.on('add-book', (_, newBook) => {
    booksDb.addBook(newBook)
  })
  ipcMain.handle('get-book', () => {
    return booksDb.getBook()
  })
  ipcMain.on('change-status-book', (_, id, setStatus) => {
    booksDb.changeStatusBook(id, setStatus)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})