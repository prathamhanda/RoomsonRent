// Remove sensitive files from git tracking and verify they're ignored
const { execSync } = require('child_process');

function removeFromGitTracking() {
  try {
    const sensitiveFiles = [
      'backend/config/config.env'
    ];
    
    console.log('Removing sensitive files from Git tracking:');
    
    // Remove files from Git's index
    sensitiveFiles.forEach(file => {
      try {
        execSync(`git rm --cached "${file}"`, { stdio: 'pipe' });
        console.log(`✅ Removed ${file} from Git tracking`);
      } catch (error) {
        console.log(`ℹ️ ${file} was not tracked or couldn't be removed: ${error.message}`);
      }
    });
    
    console.log('\nChecking if files are now properly ignored:');
    
    // Verify they're now ignored
    sensitiveFiles.forEach(file => {
      try {
        execSync(`git check-ignore -q "${file}"`, { stdio: 'ignore' });
        console.log(`✅ ${file} is properly ignored`);
      } catch (error) {
        console.log(`❌ WARNING: ${file} is NOT ignored by Git and might be committed!`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

removeFromGitTracking();
