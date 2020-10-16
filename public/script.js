const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasJQ = $("canvas");
const signature = $('input[name="signature"]');

// Making canvasJQ draw

canvasJQ.on("mousedown", (e) => {
    let x = e.clientX - canvasJQ.eq(0).offset().left;
    let y = e.clientY - canvasJQ.eq(0).offset().top;

    ctx.moveTo(x, y);
    ctx.beginPath();
    // console.log("mousedown");

    canvasJQ.on("mousemove", (e) => {
        ctx.lineTo(x, y);
        ctx.stroke();
        // console.log("mousemove");
    });
    canvasJQ.on("mouseup", (e) => {
        canvasJQ.unbind("mousemove");
        signature.val(canvas.toDataUrl());
        console.log("mouseup");
    });
});
