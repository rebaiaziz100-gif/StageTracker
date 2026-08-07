import axiosClient from './axiosClient'

export async function getTaches() {
  const response = await axiosClient.get('/taches')
  return response.data
}

export async function ajouterTache(nom, description, statut, stageId, encadrantId) {
  const response = await axiosClient.post('/taches', {
    nom,
    description,
    statut,
    stageId,
    encadrantId,
  })
  return response.data
}

export async function supprimerTache(id) {
  const response = await axiosClient.delete(`/taches/${id}`)
  return response.data
}
