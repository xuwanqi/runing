$(function () {
    $(".cur_postion").html("当前位置： [ " + sessionStorage.getItem("pmenuname") + " ] - [ " + sessionStorage.getItem("cmenuname") + " ]");

    //查询条件
    var strhtml_searchContent = '<div class="inline-block margin">'
        + '<span>用户昵称:</span>'
        + '<input type="text" class="inputStyle_condition name"/>'
        + '<span>月份:</span>'
        + '<input type="text" class="inputStyle_condition bswspMonth"/>'
        + '</div>';
    $(".searchContent").html(strhtml_searchContent);
    //是否显示查询条件
    showSearchBox(true);

    var obj = {};//查询条件对象
    searchContent(obj);
    showList(obj, 1);

    //全选
    $("body").delegate("input[name='checkboxAll']", "click", function () {
        if ($(this).attr("checked")) {
            $("input[name='checkbox']").each(function () {
                $(this).attr("checked", true);
            });
        } else {
            $("input[name='checkbox']").each(function () {
                $(this).removeAttr("checked");
            });
        }
    });
    //tr高亮显示
    $("body").delegate(".trHighLight", "mouseleave", function () {
        $(this).find("td").css("background-color", "#fff");
    });
    //tr高亮显示并显示图
    $("body").delegate(".trHighLight", "mouseenter", function () {
        $(this).find("td").css("background-color", "#c1ebff");
        var imgurl = $(this).attr("data-imageurl");
        if (imgurl != "#") {
            var that = this;
            $("<img/>").attr("src", imgurl).load(function () {
                var width = 150;
                var realWidth = this.width;
                var realHeight = this.height;
                var height = realHeight / realWidth * width;
                if (realWidth >= width) {
                    var bannerimg = '<img id="bannerimg" src="' + imgurl + '" width="' + width + 'px" height="' + height + 'px" />';
                }
                else {//如果小于浏览器的宽度按照原尺寸显示
                    $("#bannerimg").css("width", realWidth + 'px').css("height", realHeight + 'px');
                    var bannerimg = '<img id="bannerimg" src="' + imgurl + '" width="' + realWidth + 'px" height="' + realHeight + 'px" />';
                }
                layer.tips(bannerimg, that, {
                    tips: 3
                });
            });
        }
    });
    //查询
    $("body").delegate(".searchBtn", "click", function () {
        var obj = {};//查询条件对象
        searchContent(obj);
        showList(obj, 1);
    });
    //重置
    $("body").delegate(".resetBtn", "click", function () {
        var obj = {};//查询条件对象
        $(".name").val('');
        $(".bswspMonth").val('');
        searchContent(obj);
        showList(obj, 1);
    });
    //上一页
    $('.manageBox').delegate(".backpage", "click", function () {
        var obj = {};//查询条件对象
        searchContent(obj);
        pagenum = parseInt($(this).attr("data-pagenum"));
        showList(obj, pagenum);
    });
    //下一页
    $('.manageBox').delegate(".nextpage", "click", function () {
        var obj = {};//查询条件对象
        searchContent(obj);
        var pagenum = parseInt($(this).attr("data-pagenum"));
        showList(obj, pagenum);
    });
    //首页
    $('.manageBox').delegate(".firstpage", "click", function () {
        var obj = {};//查询条件对象
        searchContent(obj);
        var pagenum = parseInt($(this).attr("data-pagenum"));
        showList(obj, pagenum);
    });
    //末页
    $('.manageBox').delegate(".lastpage", "click", function () {
        var obj = {};//查询条件对象
        searchContent(obj);
        var pagenum = parseInt($(this).attr("data-pagenum"));
        showList(obj, pagenum);
    });
    //跳转至
    $('.manageBox').delegate(".jumppage", "click", function () {
        var obj = {};//查询条件对象
        searchContent(obj);
        var pagenum = parseInt($('.jumppagetext').val());
        if (pagenum > 0 && pagenum <= parseInt($(this).attr("data-pagemax"))) {
            showList(obj, pagenum);
        } else {
            alert("查无此页！");
        }
    });

});

function showList(obj, pagenum) {
    var aData = [{name: "<input type='checkbox' name='checkboxAll' value='checkbox' />", percent: "5"},
        {name: "用户昵称", percent: "20"},
        {name: "创建时间", percent: "15"},
        {name: "周", percent: "15"},
        {name: "月份", percent: "15"},
        {name: "步数", percent: "15"},
        {name: "分值", percent: "15"}];
    setTableHead(aData);
    var str = 'pageNum=' + pagenum + '&pageSize=15';
    if (obj.name != "") {
        str += '&name=' + encodeURIComponent(obj.name);
    }
    if (obj.bswspMonth != "") {
        str += '&bswspMonth=' + encodeURIComponent(obj.bswspMonth);
    }
    getOData(str, "busiWeekStep/find/by/cnd", {
            fn: function (oData) {
                var strhtml_list = "";
                var arrData = oData.data.result;
                var ln = arrData.length;
                for (var i = 0; i < ln; i++) {
                    strhtml_list += '<tr class="trHighLight">'
                        + '<td>' + '<input type="checkbox" name="checkbox" value="checkbox" data-id="' + arrData[i].bswspUuid + '"/>' + '</td>'
                        + '<td>' + (arrData[i].bswspUserName || "") + '</td>'
                        + '<td>' + (getFormatDate(arrData[i].bswspCdate) || "") + '</td>'
                        + '<td>' + (arrData[i].bswspWeek || "") + '</td>'
                        + '<td>' + (arrData[i].bswspMonth || "") + '</td>'
                        + '<td>' + (arrData[i].bswspStep || 0) + '</td>'
                        + '<td>' + (arrData[i].bswspScore || 0) + '</td>'
                        + '</tr>';
                }
                $(".tb-body").html(strhtml_list);
                setTableFoot(oData.data, aData.length);
            }
        }
    );
}

function isNull(obj, pagenum) {
    var str = 'pageNum=' + pagenum + '&pageSize=15';
    if (obj.name != "") {
        str += '&name=' + encodeURIComponent(obj.name);
    }
    if (obj.bswspMonth != "") {
        str += '&bswspMonth=' + encodeURIComponent(obj.bswspMonth);
    }
    getOData(str, "busiWeekStep/find/by/cnd", {
        fn: function (oData) {
            var arrData = oData.data.result;
            var ln = arrData.length;
            if (ln == 0) {
                if (oData.data.totalCount != 0 && pagenum != 1) {
                    showList(obj, pagenum - 1);
                } else {
                    showList(obj, 1);
                }
            } else {
                showList(obj, pagenum);
            }
        }
    });
}

function refreshList() {
    var obj = {};//查询条件对象
    searchContent(obj);
    showList(obj, parseInt($(".curpage").text()));
    layer.closeAll();
}

function searchContent(obj) {
    obj.name = $(".name").val();
    obj.bswspMonth = $(".bswspMonth").val();
}
