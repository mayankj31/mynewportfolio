const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

function mousefollower() {
    window.addEventListener("mousemove",function(dets){
        document.querySelector("#cursor").style.transform = `translate(${dets.clientX}px, ${dets.clientY}px)`;
    })
}

function animation1()
{
    var tl = gsap.timeline();

    tl.from("#nav", {
        y: '-30',
        opacity: 0,
        duration: 1.5,
        ease : Expo.easeInOut 
    })
        .to(".boundingelem", {
            y:0,
            duration: 1.5,
            stagger: .2,
            delay: -1,
            ease: Expo.easeInOut
        })

        .from("#homefooter", {
            y:'10',
            opacity: 0,
            duration: 1.5,
            delay: -1,
            ease: Expo.easeInOut
        })
}
var timeout;
function cursorsqueeze()
{   
    var xscale = 1;
    var yscale = 1;

    var xprev = 0;
    var yprev = 0;

    window.addEventListener("mousemove",function(dets){
        xscale = gsap.utils.clamp(0.7,1.2,dets.clientX-xprev);
        yscale = gsap.utils.clamp(0.7,1.2,dets.clientY-yprev);
        xprev = dets.clientX;
        yprev = dets.clientY;
 
        mousefollower(xscale, yscale);        
});
}

function mousefollower(xscale,yscale) {
    window.addEventListener("mousemove",function(dets){
        clearTimeout(timeout);
        document.querySelector("#cursor").style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(${xscale}, ${yscale})`;

        timeout = setTimeout(function() {
            document.querySelector("#cursor").style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(1, 1)`;            
        }, 100); 
    }); 
}
animation1();
cursorsqueeze();

document.querySelectorAll(".elem").forEach(function(elem){
    var rotate = 0;
    var diffrot = 0;
    elem.addEventListener("mousemove", function(dets){
        var diff = dets.clientY - elem.getBoundingClientRect().top;
        diffrot =  dets.clientX - rotate;
        rotate = dets.clientX;
        gsap.to(elem.querySelector("img"), {
            opacity: 1,
            display: 'block',
            top: diff,
            left: dets.clientX,
            ease: Power1,
            rotate: gsap.utils.clamp(-20,20, diffrot * 0.5)
        });
    });

    elem.addEventListener("mouseleave", function(){
        gsap.to(elem.querySelector("img"), {
            opacity: 0,
            display: 'none',
            ease: Power1
        });
    });
});