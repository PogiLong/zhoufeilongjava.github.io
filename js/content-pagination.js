(function () {
  function initSearchBar(){
    $('input#post-search').on('change', function(event) {
      keyword = $('input#post-search').val();
      if (keyword.length === 0) {
        //显示所有分页标签
        searchPage(total);
        //调整回搜索前的那页
        fenye(index);
      }else{
        var searchSize = 0;
        searchLi = [];
        $.when(
            lis.each(function(index, el) {
              var postTitle = $(el).find('a.post-link').text().toLowerCase();
              if (postTitle.indexOf(keyword.toLowerCase()) === -1){
                $(el).hide(400);
              }
              else {
                searchLi.push(el.id);
                searchSize++;
              }
            })
        );
        fenye(1);

        //重新计算分页,隐藏超出分页li
        searchPage(Math.ceil(searchSize/limit));
      }
    });
  }

  $(document).ready(function(){
    initSearchBar();
  })
} ());
//搜索关键字
var keyword = '';
//搜索文章id
var searchLi = [];
//遍历的所有文章
var lis = $('ul#archivelist li');
//文章总数
var size = lis.length;
//起始页
var index = 1;
//每页文章数
var limit = 10;
//总页数
var total = Math.ceil(size/limit);
function fenye(id){
  var currentIndex = 10 * (id - 1);
  lis.each(function(index, el) {
    $(el).removeClass('hidden').hide(400);
  });

  //全部文章分页
  var isSearch = false;
  $('.ant-timeline-item').each(function () {
    if (keyword.length === 0) {
      if (this.id > currentIndex && this.id <= limit + currentIndex) {
        $(this).removeClass('hidden').show(400);
      }
    } else {
      isSearch = true;
    }
  });

  //搜索结果集分页
  if (isSearch) {
    //对匹配元素进行分页

    var currentLi = [];
    if (currentIndex + 10 > searchLi.length) {
      currentLi = searchLi.slice(currentIndex);
    } else {
      currentLi = searchLi.slice(currentIndex, currentIndex + 10);
    }
    console.log(currentLi);

    lis.each(function (index, el) {

      for (i in currentLi) {
        if (currentLi[i] === el.id) {
          $(el).removeClass('hidden').show(400);
        }
      }
    })
  }

  index = id;
}

//搜索后分页
function searchPage(page) {
  $('.pagination ul li a').each(function(index, el) {
    if (el.id > page) {
      $(el).removeClass('hidden').hide();
    } else {
      $(el).removeClass('hidden').show();
    }
  });
}

function getTotal() {
  return total;
}

function listenerTotal() {
}