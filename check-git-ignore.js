// Check if sensitive files would be ignored by Git
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkGitIgnore() {
  try {
    // Run git check-ignore for sensitive files
    const files = [
      'backend/config/config.env'
    ];
    
    console.log('Checking if sensitive files are properly ignored by Git:');
    
    files.forEach(file => {
      try {
        // This will throw if the file is not ignored
        execSync(`git check-ignore -q ${file}`, { stdio: 'ignore' });
        console.log(`✅ ${file} is properly ignored`);
      } catch (error) {
        console.log(`❌ WARNING: ${file} is NOT ignored by Git and might be committed!`);
      }
    });
    
  } catch (error) {
    console.error('Error checking Git ignore status:', error.message);
  }
}

checkGitIgnore();
