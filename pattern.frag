#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
float uKa, uKd, uKs; // coefficients of each type of lighting
float uShininess; // specular exponent

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;
uniform float uTol;

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vMCposition;
in vec3 vC;

void
main( )
{
	uKa = 0.2;
	uKd = 0.4;
	uKs = 0.5;
	uShininess = 0.75;
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	vec3 myColor = vec3( 0.4,0.6,1.0 );		// whatever default color you'd like
	vec3 mySpecularColor = vec3( 1.,1.,1. );	// whatever default color you'd like
	float s = vST.s;
    float t = vST.t;
	float Ar = uAd / 1.5;
	float Br = uBd / 1.25;
	float sc = (int(s / uAd) * uAd) + Ar;
	float tc = (int(t / uBd) * uBd) + Br;
	float res_ellipse = pow((s - sc) / Ar, 2) + pow((t - tc)/ (Br), 2);
	float sm = smoothstep( 1. - uTol, 1. + uTol, res_ellipse );
	myColor = mix(vC,vec3(1.,1.,1.),sm);
	// here is the per-fragment lighting:
	vec3 ambient = uKa * myColor;
	float d = max(dot(Normal,Light),0.0);
	float sp = 0.;
	if( d > 0. ) // only do specular if the light can see the point
	{
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		sp = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * d * myColor;
	vec3 specular = uKs * sp * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}