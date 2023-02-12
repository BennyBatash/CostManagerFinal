// Benny Batash - 205980857
// Assaf Yehezkel - 316040484

const express = require('express');
const router = express.Router();
const functions = require('../models/database');


//checking if the date are valid
const DayIsValid = (day) => {
    if (day > 0 && day <= 31) {
        return true;
    }
    return false;
}

const MonthIsValid = (month) => {
    if (month > 0 && month <= 12) {
        return true;
    }
    return false;
}

const YearIsValid = (year) => {
    let curr_year = new Date().getFullYear();
    if (year >= 1970 && year <= curr_year) {
        return true;
    }
    return false;
}



// Using the POST method to add costs
router.post('/', async (req, res) => {
    //check if user exists
    const userExists = await functions.UserExists(req.body.user_id);
    if (!userExists) {
        console.log('user not exists');
        res.status(500).send('user not exists');
        return;
    }


    // if "req.body.year" is null it takes the new Date
    let updated_year = req.body.year || new Date().getFullYear();
    let updated_month = req.body.month || new Date().getMonth() + 1;
    let updated_day = req.body.day || new Date().getDate();

    //checks if the date is valid
    let DayValid =  DayIsValid(updated_day);
    let MonthValid =  MonthIsValid(updated_month);
    let YearValid =  YearIsValid(updated_year);
    if (!DayValid || !MonthValid || !YearValid) {
        res.status(500).send('one or more parameters are invalid');
        return;
    }

   // Using the constructor "Cost" to make new cost
    const newCost = await new functions.Cost({
        sum: req.body.sum,
        category: req.body.category,
        description: req.body.description,
        user_id: req.body.user_id,
        year: updated_year,
        month: updated_month,
        day: updated_day
    });

    // check if there is report to update
    let existingReport = await functions.Report.findOne({user_id: req.body.user_id, year: updated_year, month: updated_month});
    if(existingReport){
        existingReport.report[`${req.body.category}`].push({
            day: updated_day,
            description: req.body.description,
            sum: req.body.sum
        });
        await functions.Report.updateOne({ user_id: req.body.user_id, year: updated_year, month: updated_month},
            {report: existingReport.report});
    }

    // Save the "cost" to database
    await newCost.save((err, cost) => {
        if (err) {
            return res.status(500).json({
                message: "Error saving cost to database",
                error: err
            });
        }
        return res.status(200).json({
            message: "Cost successfully added",
            cost: cost
        });
    });

});

module.exports = router;
