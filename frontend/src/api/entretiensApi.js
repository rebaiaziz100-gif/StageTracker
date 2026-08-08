import axiosClient from './axiosClient'

export async function getEntretiens() {
  const response = await axiosClient.get('/entretiens')
  return response.data
}

export async function creerEntretien(date, statut, idCond, userID) {
  const response = await axiosClient.post('/entretiens', {
    date,
    statut,
    idCond,
    userID,
  })
  return response.data
}

export async function modifierEntretien(id, date, statut, idCond, userID) {
  const response = await axiosClient.put(`/entretiens/${id}`, {
    date,
    statut,
    idCond,
    userID,
  })
  return response.data
}

export async function supprimerEntretien(id) {
  const response = await axiosClient.delete(`/entretiens/${id}`)
  return response.data
}
