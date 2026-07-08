// ===== Excrop Premium Website — main.js =====
(function(){
  'use strict';
  let currentLang='en';

  // ===== Navbar Scroll =====
  const navbar=document.getElementById('navbar');
  window.addEventListener('scroll',()=>{
    navbar.classList.toggle('scrolled',window.scrollY>60);
  });

  // ===== Mobile Menu =====
  const mobileToggle=document.getElementById('mobileToggle');
  const navLinks=document.getElementById('navLinks');
  if(mobileToggle){
    mobileToggle.addEventListener('click',()=>{
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click',()=>navLinks.classList.remove('open'));
    });
  }

  // ===== Reveal on Scroll =====
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        // Trigger counter for stat numbers
        const num=e.target.querySelector('[data-count]');
        if(num && !num.dataset.counted){
          animateCount(num);
          num.dataset.counted='1';
        }
      }
    });
  },{threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  // Also observe hero stats directly
  document.querySelectorAll('[data-count]').forEach(el=>{
    const parent=el.closest('.hero-stats');
    if(parent && !parent.classList.contains('reveal')){
      const obs=new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(e.isIntersecting && !el.dataset.counted){
            animateCount(el);
            el.dataset.counted='1';
          }
        });
      },{threshold:0.3});
      obs.observe(parent);
    }
  });

  // ===== Count Animation =====
  function animateCount(el){
    const target=parseInt(el.dataset.count);
    const duration=2000;
    const start=performance.now();
    function update(now){
      const elapsed=now-start;
      const progress=Math.min(elapsed/duration,1);
      const eased=1-Math.pow(1-progress,3);
      const val=Math.floor(eased*target);
      el.textContent=val.toLocaleString()+(progress>=1?'+':'');
      if(progress<1)requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const href=this.getAttribute('href');
      if(href==='#')return;
      const target=document.querySelector(href);
      if(target){
        e.preventDefault();
        const offset=80;
        const pos=target.getBoundingClientRect().top+window.pageYOffset-offset;
        window.scrollTo({top:pos,behavior:'smooth'});
      }
    });
  });

  // ===== Quote Calculator =====
  const qVariety=document.getElementById('qVariety');
  const qSize=document.getElementById('qSize');
  const qQty=document.getElementById('qQty');
  const qPack=document.getElementById('qPack');
  const quotePrice=document.getElementById('quotePrice');
  const quoteSubmit=document.getElementById('quoteSubmit');

  // Base prices (USD/ton, FOB Qingdao) — indicative
  const basePrices={
    'normal':{'4.5':680,'5.0':730,'5.5':820,'6.0':950,'6.5':1100},
    'pure':{'4.5':750,'5.0':820,'5.5':920,'6.0':1080,'6.5':1250}
  };
  const packAdjust={'mesh10':0,'mesh20':-10,'carton10':40,'carton20':20,'custom':60};

  function calcQuote(){
    const variety=qVariety.value;
    const size=qSize.value;
    const qty=parseInt(qQty.value)||0;
    const pack=qPack.value;
    if(qty<=0){quotePrice.textContent='$ —';return;}
    let pricePerTon=basePrices[variety][size]+packAdjust[pack];
    // Volume discount
    if(qty>=56)pricePerTon-=30;
    if(qty>=84)pricePerTon-=20;
    const total=pricePerTon*qty;
    const low=Math.round(total*0.92);
    const high=Math.round(total*1.08);
    quotePrice.textContent='$'+low.toLocaleString()+' — $'+high.toLocaleString();
    quotePrice.style.fontSize='1.8rem';
  }

  [qVariety,qSize,qQty,qPack].forEach(el=>{
    if(el)el.addEventListener('input',calcQuote);
  });
  // Initial calc
  if(qVariety)calcQuote();

  // ===== Quote Submit =====
  if(quoteSubmit){
    quoteSubmit.addEventListener('click',()=>{
      const variety=qVariety.options[qVariety.selectedIndex].text;
      const size=qSize.value+'cm';
      const qty=qQty.value;
      const pack=qPack.options[qPack.selectedIndex].text;
      const port=document.getElementById('qPort').value||'TBD';
      const name=document.getElementById('qName').value||'';
      const email=document.getElementById('qEmail').value||'';
      const phone=document.getElementById('qPhone').value||'';
      const price=quotePrice.textContent;

      if(!name||!email){
        alert('Please fill in your name and email to get a quote.');
        return;
      }

      // Build WhatsApp message
      const msg=`🧄 New Garlic Inquiry from Excrop.com\n\n`+
        `Variety: ${variety}\n`+
        `Size: ${size}\n`+
        `Quantity: ${qty} tons\n`+
        `Packaging: ${pack}\n`+
        `Destination: ${port}\n`+
        `Estimated Price: ${price}\n\n`+
        `Name: ${name}\n`+
        `Email: ${email}\n`+
        `${phone?`Phone: ${phone}\n`:''}`;
      const waUrl=`https://wa.me/8613658980612?text=${encodeURIComponent(msg)}`;

      // Send email via Formsubmit
      fetch('https://formsubmit.co/ajax/benshuailan@gmail.com',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({
          _subject:'New Garlic Inquiry from Excrop.com',
          _template:'table',
          Variety:variety,Size:size,Quantity:qty+' tons',Packaging:pack,
          Destination:port,Estimated_Price:price,
          Name:name,Email:email,Phone:phone||'-'
        })
      }).catch(err=>console.error('Email error:',err));

      // Button feedback
      const original=quoteSubmit.textContent;
      quoteSubmit.textContent='✓ Inquiry Sent! Opening WhatsApp...';
      quoteSubmit.style.background='#2D6A4F';
      quoteSubmit.disabled=true;

      setTimeout(()=>{
        window.open(waUrl,'_blank');
        quoteSubmit.textContent=original;
        quoteSubmit.style.background='';
        quoteSubmit.disabled=false;
      },1500);
    });
  }

  // ===== Language Switching =====
  function switchLang(lang){
    currentLang=lang;
    if(window.translations&&window.translations[lang]){
      const dict=window.translations[lang];
      document.documentElement.setAttribute('dir',lang==='ar'?'rtl':'ltr');
      document.documentElement.setAttribute('lang',lang);
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key=el.getAttribute('data-i18n');
        if(dict[key]&&el.tagName!=='INPUT'&&el.tagName!=='SELECT'&&el.tagName!=='TEXTAREA'){
          el.innerHTML=dict[key];
        }
      });
    }
    document.querySelectorAll('.lang-btn').forEach(b=>{
      b.classList.toggle('active',b.dataset.lang===lang);
    });
  }
  document.querySelectorAll('.lang-btn').forEach(b=>{
    b.addEventListener('click',()=>switchLang(b.dataset.lang));
  });
  // Auto-detect language
  const bl=navigator.language||'';
  if(bl.startsWith('zh'))switchLang('zh');
  else if(bl.startsWith('ru'))switchLang('ru');
  else if(bl.startsWith('ar'))switchLang('ar');
})();
