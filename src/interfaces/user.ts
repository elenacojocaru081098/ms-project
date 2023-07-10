export interface IPersonalInfo {
  fname: string
  lname: string
  email: string
  pnc: string
  seal?: string
  field: string
  gender: 'M' | 'F'
  birthdate: string
}

export interface IUser {
  id: string
  role: 'Admin' | 'Coordinator' | 'Participant'
  status: 'Pending' | 'Activated' | 'Deleted'
  personal_info: IPersonalInfo
}
