#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateBirthday(birthday) {
  // Check format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return false;
  const date = new Date(birthday);
  // Check if valid date and matches input (to avoid 2023-02-30 becoming 2023-03-02)
  return date instanceof Date && !isNaN(date) && date.toISOString().slice(0, 10) === birthday;
}

function validatePassport(passport) {
  // Alphanumeric, uppercase, 6-9 chars
  return /^[A-Z0-9]{6,9}$/.test(passport);
}

// Main logic
function printUsage() {
  console.log('Usage: node validate-csv.js <path-to-csv>');
  console.log('CSV must have columns: email, birthday, passport');
}

const csvFile = process.argv[2];
if (!csvFile) {
  printUsage();
  process.exit(1);
}

if (!fs.existsSync(csvFile)) {
  console.error('File not found:', csvFile);
  process.exit(1);
}

let rowNum = 0;
fs.createReadStream(csvFile)
  .pipe(csv())
  .on('data', (row) => {
    rowNum++;
    const email = row.email || '';
    const birthday = row.birthday || '';
    const passport = row.passport || '';
    const errors = [];
    if (!validateEmail(email)) errors.push('Invalid email');
    if (!validateBirthday(birthday)) errors.push('Invalid birthday');
    if (!validatePassport(passport)) errors.push('Invalid passport');
    if (errors.length === 0) {
      console.log(`Row ${rowNum}: VALID`);
    } else {
      console.log(`Row ${rowNum}: INVALID - ${errors.join(', ')}`);
    }
  })
  .on('end', () => {
    console.log('Validation complete.');
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err.message);
    process.exit(1);
  }); 