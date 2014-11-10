(function() {
    'use strict';

    var stageWidth = window.innerWidth;
    var stageHeight = window.innerHeight;

    var polygonLength = 1200;
    var polygonHeight = 200;

    function createGradientTexture(l,w) {
        var canvas = document.createElement('canvas');
        canvas.width = polygonLength;
        canvas.height = polygonHeight;
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, polygonHeight);
        gradient.addColorStop(0, 'rgba(100,100,100, 1)');
        gradient.addColorStop(1, 'rgba(100,100,100, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,polygonLength,polygonHeight);
        // document.body.appendChild(canvas);
        return PIXI.Texture.fromCanvas(canvas);
    }

    function createMask(maxl, maxw) {
        var w = maxw - Math.random()*maxw*0.5;
        var l = maxl - Math.random()*maxl*0.3;

        return [ // x,y
            0,0,
            l,0,
            l-w,w,
            0,w,
            0,0
        ];
    }

    function createSprite() {
        var sprite = new PIXI.Sprite(texture1);
        var mask = new PIXI.Graphics();
        mask.beginFill(0xFF00FF);
        mask.drawPolygon(createMask(polygonLength, polygonHeight));
        sprite.mask = mask;
        return new PIXI.Sprite(sprite.generateTexture());
    }
 
    var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight);
    var stage = new PIXI.Stage(0x171717);
    var rotation= Math.PI * 0.25;
    var texture1 = createGradientTexture();


    var polys = [];
    for (var i = 0; i < 20; i++) {
        var polygon = createSprite();
        polygon.rotation = rotation;
        polygon.position.set(300+Math.random()*stageWidth, stageHeight*0.8);
        polygon.anchor.set(1,1);
        if (Math.random() > 0.5) {
            polygon.scale.x = -1;
            polygon.rotation *= -1;
        }
        polys.push(polygon);
        stage.addChild(polygon);
    }


    // var polygon = createPolygon();// new PIXI.Sprite(grad.generateTexture());
    // polygon.rotation = rotation;
    // polygon.anchor.set(1, 1);
    // polygon.position.set(500, 800);
    // stage.addChild(polygon); 

    // var pol2 = createPolygon();
    // pol2.rotation = rotation;
    // pol2.anchor.set(1, 1);
    // pol2.position.set(520, 800);
    // stage.addChild(pol2); 

    
    
    document.body.appendChild(renderer.view);
    requestAnimFrame(animate);
 
    function animate() {
        requestAnimFrame(animate);
        renderer.render(stage);
    }
})();