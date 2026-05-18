const site = document.getElementById('fallback-portfolio');
const home = site.querySelector('[data-view="home"]');
const corridor = site.querySelector('[data-view="corridor"]');
const track = site.querySelector('.fallback-corridor-track');
const mainDoor = site.querySelector('[data-start]');
const roomPanel = site.querySelector('.fallback-room');

const rooms = {
  about: {
    kind: 'about',
    label: '简介',
    title: '个人简介',
    body: '献超前 / Xianchao Qian，技术 ID 为 LeoninCS，河南大学软件工程本科在读，专业为软件工程，常驻杭州，方向为后端开发实习。',
    hero: '/textures/contact/paper_form.webp',
    heroAlt: '手绘简历纸张',
    items: [
      { title: '姓名', text: '献超前 / Xianchao Qian / LeoninCS', image: '/textures/contact/send_button.webp', type: 'icon', alt: '姓名入口图标' },
      { title: '学校', text: '河南大学软件工程本科在读', image: '/textures/about/SOTDAYYOUNGMULTIORPETRON.webp', type: 'object', alt: '学校记录卡' },
      { title: '联系方式', text: 'xianchaoqian@foxmail.com / GitHub: LeoninCS', image: '/textures/studio/phone_front_painted.webp', type: 'object', alt: '联系方式展示屏' },
      { title: '方向', text: 'Go 后端、云原生平台、AI Agent 工程', image: '/textures/contact/latarnia.webp', type: 'object', alt: '方向灯塔' },
    ],
  },
  gallery: {
    kind: 'projects',
    label: '经历',
    title: '实习与项目经历',
    body: '这里展示后端开发实习、GoClub、视频 Feed 流系统、Agent Flow 和 Sealos AIOps，把工程经历集中放进项目房间。',
    hero: '/textures/gallery/monetuneprzod_painted.webp',
    heroAlt: '手绘项目卡片',
    items: [
      { title: '后端开发实习', text: '接口开发、日志排查、指标观察、测试补充、稳定性建设', image: '/textures/gallery/bioprzod_painted.webp', type: 'object', alt: '后端实习展示卡' },
      { title: 'GoClub', text: 'Go 后端社区、内容组织、协作工具', image: '/textures/gallery/monetuneprzod_painted.webp', type: 'object', alt: 'GoClub 手绘项目卡片' },
      { title: '视频 Feed 流系统', text: 'Go 后端、Redis、MQ、高并发接口', image: '/textures/gallery/timberkittyprzod_painted.webp', type: 'object', alt: '视频 Feed 手绘项目卡片' },
      { title: 'Agent Flow / Sealos AIOps', text: 'LangGraph、Kubernetes、集群合规、自动化运维', image: '/textures/studio/monitorfront_postnafbdoublewinner.webp', type: 'object', alt: '工程项目展示屏' },
    ],
  },
  studio: {
    kind: 'studio',
    label: '竞赛',
    title: '竞赛与成就',
    body: '这里展示 LeetCode 2100、Codeforces 1653、1500+ Problems、河南大学 ACM 集训队和 ICPC 现场经验。',
    hero: '/textures/studio/monitor_front_painted.webp',
    heroAlt: '手绘竞赛显示器',
    items: [
      { title: 'LeetCode 2100', text: '长期算法训练和复杂问题复盘', image: '/textures/about/SOTDAYYOUNGMULTIGSAP.webp', type: 'object', alt: 'LeetCode 记录卡' },
      { title: 'Codeforces 1653', text: '竞赛能力记录，ACM 训练背景', image: '/textures/about/SOTDAYYOUNGMULTICSSWINNER.webp', type: 'object', alt: 'Codeforces 记录卡' },
      { title: '1500+ Problems', text: '持续刷题、题型整理、赛后复盘', image: '/textures/about/SOTDAYYOUNGMULTIORPETRON.webp', type: 'object', alt: '刷题记录卡' },
      { title: '河南大学 ACM 集训队', text: 'ICPC 现场经验、团队协作、赛时交付', image: '/textures/about/SOTDAYYOUNGMULTIDESIGNNOMINESS.webp', type: 'object', alt: 'ACM 集训队记录卡' },
    ],
  },
  contact: {
    kind: 'contact',
    label: '爱好',
    title: '爱好与生活记录',
    body: '这里展示音乐 HiFi、R&B、Jazz、Hip-Hop、Pop、股票观察、商业模式研究、摄影展览和骑行记录。',
    hero: '/picture/01-city-tower-blue-hour.jpg',
    heroAlt: '城市摄影照片',
    items: [
      { title: '音乐与 HiFi', text: 'R&B / Jazz / Hip-Hop / Pop', image: '/picture/21-river-dusk-boat.jpg', type: 'photo', alt: '音乐生活氛围照片' },
      { title: '股票与投资观察', text: '商业模式、现金流、技术趋势、基础设施周期', image: '/picture/16-lake-sunset-wide.jpg', type: 'photo', alt: '湖畔落日摄影照片' },
      { title: '摄影展览', text: '城市、自然、旅途和日常记录', image: '/picture/01-city-tower-blue-hour.jpg', type: 'photo', alt: '城市蓝调摄影照片' },
      { title: '骑行 10000+ 公里', text: '城市、海岸、山野和长距离记录', image: '/picture/38-bike-coastal-road.jpg', type: 'photo', alt: '骑行生活照片' },
    ],
  },
};

let corridorIndex = 0;
let wheelLock = false;

function setView(view) {
  const isHome = view === 'home';
  home.classList.toggle('is-active', isHome);
  corridor.classList.toggle('is-active', !isHome);
  site.dataset.view = view;
  if (isHome) {
    closeRoom();
    corridorIndex = 0;
    updateCorridor();
  }
}

function updateCorridor() {
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const offset = mobile ? -corridorIndex * 236 : (1.5 - corridorIndex) * 210;
  track.style.setProperty('--corridor-x', mobile ? '0px' : `${offset}px`);
  track.style.setProperty('--corridor-y', mobile ? `${offset}px` : '0px');
}

function openRoom(roomId) {
  const room = rooms[roomId];
  if (!room) return;
  roomPanel.dataset.kind = room.kind;
  site.querySelectorAll('.fallback-door-card').forEach((door) => {
    door.classList.toggle('is-active', door.dataset.room === roomId);
  });
  roomPanel.innerHTML = `
    <div class="fallback-room-top">
      <figure class="fallback-room-hero fallback-room-hero-${room.kind}">
        <img src="${room.hero}" alt="${room.heroAlt}" loading="lazy" decoding="async">
      </figure>
      <header class="fallback-room-copy">
        <span>${room.label}</span>
        <h2>${room.title}</h2>
        <p>${room.body}</p>
      </header>
    </div>
    <ul class="fallback-room-grid">
      ${room.items.map((item) => `
        <li class="fallback-room-card is-${item.type}">
          <figure>
            <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async">
          </figure>
          <div>
            <strong>${item.title}</strong>
            <span>${item.text}</span>
          </div>
        </li>
      `).join('')}
    </ul>
    <button type="button" data-close-room>关闭纸条</button>
  `;
  roomPanel.classList.add('is-open');
  roomPanel.querySelector('[data-close-room]').addEventListener('click', closeRoom);
}

function closeRoom() {
  roomPanel.classList.remove('is-open');
  delete roomPanel.dataset.kind;
  site.querySelectorAll('.fallback-door-card').forEach((door) => door.classList.remove('is-active'));
}

function stepCorridor(direction) {
  corridorIndex += direction;
  if (corridorIndex > 3) {
    setView('home');
    return;
  }
  if (corridorIndex < 0) corridorIndex = 0;
  updateCorridor();
}

mainDoor.addEventListener('click', () => {
  mainDoor.classList.add('is-pressed');
  window.setTimeout(() => {
    mainDoor.classList.remove('is-pressed');
    setView('corridor');
  }, 260);
});

site.querySelector('[data-home]').addEventListener('click', () => setView('home'));

site.querySelectorAll('.fallback-door-card').forEach((door, index) => {
  door.addEventListener('click', () => {
    corridorIndex = index;
    updateCorridor();
    openRoom(door.dataset.room);
  });
});

site.addEventListener('wheel', (event) => {
  if (site.dataset.view !== 'corridor') return;
  if (event.target.closest('.fallback-room')) return;
  if (roomPanel.classList.contains('is-open')) return;
  event.preventDefault();
  if (wheelLock) return;
  wheelLock = true;
  stepCorridor(event.deltaY > 0 ? 1 : -1);
  window.setTimeout(() => {
    wheelLock = false;
  }, 360);
}, { passive: false });

roomPanel.addEventListener('wheel', (event) => {
  event.stopPropagation();
}, { passive: true });

site.addEventListener('pointermove', (event) => {
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  mainDoor.style.setProperty('--tilt-x', `${x * 6}deg`);
  mainDoor.style.setProperty('--tilt-y', `${-y * 4}deg`);
  roomPanel.style.setProperty('--room-x', `${x * 10}px`);
  roomPanel.style.setProperty('--room-y', `${y * 8}px`);
});

window.addEventListener('resize', updateCorridor);
setView('home');

const initialRoom = new URLSearchParams(window.location.search).get('room');
if (rooms[initialRoom]) {
  setView('corridor');
  corridorIndex = Object.keys(rooms).indexOf(initialRoom);
  updateCorridor();
  openRoom(initialRoom);
}
