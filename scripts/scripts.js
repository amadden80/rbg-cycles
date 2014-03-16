
function Coordinate(args){

	var args = args || {x: 1, y: Math.PI/2};

	this.x = args['x'];
	this.y = args['y'];
	this.radius = args['radius'] || 1;
	this.angle = args['angle'];	
	this.frequency = args['frequency'] || .01;	

	if ( (this.x==0 || this.x) && (this.x==0 || this.x)){
		this.radius = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		this.angle  = Math.atan( this.y / this.x);
	}else if ( (this.radius==0 || this.radius) && (this.angle==0 || this.angle)){
		this.x = this.radius * Math.cos(this.angle);
		this.y = this.radius * Math.sin(this.angle);
	}

	this.update(0)

};


Coordinate.prototype = {

	update: function(time){
		this.x = this.radius * Math.cos(2*Math.PI*this.frequency*time);
		this.y = this.radius * Math.sin(2*Math.PI*this.frequency*time);
		this.radius = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		if (this.x != 0){
			this.angle  = Math.atan( this.y / this.x);
		}
	},

}





var paper;
var sizer = 750	;

window.onload = function(){

	
	paper = Raphael('drawing-pad', sizer, sizer);

	var circle = paper.circle(sizer/2, sizer/2, sizer/2*.9);

	circle.attr({"fill": "#00f", "stroke": "#000",'opacity':0.5}).attr('fill', 'none');
	

	

	var fund_freq = 0.1;
	var fund_ampl = 1;
	var coordinates = 	[
							new Coordinate({frequency:fund_freq, radius: fund_ampl}), 
							new Coordinate({frequency:fund_freq*3, radius: fund_ampl/3}), 
							new Coordinate({frequency:fund_freq*5, radius: fund_ampl/5}), 
							new Coordinate({frequency:fund_freq*7, radius: fund_ampl/7}), 
							new Coordinate({frequency:fund_freq*9, radius: fund_ampl/9}), 
							new Coordinate({frequency:fund_freq*11, radius: fund_ampl/11}), 
							new Coordinate({frequency:fund_freq*13, radius: fund_ampl/13}), 
						];


	var max_radius = 0;
	coordinates.forEach(function(point){
		if (point.radius > max_radius){
			max_radius = point.radius
		}
	})



	var time = 0;
	var srate = 50;

	setInterval(function(){
		time = time + 1/srate
		// console.log('time:', time)
	}, 1/srate*1000)



	coordinates.forEach(function(point){

		var radius_path=paper.path();
		var sin_path=paper.path();
		var cos_path=paper.path();
	 
		var dot = paper.circle().attr('r', 10).attr("fill", "#00f");
		var cos_dot = paper.circle().attr('r', 5).attr("fill", "#0f0")
		var sin_dot = paper.circle().attr('r', 5).attr("fill", "#f00")

		var dot_x = point.x/max_radius * sizer*.9/2 + sizer/2;
		var dot_y = Math.abs(point.y/max_radius * sizer*.9/2 - sizer/2);

		dot.attr('cx', dot_x).attr('cy', dot_y).attr('r', point.radius/max_radius*25)
		
		cos_dot.attr('cx', dot_x).attr('cy', sizer/2 ).attr('r', point.radius/max_radius*10)
		sin_dot.attr('cx', sizer/2 ).attr('cy', dot_y ).attr('r', point.radius/max_radius*10)

		var frame_time = 1;


		setInterval(function(){

			point.update(time);
			dot_x = point.x/max_radius * sizer*.9/2 + sizer/2;
			dot_y = Math.abs(point.y/max_radius * sizer*.9/2 - sizer/2);

			dot.attr('cx', dot_x)
			dot.attr('cy', dot_y)
			

			sin_dot.animate({'cy': dot_y}, frame_time)
			cos_dot.animate({'cx': dot_x}, frame_time)

			radius_path.remove();
			radius_path = paper.path('M'+sizer/2+', '+sizer/2+'L'+dot_x+','+dot_y).attr({'type':'path', 'stroke': '#00f', "opacity": 0.25}).attr('fill', 'none')

			sin_path.remove();
			sin_path = paper.path('M'+sizer/2+', '+sizer/2+'V'+dot_y+'H'+ dot_x).attr({'type':'path', 'fill': '#f00', 'stroke': '#f00', "opacity": 0.25}).attr('fill', 'none')

			cos_path.remove();
			cos_path = paper.path('M'+sizer/2+', '+sizer/2+'H'+dot_x+'V'+ dot_y).attr({'type':'path', 'fill': '#0f0', 'stroke': '#0f0', "opacity": 0.25}).attr('fill', 'none')

		}, frame_time)

	});

}

