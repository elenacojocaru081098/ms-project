import type { IFormField } from '~/interfaces/form'

/**
 * Exposes functions to fetch form structures
 */
export function useFormStructure() {
  /**
   * Register form structure
   */
  function getRegisterForm(): Array<IFormField> {
    return [
      {
        label: 'Prenume',
        rulesKey: 'fname',
        type: 'text'
      },
      {
        label: 'Nume',
        rulesKey: 'lname',
        type: 'text'
      },
      {
        label: 'Email',
        rulesKey: 'email',
        type: 'text'
      },
      {
        label: 'CNP',
        rulesKey: 'pnc',
        type: 'text'
      },
      {
        label: 'Rol',
        rulesKey: 'role',
        items: ['Participant', 'Coordonator', 'Admin'],
        type: 'select'
      },
      {
        label: 'Parafa',
        type: 'text'
      }
    ]
  }

  /**
   * Login form structure
   */
  function getLoginForm(): Array<IFormField> {
    return [
      {
        label: 'Email',
        rulesKey: 'email',
        type: 'text'
      },
      {
        label: 'Parola',
        rulesKey: 'pass',
        type: 'text',
        typeProp: 'password'
      }
    ]
  }

  return {
    getRegisterForm,
    getLoginForm
  }
}
