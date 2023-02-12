// Benny Batash - 205980857
// Assaf Yehezkel - 316040484

const express = require('express');
const router = express.Router();


// Made an array of two documents with our details
const developers = [
    { firstname: 'Benny', lastname: 'Batash', id: '205980857', email: 'bennybatashhit@gmail.com' },
    { firstname: 'Assaf', lastname: 'Yehezkel', id: '316040484', email: 'asafyehezkel237@gmail.com' }
];
// Using the GET method to export the json file(developers) to page
router.get('/', (req, res) => {
    res.json(developers)
});
module.exports = router;


