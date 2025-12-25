const express = require("express");
const router = express.Router();
const db = require('../database');
const ExcelJS = require('exceljs');

router.get("/", async (req,res)=>{
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./tools.xlsx');
    const worksheet = workbook.getWorksheet(1);
    // Convert the worksheet data to JSON
    const data = [];
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        data.push(row.values);
    });

    // Get the header row (first row)
    const header = data[0];

    // Remove the header row from the data array
    data.shift();

    // Create an object to store the resulting data
    const result = {};

    // Loop through each row of data and create an object with keys based on the header row
    for (let i = 0; i < data.length-2; i++) {
        const row = data[i];
        const obj = {};
        for (let j = 0; j < header.length; j++) {
            obj[header[j]] = row[j];
        }
        var description = obj['description']
        var descfinal = ""
        var count = [];
        count.push(0)
        for(let j = 0; j<description.length; j++){
            if(description.substring(j,j+1)==="\""){
                count.push(j)
            }
        }
        for(let j = 0; j<count.length-1; j++){
            
            descfinal += description.substring(count[j], count[j+1]) +"\\"
        }
        descfinal += description.substring(count[count.length-1]);
        // console.log(description.substring(0,1)+"\""+description.substring(1))
        await db.promise().query('INSERT INTO submission VALUES (?, ?, ?, ?, ?, ?, "default", "default")', 
            [i+1, obj['techname'], descfinal, obj['link'], obj['displaytext'], obj['accepted']])
        await db.promise().query('INSERT INTO domains VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [i+1, obj['R'], obj['TP'], obj['MT'], obj['AR'], obj['U'], obj['MDL'], obj['RA'], obj['RoTech'], obj['LS'], obj['RoThink'], obj['EoST'], obj['EF'], obj['RTE'], obj['DLoI'], obj['RaAoC']])
    
        result[i+1] = obj;
    }
    // console.log(result)
    // console.log(result[1]['techname'])
    
    //add into database
    

    res.send('real data entered')
})

module.exports = router
