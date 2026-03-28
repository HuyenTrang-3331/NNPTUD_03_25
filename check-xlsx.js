const ExcelJS = require('exceljs');
const path = require('path');

async function readXlsx(filename) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filename);
    const worksheet = workbook.getWorksheet(1);
    const data = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header
            data.push({
                username: row.getCell(1).value,
                email: row.getCell(2).value
            });
        }
    });
    return data;
}

async function checkFiles() {
    const files = [
        'uploads/1774684193370-511710955.xlsx',
        'uploads/1774684227385-975879908.xlsx'
    ];
    for (const file of files) {
        console.log(`--- Content of ${file} ---`);
        try {
            const data = await readXlsx(file);
            console.log(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error reading ${file}: ${error.message}`);
        }
    }
}

checkFiles();
