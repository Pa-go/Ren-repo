// Basic UI scripts for sidebar, language menu and login handling
document.addEventListener('DOMContentLoaded', function () {
	const sidebar = document.getElementById('mySidebar');
	const main = document.getElementById('mainContent');
	const menuIcon = document.querySelector('.menu-icon');
	const langIcon = document.getElementById('languageIcon');
	const langMenu = document.getElementById('langMenu');

	// Ensure sidebar starts hidden (matches the CSS left:-220px)
	if (sidebar) sidebar.style.left = sidebar.style.left || '-220px';

	// Toggle sidebar open/close
	window.toggleSidebar = function () {
		if (!sidebar || !main) return;
		const left = window.getComputedStyle(sidebar).left;
		if (left === '0px') {
			sidebar.style.left = '-220px';
			main.style.marginLeft = '0';
		} else {
			sidebar.style.left = '0px';
			main.style.marginLeft = '220px';
		}
	};

	// Language menu toggle
	if (langIcon && langMenu) {
		langIcon.addEventListener('click', function (e) {
			e.stopPropagation();
			langMenu.style.display = (langMenu.style.display === 'block') ? 'none' : 'block';
		});

		// Close language menu when clicking outside
		document.addEventListener('click', function () {
			if (langMenu.style.display === 'block') langMenu.style.display = 'none';
		});
	}

	// Simple select language handler used by inline onclicks in the HTML
	window.selectLang = function (code) {
		try {
			// store selection (optional) and update UI if needed
			localStorage.setItem('renture_lang', code);
		} catch (e) {
			// ignore storage errors
		}
		if (langMenu) langMenu.style.display = 'none';
		alert('Language switched to: ' + code);
	};

	// Login handler (can be replaced with a proper flow)
	window.loginUser = function () {
		// If you have a login page, redirect to it. Otherwise show a message.
		const loginPage = 'log_reg.html';
		// If login page exists on the server this will navigate; otherwise show a message
		window.location.href = loginPage;
	};

	// Make sidebar close when clicking outside (but ignore clicks on the menu icon)
	document.addEventListener('click', function (e) {
		if (!sidebar) return;
		const left = window.getComputedStyle(sidebar).left;
		const clickedInside = sidebar.contains(e.target) || (menuIcon && menuIcon.contains(e.target));
		if (!clickedInside && left === '0px') {
			sidebar.style.left = '-220px';
			if (main) main.style.marginLeft = '0';
		}
	});

	// Make nav links point to real pages where reasonable
	const navHome = document.getElementById('navHome');
	if (navHome) navHome.setAttribute('href', 'index.html');
	// Other nav items can be updated similarly if those pages exist

	// Attempt to autoplay the top video and show fallback if it fails
	const topVideo = document.getElementById('topVideo');
	const videoFallback = document.getElementById('videoFallback');
	if (topVideo) {
		// try to play (some browsers block autoplay unless muted)
		topVideo.play().catch(() => {
			// show fallback overlay if play is rejected
			if (videoFallback) videoFallback.style.display = 'flex';
		});
		// if the video errors while loading, show fallback
		topVideo.addEventListener('error', function () {
			if (videoFallback) videoFallback.style.display = 'flex';
		});
	}

	// Search functionality for the listings
	const searchInput = document.getElementById('searchInput');
	const listingsContainer = document.getElementById('listingsContainer');

	function createNoResultsMessage() {
		let el = document.getElementById('noResultsMessage');
		if (!el) {
			el = document.createElement('p');
			el.id = 'noResultsMessage';
			el.style.color = '#001F3F';
			el.style.fontSize = '18px';
			el.style.marginTop = '20px';
			el.textContent = 'No results found.';
			if (listingsContainer && listingsContainer.parentNode) listingsContainer.parentNode.appendChild(el);
		}
		return el;
	}

	function removeNoResultsMessage() {
		const el = document.getElementById('noResultsMessage');
		if (el && el.parentNode) el.parentNode.removeChild(el);
	}

	function filterListings(query) {
		if (!listingsContainer) return;
		const cards = Array.from(listingsContainer.querySelectorAll('.card'));
		const q = (query || '').trim().toLowerCase();
		let visible = 0;
		cards.forEach(card => {
			const nameEl = card.querySelector('.car-name');
			const name = nameEl ? nameEl.textContent.trim().toLowerCase() : '';
			const priceEl = card.querySelector('.price');
			const price = priceEl ? priceEl.textContent.trim().toLowerCase() : '';
			if (!q || name.includes(q) || price.includes(q)) {
				card.style.display = '';
				visible++;
			} else {
				card.style.display = 'none';
			}
		});
		if (visible === 0) {
			createNoResultsMessage();
		} else {
			removeNoResultsMessage();
		}
	}

	if (searchInput) {
		searchInput.addEventListener('input', function (e) {
			filterListings(e.target.value);
		});
		// Optional: handle Enter key to keep focus or perform a final filter
		searchInput.addEventListener('keydown', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				filterListings(e.target.value);
			}
		});
	}
});
