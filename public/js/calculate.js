const numberRowMatrixOne = document.querySelector("#number-row-1");
const numberColMatrixOne = document.querySelector("#number-col-1");
const numberRowMatrixTwo = document.querySelector("#number-row-2");
const numberColMatrixTwo = document.querySelector("#number-col-2");

const buttonGenerate = document.querySelector("#generate-matrices");
const subtitleMatrix = document.querySelector("#subtitle-matrix");
const formToCalculate = document.querySelector("#form-to-calculate");
const matrix1 = document.querySelector("#matrix-1");
const matrix2 = document.querySelector("#matrix-2");
const buttonSubmit = document.querySelector("#button-submit");
const matrixGenerada = document.querySelector("#matriz-generada");

numberColMatrixOne.addEventListener("input", (e) => {
  numberRowMatrixTwo.value = e.target.value;
});
numberRowMatrixTwo.addEventListener("input", (e) => {
  numberColMatrixOne.value = e.target.value;
});

const generateMatrix = (
  colMatrixOne = 1,
  rowMatrixOne = 1,
  colMatrixTwo = 1,
  rowMatrixTwo = 1
) => {
  subtitleMatrix.textContent = `Matrices de para multiplicar de tamaño: ${rowMatrixOne}x${colMatrixOne} y ${rowMatrixTwo}x${colMatrixTwo}`;

  matrix1.innerHTML = `<p class="w-full col-span-${colMatrixOne}">Matriz 1</p>`;
  matrix2.innerHTML = `<p class="w-full col-span-${colMatrixTwo}">Matriz 2</p>`;
  matrix1.classList.add([`grid-cols-${colMatrixOne}`]);
  matrix2.classList.add([`grid-cols-${colMatrixTwo}`]);

  for (j = 1; rowMatrixOne >= j; j++) {
    for (i = 1; colMatrixOne >= i; i++) {
      matrix1.innerHTML += `<input type="number" 
                                             id="m1-row${j}-col${i}" 
                                             min="1" 
                                             class="block p-2 w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">`;
    }
  }

  for (j = 1; rowMatrixTwo >= j; j++) {
    for (i = 1; colMatrixTwo >= i; i++) {
      matrix2.innerHTML += `<input type="number" 
                                             id="m2-row${j}-col${i}" 
                                             min="1" 
                                             class="block p-2 w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">`;
    }
  }

  buttonSubmit.classList.remove("hidden");
  buttonSubmit.classList.add("block");
};

document.addEventListener("DOMContentLoaded", () => {
  generateMatrix();
});

buttonGenerate.addEventListener("click", (e) => {
  const colMatrixOne = numberColMatrixOne.value;
  const rowMatrixOne = numberRowMatrixOne.value;
  const colMatrixTwo = numberColMatrixTwo.value;
  const rowMatrixTwo = numberRowMatrixTwo.value;

  if (
    colMatrixOne == 0 ||
    rowMatrixOne == 0 ||
    colMatrixTwo == 0 ||
    rowMatrixTwo == 0
  ) {
    subtitleMatrix.textContent = "Tenes que ingresar números mayores a 0";
    matrix1.innerHTML = "";
    matrix2.innerHTML = "";
    buttonSubmit.classList.add("hidden");
    matrixGenerada.classList.add("hidden");
    return;
  }
  generateMatrix(colMatrixOne, rowMatrixOne, colMatrixTwo, rowMatrixTwo);
});

formToCalculate.addEventListener("submit", async (e) => {
  e.preventDefault();
  let firstMatrix = [];
  let secondMatrix = [];

  for (j = 0; numberRowMatrixOne.value > j; j++) {
    firstMatrix[j] = [];
    for (i = 0; numberColMatrixOne.value > i; i++) {
      firstMatrix[j][i] = document.querySelector(
        `#m1-row${j + 1}-col${i + 1}`
      ).value;
    }
  }

  for (j = 0; numberRowMatrixTwo.value > j; j++) {
    secondMatrix[j] = [];
    for (i = 0; numberColMatrixTwo.value > i; i++) {
      secondMatrix[j][i] = document.querySelector(
        `#m2-row${j + 1}-col${i + 1}`
      ).value;
    }
  }
  try {
    const resp = await fetch("/calcular", {
      method: "POST",
      body: JSON.stringify({
        matriz1: firstMatrix,
        matriz2: secondMatrix,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    matrixGenerada.classList.remove("hidden");
    matrixGenerada.innerHTML = "";
    matrixGenerada.classList.add([`grid-cols-${numberColMatrixTwo.value }`]);

    if (resp.status !== 200) {
      const { error } = await resp.json();
      matrixGenerada.innerHTML = `<p> ${error} </p>`;
      return;
    }

    const { matrizMultiplicada } = await resp.json();

    matrizMultiplicada.forEach((row, j) => {
      row.forEach((col, i) => {
        matrixGenerada.innerHTML += `<p> ${col} </p>`;
      });
    });
  } catch (error) {}
});
