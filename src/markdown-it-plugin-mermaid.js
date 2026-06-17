import mermaid from 'mermaid'

const FLOWCHART_CONFIG = `%%{init: {
  "theme": "base",
  "themeVariables": {
    "primaryColor": "#33284D",
    "primaryTextColor": "#ffffff",
    "primaryBorderColor": "#5c5c5e",
    "lineColor": "#5c5c5e",
    "edgeLabelBackground": "#33284D",
    "edgeLabelTextColor": "#ffffff"
  }
}}%%`

const XYCHART_CONFIG = `%%{init: {
  "theme": "base",
  "themeVariables": {
    "xyChart": {
      "backgroundColor": "transparent",
      "titleColor": "#FFFFFF",
      "xAxisLabelColor": "rgba(255, 255, 255, 0.7)",
      "xAxisLineColor": "rgba(255, 255, 255, 0.16)",
      "yAxisLabelColor": "rgba(255, 255, 255, 0.7)",
      "yAxisLineColor": "rgba(255, 255, 255, 0.16)",
      "xAxisTickColor": "rgba(255, 255, 255, 0.7)",
      "yAxisTickColor": "rgba(255, 255, 255, 0.7)",
      "plotColorPalette": "#2276FC,#1FBCFF,#EDE654,#97D664,#FF7D54",
      "dataLabelColor": "rgba(255, 255, 255, 0.7)"
    }
  },
  "xyChart": {
    "xAxis": {
      "axisLineWidth": 3
    },
    "yAxis": {},
    "showDataLabel": true,
    "showDataLabelOutsideBar": true
  }
}}%%`

const PIE_CONFIG = `%%{init: {
  "themeVariables": {
    "pieStrokeColor": "transparent",
    "pieOuterStrokeColor": "transparent",
    "pieTitleTextColor": "rgba(255, 255, 255, 0.7)",
    "pieLegendTextColor": "rgba(255, 255, 255, 0.7)",
    "pieSectionTextColor": "rgba(255, 255, 255, 0.7)",
    "pie1": "#2276FC",
    "pie2": "#1FBCFF",
    "pie3": "#EDE654",
    "pie4": "#97D664",
    "pie5": "#FF7D54",
    "pie6": "#2276FC",
    "pie7": "#1FBCFF"
  }
}}%%`

function getChartType(code) {
  const firstLine = code.split(/\n/)[0].trim().toLowerCase()
  if (firstLine.startsWith('pie')) return 'pie'
  if (firstLine.startsWith('xychart-beta')) return 'xychart'
  if (firstLine.startsWith('graph') || firstLine.startsWith('flowchart')) return 'flowchart'
  return null
}

function injectConfig(code, type) {
  switch (type) {
    case 'flowchart':
      return `${FLOWCHART_CONFIG}\n${code}`
    case 'xychart':
      return `${XYCHART_CONFIG}\n${code}`
    case 'pie':
      return `${PIE_CONFIG}\n${code}`
    default:
      return code
  }
}

const mermaidChart = (code) => {
  const type = getChartType(code)
  const finalCode = injectConfig(code, type)
  return `<pre class="mermaid">${finalCode}</pre>`
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
      firstLine === 'xychart-beta' ||
      firstLine.startsWith('pie') ||
      firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)
    ) {
      return mermaidChart(code)
    }
    return temp(tokens, idx, options, env, slf)
  }
}

export default MermaidPlugin
