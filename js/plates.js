
let plates=exports

plates.plated=require("plated").create({},{pfs:{}}) // create a base instance for inline chunks with no file access

plates.chunks={}

// expand a string using available chunks
plates.plate=function(str)
{
	return plates.plated.chunks.replace(str,plates.chunks)
}

// get -> plates.chunk("name")
// set -> plates.chunk("name","dave")
// delete -> plates.chunk("name",null)
plates.chunk=function(name,value)
{
	if( value === null )
	{
		delete plates.chunks[name]
	}
	else
	if( value !== undefined )
	{
		plates.chunks[name]=value
	}
	return plates.chunks[name]
}

plates.plated.chunks.fill_chunks( require('fs').readFileSync(__dirname + '/plates.html', 'utf8'), plates.chunks )
plates.plated.chunks.fill_chunks( require('fs').readFileSync(__dirname + '/plates.css',  'utf8'), plates.chunks )
plates.plated.chunks.fill_chunks( require('fs').readFileSync(__dirname + '/plates.svg',  'utf8'), plates.chunks )

plates.plated.chunks.format_chunks( plates.chunks )

