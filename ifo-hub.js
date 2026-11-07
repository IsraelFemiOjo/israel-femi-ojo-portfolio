(function(){
  // ballpoint scribble around list titles
  var loop='<svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M178 13C146 1 54 2 20 15C-2 24 4 47 38 54C88 63 168 59 191 40C204 28 188 11 152 7C132 5 112 6 97 9"/></svg>';
  document.querySelectorAll('.scrib-t').forEach(function(el){el.insertAdjacentHTML('beforeend',loop);});
  // product filters
  var tabs=[].slice.call(document.querySelectorAll('.hub-tabs [role="tab"]'));
  var items=[].slice.call(document.querySelectorAll('.prod'));
  function pick(t){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;});
    var f=t.getAttribute('data-filter');
    items.forEach(function(p){p.hidden=!(f==='all'||p.getAttribute('data-cat')===f);});
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){pick(t);});
    t.addEventListener('keydown',function(e){
      if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
      var n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];pick(n);n.focus();
    });
  });
})();
