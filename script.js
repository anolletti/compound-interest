let language = "en";
let interestRate, time, compound, answer;
let principle,
  selection = null;
let year = [];
let interestAccrued = [];
let formerPrinciple = [];
let newPrinciple = [];

const currencyFr = "fr-CA";
const currencyEn = "en-CA";
const calculationsField = document.getElementById("calculations");

// FIELDS & SLIDERS
const principleField = document.getElementById("principleField");
const interestField = document.getElementById("interestField");
const timeField = document.getElementById("timeField");
const compoundField = document.getElementById("compoundField");

const compoundField2 = document.getElementById("compoundField2");
const compoundList = document.getElementById("compoundList");

const principleSlider = document.getElementById("principleSlider");
const interestSlider = document.getElementById("interestSlider");
const timeSlider = document.getElementById("timeSlider");
const interestElement = document.getElementById("interestElement");

$('[lang="fr"]').hide();

function numOnly(str) {
  let res = str.replace(/\D/g, "");
  return Number(res);
}

function principleFunction(val) {
  currencyFormatter();
  principleField.value = formatter.format(val);
  principle = val;
  calculation();
}

function interestFunction(val) {
  interestField.value = val + "%";
  interestRate = val / 100;
  calculation();
}

function timeFunction(val) {
  timeField.value = val;
  time = val;
  calculation();
}

function compoundFunction(val) {
  compoundField.value = val;
  compound = val;
  calculation();
}

compoundList.addEventListener("change", function (e) {
  compoundField2.value = e.target.value;
  compound = e.target.value;
  selection = compoundList.selectedIndex;
  calculation();
});

// Graphing functions and variables

function addData(chart, dataset, data) {
  chart.data.datasets[dataset].push({
    data: data,
    barThickness: 200,
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

const colors = [
  "rgba(0, 102, 231, 0.7)",
  "rgba(89, 198, 176, 0.7)",

  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 205, 86, 0.8)",

  "rgba(153, 102, 255, 0.8)",
  "rgba(201, 203, 207, 0.8)",
];

// Chart.defaults.font.size = 16;
Chart.defaults.plugins.legend.position = "bottom";
// Chart.defaults.plugins.legend.labels.padding = 20;

let interestChart = null;

// MAIN FUNCTION
language = "en";
function calculation() {
  currencyFormatter();
  if (
    principle != undefined &&
    interestRate != undefined &&
    time != undefined &&
    compound != undefined &&
    compound != 0
  ) {
    let exp = Number(time) * Number(compound);
    let base = Number(interestRate) / Number(compound) + 1;
    answer = formatter.format(Math.pow(base, exp) * principle);

    if (language == "fr") {
      calculationsField.innerHTML = `
      Étape 1: Sers-toi de la formule des intérêts composés
     $$A = P (1 + {i \\over n})^{nt}$$ <br> Étape 2: Entre les valeurs des variables
  $$A = ${formatter.format(
    principle
  )} (1 + {${interestRate} \\over ${compound}})^{(${compound})(${time})}$$ <br> Étape 3: Parenthèses
  $$A = ${formatter.format(principle)}  (1 + ${parseFloat(
        interestRate / compound
      ).toFixed(4)})^{${compound * time}}$$ <br> Étape 4: Exposants
    $$A = ${formatter.format(principle)}  (${parseFloat(
        1 + interestRate / compound
      ).toFixed(4)})^{${compound * time}}$$ <br> Étape 5: Multiplie et résous
    $$A = ${answer}$$ 
    `;
    } else {
      calculationsField.innerHTML = `
      Step 1: Use the compound interest formula
     $$A = P (1 + {i \\over n})^{nt}$$ <br> Step 2: Input your variables
  $$A = ${formatter.format(
    principle
  )} (1 + {${interestRate} \\over ${compound}})^{(${compound})(${time})}$$ <br> Step 3: Parentheses
  $$A = ${formatter.format(principle)}  (1 + ${parseFloat(
        interestRate / compound
      ).toFixed(4)})^{${compound * time}}$$ <br> Step 4: Exponents
    $$A = ${formatter.format(principle)}  (${parseFloat(
        1 + interestRate / compound
      ).toFixed(4)})^{${compound * time}}$$ <br> Step 5: Multiply and solve
    $$A = ${answer}$$ 
    `;
    }
    MathJax.typeset();

    // Graph Data
    year = [`0`];
    interestAccrued = [0];
    formerPrinciple = [Number(principle)];
    newPrinciple = [Number(principle)];

    for (let i = 1; i < Number(time) + 1; i++) {
      year.push(`${i}`);
      base = Math.pow(
        1 + Number(interestRate) / Number(compound),
        Number(compound) * i
      );
      newPrinciple.push(base * Number(principle));
      interestAccrued.push(newPrinciple[i] - newPrinciple[i - 1]);
      formerPrinciple.push(newPrinciple[i - 1]);
    }
    graphing();

    // Text features above graph
    graphTitle();
    createTable();
  }
}

function graphTitle() {
  if (time != 1) {
    document.getElementById("numberOfYears").innerHTML = `${time} ${labelMaker(
      "years"
    )}`;
  } else {
    document.getElementById("numberOfYears").innerHTML = `${time} ${labelMaker(
      "year"
    )}`;
  }

  document.getElementById("finalPrinciple").innerHTML = `${formatter.format(
    numOnly(answer)
  )}`;
}
// Event listeners for input fields
interestField.addEventListener("blur", userInputFunction);
principleField.addEventListener("blur", userInputFunction);
timeField.addEventListener("blur", userInputFunction);

function userInputFunction() {
  currencyFormatter();
  principleField.value = formatter.format(numOnly(principleField.value));
  principleSlider.value = numOnly(principleField.value);
  principle = numOnly(principleField.value);
  interestSlider.value = parseFloat(interestField.value);
  interestRate = parseFloat(interestSlider.value) / 100;

  if (!interestField.value.includes("%")) {
    interestField.value += "%";
  }
  timeSlider.value = timeField.value;
  time = timeField.value;
  compound = compoundField2.value;
  calculation();
}

document.body.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    userInputFunction();
  }
});

function formatAsPercent(num) {
  return new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
}

function currencyFormatter() {
  let currency;
  if (language == "fr") {
    currency = currencyFr;
  } else {
    currency = currencyEn;
  }
  formatter = new Intl.NumberFormat(currency, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return formatter;
}

const languageButton = document.getElementById("languageButton");
languageButton.addEventListener("click", function () {
  $('[lang="fr"]').toggle();
  $('[lang="en"]').toggle();

  if (language == "en") {
    language = "fr";
    createFrCompoundList();

    setPopovers();
  } else if (language == "fr") {
    language = "en";
    createEnCompoundList();

    setPopovers();
  }

  compoundList.selectedIndex = selection;
  currencyFormatter();
  if (principle != null) {
    principleField.value = formatter.format(parseFloat(principle));
  } else {
    principleField.value = formatter.format(0);
  }

  calculation();
});

// Input fields for money

$("input[data-type='currency']").on({
  keyup: function () {
    formatCurrency($(this));
  },
  blur: function () {
    formatCurrency($(this), "blur");
  },
});

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") {
    return;
  }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.prop("selectionStart");

  // check for decimal
  if (input_val.indexOf(".") >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    if (language == "fr") {
      input_val = left_side + "." + right_side + "$";
    } else {
      input_val = "$" + left_side + "." + right_side;
    }
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    if (language == "fr") {
      input_val = input_val + "$";
    } else {
      input_val = "$" + input_val;
    }
  }

  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}

function labelMaker(word) {
  if (language == "fr") {
    if (word == "Principle") {
      label = "Capital";
    }
    if (word == "Interest") {
      label = "Intérêts";
    }
    if (word == "year") {
      label = "an";
    }
    if (word == "years") {
      label = "ans";
    }
    if (word == "Year") {
      label = "année";
    }
    if (word == "Years") {
      label = "Années";
    }
  } else {
    label = word;
  }
  return label;
}

function graphing() {
  const data = {
    labels: year,
    datasets: [
      {
        label: labelMaker("Principle"),
        data: formerPrinciple,
        backgroundColor: colors[0],
      },
      {
        label: labelMaker("Interest"),
        data: interestAccrued,
        backgroundColor: colors[1],
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      interaction: {
        mode: "index",
      },
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: `${labelMaker("Years")}` },
          stacked: true,
        },
        y: {
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks) {
              return formatter.format(value);
            },
          },
          stacked: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          boxPadding: 4,

          callbacks: {
            title: function (chart) {
              var item = chart[0].dataIndex;
              return `${labelMaker("Year")} ${item}`;
            },

            label: function (context) {
              let label = context.dataset.label || "";

              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += formatter.format(context.parsed.y);
              }
              return label;
            },
            footer: function (tooltipItems) {
              let sum = 0;

              tooltipItems.forEach(function (tooltipItem) {
                sum += tooltipItem.parsed.y;
              });
              return "Total: " + formatter.format(sum);
            },
          },
        },

        title: {
          display: false,
          padding: 20,
          text: "test",
        },
      },
    },
  };

  if (interestChart != null) {
    interestChart.destroy();
  }
  interestChart = new Chart(interestElement, config);
  Chart.defaults.font.size = 16;
  Chart.defaults.font.lineHeight = 1.5;

  interestChart.update();
}

function createEnCompoundList() {
  compoundList.innerHTML = "";

  compoundList.innerHTML = `
  <option value="1" lang="en">1X Yearly</option>
<option value="2" lang="en">2X Half-yearly</option>
<option value="4" lang="en">4X Quarterly</option>
<option value="12" lang="en">12X Monthly</option>
<option value="24" lang="en">24X Half-monthly</option>
<option value="26" lang="en">26X Biweekly</option>
<option value="52" lang="en">52X Weekly</option>
<option value="365" lang="en">365X Daily</option>`;
}

createEnCompoundList();

function createFrCompoundList() {
  compoundList.innerHTML = "";

  compoundList.innerHTML = `
  <option value="1" lang="fr">1X Annuel</option>
  <option value="2" lang="fr">2X Biannuel</option>
  <option value="4" lang="fr">4X Trimestre</option>
  <option value="12" lang="fr">12X Mensuel</option>
  <option value="24" lang="fr">24X Bimensuel</option>
  <option value="26" lang="fr">26X Bihebdomadaire</option>
  <option value="52" lang="fr">52X Hebdomadaire</option>
  <option value="365" lang="fr">365X Quotidien</option>`;
}

// On startup
MathJax.typeset();
compoundList.selectedIndex = 0;
userInputFunction();

// Table functionality
function createTable() {
  var tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  for (let i = 0; i < year.length; i++) {
    var row = tableBody.insertRow(-1);
    row.setAttribute("id", `row${i}`);
    var cell1 = document.createElement("th");
    document.getElementById(`row${i}`).appendChild(cell1);
    cell1.setAttribute("scope", "row");
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = year[i];
    cell2.innerHTML = formatter.format(formerPrinciple[i]);
    cell3.innerHTML = formatter.format(interestAccrued[i]);
    cell4.innerHTML = formatter.format(newPrinciple[i]);
  }
}

// POPOVERS
function createPopover(eName, titleContent, bodyContent) {
  const e = document.getElementsByName(eName);
  for (let i = 0; i < e.length; i++) {
    e[i].setAttribute("title", titleContent);
    e[i].setAttribute("data-content", bodyContent);
    new bootstrap.Popover(e[i], {
      title: titleContent,
      content: bodyContent,
      trigger: "hover",
    });
  }
}

function setPopoversFr() {
  currencyFormatter();
  if (language == "fr") {
    createPopover(
      "principlePopover",
      "Capital",
      "Le montant original investi ou emprunté."
    );
  }
  createPopover(
    "interestPopover",
    "Taux d'intérêt",
    "Pourcentage demandé, habituellement exprimé en taux annuel"
  );
  createPopover(
    "termPopover",
    "Terme",
    "Durée, en années, d'un investissement ou d'un prêt"
  );
  createPopover(
    "compoundPopover",
    "Période de calcul de l'intérêt",
    "Temps entre chaque période de calcul de l'intérêt, également appelé période d'intérêt"
  );
}

function setPopoversEn() {
  createPopover(
    "principlePopover",
    "Principle",
    "The original amount invested or borrowed"
  );
  createPopover(
    "interestPopover",
    "Interest",
    "The percentage charged or returned, usually stated as a per year rate"
  );
  createPopover(
    "termPopover",
    "Term",
    "The time in years for an investment or loan"
  );
  createPopover(
    "compoundPopover",
    "Compounding Period",
    "the time between calculation of interest, also called the interest period"
  );
}

function setPopovers() {
  $(document).ready(function () {
    // Showing and hiding tooltip with different speed
    $('[data-toggle="tooltip"]').tooltip({
      delay: { show: 50, hide: 200 },
      placement: "right",
      html: true,
    });
  });

  if (language == "fr") {
    setPopoversFr();
  } else {
    setPopoversEn();
  }
}

setPopovers();
