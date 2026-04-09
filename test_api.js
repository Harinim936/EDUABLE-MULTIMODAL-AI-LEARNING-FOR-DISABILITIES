import fetch from 'node-fetch';

async function testAPI() {
  console.log('Testing /api/simplify endpoint...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/simplify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: 'The photosynthesis process is fundamental to the ecosystem. Plants utilize sunlight to create energy.'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers));
    
    const text = await response.text();
    console.log('Response Body:', text);
    
    if (response.ok) {
      try {
        const json = JSON.parse(text);
        console.log('\n✅ Success! Response parsed as JSON:');
        console.log(JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('\n❌ Response is not valid JSON');
      }
    } else {
      console.log('\n❌ Server returned an error status');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
