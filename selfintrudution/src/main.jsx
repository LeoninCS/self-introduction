import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as THREE from 'three';
import './styles.css';

const rooms = [
  {
    id: 'about',
    label: '简介',
    mapLabel: '简介',
    side: 'left',
    z: -12,
    color: '#f0b35d',
    door: '/textures/corridor/doors/drzwiabout.webp',
    paintedDoor: '/textures/corridor/doors/drzwiabout_painted.webp',
    roomKind: 'about',
  },
  {
    id: 'gallery',
    label: '经历',
    mapLabel: '经历',
    side: 'right',
    z: -25,
    color: '#69b96e',
    door: '/textures/corridor/doors/drzwiprojekty.webp',
    paintedDoor: '/textures/corridor/doors/drzwiprojekty_painted.webp',
    roomKind: 'gallery',
  },
  {
    id: 'studio',
    label: '竞赛',
    mapLabel: '竞赛',
    side: 'left',
    z: -39,
    color: '#6ac3b2',
    door: '/textures/corridor/doors/drzwisocial.webp',
    paintedDoor: '/textures/corridor/doors/drzwisocial_painted.webp',
    roomKind: 'studio',
  },
  {
    id: 'contact',
    label: '爱好',
    mapLabel: '爱好',
    side: 'right',
    z: -53,
    color: '#f07d91',
    door: '/textures/corridor/doors/drzwikontakt.webp',
    paintedDoor: '/textures/corridor/doors/drzwikontakt_painted.webp',
    roomKind: 'contact',
  },
];

const CORRIDOR_START_Z = 8.2;
const CORRIDOR_END_Z = -63.8;
const CORRIDOR_LOOP_BUFFER = 2.2;
const CORRIDOR_LENGTH = CORRIDOR_START_Z - CORRIDOR_END_Z;

const roomCopy = {
  gallery: {
    eyebrow: '房间 01',
    title: '实习与项目经历',
    body: '展示后端开发实习、GoClub、视频 Feed 流系统、Agent Flow 和 Sealos AIOps。',
  },
  studio: {
    eyebrow: '房间 02',
    title: '竞赛与成就',
    body: '展示 LeetCode 2100、Codeforces 1653、1500+ Problems、河南大学 ACM 集训队和 ICPC 现场经验。',
  },
  about: {
    eyebrow: '房间 03',
    title: '个人简介',
    body: '献超前 / LeoninCS，河南大学软件工程本科在读，专业为软件工程，常驻杭州，方向为后端开发实习。',
  },
  contact: {
    eyebrow: '房间 04',
    title: '爱好与生活记录',
    body: '展示音乐 HiFi、股票观察、商业模式研究、摄影展览和骑行记录。',
  },
};

const roomCards = {
  gallery: [
    { title: 'Go 语言俱乐部', lines: ['goclub.space', '开源社区协作', '内容与工具建设'], image: '/picture/42-icpc-shenzhen-invitational-01.jpg' },
    { title: '视频 Feed 流系统', lines: ['Go 后端', 'Feed 推荐链路', '高并发接口'], image: '/picture/46-icpc-wuhan-regional-01.jpg' },
    { title: '多智能体助手', lines: ['LangGraph', 'Agent Workflow', '任务编排'], image: '/picture/35-programming-contest-team-photo.jpg' },
    { title: 'Sealos AIOps', lines: ['Kubernetes', '集群合规', '云原生平台'], image: '/picture/40-illuminated-arch-bridge-night.jpg' },
  ],
  studio: [
    { title: '后端工程', lines: ['Go / Python', 'Redis / MQ', '服务治理'] },
    { title: '云原生', lines: ['Kubernetes', 'Sealos', '集群平台'] },
    { title: 'AI Agent', lines: ['LangGraph', '工作流编排', '工具调用'] },
    { title: '算法系统', lines: ['LeetCode 2100', 'Codeforces 1653', 'Raft / 分布式'] },
  ],
  about: [
    { title: 'LeoninCS', lines: ['献超前', '后端开发实习生', '杭州，中国'] },
    { title: '河南大学', lines: ['软件工程本科在读', 'ACM 集训队', 'ICPC 现场经验'] },
    { title: '生活兴趣', lines: ['摄影 / 骑行', 'R&B / Jazz / Hip-Hop', 'HiFi 与长期记录'], image: '/picture/01-city-tower-blue-hour.jpg' },
    { title: '长期主义', lines: ['工程训练', '投资观察', '开源协作'], image: '/picture/38-bike-coastal-road.jpg' },
  ],
  contact: [
    { title: '邮箱', lines: ['xianchaoqian@foxmail.com', '后端工程', '开源协作'] },
    { title: 'GitHub', lines: ['github.com/LeoninCS', '视频 Feed 流系统', '智能体助手'] },
    { title: '社交', lines: ['X / Bilibili', 'Instagram / 小红书', '摄影与日常'] },
    { title: '兴趣', lines: ['R&B / Jazz / Hip-Hop', 'HiFi', '长期主义投资观察'] },
  ],
};

window.addEventListener('error', (event) => {
  document.body.dataset.runtimeError = event.message;
});

window.addEventListener('unhandledrejection', (event) => {
  document.body.dataset.runtimeError = event.reason?.message || String(event.reason);
});

function seededNoise(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function makeCanvasTexture(width, height, painter) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  painter(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const textureCache = new Map();

function loadTexture(path, options = {}) {
  const cacheKey = `${path}|${options.repeat ? options.repeat.join('x') : 'single'}|${options.anisotropy || 4}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);
  const texture = new THREE.TextureLoader().load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = options.anisotropy || 4;
  if (options.repeat) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(options.repeat[0], options.repeat[1]);
  }
  textureCache.set(cacheKey, texture);
  return texture;
}

function roughLine(ctx, x1, y1, x2, y2, jitter = 2, passes = 2) {
  const random = seededNoise(Math.round(x1 + y1 + x2 + y2 + jitter * 17));
  for (let pass = 0; pass < passes; pass += 1) {
    ctx.beginPath();
    ctx.moveTo(x1 + (random() - 0.5) * jitter, y1 + (random() - 0.5) * jitter);
    const steps = 12;
    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps;
      ctx.lineTo(
        x1 + (x2 - x1) * t + (random() - 0.5) * jitter,
        y1 + (y2 - y1) * t + (random() - 0.5) * jitter,
      );
    }
    ctx.stroke();
  }
}

function createLineTexture(width, height, painter) {
  return makeCanvasTexture(width, height, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    painter(ctx, w, h);
  });
}

function createLampTexture() {
  return createLineTexture(512, 256, (ctx, width, height) => {
    ctx.strokeStyle = '#151515';
    ctx.fillStyle = '#fffdf6';
    ctx.lineWidth = 12;
    roughLine(ctx, 60, 52, width - 60, 52, 8, 3);
    roughLine(ctx, width - 70, 52, width - 110, height - 58, 8, 3);
    roughLine(ctx, width - 110, height - 58, 110, height - 58, 8, 3);
    roughLine(ctx, 110, height - 58, 60, 52, 8, 3);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(21,21,21,0.35)';
    ctx.lineWidth = 5;
    roughLine(ctx, 160, 80, 138, 180, 5, 2);
    roughLine(ctx, 250, 78, 250, 184, 5, 2);
    roughLine(ctx, 350, 80, 372, 180, 5, 2);
  });
}

function createSoftDoorArrowTexture(direction = 'right') {
  return createLineTexture(900, 420, (ctx, width, height) => {
    const flip = direction === 'left';
    ctx.save();
    if (flip) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(25, 25, 25, 0.42)';
    ctx.lineWidth = 13;

    const random = seededNoise(direction === 'right' ? 661 : 773);
    for (let pass = 0; pass < 3; pass += 1) {
      ctx.beginPath();
      ctx.moveTo(95, 228 + (random() - 0.5) * 18);
      ctx.bezierCurveTo(
        260 + (random() - 0.5) * 22,
        110 + (random() - 0.5) * 24,
        520 + (random() - 0.5) * 22,
        116 + (random() - 0.5) * 20,
        720 + (random() - 0.5) * 12,
        206 + (random() - 0.5) * 12,
      );
      ctx.stroke();
    }

    ctx.lineWidth = 12;
    roughLine(ctx, 720, 206, 610, 154, 14, 3);
    roughLine(ctx, 720, 206, 640, 304, 14, 3);

    ctx.font = '700 54px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = 'rgba(25, 25, 25, 0.48)';
    ctx.translate(250, 96);
    ctx.rotate(-0.09);
    ctx.fillText('点这里', 0, 0);
    ctx.restore();
  });
}

function createSignTexture(title, subtitle) {
  return makeCanvasTexture(768, 384, (ctx, width, height) => {
    ctx.fillStyle = '#fffaf0';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#161616';
    ctx.lineWidth = 9;
    roughLine(ctx, 30, 28, width - 26, 38, 10, 3);
    roughLine(ctx, width - 26, 38, width - 40, height - 32, 10, 3);
    roughLine(ctx, width - 40, height - 32, 38, height - 30, 10, 3);
    roughLine(ctx, 38, height - 30, 30, 28, 10, 3);

    ctx.fillStyle = '#161616';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 82px "Comic Sans MS", "Trebuchet MS", sans-serif';
    ctx.fillText(title, width / 2, 154);
    ctx.font = '600 36px "Comic Sans MS", "Trebuchet MS", sans-serif';
    ctx.fillText(subtitle, width / 2, 240);
  });
}

function createCardTexture(room, index) {
  const card = roomCards[room.id]?.[index % 4] || roomCards.about[index % 4];

  return makeCanvasTexture(768, 960, (ctx, width, height) => {
    const random = seededNoise(index * 51 + room.z * -2);
    ctx.fillStyle = '#fffaf1';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 1800; i += 1) {
      ctx.fillStyle = `rgba(0,0,0,${0.018 + random() * 0.035})`;
      ctx.fillRect(random() * width, random() * height, random() * 2, random() * 2);
    }

    ctx.strokeStyle = '#151515';
    ctx.lineWidth = 7;
    roughLine(ctx, 44, 42, width - 42, 48, 9, 3);
    roughLine(ctx, width - 42, 48, width - 54, height - 50, 9, 3);
    roughLine(ctx, width - 54, height - 50, 48, height - 46, 9, 3);
    roughLine(ctx, 48, height - 46, 44, 42, 9, 3);

    if (card.image) {
      ctx.fillStyle = room.color;
      ctx.fillRect(86, 92, width - 172, 250);
      ctx.strokeStyle = '#151515';
      ctx.lineWidth = 5;
      ctx.strokeRect(86, 92, width - 172, 250);
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.fillRect(120, 132, width - 240, 170);
    } else if (room.roomKind === 'studio') {
      ctx.fillStyle = '#e6f4ee';
      ctx.fillRect(86, 92, width - 172, 210);
      ctx.strokeStyle = '#151515';
      ctx.lineWidth = 5;
      ctx.strokeRect(86, 92, width - 172, 210);
      ctx.strokeStyle = 'rgba(21,21,21,0.66)';
      ctx.lineWidth = 9;
      roughLine(ctx, 154, 194, width - 154, 194, 8, 2);
      roughLine(ctx, 224, 136, 224, 260, 8, 2);
      roughLine(ctx, 330, 136, 330, 260, 8, 2);
      roughLine(ctx, 438, 136, 438, 260, 8, 2);
    } else {
      ctx.fillStyle = room.color;
      ctx.fillRect(86, 92, width - 172, 210);
      ctx.strokeStyle = '#151515';
      ctx.lineWidth = 5;
      ctx.strokeRect(86, 92, width - 172, 210);
    }

    ctx.fillStyle = '#151515';
    ctx.textAlign = 'left';
    ctx.font = '700 62px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(card.title, 90, 420);
    ctx.font = '600 38px "PingFang SC", "Microsoft YaHei", sans-serif';
    card.lines.forEach((line, lineIndex) => {
      ctx.fillText(line, 90, 510 + lineIndex * 60);
    });

    ctx.strokeStyle = 'rgba(20,20,20,0.45)';
    ctx.lineWidth = 3;
    for (let y = 680; y < 840; y += 42) {
      roughLine(ctx, 92, y, width - 94, y + (random() - 0.5) * 6, 4, 1);
    }
  });
}

function addPlane(group, width, height, material, position, rotation = [0, 0, 0], name = '') {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  mesh.name = name;
  group.add(mesh);
  return mesh;
}

function makeBox(width, height, depth, material, position, name = '') {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.name = name;
  return mesh;
}

function createAssetMaterial(path, options = {}) {
  return new THREE.MeshBasicMaterial({
    map: loadTexture(path, options.texture || {}),
    transparent: true,
    opacity: options.opacity ?? 1,
    alphaTest: options.alphaTest ?? 0.01,
    depthWrite: options.depthWrite ?? false,
    side: THREE.DoubleSide,
  });
}

function addAssetPlane(group, path, width, height, position, rotation = [0, 0, 0], name = '', options = {}) {
  return addPlane(group, width, height, createAssetMaterial(path, options), position, rotation, name);
}

function wrapCorridorZ(value) {
  if (value < CORRIDOR_END_Z - CORRIDOR_LOOP_BUFFER) {
    return value + CORRIDOR_LENGTH + CORRIDOR_LOOP_BUFFER * 2;
  }
  if (value > CORRIDOR_START_Z + CORRIDOR_LOOP_BUFFER) {
    return value - CORRIDOR_LENGTH - CORRIDOR_LOOP_BUFFER * 2;
  }
  return value;
}

function ThreeExperience({ activeRoom, started, onStart, onEnterRoom, onHoverRoom, mapSignal }) {
  const hostRef = useRef(null);
  const startedRef = useRef(started);
  const activeRoomRef = useRef(activeRoom);
  const onStartRef = useRef(onStart);
  const onEnterRoomRef = useRef(onEnterRoom);
  const onHoverRoomRef = useRef(onHoverRoom);
  const mapSignalRef = useRef(mapSignal);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    onEnterRoomRef.current = onEnterRoom;
  }, [onEnterRoom]);

  useEffect(() => {
    onHoverRoomRef.current = onHoverRoom;
  }, [onHoverRoom]);

  useEffect(() => {
    mapSignalRef.current = mapSignal;
  }, [mapSignal]);

  useEffect(() => {
    const host = hostRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#fafafa');
    scene.fog = new THREE.Fog('#fafafa', 13, 54);

    const camera = new THREE.PerspectiveCamera(60, host.clientWidth / host.clientHeight, 0.1, 150);
    camera.position.set(0, 1.95, 8.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;
    host.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight('#ffffff', '#d8d0bd', 1.85);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight('#fff7dc', 2.15);
    sun.position.set(1.5, 7, 9);
    scene.add(sun);

    const textures = {
      paper: loadTexture('/textures/paper-texture.webp', { repeat: [1.5, 1.5] }),
      wall: loadTexture('/textures/corridor/wall_texture.webp', { repeat: [1.4, 6] }),
      floor: loadTexture('/textures/corridor/kawalekpodlogi.webp', { repeat: [2.2, 14] }),
      ceiling: loadTexture('/textures/corridor/ceiling_texture.webp', { repeat: [1.8, 9] }),
      sign: loadTexture('/textures/corridor/pustatabliczka.webp'),
    };

    const mat = {
      wall: new THREE.MeshBasicMaterial({ map: textures.wall }),
      floor: new THREE.MeshBasicMaterial({ map: textures.floor }),
      ceiling: new THREE.MeshBasicMaterial({ map: textures.ceiling }),
      ink: new THREE.MeshBasicMaterial({ color: '#151515' }),
      shadow: new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.08 }),
      paper: new THREE.MeshBasicMaterial({ map: textures.paper, side: THREE.DoubleSide }),
    };

    const entrance = new THREE.Group();
    scene.add(entrance);
    const entranceZ = 11.4;
    addAssetPlane(entrance, '/textures/entrance/wall_bricks_2.webp', 13.8, 6.2, [0, 2.38, entranceZ - 0.12], [0, 0, 0], 'entrance-wall');
    addAssetPlane(entrance, '/textures/entrance/floor_paper.webp', 14, 15, [0, -1.08, entranceZ - 5.2], [-Math.PI / 2, 0, 0], 'entrance-floor', { texture: { repeat: [1.2, 2] } });
    addAssetPlane(entrance, '/textures/entrance/stone-path.webp', 4.8, 8, [0, -1.0, entranceZ - 4.4], [-Math.PI / 2, 0, 0], 'entrance-path');
    addAssetPlane(entrance, '/textures/entrance/window_sketch.webp', 2.2, 2.2, [-4.1, 2.55, entranceZ], [0, 0, 0], 'entrance-window');
    addAssetPlane(entrance, '/textures/entrance/avatar_window.webp', 1.45, 1.45, [-4.12, 2.5, entranceZ + 0.03], [0, 0, 0], 'entrance-avatar');
    addAssetPlane(entrance, '/textures/entrance/tree_sketch.webp', 2.4, 3.8, [4.7, 1.25, entranceZ + 0.02], [0, 0, 0], 'entrance-tree');
    addAssetPlane(entrance, '/textures/entrance/pot_with_duck.webp', 1.2, 1.2, [2.95, -0.2, entranceZ + 0.04], [0, 0, 0], 'entrance-pot');
    addAssetPlane(entrance, '/textures/entrance/mouse_hanging.webp', 0.8, 1.2, [-2.85, 3.35, entranceZ + 0.04], [0, 0, 0], 'entrance-hanging');
    addAssetPlane(entrance, '/textures/entrance/bug_sketch.webp', 0.55, 0.55, [2.1, 3.4, entranceZ + 0.04], [0, 0, 0], 'entrance-bug');
    addAssetPlane(entrance, '/textures/entrance/belka.webp', 3.4, 0.55, [0, 4.42, entranceZ + 0.03], [0, 0, 0], 'entrance-beam');
    addAssetPlane(entrance, '/textures/entrance/sign.webp', 2.25, 1.05, [0, 3.86, entranceZ + 0.06], [0, 0, 0], 'entrance-sign');

    const entranceDoorMeshes = [];
    const entranceFrame = addAssetPlane(entrance, '/textures/doors/frame_sketch.webp', 2.85, 4.35, [0, 1.62, entranceZ + 0.05], [0, 0, 0], 'entrance-door-frame');
    const entranceLeftDoor = addAssetPlane(entrance, '/textures/doors/door_left_sketch.webp', 1.16, 2.95, [-0.57, 1.48, entranceZ + 0.08], [0, 0, 0], 'entrance-left-door');
    const entranceRightDoor = addAssetPlane(entrance, '/textures/doors/door_right_sketch.webp', 1.16, 2.95, [0.57, 1.48, entranceZ + 0.08], [0, 0, 0], 'entrance-right-door');
    const entranceLeftPainted = loadTexture('/textures/doors/door_left_painted.webp');
    const entranceRightPainted = loadTexture('/textures/doors/door_right_painted.webp');
    entranceLeftDoor.userData.sketchMap = entranceLeftDoor.material.map;
    entranceLeftDoor.userData.paintedMap = entranceLeftPainted;
    entranceRightDoor.userData.sketchMap = entranceRightDoor.material.map;
    entranceRightDoor.userData.paintedMap = entranceRightPainted;
    entranceDoorMeshes.push(entranceFrame, entranceLeftDoor, entranceRightDoor);
    addAssetPlane(entrance, '/textures/doors/handle_left_sketch.webp', 0.42, 0.42, [-0.16, 1.42, entranceZ + 0.12], [0, 0, 0], 'entrance-handle-left');
    addAssetPlane(entrance, '/textures/doors/handle_right_sketch.webp', 0.42, 0.42, [0.16, 1.42, entranceZ + 0.12], [0, 0, 0], 'entrance-handle-right');

    const corridor = new THREE.Group();
    scene.add(corridor);

    const corridorLength = 76;
    const corridorCenter = -27.5;
    addPlane(corridor, 7.2, corridorLength, mat.floor, [0, -0.08, corridorCenter], [-Math.PI / 2, 0, 0], 'floor');
    addPlane(corridor, 7.2, corridorLength, mat.ceiling, [0, 5.05, corridorCenter], [Math.PI / 2, 0, 0], 'ceiling');
    addPlane(corridor, corridorLength, 5.2, mat.wall, [-3.6, 2.5, corridorCenter], [0, Math.PI / 2, 0], 'left-wall');
    addPlane(corridor, corridorLength, 5.2, mat.wall, [3.6, 2.5, corridorCenter], [0, -Math.PI / 2, 0], 'right-wall');
    addPlane(corridor, 7.2, 5.2, mat.wall, [0, 2.5, -65.4], [0, 0, 0], 'end-wall');

    const signMaterial = new THREE.MeshBasicMaterial({ map: textures.sign, transparent: true, side: THREE.DoubleSide });
    addPlane(corridor, 3.8, 1.55, signMaterial, [0, 3.05, -2.2], [0, 0, 0], 'entry-sign');

    const logoMaterial = new THREE.MeshBasicMaterial({
      map: createSignTexture('LeoninCS', 'Creative Backend Portfolio'),
      transparent: true,
      side: THREE.DoubleSide,
    });
    addPlane(corridor, 2.4, 1.2, logoMaterial, [0, 3.08, -2.1], [0, 0, 0], 'logo-label');

    addAssetPlane(corridor, '/textures/corridor/strzalka.webp', 1.6, 0.8, [3.53, 2.0, -7.2], [0, -Math.PI / 2, 0], 'arrow-right');
    addAssetPlane(corridor, '/textures/corridor/strzalka.webp', 1.6, 0.8, [-3.53, 2.0, -24.4], [0, Math.PI / 2, 0], 'arrow-left');

    addAssetPlane(corridor, '/textures/corridor/avatar_sketch.webp', 1.65, 1.65, [3.52, 3.45, -28], [0, -Math.PI / 2, 0], 'avatar-sketch');

    const doorMeshes = [];
    rooms.forEach((room) => {
      const x = room.side === 'left' ? -3.47 : 3.47;
      const rotationY = room.side === 'left' ? Math.PI / 2 : -Math.PI / 2;
      const doorMaterial = new THREE.MeshBasicMaterial({
        map: loadTexture(room.door),
        transparent: true,
        side: THREE.DoubleSide,
      });
      const door = addPlane(corridor, 2.38, 3.92, doorMaterial, [x, 2.05, room.z], [0, rotationY, 0], `door-${room.id}`);
      door.userData.room = room.id;
      door.userData.color = new THREE.Color(room.color);
      door.userData.flash = 0;
      door.userData.baseScale = 1;
      door.userData.sketchMap = doorMaterial.map;
      door.userData.paintedMap = loadTexture(room.paintedDoor);
      doorMeshes.push(door);

      const doorTint = addPlane(
        corridor,
        2.38,
        3.92,
        new THREE.MeshBasicMaterial({
          color: room.color,
          transparent: true,
          opacity: 0,
          blending: THREE.MultiplyBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
        [x + (room.side === 'left' ? 0.006 : -0.006), 2.05, room.z],
        [0, rotationY, 0],
        `door-tint-${room.id}`,
      );
      doorTint.userData.parentDoor = door;
      door.userData.tint = doorTint;

      const frame = new THREE.Group();
      const frameColor = new THREE.MeshBasicMaterial({ color: '#191919' });
      const top = makeBox(2.9, 0.1, 0.16, frameColor, [x + (room.side === 'left' ? 0.02 : -0.02), 4.36, room.z]);
      const left = makeBox(0.1, 4.3, 0.16, frameColor, [x + (room.side === 'left' ? 0.02 : -0.02), 2.23, room.z - 1.43]);
      const right = makeBox(0.1, 4.3, 0.16, frameColor, [x + (room.side === 'left' ? 0.02 : -0.02), 2.23, room.z + 1.43]);
      top.rotation.y = rotationY;
      left.rotation.y = rotationY;
      right.rotation.y = rotationY;
      frame.add(top, left, right);
      corridor.add(frame);

      const labelMaterial = new THREE.MeshBasicMaterial({
        map: createSignTexture(room.label, '进入展厅'),
        transparent: true,
        side: THREE.DoubleSide,
      });
      addPlane(corridor, 1.35, 0.66, labelMaterial, [x, 4.32, room.z], [0, rotationY, 0], `${room.id}-label`);

      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 0.58), mat.shadow);
      shadow.position.set(room.side === 'left' ? -3.42 : 3.42, 0.08, room.z);
      shadow.rotation.set(-Math.PI / 2, 0, 0);
      corridor.add(shadow);

      const graffitiMaterial = new THREE.MeshBasicMaterial({
        map: createSoftDoorArrowTexture(room.side === 'left' ? 'left' : 'right'),
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      addPlane(
        corridor,
        2.7,
        1.26,
        graffitiMaterial,
        [x, 3.12, room.z + (room.side === 'left' ? 2.45 : -2.45)],
        [0, rotationY, 0],
        `door-graffiti-${room.id}`,
      );
    });

    const lampMaterial = new THREE.MeshBasicMaterial({ map: createLampTexture(), transparent: true, side: THREE.DoubleSide });
    for (let i = 0; i < 7; i += 1) {
      const z = -5 - i * 6.5;
      addPlane(corridor, 1.9, 0.95, lampMaterial, [0, 4.72, z], [Math.PI / 2, 0, 0], 'lamp-drawing');
      const glow = new THREE.PointLight('#fff3d4', 0.8, 8);
      glow.position.set(0, 4.45, z);
      corridor.add(glow);
    }

    const corridorDecor = [
      { path: '/textures/corridor/decorations/while_true_loop.webp', side: -1, z: -6.5, y: 2.85, w: 1.45, h: 0.82 },
      { path: '/textures/corridor/decorations/coffee_debug.webp', side: 1, z: -13.5, y: 2.75, w: 1.42, h: 0.8 },
      { path: '/textures/corridor/decorations/idea_process.webp', side: -1, z: -20.5, y: 3.05, w: 1.52, h: 0.86 },
      { path: '/textures/corridor/decorations/paper_airplane.webp', side: 1, z: -31.5, y: 3.1, w: 0.82, h: 0.72 },
      { path: '/textures/corridor/decorations/pencil.webp', side: -1, z: -45.5, y: 2.35, w: 1.2, h: 0.42 },
      { path: '/textures/corridor/decorations/coffee_cup.webp', side: 1, z: -58.5, y: 2.1, w: 0.72, h: 0.72 },
    ];
    corridorDecor.forEach((item) => {
      addAssetPlane(
        corridor,
        item.path,
        item.w,
        item.h,
        [item.side * 3.53, item.y, item.z],
        [0, item.side < 0 ? Math.PI / 2 : -Math.PI / 2, 0],
        'corridor-decoration',
      );
    });

    const frameDecor = [
      { path: '/textures/corridor/ramkanazdjecieduza.webp', picture: '/textures/corridor/rysuneknaobraz1.webp', side: 1, z: -22.5, y: 2.85, w: 1.35, h: 1.05 },
      { path: '/textures/corridor/ramkanazdjecieduza_painted.webp', picture: '/textures/corridor/rysuneknaobrazek3.webp', side: -1, z: -52.5, y: 2.95, w: 1.35, h: 1.05 },
    ];
    frameDecor.forEach((item) => {
      const rot = [0, item.side < 0 ? Math.PI / 2 : -Math.PI / 2, 0];
      addAssetPlane(corridor, item.path, item.w, item.h, [item.side * 3.535, item.y, item.z], rot, 'corridor-frame');
      addAssetPlane(corridor, item.picture, item.w * 0.72, item.h * 0.58, [item.side * 3.529, item.y, item.z], rot, 'corridor-picture');
    });

    addAssetPlane(corridor, '/textures/corridor/drzewkowdoniczce.webp', 0.95, 1.55, [-3.48, 0.72, -33.8], [0, Math.PI / 2, 0], 'corridor-plant');
    addAssetPlane(corridor, '/textures/corridor/kwiatekwdoniczce.webp', 0.8, 1.28, [3.48, 0.62, -47.5], [0, -Math.PI / 2, 0], 'corridor-flower');
    addAssetPlane(corridor, '/textures/corridor/szafkaprzod.webp', 1.25, 1.12, [3.48, 0.55, -9.5], [0, -Math.PI / 2, 0], 'corridor-cabinet');
    addAssetPlane(corridor, '/textures/corridor/gorastolika.webp', 1.15, 0.55, [-3.48, 0.72, -15.8], [0, Math.PI / 2, 0], 'corridor-table');

    const roomScene = new THREE.Group();
    scene.add(roomScene);
    roomScene.visible = false;

    const roomFloor = addPlane(roomScene, 10, 10, mat.floor, [0, 0, -8], [-Math.PI / 2, 0, 0], 'room-floor');
    const roomBack = addPlane(roomScene, 10, 5.8, mat.wall, [0, 2.9, -13], [0, 0, 0], 'room-back');
    const roomLeft = addPlane(roomScene, 10, 5.8, mat.wall, [-5, 2.9, -8], [0, Math.PI / 2, 0], 'room-left');
    const roomRight = addPlane(roomScene, 10, 5.8, mat.wall, [5, 2.9, -8], [0, -Math.PI / 2, 0], 'room-right');
    const roomCeiling = addPlane(roomScene, 10, 10, mat.ceiling, [0, 5.8, -8], [Math.PI / 2, 0, 0], 'room-ceiling');
    const roomSurfaces = [roomFloor, roomBack, roomLeft, roomRight, roomCeiling];

    const roomTitleMaterial = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });
    const roomTitle = addPlane(roomScene, 4.6, 2.3, roomTitleMaterial, [0, 3.55, -12.94], [0, 0, 0], 'room-title');
    roomTitle.userData.basePosition = roomTitle.position.clone();
    roomTitle.userData.baseRotation = roomTitle.rotation.clone();

    const roomBackdropMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false });
    const roomBackdrop = addPlane(roomScene, 8.2, 3.5, roomBackdropMaterial, [0, 1.8, -12.88], [0, 0, 0], 'room-backdrop');
    roomBackdrop.userData.basePosition = roomBackdrop.position.clone();
    roomBackdrop.userData.baseRotation = roomBackdrop.rotation.clone();

    const roomAccentMeshes = [];
    const accentSlots = [
      [-3.6, 1.05, -7.2, 1.2, 1.0],
      [3.65, 1.1, -7.6, 1.28, 1.1],
      [-4.2, 3.3, -10.2, 1.1, 1.1],
      [4.1, 3.2, -10.8, 1.12, 1.0],
      [0, 0.72, -6.4, 1.5, 0.9],
    ];
    accentSlots.forEach((slot, index) => {
      const [x, y, z, w, h] = slot;
      const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
      const mesh = addPlane(roomScene, w, h, material, [x, y, z], [0, 0, 0], `room-accent-${index}`);
      mesh.userData.basePosition = mesh.position.clone();
      mesh.userData.baseRotation = mesh.rotation.clone();
      mesh.userData.parallaxDepth = 0.12 + index * 0.02;
      roomAccentMeshes.push(mesh);
    });

    const cardMeshes = [];
    const photoMeshes = [];
    for (let i = 0; i < 4; i += 1) {
      const material = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });
      const x = -3.3 + i * 2.2;
      const y = 2.45 + (i % 2) * 0.3;
      const z = -10.7 + (i % 2) * 0.8;
      const mesh = addPlane(roomScene, 1.8, 2.25, material, [x, y, z], [0, (i - 1.5) * 0.12, 0], 'room-card');
      mesh.userData.basePosition = mesh.position.clone();
      mesh.userData.baseRotation = mesh.rotation.clone();
      mesh.userData.parallaxDepth = 0.1 + i * 0.035;
      cardMeshes.push(mesh);

      const photoMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide });
      const photo = addPlane(roomScene, 1.28, 0.72, photoMaterial, [x, y + 0.48, z + 0.012], [0, (i - 1.5) * 0.12, 0], 'room-photo');
      photo.userData.basePosition = photo.position.clone();
      photo.userData.baseRotation = photo.rotation.clone();
      photo.userData.parallaxDepth = 0.14 + i * 0.04;
      photoMeshes.push(photo);
    }

    const props = new THREE.Group();
    for (let i = 0; i < 12; i += 1) {
      const material = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? '#151515' : '#ffffff', wireframe: i % 2 === 0 });
      const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18 + (i % 3) * 0.04, 0), material);
      mesh.position.set(-4.2 + (i % 6) * 1.7, 0.35 + (i % 2) * 0.25, -6.2 - Math.floor(i / 6) * 1.8);
      mesh.rotation.set(i * 0.3, i * 0.22, i * 0.14);
      mesh.userData.basePosition = mesh.position.clone();
      mesh.userData.baseRotation = mesh.rotation.clone();
      mesh.userData.parallaxDepth = 0.06 + (i % 6) * 0.018;
      props.add(mesh);
    }
    roomScene.add(props);

    const state = {
      z: CORRIDOR_START_Z,
      x: 0,
      yaw: 0,
      pitch: 0,
      targetZ: CORRIDOR_START_Z,
      targetX: 0,
      drag: false,
      pointer: new THREE.Vector2(),
      roomX: 0,
      roomY: 0,
      roomCamera: new THREE.Vector3(0, 2.6, -3.7),
      roomLook: new THREE.Vector3(0, 2.5, -10.5),
      hovered: null,
      entranceHover: false,
      entranceFlash: 0,
      lastRoom: null,
      lastMapSignal: mapSignalRef.current,
      keys: new Set(),
    };

    const raycaster = new THREE.Raycaster();
    const clock = new THREE.Clock();

    const roomBackdropByKind = {
      gallery: '/textures/gallery/miastotlo.webp',
      studio: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
      about: '/textures/about/uowyspa.webp',
      contact: '/textures/contact/faletopdown.webp',
    };

    const roomAccentByKind = {
      gallery: [
        '/textures/gallery/monetuneprzod.webp',
        '/textures/gallery/timberkittyprzod.webp',
        '/textures/gallery/youngmultiprzod.webp',
        '/textures/gallery/bioprzod.webp',
        '/textures/gallery/railing.webp',
      ],
      studio: [
        '/textures/studio/monitor_front.webp',
        '/textures/studio/tv_front.webp',
        '/textures/studio/phone_front.webp',
        '/textures/studio/monitor_top.webp',
        '/textures/studio/tvfront_filmikprojektdlamultiego.webp',
      ],
      about: [
        '/textures/about/reactduzybalon.webp',
        '/textures/about/threejsduzybalon.webp',
        '/textures/about/GSAPduzybalon.webp',
        '/textures/about/gitmalybalon.webp',
        '/textures/about/awatarnachmurce.webp',
      ],
      contact: [
        '/textures/contact/beczka.webp',
        '/textures/contact/latarnia.webp',
        '/textures/contact/statek.webp',
        '/textures/contact/paper_form.webp',
        '/textures/contact/send_button.webp',
      ],
    };

    function applyRoomTextures(roomId) {
      const room = rooms.find((item) => item.id === roomId) || rooms[0];
      roomSurfaces.forEach((surface) => {
        surface.material = surface.name === 'room-floor' ? mat.floor : mat.wall;
      });
      roomTitle.material.map = createSignTexture(room.label, '个人展厅');
      roomTitle.material.needsUpdate = true;
      roomBackdrop.material.map = loadTexture(roomBackdropByKind[room.roomKind] || '/textures/paper-texture.webp');
      roomBackdrop.material.opacity = 0.82;
      roomBackdrop.material.needsUpdate = true;
      roomAccentMeshes.forEach((mesh, index) => {
        const path = roomAccentByKind[room.roomKind]?.[index];
        if (path) {
          mesh.material.map = loadTexture(path);
          mesh.material.opacity = 1;
        } else {
          mesh.material.opacity = 0;
        }
        mesh.material.needsUpdate = true;
      });
      cardMeshes.forEach((mesh, index) => {
        const card = roomCards[room.id]?.[index % 4];
        mesh.material.map = createCardTexture(room, index);
        mesh.material.needsUpdate = true;
        const photo = photoMeshes[index];
        if (card?.image) {
          photo.material.map = loadTexture(card.image);
          photo.material.opacity = 1;
        } else {
          photo.material.opacity = 0;
        }
        photo.material.needsUpdate = true;
      });
    }

    function setPointer(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      state.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    }

    function updateHover(event) {
      setPointer(event);
      if (activeRoomRef.current) {
        renderer.domElement.style.cursor = 'default';
        return;
      }
      if (!startedRef.current) {
        raycaster.setFromCamera(state.pointer, camera);
        const entranceHits = raycaster.intersectObjects(entranceDoorMeshes, false);
        state.entranceHover = entranceHits.length > 0;
        renderer.domElement.style.cursor = state.entranceHover ? 'pointer' : 'default';
        return;
      }
      raycaster.setFromCamera(state.pointer, camera);
      const hits = raycaster.intersectObjects(doorMeshes, false);
      const hovered = hits[0]?.object?.userData?.room || null;
      if (hovered !== state.hovered) {
        state.hovered = hovered;
        renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
        onHoverRoomRef.current?.(hovered);
      }
    }

    function enterHovered(event) {
      setPointer(event);
      if (activeRoomRef.current) return;
      if (!startedRef.current) {
        raycaster.setFromCamera(state.pointer, camera);
        const entranceHits = raycaster.intersectObjects(entranceDoorMeshes, false);
        if (entranceHits.length > 0) {
          state.entranceFlash = 1;
          window.setTimeout(() => onStartRef.current?.(), 220);
        }
        return;
      }
      raycaster.setFromCamera(state.pointer, camera);
      const hits = raycaster.intersectObjects(doorMeshes, false);
      const door = hits[0]?.object;
      const roomId = door?.userData?.room;
      if (roomId) {
        door.userData.flash = 1;
        window.setTimeout(() => onEnterRoomRef.current?.(roomId), 180);
      }
    }

    function onPointerDown(event) {
      state.drag = true;
      renderer.domElement.setPointerCapture?.(event.pointerId);
      renderer.domElement.style.cursor = 'grabbing';
      enterHovered(event);
    }

    function onPointerUp(event) {
      state.drag = false;
      renderer.domElement.releasePointerCapture?.(event.pointerId);
      renderer.domElement.style.cursor = activeRoomRef.current ? 'default' : state.hovered ? 'pointer' : 'grab';
    }

    function onPointerMove(event) {
      if (state.drag && startedRef.current && !activeRoomRef.current) {
        state.yaw -= event.movementX * 0.002;
        state.pitch = THREE.MathUtils.clamp(state.pitch - event.movementY * 0.0014, -0.24, 0.2);
      }
      updateHover(event);
    }

    function onWheel(event) {
      if (activeRoomRef.current || !startedRef.current) return;
      state.targetZ = wrapCorridorZ(state.targetZ + event.deltaY * 0.012);
    }

    function onKeyDown(event) {
      state.keys.add(event.key.toLowerCase());
    }

    function onKeyUp(event) {
      state.keys.delete(event.key.toLowerCase());
    }

    function onResize() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);

    let animationFrame = 0;
    let disposed = false;

    function animate() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.04);
      const active = activeRoomRef.current;

      if (state.lastMapSignal !== mapSignalRef.current) {
        state.lastMapSignal = mapSignalRef.current;
        state.targetZ = CORRIDOR_START_Z;
        state.z = CORRIDOR_START_Z;
      }

      const startedNow = startedRef.current;
      if (active !== state.lastRoom) {
        state.lastRoom = active;
        if (active) {
          applyRoomTextures(active);
          state.hovered = null;
          renderer.domElement.style.cursor = 'default';
          onHoverRoomRef.current?.(null);
        } else {
          renderer.domElement.style.cursor = 'grab';
        }
      }

      entrance.visible = !startedNow && !active;
      corridor.visible = startedNow && !active;
      roomScene.visible = Boolean(active);

      if (!startedNow && !active) {
        state.roomX = THREE.MathUtils.lerp(state.roomX, state.pointer.x, 0.07);
        state.roomY = THREE.MathUtils.lerp(state.roomY, state.pointer.y, 0.07);
        camera.position.lerp(new THREE.Vector3(state.roomX * 0.5, 1.25 + state.roomY * 0.18, 17.2), 0.08);
        camera.lookAt(state.roomX * 0.8, 1.65 + state.roomY * 0.25, entranceZ);
        state.entranceFlash = Math.max(0, state.entranceFlash - delta * 2.2);
        const entranceActive = state.entranceHover || state.entranceFlash > 0.05;
        [entranceLeftDoor, entranceRightDoor].forEach((mesh, index) => {
          const nextMap = entranceActive ? mesh.userData.paintedMap : mesh.userData.sketchMap;
          if (mesh.material.map !== nextMap) {
            mesh.material.map = nextMap;
            mesh.material.needsUpdate = true;
          }
          mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, entranceActive ? (index === 0 ? -0.03 : 0.03) : 0, 0.16);
          mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, entranceActive ? 1.035 : 1, 0.16));
        });
      } else if (!active) {
        const speed = delta * 18;
        if (state.keys.has('w') || state.keys.has('arrowup')) state.targetZ -= speed;
        if (state.keys.has('s') || state.keys.has('arrowdown')) state.targetZ += speed;
        if (state.keys.has('a') || state.keys.has('arrowleft')) state.targetX -= speed * 0.24;
        if (state.keys.has('d') || state.keys.has('arrowright')) state.targetX += speed * 0.24;

        state.targetZ = wrapCorridorZ(state.targetZ);
        state.z = wrapCorridorZ(state.z);
        if (Math.abs(state.targetZ - state.z) > CORRIDOR_LENGTH * 0.5) {
          state.z = state.targetZ;
        }
        state.targetX = THREE.MathUtils.clamp(state.targetX, -0.9, 0.9);
        state.z = THREE.MathUtils.lerp(state.z, state.targetZ, 0.09);
        state.x = THREE.MathUtils.lerp(state.x, state.targetX, 0.09);

        camera.position.set(state.x, 1.95, state.z);
        camera.rotation.set(state.pitch, state.yaw, 0);

        doorMeshes.forEach((door) => {
          const isHover = door.userData.room === state.hovered;
          const targetScale = isHover ? 1.055 : 1;
          door.userData.flash = Math.max(0, door.userData.flash - delta * 2.8);
          door.scale.setScalar(THREE.MathUtils.lerp(door.scale.x, targetScale, 0.16));
          const nextDoorMap = isHover || door.userData.flash > 0.05 ? door.userData.paintedMap : door.userData.sketchMap;
          if (door.material.map !== nextDoorMap) {
            door.material.map = nextDoorMap;
            door.material.needsUpdate = true;
          }
          if (door.userData.tint) {
            const tintOpacity = Math.max(door.userData.flash * 0.58, isHover ? 0.22 : 0);
            door.userData.tint.material.opacity = THREE.MathUtils.lerp(door.userData.tint.material.opacity, tintOpacity, 0.22);
            door.userData.tint.scale.copy(door.scale);
          }
        });
      } else {
        state.roomX = THREE.MathUtils.lerp(state.roomX, state.pointer.x, 0.08);
        state.roomY = THREE.MathUtils.lerp(state.roomY, state.pointer.y, 0.08);
        state.yaw = THREE.MathUtils.lerp(state.yaw, 0, 0.08);
        state.pitch = THREE.MathUtils.lerp(state.pitch, 0, 0.08);
        state.roomCamera.set(state.roomX * 0.48, 2.6 + state.roomY * 0.2, -3.7 + Math.abs(state.roomX) * 0.08);
        state.roomLook.set(state.roomX * 0.95, 2.5 + state.roomY * 0.26, -10.5);
        camera.position.lerp(state.roomCamera, 0.08);
        camera.lookAt(state.roomLook);

        roomTitle.position.x = roomTitle.userData.basePosition.x + state.roomX * 0.16;
        roomTitle.position.y = roomTitle.userData.basePosition.y + state.roomY * 0.08;
        roomTitle.rotation.x = roomTitle.userData.baseRotation.x - state.roomY * 0.028;
        roomTitle.rotation.y = roomTitle.userData.baseRotation.y + state.roomX * 0.045;

        roomBackdrop.position.x = roomBackdrop.userData.basePosition.x - state.roomX * 0.1;
        roomBackdrop.position.y = roomBackdrop.userData.basePosition.y - state.roomY * 0.04;
        roomBackdrop.rotation.y = roomBackdrop.userData.baseRotation.y - state.roomX * 0.02;

        roomAccentMeshes.forEach((mesh, index) => {
          const depth = mesh.userData.parallaxDepth;
          mesh.position.x = mesh.userData.basePosition.x - state.roomX * depth;
          mesh.position.y = mesh.userData.basePosition.y + Math.sin(clock.elapsedTime * (0.5 + index * 0.08) + index) * 0.025 + state.roomY * depth * 0.45;
          mesh.rotation.z = mesh.userData.baseRotation.z + Math.sin(clock.elapsedTime * 0.45 + index) * 0.02;
        });

        cardMeshes.forEach((mesh, index) => {
          const depth = mesh.userData.parallaxDepth;
          mesh.position.x = mesh.userData.basePosition.x + state.roomX * depth;
          mesh.position.y = mesh.userData.basePosition.y + state.roomY * depth * 0.58;
          mesh.rotation.x = mesh.userData.baseRotation.x - state.roomY * 0.032;
          mesh.rotation.y = mesh.userData.baseRotation.y + state.roomX * (0.055 + index * 0.01);
        });

        photoMeshes.forEach((mesh, index) => {
          const depth = mesh.userData.parallaxDepth;
          mesh.position.x = mesh.userData.basePosition.x + state.roomX * depth;
          mesh.position.y = mesh.userData.basePosition.y + state.roomY * depth * 0.62;
          mesh.rotation.x = mesh.userData.baseRotation.x - state.roomY * 0.038;
          mesh.rotation.y = mesh.userData.baseRotation.y + state.roomX * (0.06 + index * 0.012);
        });

        props.children.forEach((mesh, index) => {
          const depth = mesh.userData.parallaxDepth;
          mesh.position.x = mesh.userData.basePosition.x - state.roomX * depth;
          mesh.position.y = mesh.userData.basePosition.y + state.roomY * depth * 0.5;
          mesh.rotation.x += delta * (0.4 + index * 0.02);
          mesh.rotation.y += delta * (0.2 + index * 0.018);
        });
      }

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      host.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            material.map?.dispose();
            material.dispose();
          });
        } else {
          object.material?.map?.dispose();
          object.material?.dispose();
        }
      });
      textureCache.clear();
    };
  }, []);

  return <div ref={hostRef} className="canvas-wrapper" />;
}

function PaperButton({ label, children, onClick, active = false, className = '' }) {
  return (
    <button className={`paper-button ${active ? 'is-active' : ''} ${className}`} type="button" onClick={onClick} aria-label={label}>
      <span>{children}</span>
    </button>
  );
}

function MapPanel({ open, currentRoom, onClose, onEnter }) {
  const mapLayerByRoom = {
    about: '/images/map_about_painted.webp',
    gallery: '/images/map_gallery_painted.webp',
    studio: '/images/map_studio_painted.webp',
    contact: '/images/map_contact_painted.webp',
  };
  const activeLayer = currentRoom ? mapLayerByRoom[currentRoom] : '/images/map_about_painted.webp';
  const markerClass = currentRoom || 'corridor';
  return (
    <section className={`paper-panel map-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="map-content-clipped">
        <div className="panel-head map-header">
          <h2>地图</h2>
          <button type="button" onClick={onClose} aria-label="关闭地图">x</button>
        </div>
        <div className="map-container">
          <img className="map-image" src="/images/map.webp" alt="" />
          <img className="painted-map-layer" src={activeLayer} alt="" />
          <button className="map-hover-zone zone-about" type="button" onClick={() => onEnter('about')} aria-label="进入简介房间" />
          <button className="map-hover-zone zone-gallery" type="button" onClick={() => onEnter('gallery')} aria-label="进入经历房间" />
          <button className="map-hover-zone zone-contact" type="button" onClick={() => onEnter('contact')} aria-label="进入爱好房间" />
          <button className="map-hover-zone zone-studio" type="button" onClick={() => onEnter('studio')} aria-label="进入竞赛房间" />
          <span className="map-room-label about">简介</span>
          <span className="map-room-label gallery">经历</span>
          <span className="map-room-label contact">爱好</span>
          <span className="map-room-label studio">竞赛</span>
          <img className={`pin-slot about ${currentRoom === 'about' ? 'active' : ''}`} src="/images/pin-slot.webp" alt="" />
          <img className={`pin-slot gallery ${currentRoom === 'gallery' ? 'active' : ''}`} src="/images/pin-slot.webp" alt="" />
          <img className={`pin-slot contact ${currentRoom === 'contact' ? 'active' : ''}`} src="/images/pin-slot.webp" alt="" />
          <img className={`pin-slot studio ${currentRoom === 'studio' ? 'active' : ''}`} src="/images/pin-slot.webp" alt="" />
          <img className={`pin-marker ${markerClass}`} src="/images/pin.webp" alt="" />
        </div>
      </div>
    </section>
  );
}

function AudioPanel({ open, onClose }) {
  return (
    <section className={`paper-panel audio-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="audio-card">
        <div className="panel-head audio-header">
          <h2>声音</h2>
          <button type="button" onClick={onClose} aria-label="关闭声音面板">x</button>
        </div>
        <div className="audio-sliders-container">
          <label>
            <span>环境声</span>
            <input type="range" min="0" max="100" defaultValue="64" />
          </label>
          <label>
            <span>交互声</span>
            <input type="range" min="0" max="100" defaultValue="38" />
          </label>
        </div>
      </div>
    </section>
  );
}

function AchievementsPanel({ open, onClose }) {
  return (
    <section className={`paper-panel achievements-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="achievements-card">
        <div className="panel-head achievements-header">
          <h2>进度</h2>
          <button type="button" onClick={onClose} aria-label="关闭进度面板">x</button>
        </div>
        <ul>
          <li><span>ok</span> 穿过入口门</li>
          <li><span>ok</span> 打开手绘地图</li>
          <li><span>ok</span> 找到 painted 门</li>
          <li><span>...</span> 浏览四个房间</li>
        </ul>
      </div>
    </section>
  );
}

function RoomOverlay({ roomId }) {
  if (!roomId) return null;
  const copy = roomCopy[roomId];
  return (
    <aside className="room-note">
      <span>{copy.eyebrow}</span>
      <h1>{copy.title}</h1>
      <p>{copy.body}</p>
    </aside>
  );
}

function Preloader({ loaded }) {
  return (
    <div className={`preloader ${loaded ? 'loaded' : ''}`} aria-hidden={loaded}>
      <div className="preloader-half left" />
      <div className="preloader-half right" />
      <div className="preloader-content">
        <strong>LeoninCS</strong>
        <span>正在加载个人展厅</span>
        <em>{loaded ? '100%' : '86%'}</em>
      </div>
    </div>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [mapSignal, setMapSignal] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const hoveredLabel = useMemo(() => rooms.find((room) => room.id === hoveredRoom)?.label, [hoveredRoom]);

  function enterRoom(roomId) {
    setStarted(true);
    setActiveRoom(roomId);
    setMapOpen(false);
  }

  function exitRoom() {
    setActiveRoom(null);
    setMapSignal((value) => value + 1);
  }

  return (
    <main className={`app ${started ? 'started' : ''}`}>
      <ThreeExperience
        activeRoom={activeRoom}
        started={started}
        onStart={() => setStarted(true)}
        onEnterRoom={enterRoom}
        onHoverRoom={setHoveredRoom}
        mapSignal={mapSignal}
      />

      <div className="ui-layer">
        {activeRoom && (
          <PaperButton label="返回长廊" className="back-button" onClick={exitRoom}>
            返回
          </PaperButton>
        )}

        {started && (
          <>
            <nav className={`nav-controls ${mapOpen || audioOpen || achievementsOpen ? 'panel-open' : ''}`} aria-label="个人展厅控制">
              <PaperButton label="打开地图" active={mapOpen} onClick={() => setMapOpen((value) => !value)}>
                地图
              </PaperButton>
              <PaperButton label="打开声音面板" active={audioOpen} onClick={() => setAudioOpen((value) => !value)}>
                声音
              </PaperButton>
              <PaperButton label="打开进度面板" active={achievementsOpen} onClick={() => setAchievementsOpen((value) => !value)}>
                进度
              </PaperButton>
            </nav>

            <MapPanel
              open={mapOpen}
              currentRoom={activeRoom}
              onClose={() => setMapOpen(false)}
              onEnter={enterRoom}
            />
            <AudioPanel open={audioOpen} onClose={() => setAudioOpen(false)} />
            <AchievementsPanel open={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
          </>
        )}

        <RoomOverlay roomId={activeRoom} />

        {started && !activeRoom && (
          <div className="entrance-hint">
            <span>WASD / 滚轮循环移动</span>
            <span>{hoveredLabel ? `点击 ${hoveredLabel}` : '点击一扇门进入房间'}</span>
            <span>滑到底会回到入口</span>
          </div>
        )}

        {!started && loaded && (
          <button className="start-card" type="button" onClick={() => setStarted(true)}>
            <span>点击双开门</span>
            <strong>LeoninCS 3D Portfolio</strong>
          </button>
        )}
      </div>

      <Preloader loaded={loaded} />
    </main>
  );
}

ReactDOMClient.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
