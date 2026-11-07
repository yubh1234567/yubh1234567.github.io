(() => {
  const canvas = document.querySelector("#vehicleStage");
  const hero = document.querySelector(".hero");
  if (!canvas || !hero) return;

  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const particles = Array.from({ length: 44 }, (_, index) => ({
    x: ((index * 83) % 997) / 997,
    y: ((index * 47 + 19) % 389) / 389,
    size: index % 7 === 0 ? 1.4 : 0.7,
    speed: 0.18 + (index % 5) * 0.035,
  }));

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let scrollProgress = 0;
  let frameId = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const mix = (start, end, amount) => start + (end - start) * amount;

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw(performance.now());
  }

  function updateScroll() {
    const distance = Math.max(hero.offsetHeight * 0.82, 1);
    scrollProgress = clamp(window.scrollY / distance);
    if (reduceMotion.matches) draw(performance.now());
  }

  function getScene() {
    const mobile = width < 760;
    return {
      mobile,
      centerX: mobile ? width * 0.53 : width * 0.735 + pointer.x * 12,
      centerY: mobile ? height * 0.585 : height * 0.535 + pointer.y * 8,
      scale: mobile
        ? Math.min(width / 485, 0.92)
        : Math.min(width / 1080, height / 720, 1.42),
      yaw: mobile ? -0.04 : pointer.x * 0.025,
    };
  }

  function project(point, scene) {
    const [x, y, z = 0] = point;
    const cos = Math.cos(scene.yaw);
    const sin = Math.sin(scene.yaw);
    const rotatedX = x * cos - y * sin;
    const rotatedY = x * sin + y * cos;
    return [
      scene.centerX + (rotatedX - rotatedY) * 0.87 * scene.scale,
      scene.centerY + (rotatedX + rotatedY) * 0.34 * scene.scale - z * scene.scale,
    ];
  }

  function polygon3D(points, scene, fill, stroke, lineWidth = 1) {
    const projected = points.map((point) => project(point, scene));
    context.save();
    context.beginPath();
    context.moveTo(projected[0][0], projected[0][1]);
    projected.slice(1).forEach(([x, y]) => context.lineTo(x, y));
    context.closePath();
    if (fill) {
      context.fillStyle = fill;
      context.fill();
    }
    if (stroke) {
      context.strokeStyle = stroke;
      context.lineWidth = lineWidth;
      context.stroke();
    }
    context.restore();
    return projected;
  }

  function line3D(points, scene, color, lineWidth = 1, dash = []) {
    const projected = points.map((point) => project(point, scene));
    context.save();
    context.beginPath();
    context.setLineDash(dash);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.moveTo(projected[0][0], projected[0][1]);
    projected.slice(1).forEach(([x, y]) => context.lineTo(x, y));
    context.stroke();
    context.restore();
    return projected;
  }

  function label(text, x, y, align = "left", color = "rgba(173, 196, 230, 0.62)", size = 9) {
    context.save();
    context.fillStyle = color;
    context.font = `${size}px "IBM Plex Mono", monospace`;
    context.textAlign = align;
    context.textBaseline = "middle";
    context.fillText(text, x, y);
    context.restore();
  }

  function drawAtmosphere(now) {
    const seconds = now / 1000;
    const scene = getScene();
    const horizon = height * (scene.mobile ? 0.42 : 0.29);
    const vanishX = scene.mobile ? width * 0.52 : width * 0.74;

    context.save();
    const glow = context.createRadialGradient(scene.centerX, scene.centerY - 30, 20, scene.centerX, scene.centerY, width * 0.34);
    glow.addColorStop(0, "rgba(32, 112, 255, 0.16)");
    glow.addColorStop(0.48, "rgba(18, 85, 190, 0.06)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    context.restore();

    context.save();
    context.strokeStyle = "rgba(91, 134, 205, 0.1)";
    context.lineWidth = 1;
    const verticalCount = scene.mobile ? 12 : 20;
    for (let index = -verticalCount; index <= verticalCount; index += 1) {
      const bottomX = vanishX + index * (width / verticalCount) * 0.72;
      context.beginPath();
      context.moveTo(vanishX + pointer.x * 5, horizon);
      context.lineTo(bottomX, height + 18);
      context.stroke();
    }
    for (let index = 0; index < 16; index += 1) {
      const ratio = index / 15;
      const y = horizon + ratio * ratio * (height - horizon);
      context.globalAlpha = 0.35 + ratio * 0.65;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    context.restore();

    context.save();
    particles.forEach((particle, index) => {
      const drift = reduceMotion.matches ? 0 : seconds * particle.speed;
      const x = (particle.x * width + drift * 18 + pointer.x * (index % 3)) % width;
      const y = (particle.y * height + Math.sin(seconds * 0.45 + index) * 5 + height) % height;
      context.fillStyle = index % 9 === 0 ? "rgba(51, 226, 255, 0.48)" : "rgba(137, 171, 224, 0.2)";
      context.fillRect(x, y, particle.size, particle.size);
    });
    context.restore();

    const ringRadius = (scene.mobile ? 128 : 218) * scene.scale;
    context.save();
    context.translate(scene.centerX, scene.centerY - 28 * scene.scale);
    context.rotate(-0.22);
    context.strokeStyle = "rgba(56, 124, 235, 0.18)";
    context.lineWidth = 1;
    context.setLineDash([2, 11]);
    context.beginPath();
    context.ellipse(0, 0, ringRadius, ringRadius * 0.42, 0, 0, Math.PI * 2);
    context.stroke();
    context.setLineDash([]);
    context.strokeStyle = "rgba(51, 226, 255, 0.22)";
    context.beginPath();
    context.ellipse(0, 0, ringRadius * 0.73, ringRadius * 0.31, 0, seconds * 0.15, seconds * 0.15 + Math.PI * 0.72);
    context.stroke();
    context.restore();
  }

  function drawWheel(point, scene, visible = true) {
    const [x, y] = project(point, scene);
    context.save();
    context.translate(x, y);
    context.rotate(0.36);
    context.fillStyle = visible ? "rgba(1, 5, 11, 0.96)" : "rgba(1, 5, 11, 0.72)";
    context.strokeStyle = visible ? "rgba(93, 137, 207, 0.58)" : "rgba(93, 137, 207, 0.24)";
    context.lineWidth = 1.2;
    context.beginPath();
    context.ellipse(0, 0, 24 * scene.scale, 10 * scene.scale, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.strokeStyle = "rgba(51, 226, 255, 0.24)";
    context.beginPath();
    context.ellipse(0, 0, 11 * scene.scale, 4 * scene.scale, 0, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  function drawModule(point, scene, name, active, lift = 0) {
    const lifted = [point[0], point[1], point[2] + lift];
    const [x, y] = project(lifted, scene);
    const size = 16 * scene.scale;
    context.save();
    context.translate(x, y);
    context.rotate(0.36);
    context.fillStyle = active ? "rgba(29, 177, 220, 0.76)" : "rgba(27, 70, 135, 0.86)";
    context.strokeStyle = active ? "#78f0ff" : "rgba(99, 160, 255, 0.8)";
    context.shadowColor = active ? "rgba(51, 226, 255, 0.85)" : "rgba(63, 125, 255, 0.45)";
    context.shadowBlur = active ? 18 : 8;
    context.fillRect(-size / 2, -size / 2, size, size);
    context.strokeRect(-size / 2, -size / 2, size, size);
    context.restore();

    if (lift > 1) {
      const [baseX, baseY] = project(point, scene);
      context.save();
      context.strokeStyle = "rgba(51, 226, 255, 0.24)";
      context.setLineDash([2, 4]);
      context.beginPath();
      context.moveTo(baseX, baseY);
      context.lineTo(x, y);
      context.stroke();
      context.restore();
    }

    return { x, y, name };
  }

  function routePoint(points, ratio) {
    const lengths = [];
    let total = 0;
    for (let index = 1; index < points.length; index += 1) {
      const length = Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]);
      lengths.push(length);
      total += length;
    }
    let distance = ratio * total;
    for (let index = 0; index < lengths.length; index += 1) {
      if (distance <= lengths[index]) {
        const amount = distance / lengths[index];
        return [
          mix(points[index][0], points[index + 1][0], amount),
          mix(points[index][1], points[index + 1][1], amount),
        ];
      }
      distance -= lengths[index];
    }
    return points.at(-1);
  }

  function drawDataPacket(route, ratio, color) {
    const [x, y] = routePoint(route, ratio);
    context.save();
    context.fillStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 15;
    context.fillRect(x - 2.5, y - 2.5, 5, 5);
    context.restore();
  }

  function drawVehicle(now) {
    const scene = getScene();
    const seconds = now / 1000;
    const moduleLift = scrollProgress * 24;
    const activeIndex = reduceMotion.matches ? 1 : Math.floor(seconds * 0.42) % 4;

    const shadow = project([0, 0, 0], scene);
    context.save();
    const shadowGradient = context.createRadialGradient(shadow[0], shadow[1], 20, shadow[0], shadow[1], 230 * scene.scale);
    shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.72)");
    shadowGradient.addColorStop(0.56, "rgba(0, 8, 22, 0.44)");
    shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = shadowGradient;
    context.beginPath();
    context.ellipse(shadow[0], shadow[1] + 18 * scene.scale, 245 * scene.scale, 78 * scene.scale, 0.34, 0, Math.PI * 2);
    context.fill();
    context.restore();

    drawWheel([-102, -76, 24], scene, false);
    drawWheel([98, -76, 24], scene, false);
    drawWheel([-102, 76, 24], scene, true);
    drawWheel([98, 76, 24], scene, true);

    const lower = [
      [-155, -42, 26], [-120, -70, 26], [110, -66, 26], [154, -38, 26],
      [154, 38, 26], [110, 66, 26], [-120, 70, 26], [-155, 42, 26],
    ];
    const upper = lower.map(([x, y]) => [x, y, 48]);

    for (let index = 0; index < lower.length; index += 1) {
      const next = (index + 1) % lower.length;
      polygon3D(
        [lower[index], lower[next], upper[next], upper[index]],
        scene,
        index < 4 ? "rgba(8, 24, 49, 0.92)" : "rgba(5, 16, 34, 0.96)",
        "rgba(78, 132, 218, 0.42)",
      );
    }
    polygon3D(upper, scene, "rgba(12, 38, 76, 0.88)", "rgba(105, 164, 255, 0.68)", 1.2);

    const cabinBase = [[-58, -50, 49], [74, -45, 49], [92, 40, 49], [-62, 48, 49]];
    const cabinRoof = [[-34, -38, 105], [52, -34, 105], [64, 31, 105], [-38, 35, 105]];
    polygon3D([cabinBase[0], cabinBase[1], cabinRoof[1], cabinRoof[0]], scene, "rgba(8, 28, 58, 0.92)", "rgba(80, 151, 244, 0.58)");
    polygon3D([cabinBase[1], cabinBase[2], cabinRoof[2], cabinRoof[1]], scene, "rgba(5, 17, 36, 0.94)", "rgba(80, 151, 244, 0.48)");
    polygon3D([cabinBase[2], cabinBase[3], cabinRoof[3], cabinRoof[2]], scene, "rgba(6, 22, 46, 0.94)", "rgba(80, 151, 244, 0.46)");
    polygon3D([cabinBase[3], cabinBase[0], cabinRoof[0], cabinRoof[3]], scene, "rgba(8, 31, 63, 0.92)", "rgba(80, 151, 244, 0.5)");
    polygon3D(cabinRoof, scene, "rgba(15, 48, 91, 0.9)", "rgba(112, 181, 255, 0.74)", 1.2);

    const glass = [[-28, -37, 104], [48, -33, 104], [58, 27, 104], [-31, 32, 104]];
    polygon3D(glass, scene, "rgba(19, 92, 138, 0.22)", "rgba(51, 226, 255, 0.38)");
    line3D([[-154, 0, 49], [154, 0, 49]], scene, "rgba(51, 226, 255, 0.36)", 1);
    line3D([[-95, -64, 49], [-95, 64, 49]], scene, "rgba(83, 139, 229, 0.42)", 1);
    line3D([[111, -60, 49], [111, 60, 49]], scene, "rgba(83, 139, 229, 0.42)", 1);

    const busRoute3D = [[-118, 0, 55], [-50, 0, 55], [18, 0, 112], [74, 0, 58], [120, 0, 55]];
    const busRoute = line3D(busRoute3D, scene, "rgba(51, 226, 255, 0.72)", 1.25);
    const branchRoutes3D = [
      [[-84, 0, 55], [-84, 34, 55]],
      [[18, 0, 112], [18, -27, 112]],
      [[76, 0, 58], [76, 35, 58]],
      [[116, 0, 55], [116, -24, 55]],
    ];
    const branchRoutes = branchRoutes3D.map((route) => line3D(route, scene, "rgba(74, 130, 223, 0.62)", 1));

    const modules = [
      drawModule([-84, 34, 57], scene, "GW", activeIndex === 0, moduleLift * 0.65),
      drawModule([18, -27, 114], scene, "IVI", activeIndex === 1, moduleLift),
      drawModule([76, 35, 60], scene, "TCU", activeIndex === 2, moduleLift * 0.82),
      drawModule([116, -24, 57], scene, "ADAS", activeIndex === 3, moduleLift * 0.48),
    ];

    branchRoutes.forEach((route, index) => {
      const ratio = reduceMotion.matches ? 0.58 : (seconds * (0.18 + index * 0.018) + index * 0.19) % 1;
      drawDataPacket(route, ratio, index === activeIndex ? "#72f0ff" : "#3f7dff");
    });
    drawDataPacket(busRoute, reduceMotion.matches ? 0.4 : (seconds * 0.11) % 1, "#ffb35c");
    drawDataPacket(busRoute, reduceMotion.matches ? 0.72 : (seconds * 0.11 + 0.48) % 1, "#33e2ff");

    const scanRatio = reduceMotion.matches ? 0.46 : (seconds * 0.075 + scrollProgress * 0.4) % 1;
    const scanX = mix(-155, 155, scanRatio);
    const scanPlane = [[scanX, -84, 5], [scanX, 84, 5], [scanX, 84, 132], [scanX, -84, 132]];
    polygon3D(scanPlane, scene, "rgba(51, 226, 255, 0.045)", "rgba(51, 226, 255, 0.48)", 1);

    modules.forEach((module, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const lineEndX = module.x + side * (scene.mobile ? 26 : 42);
      const lineEndY = module.y - (scene.mobile ? 18 : 24);
      context.save();
      context.strokeStyle = index === activeIndex ? "rgba(51, 226, 255, 0.72)" : "rgba(98, 148, 225, 0.34)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(module.x, module.y);
      context.lineTo(lineEndX, lineEndY);
      context.lineTo(lineEndX + side * (scene.mobile ? 16 : 24), lineEndY);
      context.stroke();
      context.restore();
      label(
        module.name,
        lineEndX + side * (scene.mobile ? 19 : 27),
        lineEndY,
        side < 0 ? "right" : "left",
        index === activeIndex ? "#8bf3ff" : "rgba(166, 191, 228, 0.58)",
        scene.mobile ? 7 : 9,
      );
    });

    const pulse = project([18, -27, 114 + moduleLift], scene);
    context.save();
    context.strokeStyle = "rgba(51, 226, 255, 0.34)";
    context.lineWidth = 1;
    const pulseRadius = (reduceMotion.matches ? 22 : 18 + ((seconds * 18) % 24)) * scene.scale;
    context.globalAlpha = reduceMotion.matches ? 0.5 : 1 - ((seconds * 0.75) % 1);
    context.beginPath();
    context.arc(pulse[0], pulse[1], pulseRadius, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  function drawHud(now) {
    const scene = getScene();
    const seconds = now / 1000;
    const inset = scene.mobile ? 14 : 34;
    const cyan = "rgba(51, 226, 255, 0.46)";
    const line = "rgba(91, 140, 218, 0.26)";

    context.save();
    context.strokeStyle = line;
    context.lineWidth = 1;
    const corner = 28;
    [[inset, inset, 1, 1], [width - inset, inset, -1, 1], [inset, height - inset, 1, -1], [width - inset, height - inset, -1, -1]].forEach(([x, y, sx, sy]) => {
      context.beginPath();
      context.moveTo(x + sx * corner, y);
      context.lineTo(x, y);
      context.lineTo(x, y + sy * corner);
      context.stroke();
    });
    context.restore();

    const right = width - inset;
    const top = scene.mobile ? height * 0.4 : height * 0.17;
    label("DIGITAL TWIN / 01", right, top, "right", "rgba(139, 174, 226, 0.58)", scene.mobile ? 7 : 9);
    label("CAN BUS ONLINE", right, top + 18, "right", "rgba(51, 226, 255, 0.72)", scene.mobile ? 7 : 9);
    label(`T+${seconds.toFixed(2).padStart(6, "0")}`, right, top + 36, "right", "rgba(139, 174, 226, 0.42)", scene.mobile ? 7 : 9);

    context.save();
    context.strokeStyle = cyan;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(right - (scene.mobile ? 74 : 110), top + 51);
    context.lineTo(right, top + 51);
    context.stroke();
    context.restore();

    label("CHASSIS / LIVE", inset, height - inset + 2, "left", "rgba(51, 226, 255, 0.58)", scene.mobile ? 7 : 9);
    label("BPR0 LAB SYSTEM", right, height - inset + 2, "right", "rgba(139, 174, 226, 0.46)", scene.mobile ? 7 : 9);
  }

  function draw(now = 0) {
    pointer.x += (pointer.targetX - pointer.x) * 0.055;
    pointer.y += (pointer.targetY - pointer.y) * 0.055;
    context.clearRect(0, 0, width, height);
    drawAtmosphere(now);
    drawVehicle(now);
    drawHud(now);
  }

  function animate(now) {
    draw(now);
    frameId = window.requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("pointermove", (event) => {
    pointer.targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
    pointer.targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    window.cancelAnimationFrame(frameId);
    if (!document.hidden && !reduceMotion.matches) frameId = window.requestAnimationFrame(animate);
  });
  reduceMotion.addEventListener("change", () => {
    window.cancelAnimationFrame(frameId);
    if (reduceMotion.matches) draw(performance.now());
    else frameId = window.requestAnimationFrame(animate);
  });

  updateScroll();
  resize();
  if (!reduceMotion.matches) frameId = window.requestAnimationFrame(animate);
})();
