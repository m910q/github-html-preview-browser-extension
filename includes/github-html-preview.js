'use strict';
(function() {

	var ELEMENT_NODE = 1;
	var TEXT_NODE = 3;
   var observer = null;

	function endsWith(str, endOfString) {
		return str.indexOf(endOfString, str.length - endOfString.length) !== -1;
	}

	function isValidFileExtensionPage(fileExtension) {
		// Check current URL
		if (!endsWith(window.location.href.toLowerCase(), fileExtension))
		   return false;
		
		// Check if current file in breadcrumbs is an HTML file
		var finalPathEle = document.querySelector('.final-path');
		if(finalPathEle === null)
			return false;

		if (!endsWith(finalPathEle.textContent.trim().toLowerCase(), fileExtension))
		   return false;

	   // Check if breadcrumbs continues
	   var nextSiblingEle = finalPathEle.nextSibling;
	   if (nextSiblingEle === null || nextSiblingEle.nodeType === TEXT_NODE)
		  return true;
	   
	   return false;
	}

	function addButton() {
	   var buttonGroupEle = document.querySelector('.file-header .BtnGroup');
	   if (buttonGroupEle === null)
		  return;

		var htmlPreviewButtonEle = document.createElement('a');
		htmlPreviewButtonEle.textContent = 'HTML preview';
		htmlPreviewButtonEle.className = 'btn btn-sm BtnGroup-item';
		htmlPreviewButtonEle.target = '_blank';
		htmlPreviewButtonEle.href = 'https://htmlpreview.github.io/?' + window.location.href;
		buttonGroupEle.insertBefore(htmlPreviewButtonEle, buttonGroupEle[0]);
      if (observer !== null)
         observer.takeRecords();
	}

	function onNodeInserted(e) {
		if (e.target.nodeType === ELEMENT_NODE && e.target.className === 'file')
			checkFilebox();
	}

	function checkFilebox() {
		if (isValidFileExtensionPage('.html'))
			addButton();
	}

	function initialize() {
		var itemScope = document.querySelector('div[itemscope]');
		if (itemScope !== null) {
         observer = new MutationObserver(function() { checkFilebox(); });
         observer.observe(itemScope, { childList: true, subtree: true });
      }

		checkFilebox();
	}
	
	initialize();
})();