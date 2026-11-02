
import { useState } from 'react'
import {
  CreditCard,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from 'lucide-react'

import { supabase } from '../../lib/supabase'

export default function Auth() {
  const [isRegistering, setIsRegistering] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')
    setLoading(true)

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        })

        if (error) throw error

        if (data.session) {
          setSuccessMessage('¡Cuenta creada correctamente!')
        } else {
          setSuccessMessage(
            '¡Registro exitoso! Revisá tu correo para confirmar tu cuenta.'
          )
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Ocurrió un error inesperado.')
      }
    } finally {
      setLoading(false)
    }
  }

  function changeMode() {
    setIsRegistering(!isRegistering)
    setErrorMessage('')
    setSuccessMessage('')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B12] px-4 py-10 text-white">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/20">
            <CreditCard size={28} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Fin<span className="text-violet-400">Track</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Personal Finance
          </p>
        </div>

        {/* FORMULARIO */}
        <div className="rounded-2xl border border-white/10 bg-[#11111B] p-7 shadow-2xl">

          <div className="mb-7">
            <h2 className="text-2xl font-bold">
              {isRegistering ? 'Crear cuenta' : 'Bienvenido'}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {isRegistering
                ? 'Comenzá a organizar tus finanzas.'
                : 'Ingresá a tu cuenta para continuar.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NOMBRE */}
            {isRegistering && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Nombre
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B0B12] px-4">
                  <User size={18} className="text-gray-500" />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>
            )}

            {/* CORREO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Correo electrónico
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B0B12] px-4">
                <Mail size={18} className="text-gray-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Contraseña
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B0B12] px-4">
                <Lock size={18} className="text-gray-500" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 transition hover:text-white"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* MENSAJES */}
            {errorMessage && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                {successMessage}
              </div>
            )}

            {/* BOTÓN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Procesando...'
                : isRegistering
                  ? 'Crear cuenta'
                  : 'Iniciar sesión'}
            </button>

          </form>

          {/* CAMBIAR MODO */}
          <div className="mt-7 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-gray-400">
              {isRegistering
                ? '¿Ya tenés una cuenta?'
                : '¿Todavía no tenés cuenta?'}
            </p>

            <button
              onClick={changeMode}
              className="mt-2 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
            >
              {isRegistering
                ? 'Iniciar sesión'
                : 'Registrate gratis'}
            </button>
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Tus finanzas, organizadas en un solo lugar.
        </p>

      </div>
    </div>
  )
}
