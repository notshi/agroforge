

let agrojson=require("./agro.json")

let agro=exports



agro.get=function(id)
{
	return agrojson.ids[id]
}



agro.prepare=function(id,full)
{
	let it={}
	let v=agro.get(id)
	for(let n in v)
	{
		it[n]=v[n]
	}
	if(full)
	{
		if(v.parent) { it.parent=agro.prepare(v.parent) }
		if(v.top) { it.top=agro.prepare(v.top) }
		if(v.parents)
		{
			it.parents=[]
			for( let i=0 ; i<v.parents.length ; i++ )
			{
				it.parents[i]=agro.prepare(v.parents[i])
			}
		}
		if(v.children)
		{
			it.children=[]
			for( let i=0 ; i<v.children.length ; i++ )
			{
				it.children[i]=agro.prepare(v.children[i])
			}
		}
	}
	return it
}
