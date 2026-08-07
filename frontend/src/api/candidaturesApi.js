import axiosClient from './axiosClient'

export async function postuler(dateDepot, lettreMotivation, cv, etudiantId, offreId) {
  const response = await axiosClient.post('/candidatures', {
    dateDepot,
    statut: 'EN_ATTENTE',
    lettreMotivation,
    cv,
    etudiantId,
    offreId,
  })
  return response.data
}

export async function getCandidatures() {
  const response = await axiosClient.get('/candidatures')
  return response.data
}

export async function accepterCandidature(id, encadrantId, dateDebut, dateFin, type, sujetPFE) {
  const response = await axiosClient.put(`/candidatures/${id}/accepter`, {
    encadrantId,
    dateDebut,
    dateFin,
    type,
    sujetPFE,
  })
  return response.data
}

export async function refuserCandidature(id, commentaire) {
  const response = await axiosClient.put(`/candidatures/${id}/refuser`, { commentaire })
  return response.data
}

export async function supprimerCandidature(id) {
  const response = await axiosClient.delete(`/candidatures/${id}`)
  return response.data
}
