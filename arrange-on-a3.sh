#!/bin/bash

#vpype read uploads/$1.svg

vpype \
    eval "files=glob('uploads/first_batch/*.svg')" \
    eval "cols=2; rows=ceil(len(files)/cols)" \
    grid -o 148mm 105mm "%cols%" "%rows%" \
        read --no-fail "%files[_i] if _i < len(files) else ''%" \
         rotate 90 \
         layout --landscape --valign bottom --align left -m 7mm 148mmx105mm \
    end \
    show