#!/bin/bash

if [ ! -f uploads/tmp/temp-$1.svg ]; then
    echo "no temp file found for $1.svg, can't home or resume"
fi

mv uploads/tmp/temp-$1.svg uploads/tmp/temp-$1-resumed.svg

axicli -b uploads/tmp/temp-$1-resumed.svg -m res_plot -o uploads/tmp/temp-$1.svg

