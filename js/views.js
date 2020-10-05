
let views=exports

let plates=require("./plates.js")

views.list=[]


views.setup=function()
{
	$(window).bind( 'hashchange', function(e) { views.check_hash() } )

	// wait for images to load before performing any data requests?
	for(let n in views.list)
	{
		let v=views.list[n]
		if(typeof v == "object")
		{
			if(v.setup)
			{
				v.setup()
			}
		}
	}
	
	views.check_hash()
	views.display_hash()
}



views.hash={}
views.hash_split=function(q,v)
{
	v=v||{}
	if(q[0]=="#") { q=q.substring(1) }
	let aa=q.split("&")
	aa.forEach(function(it){
		let bb=it.split("=")
		if( ( "string" == typeof bb[0] ) && ( "string" == typeof bb[1] ) )
		{
			v[ bb[0] ] = decodeURIComponent(bb[1]).split("<").join("%3C").split(">").join("%3E")
		}
	})
	return v
}


views.view_done={}
views.show_view=function(name)
{
	if(name)
	{
		name=name.toLowerCase()
		let v=views.list[name]
		if(v && v.view)
		{
			v.view()
		}
	}
}

views.map_old_views={}
views.hash={}
views.display_wait_time=((new Date()).getTime())
views.display_wait=0
views.display_wait_max=0
views.display_progress=100
views.display_wait_update=function(add){
	views.display_wait=views.display_wait+add
	if( views.display_wait <= 0 ) // done
	{
		views.display_wait_time=((new Date()).getTime())
		views.display_wait=0
		views.display_wait_max=0
		views.display_progress=100
	}
	else
	if( views.display_wait > views.display_wait_max ) // waiting for
	{
		views.display_wait_time=((new Date()).getTime())
		views.display_wait_max=views.display_wait
	}
	
	if(views.display_wait_max>0)
	{
		views.display_progress=100 - (100*(views.display_wait+1)/(views.display_wait_max+1))
	}
	else
	{
		views.display_progress=100
	}
	
	views.nanobar.go( views.display_progress )
	
}

views.display=function()
{
	views.display_wait_update(-1)
	views.change_hash()
}

views.change_hash=function(h)
{
	if(h)
	{
		if(h.view)
		{
			h.view=views.map_old_views[h.view] || h.view
		}

		views.hash={}
		for(let n in h)
		{
			views.hash[n]=h[n]
		}
	}
	views.display_hash()
	views.last_hash="&"
	views.check_hash()
}

views.encodeURIComponent=function(str)
{
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  })
}

views.display_hash=function()
{
	let a=[]
	for(let n in views.hash)
	{
		a.push(n+"="+views.encodeURIComponent(views.hash[n]))
	}
	document.location.hash=a.join("&")
	views.last_hash=document.location.hash // disable change logic
}

views.last_hash="&"
views.last_view=""
views.check_hash=function()
{
	let h="#"+(window.location.href.split('#')[1]||"")
	if(h!=views.last_hash)
	{
		plates.chunk("hash",h)
		views.last_hash=h
		let l={}
		views.hash=views.hash_split(h,l)
				
		let change_of_view=false
		if(l.view)
		{
			l.view=views.map_old_views[l.view] || l.view
		}
		else
		{
			l.view="main"
			change_of_view=true
		}
		if((views.last_view!=l.view)||(change_of_view)) // scroll up when changing views
		{
			change_of_view=true
			views.last_view=l.view
			$("html, body").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(){
				$('html, body').stop()
			})
			$('html, body').animate({ scrollTop:0 }, 'slow', function(){
				$("html, body").unbind("scroll mousedown DOMMouseScroll mousewheel keyup")
			})
			
			views.show_view(l.view)
		}

//		views.show_crumbs()

		let name=l.view
		if(name)
		{
			name=name.toLowerCase()
			let v=views.list[name]
			if(v && v.show)
			{
				v.show(change_of_view) // special fill
			}
			else // default fill
			{
					$("body").html( plates.plate( "{view_"+l.view+"}" ) )
			}
			if(v && v.fixup)
			{
				v.fixup()
			}
//			views.search_fixup()
//			$("select.chosen").chosen({allow_single_deselect:true,search_contains:true})
		}
	}
}


