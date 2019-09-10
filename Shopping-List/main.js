const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;  //  object destructuring

process.env.NODE_ENV = 'production';
let mainWindow;
let addWindow;

// Listen for app to ready
app.on('ready', function(){
    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {nodeIntegration: true} 
    });
    // load html file into  window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
    // Quit app when close
    mainWindow.on('closed', function(){
        app.quit();
    });
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);

});
// Handle create Add Window
function createAddWindow(){
     // create new window
     addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        webPreferences: {nodeIntegration: true} 
    });
     // load html file into  window
     addWindow.loadURL(url.format({
         pathname: path.join(__dirname, 'addWindow.html'),
         protocol: 'file',
         slashes: true
     }));
     // Garbage Collection handle
     addWindow.on('close', function(){
         addWindow = null;
     });
}
// catch item:add
ipcMain.on('item:add', function(e,item){
    // console.log(item);
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
})
// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]

// Add developer tools
if (process.env.NODE_ENV !== 'prodection'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}

