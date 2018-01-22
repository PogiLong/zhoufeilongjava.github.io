(function () {
  function initSearchBar(){
    $('input#post-search').on('change', function(event) {
      var keyword = $('input#post-search').val();
      if (keyword.length==0) {
        fenye(index);
        // $.when(
        //   $('ul#archivelist li').removeClass('hidden').show(400)
        // )
      }else{
        $.when(
          $('ul#archivelist li').each(function(index, el) {
            var postTitle = $(el).find('a.post-link').text().toLowerCase();
            if (postTitle.indexOf(keyword.toLowerCase())==-1){
              $(el).hide(400);
            } 
            else $(el).removeClass('hidden').show(400)
          })
          )
       }
    });
  }

  $(document).ready(function(){
    initSearchBar();
  })
} ());