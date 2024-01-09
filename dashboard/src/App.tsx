import { useEffect } from "react"
import { embedDashboard } from "@superset-ui/embedded-sdk"
import "./App.css"

function App() {
  const getToken = async () => {
    const response = await fetch("/guest-token")
    const token = await response.json()
    return token
  }

  useEffect(() => {
    const embed = async () => {
      await embedDashboard({
        id: "77cb945d-4a48-4f51-a06a-299ce700d663", // given by the Superset embedding UI
        supersetDomain: "http://localhost:8088/superset/dashboard/11/?native_filters_key=w3MA6WgswSZR6lv3I6QCu6zIUWQCJB133TCW4GEiYVQo14FmKzulAs3fEDt6P6G9",
        mountPoint: document.getElementById("dashboard"), // html element in which iframe render
        fetchGuestToken: () => getToken(),
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: true,
          hideTab: true,
        },
      })
    }
    if (document.getElementById("dashboard")) {
      embed()
    }
  }, [])

  return (
    <div className="App">
      <h1>Superset Dashboard into React</h1>
      <div id="dashboard" />
    </div>
  )
}

export default App