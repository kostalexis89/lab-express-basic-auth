document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("lab-express-basic-auth JS imported successfully!");
  },
  false
);
let counter =0
const pass = document.querySelector('#password')
pass.addEventListener('input',function(e) {
  //console.log(e)
  if (e.data!==null){
    counter++
  }
  else {
    counter--
  }
  console.log(counter)
  if(4-counter>0){
    t.innerText = 'password:' + (4-counter) + ' charachters left to have a valid password'
  } else {
    t.innerText = '✅';
  }
  
})