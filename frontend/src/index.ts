import "./styles.css";

var count = 1;

function dispatchCalc() {
    const cols = (document.getElementsByName('cols')[0] as HTMLInputElement).value
    const rows = (document.getElementsByName('rows')[0] as HTMLInputElement).value
    const maxarea = (document.getElementsByName('maxarea')[0] as HTMLInputElement).value
    console.log("pressed =1 ");

    let xhttp = new XMLHttpRequest();

    xhttp.addEventListener('load',() => { generate_vis(xhttp.responseText); });
    xhttp.addEventListener('error', () => error(this.responseText) ) ;
    xhttp.open("GET",`/calculate/${rows}/${cols}/${maxarea}`);
    xhttp.send();
}

function error(t: string) {
    console.log("error");
    generate_vis(t);
}

function standardDeviation(arr: number[], mean: number) {
  const x = arr.map((k) => (k - mean) ** 2)
  const sum = x.reduce((acc, currentValue) => acc + currentValue, 0)
  const variance = sum / x.length

  return Math.sqrt(variance)
}

function generate_vis(data?: string)  {
    const parsedData = JSON.parse(data);
    const numberOfChunks = parsedData.length;
    const totalRowsColumns = parsedData.reduce((acc: number, currentValue: number[]) => {
      const row = currentValue[2]
      const column = currentValue[0]
      return acc + row + column;
    }, 0)
    const totalAreas = parsedData.reduce((acc: number, currentValue: number[]) =>{
      const area = currentValue[1] * currentValue[3]
      return acc += area;
    }, 0)
    const meanArea = totalAreas / numberOfChunks;
    const listOfAreas = parsedData.map((box: number[]) => box[1] * box[3])
    const stdAreas = standardDeviation(listOfAreas, meanArea);

    document.getElementById('vis').innerHTML = `
        <p>Number of Chunks: ${numberOfChunks}</p>
        <p>Here is the total number of Rows and Columns: ${totalRowsColumns}</p>
        <p>Standard Deviation is: ${stdAreas}<p/>
        <p>Button Pressed ${count} times so far.</p>
    `;
    count += 1;
}
function ready(fn: any) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
function setup() {
    document.getElementById('button').addEventListener('click',dispatchCalc);
    generate_vis();
}
ready(setup);
