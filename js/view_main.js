
let view_main=exports

let print=console.log

let agro=require("./agro.js")
let views=require("./views.js")
let plates=require("./plates.js")


view_main.show=function()
{
	views.hash.id = views.hash.id || "c_6211"
	views.display_hash()
	
	print( plates.chunk("item",agro.prepare( views.hash.id ,true) ) )
	
	views.fill(plates.plate('{item:info_agro}'))
	
	plates.chunk("item",null)
}
