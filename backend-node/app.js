import express from "express"
import fetch from "node-fetch"

const PORT = 3001
const app = express()
const cors = require("cors") 

app.use((req, res, next) => {
  res.header('X-Frame-Options', 'ALLOWALL');
  next();
});

app.use(cors)

app.listen(PORT, () => {
  // res.header('X-Frame-Options', 'ALLOW-FROM http://localhost:5173/');
  console.log(`Server running on port ${PORT}`)
})

// app.use((req, res, next) => {
//   res.header('X-Frame-Options', 'ALLOWALL');
//   next();
// });

async function fetchAccessToken() {
  try {
    const body = {
      username: "admin",
      password: "admin",
      provider: "db",
      refresh: true,
    }

    const response = await fetch(
      "http://localhost:8088/api/v1/security/login",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const jsonResponse = await response.json()
    return jsonResponse?.access_token
  } catch (e) {
    console.error(error)
  }
}

async function fetchGuestToken() {
  const accessToken = await fetchAccessToken()
  try {
    const body = {
      resources: [
        {
          type: "dashboard",
          id: "090ef4c7-d67b-4e94-ad55-e8f420617c20",
        },
      ],
      rls: [],
      user: {
        username: "guest",
        first_name: "Guest",
        last_name: "User",
      },
    }
    const response = await fetch(
      "http://localhost:8088/api/v1/security/guest_token",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    const jsonResponse = await response.json()
    return jsonResponse?.token
  } catch (error) {
    console.error(error)
  }
}

app.get("/guest-token", async (req, res) => {
  const token = await fetchGuestToken()
  res.json(token)
})