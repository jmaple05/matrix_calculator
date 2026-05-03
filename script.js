let singleMatrixInputs = [];
let matrixAInputs = [];
let matrixBInputs = [];
let currentOperator = "+";
function createMatrix(containerId, rows, cols) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let matrix = [];

    for (let i = 0; i < rows; i++) {
        matrix[i] = [];

        for (let j = 0; j < cols; j++) {
            const input = document.createElement("input");
            input.type = "number";
            input.placeholder = `A${i}${j}`;
            input.id = "input";
            input.style.width = "50px";

            matrix[i][j] = input;
            container.appendChild(input);
        }

        container.appendChild(document.createElement("br"));
    }
    return matrix;
}
function setUpMatrices() {
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;

    matrixAInputs = createMatrix("matrixA", rows, cols);
    matrixBInputs = createMatrix("matrixB", rows, cols);
}
function getMatrixValues(matrixInputs) {
    return matrixInputs.map(row => row.map(input => Number(input.value)));
}

function setOperator(oper) {
    currentOperator = oper;
    document.getElementById("operator").textContent = oper;
}

function calculate() {
    const A = getMatrixValues(matrixAInputs);
    const B = getMatrixValues(matrixBInputs);
    let result;

    if (currentOperator == "+") {
        result = addMatrices(A, B);
    } else if (currentOperator == "-") {
        result = subtractMatrices(A, B);
    } else if (currentOperator == "X") {
        result = multiplyMatrices(A, B);
    }
    displayMatrix(result);
}

function displayMatrix(matrix, id="doubleMatrixResult") {
    const container = document.getElementById(id);
    container.innerHTML = "";
    if (id == "singleMatrixResult") {
        singleMatrixContainer = document.getElementById("singleMatrixResultContainer");
        singleMatrixContainer.style.display = "inline-block";
    }
    
    matrix.forEach(row => {
        let mtr = document.createElement("mtr");
        row.forEach(val => {
            const mtd = document.createElement("mtd");
            mtd.textContent = val.toFixed(2);
            mtd.style.margin = "10px";
            mtr.appendChild(mtd);
        });
        container.appendChild(mtr);
        container.appendChild(document.createElement("br"));
    });

    if (id == "singleMatrixResult") {
        document.getElementById("singleResult").style.display = "none";
    }
}

function displayResult(result) {
    const container = document.getElementById("singleResult");
    container.innerHTML = "";
    container.style.display = "block";
    const span = document.createElement("span");
    span.textContent = result.toFixed(2);
    span.style.margin = "15px";
    container.appendChild(span);
    document.getElementById("singleMatrixResultContainer").style.display = "none";
}

function showTab(tab) {
    document.getElementById("singleTab").style.display = "none";
    document.getElementById("doubleTab").style.display = "none";

    if (tab == "single") {
        document.getElementById("singleTab").style.display = "block";
        
    } else {
        document.getElementById("doubleTab").style.display = "block";
    }
}

Module.onRuntimeInitialized = () => {
    showTab('single');
}


/*          MATHEMATICAL OPERATIONS

    This section holds the functions that perform
    the calculations on the matrices

*/

function addMatrices(A, B) {
    return A.map((row, i) =>
        row.map((val, j) => val + B[i][j])
    );
}

function subtractMatrices(A, B) {
    return A.map((row, i) =>
        row.map((val, j) => val - B[i][j])
    );
}

function multiplyMatrices(A, B) {
    let result = [];
    for (let i = 0; i < A.length; i++) {
        result.push([]);
        for (let j = 0; j < B[0].length; j++) {
            let num = 0;
            for (let k = 0; k < B.length; k++) {
                num += (A[i][k] * B[k][j]);
            }
            result[i].push(num);
        }
    }
    return result;
}

function determinant(matrix) {
    if (matrix.length > 2) {
        let matrixDeterminant = 0;
        let colNum = matrix.length;
        for (let i = 0; i < colNum; i++) { // each elem across row 1
            let arr = [];
            for (let j = 1; j < colNum; j++) { // each row
                arr.push([]);
                for (let k = 0; k < colNum; k++) { // each col elem
                    if (k !== i) { arr[j].push(matrix[j][k]); } // skips the correct column
                }
            }
            let sign = 1;
            if (i%2 === 1) { sign *= -1; }
            matrixDeterminant += sign*matrix[0][i]*determinant(arr);
        }
        return matrixDeterminant;
    } else {
        return matrix[0][0]*matrix[1][1] - matrix[1][0]*matrix[0][1];
    }
}

function trace(matrix) {
    let trace = 0;
    for (let i = 0; i < matrix.length; i++) {
        trace += matrix[i][i];
    }
    return trace;
}

function power(matrix, exp) {
    let result = matrix;
    for (let i = 1; i < exp; i++) {
        result = multiplyMatrices(result, matrix);
    }
    return result;
}

function inverse(matrix) {
    const det = determinant(matrix);
    if (det === 0) {
        throw new Error("Matrix is singular and cannot be inverted.");
    }
    const n = matrix.length;
    if (n === 2) {
        let result = []
        result[0] = [matrix[1][1], -matrix[0][1]];
        result[1] = [-matrix[1][0], matrix[0][0]];
        return result.map(row => row.map(val => val / det));
    }
}

function rowEchelon(matrix) {
    let result = matrix;
    let factor = result[0][0];
    for (let i = 0; i < result[0].length; i++) {
        result[0][i] /= factor;
    }
    for (let i = 1; i < result.length; i++) {
        factor = result[i][0];
        for (let j = 0; j < result[i].length; j++) {
            result[i][j] -= factor*result[0][j];
        }
    }
    // for (let i = 1; i < result.length-1; i++) {
    //     let rowReduced = rowEchelon(result.slice(i, result.length));
    //     for (let j = 0; j < rowReduced.length; j++) {
    //         result[i+j] = rowReduced[j];
    //     }
    // }
    for (let i = 1; i < result.length; i++) {
        for (let j = i; j < result[i].length; j++) { // find leading variable
            if (result[i][j] !== 0) {
                factor = result[i][j];
                break
            }
        }
        for (let j = i; j < result[i].length; j++) {
            result[i][j] /= factor;
        }
    }
    if (result.length > result[0].length) {
        for (let i = result[0].length; i < result.length; i++) {
            for (let j = 0; j < result[i].length; j++) {
                result[i][j] = 0;
            }
        }
    }
    return result;
}

function rank(matrix) {
    let rowReduced = rowEchelon(matrix);
    let rank = 0;
    for (let i = 0; i < rowReduced.length; i++) {
        if (rowReduced[i].some(val => val !== 0)) {
            rank++;
        }
    }
    return rank;
}

function reducedRowEchelon(matrix) {
    let result = rowEchelon(matrix);
    
}