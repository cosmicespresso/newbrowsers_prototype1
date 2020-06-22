const {app, BrowserWindow, screen} = require('electron');

let mainWindow;
app.allowRendererProcessReuse = true;


app.on('ready', function() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize
  
  mainWindow = new BrowserWindow({ 
		width: width*0.6, 
		height: height*0.6,
	  transparent: false, 
	  frame: false,
	  useContentSize: true,
	  alwaysOnTop: false,
	  vibrancy: 'hud',
	  webPreferences: {
	    nodeIntegration: true,
	    devTools: true,
	  	webviewTag: true
	  }
	});

  mainWindow.loadURL('file://' + __dirname + '/browser.html');
  mainWindow.openDevTools();
})

app.on('window-all-closed', function() {
  app.quit();
});
