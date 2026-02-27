function calcular() {

  const Vmp = +document.getElementById("vmp").value;
  const Imp = +document.getElementById("imp").value;
  const Voc = +document.getElementById("voc").value;
  const Isc = +document.getElementById("isc").value;

  const coefVoc = +document.getElementById("coefvoc").value / 100; // converter % para decimal
  const coefPmax = +document.getElementById("coefpmax").value / 100;
  const NOCT = +document.getElementById("noct").value;
  const Pmax = +document.getElementById("pmax").value;

  const N = +document.getElementById("n").value;

  const Vinv = +document.getElementById("vinv").value;
  const Vmax = +document.getElementById("vmax").value;
  const Imax = +document.getElementById("imax").value;
  const Tmin = +document.getElementById("tmin").value;

  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = ""; // limpar resultados

  // -----------------------------------------
  // MÓDULO 1 — Cálculo Térmico Voc Corrigido
  // -----------------------------------------
  const Voc_corrigido = Voc * (1 + coefVoc * (Tmin - 25));
  const Voc_corr = Voc_corrigido.toFixed(2);

  let avisoVoc = "";

  if (Voc_corrigido > Vmax) {
    avisoVoc = `
      <div class="result-error">
        ⚠ PERIGO: Voc corrigido = ${Voc_corr} V<br>
        Excede o limite do inversor (${Vmax} V).<br>
        Reduza módulos em série imediatamente.
      </div>
    `;
  } 
  else if (Voc_corrigido > Vmax * 0.9) {
    avisoVoc = `
      <div class="result-warning">
        ⚠ Atenção: Voc = ${Voc_corr} V está perto do limite (${Vmax} V).<br>
        Considere reduzir 1 módulo em série.
      </div>
    `;
  }
  else {
    avisoVoc = `
      <div class="result-ok">
        ✔ Voc corrigido (${Voc_corr} V) está seguro dentro dos limites.
      </div>
    `;
  }

  // Mostrar resultado térmico
  resultadoDiv.innerHTML += `
    <b>Voc corrigido para frio:</b> ${Voc_corr} V
    <br><br>
    ${avisoVoc}
  `;
}
