import axiosClient from './axiosClient'

export async function getStages() {
  const response = await axiosClient.get('/stages')
  return response.data
}

export async function validerStage(id) {
  const response = await axiosClient.put(`/stages/${id}/valider`)
  return response.data
}

export async function modifierStage(
  id,
  type,
  dateDebut,
  dateFin,
  etat,
  etudiantId,
  encadrantId,
  candidatureId,
  sujetPFE,
  dateSoutenance,
) {
  const response = await axiosClient.put(`/stages/${id}`, {
    type,
    dateDebut,
    dateFin,
    etat,
    etudiantId,
    encadrantId,
    candidatureId,
    sujetPFE,
    dateSoutenance,
  })
  return response.data
}

export async function supprimerStage(id) {
  const response = await axiosClient.delete(`/stages/${id}`)
  return response.data
}
