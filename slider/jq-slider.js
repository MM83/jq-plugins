(function(){

    function undef(param, def){
        return param === undefined ? def : param;
    }
    
    function Slider(p, $obj){
        
        var props = {};
        props.value = undef(p.value, 50);
        props.min = undef(p.min, 0);
        props.max = undef(p.max, 100);
        props.change = p.change;
        props.suffix = p.suffix || "";
        
        var wid = $obj.width();
        $obj.css({
            width : wid + "px"
        });
        
        
        var fillBar = $("<div/>").css({
            position: "absolute",
            width : wid / 2 + "px",
            top: "0px",
            left: "0px",
            height : "100%"
        });
        
        if(p.css)
            fillBar.css(p.css);
        
        $obj.append(fillBar);
        var xBase = $obj.offset().left;
        var xPos = 0;
        var touchOn = false;
        var $win = $(window);
        var $fillBar = $(fillBar);
        
        function touchDown(e){
            touchOn = true;
            $win.on('touchmove', touchMove);
            $win.on('touchend', touchUp);
            xPos = e.originalEvent.touches[0].clientX;
            $fillBar.width(Math.min(xPos - xBase, wid));
        };
        function touchMove(e){
            var xDif = e.originalEvent.touches[0].clientX - xPos;
            xPos = e.originalEvent.touches[0].clientX;
            $fillBar.width(Math.min(xPos - xBase, wid));
            var pv = ((xPos - xBase) / wid) * (props.max - props.min) + props.min;
            props.value = Math.min(Math.max(pv, props.min), props.max);
            $fillBar.html(props.value.toFixed(2) +  props.suffix);
            if(props.change)
                props.change(props.value);
            
        };
        function touchUp(){
            touchOn = false;
            $win.off('touchmove', touchMove);
            $win.off('touchend', touchUp);
        };
        
        $obj.on("touchstart", touchDown);
    };
    
    $.fn.slider = function(p){
        
        this.each(function(){
            var slider = new Slider(p, $(this));
        });
        
        
        return this;
    };
    
})();