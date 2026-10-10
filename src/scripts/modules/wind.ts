/**
 * wind — makes a still cut-out (flowers, foliage) move as if a breeze runs through it.
 *
 *   <img data-wind="top" />      hangs from above: fixed at the top, tips move most
 *   <img data-wind="bottom" />   grows from the floor: fixed at the base
 *
 * The image is redrawn on a WebGL canvas where every pixel is nudged by a few layered
 * waves — a slow sway for the branches and a fast, fine flutter for petals and leaves —
 * scaled by distance from where the plant is attached. It plays on its own, like a
 * looping clip; nothing reacts to the pointer.
 *
 * Runs only while on screen. Without WebGL (or with reduced motion) the <img> stays.
 */
import { reduced } from '../core/gsap';

const VERT = `
attribute vec2 p;
varying vec2 uv;
void main() {
  uv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D t;
uniform float time;
uniform float mode;   // 0 = hangs from top, 1 = grows from bottom
uniform float aspect; // width / height
varying vec2 uv;

void main() {
  // 0 where the plant is attached, 1 at its free tips
  float free = mode < 0.5 ? smoothstep(0.02, 0.8, uv.y) : smoothstep(0.0, 0.85, 1.0 - uv.y);

  // the breeze comes in gusts rather than blowing evenly, but never drops to nothing
  float lull = 0.72 + 0.28 * sin(time * 0.53) * sin(time * 0.29 + 1.7);

  // branches: a wide sway that travels across the plant
  float w1 = sin(time * 1.7 + uv.x * 3.1 + uv.y * 2.2);
  float w2 = sin(time * 2.9 + uv.x * 6.7 - uv.y * 4.9 + 1.3);
  // petals and leaves: quick, fine flutter
  float f1 = sin(time * 6.1 + uv.x * 41.0 + uv.y * 33.0);
  float f2 = cos(time * 5.2 - uv.x * 29.0 + uv.y * 47.0);
  float f3 = sin(time * 8.3 + uv.x * 71.0 - uv.y * 63.0);

  vec2 off = free * lull * (vec2(w1 * 0.016 + w2 * 0.007, w2 * 0.006 + w1 * 0.004) + vec2(f1 + f3 * 0.5, f2) * 0.0027);

  // a plant cut off by the frame edge must not slide in from that edge
  if (mode < 0.5) off.x *= smoothstep(0.0, 0.1, uv.x);
  off.x /= aspect;

  vec2 s = uv - off;
  vec4 c = texture2D(t, s);
  float inside = step(0.0, s.x) * step(s.x, 1.0) * step(0.0, s.y) * step(s.y, 1.0);
  gl_FragColor = c * inside;
}`;

function mount(img: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  } catch {
    return;
  }

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uTime = u('time');
  gl.uniform1f(u('mode'), img.dataset.wind === 'bottom' ? 1 : 0);
  gl.uniform1f(u('aspect'), img.naturalWidth / img.naturalHeight);

  const fit = () => {
    const w = Math.round(Math.min(img.naturalWidth, img.clientWidth * Math.min(window.devicePixelRatio || 1, 2)));
    if (!w || canvas.width === w) return;
    canvas.width = w;
    canvas.height = Math.round((w * img.naturalHeight) / img.naturalWidth);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  fit();
  window.addEventListener('resize', fit);

  canvas.className = 'wind-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  img.after(canvas);
  img.classList.add('is-wind');

  let visible = false;
  let raf = 0;
  const t0 = performance.now() - Math.random() * 20000; // each plant on its own phase
  const frame = (now: number) => {
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = visible ? requestAnimationFrame(frame) : 0;
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) {
      fit();
      raf = requestAnimationFrame(frame);
    }
  }).observe(canvas);
  requestAnimationFrame(frame); // first frame, so the canvas is never blank
}

export function initWind(scope: ParentNode = document) {
  if (reduced) return;
  scope.querySelectorAll<HTMLImageElement>('img[data-wind]').forEach((img) => {
    if (img.complete && img.naturalWidth) mount(img);
    else img.addEventListener('load', () => mount(img), { once: true });
  });
}
