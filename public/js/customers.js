'use-strict';

let modaldiv = document.getElementById('modaldiv');
let modal = document.getElementById('modal');

const loadDetails = (email) => {
	modaldiv.setAttribute('class','modaldiv show');
	modal.innerHTML = `<div class='loader'>
		</div>`;
	fetch('/home/permissions', {
		method:'POST',
		headers:{'Content-Type':'application/json'},
		body:JSON.stringify({
			email:email
		})
	}).then(res=>res.json()).then(result=>{
		console.log(result)
		let content = `
		<h1>${result.data.email}</h1>
		<input type='hidden' name='email' value='${result.data.email}' />
		<div class='permissions'>
			<div class='permission'>
				${result.data.accessGreenButton?"<input type='checkbox' name='accessgreenbtn' checked />":"<input type='checkbox' name='accessgreenbtn' />"}
				<label for='accessgreenbtn'>AccessGreenButton</label>
			</div>
			<div class='permission'>
			${result.data.accessRedButton?"<input type='checkbox' name='accessredbtn' checked />":"<input type='checkbox' name='accessredbtn' />"}
			
				<label for='accessredbtn'>AccessRedButton</label>
			</div>
		</div>
		<div class='controls'>
			<button>Save</button>
			<button type='button' for='danger' onclick='closemodal();'>Close</button>
		</div>
		`;
		modal.innerHTML = content;
	}).catch(err=>{
		console.log(err);
	});
};

const closemodal = () => {
	modaldiv.setAttribute('class', 'modaldiv');
};