const fs = require('fs')
const path = require('path')

if (process.env.npm_package_version.match(/^v\d+\.\d+\.\d+$/)) {
  console.info("Detected not formal release version so CHANGELOG won't update.")
} else {
  const unreleased = '## [Unreleased]'
  const [date] = new Date().toISOString().split('T')
  const version = `## v${process.env.npm_package_version} - ${date}`

  const changelog = path.resolve(__dirname, '../CHANGELOG.md')
  const content = fs.readFileSync(changelog, 'utf8')

  fs.writeFileSync(
    changelog,
    content.replace(unreleased, `${unreleased}\n\n${version}`)
  )
}
