(function() {
    'use strict';
    
    // https://gist.github.com/gre/1650294
    function easeOutCubic(t) { 
        return (--t)*t*t+1; 
    }

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
    
    var stageWidth = window.innerWidth;
    var stageHeight = window.innerHeight;

    var polygonLength = 1200;
    var polygonHeight = 240;

    var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight);
    var stage = new PIXI.Stage(0x171717);
    var rotation= Math.PI * 0.25;
    var texture1 = createGradientTexture();
    var polygonShift = stageHeight*0.8;

    var polys = [];
    for (var i = 0; i < 20; i++) {
        var polygon = createSprite();
        
        var shift = 100+Math.random()*2*polygonShift;
        
        polygon._flip = Math.random() > 0.5;
        polygon._initialX = Math.random()*stageWidth - (polygon._flip?-1:1)*shift;
        polygon._initialY = polygonShift - shift;
        polygon._shift = shift;

        polygon.position.set(polygon._initialX, polygon._initialY);
        polygon.anchor.set(1,1);
        polygon.rotation = (polygon._flip?-1:1)*rotation;
        polygon.scale.x = polygon._flip ? -1 : 1;

        polys.push(polygon);
        stage.addChild(polygon);
    }
    
    document.body.appendChild(renderer.view);
    requestAnimFrame(animate);

    var duration = 2500;
    var start_ts = new Date().getTime();
    function animate() {
        var delta = (new Date().getTime() - start_ts)/duration;
        if (delta > 1) return;
        requestAnimFrame(animate);
        polys.forEach(function(p) {
            var shift = easeOutCubic(delta) * p._shift;
            p.position.x = p._initialX + (p._flip ?-1:1)*shift;
            p.position.y = p._initialY + shift;
        });
        renderer.render(stage);
    }
})();