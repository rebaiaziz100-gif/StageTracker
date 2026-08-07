import axiosClient from './axiosClient'

export async function getOffres() {
  const response = await axiosClient.get('/offres')
  return response.data
}

export async function supprimerOffre(id) {
  const response = await axiosClient.delete(`/offres/${id}`)
  return response.data
}
