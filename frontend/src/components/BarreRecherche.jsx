import { FaSearch } from 'react-icons/fa'
import './BarreRecherche.css'

function BarreRecherche({ valeur, onChange, placeholder = 'Rechercher...' }) {
  return (
    <div className="barre-recherche">
      <FaSearch className="barre-recherche-icone" size={14} />
      <input
        type="text"
        className="barre-recherche-input"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default BarreRecherche
