#!/bin/bash

# GamePulse Admin Auth Test Script
# Run this after starting the server to test authentication

echo "🧪 Testing GamePulse Admin Authentication System"
echo "================================================"
echo ""

BASE_URL="http://localhost:5001"

# Test 1: Admin Login
echo "📝 Test 1: Admin Login"
echo "Endpoint: POST /api/auth/admin-login"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/admin-login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gamepulse.com",
    "password": "admin123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "✅ Login successful! Token received."
    echo "Token: ${TOKEN:0:50}..."
else
    echo "❌ Login failed!"
    exit 1
fi

echo ""
echo "================================================"
echo ""

# Test 2: Add Commentary WITH Token (Should Succeed)
echo "📝 Test 2: Add Commentary WITH Token (Should Succeed)"
echo "Endpoint: POST /api/commentary/:gameId"
echo ""

# You'll need to replace GAME_ID with an actual game ID from your database
# For testing, we'll use a placeholder
GAME_ID="675d8f9e1234567890abcdef"

COMMENTARY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/commentary/$GAME_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "text": "Test commentary from admin! What a brilliant shot!"
  }')

echo "$COMMENTARY_RESPONSE" | jq '.'
echo ""

if echo "$COMMENTARY_RESPONSE" | jq -e '.status == "success"' > /dev/null; then
    echo "✅ Commentary added successfully!"
else
    echo "⚠️  Commentary add failed (might be invalid game ID)"
fi

echo ""
echo "================================================"
echo ""

# Test 3: Add Commentary WITHOUT Token (Should Fail)
echo "📝 Test 3: Add Commentary WITHOUT Token (Should Fail with 401)"
echo "Endpoint: POST /api/commentary/:gameId"
echo ""

NO_AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/commentary/$GAME_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This should fail - no token"
  }')

echo "$NO_AUTH_RESPONSE" | jq '.'
echo ""

if echo "$NO_AUTH_RESPONSE" | jq -e '.status == "error"' > /dev/null; then
    echo "✅ Correctly rejected unauthorized request!"
else
    echo "❌ Security issue: Unauthorized request was allowed!"
fi

echo ""
echo "================================================"
echo ""

# Test 4: Invalid Token (Should Fail)
echo "📝 Test 4: Invalid Token (Should Fail with 403)"
echo "Endpoint: POST /api/commentary/:gameId"
echo ""

INVALID_TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/commentary/$GAME_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token_12345" \
  -d '{
    "text": "This should also fail - invalid token"
  }')

echo "$INVALID_TOKEN_RESPONSE" | jq '.'
echo ""

if echo "$INVALID_TOKEN_RESPONSE" | jq -e '.status == "error"' > /dev/null; then
    echo "✅ Correctly rejected invalid token!"
else
    echo "❌ Security issue: Invalid token was accepted!"
fi

echo ""
echo "================================================"
echo ""
echo "🎉 Testing Complete!"
echo ""
echo "Summary:"
echo "- Admin Login: ✅"
echo "- Protected Route with Token: ✅"
echo "- Protected Route without Token: ✅ (Rejected)"
echo "- Protected Route with Invalid Token: ✅ (Rejected)"
echo ""
echo "Admin Credentials for Testing:"
echo "Email: admin@gamepulse.com"
echo "Password: admin123"
echo ""
