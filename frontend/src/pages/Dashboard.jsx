import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
  const { utilisateur } = useAuth()

  return (
    <div>
      <h1 className="dashboard-titre">Tableau de bord</h1>

      <div className="card dashboard-carte">
        <p>Bienvenue, {utilisateur.nom} !</p>
        <p>Rôle : {utilisateur.role}</p>
      </div>
    </div>
  )
}

export default Dashboard
