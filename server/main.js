const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser({ extended: true }));

const plugins = [
  { id: 1, name: 'settings', description: 'Lorem ipsum', path: 'settings' },
  { id: 2, name: 'avatar', description: 'Lorem ipsum', path: 'avatar' },
  { id: 3, name: 'analytics', description: 'Lorem ipsum', path: 'analytics' }
];

const enabledPlugins = [
  2,
  3
];

const staticPath =path.join(process.cwd(), 'server', 'plugins');

app.use('/static/plugins', express.static(staticPath));

app.get('/plugins', (req, res) => {
  const availablePlugins = plugins
    .reduce((acc, curr) => {
      if (!enabledPlugins.includes(curr.id)) { return acc; }
      return [
        ...acc,
        {
          ...curr,
          path: `http://localhost:3000/static/plugins/${curr.name}/${curr.name}.js`
        }
      ]
    }, []);

  
  res.json(availablePlugins);
});

app.listen(3000, () => {
  console.log('Magic is happening on port 3000');
});