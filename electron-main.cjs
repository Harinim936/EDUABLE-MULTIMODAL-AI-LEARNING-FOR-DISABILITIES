const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // DEV mode
  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173");
  } else {
    // PROD mode (IMPORTANT FIX)
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }

  // Debug (VERY IMPORTANT)
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});