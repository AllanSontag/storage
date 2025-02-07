"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Mail, Phone, MapPin, Loader2, Edit2 } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string
  address: string
  avatar_url?: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const { theme } = useTheme()
  const { showToast } = useToast()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) throw error

      if (user) {
        setUserProfile({
          id: user.id,
          full_name: user.user_metadata.full_name || "",
          email: user.email || "",
          phone: user.user_metadata.phone || "",
          address: user.user_metadata.address || "",
          avatar_url: user.user_metadata.avatar_url || null,
        })
        setAvatarUrl(user.user_metadata.avatar_url || null)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      showToast("Failed to load user profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { data, error } = await supabase.auth.updateUser({
        email: userProfile?.email,
        data: {
          full_name: userProfile?.full_name,
          phone: userProfile?.phone,
          address: userProfile?.address,
          avatar_url: avatarUrl,
        },
      })

      if (error) throw error

      showToast("Profile updated successfully", "success")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast("Failed to update profile", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserProfile((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)

      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${userProfile?.id}/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const { data: urlData } = await supabase.storage.from("avatars").getPublicUrl(filePath)

      if (!urlData || !urlData.publicUrl) {
        throw new Error("Failed to get public URL.");
      }

      const newAvatarUrl = urlData.publicUrl;
      setAvatarUrl(newAvatarUrl);
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: newAvatarUrl },
      })

      if (updateError) {
        throw updateError
      }

      // Update the local userProfile state
      setUserProfile((prev) => (prev ? { ...prev, avatar_url: newAvatarUrl } : null))

      showToast("Profile picture updated successfully", "success")
    } catch (error) {
      console.error("Error uploading file:", error)
      showToast("Failed to update profile picture. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#10002B] text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
          className="text-white hover:bg-white/10"
        >
          <Edit2 className="w-6 h-6" />
        </Button>
      </div>

      <form onSubmit={handleSave} className="px-6 space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="w-24 h-24">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={`${userProfile?.full_name}'s avatar`} />
              ) : (
                <AvatarFallback className="bg-[#3C096C] text-white text-2xl">
                  {userProfile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            {isEditing && (
              <Button
                type="button"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-[#3b46f1]"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-1 text-gray-300">
              Name
            </label>
            <Input
              id="full_name"
              name="full_name"
              value={userProfile?.full_name || ""}
              onChange={handleInputChange}
              className="bg-[#3C096C] border-none text-white"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
              Email
            </label>
            <Input
              id="email"
              name="email"
              value={userProfile?.email || ""}
              onChange={handleInputChange}
              className="bg-[#3C096C] border-none text-white"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-300">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              value={userProfile?.phone || ""}
              onChange={handleInputChange}
              className="bg-[#3C096C] border-none text-white"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1 text-gray-300">
              Address
            </label>
            <Input
              id="address"
              name="address"
              value={userProfile?.address || ""}
              onChange={handleInputChange}
              className="bg-[#3C096C] border-none text-white"
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <Button type="submit" className="w-full bg-[#3b46f1] hover:bg-[#3b46f1]/90 text-white" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </form>
    </div>
  )
}

