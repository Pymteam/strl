class SVGGraph{

	constructor(name){
		this.svg = SVG(name).size('100%', '100%');
	}

	createRect(x, y, w, h, color){
		var o = this.svg.rect(w, h).move(x,y).attr({fill: color})
		return o
	}

	createCircle(x, y, r, color){
		var o = this.svg.circle(r).move(x,y).attr({fill: color})
		return o
	}

	createFrame(x, y, w, h, color, width){
		var p1 = [x, y]
		var p2 = [x + w, y]
		var p3 = [x + w, y + h]
		var p4 = [x, y + h]
		var points = [p1, p2, p3, p4, p1]
		var o = this.svg.polyline(points)
		o.fill('none')
		o.stroke({color: color, width: width})
	}
}
