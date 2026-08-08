import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const LIENS = [
  { to: '/', label: 'Tableau de bord', roles: null },
  { to: '/offres', label: 'Offres', roles: null },
  { to: '/candidatures', label: 'Candidatures', roles: ['ADMIN'] },
  { to: '/stages', label: 'Stages', roles: null },
  { to: '/taches', label: 'Tâches', roles: null },
  { to: '/entretiens', label: 'Entretiens', roles: null },
  { to: '/utilisateurs', label: 'Utilisateurs', roles: ['ADMIN'] },
  { to: '/universites', label: 'Universités', roles: ['ADMIN'] },
]

function Sidebar() {
  const { utilisateur } = useAuth()
  const location = useLocation()

  const liensVisibles = LIENS.filter((lien) => !lien.roles || lien.roles.includes(utilisateur?.role))

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {liensVisibles.map((lien) => (
          <Link
            key={lien.to}
            to={lien.to}
            className={
              location.pathname === lien.to ? 'sidebar-lien sidebar-lien-actif' : 'sidebar-lien'
            }
          >
            {lien.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
