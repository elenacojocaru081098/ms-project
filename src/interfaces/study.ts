export interface IAnswerRange {
  min: number
  max: number
  unit: string
}

export interface IAnswerOptions {
  options: Array<string>
}

export interface IStudyQuestion {
  text: string
  answer_type: 'range' | 'unique' | 'multiple' | 'text'
  values?: IAnswerRange | IAnswerOptions
}

export interface IStudy {
  id: string
  title: string
  details: string
  questions: Array<IStudyQuestion>
  owner: string
}

export interface IUserAnswer {
  study: string // id
  question: string // id
  answer_type: 'range' | 'unique' | 'multiple' | 'text'
  answer: Array<any>
}
