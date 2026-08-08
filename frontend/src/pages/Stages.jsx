import { useEffect, useState } from 'react'
import { getStages, validerStage, modifierStage, supprimerStage } from '../api/stagesApi'
import { getEtudiants } from '../api/etudiantsApi'
import { getEncadrants } from '../api/encadrantsApi'
import { getCandidatures } from '../api/candidaturesApi'
import { useAuth } from '../context/AuthContext'
import BarreRecherche from '../components/BarreRecherche'
import { FaTrash, FaPen } from 'react-icons/fa'
import './Stages.css'

function classeBadgeEtat(etat) {
  if (etat === 'VALIDE') return 'badge badge-success'
  if (etat === 'TERMINE') return 'badge badge-neutral'
  return 'badge badge-info'
}

function Stages() {
  const { utilisateur } = useAuth()

  const [stages, setStages] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [recherche, setRecherche] = useState('')
  const [validationEnCours, setValidationEnCours] = useState(null)
  const [message, setMessage] = useState(null)

  const [suppressionEnCours, setSuppressionEnCours] = useState(null)
  const [messageSuppression, setMessageSuppression] = useState(null)

  const [modaleOuverte, setModaleOuverte] = useState(false)
  const [stageEnEdition, setStageEnEdition] = useState(null)
  const [type, setType] = useState('ETE')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [etat, setEtat] = useState('EN_COURS')
  const [etudiantId, setEtudiantId] = useState('')
  const [encadrantId, setEncadrantId] = useState('')
  const [candidatureId, setCandidatureId] = useState('')
  const [sujetPFE, setSujetPFE] = useState('')
  const [dateSoutenance, setDateSoutenance] = useState('')
  const [envoiFormEnCours, setEnvoiFormEnCours] = useState(false)
  const [messageForm, setMessageForm] = useState(null)

  const [etudiantsDisponibles, setEtudiantsDisponibles] = useState([])
  const [chargementEtudiants, setChargementEtudiants] = useState(false)
  const [encadrantsDisponibles, setEncadrantsDisponibles] = useState([])
  const [chargementEncadrants, setChargementEncadrants] = useState(false)
  const [candidaturesDisponibles, setCandidaturesDisponibles] = useState([])
  const [chargementCandidatures, setChargementCandidatures] = useState(false)

  async function charger() {
    setChargement(true)
    setErreur('')

    try {
      const data = await getStages()
      setStages(data)
    } catch (err) {
      console.error('Erreur chargement stages:', err)
      setErreur('Impossible de charger les stages')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  async function handleValider(id) {
    setValidationEnCours(id)
    setMessage(null)

    try {
      await validerStage(id)

      setMessage({ type: 'succes', texte: 'Stage validé avec succès.' })
      await charger()
    } catch (err) {
      console.error('Erreur validation stage:', err)
      setMessage({ type: 'erreur', texte: 'Échec de la validation du stage.' })
    } finally {
      setValidationEnCours(null)
    }
  }

  async function handleSupprimer(id) {
    if (!window.confirm('Supprimer ce stage ?')) {
      return
    }

    setSuppressionEnCours(id)
    setMessageSuppression(null)

    try {
      await supprimerStage(id)

      setMessageSuppression({ type: 'succes', texte: 'Stage supprimé avec succès.' })
      await charger()
    } catch (err) {
      console.error('Erreur suppression stage:', err)
      const texte = err.response?.data?.message || 'Échec de la suppression du stage.'
      setMessageSuppression({ type: 'erreur', texte })
    } finally {
      setSuppressionEnCours(null)
    }
  }

  async function ouvrirFormulaireEdition(stage) {
    setStageEnEdition(stage)
    setType(stage.type)
    setDateDebut(stage.dateDebut)
    setDateFin(stage.dateFin)
    setEtat(stage.etat)
    setEtudiantId(stage.etudiantId)
    setEncadrantId(stage.encadrantId)
    setCandidatureId(stage.candidatureId)
    setSujetPFE(stage.sujetPFE || '')
    setDateSoutenance(stage.dateSoutenance || '')
    setMessageForm(null)
    setModaleOuverte(true)

    setChargementEtudiants(true)
    setChargementEncadrants(true)
    setChargementCandidatures(true)
    try {
      const [etudiantsData, encadrantsData, candidaturesData] = await Promise.all([
        getEtudiants(),
        getEncadrants(),
        getCandidatures(),
      ])
      setEtudiantsDisponibles(etudiantsData)
      setEncadrantsDisponibles(encadrantsData)
      setCandidaturesDisponibles(candidaturesData)
    } catch (err) {
      console.error('Erreur chargement étudiants/encadrants/candidatures:', err)
    } finally {
      setChargementEtudiants(false)
      setChargementEncadrants(false)
      setChargementCandidatures(false)
    }
  }

  function fermerFormulaire() {
    setModaleOuverte(false)
  }

  async function handleEnregistrer(e) {
    e.preventDefault()
    setEnvoiFormEnCours(true)
    setMessageForm(null)

    try {
      await modifierStage(
        stageEnEdition.id,
        type,
        dateDebut,
        dateFin,
        etat,
        etudiantId,
        encadrantId,
        candidatureId,
        type === 'PFE' ? sujetPFE : null,
        type === 'PFE' && dateSoutenance ? dateSoutenance : null,
      )

      setMessageForm({ type: 'succes', texte: 'Stage modifié avec succès.' })
      setModaleOuverte(false)
      await charger()
    } catch (err) {
      console.error('Erreur modification stage:', err)
      const texte = err.response?.data?.message || 'Échec de la modification du stage.'
      setMessageForm({ type: 'erreur', texte })
    } finally {
      setEnvoiFormEnCours(false)
    }
  }

  if (chargement) {
    return <p>Chargement...</p>
  }

  if (erreur) {
    return <p className="erreur">{erreur}</p>
  }

  const stagesFiltres = stages.filter((stage) => {
    const cible = recherche.toLowerCase()
    return (
      stage.etudiantNom.toLowerCase().includes(cible) ||
      stage.encadrantNom.toLowerCase().includes(cible)
    )
  })

  return (
    <div>
      <h1 className="stages-titre">Stages</h1>

      {message && (
        <p className={message.type === 'succes' ? 'succes' : 'erreur'}>{message.texte}</p>
      )}

      {messageSuppression && (
        <p className={messageSuppression.type === 'succes' ? 'succes' : 'erreur'}>
          {messageSuppression.texte}
        </p>
      )}

      {utilisateur?.role === 'ADMIN' && (
        <BarreRecherche
          valeur={recherche}
          onChange={setRecherche}
          placeholder="Rechercher par étudiant ou encadrant..."
        />
      )}

      <div className="table-conteneur">
        <table className="table">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Encadrant</th>
              <th>Type</th>
              <th>État</th>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stagesFiltres.map((stage) => (
              <tr key={stage.id}>
                <td>{stage.etudiantNom}</td>
                <td>{stage.encadrantNom}</td>
                <td>{stage.type}</td>
                <td>
                  <span className={classeBadgeEtat(stage.etat)}>{stage.etat}</span>
                </td>
                <td>{stage.dateDebut}</td>
                <td>{stage.dateFin}</td>
                <td className="stage-actions">
                  <div className="stage-actions-gauche">
                    {stage.etat === 'TERMINE' && utilisateur?.role === 'ADMIN' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleValider(stage.id)}
                        disabled={validationEnCours === stage.id}
                      >
                        {validationEnCours === stage.id ? 'Validation...' : 'Valider'}
                      </button>
                    )}
                  </div>

                  {utilisateur?.role === 'ADMIN' && (
                    <div className="stage-actions-droite">
                      <button
                        className="btn btn-secondary btn-sm"
                        title="Modifier"
                        aria-label="Modifier le stage"
                        onClick={() => ouvrirFormulaireEdition(stage)}
                      >
                        <FaPen size={14} color="currentColor" />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        title="Supprimer"
                        aria-label="Supprimer le stage"
                        onClick={() => handleSupprimer(stage.id)}
                        disabled={suppressionEnCours === stage.id}
                      >
                        <FaTrash size={16} color="currentColor" />
                      </button>
                    </div>
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
            <form onSubmit={handleEnregistrer}>
              <h2>Modifier le stage</h2>

              {messageForm && (
                <p className={messageForm.type === 'succes' ? 'succes' : 'erreur'}>
                  {messageForm.texte}
                </p>
              )}

              <div className="champ">
                <label htmlFor="etudiantId">Étudiant</label>
                <select
                  id="etudiantId"
                  value={etudiantId}
                  onChange={(e) => setEtudiantId(e.target.value)}
                  required
                  disabled={chargementEtudiants}
                >
                  <option value="">
                    {chargementEtudiants ? 'Chargement...' : 'Sélectionner un étudiant'}
                  </option>
                  {etudiantsDisponibles.map((etu) => (
                    <option key={etu.userID} value={etu.userID}>
                      {etu.nom} {etu.prenom} ({etu.userID})
                    </option>
                  ))}
                </select>
              </div>

              <div className="champ">
                <label htmlFor="encadrantIdStage">Encadrant</label>
                <select
                  id="encadrantIdStage"
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
                <label htmlFor="candidatureIdStage">Candidature</label>
                <select
                  id="candidatureIdStage"
                  value={candidatureId}
                  onChange={(e) => setCandidatureId(e.target.value)}
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
                <label htmlFor="typeStage">Type de stage</label>
                <select id="typeStage" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="ETE">Été</option>
                  <option value="PFE">PFE</option>
                </select>
              </div>

              {type === 'PFE' && (
                <>
                  <div className="champ">
                    <label htmlFor="sujetPFEStage">Sujet PFE</label>
                    <input
                      id="sujetPFEStage"
                      type="text"
                      value={sujetPFE}
                      onChange={(e) => setSujetPFE(e.target.value)}
                      required
                    />
                  </div>

                  <div className="champ">
                    <label htmlFor="dateSoutenance">Date de soutenance</label>
                    <input
                      id="dateSoutenance"
                      type="date"
                      value={dateSoutenance}
                      onChange={(e) => setDateSoutenance(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="champ">
                <label htmlFor="dateDebutStage">Date de début</label>
                <input
                  id="dateDebutStage"
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="dateFinStage">Date de fin</label>
                <input
                  id="dateFinStage"
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="etatStage">État</label>
                <select id="etatStage" value={etat} onChange={(e) => setEtat(e.target.value)}>
                  <option value="EN_COURS">En cours</option>
                  <option value="TERMINE">Terminé</option>
                  <option value="VALIDE">Validé</option>
                </select>
              </div>

              <div className="modale-actions">
                <button type="submit" className="btn btn-primary" disabled={envoiFormEnCours}>
                  {envoiFormEnCours ? 'Envoi...' : 'Enregistrer'}
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

export default Stages
