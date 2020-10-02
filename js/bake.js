
let bake=exports

let print=console.log

let agro = require("agrovoc-json")

let stringify = require('json-stable-stringify')

let fs=require("fs")


bake.all=function()
{
	let names={}
	
	let tab={}
	let manifest ; manifest=function(id)
	{
		let v=agro[id] || {}
		let it=tab[id]
		if( it ) { return it }
		it={}
		tab[id]=it
		
		it.id=id
		it.name=( v.label && v.label.en ) || id
		
		names[it.name]=it.id
		
		if( v.parents )
		{
			for( let i in v.parents )
			{
//print(id+" -> "+v.parents[i]+" : "+i)
				let p=manifest( v.parents[i] )
				p.children=p.children || []
				p.children[p.children.length]=it.id
				it.parents=it.parents || []
				it.parents[it.parents.length]=p.id
			}
		}
		
		return it
	}

	for(let id in agro)
	{
		let v=agro[id]
		let it=manifest(id)
	}
	

	let ret={}
	ret.tree={}
	ret.ids={}
//	ret.names={}

	let remember=function(id)
	{
		let it=manifest(id)
//		ret.names[it.name]=it.id
		ret.ids[it.id]=it
		return id
	}

	let children ; children=function(id,level)
	{
		let it=manifest(id)
		if(it.level)
		{
			if(level<it.level) { it.level=level } // lowest level
		}
		else
		{
			it.level=level
		}
		let a={}
		if(it.children)
		{
			for(let cid of it.children)
			{
				a[remember(cid)]=children(cid,level+1)
			}
		}
		return a
	}

/*
	for(let id in agro)
	{
		let it=manifest(id)
		if(!it.parents)
		{
			ret.tree[lab(id)]=children(id)
		}
	}
*/

	for(let name of ["objects","products","substances"]) // extract the "things"
	{
		let id=names[name]
		ret.tree[remember(id)]=children(id,1)
	}
	

	fs.writeFileSync( "js/agro.json", stringify(ret,{"space":" "}) )
}

