const menuButton=document.querySelector(".menu-button");const nav=document.querySelector("#nav");
menuButton?.addEventListener("click",()=>{const open=menuButton.getAttribute("aria-expanded")==="true";menuButton.setAttribute("aria-expanded",String(!open));nav.classList.toggle("open",!open)});
nav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false")}));
document.querySelector("#year").textContent=new Date().getFullYear();
const items=document.querySelectorAll(".reveal");
if(matchMedia("(prefers-reduced-motion: reduce)").matches){items.forEach(item=>item.classList.add("visible"))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});items.forEach(item=>observer.observe(item))}
