export default (md) => {
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    if (token.info === 'html') {
      let code = token.content.trim()
      const isComplete = code.trimEnd().endsWith('```')
      const htmlEncodedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      const loadingAttr = isComplete ? '' : ' data-loading="true"'
      return `<div class="md-html"${loadingAttr}><div class="md-html-header"><div class="md-html-summary-left"><div class="md-html-status"><span class="md-html-loading"><svg class="md-html-spinner" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>模版生成中</span><span class="md-html-done"><svg class="md-html-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>模版生成完成</span></div><svg class="md-html-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div><div class="md-html-actions"><div class="md-html-action"><button class="md-html-preview" title="预览"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button><span>预览</span></div><div class="md-html-action"><button class="md-html-download" title="下载"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button><span>下载</span></div></div></div><div class="md-html-body"><div class="md-html-source"><code>${htmlEncodedCode}</code></div></div></div>`
    }
    return temp(tokens, idx, options, env, slf)
  }
}
