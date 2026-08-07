import { useEffect, useState } from 'react'
import { getOffres, supprimerOffre } from '../api/offresApi'
import { postuler } from '../api/candidaturesApi'
import { useAuth } from '../context/AuthContext'
import './Offres.css'

function Offres() {
  const { utilisateur } = useAuth()

  const [offres, setOffres] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const [offreSelectionnee, setOffreSelectionnee] = useState(null)
  const [lettreMotivation, setLettreMotivation] = useState('')
  const [cv, setCv] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [messageCandidature, setMessageCandidature] = useState(null)

  const [suppressionEnCours, setSuppressionEnCours] = useState(null)
  const [messageSuppression, setMessageSuppression] = useState(null)

  async function charger() {
    try {
      const data = await getOffres()
      setOffres(data)
    } catch (err) {
      console.error('Erreur chargement offres:', err)
      setErreur('Impossible de charger les offres')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  function ouvrirFormulaire(offre) {
    setOffreSelectionnee(offre)
    setLettreMotivation('')
    setCv('')
    setMessageCandidature(null)
  }

  function fermerFormulaire() {
    setOffreSelectionnee(null)
  }

  async function handlePostuler(e) {
    e.preventDefault()
    setEnvoiEnCours(true)
    setMessageCandidature(null)

    try {
      const dateDepot = new Date().toISOString().slice(0, 10)

      await postuler(dateDepot, lettreMotivation, cv, utilisateur.id, offreSelectionnee.id)

      setMessageCandidature({ type: 'succes', texte: 'Candidature envoyée avec succès.' })
    } catch (err) {
      console.error('Erreur candidature:', err)
      const texte = err.response?.data?.message || "Échec de l'envoi de la candidature."
      setMessageCandidature({ type: 'erreur', texte })
    } finally {
      setEnvoiEnCours(false)
      setOffreSelectionnee(null)
    }
  }

  async function handleSupprimer(id) {
    if (!window.confirm('Supprimer cette offre ?')) {
      return
    }

    setSuppressionEnCours(id)
    setMessageSuppression(null)

    try {
      await supprimerOffre(id)

      setMessageSuppression({ type: 'succes', texte: 'Offre supprimée avec succès.' })
      await charger()
    } catch (err) {
      console.error('Erreur suppression offre:', err)
      const texte = err.response?.data?.message || "Échec de la suppression de l'offre."
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
      <h1>Offres de stage</h1>

      {messageCandidature && (
        <p className={messageCandidature.type === 'succes' ? 'succes' : 'erreur'}>
          {messageCandidature.texte}
        </p>
      )}

      {messageSuppression && (
        <p className={messageSuppression.type === 'succes' ? 'succes' : 'erreur'}>
          {messageSuppression.texte}
        </p>
      )}

      <div className="offres-grille">
        {offres.map((offre) => (
          <div className="card offre-carte" key={offre.id}>
            <h2>{offre.titre}</h2>
            <p>{offre.description}</p>
            <p>Places disponibles : {offre.nombrePlaces}</p>

            <span className={`badge ${offre.statut === 'OUVERTE' ? 'badge-success' : 'badge-neutral'}`}>
              {offre.statut}
            </span>

            {utilisateur?.role === 'ETUDIANT' && (
              <button className="btn btn-primary" onClick={() => ouvrirFormulaire(offre)}>
                Postuler
              </button>
            )}

            {utilisateur?.role === 'ADMIN' && (
              <button
                className="btn btn-danger btn-sm"
                title="Supprimer"
                aria-label="Supprimer l'offre"
                onClick={() => handleSupprimer(offre.id)}
                disabled={suppressionEnCours === offre.id}
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {offreSelectionnee && (
        <div className="modale-overlay">
          <div className="modale-contenu">
            <form onSubmit={handlePostuler}>
              <h2>Postuler à : {offreSelectionnee.titre}</h2>

              <div className="champ">
                <label htmlFor="lettreMotivation">Lettre de motivation</label>
                <textarea
                  id="lettreMotivation"
                  value={lettreMotivation}
                  onChange={(e) => setLettreMotivation(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="cv">Nom du fichier CV</label>
                <input
                  id="cv"
                  type="text"
                  value={cv}
                  onChange={(e) => setCv(e.target.value)}
                  required
                />
              </div>

              <div className="modale-actions">
                <button type="submit" className="btn btn-primary" disabled={envoiEnCours}>
                  {envoiEnCours ? 'Envoi...' : 'Envoyer'}
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

export default Offres
