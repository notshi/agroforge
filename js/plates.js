
let plates=exports

plates.plated=require("plated").create({},{pfs:{}}) // create a base instance for inline chunks with no file access

plates.chunks={}
plates.plate=function(str){ return plates.plated.chunks.replace(str,plates.chunks) }

plates.plated.chunks.fill_chunks( require('fs').readFileSync(__dirname + '/plates.html', 'utf8'), plates.chunks )
plates.plated.chunks.fill_chunks( require('fs').readFileSync(__dirname + '/plates.css',  'utf8'), plates.chunks )
plates.plated.chunks.fill_chunks( require('fs').readFileSync(__dirname + '/plates.svg',  'utf8'), plates.chunks )

plates.plated.chunks.format_chunks( plates.chunks )

