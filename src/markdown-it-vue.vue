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
import MarkdownItHtml from './markdown-it-plugin-html'
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
            typographer: true,
          },
          linkAttributes: DEFAULT_OPTIONS_LINK_ATTRIBUTES,
          katex: DEFAULT_OPTIONS_KATEX,
          tasklists: DEFAULT_OPTIONS_TASKLISTS,
          githubToc: DEFAULT_OPTIONS_GITHUBTOC,
          mermaid: DEFAULT_OPTIONS_MERMAID,
        }
      },
    },
    codeBlockType: {
      type: String,
      default: null,
    },
    streamDone: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    streamDone(val) {
      if (!val) return
      this.$nextTick(() => {
        const container = this.$refs['markdown-it-vue-container']
        if (!container) return
        container
          .querySelectorAll('.md-html[data-loading="true"]')
          .forEach((el) => {
            el.removeAttribute('data-loading')
          })
      })
    },
    content: {
      immediate: true,
      async handler(val) {
        this.urlSet.clear()
        this.$nextTick(async () => {
          if (this.codeBlockType) {
            try {
              switch (this.codeBlockType) {
                case 'mermaid': {
                  console.log('mermaid code:', val)
                  const lastMermaidIndex = val.lastIndexOf('mermaid')
                  await mermaid.parse(val.slice(lastMermaidIndex + 7))
                  this.runderHtml(val)
                  break
                }
                case 'html':
                  this.runderHtml(val)
                  break
                default:
                  break
              }
              // 尝试解析，正确时返回 true，错误时抛出异常
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
      .use(MarkdownItHtml)
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
    async runderHtml(val) {
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
      for (const node of mermaidNodes) {
        const encodedCode = node.textContent
        try {
          if (encodedCode) {
            await mermaid.parse(encodedCode)
            await mermaid.run({
              nodes: [node],
            })
          }
        } catch (error) {
          this.codeBlockType === 'mermaid'
            ? (node.outerHTML = '')
            : (node.outerHTML = `<div  class="mermaid-error" data-code="${this.htmlEncode(
                encodedCode
              )}" data-error="${this.htmlEncode(
                error.message
              )}"> <img src="${mermaidError}" alt="" data-no-preview="true" style="height: 100%;"></div>`)
        }
      }
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

      // render html blocks
      this.$refs['markdown-it-vue-container']
        .querySelectorAll('.md-html')
        .forEach((element) => {
          if (this.streamDone) {
            element.removeAttribute('data-loading')
          }
          const encodedHtml = element.getAttribute('data-raw-html')
          const rawHtml = encodedHtml
            ? new TextDecoder().decode(
                Uint8Array.from(atob(encodedHtml), (c) => c.charCodeAt(0))
              )
            : ''
          const previewBtn = element.querySelector('.md-html-preview')
          if (previewBtn) {
            previewBtn.addEventListener('click', (e) => {
              e.stopPropagation()
              this.$emit('html-preview', rawHtml)
            })
          }
          const downloadBtn = element.querySelector('.md-html-download')
          if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
              e.stopPropagation()
              this.$emit('html-download', rawHtml)
            })
          }
          element.querySelectorAll('img').forEach((img) => {
            img.dataset.noPreview = 'true'
          })
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
        if (e.target.dataset.noPreview === 'true') {
          return
        }
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
.markdown-body .highlight pre,
.markdown-body pre {
  background-color: rgba(32, 28, 46, 0.2);
}
svg [class*='line-plot-'] path {
  stroke-width: 4px; /* 改成你想要的粗细 */
}
svg [class*='bar-plot-'] text {
  font-size: 16px;
}
svg [class*='bar-plot-'] rect {
  fill:#666EEC;
}
svg .pieOuterCircle,
svg .pieCircle {
  stroke: transparent !important;
  opacity: 1!important;
}
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
  height: 120px;
  margin-bottom: 10px;
  img {
    height: 100%;
  }
}

.md-html {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 480px;
  background-color: #f7f8fa;
  border-radius: 12px;
  padding: 12px 24px;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.md-html-left {
  display: flex;
  flex-direction: column;
}

.md-html-status-text {
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
}

.md-html-status-loading {
  color: #333;
}

.md-html-status-complete {
  color: #239545;
}

.md-html-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid #239545;
  border-radius: 50%;
  color: #239545;
  font-size: 12px;
  line-height: 1;
  margin-left: 4px;
  vertical-align: middle;
}

.md-html-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.md-html-skeleton-line1 {
  width: 180px;
  height: 20px;
  background-color: #e8ecf0;
  border-radius: 4px;
}

.md-html-skeleton-line2 {
  width: 278px;
  height: 66px;
  background-color: #e8ecf0;
  border-radius: 4px;
}

.md-html-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.md-html-actions button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.md-html-preview img,
.md-html-download img {
  width: 16px;
  height: 16px;
  display: block;
  background-color: transparent !important;
}

.md-html:not([data-loading='true']) .md-html-actions button {
  background-color: #1f71ff;
  border-color: #1f71ff;
  color: #fff;
}

.md-html-right {
  flex-shrink: 0;
  margin-left: 24px;
}

.md-html-right-img {
  width: 120px;
  height: auto;
  display: block;
  background-color: transparent !important;
}

/* 生成中状态 (data-loading="true") */
.md-html[data-loading='true'] .md-html-status-complete,
.md-html[data-loading='true'] .md-html-actions,
.md-html[data-loading='true'] .md-html-right-complete {
  display: none !important;
}

.md-html[data-loading='true'] .md-html-status-loading,
.md-html[data-loading='true'] .md-html-right-loading {
  display: block;
}

.md-html[data-loading='true'] .md-html-skeleton {
  display: flex;
}

/* 生成完成状态 (无 data-loading) */
.md-html:not([data-loading='true']) .md-html-status-loading,
.md-html:not([data-loading='true']) .md-html-skeleton,
.md-html:not([data-loading='true']) .md-html-right-loading {
  display: none !important;
}

.md-html:not([data-loading='true']) .md-html-status-complete,
.md-html:not([data-loading='true']) .md-html-actions,
.md-html:not([data-loading='true']) .md-html-right-complete {
  display: block;
}

.md-html:not([data-loading='true']) .md-html-actions {
  display: flex;
}
</style>
