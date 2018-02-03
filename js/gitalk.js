const gitalk = new Gitalk({
  clientID: '4d1bfc260f0d92c3da77',
  clientSecret: 'e8cf2b04f77c50702f9fa2a399440f91d788a02b',
  repo: 'zhoufeilongjava.github.io',
  owner: 'zhoufeilongjava',
  admin: ['zhoufeilongjava'],
  // facebook-like distraction free mode
  distractionFreeMode: false
});

gitalk.render('gitalk-container');