let printNumber = -1;


function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}


const addText = async () => {
    drawString(`REBOOT | ${pad(printNumber, 3)}`, 0,height - 2, 0.5);
}

// Before draw()
p5.prototype.registerMethod('pre', addText);
