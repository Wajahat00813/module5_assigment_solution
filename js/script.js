$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl = "https://github.com/Wajahat00813/module5_assigment_solution/blob/main/JSON/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load
document.addEventListener("DOMContentLoaded", function (event) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true);
});

function buildAndShowHomeHTML (categories) {
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {
      var chosenCategoryShortName = chooseRandomCategory(categories).short_name;
      
      var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", "'" + chosenCategoryShortName + "'");
      
      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
    },
    false);
}

function chooseRandomCategory (categories) {
  var randomArrayIndex = Math.floor(Math.random() * categories.length);
  return categories[randomArrayIndex];
}

function buildAndShowCategoriesHTML(categories) {
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          switchMenuToActive();
          var finalHtml = categoriesTitleHtml + "<section class='row'>";
          categories.forEach(function(category) {
            var html = insertProperty(categoryHtml, "name", category.name);
            html = insertProperty(html, "short_name", category.short_name);
            finalHtml += html;
          });
          finalHtml += "</section>";
          insertHtml("#main-content", finalHtml);
        },
        false);
    },
    false);
}

dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

function buildAndShowMenuItemsHTML(categoryMenuItems) {
  if (!categoryMenuItems.menu_items || categoryMenuItems.menu_items.length === 0) {
    insertHtml("#main-content", ""); // Clears the content
    return;
  }

  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          switchMenuToActive();
          var finalHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
          finalHtml += "<section class='row'>";

          categoryMenuItems.menu_items.forEach(function (menuItem) {
            var html = menuItemHtml;

            html = insertProperty(html, "short_name", menuItem.short_name || "");
            html = insertProperty(html, "name", menuItem.name || "No Name");
            html = insertProperty(html, "description", menuItem.description || "No description available");

            // Conditionally include price and portion size spans
            var priceSmallHtml = menuItem.price_small ? `<span>${menuItem.price_small.toFixed(2)}</span>` : "";
            var portionSmallHtml = menuItem.small_portion_name ? `<span>${menuItem.small_portion_name}</span>` : "";

            var priceLargeHtml = menuItem.price_large ? `<span>${menuItem.price_large.toFixed(2)}</span>` : "";
            var portionLargeHtml = menuItem.large_portion_name ? `<span>${menuItem.large_portion_name}</span>` : "";

            // Insert processed values into HTML
            html = insertProperty(html, "price_small", priceSmallHtml);
            html = insertProperty(html, "small_portion_name", portionSmallHtml);
            html = insertProperty(html, "price_large", priceLargeHtml);
            html = insertProperty(html, "large_portion_name", portionLargeHtml);

            finalHtml += html;
          });

          finalHtml += "</section>";
          insertHtml("#main-content", finalHtml);
        },
        false
      );
    },
    false
  );
}



dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};

global.$dc = dc;

})(window);
