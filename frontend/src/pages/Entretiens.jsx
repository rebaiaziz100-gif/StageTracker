import { useEffect, useState } from 'react'
import { getEntretiens, creerEntretien, supprimerEntretien } from '../api/entretiensApi'
import { getCandidatures } from '../api/candidaturesApi'
import { getEncadrants } from '../api/encadrantsApi'
import { useAuth } from '../context/AuthContext'
import { FaTrash } from 'react-icons/fa'
import './Entretiens.css'

const ROLES_NOUVEL_ENTRETIEN = ['ADMIN', 'ENCADRANTENTREPRISE', 'ENCADRANTUNIVERSITAIRE']

function classeBadgeStatut(statut) {
  if (statut === 'REALISE') return 'badge badge-success'
  if (statut === 'ANNULE') return 'badge badge-neutral'
  return 'badge badge-info'
}

function Entretiens() {
  const { utilisateur } = useAuth()

  const [entretiens, setEntretiens] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const [modaleOuverte, setModaleOuverte] = useState(false)
  const [date, setDate] = useState('')
  const [statut, setStatut] = useState('PLANIFIE')
  const [idCond, setIdCond] = useState('')
  const [userID, setUserID] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [message, setMessage] = useState(null)

  const [suppressionEnCours, setSuppressionEnCours] = useState(null)
  const [messageSuppression, setMessageSuppression] = useState(null)

  const [candidaturesDisponibles, setCandidaturesDisponibles] = useState([])
  const [chargementCandidatures, setChargementCandidatures] = useState(false)
  const [encadrantsDisponibles, setEncadrantsDisponibles] = useState([])
  const [chargementEncadrants, setChargementEncadrants] = useState(false)

  async function charger() {
    setChargement(true)
    setErreur('')

    try {
      const data = await getEntretiens()
      setEntretiens(data)
    } catch (err) {
      console.error('Erreur chargement entretiens:', err)
      setErreur('Impossible de charger les entretiens')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  async function ouvrirFormulaire() {
    setDate('')
    setStatut('PLANIFIE')
    setIdCond('')
    setUserID('')
    setMessage(null)
    setModaleOuverte(true)

    setChargementCandidatures(true)
    setChargementEncadrants(true)
    try {
      const [candidaturesData, encadrantsData] = await Promise.all([
        getCandidatures(),
        getEncadrants(),
      ])
      setCandidaturesDisponibles(candidaturesData)
      setEncadrantsDisponibles(encadrantsData)
    } catch (err) {
      console.error('Erreur chargement candidatures/encadrants:', err)
    } finally {
      setChargementCandidatures(false)
      setChargementEncadrants(false)
    }
  }

  function fermerFormulaire() {
    setModaleOuverte(false)
  }

  async function handleCreer(e) {
    e.preventDefault()
    setEnvoiEnCours(true)
    setMessage(null)

    try {
      await creerEntretien(date, statut, idCond, userID)

      setMessage({ type: 'succes', texte: 'Entretien créé avec succès.' })
      setModaleOuverte(false)
      await charger()
    } catch (err) {
      console.error('Erreur création entretien:', err)
      const texte = err.response?.data?.message || "Échec de la création de l'entretien."
      setMessage({ type: 'erreur', texte })
    } finally {
      setEnvoiEnCours(false)
    }
  }

  async function handleSupprimer(id) {
    if (!window.confirm('Supprimer cet entretien ?')) {
      return
    }

    setSuppressionEnCours(id)
    setMessageSuppression(null)

    try {
      await supprimerEntretien(id)

      setMessageSuppression({ type: 'succes', texte: 'Entretien supprimé avec succès.' })
      await charger()
    } catch (err) {
      console.error('Erreur suppression entretien:', err)
      const texte = err.response?.data?.message || "Échec de la suppression de l'entretien."
      setMessageSuppression({ type: 'erreur', texte })
    } finally {
      setSuppressionEnCours(null)
    }
  }

  if (chargement) {
    return <p>Chargement...</p>
  }

  if (erreur) {
    return <p className="erreur">{erreur}</p>
  }

  return (
    <div>
      <h1 className="entretiens-titre">Entretiens</h1>

      {message && (
        <p className={message.type === 'succes' ? 'succes' : 'erreur'}>{message.texte}</p>
      )}

      {messageSuppression && (
        <p className={messageSuppression.type === 'succes' ? 'succes' : 'erreur'}>
          {messageSuppression.texte}
        </p>
      )}

      {utilisateur?.role && ROLES_NOUVEL_ENTRETIEN.includes(utilisateur.role) && (
        <button className="btn btn-primary entretiens-bouton-nouveau" onClick={ouvrirFormulaire}>
          Nouvel entretien
        </button>
      )}

      <div className="table-conteneur">
        <table className="table">
          <thead>
            <tr>
              <th>Candidature</th>
              <th>Encadrant</th>
              <th>Date</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entretiens.map((entretien) => (
              <tr key={entretien.id}>
                <td>#{entretien.candidatureId}</td>
                <td>{entretien.encadrantNom}</td>
                <td>{entretien.date}</td>
                <td>
                  <span className={classeBadgeStatut(entretien.statut)}>{entretien.statut}</span>
                </td>
                <td className="entretien-actions">
                  <div className="entretien-actions-gauche"></div>

                  {utilisateur?.role === 'ADMIN' && (
                    <button
                      className="btn btn-danger btn-sm"
                      title="Supprimer"
                      aria-label="Supprimer l'entretien"
                      onClick={() => handleSupprimer(entretien.id)}
                      disabled={suppressionEnCours === entretien.id}
                    >
                      <FaTrash size={16} color="currentColor" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modaleOuverte && (
        <div className="modale-overlay">
          <div className="modale-contenu">
            <form onSubmit={handleCreer}>
              <h2>Nouvel entretien</h2>

              <div className="champ">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="statut">Statut</label>
                <select id="statut" value={statut} onChange={(e) => setStatut(e.target.value)}>
                  <option value="PLANIFIE">Planifié</option>
                  <option value="REALISE">Réalisé</option>
                  <option value="ANNULE">Annulé</option>
                </select>
              </div>

              <div className="champ">
                <label htmlFor="idCond">Candidature</label>
                <select
                  id="idCond"
                  value={idCond}
                  onChange={(e) => setIdCond(e.target.value)}
                  required
                  disabled={chargementCandidatures}
                >
                  <option value="">
                    {chargementCandidatures ? 'Chargement...' : 'Sélectionner une candidature'}
                  </option>
                  {candidaturesDisponibles.map((candidature) => (
                    <option key={candidature.id} value={candidature.id}>
                      {candidature.etudiantNom} {candidature.etudiantPrenom} ({candidature.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="champ">
                <label htmlFor="userID">Encadrant</label>
                <select
                  id="userID"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                  required
                  disabled={chargementEncadrants}
                >
                  <option value="">
                    {chargementEncadrants ? 'Chargement...' : 'Sélectionner un encadrant'}
                  </option>
                  {encadrantsDisponibles.map((encadrant) => (
                    <option key={encadrant.userID} value={encadrant.userID}>
                      {encadrant.nom} {encadrant.prenom} ({encadrant.userID})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modale-actions">
                <button type="submit" className="btn btn-primary" disabled={envoiEnCours}>
                  {envoiEnCours ? 'Envoi...' : 'Créer'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={fermerFormulaire}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Entretiens
