import React from 'react'

// src/utils/auth.js
export function isAuthenticated() {
  // Check if the user is logged in (you can adjust this based on your logic)
  return !!localStorage.getItem('isLoggedIn'); // Replace with your actual logic
}

