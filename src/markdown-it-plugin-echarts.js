import renderLight from './images/render-light.png'
import renderDark from './images/render-dark.png'
import renderPurple from './images/render-purple.png'

export default (md, options) => {
  const theme = options?.theme || 'light'
  const loadingMap = {
    light: renderLight,
    dark: renderDark,
    purple: renderPurple,
  }
  const loadingImg = loadingMap[theme] || renderLight

  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    if (token.info === 'echarts') {
      const code = token.content.trim()
      try {
        const json = JSON.parse(code)
        const width = json.width || 500
        const height = json.height || 400
        delete json.width
        delete json.height
        return `<div style="width:${width}px;height:${height}px" class="md-echarts" data-options="${encodeURIComponent(JSON.stringify(json))}"></div>`
      } catch (e) { // JSON.parse exception
        return `<div class="echarts-loading" style="height:120px"><img src="${loadingImg}" alt="" data-no-preview="true" style="height:100%"></div>`
      }
    }
    return temp(tokens, idx, options, env, slf)
  }
}
