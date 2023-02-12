// Benny Batash - 205980857
// Assaf Yehezkel - 316040484


const express = require('express');
const router = express.Router();
const functions = require('../models/database');


// Create the 'report' route
router.get('/', async (req, res) => {
    const { year, month, user_id } = req.query;

    //check if user exists
    const userExists = await functions.UserExists(user_id);
    if (!userExists) {
        console.log('user not exists');
        return res.status(500).send('user not exists');
    }
    // not creating the same report all over again
    let existingReport = await functions.Report.findOne({user_id: user_id, year: year, month: month});
    if(existingReport){
        return res.status(200).json(existingReport.report);
    }
    // check if the report is empty
    const costs = await functions.Cost.find({ year: year, month: month, user_id: user_id });
    if (costs.length === 0){
        return res.status(500).send("empty report");
    }
    // Create a new document for the report
    const newReport = await new functions.Report({user_id: user_id,year: year,month: month});

    // Iterate over the costs and group them by category
    await costs.forEach((cost) => {

        newReport.report[cost.category].push({
            day: cost.day,
            description: cost.description,
            sum: cost.sum
        });
    });
    // saving the new report
    await newReport.save(function (error) {
        if (error) {
            console.error(error);
        } else {
            console.log("Report was saved successfully");
        }
    });

    return res.status(200).json(newReport.report);
});



module.exports = router;




