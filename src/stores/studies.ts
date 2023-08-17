import type { IBusToast } from '@/interfaces/bus_events'
import type { IAnswer, IStudy, IStudyQuestion } from '@/interfaces/study'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  query,
  where,
  writeBatch
} from 'firebase/firestore'
import { defineStore, storeToRefs } from 'pinia'

export const useStudiesStore = defineStore(PINIA_STORE_KEYS.STUDIES, () => {
  const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)
  const { addTimestamps, addModifiedTags } = useDbInfo()

  const groupsStore = useGroupsStore()
  const { getAllGroups, updateGroupStudies } = groupsStore

  // studies of the current user (creator/member)
  const studies = ref<Array<IStudy>>([])
  const studiesInitialized = ref<boolean>(false)

  // current study we're working on
  const currentStudyIndex = ref<number>(0)
  const currentStudy = computed(() => studies.value[currentStudyIndex.value])

  /**
   * Sets a study as the current one
   *
   * @param { string } sid
   */
  function setStudyAsCurrentStudy(sid: string) {
    currentStudyIndex.value = studies.value.findIndex((s) => s.id === sid)
  }

  /**
   * Gets all the studies of the user
   */
  async function getAllStudies() {
    if (!studiesInitialized.value) await fetchCurrentUserStudies()
    return studies.value
  }

  /**
   * Fetches current user's studies
   */
  async function fetchCurrentUserStudies() {
    if (studiesInitialized.value) return

    const groups = await getAllGroups()
    const studiesIds: Array<string> = []

    groups.forEach((g) => {
      if (g.studies) studiesIds.push(...g.studies)
    })

    await getStudiesByIdList(studiesIds)
    studiesInitialized.value = !!studies.value
  }

  /**
   * Fetches the specified studies from the db
   *
   * @param { Array<string> } sids List of study ids
   */
  async function getStudiesByIdList(sids: Array<string>) {
    if (!sids || !sids.length) return []

    const q = query(collection(db, COLLECTIONS.STUDIES), where(documentId(), 'in', sids))
    const qss = await getDocs(q)

    qss.forEach((d) => {
      studies.value.push({
        id: d.id,
        ...d.data()
      } as IStudy)
    })
  }

  /**
   * Creates a new study
   */
  async function createStudy(study: IStudy, gid: string) {
    try {
      const s = await addDoc(collection(db, COLLECTIONS.STUDIES), {
        title: study.title,
        details: study.details,
        questions: study.questions,
        ...addTimestamps()
      })

      updateGroupStudies(gid, [s.id])

      router.push({ path: '/studies' })

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_CREATED_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_CREATED_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  // TODO: implement this
  async function updateStudy() {}

  const newQuestions = ref<Array<IStudyQuestion>>([])
  const studyQuestions = computed<Array<IStudyQuestion>>(() => currentStudy.value?.questions)
  const currentQuestionIndex = ref<number>(0)
  const currentQuestion = computed<IStudyQuestion>(() =>
    studyQuestions.value ? studyQuestions.value[currentQuestionIndex.value] : ({} as IStudyQuestion)
  )

  /**
   * Sets a question as the current question
   *
   * @param { string } qid
   */
  function setQuestionAsCurrentQuestion(qid: string) {
    currentQuestionIndex.value = studyQuestions.value.findIndex((q) => q.id === qid)
  }

  /**
   * Sets the current question index
   *
   * @param { number } idx
   */
  function setCurrentQuestionIndex(idx: number) {
    currentQuestionIndex.value = idx
  }

  /**
   * Adds a question to the current study's state
   *
   * @param q
   */
  function addQuestionToStudy(q: IStudyQuestion) {
    newQuestions.value.push(q)
  }

  /**
   * Saves the study's questions to db
   */
  async function addQuestionsToStudyDB() {
    if (!studyQuestions.value.length) currentStudy.value.questions = []

    const noOfExistingQuestions = studyQuestions.value.length
    const studyRef = doc(db, COLLECTIONS.STUDIES, currentStudy.value.id)
    const lastId =
      noOfExistingQuestions !== 0
        ? parseInt(studyQuestions.value[noOfExistingQuestions - 1].id!)
        : 0

    try {
      const batch = writeBatch(db)

      newQuestions.value.forEach((q) => {
        const qId = (lastId + 1).toString()
        const qRef = doc(collection(studyRef, COLLECTIONS.QUESTIONS), qId)
        batch.set(qRef, {
          ...q,
          ...addTimestamps()
        })
        q.id = qId
      })

      currentStudy.value.questions.push(...newQuestions.value)
      newQuestions.value.length = 0

      await batch.commit()

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_QUESTION_ADD_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_QUESTION_ADD_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  /**
   * Deletes a question
   *
   * @param { string } qid
   */
  async function deleteQuestionFromStudy(qid: string) {
    try {
      const question = doc(
        db,
        COLLECTIONS.STUDIES,
        currentStudy.value.id,
        COLLECTIONS.QUESTIONS,
        qid
      )

      await deleteDoc(question)
      const questions = studyQuestions.value

      const q = questions.find((q) => q.id === qid)
      q && questions.splice(questions.indexOf(q), 1)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_QUESTION_DELETE_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_QUESTION_DELETE_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  /**
   * Fetches the current study's questions
   */
  async function fetchCurrentStudyQuestions() {
    if (!studyQuestions.value) currentStudy.value.questions = []
    else if (studyQuestions.value.length > 0) return

    try {
      const qss = await getDocs(
        collection(db, COLLECTIONS.STUDIES, currentStudy.value.id, COLLECTIONS.QUESTIONS)
      )

      qss.forEach((d) => {
        const data = d.data()

        currentStudy.value.questions.push({
          id: d.id,
          text: data.text,
          answer_type: data.answer_type,
          values: data.values
        })

        currentStudy.value.questions.sort(
          (a, b) => parseInt(a.id as string) - parseInt(b.id as string)
        )
      })
    } catch (e: any) {
      console.error(e.message)
    }
  }

  const answers = ref<Array<IAnswer>>([])
  const answersFetched = ref<boolean>(false)

  /**
   * Adds or replaces an answer in the local state
   *
   * @param { IAnswer } a
   */
  function addAnswer(a: IAnswer) {
    const existingAnswerIndex = answers.value.findIndex((ans) => ans.question === a.question)

    if (existingAnswerIndex === -1) answers.value?.push(a)
    else {
      a.id = answers.value[existingAnswerIndex].id
      answers.value.splice(existingAnswerIndex, 1, a)
    }
  }

  /**
   * Saves the answers to the db
   */
  async function addAnswersToDB() {
    const { user } = useUserStore()
    const { currentPatient } = storeToRefs(usePatientStore())

    const dbAnswers = answers.value.map((ans) => ({
      id: ans.id,
      user: user?.id,
      answer: ans.answer,
      patient: currentPatient.value!.id
    }))

    try {
      const batch = writeBatch(db)

      dbAnswers.forEach((ans, idx) => {
        const qRef = doc(
          collection(db, COLLECTIONS.STUDIES, currentStudy.value.id, COLLECTIONS.QUESTIONS),
          answers.value[idx].question
        )

        if (!ans.id) {
          const aRef = doc(collection(qRef, COLLECTIONS.ANSWERS))
          ans.id = aRef.id
          batch.set(aRef, {
            user: ans.user,
            answer: ans.answer,
            ...addTimestamps()
          })
        } else if (
          ans.id &&
          (ans.answer !== undefined || (ans.answer as string | string[]).length)
        ) {
          const aRef = doc(collection(qRef, COLLECTIONS.ANSWERS), ans.id)
          batch.update(aRef, {
            user: ans.user,
            answer: ans.answer,
            ...addModifiedTags()
          })
        } else if (
          ans.id &&
          (ans.answer === undefined || (ans.answer as string | string[]).length === 0)
        ) {
          const aRef = doc(collection(qRef, COLLECTIONS.ANSWERS), ans.id)
          batch.delete(aRef)
        }
      })

      await batch.commit()

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_ANSWERS_SAVE_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_ANSWERS_SAVE_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  /**
   * Fetches the answers for the current study
   */
  async function fetchQuestionsAnswers() {
    if (!currentStudy.value) return
    if (answers.value.length > 0) return answers.value
    const ans: Array<IAnswer> = []
    const { user } = useUserStore()

    try {
      for (const question of studyQuestions.value) {
        const q = query(
          collection(
            db,
            COLLECTIONS.STUDIES,
            currentStudy.value.id,
            COLLECTIONS.QUESTIONS,
            question.id!,
            COLLECTIONS.ANSWERS
          ),
          where('user', '==', user!.id)
        )

        const qss = await getDocs(q)

        qss.forEach((d) => {
          const data = d.data()

          ans.push({
            id: d.id,
            question: question.id!,
            answer: data.answer
          })
        })
      }

      ans.sort((a, b) => parseInt(a.question as string) - parseInt(b.question as string))
      answers.value.push(...ans)
      answersFetched.value = true
    } catch (e: any) {
      console.error(e.message)
    }
  }

  return {
    studies,
    studiesInitialized,
    currentStudy,
    setStudyAsCurrentStudy,
    getAllStudies,
    fetchCurrentUserStudies,
    getStudiesByIdList,
    createStudy,
    updateStudy,
    studyQuestions,
    currentQuestionIndex,
    currentQuestion,
    setQuestionAsCurrentQuestion,
    setCurrentQuestionIndex,
    addQuestionToStudy,
    addQuestionsToStudyDB,
    deleteQuestionFromStudy,
    fetchCurrentStudyQuestions,
    answers,
    answersFetched,
    addAnswer,
    addAnswersToDB,
    fetchQuestionsAnswers
  }
})
