function onMIDIMessage(event) {
    const note = parseMidiMessage(event);
    
    console.log(note);

    handleMidiMessage(note); // comes from the sketch script
}

function throttle(mainFunction, delay) {
    let timerFlag = null; // Variable to keep track of the timer

    // Returning a throttled version 
    return (...args) => {
        if (timerFlag === null) { // If there is no timer currently running
            mainFunction(...args); // Execute the main function 
            timerFlag = setTimeout(() => { // Set a timer to clear the timerFlag after the specified delay
                timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
            }, delay);
        }
    };
}


/**
 * Parse basic information out of a MIDI message.
 */
function parseMidiMessage(message) {
    return {
        command: message.data[0] >> 4,
        channel: message.data[0] & 0xf,
        note: message.data[1],
        velocity: message.data[2] / 127,
    }
}

function onMIDISuccess(midiAccess) {
    console.log('MIDI ready!');

    for (const entry of midiAccess.inputs) {
        const input = entry[1];
        if (input.name.includes('ParksTool')) {
            input.onmidimessage = throttle(onMIDIMessage, 5);
            return;
        }
    }
}

function onMIDIFailure(msg) {
    console.error(`Failed to get MIDI access - ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);