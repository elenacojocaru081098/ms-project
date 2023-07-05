export function extractGenderFromPNC(pnc: string): string {
  const genderDigit = parseInt(pnc.charAt(0))
  return genderDigit % 2 === 1 ? 'M' : 'F'
}

function getYearFirstTwoDigits(d: number) {
  switch (d) {
    case 1:
    case 2:
      return '19'
    case 3:
    case 4:
      return '18'
    default:
      return '20'
  }
}

export function extractBirthdateFromPNC(pnc: string): string {
  const genderDigit = parseInt(pnc.charAt(0))
  let year: string = getYearFirstTwoDigits(genderDigit)
  year += pnc.slice(1, 3)
  const month = pnc.slice(3, 5)
  const day = pnc.slice(5, 7)

  return new Date(`${year}-${month}-${day}`).toISOString().split('T')[0]
}
