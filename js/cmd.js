#!/usr/bin/env node

let cmd=exports;

let pfs=require("pify")( require("fs") )


let ls=function(a) { console.log(util.inspect(a,{depth:null})) }


cmd.parse=function(argv)
{
	argv.filename_agroforge=__filename
}

cmd.run=async function(argv)
{
	if( argv._[0]=="bake" )
	{
		await require("./bake.js").all()
		return
	}

	// help text
	console.log(
`
>	agroforge bake

Preprocess and create cached data for use in the agroforge app.

`)
}

// if global.argv is set then we are inside another command so do nothing
if(!global.argv)
{
	let argv = require('yargs').argv
	global.argv=argv
	cmd.parse(argv)
	cmd.run(argv)
}
