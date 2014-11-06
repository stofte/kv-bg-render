(function() {
    'use strict';

    var stageWidth = 500;
    var stageHeight = 500;



    function createGradientTexture() {
        var canvas = document.createElement('canvas');
        canvas.height = stageHeight;
        canvas.width = stageWidth;
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 350, 350);
        gradient.addColorStop(0, 'rgba(150,150,150, 1)');
        gradient.addColorStop(1, 'rgba(50,50,50, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,stageWidth,stageHeight);
        return PIXI.Texture.fromCanvas(canvas);
    }
 
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0xFFFFFF);
 
    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight);
 
    console.log(renderer);
    document.body.appendChild(renderer.view);

    var grad = new PIXI.Sprite(createGradientTexture());
    stage.addChild(grad);
    grad.position.set(0, 0);
    console.log(grad)

    var gradMask = new PIXI.Graphics();
    stage.addChild(gradMask);
    gradMask.beginFill(0);
    gradMask.position.set(stageWidth/2, stageHeight/2);
    gradMask.pivot.set(stageWidth/2, stageHeight/2);
    gradMask.drawRect(10, 10, stageWidth-20, stageHeight-20);
    grad.mask = gradMask;
 
    requestAnimFrame(animate);
 
    function animate() {
        requestAnimFrame(animate);

        gradMask.rotation += 0.01;
        
        renderer.render(stage);
    }

    
})();