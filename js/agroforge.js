
let agroforge=exports

let plates=require("./plates.js")

let agro=require("./agro.json")


plates.chunks.agro=agro // always available in chunks


agroforge.opts={}

agroforge.start=function(opts){

	// running in browser
	if(typeof window !== 'undefined')
	{
		window.$ = window.jQuery = require("jquery")
	}

	for(var n in opts) { agroforge.opts[n]=opts[n] } // copy opts
	
	$(agroforge.start_loaded) // load and display some data
}

agroforge.start_loaded=async function(){

	$("body").empty()

	$("body").append(plates.plate('{test}')) 

}


