//locomotive scrolling feature implemented
const scroll =new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true,
    smartphone: {
        smooth: true,
        inertia: 0.8,
        getDirection: true
     },
    tablet: {
        smooth: true,
        inertia: 0.8,
        getDirection: true
    },
    reloadOnContextChange: true,
    multiplier: 1.2, // Adjusting scrolling speed (lower = slower)
    lerp: 0.05 // Adjusting smoothness (lower = smoother)
});

//circular cursor following the mouse pointer
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

        .from(".elem", {
            y:'50',
            opacity: 0,
            duration: 1.8,
            delay: -1,
            ease: Expo.easeInOut
        })
        .from("#textabout",{
            x:'20',
            opacity: 0,
            duration: 1.5,
            delay: -1,
            ease: Expo.easeInOut
        })
        .from("#about img",{
            x:'-40',
            opacity: 0,
            duration: 1.5,
            delay: -1,
            ease: Expo.easeInOut
        })
        .from("#footerleft", {
            x:'-10',
            opacity: 0,
            duration: 1.5,
            delay: -1,
            ease: Expo.easeInOut
        })
        .from("#footeright", {
            x:'20',
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
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    // Keep existing mouse events
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

    // Mobile touch functionality
    elem.addEventListener("touchstart", function(e){
        touchStartTime = Date.now();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        const rect = elem.getBoundingClientRect();
        const relativeX = Math.min(Math.max(0, touch.clientX - rect.left), rect.width);
        const relativeY = Math.min(Math.max(0, touch.clientY - rect.top), rect.height);
        
        gsap.to(elem.querySelector("img"), {
            opacity: 1,
            display: 'block',
            top: relativeY,
            left: relativeX,
            ease: Power1,
            rotate: gsap.utils.clamp(-35, 35, (relativeX / rect.width - 0.5) * 70),
            duration: 0.3
        });
    }, { passive: true });

    elem.addEventListener("touchmove", function(e){
        const touch = e.touches[0];
        const rect = elem.getBoundingClientRect();
        
        // Calculate movement distance
        const moveX = Math.abs(touch.clientX - touchStartX);
        const moveY = Math.abs(touch.clientY - touchStartY);

        // If significant movement, prevent click and show image
        if (moveX > 10 || moveY > 10) {
            e.preventDefault();
            const relativeX = Math.min(Math.max(0, touch.clientX - rect.left), rect.width);
            const relativeY = Math.min(Math.max(0, touch.clientY - rect.top), rect.height);
            
            gsap.to(elem.querySelector("img"), {
                opacity: 1,
                display: 'block',
                top: relativeY,
                left: relativeX,
                ease: Power1,
                rotate: gsap.utils.clamp(-35, 35, (relativeX / rect.width - 0.5) * 70),
                duration: 0.3
            });
        }
    }, { passive: false });

    elem.addEventListener("touchend", function(e){
        const touchDuration = Date.now() - touchStartTime;
        const touch = e.changedTouches[0];
        
        // Calculate total movement
        const moveX = Math.abs(touch.clientX - touchStartX);
        const moveY = Math.abs(touch.clientY - touchStartY);

        // If it was a quick tap without much movement, allow the click
        if (touchDuration < 200 && moveX < 10 && moveY < 10) {
            // Don't hide the image immediately to allow click
            setTimeout(() => {
                gsap.to(elem.querySelector("img"), {
                    opacity: 0,
                    display: 'none',
                    ease: Power1,
                    duration: 0.2
                });
            }, 100);
        } else {
            // Hide image immediately for swipes/longer touches
            gsap.to(elem.querySelector("img"), {
                opacity: 0,
                display: 'none',
                ease: Power1,
            });
        }
    });
});

//fuctionality for dropdown
document.addEventListener('DOMContentLoaded', function() {
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownContent = document.querySelector('.dropdown-content');
    let isOpen = false;

    // Toggle dropdown
    dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        dropdownContent.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !e.target.closest('.dropdown')) {
            isOpen = false;
            dropdownContent.classList.remove('active');
        }
    });

    // Close dropdown on mobile touch outside
    document.addEventListener('touchstart', (e) => {
        if (isOpen && !e.target.closest('.dropdown')) {
            isOpen = false;
            dropdownContent.classList.remove('active');
        }
    }, { passive: true });
});