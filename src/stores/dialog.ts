import { defineStore } from 'pinia'

export const useDialogStore = defineStore(PINIA_STORE_KEYS.DIALOG, () => {
  // shows or hides the dialog
  const show = ref<boolean>(false)

  /**
   * Triggers the dialog
   */
  function showDialog() {
    show.value = true
  }

  /**
   * Hides the dialog
   */
  function hideDialog() {
    show.value = false
  }

  /**
   * Array of functions that will be mapped on the dialog's buttons
   */
  const actions = ref<Array<Function>>()

  /**
   * Sets the function array
   *
   * @param { Array<Function> } fns Functions to store in the array
   */
  function setActions(fns: Array<Function>) {
    if (actions.value && actions.value.length > 0) actions.value?.splice(0, actions.value.length)

    actions.value?.push(...fns)
  }

  /**
   * Invokes the right action after pressing a dialog's button
   *
   * @param { number } i Zero based function index in actions array
   * @param { Array<any> } args Arguments for the invoked function
   */
  function invokeAction(i: number, args: Array<any>) {
    if (!actions.value || actions.value.length === 0) return
    actions.value[i].call(null, ...args)
  }

  return {
    showDialog,
    hideDialog,
    setActions,
    invokeAction
  }
})
