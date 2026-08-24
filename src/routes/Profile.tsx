import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthProvider'
import { useProfile } from '@/hooks/useProfile'

export default function Profile() {
  const { user, signOut } = useAuth()
  const { profile, loading, saveProfile, saveAvatar } = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setUsername(profile.username ?? '')
    }
  }, [profile])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSavedMessage(false)
    setSaving(true)
    try {
      await saveProfile({ fullName: fullName.trim() || null, username: username.trim() || null })
      setSavedMessage(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el perfil.')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      await saveAvatar(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la foto.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (loading) {
    return <p className="text-text-muted">Cargando…</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl text-text-primary">Perfil</h1>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="relative rounded-full"
          aria-label="Cambiar foto de perfil"
        >
          <Avatar src={profile?.avatar_url} name={profile?.full_name ?? user?.email} size={72} />
        </button>
        <div className="flex flex-col gap-1">
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? 'Subiendo…' : 'Cambiar foto'}
          </Button>
          <span className="text-xs text-text-muted">{user?.email}</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
        {error && <p className="text-sm text-danger">{error}</p>}
        {savedMessage && <p className="text-sm text-accent-secondary">Perfil actualizado.</p>}
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </form>

      <Button variant="secondary" onClick={() => signOut()}>
        Cerrar sesión
      </Button>
    </div>
  )
}
