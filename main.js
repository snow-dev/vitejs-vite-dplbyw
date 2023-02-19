import './style.css';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';

/** @type {import('webcontainer/api').WebContainer} */
let webcontainerInstance;

async function installDependencies() {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);

  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );

  // Wait for install comant to exit.
  return installDependencies;
}

async function startDevServer() {
  // Run `npm run start` to start the Express app
  await webcontainerInstance.spawn('npm', ['run', 'start']);

  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (port, url) => {
    console.log('URl ------------------> ', url);
    iframeEl.src = url;
  });
}

window.addEventListener('load', async () => {
  textarea.value = files['index.js'].file.contents;

  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);

  const exitCode = await installDependencies();
  if (exitCode !== 0) {
    throw new Error('Installation failed');
  }

  startDevServer();
});

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>  
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>  

  </div>
`;

/** @type {HTMLIFrameElement | null} **/
const iframe = document.querySelector('iframe');

/** @type {HTMLTextAreaElement | null } **/
const textarea = document.querySelector('textarea');
