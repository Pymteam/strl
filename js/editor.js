var s = SVG("worldeditor").size('100%', '100%');

var rect1 = s.rect(100, 100).attr({fill: '#aaf'})
var rect2 = s.rect(100, 100).attr({fill: '#faa'})

var polyline = s.polyline([[0,0], [100,50], [50,100]])
polyline.fill('none')
console.log(polyline)
console.log(polyline.stroke)

rect1.move(100, 100);
rect2.move(250, 100);


var picked = {
	ref: 0,
	lines: 0
}

function dragable_mousedown(){
	this.dmove(10, 0);
}

rect1.on('mousedown', dragable_mousedown)


