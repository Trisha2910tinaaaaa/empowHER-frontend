/**
 * Test script for Profile API
 *
 * This script tests the profile API endpoints to ensure they're working correctly.
 * Run this script from the root directory with:
 * node scripts/test-profile-api.js
 */

const fetch = require("node-fetch");

// Configuration
const API_BASE_URL = "https://empowher-node-backend.onrender.com/api";
const TEST_TOKEN = process.env.TEST_AUTH_TOKEN || ""; // Set your test auth token here or in env

// Helper function to make authenticated requests
async function makeAuthRequest(endpoint, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TEST_TOKEN}`,
  };

  const options = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    console.log(`\nMaking ${method} request to ${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    console.log(`Response status: ${response.status} ${response.statusText}`);

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
      console.log("Non-JSON response:", data);
      return { ok: response.ok, status: response.status, text: data };
    }

    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error);
    return { ok: false, error: error.message };
  }
}

// Test functions
async function testHealthEndpoint() {
  console.log("\n---- Testing Health Endpoint ----");
  try {
    const startTime = Date.now();
    const response = await fetch(`${API_BASE_URL}/health`);
    const endTime = Date.now();

    console.log(`Response time: ${endTime - startTime}ms`);
    const data = await response.json();
    console.log("Health endpoint response:", data);
    return response.ok;
  } catch (error) {
    console.error("Health endpoint error:", error);
    return false;
  }
}

async function testGetProfile() {
  console.log("\n---- Testing Get Profile ----");
  const result = await makeAuthRequest("/profile");

  if (result.ok) {
    console.log("Profile data retrieved successfully:");
    console.log("Name:", result.data.data.name);
    console.log("Email:", result.data.data.email);
    console.log("Skills:", result.data.data.skills);
    console.log(
      "Profile object structure:",
      Object.keys(result.data.data).join(", ")
    );

    // Detailed verification of profile fields
    const profile = result.data.data;
    const requiredFields = ["name", "email"];
    const optionalFields = [
      "bio",
      "skills",
      "location",
      "title",
      "website",
      "phone",
      "profileImage",
      "experience",
      "education",
    ];

    const missingRequired = requiredFields.filter((field) => !profile[field]);
    if (missingRequired.length > 0) {
      console.warn(`⚠️ Missing required fields: ${missingRequired.join(", ")}`);
    }

    const presentOptional = optionalFields.filter(
      (field) => profile[field] !== undefined
    );
    console.log(`Optional fields present: ${presentOptional.join(", ")}`);

    // Check arrays for proper structure
    if (Array.isArray(profile.skills)) {
      console.log(`Skills array has ${profile.skills.length} items`);
    } else {
      console.warn("⚠️ Skills is not an array");
    }

    if (Array.isArray(profile.experience)) {
      console.log(`Experience array has ${profile.experience.length} items`);
    }

    if (Array.isArray(profile.education)) {
      console.log(`Education array has ${profile.education.length} items`);
    }
  } else {
    console.error("Failed to get profile:", result.data || result.error);
  }

  return result;
}

async function testUpdateProfile() {
  console.log("\n---- Testing Update Profile ----");

  // First get the current profile to avoid overwriting data
  const currentProfile = await makeAuthRequest("/profile");

  if (!currentProfile.ok) {
    console.error("Failed to get current profile for update");
    return { ok: false };
  }

  const profileData = currentProfile.data.data;

  // Update with test data
  const testSkills = ["JavaScript", "React", "Node.js", "MongoDB", "Express"];

  const updatedData = {
    ...profileData,
    bio: `Updated bio at ${new Date().toISOString()}`,
    skills: testSkills,
  };

  console.log("Sending update with skills:", testSkills);
  const result = await makeAuthRequest("/profile", "PUT", updatedData);

  if (result.ok) {
    console.log("Profile updated successfully:");
    console.log("Updated Bio:", result.data.data.bio);

    // Verify skills array was properly updated
    if (Array.isArray(result.data.data.skills)) {
      const returnedSkills = result.data.data.skills;
      console.log("Updated Skills:", returnedSkills);

      // Check if all skills were saved properly
      const allSkillsSaved = testSkills.every((skill) =>
        returnedSkills.includes(skill)
      );

      if (allSkillsSaved) {
        console.log("✅ All skills were saved correctly");
      } else {
        console.warn("⚠️ Some skills might be missing in the response");
        const missing = testSkills.filter(
          (skill) => !returnedSkills.includes(skill)
        );
        if (missing.length > 0) {
          console.warn("Missing skills:", missing);
        }
      }
    } else {
      console.warn("⚠️ Skills is not returned as an array");
    }
  } else {
    console.error("Failed to update profile:", result.data || result.error);
  }

  return result;
}

// Main test function
async function runTests() {
  console.log("Starting Profile API tests...");
  console.log(`Using API base URL: ${API_BASE_URL}`);

  if (!TEST_TOKEN) {
    console.warn(
      "Warning: No auth token provided. Set TEST_AUTH_TOKEN in environment or in the script."
    );
  } else {
    console.log("Using auth token:", TEST_TOKEN.substring(0, 10) + "...");
  }

  // Test health endpoint
  const healthOk = await testHealthEndpoint();
  if (!healthOk) {
    console.error("❌ Health endpoint test failed. Aborting further tests.");
    return;
  } else {
    console.log("✅ Health endpoint test passed");
  }

  // Test get profile
  const profileResult = await testGetProfile();
  if (!profileResult.ok) {
    console.error("❌ Get profile test failed. Aborting further tests.");
    return;
  } else {
    console.log("✅ Get profile test passed");
  }

  // Test update profile
  const updateResult = await testUpdateProfile();
  if (!updateResult.ok) {
    console.error("❌ Update profile test failed.");
  } else {
    console.log("✅ Update profile test passed");
  }

  console.log("\nAll tests completed!");
}

// Run the tests
runTests().catch((err) => {
  console.error("Error running tests:", err);
});
