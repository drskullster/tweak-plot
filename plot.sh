#!/bin/bash

mkdir -p uploads/tmp
mkdir -p uploads/out 

if [ ! -f uploads/$1.svg ]; then
    echo "$1.svg not found!"
fi

# vpype command, cropping resizing for a6 with .7cm margin 
vpype read --attr stroke uploads/$1.svg layout -b -m .7cm a6 linesort linemerge write uploads/out/$1.svg

axicli -b uploads/out/$1.svg -o uploads/tmp/temp-$1.svg