jQuery(function ($) {
  $(".ajax_post_form").ajaxForm({
    dataType: "json",
    beforeSubmit: function (a, f, o) {
      f.addClass("thisactive");
      $(".thisactive input[type=submit], .thisactive input[type=button]").attr(
        "disabled",
        true
      );
      $(".thisactive").find(".ajax_submit_ind").show();
    },
    error: function (res, res2, res3) {
      for (key in res) {
        console.log(key + " = " + res[key]);
      }
    },
    success: function (res) {
      if (res["status"] == "error") {
        if (res["status_text"]) {
          $(".thisactive .resultgo").html(
            '<div class="resultfalse"><div class="resultclose"></div>' +
              res["status_text"] +
              "</div>"
          );
        }
      }
      if (res["status"] == "success") {
        if (res["status_text"]) {
          $(".thisactive .resultgo").html(
            '<div class="resulttrue"><div class="resultclose"></div>' +
              res["status_text"] +
              "</div>"
          );
        }
      }

      if (res["clear"]) {
        $(
          ".thisactive input[type=text]:not(.notclear), .thisactive input[type=password]:not(.notclear), .thisactive textarea:not(.notclear)"
        ).val("");
      }

      if (res["show_hidden"]) {
        $(".thisactive .hidden_line").show();
      }

      if (res["url"]) {
        window.location.href = res["url"];
      }

      $(".thisactive input[type=submit], .thisactive input[type=button]").attr(
        "disabled",
        false
      );
      $(".thisactive").find(".ajax_submit_ind").hide();
      $(".thisactive").removeClass("thisactive");
    },
  });

  if (self != top && window.parent.frames.length > 0) {
    $(".not_frame").remove();
  }
});

jQuery(function ($) {
  function get_exchange_step1(id) {
    var id1 = $("#select_give").val();
    var id2 = $("#select_get").val();
    $(".exch_ajax_wrap_abs").show();
    var param = "id=" + id + "&id1=" + id1 + "&id2=" + id2;
    $.ajax({
      type: "POST",
      url: "https://bisson.exchange/premium_action-exchange_stepselect.html?meth=post&yid=ced212d92786&ynd=0&lang=ru",
      dataType: "json",
      data: param,
      error: function (res, res2, res3) {
        for (key in res) {
          console.log(key + " = " + res[key]);
        }
      },
      success: function (res) {
        $(".exch_ajax_wrap_abs").hide();

        if (res["status"] == "success") {
          $("#exch_html").html(res["html"]);

          if ($("#the_title_page").length > 0) {
            $("#the_title_page, .direction_title").html(res["titlepage"]);
          }

          $("title").html(res["title"]);

          if ($("meta[name=keywords]").length > 0) {
            $("meta[name=keywords]").attr("content", res["keywords"]);
          }
          if ($("meta[name=description]").length > 0) {
            $("meta[name=description]").attr("content", res["description"]);
          }

          if (res["url"]) {
            window.history.replaceState(null, null, res["url"]);
          }

          $(document).JTimer();
          $(document).Jselect("init", {
            trigger: ".js_my_sel",
            class_ico: "currency_logo",
          });
          $(document).JcheckboxInit();
        } else {
          if (res["status_text"]) {
            alert(res["status_text"]);
          }
        }
      },
    });
  }
  $(document).on("change", "#select_give", function () {
    get_exchange_step1(1);
  });
  $(document).on("change", "#select_get", function () {
    get_exchange_step1(2);
  });
});
jQuery(function ($) {
  var res_timer = 1;
  function start_res_timer() {
    $(".res_timer").html("0");

    if (res_timer == 1) {
      res_timer = 0;
      setInterval(function () {
        if ($(".res_timer").length > 0) {
          var num_t = parseInt($(".res_timer").html());
          num_t = num_t + 1;
          $(".res_timer").html(num_t);
        }
      }, 1000);
    }
  }

  $("#check_rule_step").on("change", function () {
    if ($(this).prop("checked")) {
      $("#check_rule_step_input").prop("disabled", false);
    } else {
      $("#check_rule_step_input").prop("disabled", true);
    }
  });

  $("#check_rule_step_input").on("click", function () {
    $(this)
      .parents(".ajax_post_form")
      .find(".resultgo")
      .html(
        '<div class="resulttrue">Идет обработка. Пожалуйста подождите (<span class="res_timer">0</span>)</div>'
      );
    start_res_timer();
  });

  $(".iam_pay_bids").on("click", function () {
    if (!confirm("Вы уверены, что уже оплатили заявку?")) {
      return false;
    }
  });
});
jQuery(function ($) {
  if ($(".check_payment_hash").length > 0) {
    var nowdata = 0;
    var redir = 0;

    function check_payment_now() {
      var second = parseInt($(".check_payment_hash").attr("data-time"));

      nowdata = parseInt(nowdata) + 1;

      $(".block_check_payment_abs").html(nowdata);
      $(".block_check_payment").show();
      var wid = $(".block_check_payment").width();
      if (wid > 1) {
        var onepr = wid / second;
        var nwid = onepr * nowdata;
        if (nwid > wid) {
          nwid = wid;
        }
        $(".block_check_payment_ins").animate({ width: nwid }, 500);
      }

      if (nowdata >= second) {
        if (redir == 0) {
          var durl = $(".check_payment_hash").attr("data-hash");
          redir = 1;
          if (durl.length > 0) {
            $(".exchange_status_abs").show();

            var param = "hashed=" + durl;
            $.ajax({
              type: "POST",
              url: "https://bisson.exchange/premium_action-refresh_status_bids.html?meth=post&yid=ced212d92786&ynd=0&lang=ru&auto_check=1",
              dataType: "json",
              data: param,
              error: function (res, res2, res3) {
                for (key in res) {
                  console.log(key + " = " + res[key]);
                }
              },
              success: function (res) {
                $(".exchange_status_abs").hide();
                if (res["html"]) {
                  $("#exchange_status_html").html(res["html"]);
                  $(document).JTimer();
                  $(document).Jselect("init", {
                    trigger: ".js_my_sel",
                    class_ico: "currency_logo",
                  });
                  $(document).JcheckboxInit();
                  redir = 0;
                  nowdata = 0;
                }
              },
            });
          }
        }
      }
    }
    setInterval(check_payment_now, 1000);
  }
});

jQuery(function ($) {
  $(document).on("click", ".js_window_login", function () {
    $(document).JsWindow("show", {
      window_class: "update_window",
      title: "Авторизация",
      content: $(".loginform_box_html").html(),
      insert_div: ".loginform_box",
      shadow: 1,
    });

    var new_url = window.location.href;
    $("input[name=return_url]").val(new_url);

    return false;
  });
});

jQuery(function ($) {
  $(document).on("click", ".js_window_join", function () {
    $(document).JsWindow("show", {
      window_class: "update_window",
      title: "Регистрация",
      content: $(".registerform_box_html").html(),
      insert_div: ".registerform_box",
      shadow: 1,
    });

    var new_url = window.location.href;
    $("input[name=return_url]").val(new_url);

    return false;
  });
});
jQuery(function ($) {
  var clipboard = new ClipboardJS(".pn_copy");
  clipboard.on("success", function (e) {
    $(".pn_copy").removeClass("copied");
    $(e.trigger).addClass("copied");
  });
});
jQuery(function ($) {
  $(document).on(
    "focusin",
    ".has_tooltip input, .has_tooltip textarea",
    function () {
      $(this).parents(".has_tooltip").addClass("showed");
    }
  );
  $(document).on("click", ".field_tooltip_label", function () {
    $(this).parents(".has_tooltip").addClass("showed");
  });
  $(document).on(
    "focusout",
    ".has_tooltip input, .has_tooltip textarea",
    function () {
      $(this).parents(".has_tooltip").removeClass("showed");
    }
  );
});

jQuery(function ($) {
  $(".oncetoggletitle").on("click", function () {
    $(this).parents(".oncetoggle").toggleClass("active");
    return false;
  });
});

jQuery(function ($) {
  /* help exchange */
  $(document).on("focusin", ".js_window_wrap", function () {
    $(this).addClass("showed");
  });
  $(document).on("focusout", ".js_window_wrap", function () {
    $(this).removeClass("showed");
  });
  /* end help exchange */
});

jQuery(function ($) {
  if ($(".napsemail_block").length > 0) {
    function interval_napsemail() {
      var ch_sec = parseInt($("#napsemail_reload").attr("data-next"));
      var now = ch_sec - 1;
      if (now > 1) {
        $("#napsemail_reload").attr("data-next", now);
        $("#napsemail_reload").val("Отправить (" + now + ")");
        $("#napsemail_reload").prop("disabled", true);
      } else {
        $("#napsemail_reload").val("Отправить");
        $("#napsemail_reload").attr("data-next", 0);
        $("#napsemail_reload").prop("disabled", false);
      }
    }
    setInterval(interval_napsemail, 1000);

    $(document).on("click", "#napsemail_reload", function () {
      if (!$(this).prop("disabled")) {
        var id = $(this).attr("data-id");
        var thet = $(this);
        thet.prop("disabled", true);
        var param = "id=" + id;
        $.ajax({
          type: "POST",
          url: "https://bisson.exchange/premium_action-resend_napsemail_bids.html?meth=post&yid=ced212d92786&ynd=0&lang=ru",
          dataType: "json",
          data: param,
          error: function (res, res2, res3) {
            for (key in res) {
              console.log(key + " = " + res[key]);
            }
          },
          success: function (res) {
            if (res["status"] == "success") {
              $("#napsemail_reload").attr("data-next", res["next"]);
              if (res["next"] == "-1") {
                $("#napsemail_reload").remove();
              }
            }

            if (res["status_text"]) {
              alert(res["status_text"]);
            }

            if (res["status"] == "error") {
              thet.prop("disabled", false);
            }
          },
        });
      }

      return false;
    });

    $(document).on("click", "#napsemail_send", function () {
      if (!$(this).prop("disabled")) {
        var id = $(this).attr("data-id");
        var txt = $("#napsemail_text").val();
        var thet = $(this);
        thet.prop("disabled", true);

        var param = "id=" + id + "&txt=" + txt;
        $.ajax({
          type: "POST",
          url: "https://bisson.exchange/premium_action-save_napsemail_bids.html?meth=post&yid=ced212d92786&ynd=0&lang=ru",
          dataType: "json",
          data: param,
          error: function (res, res2, res3) {
            for (key in res) {
              console.log(key + " = " + res[key]);
            }
          },
          success: function (res) {
            if (res["status"] == "success") {
              window.location.href = "";
            }
            if (res["status"] == "error") {
              if (res["status_text"]) {
                alert(res["status_text"]);
              }
              thet.prop("disabled", false);
            }
          },
        });
      }

      return false;
    });
  }
});

jQuery(function ($) {
  if ($(".napssms_block").length > 0) {
    function interval_napssms() {
      var ch_sec = parseInt($("#napssms_reload").attr("data-next"));
      var now = ch_sec - 1;
      if (now > 1) {
        $("#napssms_reload").attr("data-next", now);
        $("#napssms_reload").val("Отправить (" + now + ")");
        $("#napssms_reload").prop("disabled", true);
      } else {
        $("#napssms_reload").val("Отправить");
        $("#napssms_reload").attr("data-next", 0);
        $("#napssms_reload").prop("disabled", false);
      }
    }
    setInterval(interval_napssms, 1000);

    $(document).on("click", "#napssms_reload", function () {
      if (!$(this).prop("disabled")) {
        var id = $(this).attr("data-id");
        var thet = $(this);
        thet.prop("disabled", true);
        var param = "id=" + id;
        $.ajax({
          type: "POST",
          url: "https://bisson.exchange/premium_action-resend_napssms_bids.html?meth=post&yid=ced212d92786&ynd=0&lang=ru",
          dataType: "json",
          data: param,
          error: function (res, res2, res3) {
            for (key in res) {
              console.log(key + " = " + res[key]);
            }
          },
          success: function (res) {
            if (res["status"] == "success") {
              thet.attr("data-next", res["next"]);
              if (res["next"] == "-1") {
                thet.remove();
              }
            }

            if (res["status_text"]) {
              alert(res["status_text"]);
            }

            if (res["status"] == "error") {
              thet.prop("disabled", false);
            }
          },
        });
      }

      return false;
    });

    $(document).on("click", "#napssms_send", function () {
      if (!$(this).prop("disabled")) {
        var id = $(this).attr("data-id");
        var txt = $("#napssms_text").val();
        var thet = $(this);
        thet.prop("disabled", true);

        var param = "id=" + id + "&txt=" + txt;
        $.ajax({
          type: "POST",
          url: "https://bisson.exchange/premium_action-save_napssms_bids.html?meth=post&yid=ced212d92786&ynd=0&lang=ru",
          dataType: "json",
          data: param,
          error: function (res, res2, res3) {
            for (key in res) {
              console.log(key + " = " + res[key]);
            }
          },
          success: function (res) {
            if (res["status"] == "success") {
              window.location.href = "";
            }
            if (res["status"] == "error") {
              if (res["status_text"]) {
                alert(res["status_text"]);
              }
              thet.prop("disabled", false);
            }
          },
        });
      }

      return false;
    });
  }
});

jQuery(function ($) {
  $(document).on("click", ".js_hnotice_close", function () {
    var id = $(this).parents(".js_hnotice").attr("id").replace("hnotice_", "");
    var exp_day = parseInt($(this).attr("data-exp"));
    Cookies.set("hm" + id, 1, { expires: exp_day, path: "/" });

    $("#hnotice_" + id).hide();
  });

  $(document).on("click", ".wn_div_submit", function () {
    var id = $(this).attr("data-id");
    var exp_day = parseInt($(this).attr("data-exp"));
    Cookies.set("hm" + id, 1, { expires: exp_day, path: "/" });
    $(this).parents(".wn_wrap").hide();
  });
});

jQuery(function ($) {
  $(".promo_menu li a").on("click", function () {
    if (!$(this).hasClass("act")) {
      $(".pbcontainer, .promo_menu li").removeClass("act");
      $(".pbcontainer").filter(this.hash).addClass("act");
      $(this).parents("li").addClass("act");
    }
    return false;
  });

  $(".bannerboxlink a").on("click", function () {
    var text = $(this).text();
    var st = $(this).attr("show-title");
    var ht = $(this).attr("hide-title");
    if (text == st) {
      $(this).html(ht);
    } else {
      $(this).html(st);
    }
    $(this).parents(".bannerboxone").find(".bannerboxtextarea").toggle();
    $(this).toggleClass("act");

    return false;
  });
});

jQuery(function ($) {
  $(document).on("click", ".js_reserv", function () {
    $(document).JsWindow("show", {
      window_class: "update_window",
      title: 'Запрос резерва "<span id="reserv_box_title"></span>"',
      content: $(".reserv_box_html").html(),
      insert_div: ".reserv_box",
      shadow: 1,
    });

    var title = $(this).attr("data-title");
    var id = $(this).attr("data-id");
    $("#reserv_box_title").html(title);
    $("#reserv_box_id").attr("value", id);

    return false;
  });
});

jQuery(function ($) {
  function create_icons() {
    $(".js_icon_left").hide();
    $(".js_icon_left:first").show();

    $(".js_icon_left").each(function () {
      var vtype = $(this).attr("data-type");
      if ($(".js_item_left_" + vtype).length > 0) {
        $(".js_icon_left_" + vtype).show();
      }
    });

    $(".js_icon_right").hide();
    $(".js_icon_right:first").show();

    $(".js_icon_right").each(function () {
      var vtype = $(this).attr("data-type");
      if ($(".js_item_right_" + vtype + ":visible").length > 0) {
        $(".js_icon_right_" + vtype).show();
      }
    });

    if ($(".js_icon_right.active:visible").length == 0) {
      $(".js_item_right").show();
      $(".js_icon_right").removeClass("active");
      $(".js_icon_right:first").addClass("active");
    }
  }

  create_icons();

  function go_active_left_col(ind) {
    if ($(".xtt_html_abs").length > 0) {
      if ($(".js_item_left:visible.active").length == 0) {
        $(".js_item_left").removeClass("active");
        $(".js_item_left:visible:first").addClass("active");
      }
      var valid = $(".js_item_left.active").attr("data-id");

      $(".xtt_html_abs").show();
      var param = "id=" + valid;
      $.ajax({
        type: "POST",
        url: "https://bisson.exchange/premium_action-table1_change.html?meth=post&yid=ced212d92786&ynd=0&lang=ru",
        dataType: "json",
        data: param,
        error: function (res, res2, res3) {
          for (key in res) {
            console.log(key + " = " + res[key]);
          }
        },
        success: function (res) {
          $(".xtt_html_abs").hide();
          if (res["status"] == "success") {
            $("#xtt_right_col_html").html(res["html"]);
          }
          create_icons();
        },
      });
    }
  }

  $(document).on("click", ".js_item_left", function () {
    if (!$(this).hasClass("active")) {
      $(".js_item_left").removeClass("active");
      $(this).addClass("active");
      go_active_left_col(0);
    }
    return false;
  });

  $(document).on("click", ".js_icon_left", function () {
    if (!$(this).hasClass("active")) {
      var vtype = $(this).attr("data-type");
      $(".js_icon_left").removeClass("active");
      $(this).addClass("active");
      if (vtype == 0) {
        $(".js_item_left").show();
      } else {
        $(".js_item_left").hide();
        $(".js_item_left_" + vtype).show();
      }
      go_active_left_col(0);
    }
    return false;
  });

  $(document).on("click", ".js_icon_right", function () {
    if (!$(this).hasClass("active")) {
      var vtype = $(this).attr("data-type");
      $(".js_icon_right").removeClass("active");
      $(this).addClass("active");
      if (vtype == 0) {
        $(".js_item_right").show();
      } else {
        $(".js_item_right").hide();
        $(".js_item_right_" + vtype).show();
      }
    }
    return false;
  });

  $(document).on("click", ".xtt_title_link", function () {
    $(".xtt_title_link").removeClass("active");
    $(this).addClass("active");
    var id = $(this).attr("data-id");

    Cookies.set("table5_select", id, { expires: 7, path: "/" });

    $(".js_check_reserve").each(function () {
      var data_now = $(this).attr("data-reserve");
      if (id == "rate") {
        data_now = $(this).attr("data-rate");
      }
      $(this).html(data_now);
    });

    return false;
  });
});

jQuery(function ($) {
  if ($("#hexch_html").length > 0) {
    $(document).on("click", ".js_exchange_link", function () {
      $(".js_exchange_link").removeClass("active");
      $(this).addClass("active");

      var direction_id = $(this).attr("data-direction-id");

      $(".js_exchange_widget_abs").show();

      var tscroll = $("#hexch_html").offset().top - 100;
      $("body,html").animate({ scrollTop: tscroll }, 500);

      var param = "direction_id=" + direction_id;
      $.ajax({
        type: "POST",
        url: "https://bisson.exchange/premium_action-exchange_widget.html?meth=post&yid=ced212d92786&ynd=0&lang=ru",
        dataType: "json",
        data: param,
        error: function (res, res2, res3) {
          for (key in res) {
            console.log(key + " = " + res[key]);
          }
        },
        success: function (res) {
          if (res["html"]) {
            $("#hexch_html").html(res["html"]);
          }
          if (res["status"] == "error") {
            $("#hexch_html").html(
              '<div class="resultfalse"><div class="resultclose"></div>' +
                res["status_text"] +
                "</div>"
            );
          }
          $(document).JTimer();
          $(document).Jselect("init", {
            trigger: ".js_my_sel",
            class_ico: "currency_logo",
          });
          $(document).JcheckboxInit();
          $(".js_exchange_widget_abs").hide();
        },
      });

      return false;
    });
  }
});

jQuery(function ($) {
  $(document).on("click", ".js_amount", function () {
    var amount = $(this).attr("data-val");
    var id = $(this).attr("data-id");
    $("input.js_" + id + ":not(:disabled)")
      .val("0")
      .trigger("keyup");
    $("input.js_" + id + ":not(:disabled)")
      .val(amount)
      .trigger("change");
    $(".js_" + id + "_html").html(amount);
  });

  function cache_exchange_data(thet) {
    var ind = 0;
    if (thet.hasClass("check_cache")) {
      var not_check_data = parseInt(Cookies.get("not_check_data"));
      if (not_check_data != 1) {
        ind = 1;
      }
    } else {
      ind = 1;
    }
    if (ind == 1) {
      var id = thet.attr("cash-id");
      var v = thet.val();
      Cookies.set("cache_" + id, v, { expires: 7, path: "/" });
    }
  }

  $(document).ChangeInput({
    trigger: ".cache_data",
    success: function (obj) {
      cache_exchange_data(obj);
    },
  });

  $(document).on("change", "#not_check_data", function () {
    if ($(this).prop("checked")) {
      Cookies.set("not_check_data", 1, { expires: 7, path: "/" });
      $(".check_cache").each(function () {
        var id = $(this).attr("cash-id");
        Cookies.remove("cache_" + id);
      });
    } else {
      Cookies.set("not_check_data", 0, { expires: 7, path: "/" });
      $(".check_cache").each(function () {
        var id = $(this).attr("cash-id");
        var v = $(this).val();
        Cookies.set("cache_" + id, v, { expires: 7, path: "/" });
      });
    }
  });

  $(document).on(
    "change",
    "select, textarea, input:not(.js_sum_val)",
    function () {
      $(this).parents(".js_wrap_error").removeClass("error");
    }
  );
  $(document).on("click", "input, textarea, select", function () {
    $(this).parents(".js_wrap_error").removeClass("error");
  });

  $(document).on("click", ".ajax_post_bids input[type=submit]", function () {
    var count_window = $(".window_message").length;
    if (count_window > 0) {
      $(document).JsWindow("show", {
        window_class: "update_window",
        close_class: "js_direction_window_close",
        title: "Внимание!",
        content: $(".window_message").html(),
        shadow: 1,
        enable_button: 1,
        button_title: "OK",
        button_class: "js_window_close js_direction_window_close",
      });

      return false;
    }
  });

  $(document).on("click", ".js_direction_window_close", function () {
    $(".ajax_post_bids").submit();
  });

  var res_timer = "";
  function start_res_timer() {
    $(".res_timer").html("0");
    clearInterval(res_timer);

    res_timer = setInterval(function () {
      if ($(".res_timer").length > 0) {
        var num_t = parseInt($(".res_timer").html());
        num_t = num_t + 1;
        $(".res_timer").html(num_t);
      }
    }, 1000);
  }

  $(".ajax_post_bids").ajaxForm({
    dataType: "json",
    beforeSubmit: function (a, f, o) {
      f.addClass("thisactive");
      $(".thisactive input[type=submit], .thisactive input[type=button]").attr(
        "disabled",
        true
      );
      $(".ajax_post_bids_res").html(
        '<div class="resulttrue">Идет обработка. Пожалуйста подождите (<span class="res_timer">0</span>)</div>'
      );

      start_res_timer();

      $(".ajax_post_bids_res").find(".js_wrap_error").removeClass("error");
    },
    error: function (res, res2, res3) {
      $(".ajax_post_bids_res").html(
        '<div class="resultfalse">Ошибка скрипта</div>'
      );
      for (key in res) {
        console.log(key + " = " + res[key]);
      }
    },
    success: function (res) {
      if (res["error_fields"]) {
        $.each(res["error_fields"], function (index, value) {
          add_error_field(index, value);
        });
      }
      if (res["status"] && res["status"] == "error") {
        $(".ajax_post_bids_res").html(
          '<div class="resultfalse"><div class="resultclose"></div>' +
            res["status_text"] +
            "</div>"
        );
        if ($(".js_wrap_error.error").length > 0) {
          var ftop = $(".js_wrap_error.error:first").offset().top - 100;
          $("body,html").animate({ scrollTop: ftop }, 500);
        }
      }
      if (res["status"] && res["status"] == "success") {
        $(".ajax_post_bids_res").html(
          '<div class="resulttrue"><div class="resultclose"></div>' +
            res["status_text"] +
            ' (<span class="res_timer">0</span>)</div>'
        );
        start_res_timer();
      }

      if (res["url"]) {
        window.location.href = res["url"];
      }

      $(".thisactive input[type=submit], .thisactive input[type=button]").attr(
        "disabled",
        false
      );
      $(".thisactive").removeClass("thisactive");
    },
  });

  function add_error_field(id, text) {
    $(".js_" + id)
      .parents(".js_wrap_error")
      .addClass("error");
    if (text.length > 0) {
      $(".js_" + id + "_error")
        .html(text)
        .show();
    }
  }
  function remove_error_field(id) {
    $(".js_" + id)
      .parents(".js_wrap_error")
      .removeClass("error");
  }

  function calc_set_value(the_obj, the_num) {
    $(the_obj).val(the_num);
  }

  function calc_set_html(the_obj, the_num) {
    $(the_obj).html(the_num);
  }

  function go_calc(obj, dej) {
    var sum = obj.val().replace(/,/g, ".");
    var id = $(".js_direction_id:first").val();
    var param =
      "id=" + id + "&sum=" + sum + "&dej=" + dej + "&city=" + get_city();

    $(".exch_ajax_wrap_abs, .js_exchange_widget_abs, .js_loader").show();

    if (dej == 1) {
      calc_set_value("input.js_sum1:not(:focus)", sum);
      calc_set_html(".js_sum1_html", sum);
    } else if (dej == 2) {
      calc_set_value("input.js_sum2:not(:focus)", sum);
      calc_set_html(".js_sum2_html", sum);
    } else if (dej == 3) {
      calc_set_value("input.js_sum1c:not(:focus)", sum);
      calc_set_html(".js_sum1c_html", sum);
    } else if (dej == 4) {
      calc_set_value("input.js_sum2c:not(:focus)", sum);
      calc_set_html(".js_sum2c_html", sum);
    }

    remove_error_field("sum1");
    remove_error_field("sum2");
    remove_error_field("sum1c");
    remove_error_field("sum2c");

    $.ajax({
      type: "POST",
      url: "https://bisson.exchange/premium_action-exchange_calculator.html?meth=post&yid=ced212d92786&ynd=0&lang=ru",
      data: param,
      dataType: "json",
      error: function (res, res2, res3) {
        for (key in res) {
          console.log(key + " = " + res[key]);
        }
      },
      success: function (res) {
        var changed = res["changed"];

        if (dej !== 1 || changed == 1) {
          calc_set_value("input.js_sum1", res["sum1"]);
        }
        if (dej !== 2 || changed == 1) {
          calc_set_value("input.js_sum2", res["sum2"]);
        }
        if (dej !== 3 || changed == 1) {
          calc_set_value("input.js_sum1c", res["sum1c"]);
        }
        if (dej !== 4 || changed == 1) {
          calc_set_value("input.js_sum2c", res["sum2c"]);
        }

        calc_set_html(".js_sum1_html", res["sum1"]);
        calc_set_html(".js_sum2_html", res["sum2"]);
        calc_set_html(".js_sum1c_html", res["sum1c"]);
        calc_set_html(".js_sum2c_html", res["sum2c"]);

        $(".js_comis_text1").html(res["comis_text1"]);
        $(".js_comis_text2").html(res["comis_text2"]);

        if (res["error_fields"]) {
          $.each(res["error_fields"], function (index, value) {
            add_error_field(index, value);
          });
        }

        if (res["curs_html"] && res["curs_html"].length > 0) {
          $(".js_curs_html").html(res["curs_html"]);
          $("input.js_curs_html").val(res["curs_html"]);
        }
        if (res["reserv_html"] && res["reserv_html"].length > 0) {
          $(".js_reserv_html").html(res["reserv_html"]);
          $("input.js_reserv_html").val(res["reserv_html"]);
        }
        if (res["user_discount"] && res["user_discount"].length > 0) {
          $(".js_direction_user_discount").html(res["user_discount"]);
          $("input.js_direction_user_discount").html(res["user_discount"]);
        }
        if (res["viv_com1"] && res["viv_com1"] == 1) {
          $(".js_viv_com1").show();
        } else {
          $(".js_viv_com1").hide();
        }
        if (res["viv_com2"] && res["viv_com2"] == 1) {
          $(".js_viv_com2").show();
        } else {
          $(".js_viv_com2").hide();
        }

        if (res["curs_give_html"] && res["curs_give_html"].length > 0) {
          $(".js_curs_give_html").html(res["curs_give_html"]);
          $("input.js_curs_give_html").val(res["curs_give_html"]);
        }
        if (res["curs_get_html"] && res["curs_get_html"].length > 0) {
          $(".js_curs_get_html").html(res["curs_get_html"]);
          $("input.js_curs_get_html").val(res["curs_get_html"]);
        }
        if ($(".verifybysum").length > 0) {
          if (res["sum1"]) {
            var verifybysum = $(".verifybysum").val().replace(/,/g, ".");
            verifybysum = verifybysum * 1;
            var res_sum1 = res["sum1"] * 1;
            if (res_sum1 >= verifybysum) {
              $(".verifybysum_wrap").show();
              add_error_field("sum1", "пройдите верификацию личности");
              add_error_field("sum2", "пройдите верификацию личности");
              add_error_field("sum1c", "пройдите верификацию личности");
              add_error_field("sum2c", "пройдите верификацию личности");
            } else {
              $(".verifybysum_wrap").hide();
            }
          }
        }

        $(".exch_ajax_wrap_abs, .js_exchange_widget_abs, .js_loader").hide();
      },
    });
  }

  $(document).ChangeInput({
    trigger: ".js_sum1",
    changetime: "1600",
    success: function (obj) {
      go_calc(obj, 1);
    },
  });

  $(document).ChangeInput({
    trigger: ".js_sum2",
    changetime: "1600",
    success: function (obj) {
      go_calc(obj, 2);
    },
  });

  $(document).ChangeInput({
    trigger: ".js_sum1c",
    changetime: "1600",
    success: function (obj) {
      go_calc(obj, 3);
    },
  });

  $(document).ChangeInput({
    trigger: ".js_sum2c",
    changetime: "1600",
    success: function (obj) {
      go_calc(obj, 4);
    },
  });

  function set_input_decimal(obj) {
    var dec = obj.attr("data-decimal");
    var sum = obj.val().replace(new RegExp(",", "g"), ".");
    var len_arr = sum.split(".");
    var len_data = len_arr[1];
    if (len_data !== undefined) {
      var len = len_data.length;
      if (len > dec) {
        var new_data = len_data.substr(0, dec);
        obj.val(len_arr[0] + "." + new_data);
      }
    }
  }

  $(document).on("change", ".js_decimal", function () {
    set_input_decimal($(this));
  });

  $(document).on("keyup", ".js_decimal", function () {
    set_input_decimal($(this));
  });

  function get_city() {
    var city = 0;
    if ($(".js_change_city").length > 0) {
      city = $(".js_change_city").val();
    }
    return city;
  }

  $(document).on("change", ".js_change_city", function () {
    var new_value = $(this).val();
    $(".js_change_city").val(new_value);
    go_calc($(".js_sum1"), 1);
  });
});
jQuery(function ($) {
  $(".widget_reserv_filter").on("click", function () {
    $(".widget_reserv_filter").removeClass("current");
    $(this).addClass("current");
    var id = $(this).attr("data-id");
    $(".widget_reserv_vt").hide();
    $(".widget_reserv_vt_" + id).show();

    return false;
  });
});

jQuery(function ($) {
  $("#last_events_option").on("change", function () {
    if ($(this).prop("checked")) {
      var hidecourselogs = 1;
      $(".last_events").hide();
    } else {
      var hidecourselogs = 0;
      $(".last_events").show();
    }
    Cookies.set("hidecourselogs", hidecourselogs, { expires: 7, path: "/" });
  });

  $(document).on("click", ".levents_close", function () {
    $(this).parents(".levents").hide();
  });
});
