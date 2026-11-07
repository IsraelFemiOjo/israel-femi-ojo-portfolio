(function(){
  // each page gets its own arrangement, chosen by page name, all kept to the outer edges
  var sets=[
    [['controller','left:3%;top:14%','140px',-18,17,3,14,-22,6,''],['pencil','left:5%;top:66%','70px',34,19,5,18,-12,8,'m-hide'],['laptop','right:3%;top:22%','180px',8,23,11,-16,20,-5,''],['bible','right:5%;top:72%','110px',-12,21,8,-10,18,-4,'']],
    [['bible','left:4%;top:18%','110px',10,21,6,12,-18,5,''],['phone','left:3%;top:70%','85px',-12,18,2,-12,16,-7,''],['controller','right:4%;top:16%','135px',16,20,9,14,-20,-6,'m-hide'],['book','right:3%;top:66%','100px',-8,24,12,-10,-14,4,'']],
    [['laptop','left:2%;top:20%','170px',-10,22,6,14,-18,5,''],['book','left:5%;top:74%','95px',14,24,7,10,-12,4,'m-hide'],['pencil','right:6%;top:14%','70px',-32,19,9,-12,16,-7,''],['phone','right:4%;top:62%','85px',12,18,4,12,-18,7,'']]
  ];
  var key=location.pathname.split('/').pop()||'index';
  var h=0;for(var i=0;i<key.length;i++)h=(h*31+key.charCodeAt(i))>>>0;
  var set=sets[h%sets.length], base=document.currentScript?document.currentScript.src.replace(/ifo-float\.js.*$/,''):'';
  var layer=document.createElement('div');layer.className='ifo-floaters';layer.setAttribute('aria-hidden','true');
  set.forEach(function(o){
    var img=document.createElement('img');img.className='ifo-fl '+o[9];img.alt='';img.decoding='async';
    img.src=base+'assets/float/'+o[0]+'.webp';
    img.setAttribute('style',o[1]+';--w:'+o[2]+';--r:'+o[3]+'deg;--dur:'+o[4]+'s;--delay:-'+o[5]+'s;--dx:'+o[6]+'px;--dy:'+o[7]+'px;--dr:'+o[8]+'deg');
    layer.appendChild(img);
  });
  document.body.insertBefore(layer,document.body.firstChild);

  // on phones there are no empty margins, so each object checks what is in front of it
  var TEXT='H1,H2,H3,H4,P,LI,A,DT,DD,FIGCAPTION,BUTTON,LABEL,IMG,VIDEO';
  var mq=window.matchMedia('(max-width:759px)'), queued=false;
  function check(){
    queued=false;
    var imgs=layer.querySelectorAll('.ifo-fl');
    for(var i=0;i<imgs.length;i++){
      var el=imgs[i];
      if(!mq.matches){el.classList.remove('dim');continue;}
      var r=el.getBoundingClientRect(), hit=false;
      var pts=[[.5,.5],[.2,.2],[.8,.2],[.2,.8],[.8,.8]];
      for(var k=0;k<pts.length&&!hit;k++){
        var x=r.left+r.width*pts[k][0], y=r.top+r.height*pts[k][1];
        if(x<0||y<0||x>innerWidth||y>innerHeight) continue;
        var stack=document.elementsFromPoint(x,y);
        for(var s=0;s<stack.length;s++){
          var n=stack[s];
          if(n===el||layer.contains(n)) continue;
          if(TEXT.indexOf(n.tagName)>-1&&n.tagName.length){ if(TEXT.split(',').indexOf(n.tagName)>-1){hit=true;break;} }
        }
      }
      el.classList.toggle('dim',hit);
    }
  }
  function queue(){ if(!queued){queued=true;requestAnimationFrame(check);} }
  addEventListener('scroll',queue,{passive:true}); addEventListener('resize',queue);
  setInterval(queue,700);   // objects drift on their own too
  addEventListener('load',queue); queue();
})();
