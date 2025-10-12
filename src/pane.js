const setupPane = () => {
    const pane = new Tweakpane.Pane();

    if (typeof params === 'object') {
        Object.keys(params).forEach((p) => {
            const opts = typeof paramsFormat === 'object' && paramsFormat[p] ? paramsFormat[p] : {};
            pane.addBinding(params, p, opts);
        })
    }

    const f = pane.addFolder({
        title: 'Actions',
        expanded: true,
    });

    const saveBtn = f.addButton({
        title: 'Save (s)',
    });

    saveBtn.on('click', () => {
        saveFile();
    })

    pane.on('change', () => {
        clear();
        loop();
    });

    const reloadBtn = pane.addButton({
        index: 9,
        title: '🔄',
    });

    reloadBtn.on('click', () => {
        clear();
        seed();
        loop();
    });
}

const saveFile = async () => {
    const svgContent = document.querySelector('.p5Canvas').innerHTML;

    try {
        // The URL of our Koa server endpoint
        const endpoint = '/save-svg';

        // Prepare the data payload
        const payload = {
            svgContent,
            filename: 'my-browser-drawing.svg' // You can make this dynamic
        };

        // Send the data using the Fetch API
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'An unknown error occurred.');
        }
        
        printNumber = result.printNumber;

        clear();
        reset();
        seed();
        loop();

        // statusMessage.textContent = `Success! Saved as ${result.filename}`;
        // statusMessage.className = 'mt-6 text-sm font-medium text-green-600';

    } catch (error) {
        // Update status on failure
        console.error('Error:', error);
        // statusMessage.textContent = `Error: ${error.message}`;
        // statusMessage.className = 'mt-6 text-sm font-medium text-red-600';
    }
}


// p5.registerAddon((p5, fn, lifecycles) => {
//     lifecycles.postsetup = function () {
//         setupPane();
//     };
// });

p5.prototype.registerMethod('afterSetup', setupPane);
