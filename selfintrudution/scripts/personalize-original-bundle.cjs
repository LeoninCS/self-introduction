const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const defaultAssetDir = path.join(root, "public", "assets");

const projects = [
  {
    id: "backend-internship",
    title: "后端开发实习",
    front: "/textures/gallery/bioprzod.webp",
    painted: "/textures/gallery/bioprzod_painted.webp",
    url: "mailto:xianchaoqian@foxmail.com",
    description:
      "后端开发实习经历覆盖接口开发、日志排查、指标观察、问题拆解、测试补充和服务稳定性建设。",
    techStack: [
      "/textures/gallery/jslogo.webp",
      "/textures/gallery/firebaselogo.webp",
      "/textures/gallery/netlifylogo.webp",
      "/textures/gallery/htmllogo.webp",
    ],
  },
  {
    id: "goclub",
    title: "GoClub",
    front: "/textures/gallery/monetuneprzod.webp",
    painted: "/textures/gallery/monetuneprzod_painted.webp",
    url: "https://goclub.space/",
    description:
      "GoClub 是面向 Go 后端工程师的开源社区项目，聚合内容组织、协作工具、技术分享和长期知识沉淀；项目区使用手绘卡片展示工程说明和技术栈。",
    techStack: [
      "/textures/gallery/jslogo.webp",
      "/textures/gallery/htmllogo.webp",
      "/textures/gallery/csslogo.webp",
      "/textures/gallery/netlifylogo.webp",
    ],
  },
  {
    id: "feed-system",
    title: "Feed System",
    front: "/textures/gallery/timberkittyprzod.webp",
    painted: "/textures/gallery/timberkittyprzod_painted.webp",
    url: "https://github.com/LeoninCS/feedsystem_video_go",
    description:
      "视频 Feed 流系统是 Go 后端工程项目，覆盖内容流接口、分页链路、Redis 缓存、消息队列和高并发服务稳定性。",
    techStack: [
      "/textures/gallery/jslogo.webp",
      "/textures/gallery/htmllogo.webp",
      "/textures/gallery/csslogo.webp",
      "/textures/gallery/firebaselogo.webp",
    ],
  },
  {
    id: "agent-flow",
    title: "Agent Flow",
    front: "/textures/gallery/youngmultiprzod.webp",
    painted: "/textures/gallery/youngmultiprzod_painted.webp",
    url: "https://github.com/LeoninCS/multi-agent-workflow-assistant",
    description:
      "多智能体工作流助手基于 LangGraph 思路，聚焦任务编排、工具调用、状态流转和 Agent 工程化落地。",
    techStack: [
      "/textures/gallery/reactlogo.webp",
      "/textures/gallery/tailwindlogo.webp",
      "/textures/gallery/jslogo.webp",
      "/textures/gallery/netlifylogo.webp",
    ],
  },
  {
    id: "sealos-aiops",
    title: "Sealos AIOps",
    front: "/textures/gallery/bioprzod.webp",
    painted: "/textures/gallery/bioprzod_painted.webp",
    url: "https://github.com/labring/sealos",
    description:
      "Sealos AIOps 与集群合规实践围绕 Kubernetes、巡检、合规扫描、自动化运维和云原生基础设施展开。",
    techStack: [
      "/textures/gallery/htmllogo.webp",
      "/textures/gallery/csslogo.webp",
      "/textures/gallery/jslogo.webp",
      "/textures/gallery/netlifylogo.webp",
    ],
  },
];

const studioPlatformConfig = {
  youtube: {
    color: "#2878ff",
    accentColor: "#174a9f",
    icon: "赛",
    label: "竞赛",
    shape: "tv",
  },
  blog: {
    color: "#4A90D9",
    accentColor: "#2d6cb5",
    icon: "成",
    label: "成就",
    shape: "monitor",
  },
  tiktok: {
    color: "#2f8a7a",
    accentColor: "#b65f2a",
    icon: "训",
    label: "训练",
    shape: "phone",
  },
};

const studioItems = [
  {
    id: "competition-001",
    platform: "youtube",
    title: "LeetCode 2100",
    description: "长期算法训练记录，保持对复杂度、边界条件和题型迁移的敏感度。",
    frontTexture: "/textures/studio/tvfront_filmikprojektdlamultiego.webp",
    paintedFrontTexture: "/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp",
    thumbnail: null,
    url: "https://leetcode.cn/u/mvp-u/",
    date: "竞赛能力",
    views: "算法",
    duration: "2100",
  },
  {
    id: "competition-002",
    platform: "youtube",
    title: "Codeforces 1653",
    description: "Codeforces 竞赛能力记录，训练快速建模、实现稳定性和赛后复盘。",
    frontTexture: "/textures/studio/tvfront_filmikedytowaniezdjec.webp",
    paintedFrontTexture: "/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp",
    thumbnail: null,
    url: "https://codeforces.com/profile/LeoninCS",
    date: "竞赛能力",
    views: "CF",
    duration: "1653",
  },
  {
    id: "competition-003",
    platform: "blog",
    title: "1500+ Problems",
    description: "累计 1500+ Problems，持续刷题、整理题型、复盘失误并沉淀解题模板。",
    thumbnail: null,
    url: "https://leetcode.cn/u/mvp-u/",
    date: "长期训练",
    readTime: "1500+",
  },
  {
    id: "competition-004",
    platform: "blog",
    title: "河南大学 ACM 集训队",
    description: "在 ACM 训练体系中积累团队协作、赛时分工、题目筛选和压力下交付能力。",
    thumbnail: null,
    url: "https://icpc.global/",
    date: "团队训练",
    readTime: "ACM",
  },
  {
    id: "competition-005",
    platform: "blog",
    title: "ICPC 现场经验",
    description: "具备 ICPC 现场赛经验，熟悉赛时节奏、榜单压力、罚时控制和团队协作。",
    thumbnail: null,
    url: "https://icpc.global/",
    date: "现场竞赛",
    readTime: "ICPC",
  },
  {
    id: "achievement-001",
    platform: "tiktok",
    title: "复杂度与边界条件",
    description: "竞赛训练强化了复杂度分析、边界条件覆盖、样例构造和调试节奏。",
    frontTexture: "/textures/studio/monitorfront_postnafbdoublewinner.webp",
    paintedFrontTexture: "/textures/studio/monitorfront_postnafbdoublewinner_painted.webp",
    thumbnail: null,
    url: "https://github.com/LeoninCS",
    date: "能力沉淀",
    views: "复杂度",
    likes: "边界",
  },
  {
    id: "achievement-002",
    platform: "tiktok",
    title: "团队竞赛协作",
    description: "在训练和比赛中积累读题分工、实现互检、策略调整和赛后复盘经验。",
    frontTexture: "/textures/studio/phonefront_followmeontiktok.webp",
    paintedFrontTexture: "/textures/studio/phonefront_followmeontiktok_painted.webp",
    thumbnail: null,
    url: "https://github.com/LeoninCS",
    date: "团队经验",
    views: "协作",
    likes: "复盘",
  },
];

const aboutRecords = {
  sotd: {
    id: "profile-identity",
    layout: "certificate_grid",
    title: "个人简介",
    items: [
      {
        label: "献超前 / LeoninCS",
        date: "后端开发实习生",
        image: "/textures/about/SOTDAYYOUNGMULTIGSAP.webp",
        url: "mailto:xianchaoqian@foxmail.com",
      },
      {
        label: "河南大学",
        date: "软件工程本科在读",
        image: "/textures/about/SOTDAYYOUNGMULTICSSWINNER.webp",
        url: "https://www.henu.edu.cn/",
      },
      {
        label: "杭州，中国",
        date: "后端 / 云原生 / AI Agent",
        image: "/textures/about/SOTDAYYOUNGMULTIORPETRON.webp",
        url: "mailto:xianchaoqian@foxmail.com",
      },
      {
        label: "求职方向",
        date: "后端开发实习",
        image: "/textures/about/SOTDAYYOUNGMULTIDESIGNNOMINESS.webp",
        url: "mailto:xianchaoqian@foxmail.com",
      },
    ],
    platformConfig: { label: "简介", color: "#1a1a1a", icon: "简介" },
  },
  sotm: {
    id: "profile-contact",
    layout: "certificate_grid",
    title: "联系方式",
    items: [
      {
        label: "邮箱",
        date: "xianchaoqian@foxmail.com",
        image: "/textures/about/SOTDAYYOUNGMULTIGSAP.webp",
        url: "mailto:xianchaoqian@foxmail.com",
      },
      {
        label: "GitHub",
        date: "github.com/LeoninCS",
        image: "/textures/about/SOTDAYYOUNGMULTICSSWINNER.webp",
        url: "https://github.com/LeoninCS",
      },
      {
        label: "X / Bilibili",
        date: "技术记录与日常入口",
        image: "/textures/about/SOTDAYYOUNGMULTIORPETRON.webp",
        url: "https://x.com/xxxmvp2",
      },
      {
        label: "Instagram / 小红书",
        date: "摄影与生活记录",
        image: "/textures/about/SOTDAYYOUNGMULTIDESIGNNOMINESS.webp",
        url: "https://www.instagram.com/forever_mvp0?igsh=MXhnNjA3ZjFkbTZwbg==",
      },
    ],
    platformConfig: { label: "联系", color: "#1a1a1a", icon: "联系" },
  },
  soty: {
    id: "profile-direction",
    layout: "certificate_grid",
    title: "技术方向",
    items: [
      {
        label: "Go / Python",
        date: "后端工程与脚本工具",
        image: "/textures/about/SOTDAYYOUNGMULTIGSAP.webp",
        url: "https://github.com/LeoninCS",
      },
      {
        label: "Kubernetes / Sealos",
        date: "云原生平台实践",
        image: "/textures/about/SOTDAYYOUNGMULTICSSWINNER.webp",
        url: "https://github.com/labring/sealos",
      },
      {
        label: "Redis / MQ / Raft",
        date: "缓存、异步链路和分布式",
        image: "/textures/about/SOTDAYYOUNGMULTIORPETRON.webp",
        url: "https://github.com/LeoninCS",
      },
      {
        label: "LangGraph / Agent Workflow",
        date: "AI Agent 工程化",
        image: "/textures/about/SOTDAYYOUNGMULTIDESIGNNOMINESS.webp",
        url: "https://github.com/LeoninCS/multi-agent-workflow-assistant",
      },
    ],
    platformConfig: { label: "方向", color: "#1a1a1a", icon: "方向" },
  },
};

const moduleDoors = [
  {
    idPrefix: "profile",
    roomId: "about",
    relativeZ: -16,
    side: "left",
    label: "简介",
    icon: "名",
    color: "#efe6f5",
    enterDistance: 25,
  },
  {
    idPrefix: "experience",
    roomId: "gallery",
    relativeZ: -30,
    side: "right",
    label: "经历",
    icon: "历",
    color: "#f5efe6",
  },
  {
    idPrefix: "competition",
    roomId: "studio",
    relativeZ: -44,
    side: "left",
    label: "竞赛",
    icon: "赛",
    color: "#e6f5ef",
  },
  {
    idPrefix: "interests",
    roomId: "contact",
    relativeZ: -58,
    side: "right",
    label: "爱好",
    icon: "趣",
    color: "#f5e6e6",
  },
];

const moduleDoorDescriptions = {
  简介: "姓名、学校、专业、联系方式和求职方向",
  经历: "后端实习、工程项目、开源协作和技术栈",
  竞赛: "LeetCode、Codeforces、ACM、ICPC 和长期训练",
  爱好: "音乐 HiFi、股票观察、摄影、骑行和生活记录",
};

const textReplacements = [
  ["itom_achievements", "leonincs_achievements"],
  ["TOMASZ SZMAJDA", "献超前 / LeoninCS"],
  ["TOM KING", "献超前 / LeoninCS"],
  ["(ITOM)", "(河南大学 · 软件工程)"],
  ["LEONINCS", "献超前 / LeoninCS"],
  ["(XIANCHAO QIAN)", "(河南大学 · 软件工程)"],
  ['"Building reliable backend systems', '"后端开发实习 · 云原生平台'],
  ['with agents and cloud-native craft"', 'AI Agent 工程 · 杭州"'],
  ["Crafting digital experiences", "后端开发实习生"],
  ["that push creative boundaries", "Go / Kubernetes / AI Agent"],
  ["Portfolio Contact", "联系方式"],
  ["Open Link ↗", "打开链接"],
  ["EXPLORER", "献超前 / LeoninCS"],
  ["Click a door to enter. Audio is currently", "点击大门进入。音频状态"],
  ["点击大门进入。音频当前", "点击大门进入。音频状态"],
  [" [🔇 OFF]", " [🔇 静音]"],
  [" [🔊 ON]", " [🔊 开启]"],
  ["Loading...", "加载中..."],
  ["OPEN PROJECT", "打开项目"],
  ["PROJECT DETAILS:", "项目说明："],
  ["TECH STACK", "技术栈"],
  ["SEND", "发送"],
  ["SENDING...", "发送中..."],
  ["email...", "邮箱..."],
  ["subject...", "主题..."],
  ["message...", "留言..."],
  ["Please fill all fields", "请填写所有字段"],
  ["Message sent! ✓", "消息已发送"],
  ["Failed to send. Try again.", "发送失败，请稍后重试。"],
  ['"aria-label":"Message"', '"aria-label":"留言"'],
  ['"aria-label":"Email"', '"aria-label":"邮箱"'],
  ['"aria-label":"Subject"', '"aria-label":"主题"'],
  ['"aria-label":"Close"', '"aria-label":"关闭"'],
  [
    'ZL.init("phc_WHnLrkRaCRM9jr9EfbjhC09me4DY0vH5Yx2K4rshkdQ",{api_host:"https://us.i.posthog.com",person_profiles:"identified_only"});',
    "void 0;",
  ],
  [
    "%cHi Jury! %cCheck out the code quality. Clean console = happy dev. 🚀",
    "%cLeoninCS %c简历站已加载",
  ],
  [
    "%cLeoninCS %cBackend portfolio loaded",
    "%cLeoninCS %c简历站已加载",
  ],
  [
    "%c LEONINCS %c PORTFOLIO %c",
    "%c 献超前 %c 简历站 %c",
  ],
  [
    'label:"LINKEDIN",onClick:()=>window.open("https://www.linkedin.com/in/tomasz-szmajda-259337305/","_blank")',
    'label:"音乐",onClick:()=>window.open("https://space.bilibili.com/491359383","_blank")',
  ],
  [
    'label:"GITHUB",onClick:()=>window.open("https://github.com/ITomPoland","_blank")',
    'label:"股票",onClick:()=>window.open("https://x.com/xxxmvp2","_blank")',
  ],
  [
    'label:"FACEBOOK",onClick:()=>window.open("https://www.facebook.com/tomasz.szmajda.58/","_blank")',
    'label:"摄影",onClick:()=>window.open("https://www.instagram.com/forever_mvp0?igsh=MXhnNjA3ZjFkbTZwbg==","_blank")',
  ],
  [
    'label:"INSTAGRAM",onClick:()=>window.open("https://www.instagram.com/itom.dev/","_blank")',
    'label:"生活",onClick:()=>window.open("https://xhslink.com/m/68F5FSoWMxt","_blank")',
  ],
  [
    'label:"GITHUB",onClick:()=>window.open("https://github.com/LeoninCS","_blank")',
    'label:"音乐",onClick:()=>window.open("https://space.bilibili.com/491359383","_blank")',
  ],
  [
    'label:"BILIBILI",onClick:()=>window.open("https://space.bilibili.com/491359383","_blank")',
    'label:"股票",onClick:()=>window.open("https://x.com/xxxmvp2","_blank")',
  ],
  [
    'label:"X",onClick:()=>window.open("https://x.com/xxxmvp2","_blank")',
    'label:"摄影",onClick:()=>window.open("https://www.instagram.com/forever_mvp0?igsh=MXhnNjA3ZjFkbTZwbg==","_blank")',
  ],
  [
    'label:"INSTAGRAM",onClick:()=>window.open("https://www.instagram.com/forever_mvp0?igsh=MXhnNjA3ZjFkbTZwbg==","_blank")',
    'label:"生活",onClick:()=>window.open("https://xhslink.com/m/68F5FSoWMxt","_blank")',
  ],
  ['label:"MESSAGE",onClick:O', 'label:"骑行",onClick:()=>window.open("/picture/38-bike-coastal-road.jpg","_blank")'],
  ['label:"EMAIL",onClick:O', 'label:"骑行",onClick:()=>window.open("/picture/38-bike-coastal-road.jpg","_blank")'],
  ["Accessible navigation for 3D portfolio", "3D 简历站无障碍导航"],
  ["3D 作品集无障碍导航", "3D 简历站无障碍导航"],
  ["Skip to accessible navigation", "跳转到导航"],
  ["Portfolio rooms", "简历房间"],
  ["作品集房间", "简历房间"],
  ["ITom — Creative Developer Portfolio", "献超前 — 后端开发实习生简历"],
  ["LeoninCS — 后端工程作品集", "献超前 — 后端开发实习生简历"],
  ["Portfolio Navigation", "简历导航"],
  ["作品集导航", "简历导航"],
  [
    "Welcome to ITom's interactive 3D portfolio. Click or press Enter on the doors to enter.",
    "欢迎来到献超前的交互式 3D 简历站。点击门或按 Enter 进入。",
  ],
  [
    "欢迎来到 LeoninCS 的交互式 3D 作品集。点击门或按 Enter 进入。",
    "欢迎来到献超前的交互式 3D 简历站。点击门或按 Enter 进入。",
  ],
  ["You are in the corridor. Choose a room to explore:", "你正在走廊中。选择一个房间探索："],
  ["About — My story, skills, and journey", "简介 — 姓名、学校、专业、联系方式"],
  ["The Gallery — My projects and work", "经历 — 实习经历、项目经历和技术栈"],
  ["Contact — Get in touch with me", "爱好 — 音乐、股票、摄影和骑行"],
  ["The Studio — Technologies and experience", "竞赛 — 奖项成就、算法训练和 ACM"],
  ["关于 — 经历、技能和长期方向", "简介 — 姓名、学校、专业、联系方式"],
  ["联系 — GitHub、邮箱和社交入口", "爱好 — 音乐、股票、摄影和骑行"],
  ["工作台 — 技术笔记和摄影展览", "竞赛 — 奖项成就、算法训练和 ACM"],
  ["You are in the ", "当前位置："],
  [" room.", " 房间。"],
  ["Entered ", "已进入 "],
  [" room`", " 房间`"],
  ["Go back to corridor", "回到走廊"],
  ["About Me", "个人简介"],
  ["关于我", "个人简介"],
  [
    "This room contains my personal story, awards, journey milestones, and technology skills displayed as interactive balloons.",
    "这里展示姓名、学校、专业、联系方式、所在地和求职方向。",
  ],
  [
    "这里展示我的工程经历、算法训练、开源协作和长期技能积累。",
    "这里展示姓名、学校、专业、联系方式、所在地和求职方向。",
  ],
  ["My Projects", "经历清单"],
  [
    "Browse through my portfolio projects displayed on paper cards. Click on a project card to see details and visit the live site.",
    "浏览纸张卡片上的后端实习、GoClub、Feed System、Agent Flow 和 Sealos AIOps。",
  ],
  ["Contact Me", "爱好记录"],
  ["联系我", "爱好记录"],
  [
    "Find my social media links displayed as floating barrels. Click to visit my profiles on LinkedIn, GitHub, and other platforms.",
    "漂浮木桶里放着音乐、股票观察、摄影、骑行和生活记录入口。",
  ],
  [
    "漂浮木桶里放着 GitHub、Bilibili、X、Instagram 和邮箱入口。",
    "漂浮木桶里放着音乐、股票观察、摄影、骑行和生活记录入口。",
  ],
  [
    "Explore my experience and skills on rotating monitors. Click a monitor to read detailed information about my work.",
    "旋转屏幕里展示 LeetCode、Codeforces、ACM、ICPC 和长期训练。",
  ],
  [
    "旋转屏幕里展示技术笔记、工程复盘、竞赛记录和摄影展览。",
    "旋转屏幕里展示 LeetCode、Codeforces、ACM、ICPC 和长期训练。",
  ],
  ["Quick Navigation", "快速导航"],
  ["Go to About", "前往简介"],
  ["Go to Gallery", "前往经历"],
  ["Go to Contact", "前往爱好"],
  ["Go to Studio", "前往竞赛"],
  ["前往关于", "前往简介"],
  ["前往工作台", "前往竞赛"],
  ["Explore my creative projects", "查看实习和项目经历"],
  ["Watch behind the scenes", "查看竞赛成就"],
  ["My development journey", "查看个人简介"],
  ["Get in touch with me", "查看爱好记录"],
  ["THE GALLERY", "经历"],
  ["THE STUDIO", "竞赛"],
  ["THE ABOUT", "简介"],
  ["LET'S CONNECT", "爱好"],
  ["DEV DIARY", "爱好"],
  ['label:"工作台"', 'label:"竞赛"'],
  ['label:"关于"', 'label:"简介"'],
  ['f==="工作台"', 'f==="竞赛"'],
  ['f==="关于"', 'f==="简介"'],
  ['l==="工作台"', 'l==="竞赛"'],
  ['l==="关于"', 'l==="简介"'],
  ['f!=="工作台"', 'f!=="竞赛"'],
  ['"工作台":"/textures/corridor/doors/drzwisocial.webp"', '"竞赛":"/textures/corridor/doors/drzwisocial.webp"'],
  ['"工作台":"/textures/corridor/doors/drzwisocial_painted.webp"', '"竞赛":"/textures/corridor/doors/drzwisocial_painted.webp"'],
  ['"关于":"/textures/corridor/doors/drzwiabout.webp"', '"简介":"/textures/corridor/doors/drzwiabout.webp"'],
  ['"关于":"/textures/corridor/doors/drzwiabout_painted.webp"', '"简介":"/textures/corridor/doors/drzwiabout_painted.webp"'],
  ['["项目","工作台","关于","联系"]', '["经历","竞赛","简介","爱好"]'],
  ['f==="工作台"?', 'f==="竞赛"?'],
  ['f==="关于"?', 'f==="简介"?'],
  ['?"About"', '?"简介"'],
  ['?"Gallery"', '?"经历"'],
  ['?"Contact"', '?"爱好"'],
  ['?"Studio"', '?"竞赛"'],
  ['children:"The Studio"', 'children:"竞赛"'],
  ['"aria-label":"About room content"', '"aria-label":"简介房间内容"'],
  ['"aria-label":"Gallery room content"', '"aria-label":"经历房间内容"'],
  ['"aria-label":"Contact room content"', '"aria-label":"爱好房间内容"'],
  ['"aria-label":"Studio room content"', '"aria-label":"竞赛房间内容"'],
  ['" views"', '" 标签"'],
  ["ACHIEVEMENTS", "成就"],
  ["AWARDS", "简介"],
  ['children:"SOTD"', 'children:"身份"'],
  ['children:"SOTM"', 'children:"联系"'],
  ['children:"SOTY"', 'children:"方向"'],
  ["/textures/about/身份AYYOUNGMULTIGSAP.webp", "/textures/about/SOTDAYYOUNGMULTIGSAP.webp"],
  ["/textures/about/身份AYYOUNGMULTICSSWINNER.webp", "/textures/about/SOTDAYYOUNGMULTICSSWINNER.webp"],
  ["/textures/about/身份AYYOUNGMULTIORPETRON.webp", "/textures/about/SOTDAYYOUNGMULTIORPETRON.webp"],
  ["/textures/about/身份AYYOUNGMULTIDESIGNNOMINESS.webp", "/textures/about/SOTDAYYOUNGMULTIDESIGNNOMINESS.webp"],
  ["/textures/about/身份.webp", "/textures/about/SOTD.webp"],
  ["/textures/about/身份_painted.webp", "/textures/about/SOTD_painted.webp"],
  ["/textures/about/联系.webp", "/textures/about/SOTM.webp"],
  ["/textures/about/联系_painted.webp", "/textures/about/SOTM_painted.webp"],
  ["/textures/about/方向.webp", "/textures/about/SOTY.webp"],
  ["/textures/about/方向_painted.webp", "/textures/about/SOTY_painted.webp"],
  ["JOURNEY", "成长路径"],
  ["My path so far...", "河南大学 / 后端实习 / 云原生"],
  ["2025-NOW", "实习阶段"],
  ["2023-NOW", "ACM 训练"],
  ["SKILLS", "技术方向"],
  ["Technologies I love working with", "Go / Python / Kubernetes / Sealos / Redis / MQ"],
  ['label:"React"', 'label:"Go"'],
  ['label:"Three.js"', 'label:"Python"'],
  ['label:"GSAP"', 'label:"Kubernetes"'],
  ['label:"JavaScript"', 'label:"Sealos"'],
  ['label:"CSS"', 'label:"Redis"'],
  ['label:"Next.js"', 'label:"MQ"'],
  ['label:"HTML"', 'label:"LangGraph"'],
  ['label:"Git"', 'label:"Raft"'],
  ['label:"Figma"', 'label:"GitHub"'],
  ['label:"Firebase"', 'label:"AI Agent"'],
  ["/fonts/CabinSketch-Bold.ttf", "/fonts/ArialUnicode.ttf"],
  ["/fonts/CabinSketch-Regular.ttf", "/fonts/ArialUnicode.ttf"],
  ["/fonts/RubikScribble-Regular.ttf", "/fonts/ArialUnicode.ttf"],
  [
    '{char:"I",baseX:-.95,splitDir:-1.6,delay:0},{char:"T",baseX:-.43,splitDir:-.6,delay:0},{char:"O",baseX:.23,splitDir:.6,delay:0},{char:"M",baseX:.95,splitDir:1.8,delay:0}',
    '{char:"献",baseX:-.72,splitDir:-1.2,delay:0},{char:"超",baseX:0,splitDir:0,delay:0},{char:"前",baseX:.72,splitDir:1.2,delay:0}',
  ],
  [
    '{text:"<",baseX:-.85,splitDir:-1.5,delay:0},{text:"creative",baseX:-.4,splitDir:-.8,delay:0},{text:"developer",baseX:.4,splitDir:.8,delay:0},{text:"/>",baseX:.85,splitDir:1.5,delay:0}',
    '{text:"LeoninCS",baseX:-.48,splitDir:-.6,delay:0},{text:"后端开发实习生",baseX:.5,splitDir:.6,delay:0}',
  ],
  ["Close achievements", "关闭成就"],
  ['label:"Click a door to enter",title:"Explorer"', 'label:"点击大门进入",title:"探索者"'],
  ['label:"Scroll to explore the corridor",title:"Wanderer"', 'label:"滚动探索走廊",title:"漫游者"'],
  ['label:"Scroll to fly through my story",title:"Sky Walker"', 'label:"滚动浏览个人经历",title:"履历浏览"'],
  ['label:"Drag to rotate and browse",title:"Director"', 'label:"拖拽旋转浏览竞赛",title:"竞赛展台"'],
  ['label:"Click project to inspect",title:"Art Critic"', 'label:"点击项目查看细节",title:"项目评审"'],
  ['label:"Find a contact method",title:"Sociable"', 'label:"打开爱好入口",title:"兴趣记录"'],
  ['" EXPLORED"', '" 已解锁"'],
  ['label:"About",x:43,y:38', 'label:"简介",x:43,y:38'],
  ['label:"Gallery",x:43,y:72', 'label:"经历",x:43,y:72'],
  ['label:"Contact",x:57,y:25', 'label:"爱好",x:57,y:25'],
  ['label:"Studio",x:57,y:55', 'label:"竞赛",x:57,y:55'],
  [
    "function L7(){const[s,e]=ce.useState(!1),[t,n]=ce.useState(!1),{settings:i,downgradeTier:r,tier:l}=HG();ce.useEffect(()=>{IO()},[]);const u=ce.useCallback(()=>{requestAnimationFrame(()=>{n(!0)})},[]);return",
    "function L7(){const[s,e]=ce.useState(!1),[t,n]=ce.useState(!1),{settings:i,downgradeTier:r,tier:l}=HG();ce.useEffect(()=>{IO()},[]);ce.useEffect(()=>{if(t)return;const p=setTimeout(()=>n(!0),4e3);return()=>clearTimeout(p)},[t]);const u=ce.useCallback(()=>{requestAnimationFrame(()=>{n(!0)})},[]);return",
  ],
  ["l?W=i/100*85:e?W=100:W=90", "e?W=100:l?W=i/100*85:W=90"],
  [
    'W.to(v.current,{opacity:0,duration:.5},"-=0.5")};if(t)return null;',
    'W.to(v.current,{opacity:0,duration:.5},"-=0.5")};ce.useEffect(()=>{if(!e)return;const W=setTimeout(()=>{n(!0),s?.()},600);return()=>clearTimeout(W)},[e,s]);if(t)return null;',
  ],
];

function replaceAll(source, from, to) {
  return source.split(from).join(to);
}

function rewriteExperienceBundle(source) {
  let output = source;
  let structuralCount = 0;
  const doorArrayReplacement = `s=d.useMemo(()=>[${moduleDoors
    .map((door) => {
      const entries = [
        `id:\`${door.idPrefix}-\${l}\``,
        `roomId:"${door.roomId}"`,
        `relativeZ:${door.relativeZ}`,
        `side:"${door.side}"`,
        `label:"${door.label}"`,
        `icon:"${door.icon}"`,
        `color:"${door.color}"`,
      ];
      if (door.enterDistance) entries.push(`enterDistance:${door.enterDistance}`);
      return `{${entries.join(",")}}`;
    })
    .join(",")}].map(o=>`;

  const transforms = [
    {
      pattern: /po=\[.*?\],So=/s,
      replacement: `po=${JSON.stringify(projects)},So=`,
    },
    {
      pattern: /Xc=\{.*?\},Vc=\[.*?\],As=/s,
      replacement: `Xc=${JSON.stringify(studioPlatformConfig)},Vc=${JSON.stringify(studioItems)},As=`,
    },
    {
      pattern: /cn=\{.*?\},Rl=/s,
      replacement: `cn=${JSON.stringify(aboutRecords)},Rl=`,
    },
    {
      pattern: /Ll=\{.*?\},pn=/s,
      replacement:
        `Ll=${JSON.stringify(moduleDoorDescriptions)},pn=`,
    },
    {
      pattern: /s=d\.useMemo\(\(\)=>\[\{id:`gallery-\$\{l\}`.*?\}\]\.map\(o=>/s,
      replacement: doorArrayReplacement,
    },
    {
      pattern: /Ws=\{.*?\},Ns=/s,
      replacement:
        'Ws={"经历":"/textures/corridor/doors/drzwiprojekty.webp","竞赛":"/textures/corridor/doors/drzwisocial.webp","简介":"/textures/corridor/doors/drzwiabout.webp","爱好":"/textures/corridor/doors/drzwikontakt.webp"},Ns=',
    },
    {
      pattern: /Ns=\{.*?\},zl=/s,
      replacement:
        'Ns={"经历":"/textures/corridor/doors/drzwiprojekty_painted.webp","竞赛":"/textures/corridor/doors/drzwisocial_painted.webp","简介":"/textures/corridor/doors/drzwiabout_painted.webp","爱好":"/textures/corridor/doors/drzwikontakt_painted.webp"},zl=',
    },
    {
      pattern: /uu=\[\{z:-18,side:"left"\},\{z:-32,side:"right"\},\{z:-48,side:"left"\},\{z:-62,side:"right"\}\]/s,
      replacement:
        'uu=[{z:-16,side:"left"},{z:-30,side:"right"},{z:-44,side:"left"},{z:-58,side:"right"}]',
    },
    {
      pattern: /cu=\{gallery:-6,studio:-20,about:-36,contact:-50\}/s,
      replacement: "cu={gallery:-18,studio:-32,about:-4,contact:-46}",
    },
  ];

  for (const { pattern, replacement } of transforms) {
    const next = output.replace(pattern, replacement);
    if (next !== output) structuralCount += 1;
    output = next;
  }

  output = output
    .replaceAll('!["项目","记录","简历","联系"].includes(l)', '!["经历","竞赛","简介","爱好"].includes(l)')
    .replaceAll('_=l==="项目"', '_=l==="经历"')
    .replaceAll('l==="记录"?', 'l==="竞赛"?')
    .replaceAll('l==="简历"?', 'l==="简介"?')
    .replaceAll('l==="联系"?', 'l==="爱好"?')
    .replaceAll('const _=l==="项目"', 'const _=l==="经历"')
    .replaceAll('f==="项目"?"gallery":f==="记录"?"studio":f==="简历"?"about":f==="联系"?"contact":null', 'f==="经历"?"gallery":f==="竞赛"?"studio":f==="简介"?"about":f==="爱好"?"contact":null')
    .replaceAll('f==="记录"?.388:.376', 'f==="竞赛"?.388:.376')
    .replaceAll('t==="about"?"简历":t==="gallery"?"项目":t==="contact"?"联系":t==="studio"?"记录":t', 't==="about"?"简介":t==="gallery"?"经历":t==="contact"?"爱好":t==="studio"?"竞赛":t')
    .replaceAll('children:"简历 — 个人信息、联系方式、实习和奖项"', 'children:"简介 — 姓名、学校、专业、联系方式"')
    .replaceAll('children:"项目 — 工程作品与开源实践"', 'children:"经历 — 实习经历、项目经历和技术栈"')
    .replaceAll('children:"联系 — 邮箱、GitHub 和社交入口"', 'children:"爱好 — 音乐、股票、摄影和骑行"')
    .replaceAll('children:"记录 — 技术栈、项目复盘和摄影展览"', 'children:"竞赛 — 奖项成就、算法训练和 ACM"')
    .replaceAll('"aria-label":"简历房间内容"', '"aria-label":"简介房间内容"')
    .replaceAll('"aria-label":"项目房间内容"', '"aria-label":"经历房间内容"')
    .replaceAll('"aria-label":"联系房间内容"', '"aria-label":"爱好房间内容"')
    .replaceAll('"aria-label":"记录房间内容"', '"aria-label":"竞赛房间内容"')
    .replaceAll('children:"简历速览"', 'children:"个人简介"')
    .replaceAll('children:"项目作品"', 'children:"经历清单"')
    .replaceAll('children:"联系方式"', 'children:"爱好记录"')
    .replaceAll('children:"记录"', 'children:"竞赛"')
    .replaceAll('children:"这里展示姓名、联系方式、实习经历、奖项竞赛和技术栈。"', 'children:"这里展示姓名、学校、专业、联系方式、所在地和求职方向。"')
    .replaceAll('children:"浏览纸张卡片上的工程项目，点击卡片查看细节和项目链接。"', 'children:"浏览纸张卡片上的后端实习、GoClub、Feed System、Agent Flow 和 Sealos AIOps。"')
    .replaceAll('children:"漂浮木桶里放着邮箱、GitHub、Bilibili、X 和 Instagram 入口。"', 'children:"漂浮木桶里放着音乐、股票观察、摄影、骑行和生活记录入口。"')
    .replaceAll('children:"旋转屏幕里展示简历重点、项目复盘、技术记录和摄影展览。"', 'children:"旋转屏幕里展示 LeetCode、Codeforces、ACM、ICPC 和长期训练。"')
    .replaceAll('children:"前往简历"', 'children:"前往简介"')
    .replaceAll('children:"前往项目"', 'children:"前往经历"')
    .replaceAll('children:"前往联系"', 'children:"前往爱好"')
    .replaceAll('children:"前往记录"', 'children:"前往竞赛"');

  return { output, structuralCount };
}

function personalizeAssetDir(assetDir = defaultAssetDir) {
  const files = ["index-DV-1WFZA.js", "Experience-QKEGsRXt.js"]
    .map((file) => path.join(assetDir, file))
    .filter((file) => fs.existsSync(file));

  for (const file of files) {
    let source = fs.readFileSync(file, "utf8");
    let count = 0;

    if (path.basename(file).startsWith("Experience-")) {
      const result = rewriteExperienceBundle(source);
      source = result.output;
      count += result.structuralCount;
    }

    for (const [from, to] of textReplacements) {
      const next = replaceAll(source, from, to);
      if (next !== source) count += 1;
      source = next;
    }

    fs.writeFileSync(file, source);
    console.log(`${path.relative(root, file)}: ${count} replacement groups applied`);
  }
}

if (require.main === module) {
  const dirs = process.argv.slice(2);
  if (dirs.length === 0) {
    personalizeAssetDir();
  } else {
    for (const dir of dirs) personalizeAssetDir(path.resolve(dir));
  }
}

module.exports = { personalizeAssetDir };
