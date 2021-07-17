const path = require('path');
const fs = require('fs');

const result = fs.readdirSync(path.join(__dirname, 'plugins'));

result.forEach((file) => {
  const script = document.createElement('script');
  script.src = "plugins/" + file;

  script.onload = () => {
    const mainFnName = file.replace('.js', '');

    console.log(mainFnName);

    window[mainFnName]();
  }

  document.body.appendChild(script);
})
