const initial={energy:0,core:0,mult:1,auto:0,luck:0};
let s=JSON.parse(localStorage.getItem("inflationMachine")||"null")||initial;
const $=id=>document.getElementById(id);
const save=()=>localStorage.setItem("inflationMachine",JSON.stringify(s));
function fmt(n){if(!Number.isFinite(n))return "∞"; if(n<1000)return Math.floor(n).toLocaleString(); const units=["","K","M","B","T","Qa","Qi","Sx","Sp","Oc","No"];let i=0;while(n>=1000&&i<units.length-1){n/=1000;i++}return n>=100?n.toFixed(0)+units[i]:n>=10?n.toFixed(1)+units[i]:n.toFixed(2)+units[i]}
function perSpin(){return 10*s.mult}
function powerCost(){return 100*Math.pow(10,s.mult/2-0.5)}
function autoCost(){return 1000*Math.pow(3,s.auto)}
function luckCost(){return 10000*Math.pow(5,s.luck/5)}
function coreNeed(){return 1e6*Math.pow(100,s.core)}
function render(){
 $("energy").textContent=fmt(s.energy); $("perSpin").textContent=fmt(perSpin()); $("core").textContent=fmt(s.core);
 $("powerCost").textContent=fmt(powerCost()); $("autoCost").textContent=fmt(autoCost()); $("luckCost").textContent=fmt(luckCost()); $("coreNeed").textContent=fmt(coreNeed());
 $("income").textContent=fmt(s.auto*perSpin())+" / sec";
 $("powerBtn").disabled=s.energy<powerCost(); $("autoBtn").disabled=s.energy<autoCost(); $("luckBtn").disabled=s.energy<luckCost(); $("coreBtn").disabled=s.energy<coreNeed();
}
function spin(){
 const vals=["7","★","◆","●","1","∞","♛","$"]; let a=[];
 for(let i=0;i<3;i++)a.push(vals[Math.floor(Math.random()*vals.length)]);
 ["r1","r2","r3"].forEach((id,i)=>$(id).textContent=a[i]);
 let reward=perSpin();
 if(a[0]===a[1]&&a[1]===a[2]){reward*=10; $("message").textContent="JACKPOT ×10!"}
 else if(a[0]===a[1]||a[1]===a[2]||a[0]===a[2]){reward*=2; $("message").textContent="MATCH ×2"}
 else $("message").textContent="INFLATION +"+fmt(reward);
 if(Math.random()<s.luck/100) reward*=2;
 s.energy+=reward; save(); render();
}
$("spinBtn").onclick=spin;
$("powerBtn").onclick=()=>{let c=powerCost();if(s.energy>=c){s.energy-=c;s.mult*=2;save();render()}};
$("autoBtn").onclick=()=>{let c=autoCost();if(s.energy>=c){s.energy-=c;s.auto++;save();render()}};
$("luckBtn").onclick=()=>{let c=luckCost();if(s.energy>=c){s.energy-=c;s.luck+=5;save();render()}};
$("coreBtn").onclick=()=>{let n=coreNeed();if(s.energy>=n){s.energy=0;s.core++;s.mult*=3;s.auto=0;s.luck=Math.min(50,s.luck);save();render();$("message").textContent="CORE ASCENDED ×3 POWER!"}};
$("resetBtn").onclick=()=>{if(confirm("データを完全にリセットしますか？")){s={...initial};save();render()}};
setInterval(()=>{if(s.auto>0){s.energy+=s.auto*perSpin();save();render()}},1000);
render();
