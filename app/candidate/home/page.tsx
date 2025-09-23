'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Calendar, Mail, Phone, MapPin, ExternalLink, Upload, Shield, Trash2 } from 'lucide-react'

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
  portfolio_links?: string[]
  certificates?: string[]
  skills: string[]
  notes?: string
  public_feedback?: string
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
          first_name: "Alex",
          last_name: "Johnson",
          email: "alex.johnson@example.com",
          phone: "+1 555-0100",
          location: "San Francisco, CA",
          linkedin_url: "https://linkedin.com/in/alexjohnson",
          role_title: "Senior Frontend Engineer",
          resume_url: "/resume-placeholder.jpg",
          portfolio_links: ["https://alexjohnson.dev", "https://github.com/alexjohnson"],
          certificates: ["AWS Certified Developer", "React Professional Certificate"],
          skills: ["React", "TypeScript", "Next.js", "Accessibility", "Testing"],
          notes: "Strong UI/UX sensibility. Good communication.",
          public_feedback: "Excellent technical skills and great cultural fit. Looking forward to next steps.",
          stage: "Screening",
          timeline: [
            {
              id: "evt_001",
              title: "Technical Interview - Frontend Skills",
              start: "2024-01-15T14:00:00Z",
              end: "2024-01-15T15:30:00Z",
              stakeholders: ["John Smith (Senior Engineer)", "Sarah Wilson (Engineering Manager)"],
              link: "https://meet.google.com/abc-def-ghi"
            }
          ],
          messages: [
            {
              id: "msg_001",
              channel: "email",
              subject: "Welcome to TalentLink!",
              content: "Hi Alex, welcome to our hiring process for the Senior Frontend Engineer position. We're excited to have you as a candidate!",
              createdAt: "2024-01-10T10:00:00Z",
              sentiment: "positive"
            },
            {
              id: "msg_002",
              channel: "sms",
              subject: "Interview Reminder",
              content: "Hi Alex! Just a friendly reminder about your technical interview tomorrow at 2 PM. The meeting link is in your email. Good luck!",
              createdAt: "2024-01-14T16:00:00Z",
              sentiment: "positive"
            },
            {
              id: "msg_003",
              channel: "linkedin",
              subject: "Great to connect!",
              content: "Alex, it was great meeting you during the screening call. Looking forward to the next steps in the process!",
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
    <main className="min-h-dvh bg-gray-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Candidate Portal</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {candidate.first_name}</p>
          </div>
          <a href="/" className="text-sm underline hover:no-underline">
            Home
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Profile Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {candidate.first_name[0]}{candidate.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{candidate.first_name} {candidate.last_name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.role_title}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
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
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Current Stage</span>
                      <Badge variant={candidate.stage === "Offer" ? "default" : "secondary"}>
                        {candidate.stage}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round(getStageProgress(candidate.stage))}%</span>
                      </div>
                      <Progress value={getStageProgress(candidate.stage)} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {new Date(candidate.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Application Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Applied", "Screening", "Interview", "Offer"].map((stage, index) => {
                    const isCompleted = ["Applied", "Screening", "Interview", "Offer"].indexOf(candidate.stage) >= index
                    const isCurrent = candidate.stage === stage
                    
                    return (
                      <div key={stage} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-100 text-green-600' : 
                          isCurrent ? 'bg-blue-100 text-blue-600' : 
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${isCurrent ? 'text-blue-600' : ''}`}>
                            {stage}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {stage === "Applied" && "Application submitted and under review"}
                            {stage === "Screening" && "Initial screening and evaluation"}
                            {stage === "Interview" && "Technical and cultural fit interviews"}
                            {stage === "Offer" && "Final decision and offer preparation"}
                          </p>
                        </div>
                        {isCurrent && (
                          <Badge variant="outline">Current</Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Interview Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.timeline.length > 0 ? (
                  <div className="space-y-4">
                    {candidate.timeline.map((interview) => (
                      <div key={interview.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{interview.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(interview.start).toLocaleDateString()} at{' '}
                              {new Date(interview.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Interviewers: {interview.stakeholders.join(', ')}
                            </p>
                          </div>
                          {interview.link && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={interview.link} target="_blank" rel="noopener noreferrer">
                                Join Meeting
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
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
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Current Resume</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
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
                  <h4 className="font-medium mb-3">Certificates</h4>
                  {candidate.certificates && candidate.certificates.length > 0 ? (
                    <div className="space-y-2">
                      {candidate.certificates.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">{cert}</span>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="certificate-upload"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'certificate')
                        }}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => document.getElementById('certificate-upload')?.click()}
                        disabled={uploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Add Certificates'}
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-3">Portfolio Links</h4>
                  {candidate.portfolio_links && candidate.portfolio_links.length > 0 ? (
                    <div className="space-y-2">
                      {candidate.portfolio_links.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">{link}</span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full">
                      Add Portfolio Links
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Feedback & Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.public_feedback ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Recruiter Feedback</h4>
                      <p className="text-sm text-green-700">{candidate.public_feedback}</p>
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
