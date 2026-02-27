function calcular() {
  const Vmp = +document.getElementById("vmp").value;
  const Imp = +document.getElementById("imp").value;
  const N = +document.getElementById("n").value;
  const Vinv = +document.getElementById("vinv").value;
  const Imax = +document.getElementById("imax").value;

  let melhor = null;
  let erroMelhor = Infinity;

  for (let Ns = 1; Ns <= N; Ns++) {
    if (N % Ns === 0) {
      let Np = N / Ns;
      let Vt = Ns * Vmp;
      let It = Np * Imp;

      if (Vt <= 1.1 * Vinv && It <= Imax) {
        let erro = Math.abs(Vinv - Vt);
        if (erro < erroMelhor) {
          erroMelhor = erro;
          melhor = { Ns, Np, Vt, It };
        }
      }
    }
  }

  const r = document.getElementById("resultado");
  const c = document.getElementById("diagrama");
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  if (!melhor) {
    r.innerText = "Nenhuma configuração válida.";
    return;
  }

  r.innerHTML =
    melhor.Ns + " série × " + melhor.Np + " paralelo<br>" +
    "Tensão: " + melhor.Vt + " V<br>" +
    "Corrente: " + melhor.It + " A";

  const sx = c.width / (melhor.Ns + 1);
  const sy = c.height / (melhor.Np + 1);

  for (let p = 0; p < melhor.Np; p++) {
    for (let s = 0; s < melhor.Ns; s++) {
      const x = (s + 1) * sx;
      const y = (p + 1) * sy;
      ctx.strokeRect(x - 15, y - 10, 30, 20);
    }
    ctx.beginPath();
    ctx.moveTo(sx, (p + 1) * sy);
    ctx.lineTo(melhor.Ns * sx, (p + 1) * sy);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx, melhor.Np * sy);

  ctx.moveTo(melhor.Ns * sx, sy);
  ctx.lineTo(melhor.Ns * sx, melhor.Np * sy);
  ctx.stroke();
}

