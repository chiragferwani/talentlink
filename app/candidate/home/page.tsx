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
        const candidateId = "cand_001"
        const response = await fetch(`/api/candidate/profile?id=${candidateId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch candidate data')
        }
        
        const candidateData = await response.json()
        // Add feedback data if not present in API response
        if (!candidateData.public_feedback || !Array.isArray(candidateData.public_feedback)) {
          candidateData.public_feedback = [
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
            },
            {
              id: "feedback_004",
              interviewer: "Robert Smith (VP Engineering)",
              date: "2024-01-22",
              stage: "Leadership Interview",
              feedback: "Outstanding leadership potential and strategic thinking. Akash demonstrated excellent problem-solving skills and showed great initiative in proposing innovative solutions. Strong candidate for senior role.",
              rating: 4.9
            },
            {
              id: "feedback_005",
              interviewer: "Lisa Rodriguez (Tech Lead)",
              date: "2024-01-16",
              stage: "Code Review",
              feedback: "Clean, well-structured code with excellent documentation. Akash follows best practices and shows attention to detail. Code quality is impressive and maintainable.",
              rating: 4.6
            },
            {
              id: "feedback_006",
              interviewer: "David Park (Team Lead)",
              date: "2024-01-19",
              stage: "Behavioral Interview",
              feedback: "Excellent communication and collaboration skills. Akash handled challenging scenarios well and demonstrated strong emotional intelligence. Would be a great addition to any team.",
              rating: 4.4
            },
            {
              id: "feedback_007",
              interviewer: "Amanda Lee (Director of Product)",
              date: "2024-01-23",
              stage: "Product Thinking",
              feedback: "Strong product sense and user-focused mindset. Akash asked insightful questions about user experience and showed understanding of business requirements. Great cross-functional collaboration potential.",
              rating: 4.8
            }
          ]
        }
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
            },
            {
              id: "feedback_004",
              interviewer: "Robert Smith (VP Engineering)",
              date: "2024-01-22",
              stage: "Leadership Interview",
              feedback: "Outstanding leadership potential and strategic thinking. Akash demonstrated excellent problem-solving skills and showed great initiative in proposing innovative solutions. Strong candidate for senior role.",
              rating: 4.9
            },
            {
              id: "feedback_005",
              interviewer: "Lisa Rodriguez (Tech Lead)",
              date: "2024-01-16",
              stage: "Code Review",
              feedback: "Clean, well-structured code with excellent documentation. Akash follows best practices and shows attention to detail. Code quality is impressive and maintainable.",
              rating: 4.6
            },
            {
              id: "feedback_006",
              interviewer: "David Park (Team Lead)",
              date: "2024-01-19",
              stage: "Behavioral Interview",
              feedback: "Excellent communication and collaboration skills. Akash handled challenging scenarios well and demonstrated strong emotional intelligence. Would be a great addition to any team.",
              rating: 4.4
            },
            {
              id: "feedback_007",
              interviewer: "Amanda Lee (Director of Product)",
              date: "2024-01-23",
              stage: "Product Thinking",
              feedback: "Strong product sense and user-focused mindset. Akash asked insightful questions about user experience and showed understanding of business requirements. Great cross-functional collaboration potential.",
              rating: 4.8
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

  // Pie Chart Component
  const PieChart = ({ stage }: { stage: string }) => {
    const stageProgress = {
      "Applied": 25,
      "Screening": 50,
      "Interview": 75,
      "Offer": 100,
      "Reject": 0
    }
    
    const progress = stageProgress[stage as keyof typeof stageProgress] || 0
    const circumference = 2 * Math.PI * 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (progress / 100) * circumference
    
    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{progress}%</div>
            <div className="text-xs text-muted-foreground">{stage}</div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading your profile...</p>
        </div>
      </main>
    )
  }

  if (!candidate) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                  <CardTitle className="text-emerald-800">Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-emerald-600">
                        {candidate.first_name[0]}{candidate.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-800">
                        {candidate.first_name} {candidate.last_name}
                      </h3>
                      <p className="text-emerald-600">{candidate.role_title}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      <span>{candidate.email}</span>
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
                    {candidate.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>{candidate.location}</span>
                      </div>
                    )}
                    {candidate.linkedin_url && (
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="w-4 h-4 text-emerald-500" />
                        <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" 
                           className="text-emerald-600 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-emerald-800">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700">{skill}</Badge>
                      ))}
                    </div>
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
                      const channelColors = {
                        email: 'bg-blue-50 border-blue-200 text-blue-800',
                        sms: 'bg-green-50 border-green-200 text-green-800',
                        linkedin: 'bg-purple-50 border-purple-200 text-purple-800',
                        whatsapp: 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }
                      
                      return (
                        <div key={message.id} className={`p-4 border rounded-lg ${channelColors[message.channel as keyof typeof channelColors] || 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {message.channel.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge variant={message.sentiment === 'positive' ? 'default' : 'secondary'}>
                              {message.sentiment}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium mb-2">{message.subject}</h4>
                          <p className="text-sm text-muted-foreground">{message.content}</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Messages from recruiters will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-teal-800">Document Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-teal-800">Resume</h4>
                  {candidate.resume_url ? (
                    <div className="flex items-center justify-between p-3 border border-teal-200 rounded-lg bg-teal-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-teal-800">{candidate.resume_name || 'Resume.pdf'}</p>
                          <p className="text-xs text-teal-600">Uploaded resume</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-teal-700 border-teal-300">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="text-teal-700 border-teal-300">
                          <Upload className="w-4 h-4 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-teal-200 rounded-lg">
                      <Upload className="w-8 h-8 mx-auto text-teal-400 mb-2" />
                      <p className="text-sm text-teal-600">No resume uploaded</p>
                      <Button size="sm" className="mt-2 bg-teal-600 hover:bg-teal-700">
                        Upload Resume
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-teal-800">Certificates</h4>
                  {candidate.certificates && candidate.certificates.length > 0 ? (
                    <div className="space-y-2">
                      {candidate.certificates.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-teal-200 rounded-lg bg-teal-50">
                          <span className="text-teal-800">{cert}</span>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" className="w-full text-teal-700 border-teal-300">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Certificate
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-teal-600 text-sm">
                      No certificates added yet
                      <Button size="sm" variant="outline" className="ml-2 text-teal-700 border-teal-300">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Certificate
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-teal-800">Portfolio Links</h4>
                  {candidate.portfolio_links && candidate.portfolio_links.length > 0 ? (
                    <div className="space-y-2">
                      {candidate.portfolio_links.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-teal-200 rounded-lg bg-teal-50">
                          <a href={link} target="_blank" rel="noopener noreferrer" 
                             className="text-teal-600 hover:underline flex items-center gap-2">
                            <Link className="w-4 h-4" />
                            {link}
                          </a>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" className="w-full text-teal-700 border-teal-300">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Portfolio Link
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-teal-600 text-sm">
                      No portfolio links added yet
                      <Button size="sm" variant="outline" className="ml-2 text-teal-700 border-teal-300">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Portfolio Link
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-800">Feedback & Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.public_feedback && Array.isArray(candidate.public_feedback) && candidate.public_feedback.length > 0 ? (
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
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-800">
                  <Shield className="w-5 h-5" />
                  Privacy & Consent Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border border-violet-200 rounded-lg bg-violet-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-violet-800">GDPR Data Processing Consent</h4>
                        <p className="text-sm text-violet-600 mt-1">
                          Consent to process your personal data for recruitment purposes
                        </p>
                      </div>
                      <Badge variant={candidate.gdpr_consent ? "default" : "destructive"}>
                        {candidate.gdpr_consent ? "Granted" : "Revoked"}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant={candidate.gdpr_consent ? "outline" : "default"}
                        onClick={() => handleConsentUpdate('gdpr_consent', true)}
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        Grant Consent
                      </Button>
                      <Button 
                        size="sm" 
                        variant={!candidate.gdpr_consent ? "outline" : "destructive"}
                        onClick={() => handleConsentUpdate('gdpr_consent', false)}
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        Revoke Consent
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-violet-200 rounded-lg bg-violet-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-violet-800">Data Retention Consent</h4>
                        <p className="text-sm text-violet-600 mt-1">
                          Consent to retain your data for future opportunities
                        </p>
                      </div>
                      <Badge variant={candidate.data_retention_consent ? "default" : "destructive"}>
                        {candidate.data_retention_consent ? "Granted" : "Revoked"}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant={candidate.data_retention_consent ? "outline" : "default"}
                        onClick={() => handleConsentUpdate('data_retention_consent', true)}
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        Grant Consent
                      </Button>
                      <Button 
                        size="sm" 
                        variant={!candidate.data_retention_consent ? "outline" : "destructive"}
                        onClick={() => handleConsentUpdate('data_retention_consent', false)}
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        Revoke Consent
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 text-violet-800">Data Rights</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button variant="outline" className="justify-start">
                      <Upload className="w-4 h-4 mr-2" />
                      Download My Data
                    </Button>
                    <Button variant="outline" className="justify-start text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Request Data Deletion
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
                  <p className="mb-2">
                    <strong>Your Rights:</strong> You have the right to access, rectify, erase, restrict processing, 
                    object to processing, and data portability regarding your personal data.
                  </p>
                  <p>
                    For questions about data processing, contact our Data Protection Officer at privacy@talentlink.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
