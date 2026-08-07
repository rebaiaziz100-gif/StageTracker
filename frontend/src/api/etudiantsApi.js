import axiosClient from './axiosClient'

export async function getEtudiants() {
  const response = await axiosClient.get('/etudiants')
  return response.data
}

export async function supprimerEtudiant(id) {
  const response = await axiosClient.delete(`/etudiants/${id}`)
  return response.data
}
