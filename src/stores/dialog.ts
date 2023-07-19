import type { IDialogBtn } from '@/interfaces/dialog'
import { defineStore } from 'pinia'

export const useDialogStore = defineStore(PINIA_STORE_KEYS.DIALOG, () => {
  /**
   * Array of functions that will be mapped on the dialog's buttons
   */
  const actions = ref<Array<Function>>([])

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
  function invokeAction(i: number, args: Array<any> = []) {
    if (!actions.value || actions.value.length === 0) return
    actions.value[i].call(null, ...args)
    hideDialog()
  }

  // message to display in the dialog
  const msg = ref<string>()

  /**
   * Sets the dialog message
   *
   * @param { string } m
   */
  function setMessage(m: string) {
    msg.value = m
  }

  // buttons to display in the dialog
  const btns = ref<Array<IDialogBtn>>([])

  /**
   * Sets the dialog buttons
   *
   * @param b
   */
  function setButtons(b: Array<IDialogBtn>) {
    if (btns.value && btns.value.length > 0) btns.value?.splice(0, btns.value.length)

    btns.value?.push(...b)
  }

  // shows or hides the dialog
  const show = ref<boolean>(false)

  /**
   * Triggers the dialog
   */
  function showDialog() {
    show.value = true
  }

  /**
   * Hides and resets the dialog
   */
  function hideDialog() {
    msg.value = ''
    actions.value?.splice(0, actions.value.length)
    btns.value?.splice(0, btns.value.length)
    show.value = false
  }

  /**
   * Triggers a dialog
   *
   * @param { string } m Dialog message
   * @param { Array<Function> } fns Array of actions for the buttons
   * @param { Array<IDialogBtn> } b Array of buttons for the dialog. Must be in the same order as the actions
   */
  function triggerDialog(m: string, fns: Array<Function>, b: Array<IDialogBtn>) {
    setMessage(m)
    setActions(fns)
    setButtons(b)
    showDialog()
  }

  return {
    msg,
    btns,
    show,
    triggerDialog,
    hideDialog,
    invokeAction
  }
})
