let cl = console.log;
let game2048 = {
	config:{
		up:38,
		down:40,
		left: 37,
        right: 39,
        colNum: 4,
        rowNum: 4
	},
	canCreate:true,
	score:0,
	hisScore:0,
	start:function(){
		let This = this,
			height = $('body').height(),
		    begin = $('<button type="button" class="begin">开始游戏</button>')
        $('html').css('fontSize', (height / 41 * 5) + 'px');
        this.setSize(height);
        
        $('ul').append(begin)
        $('.begin').on('keyup click',function(){
        	$('.begin').remove()
        	This.init('body')
        	return false;
        })
	},
	init:function(ele){
		let config = this.config,
			$wrap = $(ele  || 'body'),
			height = $wrap.height()      //607.333
			This = this
		this.$wrap = $wrap
		this.setSize(height)
		this.createBg();
        this.createRect();
        This.canCreate = true;
        this.createRect();
        this.recordScore(0);
        $('html').css('fontSize', (height / 41 * 5) + 'px');
        $('.restart').off('click').on('click', function(){
            This.restartGame();
        });
        $('.finish').off('click').on('click',function(){
        	This.gameOver()
        })
        $wrap.off('keyup').on('keyup', function (event) {
            This.move(event.keyCode);
            return false;
        });
		// cl(this)
		// cl(This)
	},
	setSize: function(height){
        var ulWidth = height * 0.8 - 10,
            mt = 0,
            width = $('body').width(),
            headerH = height * 0.2;

        if (width < ulWidth) {
            mt = (ulWidth - width) / 2;
            ulWidth = width - 10;
        }
        this.liWidth = ulWidth / 4.1;
        this.liPadding = ulWidth / 82;
        $('header').width(ulWidth).height(headerH);
        $('.game-title').width(headerH).height(headerH);
        $('.game-score').width(ulWidth - headerH - 50);
        $('.score-wrap p').css('lineHeight', headerH * 0.28 + 'px');
        $('.game-ul').css({'width':ulWidth, 'height':ulWidth, margin: mt + 'px auto'});

    },

    createBg: function(){
        var colNum = this.config.colNum,
            rowNum = this.config.rowNum,
            arr = [];

        for(var i = 0; i < rowNum; i++){
            if (!arr[i]) {arr[i] = [];}
            for (var j = 0; j < colNum; j++) {
                arr[i][j] = {};
            }
        }
        this.arr = arr;
    },

    createRect: function(){
    	var This = this,
            oUl = $('ul'),
            width = This.liWidth,
            padding = This.liPadding,
            colNum = this.config.colNum,
            rowNum = this.config.rowNum,
            arr = this.arr,
            oLi = null,
            num = Math.random() < 0.9 ? 2 : 4,
            x = Math.floor( Math.random() * colNum ),
            y = Math.floor( Math.random() * rowNum ),
            l = x * width + padding,
            t = y * width + padding,
            canCreate = false;

        if (This.canCreate === false) {return false;}
        for (var i = 0; i < rowNum; i++) {
            for (var j = 0; j < colNum; j++) {
                if ($.isEmptyObject(arr[i][j])) {
                    canCreate = true;
                    break;
                }
            }
        }
        if (canCreate === false) {
            return false;
        }
        if (!$.isEmptyObject(arr[x][y])) {
            This.createRect();
        } else {
            oLi = $('<li class="game-li li' + num + '"><span>' + num + '</span></li>');
            oLi.css({
                'left': l,
                'top': t
            });
            arr[x][y] = {x:x,y:y,num:num,li: oLi};
            oUl.append(oLi);
            setTimeout(function(){
                oLi.addClass('show');
                This.canCreate = true;
                if (This.checkIsLive(arr)) {
                    This.gameOver();
                    return  false;
                }
            },50);
        }
    },
    move: function(keyCode){
        var down = this.config.down,
            up = this.config.up,
            left = this.config.left,
            right = this.config.right;

        switch (keyCode) {
            case down:
                this.removeArr('down');
                this.createRect();
                break;
            case up:
                this.removeArr('up');
                this.createRect();
                break;
            case left:
                this.removeArr('left');
                this.createRect();
                break;
            case right:
                this.removeArr('right');
                this.createRect();
                break;
        }
    },
    removeArr: function(arrow){
        var This = this,
            colNum = this.config.colNum,
            rowNum = this.config.rowNum,
            arr1 = [],
            arr = this.arr;

        This.canCreate = false;
        switch (arrow) {
            case 'down':
                for (var i = 0;i < rowNum; i++) {
                    arr[i] = This.check(arr[i].reverse(),'top','y',true).reverse();
                }
                break;
            case 'up':
                for (var i = 0;i < rowNum; i++) {
                    arr[i] = This.check(arr[i],'top','y',false);
                }                       
                break;
            case 'left':
                arr = This.changeXY(arr);
                for (var i = 0;i < colNum; i++) {
                    arr[i] = This.check(arr[i],'left','x',false);
                }
                arr = This.changeXY(arr);
                This.arr = arr;
                break;
            case 'right':
                arr = This.changeXY(arr);
                for (var i = 0;i < colNum; i++) {
                    arr[i] = This.check(arr[i].reverse(),'left','x',true).reverse();
                }
                arr = This.changeXY(arr);
                This.arr = arr;
                break;
        }
    },
    check: function(arr,arrow,z,reverse){
            var This = this,
                w = This.liWidth,
                p = This.liPadding,
                prev,
                next,
                len = arr.length,
                c = len - 1,
                css = {};

            for (var j = 0; j < len - 1; j++) {
                prev = arr[j];
                for (var k = j+1; k < len; k++) {
                    css = {};
                    next = arr[k];
                    if ($.isEmptyObject(next)) {
                        continue;

                    // 如果是一样的
                    } else if (prev.num === next.num) {
                        arr[k] = {};
                        prev.li.removeClass('li' + prev.num).addClass('li' + prev.num * 2);
                        prev.num += next.num;
                        css[arrow] = reverse ? (c - j) * w + p : j * w + p;
                        css.opacity = 0;
                        next.li.css(css);
                        prev.li.find('span').text(prev.num);
                        prev.li.addClass('a-bouncein');
                        This.recordScore(prev.num);
                        remove(prev,next);
                        This.canCreate = true;
                        break;
                    } else if (prev.num !== next.num && $.isEmptyObject(prev)) {
                        arr[j] = arr[k];
                        arr[k] = {};
                        arr[j][z] = reverse ? c - j : j;
                        css[arrow] = reverse ? (c - j) * w + p : j * w + p;
                        arr[j].li.css(css);
                        j--;
                        This.canCreate = true;
                        break;
                    } else {
                        if ($.isEmptyObject(arr[j+1])) {
                            arr[j+1] = arr[k];
                            arr[k] = {};
                            arr[j+1][z] = reverse ? (c - j - 1) : j+1;
                            css[arrow] = reverse ? ( c - j - 1 ) * w + p : (j+1) * w + p;
                            arr[j+1].li.css(css);
                            This.canCreate = true;
                        }
                        break;
                    }
                }
            }
            function remove(prev,next){
                setTimeout(function(){
                    prev.li.removeClass('a-bouncein');
                    next.li.remove();
                },300);
            }
            return arr;
        },
    changeXY: function(arr){
        var cloneArr = [],
            tmp;

        for (var i = 0;i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (!cloneArr[j]) {
                    cloneArr[j] = [];
                }
                cloneArr[j][i] = $.extend({},arr[i][j]);
            }
        }
        return cloneArr;
    },
    checkIsLive: function(arr){
        var prev,
            next;

        function foreach(arr){
            for (var i = 0;i < arr.length; i++) {
                for (var j = 0; j < arr[i].length - 1; j++) {
                    prev = arr[i][j];
                    next = arr[i][j+1];
                    if ($.isEmptyObject(prev) || $.isEmptyObject(next) || prev.num === next.num) {
                        return false;
                    } else {
                        continue;
                    }
                }
            }
            return true;
        }

        return foreach(arr) && foreach(this.changeXY(arr));

    },
    recordScore: function(num){
        this.score += num;
        this.hisScore = this.hisScore >= this.score ? this.hisScore : this.score;

        $('.this-score h3').text(this.score);
        $('.history-score h3').text(this.hisScore);
        localStorage.setItem('his_score',this.hisScore);
    },
    restartGame: function(){
        this.arr = [];
        $('.game-ul .game-li').remove();
        this.score = 0;
        this.recordScore(0);
        this.init();
    },
    gameOver: function(){
        let end = $('<div class="begin"><p>BANG!</p><button type="button" class="again">再来一次</button></div>')
        $('ul').append(end)
        this.$wrap.off('keyup')    //锁死界面
        $('.again').off('click').on('click',function(){
        	$('.begin').remove()
        	This.restartGame()
        })

    }


};














