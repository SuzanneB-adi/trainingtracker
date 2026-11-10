const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
let stored='',elements={};const context={console,structuredClone,Date,Math,Number,JSON,String,Array,Object,Set,Blob,setTimeout:()=>{},setInterval:()=>{},localStorage:{getItem:()=>null,setItem:(k,v)=>stored=v},document:{querySelector:s=>elements[s]??={}},navigator:{}};
vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8').replace(/render\(\);\s*$/,''),context);
const run=s=>vm.runInContext(s,context);
assert.equal(run('plan().days.length'),3);assert.equal(run('plan().days.reduce((n,d)=>n+d.exercises.length,0)'),16);
assert.equal(run('db.equipment.plates.reduce((n,p)=>n+p.kg*p.count,0)'),44);
for(const type of ['barbell','pair','single']){
 const options=run(`balancedOptions('${type}')`);
 for(const o of options){if(o.fixed)continue;const eq=run('db.equipment'),factor=type==='pair'?4:2;assert(o.weight<=(type==='barbell'?53:25));o.counts.forEach((n,i)=>assert(n*factor<=eq.plates[i].count));assert.equal(o.weight,(type==='barbell'?3:.5)+2*o.counts.reduce((n,c,i)=>n+c*eq.plates[i].kg,0))}
 for(const t of [0,1,4,8,15.5,20.5,31,41,80]){const o=run(`calc('${type}',${t},true)`);if(o)assert(o.weight<=t);}
}
assert.equal(run("calc('barbell',31).weight"),31);assert.equal(run("calc('barbell',41).weight"),42);
assert.equal(run("calc('single',20.5).weight"),20.5);
assert.equal(run("calc('barbell',1,true)"),null);
run("setTarget(0,'31');setPlannedReps(0,'11');applyWeight(0)");
assert.equal(run('getSession().logs[getSession().exercises[0].id].sets[0].kg'),'31');
run("updateSet(0,0,'reps','11');updateSet(0,0,'done',true,{})");assert.equal(run('getSession().logs[getSession().exercises[0].id].sets[0].done'),true);assert.equal(run('validBackup(JSON.parse(JSON.stringify(db)))'),true);
const previous=run('getSession().exercises[0].name');run("plan().days[0].exercises[0].name='Changed'");assert.equal(run('getSession().exercises[0].name'),previous);
assert(stored.length>0);console.log('Passed: plan, inventory, load limits, warm-up rounding direction, target loads, logging persistence, backup schema, historical plan snapshots.');
