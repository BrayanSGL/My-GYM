import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { getProfile, upsertProfile, uploadAvatar } from '@/lib/api/profile'
import type { Profile } from '@/types/database'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const data = await getProfile(user.id)
    setProfile(data)
    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const saveProfile = async (input: { username: string | null; fullName: string | null }) => {
    if (!user) return
    const updated = await upsertProfile(user.id, { username: input.username, full_name: input.fullName })
    setProfile(updated)
  }

  const saveAvatar = async (file: File) => {
    if (!user) return
    const url = await uploadAvatar(user.id, file)
    const updated = await upsertProfile(user.id, { avatar_url: url })
    setProfile(updated)
  }

  return { profile, loading, saveProfile, saveAvatar, refresh }
}
