
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

// remove "orphaned" parents
	for(let id in ret.ids)
	{
		let it=ret.ids[id]
		if( it.parents )
		{
			for(let i=it.parents.length-1;i>=0;i--)
			{
				let v=it.parents[i]
				if( ! ret.ids[v] )
				{
					it.parents.splice(i,1)
				}
			}
		}		
	}

// build extra data points
	let build ; build=function(id)
	{
		let it=ret.ids[id]
		if(it.seed) { return it } // already done
		
//		it.name=it.name.toLowerCase()

		if(it.id.length==10) // hex
		{
			it.seed=parseInt(it.id.substring(2),16)
		}
		else // decimal
		{
			it.seed=parseInt(it.id.substring(2),10)
		}
		let aa=it.name.toLowerCase().replace(/[aeiou]/ig,"").split(" ")
		while( aa.length>1 && ( aa[aa.length-1].length<2 ) ) { aa.pop() }
		if(aa.length>1)
		{
			it.symbol=(aa[0][0]).toUpperCase()+(aa[0][1])+" "+(aa[aa.length-1][0]).toUpperCase()+(aa[aa.length-1][1])
		}
		else
		{
			if(aa[0][1])
			{
				it.symbol=(aa[0][0]).toUpperCase()+(aa[0][1])
			}
			else
			{
				it.symbol=(it.name[0]).toUpperCase()+(it.name[1]).toLowerCase()
			}
		}

		if( it.parents )
		{
			let bestp
			for(let i in it.parents )
			{
				let v=it.parents[i]
				let p=build(v)
				if(!bestp)
				{
					bestp=p
				}
				else
				{
					if( p.level < bestp.level )
					{
						bestp=p
					}
				}
			}
			if( bestp )
			{
				it.parent=bestp.id
				it.top=bestp.top
			}
		}
		else
		{
			it.top=it.id
		}

		return it
	}
	for(let id in ret.ids)
	{
		build(id)
	}

	fs.writeFileSync( "js/agro.json", stringify(ret,{"space":" "}) )
}

