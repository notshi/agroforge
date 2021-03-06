
let agroforge=exports

let print=console.log

let plates=require("./plates.js")


let agro=require("./agro.js")
let views=require("./views.js")


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

	$("html").prepend(plates.plate('<style>{css}</style>')) // load our styles
	
	$("body").append(plates.plate('{view_dual}'))

	views.setup("#view_right")

}
