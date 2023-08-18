export function useScreenSize() {
  function hasBigScreen() {
    return window.innerWidth > 800
  }

  return {
    hasBigScreen
  }
}
