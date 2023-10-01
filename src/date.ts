const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const ordinals = ['th', 'st', 'nd', 'rd']

const addOrdinal = (day: number) => {
  const v = day % 100
  return `${day}${ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0]}`
}

export default function formatDate(date: Date, format: string) {
  const formattedDate = (short = false) => {
    let m = months[date.getUTCMonth()]
    if (short) m = m.slice(0, 3)

    let d: number | string = date.getUTCDate()
    if (!short) d = addOrdinal(d)

    return `${m} ${d}, ${date.getUTCFullYear()}`
  }

  const formattedTime = (second = false) => {
    const h = `${date.getUTCHours()}`.padStart(2, '0')
    const m = `${date.getUTCMinutes()}`.padStart(2, '0')
    const ampm = date.getUTCHours() >= 12 ? 'PM' : 'AM'

    if (!second) return `${h}:${m} ${ampm}`

    const s = `${date.getUTCSeconds()}`.padStart(2, '0')
    return `${h}:${m}:${s} ${ampm}`
  }

  const prettifiedDate = (camelize: boolean) => {
    const now = new Date()
    const ny = now.getUTCFullYear()
    const nm = now.getUTCMonth()
    const nd = now.getUTCDate()

    const beginYesterday = Date.UTC(ny, nm, nd - 1, 0, 0, 0)
    const beginToday = Date.UTC(ny, nm, nd, 0, 0, 0)
    const beginTomorrow = Date.UTC(ny, nm, nd + 1, 0, 0, 0)
    const endTomorrow = Date.UTC(ny, nm, nd + 2, 0, 0, 0) - 1

    const unixtime = date.getTime()
    let ret = ''

    if (beginYesterday <= unixtime && unixtime < beginToday) ret = 'yesterday'
    if (beginToday <= unixtime && unixtime < beginTomorrow) ret = 'today'
    if (beginTomorrow <= unixtime && unixtime <= endTomorrow) ret = 'tomorrow'

    if (ret && camelize) ret = `${ret.slice(0, 1).toUpperCase()}${ret.slice(1)}`
    return ret
  }

  return format
    .replace(/{date_num}/g, () => {
      const y = `${date.getUTCFullYear()}`.padStart(4, '0')
      const m = `${date.getUTCMonth() + 1}`.padStart(2, '0')
      const d = `${date.getUTCDate()}`.padStart(2, '0')

      return `${y}-${m}-${d}`
    })
    .replace(/{date_pretty}/g, (_, i) => prettifiedDate(i === 0) || '{date}')
    .replace(
      /{date_short_pretty}/g,
      (_, i) => prettifiedDate(i === 0) || '{date_short}',
    )
    .replace(
      /{date_long_pretty}/g,
      (_, i) => prettifiedDate(i === 0) || '{date_long}',
    )
    .replace(/{date}/g, () => formattedDate())
    .replace(/{date_short}/g, () => formattedDate(true))
    .replace(
      /{date_long}/g,
      () => `${days[date.getUTCDay()]}, ${formattedDate()}`,
    )
    .replace(/{time}/g, () => formattedTime())
    .replace(/{time_secs}/g, () => formattedTime(true))
}
