<template>
  <div>
    <button @click="onclick">点击输出</button>
    <button @click="onTime">定时器输出</button>
    <button @click="download">下载</button>
    <button @click="extractMermaid">提取编码</button>
    <button @click="replace">正则替换</button>
    <div class="container">
      <textarea class="md-text" rows="10" v-model="content" />
      <markdown-it-vue
        class="md-body"
        :content="content"
        :options="options"
        ref="markdown"
        @render-complete="hdlCmplete"
        :mermaidFlag="false"
      />
    </div>
    <!-- <div ref="echart" style="height: 500px;"></div> -->
  </div>
</template>

<script>
import MarkdownItVue from '../../src'
// import * as echarts from 'echarts'
import htmlDocx from 'html-docx-js/dist/html-docx.js'
export default {
  components: {
    MarkdownItVue,
  },
  data() {
    return {
      echart1:
        '```echarts\n{\n  "tooltip": {\n    "trigger": "item"\n  },\n  "radar": {\n    "indicator": [\n      {"name": "身份真实性", "max": 10},\n      {"name": "前科背景", "max": 10},\n      {"name": "社交关联", "max": 10},\n      {"name": "行为特征", "max": 10},\n      {"name": "经济压力", "max": 10}\n    ],\n    "radius": "70%"\n  },\n  "series": [\n    {\n      "name": "风险值",\n      "type": "radar",\n      "data": [\n        {\n          "value": [8, 10, 6, 9, 7],\n          "areaStyle": {"color": "rgba(54, 162, 235, 0.3)"},\n          "itemStyle": {"color": "#36a2eb"},\n          "lineStyle": {"color": "#36a2eb"}\n        }\n      ]\n    }\n  ]\n}\n```',
      echart2:
        '```echarts\n{\n  "tooltip": {"trigger": "axis", "axisPointer": {"type": "shadow"}},\n  "xAxis": {\n    "type": "category",\n    "data": ["通讯次数", "出入境", "酒店住宿", "交通轨迹"]\n  },\n  "yAxis": {"type": "value"},\n  "series": [\n    {\n      "data": [118, 5, 22, 45],\n      "type": "bar",\n      "itemStyle": {"color": "#36a2eb"}\n    }\n  ]\n}\n```',
      content:
        '```mermaid\ngraph TD\n    A[统计工单数量] --> B[筛选近三日]\n    B --> C[按热力站聚合]\n    C --> D[排序取前五]\n    D --> E[获取运行工况]\n    E --> F[分析一次参数]\n    F --> G[评估运行状态]\n```',
      str: '<attempt_completion>\n<result>mermaid\ngraph TD\n    Start[分析开始] --> Understand[理解分析需求]\n    Understand --> Focus[聚焦运行工况]\n    Focus --> Judge{判断分析方向}\n    Judge -->|参数监测| Analyze1[一次网参数分析]\n    Judge -->|用户感知| Analyze2[室温与工单分析]\n    Judge -->|环境影响| Analyze3[室外气象关联]\n    Analyze1 --> Extract1[提取压力温度数据]\n    Analyze2 --> Extract2[提取室温工单数据]\n    Analyze3 --> Extract3[提取气象数据]\n    Extract1 --> PlanQuery1[规划运行参数查询]\n    Extract2 --> PlanQuery2[规划室温工单查询]\n    Extract3 --> PlanQuery3[规划气象数据查询]\n    PlanQuery1 --> Final[生成完整查询规划]\n    PlanQuery2 --> Final\n    PlanQuery3 --> Final\n```\n\n# 第二阶段：查询任务规划\n\n## 分析目标\n为全面掌握太阳宫新区站的运行状态，制定以下数据查询规划，旨在从设备运行、用户室温和服务响应三个维度进行综合研判。\n\n## 具体查询任务\n\n#### 任务1：一次网运行参数查询\n- **业务目标**： 验证热力站一次网关键运行参数是否在安全、高效区间内。\n- **数据表**： `ubd_sayy_dm_subject.dm_d_sayy_station_operation_conditions_5min_i`\n- **查询内容**： 查询太阳宫新区站在最近3天内的5分钟频率一次供水压力、一次回水压力、一次供水温度、一次回水温度。\n- **查询条件**： \n  - station_name = "太阳宫新区站"\n  - data_time >= date_sub(current_date, 3)\n- **预期输出**： 原始数据集，用于计算并评估一次供回水压差、温差及回水温度的合理性。\n\n#### 任务2：室温监控指标查询\n- **业务目标**： 量化评估供热服务质量，识别供热不达标区域。\n- **数据表**： `ubd_sayy_dm_subject.dm_d_sayy_room_temp_monitor_15min_i`\n- **查询内容**： 查询太阳宫新区站所辖用户在最近3天内的15分钟频率室温数据。\n- **查询条件**： \n  - station_name = "太阳宫新区站"\n  - data_time >= date_sub(current_date, 3)\n- **预期输出**： 汇总计算出的日均合格率、低温率、高温率、平均室温等指标，形成趋势图表。\n\n#### 任务3：工单业务情况查询\n- **业务目标**： 分析用户诉求，评估服务效率和问题集中点。\n- **数据表**： `ubd_khfw_dm_kfpt.dm_h_khfw_sheet_info_i`\n- **查询内容**： 查询与太阳宫新区站相关的所有工单记录。\n- **查询条件**： \n  - related_station = "太阳宫新区站"\n  - create_time >= date_sub(current_date, 7)\n- **预期输出**： 工单总数、日趋势图、报事类型TOP5、一次解决率、平均响应时长。\n\n#### 任务4：室外气象数据查询\n- **业务目标**： 为运行参数调整提供外部环境依据。\n- **数据表**： `iceberg_hms_on_hdfs_catalog.ubd_sayy_ods_swqx.ods_d_sayy_qy_short12_i`\n- **查询内容**： 查询太阳宫区域最近3天的实时气温。\n- **查询条件**： \n  - name like \'%太阳宫%\' or area_code = \'CY\'\n  - record_time >= date_sub(current_date, 3)\n- **预期输出**： 日均气温、最低气温、最高气温的时间序列数据。\n</result>\n</attempt_completion>',
      redDocumentMd: '',
      htmlContent: `<div style="margin: 0 auto; padding: 40px 50px; max-width: 800px; font-family: 'SimSun', '宋体', serif; line-height: 1.8; font-size: 16px;">
    <div style="text-align: center; padding: 10px 0; border-bottom: 3px solid #c8102e; margin-bottom: 30px;">
        <div style="font-size: 24px; font-weight: bold; color: #c8102e; letter-spacing: 4px; margin-bottom: 5px;">XX省XX市人民政府办公厅</div>
        <div style="font-size: 18px; font-weight: 600; color: #c8102e; letter-spacing: 2px;">文件</div>
    </div>
    <div style="text-align: right; margin-bottom: 40px; font-size: 15px; color: #333;">X政办〔2026〕12号</div>
    <div style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 40px; letter-spacing: 1px;">关于开展2026年度安全生产专项检查的通知</div>
    <div style="margin-bottom: 40px; text-indent: 2em; color: #333;">
        <div style="margin-bottom: 15px;">各区县人民政府，市直各有关单位：</div>
        <div style="margin-bottom: 15px;">为深入贯彻落实全国安全生产电视电话会议精神，切实防范化解重大安全风险，保障人民群众生命财产安全，经市政府研究决定，自2026年2月1日至3月31日，在全市范围内开展安全生产专项检查工作。现将有关事项通知如下：</div>
        <div style="margin-bottom: 15px;"><strong style="font-weight: bold;">一、检查范围</strong>：全市所有生产经营单位，重点涵盖矿山、化工、建筑施工、交通运输、消防等高危行业领域。</div>
        <div style="margin-bottom: 15px;"><strong style="font-weight: bold;">二、检查内容</strong>：安全生产责任制落实情况、安全隐患排查治理情况、安全培训教育情况、应急救援预案制定及演练情况等。</div>
        <div style="margin-bottom: 15px;"><strong style="font-weight: bold;">三、工作要求</strong>：各单位要高度重视本次专项检查，成立专项工作小组，细化检查方案，对排查出的安全隐患要建立台账，限期整改，确保整改到位。</div>
    </div>
    <div style="text-align: right; color: #333;">
        <div style="margin-bottom: 5px;">XX省XX市人民政府办公厅</div>
        <div style="margin-bottom: 5px;">2026年1月21日</div>
    </div>
    <div style="margin-top: 50px; font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
        抄送：省应急管理厅，市委办公室，市人大办公室，市政协办公室。<br>
        XX市人民政府办公厅 2026年1月21日印发
    </div>
</div>`,
      options: {
        markdownIt: {
          linkify: true,
          html: true,
          typographer: true,
        },
        linkAttributes: {
          attrs: {
            target: '_self',
            rel: 'noopener',
          },
        },
        mermaid: {
          securityLevel: 'loose',
          theme: 'forest',
        },
      },
      flowData: {
        r1Think: '',
        think: '', //判断标签thinking时，将思考的流放置在此
        question: '', //判断ask_followup_question时，将问题的流放置在此
        questionList: [], //问题选择列表列表
        complete:
          '```mermaid\ngraph TD\n    A[统计工单数量] --> B[筛选近三日]\n    B --> C[按热力站聚合]\n    C --> D[排序取前五]\n    D --> E[获取运行工况]\n    E --> F[分析一次参数]\n    F --> G[评估运行状态]\n```', //判断attempt_completion时，将完成的流放置在此
        allMessage:
          '<thinking>第二阶段：构建可执行分析框架。根据第一阶段获取的业务规则，提炼出核心分析路径，生成简洁的Mermaid脑图，聚焦“工单数量统计 → 排名前五热力站 → 运行工况分析”主干流程。</thinking>\n```mermaid\ngraph TD\n    A[统计工单数量] --> B[筛选近三日]\n    B --> C[按热力站聚合]\n    C --> D[排序取前五]\n    D --> E[获取运行工况]\n    E --> F[分析一次参数]\n    F --> G[评估运行状态]\n',
        target: 'attempt_completion', //必须要检测到标签不然就会报错
        serverName: '', //模拟服务
        toolName: '', //测试工具
        arguments: {}, //工具参数
        toolUseState: null, //工具使用状态 0:调中用 1:使用成功 2:使用失败
        toolErrorMessage: '', //工具使用失败的错误信息
        toolId: '', //工具调用ID
        streamStop: false,
        mermaid: true,
      },
      index: 0,
      flow: null,
      replaceStr: '',
    }
  },
  created() {},
  mounted() {
    this.redDocumentMd = `
<!-- 标题区域 -->
<div style="font-size: 16px; font-weight: 500; margin-bottom: 15px;">多维风险等级评估完成。</div>

<!-- 图表容器（Flex布局，匹配参考图的左右分布） -->
<div style="display: flex; gap: 20px; margin-bottom: 20px;">
  <!-- 左侧：风险维度评估（雷达图） -->
  <div style="width: 50%;"><div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">风险维度评估</div>\n\n${this.echart1}\n\n</div>
  <!-- 右侧：行为轨迹分布（柱状图） -->
  <div style="width: 50%;"><div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">行为轨迹分布</div>\n\n${this.echart2}\n\n</div>
</div>

<!-- 研判专家综合意见（匹配参考图的蓝色背景模块） -->
<div style="background-color: #1890ff; color: white; border-radius: 4px; padding: 15px;">
  <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
    <div style="background-color: white; color: #1890ff; width: 60px; height: 60px; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div style="font-size: 20px; font-weight: bold;">95</div>
      <div style="font-size: 12px;">Score</div>
      <div style="font-size: 10px;">高风险风险等级</div>
    </div>
    <div style="font-weight: 500;">研判专家综合意见</div>
  </div>
  <div style="font-size: 14px; line-height: 1.5;">
    "系统基于多源实体画像穿透，判定该对象在重点区域存在显著的聚集与流窜规律。建议加强布控，并在后续研判中深度挖掘其关联网络底层节点。"
  </div>
</div>
`
    this.flow = this.flowBasedPreprocessing(this.flowData)
    //  this.$nextTick(()=>{
    //    let chart = echarts.init(this.$refs.echart)
    //   chart.setOption(this.option)
    //  })
  },
  methods: {
    hdlCmplete() {},
    flowBasedPreprocessing(item) {
      //标签开始
      let tagStart = -1
      let tagEnd = -1
      let buffer = ''
      let targetEnd = -1
      let target = ''
      let jsonData = ''
      const targetList = [
        'think',
        'thinking',
        'question',
        'options',
        '/options',
        'tool_name',
        'server_name',
        'ask_followup_question',
        'use_mcp_tool',
        'attempt_completion',
        'car_number_choose',
        'id_number_choose',
        'person_property_choose',
        'knowledge_recall',
        'phone_number_choose',
        'result',
        'arguments',
        '/arguments',
        'use_skills',
        'skills_name',
      ]
      const needEndList = ['/center', '/dev', '/span', '/i']
      const handleBuffer = (field) => {
        if (targetEnd != -1 && !item.mermaid && tagEnd != -1) {
          console.log(buffer, '++++++++++++buffer')
          const tag = buffer.substring(tagStart + 1, tagEnd)
          const needTag = needEndList.includes(tag) ? true : false
          if (needTag) {
            item[field] += buffer.slice(0, tagEnd + 1)
            buffer = buffer.substring(tagEnd + 1)
            return
          }
          item[field] += buffer.slice(0, targetEnd)
          buffer = buffer.substring(tagEnd + 1)
          target = ''
          return
        } else if (targetEnd != -1 && !item.mermaid && tagEnd == -1) {
          item[field] += buffer.slice(0, targetEnd)
          buffer = buffer.substring(targetEnd)
          return
        }
        if (item.mermaid && buffer.indexOf('```') != -1) {
          let mermaidIndex = buffer.indexOf('```')
          item[field] += buffer.slice(0, mermaidIndex + 3)
          buffer = buffer.slice(mermaidIndex + 3)
          item.mermaid = false
          return
        } else if (
          item.mermaid &&
          buffer.indexOf('`') != -1 &&
          buffer.length < 5
        ) {
          let mermaidIndex = buffer.indexOf('`')
          item[field] += buffer.slice(0, mermaidIndex)
          buffer = buffer.slice(mermaidIndex)
          return
        }
        if (!item.mermaid && buffer.indexOf('```') != -1) {
          let mermaidIndex = buffer.indexOf('```')
          item[field] += buffer.slice(0, mermaidIndex + 3)
          buffer = buffer.slice(mermaidIndex + 3)
          item.mermaid = true
          return
        }
        if (item.mermaid) {
          item[field] += buffer
          buffer = ''
        }
        if (!item.mermaid) {
          //为什么要写这个怕有些模型是后端按长度切割的字符串，他们会可能把结束标签的</的<单独切开了，这要是把buffer置空了，那就会导致检测不到结束标签
          if (
            (buffer.includes('<') && buffer.length < 15) ||
            (buffer.includes('<') && item.target == 'use_mcp_tool')
          ) {
            return
          }
          item[field] += buffer
          buffer = ''
        }
      }
      return (check, notarget) => {
        item.allMessage += check
        buffer += check
        tagStart = buffer.lastIndexOf('<')
        tagEnd = buffer.lastIndexOf('>')
        targetEnd = buffer.indexOf('</')
        //标签为空才需要判断并且提取标签
        if (!target && tagStart != -1 && tagEnd != -1 && tagEnd > tagStart) {
          target = buffer.substring(tagStart + 1, tagEnd)
          target = targetList.includes(target) ? target : ''
          if (targetEnd != -1 && target) {
            jsonData = buffer.slice(0, targetEnd)
            buffer = buffer.substring(tagEnd + 1)
          } else if (targetEnd == -1 && target) {
            buffer = buffer.slice(tagEnd + 1)
            targetEnd = buffer.indexOf('</')
          }
          tagStart = -1
          tagEnd = -1
        }
        if (!item.target && !target && tagStart == -1) {
          notarget == 'complete' &&
            item.target == '' &&
            ((item.target = 'attempt_completion'), (target = 'result'))
          handleBuffer(notarget)
        }
        switch (target) {
          case '':
            break
          case 'think':
            handleBuffer('r1Think')
            break
          case 'thinking':
            handleBuffer('think')
            break
          //解析question第二层的的问题标签,并且将标签转为数组给问题，需要做非空判断，因为cline遇到过没有问题的情况
          case '/options':
            jsonData && (item.questionList = JSON.parse(jsonData))
            jsonData = ''
            target = ''
            break
          case 'question':
            handleBuffer('question')
            break
          case '/arguments':
            jsonData && (item.arguments = JSON.parse(jsonData))
            jsonData = ''
            target = ''
            break
          case 'tool_name':
            handleBuffer('toolName')
            break
          case 'server_name':
            handleBuffer('serverName')
            break
          //最外层的标签只是做一个标示并无解析意义，具体标签具体解析
          case 'skills_name':
            handleBuffer('skillsName')
            break
          case 'ask_followup_question':
            item.target = target
            target = ''
            break
          case 'use_skills':
            item.target = target
            target = ''
             break
          case 'use_mcp_tool':
            item.target = target
            target = ''
            break
          case 'attempt_completion':
            item.target = target
            target = ''
            break
          case 'car_number_choose':
            item.target = target
            target = ''
            break
          case 'id_number_choose':
            item.target = target
            target = ''
            break
          case 'person_property_choose':
            item.target = target
            target = ''
            break
          case 'knowledge_recall':
            item.target = target
            target = ''
            break
          case 'phone_number_choose':
            item.target = target
            target = ''
            break
          case 'result':
            handleBuffer('complete')
            break
          default:
            target = ''
            break
        }
        console.log(JSON.parse(JSON.stringify(item)), 'flow---')
        return item
      }
    },
    onclick() {
      this.flow('`', 'think')
      this.index++
    },
    download() {
      const htmlContent = this.$refs.markdown.$el
      const clonedElement = htmlContent.cloneNode(true)
      const svgElements = clonedElement.querySelectorAll('svg')
      const svgPromises = Array.from(svgElements).map((svg) => {
        return new Promise((resolve) => {
          if (svg.id) {
            const svgRect = htmlContent
              .querySelector(`#${svg.id}`)
              .getBoundingClientRect()
            if (this.theme == 'dark') {
              const rects = svg.querySelectorAll('rect')
              rects.forEach((rect) => {
                rect.setAttribute('style', 'fill:#1f2020;')
              })
            }
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const width = svgRect.width
            const height = svgRect.height
            canvas.width = width
            canvas.height = height
            const svgString = new XMLSerializer().serializeToString(svg)
            const img = new Image()
            img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
              svgString
            )}`
            img.onload = () => {
              ctx.drawImage(img, 0, 0, width, height)
              const dataURL = canvas.toDataURL('image/png')
              const newImg = new Image()
              newImg.src = dataURL
              newImg.width = width
              newImg.height = height
              const parent = svg.parentNode
              parent.tagName == 'PRE'
                ? parent.replaceWith(newImg)
                : svg.replaceWith(newImg)
              resolve()
            }
          } else {
            resolve() // 如果没有id，直接resolve
          }
        })
      })
      // 2. 修复后的Canvas转图片逻辑（核心修改部分）
      const canvasElements = clonedElement.querySelectorAll('canvas')
      const canvasPromises = Array.from(canvasElements).map(
        (canvasNode, index) => {
          return new Promise((resolve) => {
            // 关键修复1：获取原DOM中的Canvas（不是克隆后的），因为克隆节点丢失绘图数据
            const originalCanvas = htmlContent.querySelectorAll('canvas')[index]
            if (!originalCanvas) {
              resolve()
              return
            }

            // 关键修复2：正确获取Canvas绘图宽高（区分属性宽高和CSS宽高）
            // width/height属性：Canvas的绘图分辨率，必须是数字
            const canvasWidth =
              originalCanvas.width ||
              parseInt(originalCanvas.style.width) ||
              400
            const canvasHeight =
              originalCanvas.height ||
              parseInt(originalCanvas.style.height) ||
              300

            // 关键修复3：校验Canvas是否有绘制内容（避免空Canvas）
            const ctx = originalCanvas.getContext('2d')
            const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
            const hasContent = imageData.data.some((pixel) => pixel !== 0) // 检测是否有非透明像素

            if (!hasContent) {
              console.warn(`第${index + 1}个Canvas无绘制内容`)
              // 无内容时创建空白图片（避免透明异常）
              const emptyImg = new Image()
              emptyImg.src =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
              emptyImg.width = canvasWidth
              emptyImg.height = canvasHeight
              canvasNode.replaceWith(emptyImg)
              resolve()
              return
            }

            try {
              // 关键修复4：从原Canvas生成dataURL（保证有内容）
              const dataURL = originalCanvas.toDataURL('image/png')
              const newImg = new Image()

              // 图片加载完成后替换克隆节点中的Canvas
              newImg.onload = () => {
                newImg.width = canvasWidth
                newImg.height = canvasHeight
                canvasNode.replaceWith(newImg) // 替换克隆节点中的Canvas
                resolve()
              }

              // 加载失败兜底
              newImg.onerror = () => {
                canvasNode.replaceWith(
                  document.createTextNode('Canvas图片加载失败')
                )
                resolve()
              }

              newImg.src = dataURL
            } catch (e) {
              // 处理跨域等异常
              console.error('Canvas转图片失败：', e)
              canvasNode.replaceWith(
                document.createTextNode('Canvas转图片失败：' + e.message)
              )
              resolve()
            }
          })
        }
      )
      const allPromises = [...svgPromises, ...canvasPromises]
      Promise.all(allPromises).then(() => {
        this.buildWord('文档名称', clonedElement.firstElementChild.innerHTML)
      })
    },
    buildWord(docTitle, htmlContent) {
      try {
        const fullHTML = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body {
                                font-family: 'SimSun', sans-serif;
                                max-width: 800px;
                                margin: 0 auto;
                                padding: 20px;
                            }

                            .red-header {
                                text-align: center;
                                padding: 25px 0 8px 0;
                                border-bottom: 3px solid red;
                                margin-bottom: 35px;
                            }

                            .institution {
                                font-size: 34px;
                                font-weight: bold;
                                color: red;
                                letter-spacing: 4px;
                                margin-bottom: 12px;
                            }
                            .sign-in{
                                font-size: 38px;
                                font-weight: bold;
                                color: red;
                                letter-spacing: 4px;
                                margin-bottom: 12px;
                            }
                            .unit-file{
                                font-size: 20px;
                                color: #000;
                                font-size: 28px;
                                font-weight: bold;
                            }
                            .doc-number {
                                font-size: 24px;
                                font-weight: bold;
                            }

                            .document-title {
                                font-size: 28px;
                                font-weight: bold;
                                margin: 30px 0;
                                text-align: center;
                            }

                            .document-content {
                                line-height: 1.8;
                                font-size: 16px;
                                margin-bottom: 35px;
                            }

                            .footer {
                                text-align: center;
                                margin-top: 40px;
                                color: #666;
                                font-size: 14px;
                            }

                            h1, h2, h3, h4, h5 {
                                margin: 10px 0 8px;
                            }

                            p {
                                margin: 0;
                                text-indent: 2em;
                            }

                            ul li {
                              list-style-type: disc !important;
                            }

                           .document-content li {
                              margin: 1px 0;   /* 大幅减少列表项间距 */
                              line-height: 1.5; /* 减小行高 */
                            }
                            strong {
                                font-weight: bold;
                                margin-bottom:6px;
                            }
                            table{
                              border-collapse: collapse; /* 合并单元格边框，消除间距 */
                            }
                            }
                            table td, table th {
                              padding: 6px 13px;
                              border: 1px solid #dfe2e5;
                            }

                            .ql-font-song { font-family: 'SimSun', serif !important; }
                            .ql-font-microsoftyahei { font-family: 'Microsoft YaHei', sans-serif !important; }
                            .ql-font-hei { font-family: 'SimHei', sans-serif !important; }
                            .ql-font-kaiti { font-family: 'KaiTi', serif !important; }
                            .ql-font-fangsong { font-family: 'FangSong', serif !important; }

                            .ql-size-12px { font-size: 12px !important; }
                            .ql-size-14px { font-size: 14px !important; }
                            .ql-size-16px { font-size: 16px !important; }
                            .ql-size-18px { font-size: 18px !important; }
                            .ql-size-20px { font-size: 20px !important; }

                            .ql-bold { font-weight: bold !important; }
                            .ql-italic { font-style: italic !important; }
                            .ql-underline { text-decoration: underline !important; }
                            .ql-strike { text-decoration: line-through !important; }

                            .ql-align-center { text-align: center !important; }
                            .ql-align-left { text-align: left !important; }
                            .ql-align-right{
                                text-align: right;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="document-content">
                            ${htmlContent}
                        </div>
                    </body>
                    </html>
                `
        // 使用html-docx-js转换
        const converted = htmlDocx.asBlob(fullHTML, {
          orientation: 'portrait',
          margins: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
          }, // 2.54cm 边距
        })
        // const blob = htmlDocx.asBlob(clonedElement.innerHTML)
        const url = URL.createObjectURL(converted)
        const link = document.createElement('a')
        link.href = url
        link.download = `${docTitle}.docx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        // 保存文件
        // saveAs(converted, `${docTitle}.docx`)
      } catch (error) {
        console.error('生成文档时出错:', error)
      }
    },
    onTime() {
      setInterval(() => {
        if (this.index <= this.str.length) {
          this.onclick()
        }
      }, 100)
    },
    // 2. 解码：还原原始字符串
    htmlDecode(str) {
      return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
    },
    extractMermaid() {
      const domList = this.$refs.markdown.$el.querySelectorAll('.mermaid-error')
      if (domList.length) {
        const domArr = Array.from(domList)
        const requestList = domArr.map((item) => {
          this.replaceStr = this.htmlDecode(item.dataset.code)
          return {
            optimizeContent: JSON.stringify({
              error: this.htmlDecode(item.dataset.error),
              mermaidCode: this.htmlDecode(item.dataset.code),
            }),
            promptConfigName: 'DEFAULT_MERMAID_ERROR_MODEL_NAME',
          }
        })
        console.log(requestList)
      }
    },
    replaceOnceText(originalStr, matchTarget, newReplaceStr) {
      const firstIndex = originalStr.indexOf(matchTarget)
      let newStr = originalStr
      if (firstIndex !== -1) {
        newStr =
          originalStr.slice(0, firstIndex) +
          newReplaceStr +
          originalStr.slice(firstIndex + matchTarget.length)
      }
      return newStr
    },
    replace() {
      const str = this.replaceOnceText(
        this.content,
        this.replaceStr,
        'graph TD\n    A[统计工单数量] --> B[筛选近三日]\n    B --> C[按热力站聚合]\n    C --> D[排序取前五]\n    D --> E[获取运行工况]\n    E --> F[分析一次参数]\n    F --> G[评估运行状态]'
      )
      this.content = str
    },
  },
}
</script>

<style scoped>
.container {
  display: inline-flex;
  width: 100%;
}

.md-text {
  width: 47%;
}

.md-body {
  width: 50%;
  margin-left: 20px;
}
</style>
