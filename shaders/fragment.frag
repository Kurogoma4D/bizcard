#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI  = 3.141592653589793;
const float PI2 = PI * 2.;

float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x*uv.y;
}

vec2 tile(vec2 _p, float _rate) {
	return fract(_p*_rate);
}

vec2 rotate2D(vec2 _p, float _angle) {
	_p -= 0.5;
	_p = mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle)) * _p;
	return _p+0.5;
}

void main( void ) {

	vec2 rawPosition = vec2(mouse.x* 2.0 - 1.0, mouse.y * 2.0 - 1.0);
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 2.0;

	float color = 0.0;
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	p = atan((rawPosition-p) * 0.9) + sign(rawPosition) * time;
	p = tile(p, 3.0);
	p = rotate2D(p, PI/4.0);
	
	
    	float d = box(p, vec2(0.7), 0.06);
	float tiled = smoothstep(0.4,0.41,d);
	
	gl_FragColor = vec4(vec3(tiled)*0.2, 1.0);
	gl_FragColor *= vec4( vec3( sin(color / time + position.x),  0.2, cos(color / time + position.y)  ) + 0.12, 1.0 );
	gl_FragColor += vec4( vec3( sin(color / time + position.x), 0.2, cos(color / time + position.y)  ) + 0.3, 1.0 );

}