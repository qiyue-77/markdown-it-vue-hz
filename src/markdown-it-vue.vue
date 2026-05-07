<template>
  <div>
    <div
      class="markdown-body"
      ref="markdown-it-vue-container"
      @click="hdlClick"
    />
    <image-viewer
      v-if="showViewer"
      :url-list="urlList"
      :index.sync="index"
      :on-close="closeViewer"
    />
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import MarkdownItEmoji from 'markdown-it-emoji'
import MarkdownItSubscript from 'markdown-it-sub'
import MarkdownItSuperscript from 'markdown-it-sup'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItDeflist from 'markdown-it-deflist'
import MarkdownItAbbreviation from 'markdown-it-abbr'
import MarkdownItInsert from 'markdown-it-ins'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItKatex from '@iktakahiro/markdown-it-katex'
import MarkdownItTasklists from 'markdown-it-task-lists'
import MarkdownItLatex from 'markdown-it-latex'
import MarkdownItGithubToc from 'markdown-it-github-toc'
import MarkdownItSourceMap from 'markdown-it-source-map'
import MarkdownItLinkAttributes from './markdown-it-link-attributes'
import MarkdownItEcharts from './markdown-it-plugin-echarts'
import MarkdownItMermaid from './markdown-it-plugin-mermaid'
import MarkdownItFlowchart from './markdown-it-plugin-flowchart'
import MarkdownItHighlight from './markdown-it-highlight'
import MarkdownItFontAwsome from './markdown-it-font-awsome'
import MarkdownItImage from './markdown-it-image'
import MarkdownItDocument from './markdown-it-document'
import 'github-markdown-css'
import 'markdown-it-latex/dist/index.css'
import mermaidError from './images/mermaid-error.png'

import * as echarts from 'echarts'
import mermaid from 'mermaid'
import flowchart from 'flowchart.js'
import ImageViewer from './markdown-it-image/image-viewer.vue'

const DEFAULT_OPTIONS_LINK_ATTRIBUTES = {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
}
const DEFAULT_OPTIONS_KATEX = { throwOnError: false, errorColor: '#cc0000' }
const DEFAULT_OPTIONS_TASKLISTS = null
const DEFAULT_OPTIONS_GITHUBTOC = {
  tocFirstLevel: 2,
  tocLastLevel: 3,
  tocClassName: 'toc',
  anchorLinkSymbol: '',
  anchorLinkSpace: false,
  anchorClassName: 'anchor',
  anchorLinkSymbolClassName: 'octicon octicon-link',
}
const DEFAULT_OPTIONS_MERMAID = {
  theme: 'default',
}
const DEFAULT_OPTIONS_IMAGE = {
  hAlign: 'left',
  viewer: true,
}

export default {
  components: { ImageViewer },
  name: 'markdown-it-vue',
  props: {
    content: {
      type: String,
    },
    options: {
      type: Object,
      default() {
        return {
          markdownIt: {
            linkify: true,
            html: true,
            typographer: true 
          },
          linkAttributes: DEFAULT_OPTIONS_LINK_ATTRIBUTES,
          katex: DEFAULT_OPTIONS_KATEX,
          tasklists: DEFAULT_OPTIONS_TASKLISTS,
          githubToc: DEFAULT_OPTIONS_GITHUBTOC,
          mermaid: DEFAULT_OPTIONS_MERMAID,
        }
      },
    },
    mermaidFlag: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    content: {
      immediate: true,
      async handler(val) {
        this.urlSet.clear()
        this.$nextTick(async () => {
          if (this.mermaidFlag) {
            try {
              // 尝试解析，正确时返回 true，错误时抛出异常
              const lastMermaidIndex = val.lastIndexOf('mermaid')
              await mermaid.parse(val.slice(lastMermaidIndex + 7))
              this.runderHtml(val)
            } catch (error) {
              return
            }
          } else {
            this.runderHtml(val)
          }
        })
      },
    },
  },
  data() {
    const optMarkdownIt = this.options.markdownIt
    const linkAttributes =
      this.options.linkAttributes || DEFAULT_OPTIONS_LINK_ATTRIBUTES
    const optKatex = this.options.katex || DEFAULT_OPTIONS_KATEX
    const optTasklists = this.options.tasklists || DEFAULT_OPTIONS_TASKLISTS
    const optGithubToc = this.options.githubToc || DEFAULT_OPTIONS_GITHUBTOC
    const optMermaid = this.options.mermaid || DEFAULT_OPTIONS_MERMAID
    const optImage = this.options.image || DEFAULT_OPTIONS_IMAGE
    optImage.urlSet = new Set()

    let md = new MarkdownIt(optMarkdownIt)
      .use(MarkdownItEmoji)
      .use(MarkdownItSubscript)
      .use(MarkdownItSuperscript)
      .use(MarkdownItFootnote)
      .use(MarkdownItDeflist)
      .use(MarkdownItAbbreviation)
      .use(MarkdownItInsert)
      .use(MarkdownItMark)
      .use(MarkdownItHighlight)
      .use(MarkdownItLatex)
      .use(MarkdownItSourceMap)
      .use(MarkdownItMermaid, optMermaid)
      .use(MarkdownItEcharts)
      .use(MarkdownItFlowchart)
      .use(MarkdownItLinkAttributes, linkAttributes)
      .use(MarkdownItKatex, optKatex)
      .use(MarkdownItTasklists, optTasklists)
      .use(MarkdownItFontAwsome)
      .use(MarkdownItGithubToc, optGithubToc)
      .use(MarkdownItImage, optImage)
      .use(MarkdownItDocument)

    return {
      md: md,
      urlSet: optImage.urlSet,
      viewer: optImage.viewer,
      showViewer: false,
      index: 0,
      urlList: [],
    }
  },
  methods: {
    htmlEncode(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    },
    runderHtml(val) {
      this.$refs['markdown-it-vue-container'].innerHTML = this.md.render(val)
      // render echarts
      this.$refs['markdown-it-vue-container']
        .querySelectorAll('.md-echarts')
        .forEach((element) => {  
          try {
            let options = JSON.parse(element.textContent)
            let chart = echarts.init(element)
            chart.setOption(options)
          } catch (e) {
            element.outerHTML = `<pre>echarts complains: ${e}</pre>`
          }
        })
      // 使用新版 mermaid 的异步渲染和验证
      const mermaidNodes =
        this.$refs['markdown-it-vue-container'].querySelectorAll('.mermaid')
      mermaidNodes.forEach(async (node) => {
        // 从 data-mermaid-code 属性获取编码的代码
        const encodedCode = node.textContent
        try {
          if (encodedCode) {
            await mermaid.parse(encodedCode)
            await mermaid.run({
              nodes: [node],
            })
          }
        } catch (error) {
          this.mermaidFlag
            ? (node.outerHTML = '')
            : (node.outerHTML = `<div  class="mermaid-error" data-code="${this.htmlEncode(
                encodedCode
              )}" data-error="${this.htmlEncode(
                error.message
              )}"> <img src="${mermaidError}" alt=""></div>`)
        }
      })
      this.$refs['markdown-it-vue-container']
        .querySelectorAll('.md-flowchart')
        .forEach((element) => {
          try {
            let code = element.textContent
            let chart = flowchart.parse(code)
            element.textContent = ''
            chart.drawSVG(element)
          } catch (e) {
            element.outerHTML = `<pre>flowchart complains: ${e}</pre>`
          }
        })

      let list = []
      for (const i of this.urlSet) {
        list.push(i)
      }
      this.urlList = list
      // emit event
      this.$emit('render-complete')
    },
    use(plugin, options) {
      this.md.use(plugin, options)
    },
    get() {
      return this.md
    },
    hdlClick(e) {
      if (this.viewer && e.target.tagName == 'IMG') {
        this.index = this.urlList.indexOf(e.target.src) || 0
        this.showViewer = true
      }
    },
    closeViewer() {
      this.showViewer = false
    },
  },
}
</script>

<style lange="scss">
.markdown-it-vue-alter-info {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
}
.markdown-it-vue-alert-icon-info {
  color: #1890ff;
}
.markdown-it-vue-alter-success {
  border: 1px solid #b7eb8f;
  background-color: #f6ffed;
}
.markdown-it-vue-alert-icon-success {
  color: #52c41a;
}
.markdown-it-vue-alter-error {
  border: 1px solid #f5222d;
  background-color: #fff1f0;
}
.markdown-it-vue-alert-icon-error {
  color: #f5222d;
}
.markdown-it-vue-alter-warning {
  border: 1px solid #ffe58f;
  background-color: #fffbe6;
}
.markdown-it-vue-alert-icon-warning {
  color: #faad14;
}
.markdown-it-vue-alter {
  border-radius: 0;
  border: 0;
  margin-bottom: 0;
  display: inline-flex;
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  padding: 0;
  list-style: none;
  position: relative;
  padding: 8px 15px 8px 37px;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 16px;
}
.markdown-it-vue-alter p {
  margin-bottom: 2px;
}

.markdown-it-vue-alert-icon {
  top: 11.5px;
  left: 16px;
  position: absolute;
}

.mermaid-error {
  height: 70px;
  img {
    height: 100%;
  }
}
</style>
