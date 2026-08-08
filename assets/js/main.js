const menuButton=document.querySelector(".menu-button");const nav=document.querySelector("#nav");
menuButton?.addEventListener("click",()=>{const open=menuButton.getAttribute("aria-expanded")==="true";menuButton.setAttribute("aria-expanded",String(!open));nav.classList.toggle("open",!open)});
nav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false")}));
const year=document.querySelector("#year");if(year)year.textContent=new Date().getFullYear();
const items=document.querySelectorAll(".reveal");
if(matchMedia("(prefers-reduced-motion: reduce)").matches){items.forEach(item=>item.classList.add("visible"))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});items.forEach(item=>observer.observe(item))}
const GA_MEASUREMENT_ID=document.documentElement.dataset.gaMeasurementId||"G-TP4N7HZC27";
const consentKey="magic_analytics_consent";
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",wait_for_update:500});

const loadAnalytics=()=>{
  if(document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`))return;
  const script=document.createElement("script");
  script.async=true;
  script.src=`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.append(script);
  gtag("js",new Date());
  gtag("config",GA_MEASUREMENT_ID,{send_page_view:false});
  gtag("event","page_view",{page_title:document.title,page_location:location.href,page_path:location.pathname+location.search});
};

const setAnalyticsConsent=accepted=>{
  localStorage.setItem(consentKey,accepted?"granted":"denied");
  gtag("consent","update",{analytics_storage:accepted?"granted":"denied"});
  document.querySelector(".cookie-notice")?.remove();
  if(accepted)loadAnalytics();
};
window.magicConsent={get:()=>localStorage.getItem(consentKey)||"unset",set:setAnalyticsConsent};

const savedConsent=localStorage.getItem(consentKey);
if(savedConsent==="granted"){
  gtag("consent","update",{analytics_storage:"granted"});
  loadAnalytics();
}else if(savedConsent===null){
  const notice=document.createElement("aside");
  notice.className="cookie-notice";
  notice.setAttribute("aria-label","การตั้งค่าคุกกี้");
  notice.innerHTML='<p><strong>การวิเคราะห์ผู้เข้าชม</strong><br>คุกกี้วิเคราะห์จะไม่ทำงานจนกว่าคุณอนุญาต อ่านรายละเอียดใน <a href="legal.html#cookies">นโยบายคุกกี้</a></p><div><button type="button" data-consent="deny">เฉพาะที่จำเป็น</button><button class="primary" type="button" data-consent="accept">อนุญาตการวิเคราะห์</button></div>';
  document.body.append(notice);
  notice.addEventListener("click",event=>{const choice=event.target.closest("[data-consent]")?.dataset.consent;if(choice)setAnalyticsConsent(choice==="accept")});
}

window.magicTrack=(eventName,details={})=>{
  window.dispatchEvent(new CustomEvent("magic:analytics",{detail:{eventName,...details}}));
  if(localStorage.getItem(consentKey)==="granted")gtag("event",eventName,details);
};
document.addEventListener("click",event=>{const target=event.target.closest("[data-track]");if(target)window.magicTrack(target.dataset.track,{video_id:target.dataset.videoId||undefined,article_slug:target.dataset.articleSlug||undefined,page_path:location.pathname})});
document.querySelectorAll("[data-consent-settings]").forEach(button=>button.addEventListener("click",()=>{localStorage.removeItem(consentKey);location.reload()}));
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
