/**
 * Use this file to generate sitemap.
 * This is outside of src/ since we don't want to include it in the build
 */

import fs from 'fs'

import Router from '../src/views/Root'

const PUBLIC_URL = 'http://localhost:3000'

interface RouterRoute {
  props: { path: string }
}

interface SitemapRoute {
  path: string
}

const routes = (Router()?.props.children.props.children || [])
  .reduce((acc: SitemapRoute[], route: RouterRoute) => {
    if (Array.isArray(route)) {
      return [
        ...acc,
        ...route.map((subRoute) => ({ path: subRoute.props?.path })),
      ]
    }

    return [...acc, { path: route.props?.path }]
  }, [])
  .filter((route: SitemapRoute) => route.path)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.reduce(
  (acc: string, route: SitemapRoute) => `${acc}
  <url>
    <loc>${PUBLIC_URL}${route.path}</loc>
  </url>`,
  ''
)}
</urlset>
`

// Relative to package.json
const buildPath = './public/sitemap.xml'

fs.writeFileSync(buildPath, xml)

// Adding sitemap to robots.txt
const robotsPath = './public/robots.txt'
const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
Sitemap: ${PUBLIC_URL}/sitemap.xml
`

fs.writeFileSync(robotsPath, robotsTxt)

console.info(`✔️  Sitemap successfully generated at ${buildPath}`)
