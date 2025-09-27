'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Mail, Phone, MapPin, ExternalLink, Upload, Shield, Trash2, Edit, Save, X, PieChart as PieChartIcon, Plus, Link } from 'lucide-react'
import Image from 'next/image'

interface Candidate {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  location?: string
  linkedin_url?: string
  role_title: string
  resume_url?: string
  resume_name?: string
  portfolio_links?: string[]
  certificates?: string[]
  skills: string[]
  notes?: string
  public_feedback?: any[]
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Reject"
  timeline: any[]
  messages: any[]
  gdpr_consent: boolean
  data_retention_consent: boolean
  createdAt: string
  updatedAt: string
}

export default function CandidateHome() {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [privacyAction, setPrivacyAction] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<Candidate>>({})
  const [saving, setSaving] = useState(false)
  const [newPortfolioLink, setNewPortfolioLink] = useState('')
  const [showAddPortfolio, setShowAddPortfolio] = useState(false)
  const [newCertificate, setNewCertificate] = useState('')
  const [showAddCertificate, setShowAddCertificate] = useState(false)
  const [resumeName, setResumeName] = useState('')
  const [isRenamingResume, setIsRenamingResume] = useState(false)
  const [showConsentUpdate, setShowConsentUpdate] = useState(false)

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        // In a real app, you'd get the candidate ID from authentication/session
        const candidateId = "cand_001"
        const response = await fetch(`/api/candidate/profile?id=${candidateId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch candidate data')
        }
        
        const candidateData = await response.json()
        setCandidate(candidateData)
      } catch (error) {
        console.error('Error fetching candidate data:', error)
        // Fallback to mock data if API fails
        const mockCandidate: Candidate = {
          id: "cand_001",
          first_name: "Akash",
          last_name: "Pandit",
          email: "akash.pandit@example.com",
          phone: "+1 555-0100",
          location: "San Francisco, CA",
          linkedin_url: "https://linkedin.com/in/akashpandit",
          role_title: "Senior Frontend Engineer",
          resume_url: "/resume-placeholder.jpg",
          resume_name: "Akash_Pandit_Resume_2024.pdf",
          portfolio_links: ["https://akashpandit.dev", "https://github.com/akashpandit"],
          certificates: ["AWS Certified Developer", "React Professional Certificate"],
          skills: ["React", "TypeScript", "Next.js", "Accessibility", "Testing"],
          notes: "Strong UI/UX sensibility. Good communication.",
          public_feedback: [
            {
              id: "feedback_001",
              interviewer: "Sarah Wilson (Engineering Manager)",
              date: "2024-01-15",
              stage: "Technical Interview",
              feedback: "Excellent technical skills and great cultural fit. Akash demonstrated strong problem-solving abilities and showed deep understanding of React and TypeScript. Looking forward to next steps.",
              rating: 4.5
            },
            {
              id: "feedback_002", 
              interviewer: "Michael Chen (Principal Engineer)",
              date: "2024-01-18",
              stage: "System Design",
              feedback: "Impressive system design approach. Akash showed excellent understanding of scalability concepts and provided thoughtful solutions for database optimization. Strong architectural thinking.",
              rating: 4.8
            },
            {
              id: "feedback_003",
              interviewer: "Emma Thompson (HR Manager)", 
              date: "2024-01-20",
              stage: "Cultural Fit",
              feedback: "Great team player with excellent communication skills. Akash's values align well with our company culture and he showed genuine enthusiasm for the role and our mission.",
              rating: 4.7
            }
          ],
          stage: "Screening",
          timeline: [
            {
              id: "evt_001",
              title: "Technical Interview - Frontend Skills",
              start: "2024-01-15T14:00:00Z",
              end: "2024-01-15T15:30:00Z",
              stakeholders: ["John Smith (Senior Engineer)", "Sarah Wilson (Engineering Manager)"],
              link: "https://meet.google.com/abc-def-ghi"
            },
            {
              id: "evt_002",
              title: "System Design Interview",
              start: "2024-01-18T10:00:00Z",
              end: "2024-01-18T11:30:00Z",
              stakeholders: ["Michael Chen (Principal Engineer)", "Lisa Rodriguez (Tech Lead)"],
              link: "https://meet.google.com/def-ghi-jkl"
            },
            {
              id: "evt_003",
              title: "Cultural Fit Interview",
              start: "2024-01-20T15:00:00Z",
              end: "2024-01-20T16:00:00Z",
              stakeholders: ["Emma Thompson (HR Manager)", "David Park (Team Lead)"],
              link: "https://meet.google.com/ghi-jkl-mno"
            },
            {
              id: "evt_004",
              title: "Final Round - Leadership Interview",
              start: "2024-01-22T11:00:00Z",
              end: "2024-01-22T12:00:00Z",
              stakeholders: ["Robert Smith (VP Engineering)", "Amanda Lee (Director of Product)"],
              link: "https://meet.google.com/jkl-mno-pqr"
            }
          ],
          messages: [
            {
              id: "msg_001",
              channel: "email",
              subject: "Welcome to TalentLink!",
              content: "Hi Akash, welcome to our hiring process for the Senior Frontend Engineer position. We're excited to have you as a candidate!",
              createdAt: "2024-01-10T10:00:00Z",
              sentiment: "positive"
            },
            {
              id: "msg_002",
              channel: "sms",
              subject: "Interview Reminder",
              content: "Hi Akash! Just a friendly reminder about your technical interview tomorrow at 2 PM. The meeting link is in your email. Good luck!",
              createdAt: "2024-01-14T16:00:00Z",
              sentiment: "positive"
            },
            {
              id: "msg_003",
              channel: "linkedin",
              subject: "Great to connect!",
              content: "Akash, it was great meeting you during the screening call. Looking forward to the next steps in the process!",
              createdAt: "2024-01-12T14:30:00Z",
              sentiment: "positive"
            }
          ],
          gdpr_consent: true,
          data_retention_consent: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z"
        }
        setCandidate(mockCandidate)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidateData()
  }, [])

  const getStageProgress = (stage: string) => {
    const stages = ["Applied", "Screening", "Interview", "Offer"]
    const currentIndex = stages.indexOf(stage)
    return ((currentIndex + 1) / stages.length) * 100
  }

  const handleFileUpload = async (file: File, type: string) => {
    if (!candidate) return
    
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      const response = await fetch(`/api/candidate/documents?id=${candidate.id}`, {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        // Refresh candidate data
        const updatedResponse = await fetch(`/api/candidate/profile?id=${candidate.id}`)
        if (updatedResponse.ok) {
          const updatedCandidate = await updatedResponse.json()
          setCandidate(updatedCandidate)
        }
        alert(`${type} uploaded successfully!`)
      } else {
        alert('Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleAddPortfolioLink = async () => {
    if (!candidate || !newPortfolioLink.trim()) return
    
    try {
      const updatedLinks = [...(candidate.portfolio_links || []), newPortfolioLink.trim()]
      
      const response = await fetch(`/api/candidate/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: candidate.id,
          portfolio_links: updatedLinks
        })
      })
      
      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidate(updatedCandidate)
        setNewPortfolioLink('')
        setShowAddPortfolio(false)
        alert('Portfolio link added successfully!')
      } else {
        alert('Failed to add portfolio link. Please try again.')
      }
    } catch (error) {
      console.error('Add portfolio link error:', error)
      alert('Failed to add portfolio link. Please try again.')
    }
  }

  const handleRemovePortfolioLink = async (indexToRemove: number) => {
    if (!candidate) return
    
    try {
      const updatedLinks = candidate.portfolio_links?.filter((_, index) => index !== indexToRemove) || []
      
      const response = await fetch(`/api/candidate/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: candidate.id,
          portfolio_links: updatedLinks
        })
      })
      
      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidate(updatedCandidate)
        alert('Portfolio link removed successfully!')
      } else {
        alert('Failed to remove portfolio link. Please try again.')
      }
    } catch (error) {
      console.error('Remove portfolio link error:', error)
      alert('Failed to remove portfolio link. Please try again.')
    }
  }

  const handleAddCertificate = async () => {
    if (!candidate || !newCertificate.trim()) return
    
    try {
      const updatedCertificates = [...(candidate.certificates || []), newCertificate.trim()]
      
      const response = await fetch(`/api/candidate/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: candidate.id,
          certificates: updatedCertificates
        })
      })
      
      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidate(updatedCandidate)
        setNewCertificate('')
        setShowAddCertificate(false)
        alert('Certificate added successfully!')
      } else {
        alert('Failed to add certificate. Please try again.')
      }
    } catch (error) {
      console.error('Add certificate error:', error)
      alert('Failed to add certificate. Please try again.')
    }
  }

  const handleRemoveCertificate = async (indexToRemove: number) => {
    if (!candidate) return
    
    try {
      const updatedCertificates = candidate.certificates?.filter((_, index) => index !== indexToRemove) || []
      
      const response = await fetch(`/api/candidate/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: candidate.id,
          certificates: updatedCertificates
        })
      })
      
      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidate(updatedCandidate)
        alert('Certificate removed successfully!')
      } else {
        alert('Failed to remove certificate. Please try again.')
      }
    } catch (error) {
      console.error('Remove certificate error:', error)
      alert('Failed to remove certificate. Please try again.')
    }
  }

  const handleRenameResume = async () => {
    if (!candidate || !resumeName.trim()) return
    
    try {
      const response = await fetch(`/api/candidate/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: candidate.id,
          resume_name: resumeName.trim()
        })
      })
      
      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidate(updatedCandidate)
        setIsRenamingResume(false)
        setResumeName('')
        alert('Resume renamed successfully!')
      } else {
        alert('Failed to rename resume. Please try again.')
      }
    } catch (error) {
      console.error('Rename resume error:', error)
      alert('Failed to rename resume. Please try again.')
    }
  }

  const handleConsentUpdate = async (consentType: string, value: boolean) => {
    if (!candidate) return
    
    try {
      const response = await fetch(`/api/candidate/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: candidate.id,
          [consentType]: value
        })
      })
      
      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidate(updatedCandidate)
        setShowConsentUpdate(false)
        alert(`Consent ${value ? 'granted' : 'revoked'} successfully!`)
      } else {
        alert('Failed to update consent. Please try again.')
      }
    } catch (error) {
      console.error('Consent update error:', error)
      alert('Failed to update consent. Please try again.')
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
    setEditedProfile({
      first_name: candidate?.first_name || '',
      last_name: candidate?.last_name || '',
      email: candidate?.email || '',
      phone: candidate?.phone || '',
      location: candidate?.location || '',
      linkedin_url: candidate?.linkedin_url || '',
      skills: candidate?.skills || []
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedProfile({})
  }

  const handleSaveProfile = async () => {
    if (!candidate) return
    
    setSaving(true)
    try {
      const response = await fetch(`/api/candidate/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: candidate.id,
          ...editedProfile 
        })
      })
      
      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidate(updatedCandidate)
        setIsEditing(false)
        setEditedProfile({})
        alert('Profile updated successfully!')
      } else {
        alert('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSkillsChange = (skillsText: string) => {
    const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
    setEditedProfile(prev => ({ ...prev, skills: skillsArray }))
  }

  const handlePrivacyAction = async (action: string) => {
    if (!candidate) return
    
    setPrivacyAction(action)
    try {
      const response = await fetch('/api/candidate/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, candidateId: candidate.id })
      })
      
      if (response.ok) {
        const result = await response.json()
        
        if (action === 'download_data') {
          // Create and download file
          const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `candidate-data-${candidate.id}.json`
          a.click()
          URL.revokeObjectURL(url)
          alert('Data export downloaded successfully!')
        } else if (action === 'request_deletion') {
          alert(result.message)
        }
      } else {
        alert('Action failed. Please try again.')
      }
    } catch (error) {
      console.error('Privacy action error:', error)
      alert('Action failed. Please try again.')
    } finally {
      setPrivacyAction(null)
    }
  }

  const PieChart = ({ stage }: { stage: string }) => {
    const stages = ["Applied", "Screening", "Interview", "Offer"]
    const currentIndex = stages.indexOf(stage)
    const progress = ((currentIndex + 1) / stages.length) * 100
    
    // Calculate stroke-dasharray for the progress circle
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`
    
    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
            <div className="text-xs text-muted-foreground">{stage}</div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading your portal...</p>
        </div>
      </main>
    )
  }

  if (!candidate) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Unable to load candidate data</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-700 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/tallogo.png"
              alt="TalentLink Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-semibold text-white">Candidate Portal</h1>
              <p className="text-sm text-blue-100">Welcome back, {candidate.first_name}</p>
            </div>
          </div>
          <a href="/" className="text-sm text-white underline hover:no-underline hover:text-blue-200">
            Home
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-emerald-800">
                    Profile Overview
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={handleEditProfile}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {(isEditing ? editedProfile.first_name : candidate.first_name)?.[0]}
                        {(isEditing ? editedProfile.last_name : candidate.last_name)?.[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      {!isEditing ? (
                        <>
                          <h3 className="font-semibold">{candidate.first_name} {candidate.last_name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.role_title}</p>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="first_name" className="text-xs">First Name</Label>
                            <Input
                              id="first_name"
                              value={editedProfile.first_name || ''}
                              onChange={(e) => setEditedProfile(prev => ({ ...prev, first_name: e.target.value }))}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label htmlFor="last_name" className="text-xs">Last Name</Label>
                            <Input
                              id="last_name"
                              value={editedProfile.last_name || ''}
                              onChange={(e) => setEditedProfile(prev => ({ ...prev, last_name: e.target.value }))}
                              className="h-8"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {!isEditing ? (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{candidate.email}</span>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{candidate.phone}</span>
                          </div>
                        )}
                        {candidate.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{candidate.location}</span>
                          </div>
                        )}
                        {candidate.linkedin_url && (
                          <div className="flex items-center gap-2 text-sm">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="email" className="text-sm">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedProfile.email || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-sm">Phone</Label>
                          <Input
                            id="phone"
                            value={editedProfile.phone || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location" className="text-sm">Location</Label>
                          <Input
                            id="location"
                            value={editedProfile.location || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin" className="text-sm">LinkedIn URL</Label>
                          <Input
                            id="linkedin"
                            value={editedProfile.linkedin_url || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, linkedin_url: e.target.value }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    {!isEditing ? (
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="skills" className="text-sm">Skills (comma-separated)</Label>
                        <Textarea
                          id="skills"
                          value={editedProfile.skills?.join(', ') || ''}
                          onChange={(e) => handleSkillsChange(e.target.value)}
                          placeholder="React, TypeScript, Next.js, etc."
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <PieChartIcon className="w-5 h-5" />
                    Application Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Current Stage</span>
                      <Badge variant={candidate.stage === "Offer" ? "default" : "secondary"}>
                        {candidate.stage}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-center">
                      <PieChart stage={candidate.stage} />
                    </div>
                    
                    <div className="text-sm text-muted-foreground text-center">
                      Last updated: {new Date(candidate.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
            </div>
            
            <div className="space-y-3">
              {!isEditing ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{candidate.email}</span>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                  {candidate.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{candidate.location}</span>
                    </div>
                  )}
                  {candidate.linkedin_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm">Phone</Label>
                    <Input
                      id="phone"
                      value={editedProfile.phone || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-sm">Location</Label>
                    <Input
                      id="location"
                      value={editedProfile.location || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin" className="text-sm">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={editedProfile.linkedin_url || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">Skills</h4>
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              ) : (
                <div>
                  <Label htmlFor="skills" className="text-sm">Skills (comma-separated)</Label>
                  <Textarea
                    id="skills"
                    value={editedProfile.skills?.join(', ') || ''}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    placeholder="React, TypeScript, Next.js, etc."
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <PieChartIcon className="w-5 h-5" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Stage</span>
                <Badge variant={candidate.stage === "Offer" ? "default" : "secondary"}>
                  {candidate.stage}
                </Badge>
              </div>
              
              <div className="flex justify-center">
                <PieChart stage={candidate.stage} />
              </div>
              
              <div className="text-sm text-muted-foreground text-center">
                Last updated: {new Date(candidate.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

    <TabsContent value="status">
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-amber-800">Application Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Stages */}
            <div className="space-y-4">
              {[
                { 
                  stage: "Applied", 
                  description: "Application submitted and under review",
                  date: "2024-01-01",
                  rounds: ["Application Review", "Resume Screening"]
                },
                { 
                  stage: "Screening", 
                  description: "Initial screening and evaluation",
                  date: "2024-01-08",
                  rounds: ["Phone Screening", "Technical Assessment", "Portfolio Review"]
                },
                { 
                  stage: "Interview", 
                  description: "Technical and cultural fit interviews",
                  date: "2024-01-15",
                  rounds: ["Round 1: Technical Interview", "Round 2: System Design", "Round 3: Cultural Fit", "Round 4: Leadership Interview"]
                },
                { 
                  stage: "Offer", 
                  description: "Final decision and offer preparation",
                  date: null,
                  rounds: ["Reference Check", "Final Review", "Offer Preparation"]
                }
              ].map((stageInfo, index) => {
                const isCompleted = ["Applied", "Screening", "Interview", "Offer"].indexOf(candidate.stage) >= index
                const isCurrent = candidate.stage === stageInfo.stage
                
                return (
                  <div key={stageInfo.stage} className="relative">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : 
                        isCurrent ? 'bg-blue-100 text-blue-600' : 
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${isCurrent ? 'text-blue-600' : ''}`}>
                            {stageInfo.stage}
                          </h4>
                          {isCurrent && (
                            <Badge variant="outline">Current</Badge>
                          )}
                          {stageInfo.date && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(stageInfo.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {stageInfo.description}
                        </p>
                        
                        {/* Rounds/Sub-stages */}
                        <div className="ml-4 space-y-1">
                          {stageInfo.rounds.map((round, roundIndex) => {
                            const roundCompleted = isCompleted || (isCurrent && roundIndex < 2)
                            return (
                              <div key={roundIndex} className="flex items-center gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${
                                  roundCompleted ? 'bg-green-500' : 
                                  isCurrent && roundIndex === 2 ? 'bg-blue-500' : 
                                  'bg-gray-300'
                                }`} />
                                <span className={`${
                                  roundCompleted ? 'text-green-700' : 
                                  isCurrent && roundIndex === 2 ? 'text-blue-600 font-medium' : 
                                  'text-muted-foreground'
                                }`}>
                                  {round}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Connector line */}
                    {index < 3 && (
                      <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-200" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="interviews">
      <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-800">Interview Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {candidate.timeline.length > 0 ? (
            <div className="space-y-4">
              {candidate.timeline.map((interview, index) => {
                const isPast = new Date(interview.end) < new Date()
                const isToday = new Date(interview.start).toDateString() === new Date().toDateString()
                const isUpcoming = new Date(interview.start) > new Date()
                
                return (
                  <div key={interview.id} className="p-4 border rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-rose-800">{interview.title}</h4>
                        <p className="text-sm text-rose-600">
                          {new Date(interview.start).toLocaleDateString()} at {new Date(interview.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      <Badge variant={isPast ? "default" : isToday ? "destructive" : "secondary"}>
                        {isPast ? "Completed" : isToday ? "Today" : "Upcoming"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-rose-700">Interviewers:</span>
                        <p className="text-sm text-rose-600">{interview.stakeholders.join(", ")}</p>
                      </div>
                      
                      {interview.link && (
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-rose-500" />
                          <a href={interview.link} target="_blank" rel="noopener noreferrer" 
                             className="text-sm text-rose-600 hover:underline">
                            Join Meeting
                          </a>
                        </div>
                      )}
                      
                      {isUpcoming && (
                        <div className="mt-3 p-3 bg-rose-100 rounded-md">
                          <h5 className="text-sm font-medium text-rose-800 mb-1">Preparation Tips:</h5>
                          <ul className="text-xs text-rose-700 space-y-1">
                            <li>• Review the job description and your application</li>
                            <li>• Prepare examples of your work and achievements</li>
                            <li>• Research the company and interviewers</li>
                            <li>• Test your video/audio setup beforehand</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No interviews scheduled yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                You'll see your interview schedule here once it's available
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="messages">
      <Card className="bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-cyan-800">Messages Center</CardTitle>
        </CardHeader>
        <CardContent>
          {candidate.messages.length > 0 ? (
            <div className="space-y-4">
              {candidate.messages.map((message, index) => {
                      const isPast = new Date(interview.start) < new Date()
                      const isToday = new Date(interview.start).toDateString() === new Date().toDateString()
                      const isUpcoming = new Date(interview.start) > new Date()
                      
                      return (
                        <div key={interview.id} className={`border rounded-lg p-4 ${
                          isPast ? 'bg-gray-50 border-gray-200' : 
                          isToday ? 'bg-blue-50 border-blue-200' : 
                          'bg-white border-gray-200'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{interview.title}</h4>
                                {isPast && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    Completed
                                  </Badge>
                                )}
                                {isToday && (
                                  <Badge variant="default" className="bg-blue-100 text-blue-700">
                                    Today
                                  </Badge>
                                )}
                                {isUpcoming && !isToday && (
                                  <Badge variant="outline">
                                    Upcoming
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(interview.start).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                                <p className="flex items-center gap-2">
                                  <span className="w-4 h-4 flex items-center justify-center">🕐</span>
                                  {new Date(interview.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                  {new Date(interview.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  ({Math.round((new Date(interview.end).getTime() - new Date(interview.start).getTime()) / (1000 * 60))} minutes)
                                </p>
                                <p>
                                  <strong>Interviewers:</strong> {interview.stakeholders.join(', ')}
                                </p>
                                
                                {/* Interview Details */}
                                <div className="mt-3 p-3 bg-white rounded border text-xs">
                                  {index === 0 && (
                                    <div>
                                      <p className="font-medium mb-1">What to expect:</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        <li>Technical coding challenges (JavaScript/React)</li>
                                        <li>Discussion of past projects and experience</li>
                                        <li>Problem-solving approach and methodology</li>
                                      </ul>
                                    </div>
                                  )}
                                  {index === 1 && (
                                    <div>
                                      <p className="font-medium mb-1">What to expect:</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        <li>System architecture and scalability questions</li>
                                        <li>Database design and optimization</li>
                                        <li>API design and microservices discussion</li>
                                      </ul>
                                    </div>
                                  )}
                                  {index === 2 && (
                                    <div>
                                      <p className="font-medium mb-1">What to expect:</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        <li>Team collaboration and communication style</li>
                                        <li>Company values and culture alignment</li>
                                        <li>Career goals and growth aspirations</li>
                                      </ul>
                                    </div>
                                  )}
                                  {index === 3 && (
                                    <div>
                                      <p className="font-medium mb-1">What to expect:</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        <li>Leadership philosophy and approach</li>
                                        <li>Strategic thinking and vision discussion</li>
                                        <li>Questions about the role and company direction</li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              {interview.link && !isPast && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={interview.link} target="_blank" rel="noopener noreferrer">
                                    Join Meeting
                                  </a>
                                </Button>
                              )}
                              {isPast && (
                                <Button variant="ghost" size="sm" disabled>
                                  Completed
                                </Button>
                              )}
                              {isUpcoming && (
                                <Button variant="outline" size="sm">
                                  Add to Calendar
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Interview Preparation Tips */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Interview Preparation Tips</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Test your camera and microphone before the interview</li>
                        <li>• Prepare questions about the role and company</li>
                        <li>• Have examples ready of your past work and achievements</li>
                        <li>• Join the meeting 5 minutes early</li>
                        <li>• Ensure you have a quiet, well-lit space</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No interviews scheduled yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Messages Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.messages.length > 0 ? (
                  <div className="space-y-4">
                    {candidate.messages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{message.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              via {message.channel} • {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={message.sentiment === 'positive' ? 'default' : 'secondary'}>
                            {message.channel}
                          </Badge>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Documents & Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Resume</h4>
                  {candidate.resume_url ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          {!isRenamingResume ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{candidate.resume_name || 'Current Resume'}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setIsRenamingResume(true)
                                  setResumeName(candidate.resume_name || '')
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Input
                                value={resumeName}
                                onChange={(e) => setResumeName(e.target.value)}
                                placeholder="Enter resume name"
                                className="flex-1"
                              />
                              <Button size="sm" onClick={handleRenameResume}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setIsRenamingResume(false)
                                  setResumeName('')
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                          <input
                            type="file"
                            id="resume-update"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(file, 'resume')
                            }}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('resume-update')?.click()}
                            disabled={uploading}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Update'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="resume-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'resume')
                        }}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => document.getElementById('resume-upload')?.click()}
                        disabled={uploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Resume'}
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Certificates</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddCertificate(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Certificate
                    </Button>
                  </div>
                  
                  {showAddCertificate && (
                    <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter certificate name (e.g., AWS Certified Developer)"
                          value={newCertificate}
                          onChange={(e) => setNewCertificate(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          onClick={handleAddCertificate}
                          disabled={!newCertificate.trim()}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setShowAddCertificate(false)
                            setNewCertificate('')
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {candidate.certificates && candidate.certificates.length > 0 ? (
                    <div className="space-y-2">
                      {candidate.certificates.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">{cert}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveCertificate(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No certificates added yet
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Portfolio Links</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddPortfolio(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  
                  {showAddPortfolio && (
                    <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter portfolio URL (e.g., https://yourportfolio.com)"
                          value={newPortfolioLink}
                          onChange={(e) => setNewPortfolioLink(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          onClick={handleAddPortfolioLink}
                          disabled={!newPortfolioLink.trim()}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setShowAddPortfolio(false)
                            setNewPortfolioLink('')
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {candidate.portfolio_links && candidate.portfolio_links.length > 0 ? (
                    <div className="space-y-2">
                      {candidate.portfolio_links.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Link className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm truncate">{link}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemovePortfolioLink(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No portfolio links added yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Feedback & Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.public_feedback && candidate.public_feedback.length > 0 ? (
                  <div className="space-y-4">
                    {candidate.public_feedback.map((feedback: any, index: number) => {
                      const colors = [
                        'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
                        'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200', 
                        'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'
                      ]
                      const textColors = [
                        'text-green-800',
                        'text-blue-800',
                        'text-orange-800'
                      ]
                      return (
                        <div key={feedback.id} className={`p-4 rounded-lg border ${colors[index % 3]}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className={`font-medium ${textColors[index % 3]} mb-1`}>
                                {feedback.stage} - {feedback.interviewer}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {new Date(feedback.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm font-medium">{feedback.rating}/5</span>
                            </div>
                          </div>
                          <p className={`text-sm ${textColors[index % 3]}`}>{feedback.feedback}</p>
                        </div>
                      )
                    })}
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                      <h4 className="font-medium text-indigo-800 mb-2">Overall Performance</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-indigo-600">
                          {(candidate.public_feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / candidate.public_feedback.length).toFixed(1)}/5
                        </div>
                        <div className="text-sm text-indigo-700">
                          Average rating across {candidate.public_feedback.length} interviews
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No feedback available yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Feedback will appear here after interviews and evaluations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Consent Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">GDPR Consent</h4>
                      <p className="text-sm text-muted-foreground">
                        Permission to process your personal data for recruitment purposes
                      </p>
                    </div>
                    <Badge variant={candidate.gdpr_consent ? "default" : "destructive"}>
                      {candidate.gdpr_consent ? "Granted" : "Not Granted"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Data Retention Consent</h4>
                      <p className="text-sm text-muted-foreground">
                        Permission to retain your data for future opportunities
                      </p>
                    </div>
                    <Badge variant={candidate.data_retention_consent ? "default" : "destructive"}>
                      {candidate.data_retention_consent ? "Granted" : "Not Granted"}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Data Management</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handlePrivacyAction('download_data')}
                      disabled={privacyAction === 'download_data'}
                    >
                      {privacyAction === 'download_data' ? 'Preparing Download...' : 'Download My Data'}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Update Consent Preferences
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={() => {
                        if (confirm('Are you sure you want to request data deletion? This action cannot be undone.')) {
                          handlePrivacyAction('request_deletion')
                        }
                      }}
                      disabled={privacyAction === 'request_deletion'}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {privacyAction === 'request_deletion' ? 'Processing...' : 'Request Data Deletion'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
