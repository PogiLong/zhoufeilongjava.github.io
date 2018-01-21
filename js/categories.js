//文章分类
(function () {
  function categories(){
    $('li#categories').on('click', function(event) {
      console.log(11111);
      $.when(
          $('.sidebar-nav').append('')
      )
    });
  }

  $(document).ready(function(){
    categories();
  })
} ());