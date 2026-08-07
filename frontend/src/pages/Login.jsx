import { useState } from 'react'
import { login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const { connecter } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')

    try {
      const data = await login(email, motDePasse)
      connecter(data)
    } catch (err) {
      console.error('Erreur login:', err)
      setErreur('Identifiants invalides')
    }
  }

  return (
    <div className="login-page">
      <form className="card login-carte" onSubmit={handleSubmit}>
        <h1>Connexion</h1>

        <div className="champ">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="champ">
          <label htmlFor="motDePasse">Mot de passe</label>
          <input
            id="motDePasse"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>

        {erreur && <p className="erreur">{erreur}</p>}

        <button type="submit" className="btn btn-primary">
          Se connecter
        </button>
      </form>
    </div>
  )
}

export default Login
