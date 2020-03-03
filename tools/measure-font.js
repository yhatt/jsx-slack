const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const saveTo = path.resolve(__dirname, '../src/data/font-width.json')

// Measure width of latin letters and spaces in Slack Lato font
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('https://api.slack.com/', { waitUntil: 'networkidle2' })

  const measuredData = await page.evaluate(() => {
    // The bullet of list item may take these characters
    const letters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.•◦▪'

    // Use Unicode spaces that would not be collapsed implicitly
    const spaces = '\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a'

    const measured = { letters: {}, spaces: {} }
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    ctx.font = '100px Slack-Lato, sans-serif'

    for (const l of letters) measured.letters[l] = ctx.measureText(l).width
    for (const s of spaces) measured.spaces[s] = ctx.measureText(s).width

    return measured
  })

  await browser.close()

  return measuredData
})().then(data => {
  fs.mkdirSync(path.dirname(saveTo), { recursive: true })
  fs.writeFileSync(saveTo, JSON.stringify(data, null, 2))

  // eslint-disable-next-line no-console
  console.log(`Measured data of font width was saved to ${saveTo}.`)
})
