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
        type: 'text',
        key: 'fname',
        value: ''
      },
      {
        label: 'Nume',
        rulesKey: 'lname',
        type: 'text',
        key: 'lname',
        value: ''
      },
      {
        label: 'Email',
        rulesKey: 'email',
        type: 'text',
        key: 'email',
        value: ''
      },
      {
        label: 'CNP',
        rulesKey: 'pnc',
        type: 'text',
        key: 'pnc',
        value: ''
      },
      {
        label: 'Rol',
        rulesKey: 'role',
        items: ['Participant', 'Coordonator', 'Admin'],
        type: 'select',
        key: 'role',
        value: ''
      },
      {
        // TODO: lista predefinita
        label: 'Specializare',
        type: 'select',
        items: [],
        key: 'field',
        value: ''
      },
      {
        label: 'Parafa',
        type: 'text',
        key: 'seal',
        value: ''
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
        type: 'text',
        key: 'email',
        value: ''
      },
      {
        label: 'Parola',
        rulesKey: 'pass',
        type: 'text',
        typeProp: 'password',
        key: 'pass',
        value: ''
      }
    ]
  }

  return {
    getRegisterForm,
    getLoginForm
  }
}
