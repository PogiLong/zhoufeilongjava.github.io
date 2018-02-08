//文章分类
(function () {
  function categories(){
    $('li#categories').on('click', function(event) {
      $.when(
          $('.sidebar-nav').append('')
      )
    });
  }

  $(document).ready(function(){
    categories();
  })
} ());