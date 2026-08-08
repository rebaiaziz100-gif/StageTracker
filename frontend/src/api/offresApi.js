import axiosClient from './axiosClient'

export async function getOffres() {
  const response = await axiosClient.get('/offres')
  return response.data
}

export async function ajouterOffre(titre, description, nombrePlaces, statut) {
  const response = await axiosClient.post('/offres', { titre, description, nombrePlaces, statut })
  return response.data
}

export async function modifierOffre(id, titre, description, nombrePlaces, statut) {
  const response = await axiosClient.put(`/offres/${id}`, { titre, description, nombrePlaces, statut })
  return response.data
}

export async function supprimerOffre(id) {
  const response = await axiosClient.delete(`/offres/${id}`)
  return response.data
}
