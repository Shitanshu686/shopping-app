(function () {
    const API_BASE = "http://localhost:8080/api/search-history";
    const STORAGE_KEY = "shopease_search_history";

    function getActiveUserId() {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                if (parsed && (parsed.id || parsed.userId)) return parsed.id || parsed.userId;
            }
        } catch (e) {}
        return null;
    }

    function getAuthHeaders() {
        const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }

    let searchInput = null;
    let historyDropdown = null;
    let searchDebounceTimer = null;

    function initSearchHistory() {
        searchInput = document.getElementById("searchBox");
        if (!searchInput) return;

        const parentBox = searchInput.closest(".search-box") || searchInput.parentElement;
        
        let existing = document.getElementById("searchHistoryDropdown");
        if (existing) existing.remove();

        historyDropdown = document.createElement("div");
        historyDropdown.className = "search-history-dropdown";
        historyDropdown.id = "searchHistoryDropdown";
        parentBox.appendChild(historyDropdown);

        // Click / Focus opens history if search box is empty
        searchInput.addEventListener("focus", () => {
            if (!searchInput.value.trim()) showHistory();
        });

        searchInput.addEventListener("click", () => {
            if (!searchInput.value.trim()) showHistory();
        });

        // Typing logic: hide history so suggestion box gets space
        searchInput.addEventListener("input", function () {
            const val = this.value.trim();
            if (val.length > 0) {
                hideHistory();
                // User ne type karke 1 sec ruka to record kar lo
                clearTimeout(searchDebounceTimer);
                if (val.length >= 2) {
                    searchDebounceTimer = setTimeout(() => {
                        saveSearch(val);
                    }, 1000);
                }
            } else {
                showHistory();
            }
        });

        // On Enter: instant save
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const val = this.value.trim();
                if (val.length >= 2) {
                    saveSearch(val);
                    hideHistory();
                }
            }
        });

        // Suggestion clicks capture
        document.addEventListener("click", function (e) {
            const item = e.target.closest(".suggestion-item, .search-suggestion-item");
            if (item) {
                const text = item.textContent.trim();
                if (text) saveSearch(text);
            }
            if (!parentBox.contains(e.target)) {
                hideHistory();
            }
        });
    }

    function hideHistory() {
        if (historyDropdown) historyDropdown.style.display = "none";
    }

    async function showHistory() {
        const items = await fetchHistory();
        renderDropdown(items);
    }

    async function fetchHistory() {
        const userId = getActiveUserId();

        // 1. Try backend if logged in
        if (userId) {
            try {
                const res = await fetch(`${API_BASE}?userId=${userId}`, { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        return data.slice(0, 4);
                    }
                }
            } catch (e) {}
        }

        // 2. Fallback / Guest: LocalStorage sliding window of 4
        try {
            const local = localStorage.getItem(STORAGE_KEY);
            return local ? JSON.parse(local).slice(0, 4) : [];
        } catch (e) {
            return [];
        }
    }

    function renderDropdown(items) {
        if (!historyDropdown) return;

        if (!items || items.length === 0) {
            historyDropdown.innerHTML = `
                <div class="search-history-header">
                    <span>Recent Searches</span>
                </div>
                <div class="search-history-empty">No recent searches</div>
            `;
            historyDropdown.style.display = "block";
            return;
        }

        let listHtml = items.map(query => `
            <li class="search-history-item" data-query="${escapeHtml(query)}">
                <span class="search-history-icon">🕒</span>
                <span class="search-history-text">${escapeHtml(query)}</span>
            </li>
        `).join("");

        historyDropdown.innerHTML = `
            <div class="search-history-header">
                <span>Recent Searches</span>
                <button type="button" class="search-history-clear-btn" id="clearHistoryBtn">Clear</button>
            </div>
            <ul class="search-history-list">
                ${listHtml}
            </ul>
        `;

        historyDropdown.style.display = "block";

        // Click on history item
        historyDropdown.querySelectorAll(".search-history-item").forEach(item => {
            item.addEventListener("mousedown", function (e) {
                e.preventDefault();
                const q = this.getAttribute("data-query");
                searchInput.value = q;
                hideHistory();

                if (typeof window.searchProduct === "function") {
                    window.searchProduct(q);
                } else {
                    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
                }
            });
        });

        // Clear button
        const clearBtn = historyDropdown.querySelector("#clearHistoryBtn");
        if (clearBtn) {
            clearBtn.addEventListener("mousedown", async function (e) {
                e.preventDefault();
                await clearHistory();
            });
        }
    }

    async function saveSearch(query) {
        if (!query || query.trim().length === 0) return;
        const cleanQuery = query.trim();

        // 1. LocalStorage update (sliding window of max 4)
        try {
            let history = [];
            const local = localStorage.getItem(STORAGE_KEY);
            if (local) history = JSON.parse(local);

            // remove duplicate, put at top, slice 4
            history = history.filter(item => item.toLowerCase() !== cleanQuery.toLowerCase());
            history.unshift(cleanQuery);
            if (history.length > 4) history = history.slice(0, 4);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {}

        // 2. Backend update if logged in
        const userId = getActiveUserId();
        if (userId) {
            try {
                await fetch(`${API_BASE}?userId=${userId}&query=${encodeURIComponent(cleanQuery)}`, {
                    method: "POST",
                    headers: getAuthHeaders()
                });
            } catch (e) {}
        }
    }

    async function clearHistory() {
        localStorage.removeItem(STORAGE_KEY);
        const userId = getActiveUserId();
        if (userId) {
            try {
                await fetch(`${API_BASE}?userId=${userId}`, {
                    method: "DELETE",
                    headers: getAuthHeaders()
                });
            } catch (e) {}
        }
        renderDropdown([]);
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    window.saveSearchQuery = saveSearch;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSearchHistory);
    } else {
        initSearchHistory();
    }
})();
