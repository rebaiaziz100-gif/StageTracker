import { useEffect, useState } from 'react'
import { getEtudiants, supprimerEtudiant } from '../api/etudiantsApi'
import { getEncadrants, supprimerEncadrant } from '../api/encadrantsApi'
import { useAuth } from '../context/AuthContext'
import { FaTrash } from 'react-icons/fa'
import './Utilisateurs.css'

function Utilisateurs() {
  const { utilisateur } = useAuth()

  const [onglet, setOnglet] = useState('etudiants')

  const [etudiants, setEtudiants] = useState([])
  const [chargementEtudiants, setChargementEtudiants] = useState(true)
  const [erreurEtudiants, setErreurEtudiants] = useState('')
  const [suppressionEtudiantEnCours, setSuppressionEtudiantEnCours] = useState(null)
  const [messageEtudiants, setMessageEtudiants] = useState(null)

  const [encadrants, setEncadrants] = useState([])
  const [chargementEncadrants, setChargementEncadrants] = useState(true)
  const [erreurEncadrants, setErreurEncadrants] = useState('')
  const [suppressionEncadrantEnCours, setSuppressionEncadrantEnCours] = useState(null)
  const [messageEncadrants, setMessageEncadrants] = useState(null)

  async function chargerEtudiants() {
    setChargementEtudiants(true)
    setErreurEtudiants('')

    try {
      const data = await getEtudiants()
      setEtudiants(data)
    } catch (err) {
      console.error('Erreur chargement étudiants:', err)
      setErreurEtudiants('Impossible de charger les étudiants')
    } finally {
      setChargementEtudiants(false)
    }
  }

  async function chargerEncadrants() {
    setChargementEncadrants(true)
    setErreurEncadrants('')

    try {
      const data = await getEncadrants()
      setEncadrants(data)
    } catch (err) {
      console.error('Erreur chargement encadrants:', err)
      setErreurEncadrants('Impossible de charger les encadrants')
    } finally {
      setChargementEncadrants(false)
    }
  }

  useEffect(() => {
    if (utilisateur?.role === 'ADMIN') {
      chargerEtudiants()
      chargerEncadrants()
    }
  }, [utilisateur])

  if (utilisateur?.role !== 'ADMIN') {
    return <p>Accès réservé aux administrateurs</p>
  }

  async function handleSupprimerEtudiant(id) {
    if (!window.confirm('Supprimer cet étudiant ?')) {
      return
    }

    setSuppressionEtudiantEnCours(id)
    setMessageEtudiants(null)

    try {
      await supprimerEtudiant(id)

      setMessageEtudiants({ type: 'succes', texte: 'Étudiant supprimé avec succès.' })
      await chargerEtudiants()
    } catch (err) {
      console.error('Erreur suppression étudiant:', err)
      const texte = err.response?.data?.message || "Échec de la suppression de l'étudiant."
      setMessageEtudiants({ type: 'erreur', texte })
    } finally {
      setSuppressionEtudiantEnCours(null)
    }
  }

  async function handleSupprimerEncadrant(id) {
    if (!window.confirm('Supprimer cet encadrant ?')) {
      return
    }

    setSuppressionEncadrantEnCours(id)
    setMessageEncadrants(null)

    try {
      await supprimerEncadrant(id)

      setMessageEncadrants({ type: 'succes', texte: 'Encadrant supprimé avec succès.' })
      await chargerEncadrants()
    } catch (err) {
      console.error('Erreur suppression encadrant:', err)
      const texte = err.response?.data?.message || "Échec de la suppression de l'encadrant."
      setMessageEncadrants({ type: 'erreur', texte })
    } finally {
      setSuppressionEncadrantEnCours(null)
    }
  }

  return (
    <div>
      <h1 className="utilisateurs-titre">Utilisateurs</h1>

      <div className="utilisateurs-onglets">
        <button
          className={
            onglet === 'etudiants'
              ? 'utilisateurs-onglet utilisateurs-onglet-actif'
              : 'utilisateurs-onglet'
          }
          onClick={() => setOnglet('etudiants')}
        >
          Étudiants
        </button>
        <button
          className={
            onglet === 'encadrants'
              ? 'utilisateurs-onglet utilisateurs-onglet-actif'
              : 'utilisateurs-onglet'
          }
          onClick={() => setOnglet('encadrants')}
        >
          Encadrants
        </button>
      </div>

      {onglet === 'etudiants' && (
        <div>
          {messageEtudiants && (
            <p className={messageEtudiants.type === 'succes' ? 'succes' : 'erreur'}>
              {messageEtudiants.texte}
            </p>
          )}

          {chargementEtudiants ? (
            <p>Chargement...</p>
          ) : erreurEtudiants ? (
            <p className="erreur">{erreurEtudiants}</p>
          ) : (
            <div className="table-conteneur">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Filière</th>
                    <th>Niveau</th>
                    <th>Université</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {etudiants.map((etudiant) => (
                    <tr key={etudiant.userID}>
                      <td>{etudiant.userID}</td>
                      <td>{etudiant.nom}</td>
                      <td>{etudiant.prenom}</td>
                      <td>{etudiant.email}</td>
                      <td>{etudiant.filiere}</td>
                      <td>{etudiant.niveau}</td>
                      <td>{etudiant.universiteNom}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          title="Supprimer"
                          aria-label="Supprimer l'étudiant"
                          onClick={() => handleSupprimerEtudiant(etudiant.userID)}
                          disabled={suppressionEtudiantEnCours === etudiant.userID}
                        >
                          <FaTrash size={16} color="currentColor" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {onglet === 'encadrants' && (
        <div>
          {messageEncadrants && (
            <p className={messageEncadrants.type === 'succes' ? 'succes' : 'erreur'}>
              {messageEncadrants.texte}
            </p>
          )}

          {chargementEncadrants ? (
            <p>Chargement...</p>
          ) : erreurEncadrants ? (
            <p className="erreur">{erreurEncadrants}</p>
          ) : (
            <div className="table-conteneur">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {encadrants.map((encadrant) => (
                    <tr key={encadrant.userID}>
                      <td>{encadrant.userID}</td>
                      <td>{encadrant.nom}</td>
                      <td>{encadrant.prenom}</td>
                      <td>{encadrant.email}</td>
                      <td>
                        <span
                          className={
                            encadrant.type === 'ENTREPRISE' ? 'badge badge-info' : 'badge badge-neutral'
                          }
                        >
                          {encadrant.type}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          title="Supprimer"
                          aria-label="Supprimer l'encadrant"
                          onClick={() => handleSupprimerEncadrant(encadrant.userID)}
                          disabled={suppressionEncadrantEnCours === encadrant.userID}
                        >
                          <FaTrash size={16} color="currentColor" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Utilisateurs
