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

  // -----------------------------------------
// COMPARAÇÃO ENTRE TODAS AS CONFIGURAÇÕES
// -----------------------------------------
let configs = [];
for (let NsTest = 1; NsTest <= N; NsTest++) {
  if (N % NsTest === 0) {
    let NpTest = N / NsTest;
    let Vt_test = NsTest * Vmp;
    let It_test = NpTest * Imp;
    let Voc_total_test = (Voc_corrigido * NsTest);
    let seguroVoc = Voc_total_test <= Vmax;
    let seguroIsc = It_test <= Imax;
    let score = 0;
    // Critérios para ranking
    if (seguroVoc) score += 40;
    if (seguroIsc) score += 40;
    // Melhor aproximação de tensão ao MPPT
    score += Math.max(0, 20 - Math.abs(Vt_test - Vinv));
    configs.push({
      Ns: NsTest,
      Np: NpTest,
      Vt: Vt_test.toFixed(2),
      It: It_test.toFixed(2),
      VocCorr: Voc_total_test.toFixed(2),
      seguroVoc,
      seguroIsc,
      score
    });
  }
}
// ORDENAR CONFIGURAÇÕES POR SCORE
configs.sort((a, b) => b.score - a.score);
// EXIBIR TABELA
let htmlTabela = `
<table class="table-comp">
  <tr>
    <th>Configuração</th>
    <th>Tensão</th>
    <th>Corrente</th>
    <th>Voc Corr.</th>
    <th>Segurança</th>
  </tr>
`;
configs.forEach(c => {
  htmlTabela += `
  <tr>
    <td>${c.Ns}S x ${c.Np}P</td>
    <td>${c.Vt} V</td>
    <td>${c.It} A</td>
    <td>${c.VocCorr} V</td>
    <td>
      ${c.seguroVoc && c.seguroIsc ? "✔ OK" : "⚠ Risco"}
    </td>
  </tr>
  `;
});
htmlTabela += "</table>";
document.getElementById("comparacao").innerHTML = htmlTabela;
// -----------------------------------------
// RANKING FINAL
// -----------------------------------------
let melhor = configs[0];
let medio = configs[1] || null;
let pior = configs[configs.length - 1];
let rankHTML = `
<div class="rank-item rank-best">
  🥇 <b>Melhor Configuração:</b> ${melhor.Ns}S x ${melhor.Np}P<br>
  • Melhor equilíbrio entre tensão e corrente<br>
  • Alta segurança térmica<br>
  • Tensão próxima ao MPPT ideal
</div>
`;
if (medio) {
rankHTML += `
<div class="rank-item rank-mid">
  🥈 <b>Alternativa Viável:</b> ${medio.Ns}S x ${medio.Np}P<br>
  • Pode ser usada dependendo da cablagem ou MPPT<br>
  • Verificar tensão de arranque e perdas
</div>
`;
}
rankHTML += `
<div class="rank-item rank-bad">
  🥉 <b>Pior Configuração:</b> ${pior.Ns}S x ${pior.Np}P<br>
  • Baixa eficiência ou riscos térmicos<br>
  • Recomendado evitar esta ligação
</div>
`;
document.getElementById("ranking").innerHTML = rankHTML;
  
}
// Adiciona ao HTML
resultadoDiv.innerHTML += avisoVoc;
