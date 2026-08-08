import { useEffect, useState } from 'react'
import { getOffres, ajouterOffre, modifierOffre, supprimerOffre } from '../api/offresApi'
import { postuler } from '../api/candidaturesApi'
import { useAuth } from '../context/AuthContext'
import BarreRecherche from '../components/BarreRecherche'
import { FaTrash, FaPen } from 'react-icons/fa'
import './Offres.css'

function Offres() {
  const { utilisateur } = useAuth()

  const [offres, setOffres] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [recherche, setRecherche] = useState('')

  const [offreSelectionnee, setOffreSelectionnee] = useState(null)
  const [lettreMotivation, setLettreMotivation] = useState('')
  const [cv, setCv] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [messageCandidature, setMessageCandidature] = useState(null)

  const [suppressionEnCours, setSuppressionEnCours] = useState(null)
  const [messageSuppression, setMessageSuppression] = useState(null)

  const [modaleFormOuverte, setModaleFormOuverte] = useState(false)
  const [offreEnEdition, setOffreEnEdition] = useState(null)
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [nombrePlaces, setNombrePlaces] = useState('')
  const [statutOffre, setStatutOffre] = useState('OUVERTE')
  const [envoiFormEnCours, setEnvoiFormEnCours] = useState(false)
  const [messageForm, setMessageForm] = useState(null)

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

  function ouvrirFormulaireAjout() {
    setOffreEnEdition(null)
    setTitre('')
    setDescription('')
    setNombrePlaces('')
    setStatutOffre('OUVERTE')
    setMessageForm(null)
    setModaleFormOuverte(true)
  }

  function ouvrirFormulaireEdition(offre) {
    setOffreEnEdition(offre)
    setTitre(offre.titre)
    setDescription(offre.description)
    setNombrePlaces(offre.nombrePlaces)
    setStatutOffre(offre.statut)
    setMessageForm(null)
    setModaleFormOuverte(true)
  }

  function fermerFormulaireOffre() {
    setModaleFormOuverte(false)
  }

  async function handleEnregistrerOffre(e) {
    e.preventDefault()
    setEnvoiFormEnCours(true)
    setMessageForm(null)

    try {
      if (offreEnEdition) {
        await modifierOffre(offreEnEdition.id, titre, description, nombrePlaces, statutOffre)
        setMessageForm({ type: 'succes', texte: 'Offre modifiée avec succès.' })
      } else {
        await ajouterOffre(titre, description, nombrePlaces, statutOffre)
        setMessageForm({ type: 'succes', texte: 'Offre ajoutée avec succès.' })
      }

      setModaleFormOuverte(false)
      await charger()
    } catch (err) {
      console.error('Erreur enregistrement offre:', err)
      const texte = err.response?.data?.message || "Échec de l'enregistrement de l'offre."
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

  const offresFiltrees = offres.filter((offre) =>
    offre.titre.toLowerCase().includes(recherche.toLowerCase()),
  )

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

      {utilisateur?.role === 'ADMIN' && (
        <button className="btn btn-primary offres-bouton-nouvelle" onClick={ouvrirFormulaireAjout}>
          Nouvelle offre
        </button>
      )}

      {(utilisateur?.role === 'ADMIN' || utilisateur?.role === 'ETUDIANT') && (
        <BarreRecherche
          valeur={recherche}
          onChange={setRecherche}
          placeholder="Rechercher par titre..."
        />
      )}

      <div className="offres-grille">
        {offresFiltrees.map((offre) => (
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
              <div className="offre-carte-actions-admin">
                <button
                  className="btn btn-secondary btn-sm"
                  title="Modifier"
                  aria-label="Modifier l'offre"
                  onClick={() => ouvrirFormulaireEdition(offre)}
                >
                  <FaPen size={14} color="currentColor" />
                </button>
                <button
                  className="btn btn-danger btn-sm offre-carte-bouton-supprimer"
                  title="Supprimer"
                  aria-label="Supprimer l'offre"
                  onClick={() => handleSupprimer(offre.id)}
                  disabled={suppressionEnCours === offre.id}
                >
                  <FaTrash size={16} color="currentColor" />
                </button>
              </div>
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

      {modaleFormOuverte && (
        <div className="modale-overlay">
          <div className="modale-contenu">
            <form onSubmit={handleEnregistrerOffre}>
              <h2>{offreEnEdition ? "Modifier l'offre" : 'Nouvelle offre'}</h2>

              {messageForm && (
                <p className={messageForm.type === 'succes' ? 'succes' : 'erreur'}>
                  {messageForm.texte}
                </p>
              )}

              <div className="champ">
                <label htmlFor="titre">Titre</label>
                <input
                  id="titre"
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="descriptionOffre">Description</label>
                <textarea
                  id="descriptionOffre"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="nombrePlaces">Nombre de places</label>
                <input
                  id="nombrePlaces"
                  type="number"
                  min="0"
                  value={nombrePlaces}
                  onChange={(e) => setNombrePlaces(e.target.value)}
                  required
                />
              </div>

              <div className="champ">
                <label htmlFor="statutOffre">Statut</label>
                <select
                  id="statutOffre"
                  value={statutOffre}
                  onChange={(e) => setStatutOffre(e.target.value)}
                >
                  <option value="OUVERTE">Ouverte</option>
                  <option value="FERMEE">Fermée</option>
                </select>
              </div>

              <div className="modale-actions">
                <button type="submit" className="btn btn-primary" disabled={envoiFormEnCours}>
                  {envoiFormEnCours ? 'Envoi...' : 'Enregistrer'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={fermerFormulaireOffre}>
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
