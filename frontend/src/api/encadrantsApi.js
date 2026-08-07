import axiosClient from './axiosClient'

export async function getEncadrants() {
  const response = await axiosClient.get('/encadrants')
  return response.data
}

export async function supprimerEncadrant(id) {
  const response = await axiosClient.delete(`/encadrants/${id}`)
  return response.data
}
