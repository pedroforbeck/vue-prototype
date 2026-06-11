const https = require('https');
const check = (url) => new Promise(r => https.get(url, res => r({url, status: res.statusCode})));
const urls = [
  'cd_drive-4.png', 'cd_drive-0.png', 'drive_cd-4.png', 'drive_cd-0.png', 
  'cd_rom_drive-4.png', 'cd_audio_cd_a-4.png', 'cd_audio_cd_a-0.png'
].map(n => `https://win98icons.alexmeub.com/icons/png/${n}`);

Promise.all(urls.map(check)).then(results => {
  console.log(results.filter(r => r.status === 200).map(r => r.url).join('\n'));
});
