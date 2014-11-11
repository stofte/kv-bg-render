(function() {
    'use strict';
    
    // https://gist.github.com/gre/1650294
    var EasingFunctions = {
      // no easing, no acceleration
      linear: function (t) { return t },
      // accelerating from zero velocity
      easeInQuad: function (t) { return t*t },
      // decelerating to zero velocity
      easeOutQuad: function (t) { return t*(2-t) },
      // acceleration until halfway, then deceleration
      easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
      // accelerating from zero velocity 
      easeInCubic: function (t) { return t*t*t },
      // decelerating to zero velocity 
      easeOutCubic: function (t) { return (--t)*t*t+1 },
      // acceleration until halfway, then deceleration 
      easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
      // accelerating from zero velocity 
      easeInQuart: function (t) { return t*t*t*t },
      // decelerating to zero velocity 
      easeOutQuart: function (t) { return 1-(--t)*t*t*t },
      // acceleration until halfway, then deceleration
      easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
      // accelerating from zero velocity
      easeInQuint: function (t) { return t*t*t*t*t },
      // decelerating to zero velocity
      easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
      // acceleration until halfway, then deceleration 
      easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
    };

    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }    

    String.prototype.format = String.prototype.f = function() {
        var s = this,
            i = arguments.length;

        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    };

    function createGradientTexture(startColor, stopColor) {
        var canvas = document.createElement('canvas');
        canvas.width = polygonLength;
        canvas.height = polygonHeight;
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, polygonHeight);
        var colorStart = 0x7E;
        var startRgb = hexToRgb(startColor.toString(16));
        var stopRgb = hexToRgb(stopColor.toString(16));
        gradient.addColorStop(0, 'rgba({0},{1},{2}, 1)'.f(startRgb.r, startRgb.g, startRgb.b));
        gradient.addColorStop(1, 'rgba({0},{1},{2}, 0)'.f(stopRgb.r, stopRgb.g, stopRgb.b));
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

    function createSprite(texture) {
        var sprite = new PIXI.Sprite(texture);
        var mask = new PIXI.Graphics();
        mask.beginFill(0xFF00FF);
        mask.drawPolygon(createMask(polygonLength, polygonHeight));
        sprite.mask = mask;
        return new PIXI.Sprite(sprite.generateTexture());
    }
    
    var stageWidth = window.innerWidth;
    var stageHeight = window.innerHeight;
    var canvasBg = 0x171717;

    var polygonLength = 2000;
    var polygonHeight = 240;

    var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight);
    var stage = new PIXI.Stage(canvasBg);
    var rotation= Math.PI * 0.25;
    var polygonShift = stageHeight*0.9;
    var textures = [
        createGradientTexture(0x7E7E7E, canvasBg), 
        createGradientTexture(0x6E6E6E, canvasBg), 
        createGradientTexture(0xAE2629, canvasBg), 
        createGradientTexture(0x3EB6A3, canvasBg)
    ];

    var polys = [];
    var contentPolygons = [];
    var heroPolygons = [];
    var staticCount = 20;

    function finalX(i) {
        var x = Math.random()*stageWidth;
        if (i < staticCount) {
            x = stageWidth/staticCount * i + (stageWidth/staticCount * Math.random()*0.5);
        }
        return x;
    }

    var contentMask = new PIXI.Graphics();
    contentMask.beginFill(0xFF0099);
    contentMask.drawRect(0,0, stageWidth,stageHeight/2);

    for (var i = 0; i < 30; i++) {

        var isContent = Math.random()>0.5;
        var isColor = isContent && Math.random() > 0.5;
        var colorIndex = Math.round(Math.random())+(isColor?2:0);

        var polygon = createSprite(textures[colorIndex]);
        
        var shift = 100+Math.random()*2*polygonShift;
        
        polygon._flip = Math.random() > 0.5;
        polygon._initialX = finalX(i) - (polygon._flip?-1:1)*shift;
        polygon._initialY = polygonShift - shift;
        polygon._shift = shift;

        polygon.position.set(polygon._initialX, polygon._initialY);
        polygon.anchor.set(1,1);
        polygon.rotation = (polygon._flip?-1:1)*rotation;
        polygon.scale.x = polygon._flip ? -1 : 1;

        polys.push(polygon);
        stage.addChild(polygon);

        if (isContent) {
            polygon.mask = contentMask;
        }
    }

    stage.addChild(contentMask);

    document.body.appendChild(renderer.view);
    requestAnimFrame(animate);

    var duration = 2500;
    var start_ts = new Date().getTime();
    function animate() {
        var delta = (new Date().getTime() - start_ts)/duration;
        if (delta > 1) return;
        requestAnimFrame(animate);
        polys.forEach(function(p) {
            var shift = EasingFunctions.easeOutQuart(delta) * p._shift;
            p.alpha = EasingFunctions.easeOutQuart(delta);
            p.position.x = p._initialX + (p._flip ?-1:1)*shift;
            p.position.y = p._initialY + shift;
        });
        renderer.render(stage);
    }
})();