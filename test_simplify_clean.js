#!/usr/bin/env node

/*
 * Cleaned test script for EduAble Content Simplification
 * Usage: node test_simplify.js
 */

const testText = "The photosynthesis process is fundamental to the ecosystem. Plants utilize sunlight to create energy. This process is essential for life on Earth.";

async function runTests() {
  console.log("\n" + "=".repeat(60));
  console.log("EduAble Content Simplification - Stability Tests");
  console.log("=".repeat(60) + "\n");

  // Test 1: Health Check
  console.log("Test 1: Server Health Check");
  console.log("-".repeat(60));
  try {
    const response = await fetch("http://localhost:5000/health");
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Server is running");
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Endpoints: ${data.endpoints.join(", ")}\n`);
    } else {
      console.log(`❌ Server returned status ${response.status}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.log(`❌ Cannot connect to server at http://localhost:5000`);
    console.log(`   Make sure the server is running (node server\\index.js) and the transformer service (python server\\transformer_simplifier.py) if used.\n`);
    process.exit(1);
  }

  // Test 2: Basic Simplification
  console.log("Test 2: Basic Text Simplification");
  console.log("-".repeat(60));
  try {
    const response = await fetch("http://localhost:5000/api/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: testText })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Simplification works");
      console.log(`   Source: ${data.source || 'unknown'}`);
      console.log(`   Original: ${data.originalLength} chars`);
      console.log(`   Simplified: ${data.simplifiedLength} chars`);
      console.log(`   Simplified text: ${String(data.simplifiedText).substring(0, 200)}...`);
      console.log(`   Bullets: ${Array.isArray(data.bullets) ? data.bullets.length : 0} items`);
      console.log(`   Key points: ${Array.isArray(data.keyPoints) ? data.keyPoints.length : 0} items`);
      console.log(`   Flow steps: ${Array.isArray(data.flow) ? data.flow.length : 0} items\n`);
    } else {
      let errText = '';
      try { errText = JSON.stringify(await response.json()); } catch(e) { errText = await response.text(); }
      console.log(`❌ Server error (${response.status}): ${errText}\n`);
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}\n`);
  }

  // Test 3: Empty Text Validation
  console.log("Test 3: Empty Text Validation");
  console.log("-".repeat(60));
  try {
    const response = await fetch("http://localhost:5000/api/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "" })
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(`✅ Server correctly rejects empty text`);
      console.log(`   Error: ${error.error}\n`);
    } else {
      console.log(`❌ Server should reject empty text\n`);
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}\n`);
  }

  // Test 4: Missing Text Field
  console.log("Test 4: Missing Text Field Validation");
  console.log("-".repeat(60));
  try {
    const response = await fetch("http://localhost:5000/api/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(`✅ Server correctly rejects missing text field`);
      console.log(`   Error: ${error.error}\n`);
    } else {
      console.log(`❌ Server should reject missing text field\n`);
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}\n`);
  }

  // Test 5: Text Too Long
  console.log("Test 5: Text Length Limit Validation");
  console.log("-".repeat(60));
  try {
    const longText = "a".repeat(5001); // 5001 characters (limit is 5000)
    const response = await fetch("http://localhost:5000/api/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: longText })
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(`✅ Server correctly enforces text length limit`);
      console.log(`   Error: ${error.error}\n`);
    } else {
      console.log(`❌ Server should reject text > 5000 chars\n`);
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}\n`);
  }

  // Test 6: Response Structure Validation
  console.log("Test 6: Response Structure Validation");
  console.log("-".repeat(60));
  try {
    const response = await fetch("http://localhost:5000/api/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: testText })
    });

    const data = await response.json();
    const requiredFields = ['simplifiedText', 'bullets', 'flow', 'keyPoints', 'originalLength', 'simplifiedLength'];
    const missingFields = requiredFields.filter(field => !(field in data));

    if (missingFields.length === 0) {
      console.log(`✅ Response has all required fields`);
      console.log(`   Fields: ${requiredFields.join(", ")}\n`);
    } else {
      console.log(`❌ Response missing fields: ${missingFields.join(", ")}\n`);
    }

    // Check that arrays are properly formatted
    if (!Array.isArray(data.bullets)) {
      console.log(`❌ 'bullets' should be an array\n`);
    }
    if (!Array.isArray(data.flow)) {
      console.log(`❌ 'flow' should be an array\n`);
    }
    if (!Array.isArray(data.keyPoints)) {
      console.log(`❌ 'keyPoints' should be an array\n`);
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}\n`);
  }

  // Summary
  console.log("=".repeat(60));
  console.log("All tests completed!");
  console.log("=".repeat(60));
  console.log("\nNext steps:");
  console.log("1. Open http://localhost:5173 in your browser");
  console.log("2. Navigate to the Content Simplification feature");
  console.log("3. Test with the provided sample text");
  console.log("\nFor detailed stability information, see: STABILITY_GUIDE.md\n");
}

runTests();