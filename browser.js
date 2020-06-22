let isLoading = false;

onload = () => {

  let webview = document.querySelector('webview');

  // **********************************
  // *
  // Render elements
  // *
  // **********************************
  doLayout();

  // **********************************
  // *
  // Event listeners for buttons and address bar
  // *
  // **********************************
  document.querySelector('#back').onclick = () => {
    webview.goBack();
    console.log('back')
  };

  document.querySelector('#forward').onclick = () => {
    webview.goForward();
    console.log('forward')
  };

  document.querySelector('#reload').onclick = () => {
    console.log('reload')
    if (isLoading) {
      webview.stop();
    } else {
      webview.reload();
    }
  };

  document.querySelector('#reload').addEventListener(
    'webkitAnimationIteration',
    () => {
      if (!isLoading) {
        document.body.classList.remove('loading');
      }
    });

  document.querySelector('#location-form').onsubmit = (e) => {
    e.preventDefault();
    navigateTo(document.querySelector('#location').value);
  };


  // **********************************
  // *
  // Webview
  // *
  // **********************************

  webview.addEventListener('close', handleExit);
  webview.addEventListener('did-start-loading', handleLoadStart);
  webview.addEventListener('did-stop-loading', handleLoadStop);
  webview.addEventListener('did-fail-load', handleLoadAbort);
  webview.addEventListener('did-get-redirect-request', handleLoadRedirect);
  webview.addEventListener('did-finish-load', handleLoadCommit);

  window.onresize = doLayout;
};


// **********************************
// *
// Helper functions
// *
// **********************************

const navigateTo = (url) => {
  resetExitedState();
  console.log(url)
  document.querySelector('webview').src = `https://${url}`;
}

const doLayout = () => {
  let webview = document.querySelector('webview');
  let controls = document.querySelector('.controls');
  let controlsHeight = controls.offsetHeight;
  let windowWidth = document.documentElement.clientWidth;
  let windowHeight = document.documentElement.clientHeight;
  let webviewWidth = windowWidth;
  let webviewHeight = windowHeight - controlsHeight;

  controls.style.top = webviewHeight+ 'px'
  webview.style.width = webviewWidth + 'px';
  webview.style.height = webviewHeight + 'px';
  webview.style.offsetTop = 0 + 'px';
}

const handleExit = (event) => {
  console.log(event.type);
  document.body.classList.add('exited');
  if (event.type == 'abnormal') {
    document.body.classList.add('crashed');
  } else if (event.type == 'killed') {
    document.body.classList.add('killed');
  }
}

const resetExitedState = () => {
  document.body.classList.remove('exited');
  document.body.classList.remove('crashed');
  document.body.classList.remove('killed');
}

const handleLoadCommit = () => {
  resetExitedState();
  let webview = document.querySelector('webview');
  document.querySelector('#location').value = webview.getURL();
  document.querySelector('#back').disabled = !webview.canGoBack();
  document.querySelector('#forward').disabled = !webview.canGoForward();
}

const handleLoadStart = (event) =>{
  document.body.classList.add('loading');
  isLoading = true;

  resetExitedState();
  if (!event.isTopLevel) {
    return;
  }

  document.querySelector('#location').value = event.url;
}

const handleLoadStop = (event) => {
  isLoading = false;
}

const handleLoadAbort = (event) => {
  console.log('LoadAbort');
  console.log('  url: ' + event.url);
  console.log('  isTopLevel: ' + event.isTopLevel);
  console.log('  type: ' + event.type);
}

const handleLoadRedirect = (event) => {
  resetExitedState();
  console.log(event)
  document.querySelector('#location').value = event.newUrl;
}


