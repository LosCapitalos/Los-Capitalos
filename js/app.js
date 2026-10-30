
/* =====================================
   LOS CAPITALOS - MAIN APPLICATION
===================================== */

if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
}

const STORAGE_KEY = "losCapitalos_player_v1";

const defaultPlayer = {
    balance: 100,
    totalEarnings: 100,
    level: 1,
    xp: 0,
    prestige: 0,
    referrals: 0,

    activeCareerId: null,
    lastAccrualAt: null,
    pendingOffline: 0
};

function loadPlayer() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            return {
                ...defaultPlayer,
                ...JSON.parse(saved)
            };
        }
    } catch (error) {
        console.error("Player data could not be loaded:", error);
    }

    return { ...defaultPlayer };
}

let player = loadPlayer();

function savePlayer() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(player)
        );
    } catch (error) {
        console.error("Player data could not be saved:", error);
    }
}

function formatMoney(amount) {
    const value = Number(amount) || 0;

    const units = [
        { limit: 1e18, suffix: "Qi" },
        { limit: 1e15, suffix: "Qa" },
        { limit: 1e12, suffix: "T" },
        { limit: 1e9, suffix: "B" },
        { limit: 1e6, suffix: "M" },
        { limit: 1e3, suffix: "K" }
    ];

    for (const unit of units) {
        if (value >= unit.limit) {
            let result = value / unit.limit;

            if (result >= 999.95) continue;

            return "$" + result.toLocaleString("en-US", {
                maximumFractionDigits: 2
            }) + unit.suffix;
        }
    }

    return "$" + Math.floor(value).toLocaleString("en-US");
}

window.formatMoney = formatMoney;

function updatePlayerInterface() {
    const balance = document.getElementById("player-balance");
    const earnings = document.getElementById("total-earnings");
    const profileEarnings = document.getElementById("profile-earnings");
    const shopBalance = document.getElementById("shop-balance");

    const headerLevel = document.getElementById("header-level");
    const profileLevel = document.getElementById("profile-level");

    const prestige = document.getElementById("prestige-points");
    const profilePrestige = document.getElementById("profile-prestige");
    const referrals = document.getElementById("profile-referrals");

    const xpProgress = document.getElementById("xp-progress");
    const xpText = document.getElementById("xp-text");

    if (balance) balance.textContent = formatMoney(player.balance);
    if (earnings) earnings.textContent = formatMoney(player.totalEarnings);

    if (profileEarnings) {
        profileEarnings.textContent = formatMoney(player.totalEarnings);
    }

    if (shopBalance) {
        shopBalance.textContent = formatMoney(player.balance);
    }

    if (headerLevel) headerLevel.textContent = player.level;
    if (profileLevel) profileLevel.textContent = player.level;

    if (prestige) prestige.textContent = player.prestige;
    if (profilePrestige) profilePrestige.textContent = player.prestige;

    if (referrals) referrals.textContent = player.referrals;

    if (xpProgress) {
        xpProgress.style.width = Math.min(player.xp, 100) + "%";
    }

    if (xpText) {
        xpText.textContent = `${player.xp} / 100 XP`;
    }
}

function addXP(amount) {
    player.xp += amount;

    while (player.xp >= 100) {
        player.xp -= 100;
        player.level++;
    }

    updatePlayerInterface();
    savePlayer();
}

function addEarnings(amount) {
    amount = Number(amount) || 0;

    if (amount <= 0) return;

    player.balance += amount;
    player.totalEarnings += amount;

    updatePlayerInterface();
    savePlayer();
}

// OTHER MODULES CAN USE THESE FUNCTIONS
window.LosCapitalos = {
    getPlayer: () => player,
    savePlayer,
    updatePlayerInterface,
    addXP,
    addEarnings,
    formatMoney
};

// EARN BUTTON
const earnButton = document.getElementById("earn-button");

if (earnButton) {
    earnButton.addEventListener("click", () => {

        const business = window.LosCapitalosBusiness;

        const amount = business
            ? business.getClickIncome()
            : 1;

        addEarnings(amount);
        addXP(1);
    });
}

// PAGE NAVIGATION
function openPage(pageId) {
    const targetPage = document.getElementById(pageId);

    if (!targetPage || !targetPage.classList.contains("page")) {
        return;
    }

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    targetPage.classList.add("active");

    document.querySelectorAll(".nav-button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
        openPage(button.dataset.page);
    });
});

// SHOP RETURN BUTTON
const shopHeader = document.querySelector("#shop .page-header");

if (shopHeader) {
    const backButton = document.createElement("button");

    backButton.textContent = "← BACK";
    backButton.className = "career-button";
    backButton.style.width = "fit-content";
    backButton.style.marginBottom = "12px";

    backButton.addEventListener("click", () => {
        openPage("home");
    });

    shopHeader.prepend(backButton);
}

// TASKS PANEL
const tasksButton = document.getElementById("tasks-toggle");
const tasksPanel = document.getElementById("tasks-panel");

if (tasksButton && tasksPanel) {
    tasksPanel.hidden = true;

    tasksButton.addEventListener("click", () => {
        const isOpen = !tasksPanel.hidden;

        tasksPanel.hidden = isOpen;

        tasksButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );
    });
}

// SHOP CATEGORY SELECTION
const shopCategories = document.querySelectorAll(".shop-category");

shopCategories.forEach(button => {
    button.addEventListener("click", () => {
        shopCategories.forEach(category => {
            category.classList.remove("active");
        });

        button.classList.add("active");
    });
});

// INITIALIZE
updatePlayerInterface();
savePlayer();

console.log("Los Capitalos initialized successfully.");
