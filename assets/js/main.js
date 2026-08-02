const menuButton=document.querySelector(".menu-button");const nav=document.querySelector("#nav");
menuButton?.addEventListener("click",()=>{const open=menuButton.getAttribute("aria-expanded")==="true";menuButton.setAttribute("aria-expanded",String(!open));nav.classList.toggle("open",!open)});
nav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false")}));
document.querySelector("#year").textContent=new Date().getFullYear();
const items=document.querySelectorAll(".reveal");
if(matchMedia("(prefers-reduced-motion: reduce)").matches){items.forEach(item=>item.classList.add("visible"))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});items.forEach(item=>observer.observe(item))}
// Analytics-ready event hooks. No external tracker is loaded in the mockup.
window.magicTrack=(eventName,details={})=>window.dispatchEvent(new CustomEvent("magic:analytics",{detail:{eventName,...details}}));
document.addEventListener("click",event=>{const target=event.target.closest("[data-track]");if(target)window.magicTrack(target.dataset.track,{videoId:target.dataset.videoId||null,path:location.pathname})});
window.magicTrack("page_view",{path:location.pathname,title:document.title});
