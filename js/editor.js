var s = SVG("worldeditor").size('100%', '100%');


var f = true


var picked = {
	ref: 0,
	shape: 0,
	drag: false,
	mouseCoord:{
		x: 0,
		y: 0
	}
}

function selectBox(cx, cy, w, h){
	w2 = w / 2
	h2 = h /2
	cx += w2
	cy += h2
	picked.shape = s.polyline([[cx-w2, cy-h2], [cx+w2, cy-h2], [cx+w2, cy+h2], [cx-w2, cy + h2],[cx-w2, cy-h2] ]).fill('none').stroke({ color: '#0f0', width: 1 })
}


function dragable_mousedown(event){
	f = true
	picked.mouseCoord.x = event.clientX
	picked.mouseCoord.y = event.clientY
	picked.drag = true
	if (picked.ref != this){
		if (picked.ref != 0){
			picked.shape.remove()
		}
		var x = this.x()
		var y = this.y()
		picked.ref = this
		if (this.type == "rect"){
			selectBox(x, y, this.width(), this.height())
		}
		if (this.type == "circle"){
			selectBox(x, y, this.width(), this.height())
		}


	}

}

function dragable_mousemove(event){
	if (picked.drag){
		var x = event.clientX
		var y = event.clientY
		dx =  x - picked.mouseCoord.x
		dy =  y - picked.mouseCoord.y
		picked.ref.dmove(dx, dy)
		picked.shape.dmove(dx,dy)
		//console.log(event.screenX, event.screenY)
		console.log(event)
		picked.mouseCoord.x = x
		picked.mouseCoord.y = y
	}
}

function dragable_mouseup(event){
	picked.drag = false
}

function pickedObjectReset(){
	if (!f){
		picked.ref = 0;
		picked.shape.remove()
	}
	f = false
	picked.drag = false
}

function createRect(x, y, w, h, color){
	var o = s.rect(w, h).move(x,y).attr({fill: color})
	o.on('mousedown', dragable_mousedown)
	o.on('mousemove', dragable_mousemove)
	o.on('mouseup', dragable_mouseup)
	return o
}

function createCircle(x, y, r, color){
	var o = s.circle(r).move(x,y).attr({fill: color})
	o.on('mousedown', dragable_mousedown)
	o.on('mousemove', dragable_mousemove)
	o.on('mouseup', dragable_mouseup)
	return o
}

s.on('mouseup', pickedObjectReset)
s.on('mousemove', dragable_mousemove)

btn1 = document.getElementById("btn_addBox")
btn1.addEventListener('click', function (){
	createRect(10, 10, 50, 50, '#aaf')
})

btn2 = document.getElementById("btn_addCircle")
btn2.addEventListener('click', function (){
	createCircle(10, 10, 50, '#faa')
})
