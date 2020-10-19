const canvas = $("canvas");
const cnv = document.getElementById("canvas");
const ctx = $("#canvas")[0].getContext("2d");
const signature = $('input[name="signature"]');

// Making canvasJQ draw

canvas.on("mousedown", (e) => {
    ///// to change the stroke color ->
    function colorFromCSSClass(className) {
        var tmp = document.createElement("div"),
            color;
        tmp.style.cssText =
            "position:fixed;left:-100px;top:-100px;width:1px;height:1px";
        tmp.className = className;
        document.body.appendChild(tmp); // required in some browsers
        color = getComputedStyle(tmp).getPropertyValue("color");
        document.body.removeChild(tmp);
        return color;
    }

    ///// to draw the line ->

    let x = e.clientX - canvas.eq(0).offset().left;
    let y = e.clientY - canvas.eq(0).offset().top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    console.log("mousedown: ");
    canvas.on("mousemove", (e) => {
        let x = e.clientX - canvas.eq(0).offset().left;
        let y = e.clientY - canvas.eq(0).offset().top;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.strokeStyle = colorFromCSSClass("myStyle");
        console.log("mousemove: ");
    });
    canvas.on("mouseup", () => {
        signature.val(cnv.toDataURL());
        // signature.val($("#canvas")[0].toDataURL());
        canvas.off("mousemove");
    });
});
