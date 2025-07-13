import axios from "axios";

export const serverURL = import.meta.env.VITE_BACKEND_URL || "https://sudoku-backend-04y2.onrender.com";

export async function registerUser(username, password) {
  try {
    const response = await axios.post(serverURL + "/register", { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(username, password) {
  try {
    const response = await axios.post(serverURL + "/login", { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserDetails(token) {
  try {
    const response = await axios.get(serverURL + "/getDetails", {
      headers: { "x-access-token": token },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function submitSolution(token, data) {
  try {
    const response = await axios.post(serverURL + "/solution", data, {
      headers: { "x-access-token": token },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getLeaderboard(puzzleString) {
  try {
    const response = await axios.get(serverURL + "/leaderboards", {
      params: { puzzle: puzzleString },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
} 