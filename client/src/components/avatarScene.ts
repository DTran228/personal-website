import {
  ACESFilmicToneMapping, CanvasTexture, CatmullRomCurve3, Color, CylinderGeometry,
  DataTexture, DirectionalLight, Group, HemisphereLight, MathUtils, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, NearestFilter,
  OrthographicCamera, PlaneGeometry, RedFormat, Scene, SphereGeometry, SRGBColorSpace,
  TubeGeometry, Vector3, WebGLRenderer,
} from "three";
import type { BufferGeometry, Material } from "three";

export type AvatarStyle = "clay" | "toon" | "vinyl";

type Interaction = { x: number; y: number; touchedAt: number };
type Point = [number, number, number];

const finishes = {
  clay: { skin: "#cb8d67", hair: "#252228", sweater: "#2a463b", base: "#8c6b56", width: 0.98, height: 1.08, roughness: 0.86 },
  toon: { skin: "#e2a17a", hair: "#191a26", sweater: "#233f44", base: "#566e81", width: 0.93, height: 1.12, roughness: 0.75 },
  vinyl: { skin: "#d99470", hair: "#292229", sweater: "#2e4a3d", base: "#a07b67", width: 1.09, height: 1.02, roughness: 0.28 },
};

function makeAvatar(style: AvatarStyle) {
  const finish = finishes[style];
  const model = new Group();
  const head = new Group();
  head.position.y = 0.22;
  head.scale.set(finish.width, finish.height, 1);
  model.add(head);

  const sphere = new SphereGeometry(1, 36, 24);
  const tones = new DataTexture(new Uint8Array([70, 156, 238]), 3, 1, RedFormat);
  tones.minFilter = tones.magFilter = NearestFilter;
  tones.needsUpdate = true;
  const materials: Material[] = [];
  const geometries: BufferGeometry[] = [sphere];
  const material = (color: string, roughness = finish.roughness) => {
    const paint = style === "toon"
      ? new MeshToonMaterial({ color, gradientMap: tones })
      : new MeshStandardMaterial({ color, roughness });
    materials.push(paint);
    return paint;
  };

  function oval(parent: Group, paint: Material, position: Point, size: Point) {
    const part = new Mesh(sphere, paint);
    part.position.set(...position);
    part.scale.set(...size);
    parent.add(part);
    return part;
  }

  function line(parent: Group, paint: Material, points: Point[], radius: number, closed = false) {
    const curve = new CatmullRomCurve3(points.map(point => new Vector3(...point)), closed);
    const geometry = new TubeGeometry(curve, 40, radius, 8, closed);
    geometries.push(geometry);
    parent.add(new Mesh(geometry, paint));
  }

  const skin = material(finish.skin);
  const ear = material("#b57459");
  const hair = material(finish.hair);
  const hairAccent = material(style === "toon" ? "#38364a" : "#353038");
  const knit = material(finish.sweater);
  const collar = material("#263c35");
  const frame = material("#2c2829", 0.45);
  const bridge = material("#c0aa83", 0.35);
  const sclera = material("#f2dcca");
  const iris = material("#452d26");
  const pupil = material("#20191a");
  const glint = material("#fff0da");
  const mouth = material("#713d36");

  // The head is a separate group, so its glasses and expression move with it.
  oval(model, skin, [0, -0.26, 0], [0.28, 0.46, 0.27]);
  oval(model, knit, [0, -0.98, 0], [1.12, 0.72, 0.49]);
  oval(model, knit, [-0.78, -1.14, -0.02], [0.38, 0.50, 0.40]).rotation.z = -0.26;
  oval(model, knit, [0.78, -1.14, -0.02], [0.38, 0.50, 0.40]).rotation.z = 0.26;
  oval(model, collar, [0, -0.47, 0.12], [0.43, 0.12, 0.33]);
  oval(model, skin, [0, -0.41, 0.15], [0.27, 0.12, 0.24]);

  const plinthGeometry = new CylinderGeometry(1.11, 1.18, 0.19, 64);
  geometries.push(plinthGeometry);
  const plinth = new Mesh(plinthGeometry, material(finish.base));
  plinth.position.y = -1.58;

  const label = document.createElement("canvas");
  label.width = 512;
  label.height = 128;
  const ink = label.getContext("2d");
  let shirtTexture: CanvasTexture | undefined;
  if (ink) {
    ink.font = "bold 90px Georgia";
    ink.textAlign = "center";
    ink.textBaseline = "middle";
    ink.fillStyle = "#ead6ab";
    ink.fillText("BOSTON", 256, 66, 480);
    shirtTexture = new CanvasTexture(label);
    shirtTexture.colorSpace = SRGBColorSpace;
    const lettering = new MeshBasicMaterial({ map: shirtTexture, transparent: true, depthWrite: false });
    materials.push(lettering);
    const letteringSurface = new PlaneGeometry(1.22, 0.32, 32, 8);
    const vertices = letteringSurface.attributes.position;
    for (let index = 0; index < vertices.count; index++) {
      const x = vertices.getX(index);
      const y = vertices.getY(index);
      // Match the front of the sweater's ellipsoid, with a tiny offset.
      const z = 0.49 * Math.sqrt(1 - (x / 1.12) ** 2 - (y / 0.72) ** 2);
      vertices.setZ(index, z + 0.012);
    }
    geometries.push(letteringSurface);
    const letteringMesh = new Mesh(letteringSurface, lettering);
    letteringMesh.position.y = -0.98;
    model.add(letteringMesh);
  }

  oval(head, skin, [0, 0.39, 0], [0.65, 0.80, 0.56]);
  oval(head, skin, [0, 0.07, 0.13], [0.48, 0.48, 0.45]);
  oval(head, hair, [0, 0.81, -0.15], [0.71, 0.58, 0.57]);
  oval(head, hair, [0, 0.96, 0.10], [0.73, 0.43, 0.54]).rotation.z = -0.10;

  const fringe: [number, number, number, number][] = [
    [-0.55, 0.71, 0.32, -0.36], [-0.39, 0.88, 0.51, -0.37],
    [-0.16, 0.91, 0.56, -0.30], [0.08, 0.89, 0.58, -0.16],
    [0.32, 0.86, 0.52, 0.14], [0.53, 0.75, 0.37, 0.44],
  ];
  fringe.forEach(([x, y, z, angle], index) => {
    const lock = oval(head, index === 1 || index === 3 ? hairAccent : hair, [x, y, z], [0.21, 0.27, 0.16]);
    lock.rotation.z = angle;
  });

  for (const side of [-1, 1]) {
    oval(head, skin, [side * 0.61, 0.19, 0.01], [0.14, 0.22, 0.13]);
    oval(head, ear, [side * 0.68, 0.19, 0.10], [0.055, 0.11, 0.035]);
    oval(head, glint, [side * 0.67, 0.10, 0.13], [0.035, 0.085, 0.03]);
    oval(head, hair, [side * 0.59, 0.58, 0.05], [0.14, 0.31, 0.25]);
    oval(head, hair, [side * 0.265, 0.525, 0.53], [0.138, 0.029, 0.036]).rotation.z = side * -0.10;

    const eyeX = side * 0.255;
    const eyeHeight = style === "vinyl" ? 0.087 : 0.066;
    oval(head, sclera, [eyeX, 0.365, 0.51], [0.137, eyeHeight, 0.055]);
    oval(head, iris, [eyeX, 0.366, 0.556], [0.063, eyeHeight * 0.91, 0.030]);
    oval(head, pupil, [eyeX, 0.366, 0.577], [0.035, 0.043, 0.016]);
    oval(head, glint, [eyeX - 0.020, 0.390, 0.592], [0.013, 0.014, 0.008]);

    const lens: Point[] = [
      [-0.203, 0.101, 0.58], [-0.158, 0.166, 0.61], [0.153, 0.157, 0.57],
      [0.212, 0.097, 0.54], [0.168, -0.111, 0.55], [0.089, -0.151, 0.60],
      [-0.123, -0.14, 0.63], [-0.185, -0.080, 0.63],
    ];
    line(head, frame, lens.map(([x, y, z]): Point => [side * (0.265 + x), 0.35 + y, z]), style === "vinyl" ? 0.022 : 0.015, true);
    line(head, frame, [[side * 0.465, 0.447, 0.55], [side * 0.55, 0.428, 0.45], [side * 0.638, 0.35, 0.13]], 0.014);
  }

  line(head, bridge, [[-0.076, 0.45, 0.61], [0, 0.474, 0.63], [0.076, 0.45, 0.61]], 0.013);
  oval(head, skin, [0, 0.245, 0.565], [0.078, 0.158, 0.102]);
  oval(head, skin, [0, 0.147, 0.62], [0.115, 0.075, 0.084]);
  oval(head, ear, [-0.068, 0.105, 0.655], [0.027, 0.013, 0.016]);
  oval(head, ear, [0.068, 0.105, 0.655], [0.027, 0.013, 0.016]);

  const neutral = new Group();
  const smile = new Group();
  line(neutral, mouth, [[-0.15, -0.064, 0.553], [-0.076, -0.086, 0.573], [0.065, -0.084, 0.575], [0.15, -0.063, 0.553]], 0.014);
  line(smile, mouth, [[-0.17, -0.026, 0.553], [-0.101, -0.084, 0.576], [0, -0.103, 0.586], [0.101, -0.084, 0.576], [0.17, -0.026, 0.553]], 0.023);
  line(smile, sclera, [[-0.09, -0.075, 0.594], [0, -0.087, 0.608], [0.09, -0.075, 0.594]], 0.008);
  smile.visible = false;
  head.add(neutral, smile);

  return {
    model, head, plinth, neutral, smile,
    dispose() {
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(paint => paint.dispose());
      shirtTexture?.dispose();
      tones.dispose();
    },
  };
}

export function mountAvatar(canvas: HTMLCanvasElement, style: AvatarStyle, input: Interaction) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;

  const scene = new Scene();
  const camera = new OrthographicCamera(-2, 2, 2, -2, 0.1, 25);
  camera.position.set(0.12, 0.35, 7);
  camera.lookAt(0, -0.10, 0);
  const key = new DirectionalLight(new Color("#fff0d9"), 3.2);
  key.position.set(-3, 5, 5);
  const rim = new DirectionalLight(new Color("#e4e4ff"), 2);
  rim.position.set(3, 2, -4);
  const avatar = makeAvatar(style);
  scene.add(avatar.model, avatar.plinth, new HemisphereLight("#f9e9db", "#736481", 1.85), key, rim);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const target = canvas.parentElement!;
  let frame = 0;
  let previous = performance.now();
  let inView = true;

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    const halfHeight = 1.94;
    camera.left = -(width / height) * halfHeight;
    camera.right = -camera.left;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  }

  function draw(time: number) {
    const dt = Math.min((time - previous) / 1000, 0.05);
    previous = time;
    const age = (time - input.touchedAt) / 1000;
    const reacting = age >= 0 && age < 1.45;
    const distance = Math.hypot(input.x, input.y);
    const near = target.dataset.pointer === "near" && !reduceMotion.matches;
    const dodge = near ? MathUtils.clamp(1 - distance / 1.22, 0, 1) : 0;
    const away = input.x < 0 ? 1 : -1;
    const flinch = reacting && !reduceMotion.matches ? Math.sin(age * 25) * Math.exp(-age * 11) : 0;

    avatar.model.position.x = MathUtils.damp(avatar.model.position.x, away * dodge * 0.36, 11, dt);
    avatar.model.position.y = flinch * 0.13;
    avatar.model.rotation.z = MathUtils.damp(avatar.model.rotation.z, -away * dodge * 0.10, 11, dt);
    avatar.head.rotation.y = MathUtils.damp(avatar.head.rotation.y, -0.08 + away * dodge * 0.29 + flinch * 0.18, 10, dt);
    avatar.head.rotation.x = MathUtils.damp(avatar.head.rotation.x, (near ? input.y * -0.08 : 0) - flinch * 0.10, 10, dt);
    avatar.smile.visible = reacting;
    avatar.neutral.visible = !reacting;
    renderer.render(scene, camera);
    if (inView) frame = requestAnimationFrame(draw);
  }

  const size = new ResizeObserver(resize);
  size.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) => {
    if (inView === entry.isIntersecting) return;
    inView = entry.isIntersecting;
    if (inView) {
      previous = performance.now();
      frame = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(frame);
    }
  });
  visibility.observe(canvas);
  resize();
  frame = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(frame);
    size.disconnect();
    visibility.disconnect();
    avatar.dispose();
    renderer.dispose();
  };
}
