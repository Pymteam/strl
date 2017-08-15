function SVGGraph_init(name){
	this.svg = SVG(name).size('100%', '100%');
}

function createRect(x, y, w, h, color){
	var o = this.svg.rect(w, h).move(x,y).attr({fill: color})
	return o
}

function createCircle(x, y, r, color){
	var o = this.svg.circle(r).move(x,y).attr({fill: color})
	return o
}

function createFrame(x, y, w, h, color, width){
	p1 = [x, y]
	p2 = [x + w, y]
	p3 = [x + w, y + h]
	p4 = [x, y + h]
	points = [p1, p2, p3, p4, p1]
	var o = this.svg.polyline(points)
	o.fill('none')
	o.stroke({color: color, width: width})
}

SVGGraph = {
	svg: 0,
	init: SVGGraph_init,
	createRect: createRect,
	createCircle: createCircle,
	createFrame: createFrame
}
