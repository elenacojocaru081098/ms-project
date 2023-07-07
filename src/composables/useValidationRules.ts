/**
 * Exposes functions to fetch form validation rules
 */
export function useValidationRules() {
  /**
   * Register form validation rules
   */
  function getRegisterRules() {
    return {
      fname: [
        (value: string) => {
          if (value?.length > 1) return true
          return 'Prenumele trebuie sa aiba minim 2 caractere'
        }
      ],
      lname: [
        (value: string) => {
          if (value?.length > 2) return true
          return 'Numele trebuie sa aiba minim 3 caractere'
        }
      ],
      email: [
        (value: string) => {
          const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/
          if (pattern.test(value)) return true

          return 'Adresa de email incorecta'
        }
      ],
      pnc: [
        (value: string) => {
          if (value?.length !== 13) return 'CNP trebuie sa aiba 13 caractere'

          const control = '279146358279'.split('')
          const checkSum: number = value.split('').reduce((acc, val, idx) => {
            if (idx === value.length - 1) return acc

            acc += parseInt(val) * parseInt(control[idx])
            return acc
          }, 0)

          const remainder = checkSum % 11
          const lastDigit = parseInt(value.charAt(value.length - 1))
          const validate: boolean = remainder < 10 ? lastDigit === remainder : lastDigit === 1

          return validate ? true : 'CNP invalid'
        }
      ],
      role: [
        (value: string) => {
          if (value) return true
          return 'Rolul este camp obligatoriu'
        }
      ]
    }
  }

  /**
   * Login form validation rules
   */
  function getLoginRules() {
    return {
      email: [
        (value: string) => {
          if (value) return true
          return 'Emailul este obligatoriu'
        }
      ],
      pass: [
        (value: string) => {
          if (value) return true
          return 'Parola este obligatorie'
        }
      ]
    }
  }

  /**
   * Login form validation rules
   */
  function getForgotRules() {
    return {
      email: [
        (value: string) => {
          if (value) return true
          return 'Emailul este obligatoriu'
        }
      ]
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
    getValidationRules
  }
}
