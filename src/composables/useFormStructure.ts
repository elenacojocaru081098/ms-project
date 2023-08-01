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
        items: ['Participant', 'Coordinator', 'Admin'],
        type: 'select',
        key: 'role',
        value: null
      },
      {
        label: 'Specializare',
        type: 'select',
        items: [
          'Alergologie si imunologie clinica',
          'Anestezie si terapie intensiva',
          'Boli infectioase',
          'Cardiologie',
          'Dermatovenerologie',
          'Diabet zaharat, nutritie si boli metabolice',
          'Endocrinologie',
          'Epidemiologie',
          'Farmaceutica',
          'Gastroenterologie',
          'Genetica',
          'Geriatrie si gerontologie',
          'Hematologie',
          'Hepatologie',
          'Igiena',
          'Medicina de familie',
          'Medicina interna',
          'Medicina legala',
          'Nefrologie',
          'Neonatologie',
          'Neurochirurgie',
          'Neurologie',
          'Obstetrica',
          'Oftalmologie',
          'Oncologie',
          'Ortopedie',
          'Otorinolaringologie',
          'Patologie',
          'Pediatrie',
          'Pneumologie',
          'Psihiatrie',
          'Radiologie imagistica',
          'Recuperare medicala',
          'Reumatologie',
          'Stomatologie',
          'Terapeutica',
          'Urologie'
        ],
        key: 'field',
        value: null
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
        value: '',
        prependIcon: 'mdi-email'
      },
      {
        label: 'Parola',
        rulesKey: 'pass',
        type: 'text',
        typeProp: 'password',
        key: 'pass',
        value: '',
        prependIcon: 'mdi-lock'
      }
    ]
  }

  /**
   * Change password form structure
   */
  function getPasswordForm(): Array<IFormField> {
    return [
      {
        label: 'Parola Noua',
        rulesKey: 'pass',
        type: 'text',
        typeProp: 'password',
        key: 'pass',
        value: '',
        prependIcon: 'mdi-lock'
      }
    ]
  }

  /**
   * Forgot password form structure
   */
  function getForgotForm(): Array<IFormField> {
    return [
      {
        label: 'Email',
        rulesKey: 'email',
        type: 'text',
        key: 'email',
        value: '',
        prependIcon: 'mdi-email'
      }
    ]
  }

  /**
   * Create group form structure
   */
  function getCreateGroupForm(): Array<IFormField> {
    return [
      {
        label: 'Nume grup',
        type: 'text',
        key: 'name',
        value: ''
      }
    ]
  }

  /**
   * Create study form structure
   */
  function getCreateStudyForm(): Array<IFormField> {
    return [
      {
        label: 'Nume studiu',
        type: 'text',
        key: 'title',
        value: ''
      },
      {
        label: 'Detalii/Descriere',
        type: 'textarea',
        key: 'details',
        value: ''
      }
    ]
  }

  return {
    getRegisterForm,
    getLoginForm,
    getPasswordForm,
    getForgotForm,
    getCreateGroupForm,
    getCreateStudyForm
  }
}
