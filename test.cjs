const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
let stored='',elements={};const context={console,structuredClone,Date,Math,Number,JSON,String,Array,Object,Set,Blob,setTimeout:()=>{},setInterval:()=>{},localStorage:{getItem:()=>null,setItem:(k,v)=>stored=v},document:{querySelector:s=>elements[s]??={style:{}}},navigator:{}};
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
// Fill unfinished blank fields without replacing actual results.
assert.equal(+run('getSession().logs[getSession().exercises[0].id].sets[1].reps'),11);
run("const old=getSession().logs[getSession().exercises[0].id];old.sets[0].kg='25';old.sets[0].reps='9';old.sets[1].reps='10';setPlannedReps(0,'12');applyWeight(0)");
assert.equal(run('getSession().logs[getSession().exercises[0].id].sets[0].kg'),'25');
assert.equal(run('getSession().logs[getSession().exercises[0].id].sets[0].reps'),'9');
assert.equal(run('getSession().logs[getSession().exercises[0].id].sets[1].reps'),'10');
run("day=1;sessionId=null;setTarget(0,'8');setPlannedReps(0,'10');applyWeight(0)");
assert.equal(+run('getSession().logs[getSession().exercises[0].id].sets[0].right'),10);
run("day=0;sessionId=null;var rests=[];startRest=n=>rests.push(n);setTarget(3,'5');setPlannedReps(3,'12');applyWeight(3);setTarget(4,'8');setPlannedReps(4,'12');applyWeight(4)");
run("updateSet(3,0,'done',true,{})");assert.equal(run('rests.length'),0);
run("updateSet(4,0,'done',true,{})");assert.equal(run('rests.join()'),'90');
run("updateSet(3,1,'done',true,{});updateSet(4,1,'done',true,{})");assert.equal(run('rests.join()'),'90,90');
run("updateSet(3,2,'done',true,{});updateSet(4,2,'done',true,{})");assert.equal(run('rests.join()'),'90,90');
const html=run('workoutCards(getSession().exercises,getSession())');
assert(html.indexOf('Round 1 of 3')<html.indexOf('Round 2 of 3'));
const round1=html.slice(html.indexOf('Round 1 of 3'),html.indexOf('Round 2 of 3'));
assert(round1.indexOf('Alternating Bicep Curl')<round1.indexOf('Seated Bent Over Tricep Extension'));
assert(round1.includes('Straight into the next exercise'));
run("day=2;sessionId=null;setTarget(3,'5');applyWeight(3);applyWeight(4);rests=[];updateSet(3,0,'done',true,{});updateSet(4,0,'done',true,{})");
assert.equal(run('rests.join()'),'90');
assert.equal(+run('getSession().logs[getSession().exercises[4].id].sets[0].reps'),15);
console.log('Passed: reps autofill, left/right autofill, existing results preserved, both supersets rendered in rounds, rest only after both exercises, no rest after final round.');
// A week is complete only after three distinct, fully completed days.
run('db.sessions=[];day=0;week=1;sessionId=null;var first=getSession();first.complete=true');
assert.equal(run("completedDays(db.active,1)"),0);
assert.equal(run("weekStatus(db.active,1)"),'0 of 3 days');
run('for(const e of first.exercises)logFor(first,e).sets.forEach(r=>r.done=true)');
assert.equal(run("weekStatus(db.active,1)"),'1 of 3 days');
run('date="2026-11-02";var duplicate=getSession();duplicate.complete=true;for(const e of duplicate.exercises)logFor(duplicate,e).sets.forEach(r=>r.done=true)');
assert.equal(run("weekStatus(db.active,1)"),'1 of 3 days');
run('day=1;var second=getSession();second.complete=true;for(const e of second.exercises)logFor(second,e).sets.forEach(r=>r.done=true)');
assert.equal(run("weekStatus(db.active,1)"),'2 of 3 days');
run('day=2;var third=getSession();third.complete=true;for(const e of third.exercises)logFor(third,e).sets.forEach(r=>r.done=true)');
assert.equal(run("weekStatus(db.active,1)"),'Completed');
run('logFor(third,third.exercises[0]).sets[0].done=false');
assert.equal(run("weekStatus(db.active,1)"),'2 of 3 days');
console.log('Passed: partial days excluded, duplicate days counted once, all three days required for week completion, corrected results reflected.');
