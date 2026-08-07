import { useEffect, useState } from 'react'
import { getTaches, ajouterTache } from '../api/tachesApi'
import { useAuth } from '../context/AuthContext'
import './Taches.css'

const ROLES_AUTORISES = ['ADMIN', 'ENCADRANTENTREPRISE', 'ENCADRANTUNIVERSITAIRE']

function classeBadgeStatut(statut) {
  if (statut === 'TERMINEE') return 'badge badge-success'
  if (statut === 'EN_COURS') return 'badge badge-info'
  return 'badge badge-neutral'
}

function Taches() {
  const { utilisateur } = useAuth()

  const [taches, setTaches] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const [modaleOuverte, setModaleOuverte] = useState(false)
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState('A_FAIRE')
  const [stageId, setStageId] = useState('')
  const [encadrantId, setEncadrantId] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [message, setMessage] = useState(null)

  async function charger() {
    setChargement(true)
    setErreur('')

    try {
      const data = await getTaches()
      setTaches(data)
    } catch (err) {
      console.error('Erreur chargement taches:', err)
      setErreur('Impossible de charger les tâches')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  function ouvrirFormulaire() {
    setNom('')
    setDescription('')
    setStatut('A_FAIRE')
    setStageId('')
    setEncadrantId('')
    setMessage(null)
    setModaleOuverte(true)
  }

  function fermerFormulaire() {
    setModaleOuverte(false)
  }

  async function handleAjouter(e) {
    e.preventDefault()
    setEnvoiEnCours(true)
    setMessage(null)

    try {
      await ajouterTache(nom, description, statut, stageId, encadrantId)

      setMessage({ type: 'succes', texte: 'Tâche ajoutée avec succès.' })
      setModaleOuverte(false)
      await charger()
    } catch (err) {
      console.error('Erreur ajout tache:', err)
      setMessage({ type: 'erreur', texte: "Échec de l'ajout de la tâche." })
    } finally {
      setEnvoiEnCours(false)
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
      <h1 className="taches-titre">Tâches</h1>

      {message && (
        <p className={message.type === 'succes' ? 'succes' : 'erreur'}>{message.texte}</p>
      )}

      {utilisateur?.role && ROLES_AUTORISES.includes(utilisateur.role) && (
        <button className="btn btn-primary taches-bouton-nouvelle" onClick={ouvrirFormulaire}>
          Nouvelle tâche
        </button>
      )}

      <div className="table-conteneur">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Statut</th>
              <th>Encadrant</th>
              <th>Stage</th>
            </tr>
          </thead>
          <tbody>
            {taches.map((tache) => (
              <tr key={tache.id}>
                <td>{tache.nom}</td>
                <td>{tache.description}</td>
                <td>
                  <span className={classeBadgeStatut(tache.statut)}>{tache.statut}</span>
                </td>
                <td>{tache.encadrantNom}</td>
                <td>{tache.stageId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modaleOuverte && (
        <div className="modale-overlay">
          <div className="modale-contenu">
            <form onSubmit={handleAjouter}>
              <h2>Nouvelle tâche</h2>

              <div className="champ">
                <label htmlFor="nom">Nom</label>
                <input
                  id="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="statut">Statut</label>
                <select id="statut" value={statut} onChange={(e) => setStatut(e.target.value)}>
                  <option value="A_FAIRE">À faire</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="TERMINEE">Terminée</option>
                </select>
              </div>

              <div className="champ">
                <label htmlFor="stageId">Stage (ID)</label>
                <input
                  id="stageId"
                  type="number"
                  value={stageId}
                  onChange={(e) => setStageId(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="encadrantId">Encadrant (ID)</label>
                <input
                  id="encadrantId"
                  type="number"
                  value={encadrantId}
                  onChange={(e) => setEncadrantId(e.target.value)}
                  required
                />
              </div>

              <div className="modale-actions">
                <button type="submit" className="btn btn-primary" disabled={envoiEnCours}>
                  {envoiEnCours ? 'Envoi...' : 'Ajouter'}
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

export default Taches
