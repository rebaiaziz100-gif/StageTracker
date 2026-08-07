import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Topbar.css'

function Topbar() {
  const { utilisateur, deconnecter } = useAuth()
  const navigate = useNavigate()

  function handleDeconnexion() {
    deconnecter()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <span className="topbar-marque">StageTracker</span>

      {utilisateur && (
        <span className="topbar-utilisateur">
          {utilisateur.nom} - {utilisateur.role}
        </span>
      )}
      <button className="btn topbar-deconnexion" onClick={handleDeconnexion}>
        Se déconnecter
      </button>
    </header>
  )
}

export default Topbar
