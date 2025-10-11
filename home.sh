#!/bin/bash

if [ ! -f uploads/tmp/temp-$1.svg ]; then
    echo "no temp file found for $1.svg, can't home or resume"
fi

axicli uploads/tmp/temp-$1.svg -m res_home

rm -rf uploads/tmp/temp-$1*.svg