export interface IAnswerRange {
  min: number
  max: number
  unit: string
}

export interface IAnswerOptions {
  options: Array<string>
}

export interface IAnswer {
  id?: string
  question: string // id
  answer: string | number | Array<string>
}

export interface IStudyQuestion {
  id?: string
  text: string
  answer_type: 'range' | 'unique' | 'multiple' | 'text'
  values?: IAnswerRange | IAnswerOptions | null
}

export interface IStudy {
  id: string
  title: string
  details: string
  questions: Array<IStudyQuestion>
}

export interface IUserAnswer {
  study: string // id
  question: string // id
  answer_type: 'range' | 'unique' | 'multiple' | 'text'
  answer: Array<any>
}

export interface IPatient {
  id?: string
  fname: string
  lname: string
  pnc: string
  illness: string
  gender: string
  birthdate: string
}
