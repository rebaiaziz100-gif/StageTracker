import { useEffect, useState } from 'react'
import {
  getUniversites,
  ajouterUniversite,
  modifierUniversite,
  supprimerUniversite,
} from '../api/universitesApi'
import { useAuth } from '../context/AuthContext'
import BarreRecherche from '../components/BarreRecherche'
import { FaTrash, FaPen } from 'react-icons/fa'
import './Universites.css'

function Universites() {
  const { utilisateur } = useAuth()

  const [universites, setUniversites] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [recherche, setRecherche] = useState('')

  const [modaleOuverte, setModaleOuverte] = useState(false)
  const [universiteEnEdition, setUniversiteEnEdition] = useState(null)
  const [nom, setNom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [message, setMessage] = useState(null)

  const [suppressionEnCours, setSuppressionEnCours] = useState(null)
  const [messageSuppression, setMessageSuppression] = useState(null)

  async function charger() {
    setChargement(true)
    setErreur('')

    try {
      const data = await getUniversites()
      setUniversites(data)
    } catch (err) {
      console.error('Erreur chargement universités:', err)
      setErreur('Impossible de charger les universités')
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

  function ouvrirFormulaireAjout() {
    setUniversiteEnEdition(null)
    setNom('')
    setAdresse('')
    setMessage(null)
    setModaleOuverte(true)
  }

  function ouvrirFormulaireEdition(universite) {
    setUniversiteEnEdition(universite)
    setNom(universite.nom)
    setAdresse(universite.adresse)
    setMessage(null)
    setModaleOuverte(true)
  }

  function fermerFormulaire() {
    setModaleOuverte(false)
  }

  async function handleEnregistrer(e) {
    e.preventDefault()
    setEnvoiEnCours(true)
    setMessage(null)

    try {
      if (universiteEnEdition) {
        await modifierUniversite(universiteEnEdition.id, nom, adresse)
        setMessage({ type: 'succes', texte: 'Université modifiée avec succès.' })
      } else {
        await ajouterUniversite(nom, adresse)
        setMessage({ type: 'succes', texte: 'Université ajoutée avec succès.' })
      }

      setModaleOuverte(false)
      await charger()
    } catch (err) {
      console.error('Erreur enregistrement université:', err)
      const texte = err.response?.data?.message || "Échec de l'enregistrement de l'université."
      setMessage({ type: 'erreur', texte })
    } finally {
      setEnvoiEnCours(false)
    }
  }

  async function handleSupprimer(id) {
    if (!window.confirm('Supprimer cette université ?')) {
      return
    }

    setSuppressionEnCours(id)
    setMessageSuppression(null)

    try {
      await supprimerUniversite(id)

      setMessageSuppression({ type: 'succes', texte: 'Université supprimée avec succès.' })
      await charger()
    } catch (err) {
      console.error('Erreur suppression université:', err)
      const texte = err.response?.data?.message || "Échec de la suppression de l'université."
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

  const universitesFiltrees = universites.filter((universite) =>
    universite.nom.toLowerCase().includes(recherche.toLowerCase()),
  )

  return (
    <div>
      <h1 className="universites-titre">Universités</h1>

      {messageSuppression && (
        <p className={messageSuppression.type === 'succes' ? 'succes' : 'erreur'}>
          {messageSuppression.texte}
        </p>
      )}

      <button className="btn btn-primary universites-bouton-nouvelle" onClick={ouvrirFormulaireAjout}>
        Nouvelle université
      </button>

      <BarreRecherche
        valeur={recherche}
        onChange={setRecherche}
        placeholder="Rechercher par nom..."
      />

      <div className="table-conteneur">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Adresse</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {universitesFiltrees.map((universite) => (
              <tr key={universite.id}>
                <td>{universite.nom}</td>
                <td>{universite.adresse}</td>
                <td className="universite-actions">
                  <div className="universite-actions-gauche">
                    <button
                      className="btn btn-secondary btn-sm"
                      title="Modifier"
                      aria-label="Modifier l'université"
                      onClick={() => ouvrirFormulaireEdition(universite)}
                    >
                      <FaPen size={14} color="currentColor" />
                    </button>
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    title="Supprimer"
                    aria-label="Supprimer l'université"
                    onClick={() => handleSupprimer(universite.id)}
                    disabled={suppressionEnCours === universite.id}
                  >
                    <FaTrash size={16} color="currentColor" />
                  </button>
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
              <h2>{universiteEnEdition ? "Modifier l'université" : 'Nouvelle université'}</h2>

              {message && (
                <p className={message.type === 'succes' ? 'succes' : 'erreur'}>{message.texte}</p>
              )}

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
                <label htmlFor="adresse">Adresse</label>
                <input
                  id="adresse"
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  required
                />
              </div>

              <div className="modale-actions">
                <button type="submit" className="btn btn-primary" disabled={envoiEnCours}>
                  {envoiEnCours ? 'Envoi...' : 'Enregistrer'}
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

export default Universites
