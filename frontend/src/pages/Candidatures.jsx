import { useEffect, useState, Fragment } from 'react'
import {
  getCandidatures,
  accepterCandidature,
  refuserCandidature,
  supprimerCandidature,
} from '../api/candidaturesApi'
import { getEncadrants } from '../api/encadrantsApi'
import { useAuth } from '../context/AuthContext'
import BarreRecherche from '../components/BarreRecherche'
import { FaTrash } from 'react-icons/fa'
import './Candidatures.css'

function classeBadgeStatut(statut) {
  if (statut === 'ACCEPTEE') return 'badge badge-success'
  if (statut === 'REFUSEE') return 'badge badge-danger'
  return 'badge badge-warning'
}

function Candidatures() {
  const { utilisateur } = useAuth()

  const [candidatures, setCandidatures] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [recherche, setRecherche] = useState('')

  const [candidatureSelectionnee, setCandidatureSelectionnee] = useState(null)
  const [encadrantId, setEncadrantId] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [type, setType] = useState('ETE')
  const [sujetPFE, setSujetPFE] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [messageAcceptation, setMessageAcceptation] = useState(null)

  const [encadrantsDisponibles, setEncadrantsDisponibles] = useState([])
  const [chargementEncadrants, setChargementEncadrants] = useState(false)

  const [candidatureARefuser, setCandidatureARefuser] = useState(null)
  const [commentaireRefus, setCommentaireRefus] = useState('')
  const [refusEnCours, setRefusEnCours] = useState(false)
  const [messageRefus, setMessageRefus] = useState(null)

  const [commentairesOuverts, setCommentairesOuverts] = useState(new Set())

  const [suppressionEnCours, setSuppressionEnCours] = useState(null)
  const [messageSuppression, setMessageSuppression] = useState(null)

  function toggleCommentaire(id) {
    setCommentairesOuverts((precedent) => {
      const suivant = new Set(precedent)
      if (suivant.has(id)) {
        suivant.delete(id)
      } else {
        suivant.add(id)
      }
      return suivant
    })
  }

  async function charger() {
    setChargement(true)
    setErreur('')

    try {
      const data = await getCandidatures()
      setCandidatures(data)
    } catch (err) {
      console.error('Erreur chargement candidatures:', err)
      setErreur('Impossible de charger les candidatures')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    if (utilisateur?.role === 'ADMIN') {
      charger()
    }
  }, [utilisateur])

  if (utilisateur?.role !== 'ADMIN') {
    return <p>Accès réservé aux administrateurs</p>
  }

  async function ouvrirFormulaire(candidature) {
    setCandidatureSelectionnee(candidature)
    setEncadrantId('')
    setDateDebut('')
    setDateFin('')
    setType('ETE')
    setSujetPFE('')
    setMessageAcceptation(null)

    setChargementEncadrants(true)
    try {
      const data = await getEncadrants()
      setEncadrantsDisponibles(data)
    } catch (err) {
      console.error('Erreur chargement encadrants:', err)
    } finally {
      setChargementEncadrants(false)
    }
  }

  function fermerFormulaire() {
    setCandidatureSelectionnee(null)
  }

  async function handleAccepter(e) {
    e.preventDefault()
    setEnvoiEnCours(true)
    setMessageAcceptation(null)

    try {
      await accepterCandidature(
        candidatureSelectionnee.id,
        encadrantId,
        dateDebut,
        dateFin,
        type,
        sujetPFE,
      )

      setMessageAcceptation({ type: 'succes', texte: 'Candidature acceptée avec succès.' })
      setCandidatureSelectionnee(null)
      await charger()
    } catch (err) {
      console.error('Erreur acceptation candidature:', err)
      setMessageAcceptation({ type: 'erreur', texte: "Échec de l'acceptation de la candidature." })
    } finally {
      setEnvoiEnCours(false)
    }
  }

  function ouvrirFormulaireRefus(candidature) {
    setCandidatureARefuser(candidature)
    setCommentaireRefus('')
    setMessageRefus(null)
  }

  function fermerFormulaireRefus() {
    setCandidatureARefuser(null)
  }

  async function handleRefuser(e) {
    e.preventDefault()
    setRefusEnCours(true)
    setMessageRefus(null)

    try {
      await refuserCandidature(candidatureARefuser.id, commentaireRefus)

      setMessageRefus({ type: 'succes', texte: 'Candidature refusée.' })
      setCandidatureARefuser(null)
      await charger()
    } catch (err) {
      console.error('Erreur refus candidature:', err)
      setMessageRefus({ type: 'erreur', texte: "Échec du refus de la candidature." })
    } finally {
      setRefusEnCours(false)
    }
  }

  async function handleSupprimer(id) {
    if (!window.confirm('Supprimer cette candidature ?')) {
      return
    }

    setSuppressionEnCours(id)
    setMessageSuppression(null)

    try {
      await supprimerCandidature(id)

      setMessageSuppression({ type: 'succes', texte: 'Candidature supprimée avec succès.' })
      await charger()
    } catch (err) {
      console.error('Erreur suppression candidature:', err)
      const texte = err.response?.data?.message || 'Échec de la suppression de la candidature.'
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

  const candidaturesFiltrees = candidatures.filter((candidature) =>
    candidature.etudiantNom.toLowerCase().includes(recherche.toLowerCase()),
  )

  return (
    <div>
      <h1 className="candidatures-titre">Candidatures</h1>

      {messageAcceptation && (
        <p className={messageAcceptation.type === 'succes' ? 'succes' : 'erreur'}>
          {messageAcceptation.texte}
        </p>
      )}

      {messageRefus && (
        <p className={messageRefus.type === 'succes' ? 'succes' : 'erreur'}>
          {messageRefus.texte}
        </p>
      )}

      {messageSuppression && (
        <p className={messageSuppression.type === 'succes' ? 'succes' : 'erreur'}>
          {messageSuppression.texte}
        </p>
      )}

      <BarreRecherche
        valeur={recherche}
        onChange={setRecherche}
        placeholder="Rechercher par nom d'étudiant..."
      />

      <div className="table-conteneur">
        <table className="table">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Offre</th>
              <th>Statut</th>
              <th>Date de dépôt</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {candidaturesFiltrees.map((candidature) => {
              const aUnCommentaire =
                candidature.commentaire && candidature.commentaire.trim() !== ''
              const commentaireOuvert = commentairesOuverts.has(candidature.id)

              return (
                <Fragment key={candidature.id}>
                  <tr>
                    <td>{candidature.etudiantNom}</td>
                    <td>{candidature.offreTitre}</td>
                    <td>
                      <span className={classeBadgeStatut(candidature.statut)}>
                        {candidature.statut}
                      </span>
                    </td>
                    <td>{candidature.dateDepot}</td>
                    <td className="candidature-actions">
                      <div className="candidature-actions-gauche">
                        {candidature.statut === 'EN_ATTENTE' && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => ouvrirFormulaire(candidature)}
                            >
                              Accepter
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => ouvrirFormulaireRefus(candidature)}
                            >
                              Refuser
                            </button>
                          </>
                        )}

                        {candidature.statut !== 'EN_ATTENTE' &&
                          (aUnCommentaire ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => toggleCommentaire(candidature.id)}
                            >
                              {commentaireOuvert ? 'Masquer' : 'Voir le commentaire'}
                            </button>
                          ) : (
                            <span className="candidature-aucun-commentaire">Aucun commentaire</span>
                          ))}
                      </div>

                      {utilisateur?.role === 'ADMIN' && (
                        <button
                          className="btn btn-danger btn-sm"
                          title="Supprimer"
                          aria-label="Supprimer la candidature"
                          onClick={() => handleSupprimer(candidature.id)}
                          disabled={suppressionEnCours === candidature.id}
                        >
                          <FaTrash size={16} color="currentColor" />
                        </button>
                      )}
                    </td>
                  </tr>

                  {candidature.statut !== 'EN_ATTENTE' && aUnCommentaire && commentaireOuvert && (
                    <tr className="ligne-commentaire">
                      <td colSpan={5}>{candidature.commentaire}</td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {candidatureSelectionnee && (
        <div className="modale-overlay">
          <div className="modale-contenu">
            <form onSubmit={handleAccepter}>
              <h2>Accepter la candidature de {candidatureSelectionnee.etudiantNom}</h2>

              <div className="champ">
                <label htmlFor="encadrantId">Encadrant</label>
                <select
                  id="encadrantId"
                  value={encadrantId}
                  onChange={(e) => setEncadrantId(e.target.value)}
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

              <div className="champ">
                <label htmlFor="dateDebut">Date de début</label>
                <input
                  id="dateDebut"
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="dateFin">Date de fin</label>
                <input
                  id="dateFin"
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="type">Type de stage</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="ETE">Été</option>
                  <option value="PFE">PFE</option>
                </select>
              </div>

              {type === 'PFE' && (
                <div className="champ">
                  <label htmlFor="sujetPFE">Sujet PFE</label>
                  <input
                    id="sujetPFE"
                    type="text"
                    value={sujetPFE}
                    onChange={(e) => setSujetPFE(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="modale-actions">
                <button type="submit" className="btn btn-primary" disabled={envoiEnCours}>
                  {envoiEnCours ? 'Envoi...' : 'Confirmer'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={fermerFormulaire}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {candidatureARefuser && (
        <div className="modale-overlay">
          <div className="modale-contenu">
            <form onSubmit={handleRefuser}>
              <h2>Refuser la candidature de {candidatureARefuser.etudiantNom}</h2>

              <div className="champ">
                <label htmlFor="commentaireRefus">Commentaire (optionnel)</label>
                <textarea
                  id="commentaireRefus"
                  value={commentaireRefus}
                  onChange={(e) => setCommentaireRefus(e.target.value)}
                />
              </div>

              <div className="modale-actions">
                <button type="submit" className="btn btn-danger" disabled={refusEnCours}>
                  {refusEnCours ? 'Envoi...' : 'Refuser'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={fermerFormulaireRefus}>
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

export default Candidatures
