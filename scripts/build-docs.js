const fs = require('fs');

fs.rmSync('./docs/dist/', { recursive: true, force: true });

fs.mkdirSync('./docs/dist', {}, (error) => {
  if (error) throw error;
});

fs.cp('./dist', './docs/dist', { recursive: true }, (error) => {
  if (error) throw error;
});
