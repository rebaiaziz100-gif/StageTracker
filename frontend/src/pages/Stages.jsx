import { useEffect, useState } from 'react'
import { getStages, validerStage, supprimerStage } from '../api/stagesApi'
import { useAuth } from '../context/AuthContext'
import { FaTrash } from 'react-icons/fa'
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
  const [validationEnCours, setValidationEnCours] = useState(null)
  const [message, setMessage] = useState(null)

  const [suppressionEnCours, setSuppressionEnCours] = useState(null)
  const [messageSuppression, setMessageSuppression] = useState(null)

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

  if (chargement) {
    return <p>Chargement...</p>
  }

  if (erreur) {
    return <p className="erreur">{erreur}</p>
  }

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
            {stages.map((stage) => (
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
                    <button
                      className="btn btn-danger btn-sm"
                      title="Supprimer"
                      aria-label="Supprimer le stage"
                      onClick={() => handleSupprimer(stage.id)}
                      disabled={suppressionEnCours === stage.id}
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
    </div>
  )
}

export default Stages
