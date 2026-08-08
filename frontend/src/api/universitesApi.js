import axiosClient from './axiosClient'

export async function getUniversites() {
  const response = await axiosClient.get('/universites')
  return response.data
}

export async function ajouterUniversite(nom, adresse) {
  const response = await axiosClient.post('/universites', { nom, adresse })
  return response.data
}

export async function modifierUniversite(id, nom, adresse) {
  const response = await axiosClient.put(`/universites/${id}`, { nom, adresse })
  return response.data
}

export async function supprimerUniversite(id) {
  const response = await axiosClient.delete(`/universites/${id}`)
  return response.data
}
