// document.getElementById('open-yt').addEventListener('click', () => window.electron.ipcRenderer.send('open-url', 'https://www.youtube.com'));
document.getElementById('open-twitterx').addEventListener('click', () => {
    window.electron.ipcRenderer.send('open-url', 'https://x.com/wh4len');
    window.electron.ipcRenderer.send('open-url', 'https://x.com/a5chilles');
});
// document.getElementById('open-discord').addEventListener('click', () => window.electron.ipcRenderer.send('open-application', 'discord'));
document.getElementById('open-discord').addEventListener('click', () => window.electron.ipcRenderer.send('open-url', 'https://discord.gg/cFRPQBWcyE'));
document.getElementById('open-ubisoft').addEventListener('click', () => window.electron.ipcRenderer.send('open-application', 'ubisoft'));
// document.getElementById('open-ubisoft').addEventListener('click', () => window.electron.ipcRenderer.send('open-url', 'https://www.ubisoft.com/'));
// document.getElementById('open-spotify').addEventListener('click', () => window.electron.ipcRenderer.send('open-url', 'https://www.spotify.com'));
// document.getElementById('open-soundcloud').addEventListener('click', () => window.electron.ipcRenderer.send('open-url', 'https://www.soundcloud.com'));

document.getElementById('minimize').addEventListener('click', () => {
    window.electron.ipcRenderer.send('manualMinimize');
});

document.getElementById('close').addEventListener('click', () => {
    window.electron.ipcRenderer.send('manualClose');
});

