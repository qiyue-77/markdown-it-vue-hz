import previewIcon from './images/preview-icon.png'
import downloadIcon from './images/download-icon.png'
import previewRight from './images/preview-right.png'
import downloadRight from './images/download-right.png'

export default (md) => {
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    if (token.info === 'html') {
      const code = token.content.trim()
      const encodedHtml = btoa(
        Array.from(new TextEncoder().encode(code), (byte) =>
          String.fromCharCode(byte)
        ).join('')
      )

      return `<div class="md-html" data-loading="true" data-raw-html="${encodedHtml}">
  <div class="md-html-left">
    <div class="md-html-status-text md-html-status-loading">文档生成中...</div>
    <div class="md-html-status-text md-html-status-complete">生成完成 <span class="md-html-check">✓</span></div>
    <div class="md-html-skeleton">
      <div class="md-html-skeleton-line1"></div>
      <div class="md-html-skeleton-line2"></div>
    </div>
    <div class="md-html-actions">
      <button class="md-html-preview"><img src="${previewIcon}" alt="" /><span>预览</span></button>
      <button class="md-html-download"><img src="${downloadIcon}" alt="" /><span>下载</span></button>
    </div>
  </div>
  <div class="md-html-right">
    <img class="md-html-right-img md-html-right-loading" src="${previewRight}" alt="" />
    <img class="md-html-right-img md-html-right-complete" src="${downloadRight}" alt="" />
  </div>
</div>`
    }
    return temp(tokens, idx, options, env, slf)
  }
}
