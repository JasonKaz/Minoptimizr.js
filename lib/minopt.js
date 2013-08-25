var fs=require('fs'),
    cc=null,
    css=null,
    validFiles=['js', 'css'];

function getExt(filename){
	return filename.split('.').pop();
}

function getName(filename){
    var f=filename.split('.');
    f.splice(f.length-1, 1);
    return f;
}

fs.watch('./', function(event, filename){
    if (event=="change" || event=="rename"){
        if (filename && filename.indexOf('min.')==-1 && filename!=="mintool.js"){
            var ext=getExt(filename);
            if (validFiles.indexOf(ext)!=-1){
                switch (ext){
                    case 'js':
                        cc=cc||require('closure-compiler');

                        cc.compile([filename], {
                            compilation_level: "SIMPLE_OPTIMIZATIONS"
                        }, function(err, result){
                            if (result){
                                fs.writeFile(getName(filename)+'.min.'+ext, result);
                            }else{
                                console.log(err);
                            }
                        });
                        break;

                    case 'css':
                        css=css||require('sqwish');

                        fs.readFile(filename, {
                            encoding:'utf8'
                        },function(err, data){
                            if (err) throw err;
                            var result=css.minify(data, true);
                            if (result){
                                fs.writeFile(getName(filename)+'.min.'+ext, result);
                            }
                        });
                        break;

                    default:
                        console.log('unknown');
                }
            }
        }
    }
});