"use client"

import { ProfileView } from "@/components/profile-view"
import { PageHeader } from "@/components/page-header"

export default function ProfilePage() {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <PageHeader
        heading="My Profile"
        subheading="View and edit your professional profile"
      />
      <ProfileView isCurrentUser={true} />
    </div>
  )
} 