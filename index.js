const reader = new FileReader();

const fileReader = (e) => {
  e.preventDefault();
  reader.onload = main;
  reader.readAsText(e.target.files[0]) 
}
document.getElementById('input').addEventListener("change", fileReader, false);

const main = (e) => {
  const input = e.target.result;
  let num='', pyramid=[], line=[];
  for(let i=0; i<input.length; i++){
    const char=input[i];
    if(char=='\n'){
      pyramid.push([...line,parseInt(num)]);
      num='', line=[];
    } else if(char==' '){
      line.push(parseInt(num));
      num='';
    } else num+=char;
  }
  pyramid.push([...line,parseInt(num)]);
  let path = JSON.parse(JSON.stringify(pyramid));
  let pyramid_ = JSON.parse(JSON.stringify(pyramid));

  const result = pathFinder(pyramid_);
  path = pathArranger(path,result,pyramid);
  sendResult(result[0],path,pyramid);
}

const pathFinder= (pyramid) => {
  for(let i=0; i<pyramid[pyramid.length-1].length; i++)
    if(isPrime(pyramid[pyramid.length-1][i]))
      pyramid[pyramid.length-1][i]=0;
  for(let i=pyramid.length-1; i>0; i--){//rows
    for(let x=0; x<pyramid[i].length; x++){//columns
      while(pyramid[i][x]==0) x++;//skips prime numbers changed as 0
      if(!(x<pyramid[i].length)) break;//if it goes out of index while skipping prime numbers, breaks
      const number = pyramid[i][x];
      for(let y = (x==0) ? 0 : x-1; ; y++){//checks next line of x-1 <= y <= x
        let next = pyramid[i-1][y];//next line
        if(!isPrime(next)){
          if(typeof next == typeof 1){
            pyramid[i-1][y]=(next+number)+'|'+next;
          }
          else if(typeof next == typeof ''){
            const splitted = pyramid[i-1][y].split('|');
            const last = parseInt(splitted[splitted.length-1]);
            let new_='';
            for(let z=0; z<splitted.length-1; z++) 
              new_=new_+splitted[z]+'|';
            new_=new_+(last+number)+'|'+last;
            pyramid[i-1][y]=new_;
          }
        }
        if(next!= undefined && isPrime(next) && i!=1)
          pyramid[i-1][y]=0;//changes primes numbers to 0
        if(y==x) break;
        else if(y>=pyramid[i-1].length) break;
        else if(y==pyramid.length-1) break;
      }
    }
    pyramid[i-1]=convert(pyramid[i-1]);
  }
  return pyramid;
}

const isPrime = (num) =>{
  for(let i=2; i<num; i++)
    if(num%i==0) return false
  if(typeof num == typeof '') return false;
  if(num==1) return false;
  return true;
}

const convert = (row) => {
  for(let i=0; i<row.length; i++){
    if(typeof row[i] == typeof ''){
      const arr = row[i].split('|');
      let maxOf=[];
      for(let x=0; x<arr.length; x++)
        maxOf.push(parseInt(arr[x]));
      const max=Math.max(...maxOf);
      row[i]=max;
    }
    else if(row.length!=1) row[i]=0;
    else if(row.length==1){}
  }
  return row;
}

const pathArranger = (path,result,pyramid) => {
  path[0][0]=-1;
  let index=0;
  for(let i=0;; i++){
    const diff = result[i][index]-pyramid[i][index];
    if(i==result.length-1) break;
    for(let x=0; x<result[i+1].length; x++)
      if(result[i+1][x]===diff && x-1<=index && x+1>=index)
        index=x;
    path[i+1][index]=-1;
  }
  path[path.length-1][index]=-1;
  
  return path;
}

//Printing results
const resultDiv = document.getElementById('result');
const pathDiv = document.getElementById('path');

function sendResult(result,path,pyramid){
    resultDiv.innerHTML=`Result: ${result}`;
    pathDiv.innerHTML='';
    let txt='';
    for(let i=0; i<pyramid.length; i++){
      const div = document.createElement('div')
      for(let x=0; x<pyramid[i].length; x++)
        txt+= (path[i][x]==-1)?` <span class='path'>${pyramid[i][x]}</span>`:`<span>${pyramid[i][x]}</span>`;
      div.innerHTML=txt;
      pathDiv.appendChild(div);
      txt='';
    }
}