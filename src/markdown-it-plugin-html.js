import previewIcon from './images/preview-icon.png'
import downloadIcon from './images/download-icon.png'
import previewRight from './images/preview-right.png'
import downloadRight from './images/download-right.png'

export default (md) => {
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    if (token.info === 'html') {
      let code = token.content.trim()
      const isComplete = code.trimEnd().endsWith('```')
      const loadingAttr = isComplete ? '' : ' data-loading="true"'
      const rawHtml = code.trimEnd().replace(/```$/, '').trim()
      const encodedHtml = btoa(
        Array.from(new TextEncoder().encode(rawHtml), (byte) =>
          String.fromCharCode(byte)
        ).join('')
      )

      const statusText = isComplete
        ? `<div class="md-html-status-text md-html-status-complete">生成完成 <span class="md-html-check">✓</span></div>`
        : `<div class="md-html-status-text md-html-status-loading">文档生成中...</div>`
      const rightImg = isComplete
        ? `<img class="md-html-right-img" src="${downloadRight}" alt="" />`
        : `<img class="md-html-right-img" src="${previewRight}" alt="" />`

      const actions = isComplete
        ? `<div class="md-html-actions"><button class="md-html-preview"><img src="${previewIcon}" alt="" /><span>预览</span></button><button class="md-html-download"><img src="${downloadIcon}" alt="" /><span>下载</span></button></div>`
        : `<div class="md-html-skeleton"><div class="md-html-skeleton-line1"></div><div class="md-html-skeleton-line2"></div></div>`

      return `<div class="md-html"${loadingAttr} data-raw-html="${encodedHtml}"><div class="md-html-left">${statusText}${actions}</div><div class="md-html-right">${rightImg}</div></div>`
    }
    return temp(tokens, idx, options, env, slf)
  }
}
