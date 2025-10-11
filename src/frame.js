const pageMargin = 30;

const setupFrame = () => {
    const offset = pageMargin * 4;
    const cssWidth = `calc((100vh - ${offset}px) * ${width / height})`;
    const cssHeight = `calc(100vh - ${offset}px)`;
    

}



// p5.registerAddon((p5, fn, lifecycles) => {
//     lifecycles.postsetup = function () {
//         setupFrame();
//     };
// });

p5.prototype.registerMethod('afterSetup', setupFrame);
