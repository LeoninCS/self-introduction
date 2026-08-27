import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import Lenis from 'lenis';
import { FaBilibili, FaGithub, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { SiXiaohongshu } from 'react-icons/si';
import 'lenis/dist/lenis.css';
import './styles.css';
import { getScrollTuning } from './scrollTuning.js';

const avatarImage = '/picture/lc.jpg';
const mockMemberIcons = [
  { src: '/images/brand/go-gopher.svg', alt: 'Go 吉祥物图标' },
  { src: '/images/brand/github-mark.svg', alt: 'GitHub 图标' },
  { src: '/images/brand/labring.png', alt: 'LabRing 图标' },
];

const unsplashImage = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&q=82`;

const projects = [
  {
    label: 'Feed',
    title: 'GCFeed',
    caption: 'GoClubFeed 面向短视频场景，围绕内容生产、分发、消费与治理链路展开，技术栈包含 Go、Gin、GORM、Redis、MQ 和 MySQL。',
    href: 'https://github.com/LeoninCS/GCFeed',
    stack: ['Go', 'Gin', 'GORM', 'Redis', 'MQ', 'MySQL'],
    highlights: ['短视频内容流', '生产分发消费链路', '治理与缓存设计'],
    preview: ['Producer', 'Feed API', 'Redis Cache', 'MQ', 'MySQL'],
  },
  {
    label: 'Workflow',
    title: 'SDD Agent Harness',
    caption: '基于 SDD 的 Agent Harness，面向 VS Code、RAG、多 Agent 编排、自动门禁和文档回写闭环。',
    href: 'https://github.com/LeoninCS/SDD-Agent-Harness',
    stack: ['Harness', 'RAG', 'VS Code', 'Workflow', 'Docs'],
    highlights: ['多 Agent 编排', '自动门禁', '文档回写闭环'],
    preview: ['Spec', 'Harness', 'RAG', 'Gate', 'Docs'],
  },
  {
    label: 'Cloud',
    title: 'CompliK',
    caption: 'Sealos 系统组实习项目，参与集群合规系统 Admin 开发、Path 子路径合规分析、CI、多端分析插件和 ProcScan 二进制分析。',
    href: 'https://github.com/labring/CompliK',
    stack: ['Sealos', 'Kubernetes', 'CI', 'Admin', 'Path', 'ProcScan'],
    highlights: ['集群合规系统', 'Path 子路径分析', '二进制分析'],
    preview: ['Cluster', 'Admin', 'Path Scan', 'ProcScan', 'Report'],
  },
  {
    label: 'Open Source',
    title: 'GoClub',
    caption: 'Hugo + GitHub Pages + Cloudflare 搭建的 Go 后端知识库，整理面经、八股、资源索引、项目学习和技术博客。',
    href: 'https://goclub.space/',
    stack: ['Hugo', 'GitHub Pages', 'Cloudflare', 'Go'],
    highlights: ['Go 后端知识库', '资源索引', '技术博客'],
    preview: ['Interview', 'Backend', 'Projects', 'Resources', 'Blog'],
  },
];

const profileRows = [
  ['姓名', '献超前 / Xianchao Qian'],
  ['技术 ID', 'LeoninCS'],
  ['学校', '河南大学 软件工程本科在读 · 开封'],
  ['当前工作地', '上海，中国'],
  ['求职方向', '开发工程师'],
  ['技术方向', 'Cloud Infra · Go 后端 · 云原生'],
];

const internshipCards = [
  {
    eyebrow: 'Cloud Infra 实习',
    company: 'MiniMax · Cloud Infra 系统组',
    period: '2026.07.13 — 至今',
    brandLogo: 'https://filecdn.minimax.chat/public/969d635c-cab6-45cc-8d61-47c9fe40c81f.png',
    variant: 'minimax',
  },
  {
    eyebrow: '实习经历',
    company: 'Sealos · 环界云计算',
    period: '2026.03.11 — 2026.07.09',
    title: 'Sealos 系统组实习，负责 Sealos 集群合规组件建设。',
    text: '负责 Admin 面板全栈开发、Path 子路径合规分析、CompliK CI/CD 搭建、多端分析插件、ProcScan 二进制分析和系统迭代维护与优化。',
    focus: '建设和完善集群合规组件，覆盖管理面、Path 子路径与进程分析链路。',
    deliverables: [
      {
        title: 'Admin 系统适配',
        code: 'ADMIN',
        text: '负责 Admin 面板全栈开发，完成 Admin 与 CompliK 适配及 CI/CD 建设。',
      },
      {
        title: 'Path 子路径合规分析',
        code: 'PATH',
        text: '支持指定 Path 及其子路径的合规扫描、规则匹配与结果归集。',
      },
      {
        title: 'ProcScan 进程分析',
        code: 'PROC',
        text: '实现多端分析插件与 ProcScan 二进制进程分析，并持续维护优化系统。',
      },
    ],
    visualTitle: 'CompliK',
    visualText: 'Admin / Path / ProcScan / Report',
    brandLogo: '/images/brand/sealos.svg',
    variant: 'sealos',
  },
];

const competitionCards = [
  {
    eyebrow: '竞赛奖项',
    title: 'OJ 训练记录稳定可查。',
    text: 'LeetCode 2100，Codeforces 1653，累计 1500+ Problems，河南大学 ACM 集训队，具备 ICPC 现场经验。',
    note: '长期算法训练支撑复杂度分析、边界覆盖和实现稳定性。',
    visualTitle: 'LeetCode 2100',
    visualText: 'Codeforces 1653 / 1500+ Problems',
    image: unsplashImage('photo-1631350397792-8e0c2de5b637'),
    imagePosition: 'center 54%',
  },
  {
    eyebrow: '省赛与国赛',
    title: 'CCPC 河南省赛金牌和天梯赛个人国二。',
    text: '2026 年第八届 CCPC 河南省大学生程序设计竞赛金牌，O（1）团队；2026 年第十一届中国高校计算机大赛-团体程序设计天梯赛个人全国二等奖。',
    note: '团队赛与个人赛共同体现赛时分工、题目筛选和稳定交付。',
    visualTitle: 'CCPC Gold',
    visualText: 'GPLT National Second Prize',
    image: unsplashImage('photo-1504384308090-c894fdcc538d'),
    imagePosition: 'center 48%',
  },
  {
    eyebrow: '补充奖项',
    title: '蓝桥杯省一和百度之星初赛铜奖。',
    text: '2025 年第十六届蓝桥杯全国软件和信息技术专业人才大赛省赛一等奖，2025 年第二十一届百度之星程序设计大赛初赛铜奖。',
    note: '多类型竞赛经历覆盖算法基本功和短时编码能力。',
    visualTitle: 'Lanqiao / Baidu Star',
    visualText: '省一 / 初赛铜奖',
    image: unsplashImage('photo-1504384764586-bb4cdc1707b0'),
    imagePosition: 'center 46%',
  },
];

const hobbyCards = [
  {
    eyebrow: '骑行',
    title: '长距离骑行，让身体和判断力一起在线。',
    text: '骑行累计 10000+ 公里，代表路线包括环太湖、环海南岛，习惯用路线规划、体能分配和复盘记录管理长期目标。',
    visualTitle: 'Cycling 10000+ km',
    visualText: '环太湖 / 环海南岛 / 复盘记录',
    note: '长期主义从路上开始，也会回到工程节奏里。',
    image: unsplashImage('photo-1517649763962-0c623066013b'),
    imagePosition: 'center 52%',
  },
  {
    eyebrow: '摄影',
    title: '摄影记录城市、山野、湖畔和古建。',
    text: '偏爱自然光、街景、旅途和建筑细节，用照片记录观察力和审美判断。',
    visualTitle: 'Nikon Photography',
    visualText: 'Nikon / 城市 / 山野 / 古建',
    note: '照片是个人页面里的真实质感来源。',
    image: unsplashImage('photo-1488903460117-6fb0b4a4ec9f'),
    imagePosition: 'center 46%',
  },
  {
    eyebrow: '音乐与 HiFi',
    title: 'R&B、Jazz、Hip-Hop 和 Pop 是长期听感入口。',
    text: '喜欢方大同、Kendrick Lamar、SZA、Frank Ocean、J. Cole 等，也关注 FiiO KA13、Sennheiser IE 200、声场和解析。',
    visualTitle: 'Music / HiFi',
    visualText: 'R&B / Jazz / Hip-Hop / Pop',
    note: '把听感当作一种审美训练。',
    image: unsplashImage('photo-1609702847389-b8aec1b0b929'),
    imagePosition: 'center 50%',
  },
  {
    eyebrow: '投资观察',
    title: '投资观察连接商业模式和长期决策。',
    text: '关注 KO、NVDA、TSM、AAPL、MSFT、GOOGL、MU、CVX，以及指数、Crypto、现金流、技术趋势和流动性周期。',
    visualTitle: 'Finance Notes',
    visualText: '商业模式 / 现金流 / 技术趋势',
    note: '用结构化记录训练信息判断。',
    image: unsplashImage('photo-1611974789855-9c2a0a7236a3'),
    imagePosition: 'center 50%',
  },
];

const contactEmail = 'xianchaoqian@foxmail.com';
const blogUrl = 'https://blockblog.top/';

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/LeoninCS',
    Icon: FaGithub,
    tone: 'github',
    orbit: { angle: 12, track: 'outer', duration: '36s', direction: 'normal', size: '66px', mobileSize: '46px' },
  },
  {
    name: 'X',
    href: 'https://x.com/xxxmvp2',
    Icon: FaXTwitter,
    tone: 'x',
    orbit: { angle: 272, track: 'middle', duration: '27s', direction: 'reverse', size: '50px', mobileSize: '38px' },
  },
  {
    name: 'Bilibili',
    href: 'https://space.bilibili.com/491359383',
    Icon: FaBilibili,
    tone: 'bilibili',
    orbit: { angle: 92, track: 'middle', duration: '23s', direction: 'reverse', size: '62px', mobileSize: '44px' },
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/forever_mvp0?igsh=MXhnNjA3ZjFkbTZwbg==',
    Icon: FaInstagram,
    tone: 'instagram',
    orbit: { angle: 192, track: 'outer', duration: '42s', direction: 'normal', size: '58px', mobileSize: '42px' },
  },
  {
    name: '小红书',
    href: 'https://xhslink.com/m/68F5FSoWMxt',
    Icon: SiXiaohongshu,
    tone: 'xiaohongshu',
    orbit: { angle: 220, track: 'inner', duration: '18s', direction: 'normal', size: '56px', mobileSize: '40px' },
  },
];

const resumeAnchors = [
  { label: '信息', href: '#info' },
  { label: '实习', href: '#internship' },
  { label: '项目', href: '#projects' },
  { label: '竞赛', href: '#competition' },
  { label: '爱好', href: '#hobbies' },
  { label: '社媒', href: '#socials' },
];

const entryAssetUrls = Array.from(new Set([
  avatarImage,
  ...mockMemberIcons.map((icon) => icon.src),
  '/images/fora-hero-far.png',
  '/images/fora-hero-mid.png',
  '/images/fora-hero-foreground.png',
]));

const deferredAssetUrls = Array.from(new Set([
  '/picture/35-programming-contest-team-photo.jpg',
  '/picture/38-bike-coastal-road.jpg',
  '/picture/01-city-tower-blue-hour.jpg',
  ...internshipCards.flatMap((card) => [card.image, card.brandLogo].filter(Boolean)),
  ...competitionCards.map((card) => card.image),
  ...hobbyCards.map((card) => card.image),
]));

// Every visual asset used by any section participates in the initial gate so
// the progress indicator represents the complete page, not just the hero.
const pageAssetUrls = Array.from(new Set([
  ...entryAssetUrls,
  ...deferredAssetUrls,
]));

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function delay(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function loadImageAsset(src) {
  return new Promise((resolve) => {
    const image = new Image();
    const done = () => {
      if (image.decode) {
        image.decode().then(resolve, resolve);
        return;
      }

      resolve();
    };

    image.decoding = 'async';
    image.onload = done;
    image.onerror = resolve;
    image.src = src;

    if (image.complete) {
      done();
    }
  });
}

async function preloadPageResources(onProgress) {
  const assets = pageAssetUrls;
  let completed = 0;
  const totalTasks = assets.length + 1;
  const updateProgress = () => {
    completed += 1;
    onProgress(Math.min(1, completed / totalTasks));
  };
  const imageLoads = assets.map((src) => loadImageAsset(src).finally(updateProgress));
  const fontReady = (document.fonts?.ready ?? Promise.resolve())
    .catch(() => undefined)
    .finally(updateProgress);

  await Promise.all([
    ...imageLoads,
    fontReady,
  ]);
  onProgress(1);
}

function useResourceGate() {
  const [state, setState] = useState({ progress: 0, ready: false });

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    document.getElementById('boot-loader')?.remove();

    const complete = async () => {
      await preloadPageResources((progress) => {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            progress,
          }));
        }
      });

      // Keep a short visual hand-off only after every page asset has finished.
      const remainingDuration = Math.max(0, 280 - (performance.now() - startedAt));
      if (remainingDuration > 0) {
        await delay(remainingDuration);
      }

      if (!cancelled) {
        setState({ progress: 1, ready: true });
      }
    };

    complete();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-resource-loading', !state.ready);
    document.body.classList.toggle('is-resource-loading', !state.ready);

    return () => {
      document.documentElement.classList.remove('is-resource-loading');
      document.body.classList.remove('is-resource-loading');
    };
  }, [state.ready]);

  return state;
}

function useScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const rootVars = new Map();
    const mobileQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    let scrollTuning = getScrollTuning(mobileQuery.matches);
    const handleResize = () => update();
    let previousScrollY = window.scrollY;
    let previousScrollTime = performance.now();
    let scrollVelocity = 0;
    const motion = {
      raf: 0,
      lastFrame: performance.now(),
      current: {
        backY: 0,
        frontY: 0,
        forestY: 0,
        forestScale: 1,
        heroCopyY: 0,
        heroDeviceY: 0,
        heroDeviceOpacity: 1,
        heroUIOpacity: 1,
        heroLightX: 0,
        heroLightY: 0,
      },
      target: {
        backY: 0,
        frontY: 0,
        forestY: 0,
        forestScale: 1,
        heroCopyY: 0,
        heroDeviceY: 0,
        heroDeviceOpacity: 1,
        heroUIOpacity: 1,
        heroLightX: 0,
        heroLightY: 0,
      },
      velocity: {
        backY: 0,
        frontY: 0,
        forestY: 0,
        forestScale: 0,
        heroCopyY: 0,
        heroDeviceY: 0,
        heroDeviceOpacity: 0,
        heroUIOpacity: 0,
        heroLightX: 0,
        heroLightY: 0,
      },
    };
    const setRootVar = (name, value) => {
      if (rootVars.get(name) === value) {
        return;
      }

      rootVars.set(name, value);
      root.style.setProperty(name, value);
    };
    const setMotionTarget = (name, value) => {
      motion.target[name] = value;
    };
    const stepSpring = (name, stiffness, damping, deltaTime) => {
      const distance = motion.target[name] - motion.current[name];
      const acceleration =
        distance * stiffness * scrollTuning.spring.stiffnessScale -
        motion.velocity[name] * damping * scrollTuning.spring.dampingScale;
      motion.velocity[name] += acceleration * deltaTime;
      motion.current[name] += motion.velocity[name] * deltaTime;

      if (Math.abs(distance) < 0.001 && Math.abs(motion.velocity[name]) < 0.001) {
        motion.current[name] = motion.target[name];
        motion.velocity[name] = 0;
        return false;
      }

      return true;
    };
    const renderMotion = () => {
      const now = performance.now();
      const deltaTime = Math.min(0.034, Math.max(0.001, (now - motion.lastFrame) / 1000));
      motion.lastFrame = now;

      const active = [
        stepSpring('backY', 36, 12, deltaTime),
        stepSpring('frontY', 44, 13, deltaTime),
        stepSpring('forestY', 52, 14, deltaTime),
        stepSpring('forestScale', 46, 13, deltaTime),
        stepSpring('heroCopyY', 42, 13, deltaTime),
        stepSpring('heroDeviceY', 38, 12, deltaTime),
        stepSpring('heroDeviceOpacity', 48, 14, deltaTime),
        stepSpring('heroUIOpacity', 48, 14, deltaTime),
        stepSpring('heroLightX', 34, 12, deltaTime),
        stepSpring('heroLightY', 34, 12, deltaTime),
      ].some(Boolean);

      setRootVar('--hill-back-y', `${Math.round(motion.current.backY)}px`);
      setRootVar('--hill-front-y', `${Math.round(motion.current.frontY)}px`);
      setRootVar('--forest-y', `${Math.round(motion.current.forestY)}px`);
      setRootVar('--forest-scale', motion.current.forestScale.toFixed(3));
      setRootVar('--hero-copy-y', `${Math.round(motion.current.heroCopyY)}px`);
      setRootVar('--hero-device-y', `${Math.round(motion.current.heroDeviceY)}px`);
      setRootVar('--hero-device-opacity', motion.current.heroDeviceOpacity.toFixed(3));
      setRootVar('--hero-ui-opacity', motion.current.heroUIOpacity.toFixed(3));
      setRootVar('--hero-light-x', `${Math.round(motion.current.heroLightX)}px`);
      setRootVar('--hero-light-y', `${Math.round(motion.current.heroLightY)}px`);

      if (active) {
        motion.raf = requestAnimationFrame(renderMotion);
        return;
      }

      motion.raf = 0;
    };
    const ensureMotion = () => {
      if (!motion.raf) {
        motion.lastFrame = performance.now();
        motion.raf = requestAnimationFrame(renderMotion);
      }
    };
    const revealTargets = [
      '.hero-device',
      '.split-heading',
      '.feature-stage',
      '.feature-caption',
      '.profile-grid div',
      '.social-strip a',
      '.final-copy',
    ].join(',');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        rootMargin: '0px 0px 8% 0px',
        threshold: 0.08,
      },
    );

    const observedTargets = new WeakSet();
    const observeRevealTargets = (scope = document) => {
      if (scope.matches?.(revealTargets) && !observedTargets.has(scope)) {
        observedTargets.add(scope);
        observer.observe(scope);
        if (scope.getBoundingClientRect().top < window.innerHeight * 1.12) {
          scope.classList.add('is-visible');
        }
      }

      scope.querySelectorAll?.(revealTargets).forEach((element) => {
        if (!observedTargets.has(element)) {
          observedTargets.add(element);
          observer.observe(element);
          if (element.getBoundingClientRect().top < window.innerHeight * 1.12) {
            element.classList.add('is-visible');
          }
        }
      });
    };

    observeRevealTargets();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            observeRevealTargets(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const lenis = new Lenis({
      autoRaf: true,
      autoToggle: true,
      anchors: true,
      lerp: scrollTuning.lenis.lerp,
      syncTouch: scrollTuning.lenis.syncTouch,
      syncTouchLerp: scrollTuning.lenis.syncTouchLerp,
      touchInertiaExponent: scrollTuning.lenis.touchInertiaExponent,
      smoothWheel: true,
      wheelMultiplier: scrollTuning.lenis.wheelMultiplier,
      touchMultiplier: scrollTuning.lenis.touchMultiplier,
      overscroll: true,
    });

    window.lenis = lenis;
    setRootVar('--hero-copy-y', '0px');
    setRootVar('--hero-device-y', '0px');
    setRootVar('--hero-device-opacity', '1');
    setRootVar('--hero-ui-opacity', '1');
    setRootVar('--forest-scale', '1');

    const stackGroups = [...document.querySelectorAll('.get-stack')].map((stack) => ({
      stack,
      cards: [...stack.querySelectorAll('.get-card')],
    }));

    const update = (nextScroll) => {
      scrollTuning = getScrollTuning(mobileQuery.matches);
      Object.assign(lenis.options, scrollTuning.lenis);
      const scrollY = nextScroll ?? lenis.animatedScroll ?? window.scrollY;
      const now = performance.now();
      const elapsed = Math.max(16, now - previousScrollTime);
      const instantVelocity = ((scrollY - previousScrollY) / elapsed) * 16.67;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const heroTravel = Math.min(900, viewportHeight * 1.04);
      const heroMotionProgress = clamp(scrollY / heroTravel, 0, 1);
      const gravityProgress = Math.pow(heroMotionProgress, 1.54);
      const settleProgress = 1 - Math.pow(1 - heroMotionProgress, 2.2);
      // Keep the depth cue visible, but avoid making the first viewport feel
      // like it is being pulled away from the user while scrolling.
      const forestLiftTarget = viewportWidth <= 560 ? -34 : viewportWidth <= 980 ? -54 : -76;
      const frontHillLiftTarget = viewportWidth <= 560 ? -18 : -34;
      const backHillLiftTarget = viewportWidth <= 560 ? -6 : -14;
      const copyLiftTarget = viewportWidth <= 560 ? -38 : viewportWidth <= 980 ? -50 : -62;
      const deviceLiftTarget = viewportWidth <= 560 ? -9 : -18;
      scrollVelocity =
        scrollVelocity * scrollTuning.inertia.velocityRetain +
        instantVelocity * scrollTuning.inertia.velocityInject;
      previousScrollY = scrollY;
      previousScrollTime = now;
      const inertialPull = clamp(
        scrollVelocity * scrollTuning.inertia.pullMultiplier,
        scrollTuning.inertia.pullMin,
        scrollTuning.inertia.pullMax,
      );

      document.body.classList.toggle('is-scrolled', scrollY > 16);
      setMotionTarget('backY', gravityProgress * backHillLiftTarget + inertialPull * 0.08);
      setMotionTarget('frontY', gravityProgress * frontHillLiftTarget + inertialPull * 0.24);
      setMotionTarget('forestY', gravityProgress * forestLiftTarget + inertialPull);
      setMotionTarget(
        'forestScale',
        1 +
          settleProgress * 0.018 +
          clamp(
            Math.abs(scrollVelocity) * scrollTuning.inertia.forestScaleVelocity,
            0,
            scrollTuning.inertia.forestScaleMax,
          ),
      );
      setMotionTarget('heroCopyY', settleProgress * copyLiftTarget + inertialPull * 0.16);
      setMotionTarget('heroDeviceY', gravityProgress * deviceLiftTarget + inertialPull * 0.18);
      setMotionTarget('heroDeviceOpacity', 1 - Math.min(heroMotionProgress * 0.04, 0.04));
      setMotionTarget('heroUIOpacity', 1 - Math.min(heroMotionProgress * 0.1, 0.1));
      setMotionTarget('heroLightX', (heroMotionProgress - 0.5) * 12);
      setMotionTarget('heroLightY', heroMotionProgress * -12);
      setRootVar('--final-glow-y', `${Math.round(scrollY * -0.018)}px`);
      ensureMotion();

      if (!stackGroups.length) {
        return;
      }

      stackGroups.forEach(({ stack, cards }) => {
        const stackTop = stack.offsetTop - viewportHeight * 1.1;
        const stackBottom = stack.offsetTop + stack.offsetHeight + viewportHeight;
        if (scrollY < stackTop || scrollY > stackBottom) {
          cards.forEach((card) => card.classList.remove('is-edge-slice'));
          return;
        }

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const nextRect = cards[index + 1]?.getBoundingClientRect();
          const coverProgress = nextRect ? clamp((rect.bottom - nextRect.top) / rect.height, 0, 1) : 0;
          const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
          const scale = 1 - Math.min(coverProgress * 0.058 + Math.abs(centerOffset) * 0.006, 0.07);
          const imageScale = 1.045 - Math.min(coverProgress * 0.035 + Math.abs(centerOffset) * 0.016, 0.055);
          const layerOpacity = 1 - Math.min(coverProgress * 0.18, 0.18);
          const isEdgeSlice = rect.bottom < 24 || rect.top > viewportHeight - 24;
          card.style.setProperty('--card-scale', scale.toFixed(3));
          card.style.setProperty('--card-image-scale', imageScale.toFixed(3));
          card.style.setProperty('--stack-opacity', layerOpacity.toFixed(3));
          card.classList.toggle('is-edge-slice', isEdgeSlice);
        });
      });
    };

    update();
    lenis.on('scroll', ({ scroll }) => update(scroll));
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      if (window.lenis === lenis) {
        delete window.lenis;
      }
      if (motion.raf) {
        cancelAnimationFrame(motion.raf);
      }
      lenis.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}

function Logo() {
  return (
    <a className="logo" href="#hero" aria-label="回到首页">
      <span>
        <img src={avatarImage} alt="LeoninCS 头像" />
      </span>
      <strong>LeoninCS.</strong>
    </a>
  );
}

function Nav() {
  return (
    <nav className="top-nav" aria-label="主导航">
      <Logo />
      <div className="nav-center">
        {resumeAnchors.map((item) => (
          <a href={item.href} key={item.href}>{item.label}</a>
        ))}
      </div>
      <div className="nav-actions">
        <a href="https://github.com/LeoninCS" rel="noreferrer" target="_blank">GitHub</a>
        <a href="mailto:xianchaoqian@foxmail.com">联系我</a>
      </div>
    </nav>
  );
}

function MockColorField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastPaintTime = Number.NEGATIVE_INFINITY;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const colorStops = [
      { x: 0.66, y: 0.22, xAmp: 0.08, yAmp: 0.06, radius: 0.56, hue: 170, sat: 42, light: 70, alpha: 0.5, speed: 0.00024, phase: 0 },
      { x: 0.78, y: 0.62, xAmp: 0.08, yAmp: 0.08, radius: 0.5, hue: 192, sat: 38, light: 46, alpha: 0.4, speed: 0.0002, phase: 1.8 },
      { x: 0.44, y: 0.3, xAmp: 0.07, yAmp: 0.05, radius: 0.48, hue: 36, sat: 32, light: 76, alpha: 0.28, speed: 0.00018, phase: 3.2 },
      { x: 0.36, y: 0.72, xAmp: 0.06, yAmp: 0.07, radius: 0.54, hue: 158, sat: 28, light: 28, alpha: 0.34, speed: 0.00016, phase: 4.6 },
    ];

    const hsla = (stop, phase, alphaFactor = 1) => {
      const hue = (stop.hue + Math.sin(phase * 0.7) * 5 + Math.cos(phase * 0.38) * 3 + 360) % 360;
      const light = Math.max(26, Math.min(84, stop.light + Math.sin(phase * 0.52) * 3));
      return `hsla(${hue}, ${stop.sat}%, ${light}%, ${stop.alpha * alphaFactor})`;
    };

    const paint = (time = 0) => {
      if (!width || !height) {
        return;
      }

      context.clearRect(0, 0, width, height);
      const colorPhase = time * 0.00008;
      const base = context.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, `hsl(${166 + Math.sin(colorPhase) * 3}, 30%, 88%)`);
      base.addColorStop(0.44, `hsl(${180 + Math.cos(colorPhase * 1.18) * 4}, 32%, 76%)`);
      base.addColorStop(1, `hsl(${194 + Math.sin(colorPhase * 0.92) * 5}, 34%, 52%)`);
      context.fillStyle = base;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = 'source-over';
      context.filter = 'blur(18px)';

      colorStops.forEach((stop) => {
        const phase = time * stop.speed + stop.phase;
        const x = width * (stop.x + Math.sin(phase) * stop.xAmp + Math.sin(phase * 0.34 + stop.phase) * 0.02);
        const y = height * (stop.y + Math.cos(phase * 0.82) * stop.yAmp + Math.cos(phase * 0.41) * 0.02);
        const radius = Math.max(width, height) * (stop.radius + Math.sin(phase * 0.54) * 0.04);
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, hsla(stop, phase, 1));
        gradient.addColorStop(0.42, hsla(stop, phase + 0.8, 0.62));
        gradient.addColorStop(1, hsla(stop, phase + 1.2, 0));
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      });

      context.globalCompositeOperation = 'multiply';
      context.filter = 'blur(22px)';
      const darkPhase = time * 0.00018;
      const darkX = width * (0.24 + Math.sin(darkPhase) * 0.06);
      const darkY = height * (0.5 + Math.cos(darkPhase * 0.82) * 0.05);
      const dark = context.createRadialGradient(darkX, darkY, 0, darkX, darkY, Math.max(width, height) * 0.64);
      dark.addColorStop(0, 'rgba(20, 45, 43, 0.34)');
      dark.addColorStop(0.54, 'rgba(20, 45, 43, 0.14)');
      dark.addColorStop(1, 'rgba(20, 45, 43, 0)');
      context.fillStyle = dark;
      context.fillRect(0, 0, width, height);

      context.globalCompositeOperation = 'source-over';
      context.filter = 'none';
      const sheenPhase = time * 0.0002;
      const sheen = context.createLinearGradient(0, height * (0.2 + Math.sin(sheenPhase) * 0.03), width, height * (0.8 + Math.cos(sheenPhase) * 0.03));
      sheen.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
      sheen.addColorStop(0.42, 'rgba(255, 255, 255, 0.06)');
      sheen.addColorStop(0.76, 'rgba(105, 173, 169, 0.1)');
      sheen.addColorStop(1, 'rgba(0, 0, 0, 0.06)');
      context.fillStyle = sheen;
      context.fillRect(0, 0, width, height);

      const highlight = context.createLinearGradient(0, 0, 0, height);
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
      highlight.addColorStop(0.28, 'rgba(255, 255, 255, 0.04)');
      highlight.addColorStop(0.54, 'rgba(255, 255, 255, 0)');
      context.fillStyle = highlight;
      context.fillRect(0, 0, width, height);

      const shadow = context.createLinearGradient(0, 0, 0, height);
      shadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
      shadow.addColorStop(0.44, 'rgba(0, 0, 0, 0)');
      shadow.addColorStop(0.72, 'rgba(0, 0, 0, 0.12)');
      shadow.addColorStop(1, 'rgba(0, 0, 0, 0.38)');
      context.fillStyle = shadow;
      context.fillRect(0, 0, width, height);
    };

    const animate = (time) => {
      // The field is deliberately ambient; 30 fps keeps it smooth while
      // halving the amount of canvas gradient work on high-refresh displays.
      if (time - lastPaintTime >= 1000 / 30) {
        paint(time);
        lastPaintTime = time;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      if (reduceMotion.matches) {
        paint(window.performance.now());
        return;
      }
      lastPaintTime = Number.NEGATIVE_INFINITY;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(280, Math.round(rect.width / 2));
      height = Math.max(220, Math.round(rect.height / 2));
      canvas.width = width;
      canvas.height = height;
      paint(window.performance.now());
    };

    resize();
    startAnimation();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    reduceMotion.addEventListener('change', startAnimation);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      reduceMotion.removeEventListener('change', startAnimation);
    };
  }, []);

  return <canvas className="mock-color-field" ref={canvasRef} aria-hidden="true" />;
}

function ResumeMockup({ compact = false }) {
  return (
    <div className={`product-mockup ${compact ? 'compact' : ''}`}>
      <MockColorField />
      <aside className="mock-sidebar">
        <div className="mock-pill" />
        <div className="mock-search" />
        {resumeAnchors.map((item) => (
          <a
            aria-label={`跳转到${item.label}`}
            className="mock-nav-row"
            href={item.href}
            key={item.href}
            rel={item.external ? 'noreferrer' : undefined}
            target={item.external ? '_blank' : undefined}
          >
            <span />
            <b>{item.label}</b>
          </a>
        ))}
        <div className="mock-course-title">信息</div>
        <div className="mock-line long" />
        <div className="mock-line" />
        <div className="mock-line short" />
      </aside>
      <section className="mock-panel">
        <div className="mock-community">
          <div className="mock-avatar">
            <img src={avatarImage} alt="LeoninCS 头像" />
          </div>
          <h3>LeoninCS</h3>
          <p>Profile Page</p>
          <div className="mock-members" aria-label="个人信息">
            {mockMemberIcons.map((icon) => (
              <span key={icon.alt}>
                <img src={icon.src} alt={icon.alt} />
              </span>
            ))}
            <strong>献超前 · 河南大学软件工程本科 · 上海</strong>
          </div>
          <a className="mock-button" href={`mailto:${contactEmail}`}>查看联系方式</a>
          <small>
            河大软件工程 → Go 后端 → Sealos 系统组 → MiniMax Cloud Infra
          </small>
        </div>
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg hills-back" />
      <div className="hero-copy reveal">
        <h1>
          <span>LeoninCS Profile</span>
        </h1>
        <p>
          <span>欢迎来到布洛克琴的主页，这里记录了我的个人信息与项目经历，</span>
          <span>希望能帮助您更好地了解我。</span>
        </p>
        <div className="hero-actions">
          <a className="cta" href={blogUrl} rel="noreferrer" target="_blank">访问博客</a>
          <a className="cta secondary" href="mailto:xianchaoqian@foxmail.com">联系我</a>
        </div>
      </div>
      <div className="hero-device reveal">
        <ResumeMockup />
      </div>
      <div className="hero-bg forest-foreground" />
      <div className="hero-bg hills-front" />
    </section>
  );
}

function About() {
  const sectionRef = useRef(null);
  const [activeLine, setActiveLine] = useState(0);
  const lines = [
    '我是献超前，技术 ID 为 LeoninCS，河南大学软件工程专业本科在读，预计于 2027 年毕业。目前在上海 MiniMax Cloud Infra 系统组实习，持续参与实际工程项目与开源相关工作。',
    'AI 重度用户，日均上亿 Token；DevOps 理念践行者，主要关注 Cloud Infra、Go 后端、Docker、Kubernetes 等云原生基础设施，并具备实际项目落地经验；',
    '开源贡献者，维护 Sealos 合规组件，个人项目 GitHub 累计 500+ Stars；技术内容创作者，全网累计 2000+ 粉丝，1.5w+ 点赞收藏数；Web3 信徒，认同去中心化的理念。',
    '生活中，我喜欢 骑行、摄影与 Hi-Fi，也常听 Hip Hop 和 R&B。除此之外，我对投资理财也有一定兴趣，主要关注美股与加密货币，保持对技术与生活的长期探索。',
  ];

  useEffect(() => {
    const updateActiveLine = () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const viewportCenter = window.innerHeight * 0.52;
      const paragraphs = [...section.querySelectorAll('.intro-lines p')];
      const nextIndex = paragraphs.reduce((closestIndex, paragraph, index) => {
        const rect = paragraph.getBoundingClientRect();
        const paragraphCenter = rect.top + rect.height / 2;
        const currentRect = paragraphs[closestIndex].getBoundingClientRect();
        const currentCenter = currentRect.top + currentRect.height / 2;

        return Math.abs(paragraphCenter - viewportCenter) <
          Math.abs(currentCenter - viewportCenter)
          ? index
          : closestIndex;
      }, 0);

      setActiveLine((current) => (current === nextIndex ? current : nextIndex));
    };

    updateActiveLine();
    window.addEventListener('scroll', updateActiveLine, { passive: true });
    window.addEventListener('resize', updateActiveLine);

    return () => {
      window.removeEventListener('scroll', updateActiveLine);
      window.removeEventListener('resize', updateActiveLine);
    };
  }, []);

  return (
    <section id="info" className="about-section" ref={sectionRef}>
      <div className="section-inner narrow">
        <span className="pill muted">信息</span>
        <div className="intro-lines">
          {lines.map((line, index) => (
            <p
              className={index === activeLine ? 'active' : ''}
              key={line}
            >
              {line}
            </p>
          ))}
        </div>
        <div className="profile-grid">
          {profileRows.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = useMemo(() => projects[activeIndex], [activeIndex]);
  const activeTabId = `project-tab-${active.label}`;
  const activePanelId = `project-panel-${active.label}`;
  const selectProject = (index) => setActiveIndex((index + projects.length) % projects.length);
  const handleProjectKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectProject(index + 1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectProject(index - 1);
    }
  };

  return (
    <section id="projects" className="features-section">
      <div className="section-inner">
        <div className="split-heading">
          <div>
            <span className="pill muted">项目</span>
            <h2>
              项目按工程问题组织。
              <em> 仓库边界清晰可查。</em>
            </h2>
          </div>
          <p>
            这里集中展示 CompliK、GCFeed、SDD Agent Harness 和 GoClub，
            对应集群合规、内容流后端、规范驱动工作流和开源知识库。
          </p>
        </div>

        <div className="feature-tabs" role="tablist" aria-label="项目分类">
          {projects.map((project, index) => (
            <button
              aria-controls={`project-panel-${project.label}`}
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'active' : ''}
              id={`project-tab-${project.label}`}
              key={project.label}
              onClick={() => selectProject(index)}
              onKeyDown={(event) => handleProjectKeyDown(event, index)}
              role="tab"
              tabIndex={index === activeIndex ? 0 : -1}
              type="button"
            >
              {project.label}
            </button>
          ))}
        </div>

        <div
          aria-labelledby={activeTabId}
          className="feature-stage"
          id={activePanelId}
          key={active.label}
          role="tabpanel"
        >
          <div className="feature-app">
            <aside>
              <span className="feature-kicker">{active.label}</span>
              <h3>{active.title}</h3>
              <p>{active.caption}</p>
              <div className="feature-stack" aria-label={`${active.title} 技术栈`}>
                {active.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <a href={active.href} rel="noreferrer" target="_blank">打开仓库</a>
            </aside>
            <main>
              <div className="feature-preview">
                <div className="feature-preview-head">
                  <span>{active.label}</span>
                  <em>{active.stack[0]}</em>
                </div>
                <div className="feature-preview-flow" aria-label={`${active.title} 项目链路`}>
                  {active.preview.map((item, index) => (
                    <React.Fragment key={item}>
                      <span>{item}</span>
                      {index < active.preview.length - 1 && <i aria-hidden="true" />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="feature-preview-grid" aria-hidden="true">
                  {active.highlights.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="feature-highlights">
                {active.highlights.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </main>
          </div>
        </div>

        <div className="feature-caption">
          <button
            aria-label="上一个项目"
            type="button"
            onClick={() => selectProject(activeIndex - 1)}
          >
            ←
          </button>
          <p>{active.caption}</p>
          <button
            aria-label="下一个项目"
            type="button"
            onClick={() => selectProject(activeIndex + 1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

function MiniMaxCloudInfraVisual({ card }) {
  return (
    <div className="get-visual minimax-visual">
      <div className="visual-toolbar">
        <span />
        <span />
        <span />
        <span className="visual-tag">Cloud Infra</span>
      </div>
      <div className="minimax-console minimax-empty-console">
        <div className="minimax-brand-lockup">
          <span className="minimax-logo">
            <img src={card.brandLogo} alt="MiniMax 官方 Logo" loading="lazy" />
          </span>
          <strong>Cloud Infra</strong>
        </div>
      </div>
    </div>
  );
}

function SealosComplianceVisual({ card }) {
  const pipeline = ['Cluster', 'Policy Engine', 'Compliance Report'];

  return (
    <div className="get-visual sealos-visual">
      <div className="visual-toolbar">
        <span />
        <span />
        <span />
        <span className="visual-tag">集群合规</span>
      </div>
      <div className="minimax-console sealos-console">
        <div className="minimax-console-head sealos-console-head">
          <span className="sealos-console-logo">
            <img src={card.brandLogo} alt="Sealos 官方 Logo" />
            <b>Sealos</b>
          </span>
          <span>SYSTEM GROUP / COMPLIANCE</span>
          <i><b />ONLINE</i>
        </div>

        <div className="minimax-flow sealos-flow" aria-label="CompliK 合规分析链路">
          {pipeline.map((item, index) => (
            <React.Fragment key={item}>
              <span>
                <small>0{index + 1}</small>
                {item}
              </span>
              {index < pipeline.length - 1 && <i aria-hidden="true">→</i>}
            </React.Fragment>
          ))}
        </div>

        <div className="minimax-milestones sealos-capabilities" aria-label="CompliK 能力建设记录">
          {card.deliverables.map((item, index) => (
            <article key={item.title}>
              <header>
                <span><small>0{index + 1}</small>{item.title}</span>
                <time>{item.code}</time>
              </header>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function StorySection({ id, eyebrow, title, mutedTitle, text, cards }) {
  return (
    <section id={id} className="what-section">
      <div className="section-inner">
        <div className="split-heading">
          <div>
            <span className="pill muted">{eyebrow}</span>
            <h2>
              {title}
              <em>{mutedTitle}</em>
            </h2>
          </div>
          <p>{text}</p>
        </div>

        <div className="get-stack">
          {cards.map((card, index) => (
            <article
              className={`get-card card-${index + 1}${card.variant ? ` ${card.variant}-card` : ''}`}
              key={card.company ?? card.title}
              style={{
                '--stack-top': `${86 + index * 18}px`,
                '--stack-z': index + 1,
              }}
            >
              <div className="get-copy">
                <span>{card.eyebrow}</span>
                {card.company && (
                  <div className="experience-meta">
                    <b>{card.company}</b>
                    <time>{card.period}</time>
                  </div>
                )}
                {card.title && <h3>{card.title}</h3>}
                {card.text && <p>{card.text}</p>}
                {card.focus && (
                  <div className="experience-focus">
                    <b>核心职责</b>
                    <span>{card.focus}</span>
                  </div>
                )}
                {card.note && <strong>{card.note}</strong>}
              </div>
              {card.variant === 'minimax' ? (
                <MiniMaxCloudInfraVisual card={card} />
              ) : card.variant === 'sealos' ? (
                <SealosComplianceVisual card={card} />
              ) : (
                <div
                  className="get-visual"
                  style={{
                    '--visual-image': `url(${card.image})`,
                    '--visual-position': card.imagePosition ?? 'center',
                  }}
                >
                  <div className="visual-toolbar">
                    <span />
                    <span />
                    <span />
                    <span className="visual-tag">记录</span>
                  </div>
                  <div className="visual-card">
                    <div />
                    <h4>{card.visualTitle}</h4>
                    <p>{card.visualText}</p>
                    <span className="visual-note">重点记录</span>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Internship() {
  return (
    <StorySection
      id="internship"
      eyebrow="实习经历"
      title="实习内容落在真实系统里。"
      mutedTitle=" MiniMax Cloud Infra 与 Sealos。"
      text="当前在 MiniMax Cloud Infra 系统组实习；此前在 Sealos 环界云计算参与集群合规组件建设。"
      cards={internshipCards}
    />
  );
}

function Competition() {
  return (
    <StorySection
      id="competition"
      eyebrow="竞赛奖项"
      title="竞赛记录展示长期训练强度。"
      mutedTitle=" 也展示解题耐心。"
      text="算法训练、ACM 集训、CCPC、天梯赛、蓝桥杯、百度之星和 ICPC 现场经验放在独立区域，方便快速判断基础能力。"
      cards={competitionCards}
    />
  );
}

function Hobbies() {
  return (
    <StorySection
      id="hobbies"
      eyebrow="爱好"
      title="骑行、摄影、音乐、投资观察。"
      mutedTitle=" 保留真实的生活纹理。"
      text="爱好区域聚焦长期兴趣：10000+ 公里骑行、摄影、音乐 HiFi 和投资观察，让个人页有简历之外的识别度。"
      cards={hobbyCards}
    />
  );
}

function Socials() {
  return (
    <section id="socials" className="faq-section" aria-labelledby="socials-title">
      <div className="section-inner">
        <h2 id="socials-title" className="section-visually-hidden">社媒与联系</h2>

        <div className="social-section-heading">
          <span className="social-section-label pill muted">社媒</span>
          <span className="social-hint">点击图标访问社媒</span>
        </div>

        <div className="final-copy">
          <h2>沟通与协作，从这里开始。</h2>
          <p>
            岗位沟通、面试安排、工程机会、技术交流和开源协作可以直接通过邮箱联系。
          </p>
          <a className="cta" href={`mailto:${contactEmail}`}>发送邮件</a>
        </div>

        <div className="social-directory">
          <div className="social-strip" aria-label="社媒账号">
            <span className="social-track social-track-outer" aria-hidden="true" />
            <span className="social-track social-track-middle" aria-hidden="true" />
            <span className="social-track social-track-inner" aria-hidden="true" />
            <div className="social-orbit">
              {socials.map((item) => (
                <a
                  aria-label={item.name}
                  className={`social-${item.tone}`}
                  href={item.href}
                  key={item.name}
                  rel="noreferrer"
                  style={{
                    '--social-angle': `${item.orbit.angle}deg`,
                    '--social-radius': `var(--social-radius-${item.orbit.track})`,
                    '--social-duration': item.orbit.duration,
                    '--social-direction': item.orbit.direction,
                    '--social-icon-size': item.orbit.size,
                    '--social-icon-size-mobile': item.orbit.mobileSize,
                  }}
                  target="_blank"
                >
                  <span className="social-orbit-card">
                    <span aria-hidden="true">
                      <item.Icon />
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StartupLoader({ progress, ready }) {
  return (
    <div className={ready ? 'startup-loader is-done' : 'startup-loader'} role="status" aria-live="polite" aria-label="页面资源加载中">
      <div className="startup-loader-inner">
        <span>LeoninCS Profile</span>
        <div className="startup-progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
        <strong>{Math.round(progress * 100)}%</strong>
      </div>
    </div>
  );
}

function App() {
  const { progress, ready } = useResourceGate();
  useScrollEffects();

  return (
    <>
      <StartupLoader progress={progress} ready={ready} />
      <Nav />
      <main className={ready ? 'site-shell is-ready' : 'site-shell'}>
        <Hero />
        <About />
        <Internship />
        <Projects />
        <Competition />
        <Hobbies />
        <Socials />
      </main>
    </>
  );
}

ReactDOMClient.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
