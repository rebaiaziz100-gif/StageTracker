import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function lireUtilisateurStocke() {
  const utilisateur = localStorage.getItem('utilisateur')
  return utilisateur ? JSON.parse(utilisateur) : null
}

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(lireUtilisateurStocke)

  function connecter(data) {
    const { token, ...infosUtilisateur } = data

    localStorage.setItem('token', token)
    localStorage.setItem('utilisateur', JSON.stringify(infosUtilisateur))

    setUtilisateur(infosUtilisateur)
  }

  function deconnecter() {
    localStorage.removeItem('token')
    localStorage.removeItem('utilisateur')

    setUtilisateur(null)
  }

  return (
    <AuthContext.Provider value={{ utilisateur, connecter, deconnecter }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
