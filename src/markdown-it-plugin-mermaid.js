import mermaid from 'mermaid'

const mermaidChart = (code) => {
  // 使用异步验证，但为了保持同步渲染，我们返回一个占位符
  // 实际的验证和渲染将在 Vue 组件的异步处理中完成
  return `<pre class="mermaid">${code}</pre>`
}

const MermaidPlugin = (md, opts) => {
  md.mermaid = mermaid
  opts = opts || {
    theme: 'default',
  }
  mermaid.initialize(opts)
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    if (token.info === 'mermaid') {
      return mermaidChart(code)
    }
    const firstLine = code.split(/\n/)[0].trim()
    if (
      firstLine === 'gantt' ||
      firstLine === 'sequenceDiagram' ||
      firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)
    ) {
      return mermaidChart(code)
    }
    return temp(tokens, idx, options, env, slf)
  }
}

export default MermaidPlugin
