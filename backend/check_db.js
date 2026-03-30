const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/roms');
const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({}), 'menuitems');
MenuItem.countDocuments().then(count => {
  console.log('Count:', count);
  MenuItem.find().limit(1).then(item => {
    console.log('Sample Item:', JSON.stringify(item, null, 2));
    process.exit(0);
  });
}).catch(err => {
  console.error(err);
  process.exit(1);
});
