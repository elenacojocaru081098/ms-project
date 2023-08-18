/**
 * Exposes functions to fetch form validation rules
 */
export function useValidationRules() {
  function requiredField(val: any, err: string) {
    if (val) return true
    return err
  }

  function pncValidation(value: any) {
    if (value?.length !== 13) return 'CNP trebuie sa aiba 13 caractere'

    const control = '279146358279'.split('')
    const checkSum: number = value.split('').reduce((acc: number, val: string, idx: number) => {
      if (idx === value.length - 1) return acc

      acc += parseInt(val) * parseInt(control[idx])
      return acc
    }, 0)

    const remainder = checkSum % 11
    const lastDigit = parseInt(value.charAt(value.length - 1))
    const validate: boolean = remainder < 10 ? lastDigit === remainder : lastDigit === 1

    return validate ? true : 'CNP invalid'
  }

  function minimumLength(value: string, minLength: number) {
    if (value.length >= minLength) return true
    return `Campul trebuie sa aiba minim ${minLength} caractere`
  }

  /**
   * Register form validation rules
   */
  function getRegisterRules() {
    return {
      fname: [(value: string) => minimumLength(value, 2)],
      lname: [(value: string) => minimumLength(value, 3)],
      email: [
        (value: string) => {
          const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/
          if (pattern.test(value)) return true

          return 'Adresa de email incorecta'
        }
      ],
      pnc: [(value: string) => pncValidation(value)],
      role: [(value: string) => requiredField(value, 'Rolul este camp obligatoriu')]
    }
  }

  /**
   * Login form validation rules
   */
  function getLoginRules() {
    return {
      email: [(value: string) => requiredField(value, 'Emailul este obligatoriu')],
      pass: [(value: string) => requiredField(value, 'Parola este obligatorie')]
    }
  }

  /**
   * Login form validation rules
   */
  function getForgotRules() {
    return getLoginRules().email
  }

  /**
   * Add question form validation rules
   */
  function getAddQuestionRules() {
    return {
      text: [(value: string) => requiredField(value, 'Textul intrebarii este obligatoriu')],
      answer_type: [(value: string) => requiredField(value, 'Tipul de raspuns este obligatoriu')],
      min: [(value: number) => requiredField(value, 'Minimul intervalului este obligatoriu')],
      max: [(value: number) => requiredField(value, 'Maximul intervalului este obligatoriu')]
    }
  }

  /**
   * Patient PNC form validation rules
   */
  function getPNCRules() {
    return {
      pnc: [(value: string) => pncValidation(value)]
    }
  }

  /**
   * Patient form validation rules
   */
  function getPatientRules() {
    return {
      fname: [(value: string) => minimumLength(value, 2)],
      lname: [(value: string) => minimumLength(value, 3)],
      pnc: [(value: string) => pncValidation(value)]
    }
  }

  /**
   * Field validation rules
   */
  function getValidationRules(rulesSet: any, key: string | undefined) {
    if (key) return rulesSet[key as keyof typeof rulesSet]
  }

  return {
    getRegisterRules,
    getLoginRules,
    getForgotRules,
    getAddQuestionRules,
    getPNCRules,
    getPatientRules,
    getValidationRules
  }
}
