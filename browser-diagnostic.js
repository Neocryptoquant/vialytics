// Diagnostic script for Vialytics deployment
// Run this in browser console on https://vialytics.xyz

console.log('=== Vialytics Diagnostic ===\n');

// 1. Check if we can access the module
console.log('1. Checking API configuration...');
try {
    // This won't work in production build, but let's try
    console.log('   Note: Direct import may not work in production');
} catch (e) {
    console.log('   Cannot import module directly (expected in production)');
}

// 2. Check what the page is actually using
console.log('\n2. Checking actual API calls...');
console.log('   Open Network tab and enter a wallet address');
console.log('   Look for the URL of failed requests');

// 3. Test Railway API directly
console.log('\n3. Testing Railway API directly...');
fetch('https://vialytics-production.up.railway.app/health')
    .then(r => {
        console.log('   ✅ Railway API reachable');
        return r.json();
    })
    .then(data => {
        console.log('   Response:', data);
    })
    .catch(e => {
        console.log('   ❌ Railway API error:', e.message);
    });

// 4. Test with CORS
console.log('\n4. Testing API with wallet endpoint...');
fetch('https://vialytics-production.up.railway.app/api/analytics/test')
    .then(r => {
        console.log('   Status:', r.status);
        return r.text();
    })
    .then(data => {
        console.log('   Response:', data.substring(0, 100));
    })
    .catch(e => {
        console.log('   ❌ Error:', e.message);
    });

// 5. Check localStorage
console.log('\n5. Checking localStorage...');
console.log('   Keys:', Object.keys(localStorage));

console.log('\n=== End Diagnostic ===');
console.log('\nNext: Check Network tab when you submit a wallet address');
console.log('Look for the URL it\'s trying to call');
