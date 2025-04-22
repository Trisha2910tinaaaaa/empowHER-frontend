"use client"

import { ProfileView } from "@/components/profile-view"
import { PageHeader } from "@/components/page-header"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default function UserProfilePage({ params }: ProfilePageProps) {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <PageHeader
        heading="User Profile"
        subheading="View user's professional information"
      />
      <ProfileView userId={params.id} isCurrentUser={false} />
    </div>
  )
} 