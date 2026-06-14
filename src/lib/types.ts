export type ElectionType = 'presidential' | 'governorship' | 'senate' | 'house_of_reps' | 'state_assembly'
export type DataSource = 'bvas' | 'collation_form'
export type VerificationStatus = 'pending' | 'verified' | 'flagged' | 'rejected'
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'
export type UserRole = 'superadmin' | 'admin' | 'monitor' | 'agent'

export interface State {
  id: number
  name: string
  geo_zone: string
}

export interface Party {
  id: string
  name: string
  color: string
}

export interface Result {
  id: string
  polling_unit_id: string
  election_type: ElectionType
  data_source: DataSource
  accredited_voters: number
  total_votes_cast: number
  status: VerificationStatus
  submitted_by: string
  created_at: string
  votes: Record<string, number> // party_id -> count
}

export interface Incident {
  id: string
  state_id: number
  description: string
  severity: SeverityLevel
  status: 'open' | 'resolved'
  created_at: string
}

export interface MediaUpload {
  id: string
  url: string
  type: 'image' | 'video'
  election_type: ElectionType
  created_at: string
}
