import axiosClient from './axiosClient'

export async function login(email, motDePasse) {
  const response = await axiosClient.post('/auth/login', { email, motDePasse })
  return response.data
}
