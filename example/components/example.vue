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
        :codeBlockType="flowData.codeBlockType"
        :streamDone="flowData.streamStop"
        theme="purple"
        @html-preview="handleHtmlPreview"
        @html-download="handleHtmlDownload"
      />
    </div>
    <div
      v-if="showPreviewModal"
      class="preview-modal"
      @click="showPreviewModal = false"
    >
      <div class="preview-content" @click.stop>
        <div class="preview-header">
          <span>HTML 预览</span>
          <button @click="showPreviewModal = false">关闭</button>
        </div>
        <iframe ref="previewFrame" class="preview-body" />
      </div>
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
        `- 整体状态：通过

- 二次供水温度：通过，已找到结构化证据

\`\`\`echarts
{
  "width": 800,
  "height": 420,
  "tooltip": {
    "trigger": "axis",
    "backgroundColor": "#272237",
    "borderColor": "#8164FF",
    "borderWidth": 1,
    "textStyle": { "color": "#FFFFFF", "fontSize": 14, "fontWeight": 500 }
  },
  "legend": {
    "data": ["推荐二次供温(℃)", "室外温度(℃)"],
    "top": 10,
    "textStyle": { "color": "rgba(255, 255, 255, 0.7)" }
  },
  "grid": {
    "left": 70,
    "right": 70,
    "bottom": 70,
    "top": 70
  },
  "xAxis": {
    "type": "category",
    "boundaryGap": false,
    "data": ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    "axisLine": { "show": true, "lineStyle": { "color": "rgba(255, 255, 255, 0.32)", "width": 2 } },
    "axisTick": { "show": false },
    "axisLabel": { "show": true, "color": "rgba(255, 255, 255, 0.7)", "interval": 0, "rotate": 45 }
  },
  "yAxis": [
    {
      "type": "value",
      "name": "供温(℃)",
      "nameTextStyle": { "color": "rgba(255, 255, 255, 0.7)" },
      "min": 0,
      "max": 60,
      "position": "left",
      "axisLine": { "show": false },
      "axisLabel": { "show": true, "color": "rgba(255, 255, 255, 0.7)" },
      "axisTick": { "show": false },
      "splitLine": { "lineStyle": { "color": "rgba(255, 255, 255, 0.16)" } }
    },
    {
      "type": "value",
      "name": "室外温(℃)",
      "nameTextStyle": { "color": "rgba(255, 255, 255, 0.7)" },
      "min": -4,
      "max": 10,
      "interval": 2,
      "position": "right",
      "axisLine": { "show": false },
      "axisLabel": { "show": true, "color": "rgba(255, 255, 255, 0.7)" },
      "axisTick": { "show": false },
      "splitLine": { "lineStyle": { "color": "rgba(255, 255, 255, 0.16)" } }
    }
  ],
  "series": [
    {
      "name": "推荐二次供温(℃)",
      "type": "line",
      "yAxisIndex": 0,
      "data": [53.2, 53.5, 50.1, 52.4, 52.0, 53.0, 52.8, 53.5, 52.9, 51.2, 50.0, 48.5, 46.8, 46.5, 46.8, 47.2, 47.5, 48.0, 49.0, 49.5, 50.0, 50.3, 50.8, 51.2],
      "symbolSize": 8,
      "lineStyle": { "color": "#EDE654", "width": 3 },
      "itemStyle": { "color": "#EDE654" },
      "areaStyle": { "origin": "start", "color": { "type": "linear", "x": 0, "y": 0, "x2": 0, "y2": 1, "colorStops": [{ "offset": 0, "color": "#ede65466" }, { "offset": 1, "color": "#ede65400" }] } },
      "smooth": false
    },
    {
      "name": "室外温度(℃)",
      "type": "line",
      "yAxisIndex": 1,
      "data": [-2.1, -2.3, 0.5, 3.2, 1.8, 0.2, 1.5, 2.0, 3.5, 4.2, 5.5, 6.8, 7.5, 8.8, 9.2, 8.5, 7.8, 6.5, 4.2, 3.0, 2.8, 2.5, 1.8, 0.5],
      "symbolSize": 8,
      "lineStyle": { "color": "#666EEC", "width": 3 },
      "itemStyle": { "color": "#666EEC" },
      "areaStyle": { "origin": "start", "color": { "type": "linear", "x": 0, "y": 0, "x2": 0, "y2": 1, "colorStops": [{ "offset": 0, "color": "#666eec66" }, { "offset": 1, "color": "#666eec00" }] } },
      "smooth": true
    }
  ]
}
\`\`\``,
      str: "\n\n好的，我来分析广东省在全国范围内出现异常高增长的案件类型。我将使用数据问答工具查询案件基本信息分类表的数据。\n\n<use_mcp_tool>\n<server_name>小智数据问答</server_name>\n<tool_name>53_mcplink_data_answer_get_dmc_data_tbdata</tool_name>\n<arguments>\n{\n    \"searchParams\": {\n        \"query\": \"统计广东省各类案件类型的案件数量，按年份分组，并与全国各类案件数量进行对比，找出广东省增长异常高的案件类型\",\n        \"tbIds\": \"tb_f1cf411f82a34ce793800725c9f6a865\"\n    }\n}\n</arguments>\n",
      redDocumentMd: '',
      htmlContent:
        '```html\n<div style="width:210mm;min-height:297mm;background:#fff;padding:37mm 26mm 35mm 28mm;position:relative;box-shadow:0 0 10px rgba(0,0,0,0.1);font-family:仿宋,FangSong_GB2312,SimSun,serif;margin:0 auto;">\n  <div style="width:158.3mm;font-family:黑体,sans-serif;margin-bottom:5mm;">\n    <div>非密★2026年</div>\n    <div>一般</div>\n  </div>\n\n  <h1 style="font-family:方正小标宋简体,小标宋体,华文中宋,SimSun;font-size:45pt;color:#FF0000;text-align:center;margin:0 0 10mm 0;">政工会会议纪要</h1>\n\n  <div style="width:157.5mm;margin-bottom:10mm;">\n    <div style="text-align:center;margin-bottom:2mm;">〔2026〕XX号</div>\n    <div style="display:flex;justify-content:space-between;">\n      <span>党委行政办公室</span>\n      <span>2026年5月20日</span>\n    </div>\n  </div>\n\n  <h2 style="font-family:方正小标宋简体,小标宋体,华文中宋,SimSun;font-size:22pt;text-align:center;margin:10mm 0 8mm 0;">关于2026年度重点工作推进安排的会议纪要</h2>\n\n  <div style="margin-bottom:6mm;">主送：各部门、各单位</div>\n\n  <p style="font-size:16pt;text-align:justify;text-indent:2em;margin-bottom:6mm;">为进一步统一思想、明确任务、压实责任，切实推动年度各项工作落地见效，单位召开政工工作专题会议。会议全面总结前期工作开展情况，分析当前存在的问题与不足，研究部署下一阶段重点任务。相关负责同志及各部门负责人参加会议。</p>\n  <p style="font-size:16pt;text-align:justify;text-indent:2em;margin-bottom:6mm;">会议议定：一是强化理论武装，持续抓好思想政治教育，提升队伍整体素质；二是细化工作举措，对照年度目标逐项分解任务，明确时限要求；三是加强作风建设，严明工作纪律，提高执行效能；四是统筹安全与发展，做好风险防控，保障各项工作平稳有序。</p>\n  <p style="font-size:16pt;text-align:justify;text-indent:2em;margin-bottom:6mm;">会议要求，各部门要提高站位、密切配合、狠抓落实，及时报送工作进展，确保高质量完成全年各项目标任务。</p>\n\n  <div style="margin-top:8mm;font-size:16pt;">附件：无</div>\n\n  <table style="width:100%;border-collapse:collapse;margin-top:25mm;font-size:14pt;">\n    <tr>\n      <td style="border:1px solid #000;padding:2mm;vertical-align:middle;"></td>\n      <td colspan="4" style="border:1px solid #000;padding:2mm;vertical-align:middle;">主送：各部门、各单位</td>\n    </tr>\n    <tr>\n      <td style="border:1px solid #000;padding:2mm;vertical-align:middle;"></td>\n      <td colspan="4" style="border:1px solid #000;padding:2mm;vertical-align:middle;">抄送：相关领导</td>\n    </tr>\n    <tr>\n      <td colspan="3" style="border:1px solid #000;padding:2mm;vertical-align:middle;">XX单位</td>\n      <td colspan="2" style="border:1px solid #000;padding:2mm;vertical-align:middle;">2026年5月20日印发</td>\n    </tr>\n    <tr>\n      <td colspan="2" style="border:1px solid #000;padding:2mm;vertical-align:middle;">联系人：</td>\n      <td colspan="2" style="border:1px solid #000;padding:2mm;vertical-align:middle;">电话：</td>\n      <td style="border:1px solid #000;padding:2mm;vertical-align:middle;">共印份</td>\n    </tr>\n  </table>\n\n  <div style="position:absolute;bottom:20mm;left:50%;transform:translateX(-50%);font-size:14pt;">—1—</div>\n</div>```',
      options: {
        markdownIt: {
          linkify: true,
          html: false,
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
        complete: "",
        allMessage: '', //所有的消息流
        target: '', //必须要检测到标签不然就会报错
        serverName: '', //模拟服务
        toolName: '', //测试工具
        arguments: {}, //工具参数
        toolUseState: null, //工具使用状态 0:调中用 1:使用成功 2:使用失败
        toolErrorMessage: '', //工具使用失败的错误信息
        toolId: '', //工具调用ID
        streamStop: false,
        codeBlockType: null,
        streamDone: false,
      },
      index: 0,
      flow: null,
      replaceStr: '',
      testStr: '',
      showPreviewModal: false,
      previewHtml: '',
    }
  },
  created() {
    this.testStr = "<thinking>\n用户要求不调用任何工具，使用随意数据生成一个流程图，并以任务完成形式输出。根据角色定位和输出控制规则，我需要直接使用 attempt_completion 输出最终结果，因为用户明确要求不调用工具，且要求生成流程图。\n\n根据 attempt_completion 的要求，result 中必须包含：\n1. 执行步骤回顾（Markdown todolist）\n2. 分析结果（以 \"## 分析结果\" 开头）\n3. 图表规范：使用 Mermaid 生成图表，淡色主题（neutral），深色文字\n\n用户要求生成流程图，我需要创建一个简单的流程图示例，使用随意数据。\n\n由于用户明确要求不调用任何工具，我可以直接进入 attempt_completion。\n</thinking>\n\n<attempt_completion>\n<result>\n本次任务一共执行了以下步骤：\n- [x] 理解用户需求：不调用工具，使用随意数据生成流程图\n- [x] 设计流程图结构：展示一个简单的业务流程\n- [x] 使用 Mermaid 语法创建流程图\n- [x] 整合到最终输出中\n\n## 分析结果\n\n根据您的要求，我使用随意数据创建了一个简单的业务流程图，展示从需求分析到项目交付的典型流程：\n\n```mermaid\nflowchart TD\n    A[需求分析开始] --> B{需求评估}\n    B -->|通过| C[方案设计]\n    B -->|不通过| D[需求调整]\n    D --> B\n    C --> E[开发实施]\n    E --> F[测试验证]\n    F --> G{质量检查}\n    G -->|合格| H[项目交付]\n    G -->|不合格| I[问题修复]\n    I --> F\n    H --> J[流程结束]\n```\n\n> [!TIP]\n> 该流程图使用随意数据生成，展示了从需求分析到项目交付的典型业务流程，包含决策节点和反馈循环。\n\n**流程说明：**\n1. **需求分析**：项目启动阶段，明确业务需求\n2. **需求评估**：判断需求是否合理可行\n3. **方案设计**：制定详细实施方案\n4. **开发实施**：按照方案进行开发工作\n5. **测试验证**：对开发成果进行测试\n6. **质量检查**：评估项目质量是否达标\n7. **项目交付**：将合格产品交付给客户\n\n该流程图使用 Mermaid 语法绘制，采用淡色主题和深色文字，符合图表规范要求。由于使用随意数据，具体节点内容和流程可根据实际业务场景调整。\n</result>\n</attempt_completion>"
    // this.flowData.complete = "\n本次任务一共执行了以下步骤：\n- [x] 调用MCP工具查询可用模板列表，获取到'党委会会议纪要.docx'和'政工会会议纪要.docx'两个模板\n- [x] 根据用户需求匹配最优模板，选择'党委会会议纪要.docx'作为生成依据\n- [x] 调用MCP工具获取'党委会会议纪要.docx'模板的详细解析规则，包括版式规范、字段定义和生成要求\n- [x] 根据模板要求生成符合党政机关会议纪要语体的JSON数据结构\n- [x] 将JSON数据转换为HTML格式的文档代码，确保符合公文格式规范\n\n## 分析结果\n已根据用户要求\"请以党委会会议纪要为模板写一篇标题随意的文档\"生成了完整的会议纪要文档。文档采用标准的党政机关公文格式，包含密级标识、主标题、编号信息、正文标题、主送单位、正文内容、附件标识和版记表格等完整要素。\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"UTF-8\">\n    <title>党委会会议纪要</title>\n</head>\n<body style=\"margin: 0; padding: 0; font-family: '仿宋', 'FangSong', serif; background-color: #ffffff;\">\n    <div style=\"width: 595px; margin: 0 auto; padding: 0; box-sizing: border-box;\">\n        <!-- 密级标识 -->\n        <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 10px;\">\n            <tr>\n                <td align=\"left\" style=\"width: 50%; padding: 0;\">\n                    <div style=\"font-size: 16pt; font-weight: bold; color: #000000;\">内部</div>\n                </td>\n                <td align=\"right\" style=\"width: 50%; padding: 0;\">\n                    <div style=\"font-size: 12pt; color: #000000;\">2026年6月10日</div>\n                </td>\n            </tr>\n        </table>\n\n        <!-- 主标题 -->\n        <div style=\"text-align: center; margin: 20px 0 30px 0;\">\n            <div style=\"font-size: 22pt; font-weight: bold; color: #000000; line-height: 1.5;\">党委会会议纪要</div>\n        </div>\n\n        <!-- 编号信息 -->\n        <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px;\">\n            <tr>\n                <td align=\"left\" style=\"width: 33.33%; padding: 0;\">\n                    <div style=\"font-size: 12pt; color: #000000;\">〔2026〕第15号</div>\n                </td>\n                <td align=\"center\" style=\"width: 33.33%; padding: 0;\">\n                    <div style=\"font-size: 12pt; color: #000000;\">党委办公室</div>\n                </td>\n                <td align=\"right\" style=\"width: 33.33%; padding: 0;\">\n                    <div style=\"font-size: 12pt; color: #000000;\">签发人：张书记</div>\n                </td>\n            </tr>\n        </table>\n\n        <!-- 正文标题 -->\n        <div style=\"text-align: center; margin: 25px 0 20px 0;\">\n            <div style=\"font-size: 18pt; font-weight: bold; color: #000000; line-height: 1.5;\">关于近期重点工作部署的会议纪要</div>\n        </div>\n\n        <!-- 主送单位 -->\n        <div style=\"margin: 0 0 25px 0;\">\n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8;\">各党支部、各部门：</div>\n        </div>\n\n        <!-- 正文内容 -->\n        <div style=\"margin: 0 0 30px 0;\">\n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; text-indent: 28pt;\">\n                2026年6月10日下午，党委会在机关三楼会议室召开会议，专题研究部署近期重点工作。会议由党委书记张三同志主持，党委副书记李四、王五，党委委员赵六、钱七、孙八等同志出席会议，办公室刘九同志列席会议并作记录。\n            </div>\n            \n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; text-indent: 28pt; margin-top: 15px;\">\n                会议首先听取了各分管领导关于近期工作进展情况的汇报。李四同志汇报了思想政治建设方面的工作，王五同志汇报了组织建设情况，赵六同志汇报了纪律检查工作，钱七同志汇报了宣传工作进展，孙八同志汇报了统战工作情况。\n            </div>\n            \n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; text-indent: 28pt; margin-top: 15px;\">\n                会议认为，今年以来，在上级党委的正确领导下，各党支部、各部门认真贯彻落实党的路线方针政策，各项工作取得积极进展。思想政治建设不断加强，组织建设稳步推进，纪律检查工作成效明显，宣传工作有声有色，统战工作扎实有效。\n            </div>\n            \n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; text-indent: 28pt; margin-top: 15px;\">\n                会议指出，当前工作中仍存在一些需要改进的地方：一是理论学习深度有待加强；二是部分工作落实不够到位；三是创新意识需要进一步提升。会议要求各党支部、各部门要高度重视这些问题，采取有效措施加以解决。\n            </div>\n            \n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; text-indent: 28pt; margin-top: 15px;\">\n                会议研究决定：\n            </div>\n            \n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; margin-left: 28pt; margin-top: 10px;\">\n                一、加强理论学习。各党支部要组织党员干部深入学习党的创新理论，每月至少开展一次专题学习，确保学习效果。\n            </div>\n            \n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; margin-left: 28pt; margin-top: 10px;\">\n                二、推进工作落实。各部门要按照年度工作计划，细化工作措施，明确责任分工，确保各项工作落到实处。\n            </div>\n            \n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; margin-left: 28pt; margin-top: 10px;\">\n                三、鼓励工作创新。要支持各部门在工作中大胆探索，勇于创新，形成一批可复制、可推广的经验做法。\n            </div>\n            \n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; text-indent: 28pt; margin-top: 15px;\">\n                会议强调，各党支部、各部门要进一步提高政治站位，增强责任意识，以更加饱满的热情、更加务实的作风，推动各项工作再上新台阶。\n            </div>\n            \n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8; text-indent: 28pt; margin-top: 15px;\">\n                会议要求，办公室要加强对会议决定事项的督促检查，确保各项决策部署落到实处。各党支部、各部门要将本次会议精神及时传达到全体党员干部，并认真抓好贯彻落实。\n            </div>\n        </div>\n\n        <!-- 附件标识 -->\n        <div style=\"margin: 0 0 20px 0;\">\n            <div style=\"font-size: 14pt; color: #000000; line-height: 1.8;\">附件：1. 近期重点工作任务分解表</div>\n        </div>\n\n        <!-- 版记表格 -->\n        <table style=\"width: 100%; border-collapse: collapse; margin-top: 40px; border-top: 1px solid #000000;\">\n            <tr>\n                <td align=\"left\" style=\"width: 50%; padding: 10px 0 0 0;\">\n                    <div style=\"font-size: 12pt; color: #000000;\">主题词：党委会 会议纪要 工作部署</div>\n                </td>\n                <td align=\"right\" style=\"width: 50%; padding: 10px 0 0 0;\">\n                    <div style=\"font-size: 12pt; color: #000000;\">共印30份</div>\n                </td>\n            </tr>\n            <tr>\n                <td align=\"left\" style=\"padding: 5px 0 0 0;\">\n                    <div style=\"font-size: 12pt; color: #000000;\">抄送：上级党委，存档</div>\n                </td>\n                <td align=\"right\" style=\"padding: 5px 0 0 0;\">\n                    <div style=\"font-size: 12pt; color: #000000;\">党委办公室 2026年6月10日印发</div>\n                </td>\n            </tr>\n        </table>\n    </div>\n</body>\n</html>\n```\n"
  },
  mounted() {
    this.redDocumentMd = `
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
      const handleBuffer = (field) => {
        if (targetEnd != -1 && !item.codeBlockType) {
          if (tagEnd != -1) {
            item[field] += buffer.slice(0, targetEnd)
            buffer = buffer.substring(tagEnd + 1)
            target = ''
            return
          }
          item[field] += buffer.slice(0, targetEnd)
          buffer = buffer.substring(targetEnd)
          return
        }
        if (item.codeBlockType && buffer.indexOf('```') != -1) {
          let endIndex = buffer.indexOf('```')
          item[field] += buffer.slice(0, endIndex + 3)
          buffer = buffer.slice(endIndex + 3)
          item.codeBlockType = null
          return
        } else if (
          item.codeBlockType &&
          buffer.indexOf('`') != -1 &&
          buffer.length < 5
        ) {
          let tickIndex = buffer.indexOf('`')
          item[field] += buffer.slice(0, tickIndex)
          buffer = buffer.slice(tickIndex)
          return
        }
        if (!item.codeBlockType && buffer.indexOf('```') != -1) {
          let startIndex = buffer.indexOf('```')
          let afterTicks = buffer.slice(startIndex + 3)
          if (afterTicks.length < 15 && !afterTicks.includes('\n')) {
            item[field] += buffer.slice(0, startIndex)
            buffer = buffer.slice(startIndex)
            return
          }
          let newlineIndex = afterTicks.indexOf('\n')
          let typeCandidate =
            newlineIndex !== -1
              ? afterTicks.slice(0, newlineIndex).trim()
              : afterTicks.trim()
          if (typeCandidate) {
            item.codeBlockType = typeCandidate
            item[field] += buffer.slice(0, startIndex + 3)
            buffer = buffer.slice(startIndex + 3)
            return
          } else {
            item[field] += buffer.slice(0, startIndex + 3)
            buffer = buffer.slice(startIndex + 3)
            return
          }
        }
        if (
          !item.codeBlockType &&
          buffer.indexOf('``') != -1 &&
          buffer.length < 5
        ) {
          let tickIndex = buffer.indexOf('``')
          item[field] += buffer.slice(0, tickIndex)
          buffer = buffer.slice(tickIndex)
          return
        }
        if (
          !item.codeBlockType &&
          buffer.indexOf('`') != -1 &&
          buffer.length < 5
        ) {
          let tickIndex = buffer.indexOf('`')
          item[field] += buffer.slice(0, tickIndex)
          buffer = buffer.slice(tickIndex)
          return
        }
        if (item.codeBlockType) {
          item[field] += buffer
          buffer = ''
        }
        if (!item.codeBlockType) {
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
        if (
          !target &&
          !item.codeBlockType &&
          tagStart != -1 &&
          tagEnd != -1 &&
          tagEnd > tagStart
        ) {
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
        if (!item.target && !item.codeBlockType && !target && tagStart == -1) {
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
            jsonData && (item.questionList = JSON.parse(jsonData.trim()))
            jsonData = ''
            target = ''
            break
          case 'question':
            handleBuffer('question')
            break
          case '/arguments':
            jsonData && (item.arguments = JSON.parse(jsonData.trim()))
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
      const chunk = this.testStr.slice(this.index, this.index + 1)
      this.flow(chunk, 'think')
      this.index += 1
      if (this.index >= this.testStr.length) {
        this.flowData.streamDone = true
      }
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
        if (this.index < this.testStr.length) {
          this.onclick()
        }
      }, 50)
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
    handleHtmlPreview(rawHtml) {
      this.showPreviewModal = true
      this.$nextTick(() => {
        const iframe = this.$refs.previewFrame
        if (!iframe) return
        const doc = iframe.contentDocument || iframe.contentWindow.document
        doc.open()
        doc.write(rawHtml)
        doc.close()
      })
    },
    handleHtmlDownload(rawHtml) {
      const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>下载</title>
</head>
<body>
${rawHtml}
</body>
</html>`
      const converted = htmlDocx.asBlob(fullHTML, {
        orientation: 'portrait',
        margins: {
          top: 1440,
          right: 1440,
          bottom: 1440,
          left: 1440,
        },
      })
      const url = URL.createObjectURL(converted)
      const link = document.createElement('a')
      link.href = url
      link.download = 'download.docx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    handleMermaidError(errorInfo) {
      console.log('Mermaid渲染错误:', errorInfo)
      // 这里可以添加用户提示或其他错误处理逻辑
    },
  },
}
</script>

<style>
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

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-content {
  background: #fff;
  width: 80%;
  max-width: 900px;
  max-height: 80vh;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e1e4e8;
  font-weight: 600;
}

.preview-body {
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
}
</style>
