const canvas = document.getElementById('bg');
const gl = canvas.getContext('webgl');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}
window.addEventListener('resize', resize);
resize();

const vertexShaderSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform vec2 resolution;
uniform float time;

float blob(vec2 uv, vec2 pos, float radius) {
  float d = length(uv - pos);
  return (radius * radius) / (d * d + 0.0001);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float t = time * 0.08; // slower movement

  float field = 0.0;

  // Larger, independently moving blobs
  for (int i = 0; i < 5; i++) {
    float fi = float(i);

    vec2 pos = vec2(
      0.5 + 0.35 * sin(t * (0.6 + fi * 0.1) + fi * 2.0),
      0.5 + 0.35 * cos(t * (0.5 + fi * 0.13) + fi * 1.5)
    );

    float radius = 0.18 + 0.05 * sin(fi * 3.0 + t);

    field += blob(uv, pos, radius);
  }

  // Softer blending
  float intensity = smoothstep(0.7, 1.4, field);

  // Darker emerald tone
  vec3 color = vec3(
    0.0,
    intensity * 0.45,
    intensity * 0.25
  );

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const position = gl.getAttribLocation(program, 'position');
const resolution = gl.getUniformLocation(program, 'resolution');
const time = gl.getUniformLocation(program, 'time');

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),
  gl.STATIC_DRAW
);

gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

function render(t) {
  gl.uniform2f(resolution, canvas.width, canvas.height);
  gl.uniform1f(time, t * 0.001);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

async function fetchLatestVersion() {
  const button = document.getElementById("download");

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/preservia/firmware/refs/heads/main/info/latest.json",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!data.version) {
      throw new Error("Version field missing");
    }

    button.textContent = `Download • ${data.version}`;

    button.dataset.version = data.version;

  } catch (error) {
    console.error("Version fetch failed:", error);
    button.textContent = "Download • Unavailable";
    button.disabled = true;
    button.style.opacity = "0.5";
    button.style.cursor = "not-allowed";
  }
}

fetchLatestVersion();
